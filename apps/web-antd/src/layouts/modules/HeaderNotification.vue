<script lang="ts" setup>
import type {
  HeaderNotificationItem,
  HeaderNotificationType,
} from './headerNotification';

import type { PublicNoticeEntity } from '#/api/notice/publicNotice';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import { useRouter } from 'vue-router';

import { Bell } from '@vben/icons';

import {
  Badge,
  List,
  Modal,
  notification,
  Popover,
  Spin,
  Tabs,
  Tag,
} from 'ant-design-vue';

import {
  doUserReadNoticeDetail,
  getUserPublicNoticePage,
} from '#/api/notice/publicNotice';
import { doFindUserNeedList, doStatsUserOa, OAIndex } from '#/api/oa/activiti';
import { doConfigDetail } from '#/api/sys/config';
import { SystemEnum } from '#/enums';
import { ResultEnum, SocketOutEvent } from '#/enums/SocketEnum';
import rootSocketEmitter from '#/hooks/socket/rootSocketEmitter';

import {
  getPageTotal,
  mapNoticeItems,
  mapTodoItems,
  resolveNoticeDetailUrl,
} from './headerNotification';

type TabKey = HeaderNotificationType;

const router = useRouter();
const activeKey = ref<TabKey>('notice');
const loading = ref(false);
const detailLoading = ref(false);
const detailOpen = ref(false);
const detail = ref<PublicNoticeEntity>();
const detailBasePath = ref('');
const detailUrl = computed(() =>
  resolveNoticeDetailUrl(detail.value?.content, detailBasePath.value),
);

const pageParams = reactive({
  pageNumber: 1,
  pageSize: 5,
  sort: {
    field: 'createTime',
    order: 'descend',
  },
});

const state = reactive({
  messageItems: [
    {
      color: 'default',
      date: '',
      description: '消息模块开发中',
      extra: '开发中',
      id: 'message-dev',
      isRead: true,
      title: '暂无消息',
      type: 'message',
    },
  ] as HeaderNotificationItem[],
  noticeItems: [] as HeaderNotificationItem[],
  noticeTotal: 0,
  todoItems: [] as HeaderNotificationItem[],
  todoTotal: 0,
});

const tabItems = computed(() => [
  {
    count: state.noticeTotal,
    key: 'notice',
    label: '公告',
  },
  {
    count: 0,
    key: 'message',
    label: '消息',
  },
  {
    count: state.todoTotal,
    key: 'todo',
    label: '代办',
  },
]);

const currentItems = computed(() => {
  if (activeKey.value === 'todo') return state.todoItems;
  if (activeKey.value === 'message') return state.messageItems;
  return state.noticeItems;
});

const unreadCount = computed(
  () =>
    state.noticeItems.filter((item) => !item.isRead).length +
    state.todoItems.length,
);

async function loadNotice() {
  const result = await getUserPublicNoticePage({ ...pageParams });
  state.noticeItems = mapNoticeItems(result);
  state.noticeTotal = getPageTotal(result);
}

async function loadTodo() {
  const result = await doFindUserNeedList({
    pageNumber: pageParams.pageNumber,
    pageSize: pageParams.pageSize,
  });
  state.todoItems = mapTodoItems(result);
  state.todoTotal = getPageTotal(result);
}

async function refreshActive() {
  loading.value = true;
  try {
    if (activeKey.value === 'notice') {
      await loadNotice();
      return;
    }
    if (activeKey.value === 'todo') {
      await loadTodo();
    }
  } finally {
    loading.value = false;
  }
}

async function refreshCounts() {
  await Promise.allSettled([
    loadNotice(),
    doStatsUserOa().then((stats) => {
      state.todoTotal = Number(stats.userNeedCount ?? 0);
    }),
  ]);
}

function onTabChange(key: string) {
  activeKey.value = key as TabKey;
}

function onPageChange(page: number) {
  pageParams.pageNumber = page;
  refreshActive();
}

async function openNotice(item: HeaderNotificationItem) {
  detailLoading.value = true;
  detailOpen.value = true;
  try {
    const [noticeDetail, config] = await Promise.all([
      doUserReadNoticeDetail({ id: item.id }),
      doConfigDetail({ k: SystemEnum.SYSTEM_PATH }),
    ]);
    detail.value = noticeDetail;
    detailBasePath.value = config?.v ?? '';
    await loadNotice();
  } finally {
    detailLoading.value = false;
  }
}

