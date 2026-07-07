<script lang="ts" setup>
import type { Key } from 'ant-design-vue/es/_util/type';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AnalysisChartCard, Page, WorkbenchHeader } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenIcon,
} from '@vben-core/shadcn-ui';

import { Modal, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doClaim,
  doDeleteProcessInstance,
  doFindUserAlreadyList,
  doFindUserLaunchList,
  doFindUserNeedList,
  doStatsUserOa,
  doSuspendedInstance,
  OAIndex,
} from '#/api/oa/activiti';

import AuditRadar from './modules/AuditRadar.vue';
import {
  flowTodoItems,
  getColumns,
  quickNavItems,
  tabOptions,
} from './modules/data';

type GridColumn = NonNullable<VxeTableGridOptions['columns']>[number];

const router = useRouter();
const userStore = useUserStore();

const activeKey = ref('need');
const stats = ref({
  userAlreadyCount: 0,
  userLaunchCount: 0,
  userNeedCount: 0,
});
const todoItems = ref(flowTodoItems.map((item) => ({ ...item })));

const greeting = computed(() => {
  const hour = new Date().getHours();
  const name = userStore.userInfo?.nickName;
  if (hour < 10) return `早安，${name}，开始您一天的工作吧！`;
  if (hour < 12) return `上午好，${name}，继续推进流程任务。`;
  if (hour < 18) return `下午好，${name}，保持完美工作状态！`;
  return `晚上好，${name}，记得及时收尾流程。`;
});

const avatar = computed(
  () => userStore.userInfo?.httpImageUrl || preferences.app.defaultAvatar,
);

const headerStats = computed(() => [
  { label: '待办', value: stats.value.userNeedCount },
  { label: '发起', value: stats.value.userLaunchCount },
  { label: '已办', value: stats.value.userAlreadyCount },
  { label: '部门人数', value: 300 },
]);

const workflowSummary = computed(
  () =>
    `当前共有 ${stats.value.userNeedCount} 条待办任务，${stats.value.userLaunchCount} 条发起记录，${stats.value.userAlreadyCount} 条已办记录。`,
);

const activeTabLabel = computed(
  () => tabOptions.find((item) => item.key === activeKey.value)?.label ?? '',
);

function refreshGrid() {
  gridApi.query();
}

function getApi() {
  if (activeKey.value === 'need') return doFindUserNeedList;
  if (activeKey.value === 'launch') return doFindUserLaunchList;
  return doFindUserAlreadyList;
}

function viewRecord(row: ActivitiUserNeedEntity, mode = '2') {
  const key = row.processDefinitionId?.split(':')?.[0];
  const path = key ? OAIndex[key as keyof typeof OAIndex] : undefined;
  if (!path) return;
  router.push(`${path}${row.businessKey}:${mode}:${row.taskId ?? ''}`);
}

async function claim(row: ActivitiUserNeedEntity) {
  await doClaim({ taskId: row.taskId });
  refreshGrid();
}

async function suspend(row: ActivitiUserNeedEntity) {
  await doSuspendedInstance({ instanceId: row.instanceId });
  refreshGrid();
}

async function deleteProcess(row: ActivitiUserNeedEntity) {
  await doDeleteProcessInstance({
    memo: '',
    processInstanceId: row.instanceId,
  });
  refreshGrid();
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ActivitiUserNeedEntity>) {
  switch (code) {
    case 'claim': {
      claim(row);
      break;
    }
    case 'delete': {
      Modal.confirm({
        content: `确定删除“${row.instanceName ?? row.taskName}”？`,
        onOk: () => deleteProcess(row),
        title: '删除流程',
      });
      break;
    }
    case 'review': {
      viewRecord(row, '1');
      break;
    }
    case 'suspend': {
      suspend(row);
      break;
    }
    case 'view': {
      viewRecord(row, '2');
      break;
    }
  }
}

const operationColumn: GridColumn = {
  align: 'center',
  cellRender: {
    attrs: {
      nameField: 'instanceName',
      onClick: onActionClick,
    },
    name: 'CellOperation',
    options: [
      {
        code: 'review',
        show: () => activeKey.value === 'need',
        text: '审核',
      },
      { code: 'view', text: '查看' },
      {
        code: 'claim',
        show: (row: ActivitiUserNeedEntity) =>
          activeKey.value === 'need' && row.assignee === null,
        text: '签收',
      },
      {
        code: 'suspend',
        show: (row: ActivitiUserNeedEntity) =>
          activeKey.value === 'launch' && row.processVariables?.status === 1,
        text: (row: ActivitiUserNeedEntity) =>
          row.isSuspended ? '激活' : '挂起',
      },
      {
        code: 'delete',
        show: (row: ActivitiUserNeedEntity) =>
          activeKey.value === 'launch' && row.processVariables?.status === 1,
        text: '删除',
      },
    ],
  },
  field: 'operation',
  fixed: 'right',
  title: '操作',
  width: 180,
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [...(getColumns(activeKey.value) ?? []), operationColumn],
    height: '100%',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          return await getApi()({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'taskId',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      zoom: true,
    },
  } as VxeTableGridOptions,
});

