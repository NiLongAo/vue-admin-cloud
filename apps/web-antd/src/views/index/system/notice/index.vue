<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PublicNoticeEntity } from '#/api/notice/publicNotice';

import { computed, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doPublicNoticeRemove,
  getPublicNoticePage,
} from '#/api/notice/publicNotice';

import { useColumns, useGridFormSchema } from './modules/data';
import PublicNoticeModal from './modules/PublicNoticeModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PublicNoticeModal,
  destroyOnClose: true,
});

const noticeStats = ref({
  active: 0,
  expired: 0,
  total: 0,
});

const activeRate = computed(() => {
  if (!noticeStats.value.total) return '0%';
  return `${Math.round((noticeStats.value.active / noticeStats.value.total) * 100)}%`;
});

function updateNoticeStats(result: Recordable<any>) {
  const items = (result?.items ?? []) as PublicNoticeEntity[];
  noticeStats.value = {
    active: items.filter((item) => Number(item.status) === 1).length,
    expired: items.filter((item) => Number(item.status) === 2).length,
    total: Number(result?.total ?? items.length),
  };
}

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: PublicNoticeEntity) {
  formModalApi.setData({ ...row }).open();
}

function onDelete(row: PublicNoticeEntity) {
  Modal.confirm({
    async onOk() {
      await doPublicNoticeRemove({ id: row.id });
      refreshGrid();
    },
    content: `确定删除公告“${row.title ?? row.id}”？`,
    title: '删除操作',
  });
}

function onActionClick({ code, row }: OnActionClickParams<PublicNoticeEntity>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const result = await getPublicNoticePage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          updateNoticeStats(result);
          return result;
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    sortConfig: {
      defaultSort: {
        field: 'createTime',
        order: 'desc',
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions,
});

function refreshGrid() {
  gridApi.query();
}
</script>

<template>
  <Page
    auto-content-height
    content-class="flex flex-col gap-4 bg-background-deep"
  >
    <FormModal @success="refreshGrid" />

    <div
      class="flex shrink-0 flex-col gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm xl:flex-row xl:items-center xl:justify-between"
    >
      <div class="min-w-0">
        <div class="text-base font-semibold">平台公告通知</div>
        <div class="mt-1 text-sm text-muted-foreground">
          维护面向平台用户的公告内容、生效时间和发布状态。
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          class="grid grid-cols-3 overflow-hidden rounded-md border border-border bg-background text-center"
        >
          <div class="min-w-20 px-3 py-2">
            <div class="text-sm font-semibold">{{ noticeStats.total }}</div>
            <div class="text-xs text-muted-foreground">总数</div>
          </div>
          <div class="min-w-20 border-l border-border px-3 py-2">
            <div class="text-sm font-semibold">{{ noticeStats.active }}</div>
            <div class="text-xs text-muted-foreground">正常</div>
          </div>
          <div class="min-w-20 border-l border-border px-3 py-2">
            <div class="text-sm font-semibold">{{ activeRate }}</div>
            <div class="text-xs text-muted-foreground">有效率</div>
          </div>
        </div>

        <Button
          type="primary"
          v-access:code="'system.notice:add'"
          @click="onCreate"
        >
          <Plus class="size-5" />
          新增公告
        </Button>
      </div>
    </div>

    <Grid table-title="公告列表" />
  </Page>
</template>