function openTodo(item: HeaderNotificationItem) {
  const row = item.raw as ActivitiUserNeedEntity | undefined;
  const key = row?.processDefinitionId?.split(':')?.[0];
  const path = key ? OAIndex[key as keyof typeof OAIndex] : undefined;
  if (path && row?.businessKey) {
    router.push(`${path}${row.businessKey}:2:${row.taskId ?? ''}`);
    return;
  }
  router.push('/work/oa');
}

function onItemClick(item: HeaderNotificationItem) {
  if (item.type === 'notice') {
    openNotice(item);
    return;
  }
  if (item.type === 'todo') {
    openTodo(item);
  }
}

function onSocketNotice(payload: unknown) {
  const { code, data, message } = (payload ?? {}) as any;
  if (code !== ResultEnum.SUCCESS) {
    notification.error({
      description: message || '获取消息错误',
      message: '平台通知',
    });
    return;
  }

  if (data?.outType === 1) {
    notification.info({
      description: data.message,
      duration: 5,
      message: '平台通知公告',
    });
    refreshCounts();
    if (activeKey.value === 'notice') {
      refreshActive();
    }
  }
}

watch(activeKey, () => {
  pageParams.pageNumber = 1;
  refreshActive();
});

onMounted(() => {
  refreshCounts();
  rootSocketEmitter.on(SocketOutEvent.PUBLIC_MEMBER_EVENT, onSocketNotice);
});

onBeforeUnmount(() => {
  rootSocketEmitter.off(SocketOutEvent.PUBLIC_MEMBER_EVENT, onSocketNotice);
});
</script>

<template>
  <Popover
    overlay-class-name="header-business-notification__overlay"
    placement="bottomRight"
    trigger="click"
  >
    <template #content>
      <div class="w-[340px]">
        <Tabs
          :active-key="activeKey"
          size="small"
          @change="(key) => onTabChange(String(key))"
        >
          <Tabs.TabPane
            v-for="item in tabItems"
            :key="item.key"
            :tab="`${item.label}${item.count ? `(${item.count})` : ''}`"
          />
        </Tabs>

        <Spin :spinning="loading">
          <List
            :data-source="currentItems"
            :pagination="
              activeKey === 'message'
                ? false
                : {
                    current: pageParams.pageNumber,
                    pageSize: pageParams.pageSize,
                    size: 'small',
                    total:
                      activeKey === 'notice'
                        ? state.noticeTotal
                        : state.todoTotal,
                    onChange: onPageChange,
                  }
            "
            class="header-business-notification__list"
            size="small"
          >
            <template #renderItem="{ item }">
              <List.Item class="cursor-pointer px-0" @click="onItemClick(item)">
                <List.Item.Meta>
                  <template #title>
                    <div class="flex min-w-0 items-start justify-between gap-2">
                      <span
                        :class="{ 'line-through opacity-60': item.isRead }"
                        class="line-clamp-1 text-sm"
                      >
                        {{ item.title }}
                      </span>
                      <Tag
                        v-if="item.extra"
                        :color="item.color"
                        class="m-0 shrink-0"
                      >
                        {{ item.extra }}
                      </Tag>
                    </div>
                  </template>
                  <template #description>
                    <div class="space-y-1">
                      <div
                        v-if="item.description"
                        class="line-clamp-2 text-xs text-muted-foreground"
                      >
                        {{ item.description }}
                      </div>
                      <div class="text-xs text-muted-foreground">
                        {{ item.date }}
                      </div>
                    </div>
                  </template>
                </List.Item.Meta>
              </List.Item>
            </template>
          </List>
        </Spin>
      </div>
    </template>

    <button
      aria-label="通知"
      class="relative mr-2 flex h-full items-center justify-center px-2 text-foreground transition-colors hover:text-primary"
      type="button"
    >
      <Badge :count="unreadCount" :dot="unreadCount > 0" :offset="[0, 2]">
        <Bell class="size-4" />
      </Badge>
    </button>
  </Popover>

  <Modal
    v-model:open="detailOpen"
    :footer="null"
    :title="detail?.title"
    width="78%"
  >
    <Spin :spinning="detailLoading">
      <iframe
        :src="detailUrl"
        allow="clipboard-write; clipboard-read"
        class="h-[70vh] min-h-[320px] w-full rounded-md border border-border bg-background"
      ></iframe>
    </Spin>
  </Modal>
</template>

<style scoped>
:global(.header-business-notification__overlay) {
  max-width: 380px;
}

.header-business-notification__list {
  min-height: 230px;
}
</style>