function onTabChange(key: Key) {
  const nextKey = String(key);
  activeKey.value = nextKey;
  gridApi.setGridOptions({
    columns: [...(getColumns(nextKey) ?? []), operationColumn],
    rowConfig: { keyField: nextKey === 'need' ? 'taskId' : 'instanceId' },
  } as VxeTableGridOptions);
  refreshGrid();
}

function goUrl(item: (typeof quickNavItems)[number]) {
  if (!item.url) return;
  router.push(item.url);
}

onMounted(async () => {
  stats.value = { ...stats.value, ...(await doStatsUserOa()) };
});
</script>

<template>
  <Page auto-content-height content-class="overflow-hidden p-0">
    <div class="flex h-full min-h-0 flex-col p-5">
      <WorkbenchHeader :avatar="avatar">
        <template #title>{{ greeting }}</template>
        <template #description> 集中处理流程任务和日常申请。 </template>
        <template #actions>
          <div
            v-for="item in headerStats"
            :key="item.label"
            class="ml-10 flex flex-col justify-center text-right first:ml-0 md:ml-14"
          >
            <span class="text-foreground/80">{{ item.label }}</span>
            <span class="text-2xl">{{ item.value }}</span>
          </div>
        </template>
      </WorkbenchHeader>

      <div
        class="mt-5 grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.52fr)]"
      >
        <Card class="h-full min-h-0 min-w-0 gap-4 py-4">
          <CardHeader class="px-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle class="text-lg">工作流</CardTitle>
                <p class="mt-1 text-sm text-foreground/70">
                  {{ workflowSummary }}
                </p>
              </div>
              <span class="text-sm text-foreground/70">
                当前视图：{{ activeTabLabel }}
              </span>
            </div>
          </CardHeader>
          <CardContent class="flex min-h-0 flex-1 flex-col px-5 pt-0">
            <Tabs
              :active-key="activeKey"
              class="shrink-0"
              @change="onTabChange"
            >
              <Tabs.TabPane
                v-for="item in tabOptions"
                :key="item.key"
                :tab="item.label"
              />
            </Tabs>
            <div class="min-h-0 flex-1">
              <Grid grid-class="h-full p-0" />
            </div>
          </CardContent>
        </Card>

        <div
          class="grid h-full min-h-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-4"
        >
          <Card class="gap-3 py-4">
            <CardHeader class="px-4">
              <CardTitle class="text-base">快捷导航</CardTitle>
            </CardHeader>
            <CardContent class="grid grid-cols-3 px-4 pb-0">
              <button
                v-for="item in quickNavItems"
                :key="item.title"
                class="flex h-20 flex-col items-center justify-center gap-2 border-t border-r border-border text-sm transition-colors hover:bg-accent/40 [&:nth-child(3n)]:border-r-0 [&:nth-child(-n+3)]:border-t-0"
                type="button"
                @click="goUrl(item)"
              >
                <VbenIcon
                  :color="item.color"
                  :icon="item.icon"
                  class="size-6"
                />
                <span class="truncate">{{ item.title }}</span>
              </button>
            </CardContent>
          </Card>

          <Card class="gap-3 py-4">
            <CardHeader class="px-4">
              <CardTitle class="text-base">流程提醒</CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-0">
              <ul class="divide-y divide-border">
                <li
                  v-for="item in todoItems"
                  :key="item.title"
                  class="flex items-center gap-3 py-3"
                >
                  <span
                    :class="[
                      item.completed
                        ? 'border-primary bg-primary'
                        : 'border-border',
                    ]"
                    class="size-3 shrink-0 rounded-sm border"
                  ></span>
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-medium">
                      {{ item.title }}
                    </div>
                    <div class="truncate text-xs text-foreground/70">
                      {{ item.content }}
                    </div>
                  </div>
                  <span class="shrink-0 text-xs text-foreground/60">
                    {{ item.date }}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <AnalysisChartCard class="min-h-0 gap-3 py-4" title="审核统计">
            <AuditRadar />
          </AnalysisChartCard>
        </div>
      </div>
    </div>
  </Page>
</template>
