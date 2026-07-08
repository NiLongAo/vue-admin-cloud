<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon, Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doMenuPage, doMenuRemove, SystemMenuApi } from '#/api/sys/menu';

import { useColumns } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const menuStats = ref({
  button: 0,
  catalog: 0,
  embedded: 0,
  link: 0,
  menu: 0,
  total: 0,
});

function collectMenuStats(items: SystemMenuApi.SystemMenu[]) {
  const stats = {
    button: 0,
    catalog: 0,
    embedded: 0,
    link: 0,
    menu: 0,
    total: 0,
  };

  function walk(nodes: SystemMenuApi.SystemMenu[] = []) {
    nodes.forEach((node) => {
      stats.total += 1;
      if (node.type in stats) {
        stats[node.type as keyof typeof stats] += 1;
      }
      walk(node.children ?? []);
    });
  }

  walk(items);
  return stats;
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          const { items = [] } = await doMenuPage({});
          menuStats.value = collectMenuStats(items);
          return items;
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
    treeConfig: {
      parentField: 'pid',
      rowField: 'id',
      transform: false,
    },
  } as VxeTableGridOptions,
});

function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemMenuApi.SystemMenu>) {
  switch (code) {
    case 'append': {
      onAppend(row);
      break;
    }
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    default: {
      break;
    }
  }
}

function onRefresh() {
  gridApi.query();
}
function onEdit(row: SystemMenuApi.SystemMenu) {
  formDrawerApi.setData(row).open();
}
function onCreate() {
  formDrawerApi.setData({}).open();
}
function onAppend(row: SystemMenuApi.SystemMenu) {
  formDrawerApi.setData({ pid: row.id }).open();
}

function onDelete(row: SystemMenuApi.SystemMenu) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  doMenuRemove({ id: row.id })
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}
</script>
<template>
  <Page
    auto-content-height
    content-class="flex flex-col gap-4 bg-background-deep"
  >
    <FormDrawer @success="onRefresh" />

    <div
      class="flex shrink-0 flex-col gap-4 rounded-lg border border-border bg-card px-4 py-3 shadow-sm xl:flex-row xl:items-center xl:justify-between"
    >
      <div class="min-w-0">
        <div class="text-base font-semibold">菜单管理</div>
        <div class="mt-1 text-sm text-muted-foreground">
          维护后台菜单、路由入口和按钮权限，支持树形层级管理。
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div
          class="grid grid-cols-3 overflow-hidden rounded-md border border-border bg-background text-center"
        >
          <div class="min-w-20 px-3 py-2">
            <div class="text-sm font-semibold">{{ menuStats.total }}</div>
            <div class="text-xs text-muted-foreground">全部</div>
          </div>
          <div class="min-w-20 border-l border-border px-3 py-2">
            <div class="text-sm font-semibold">{{ menuStats.menu }}</div>
            <div class="text-xs text-muted-foreground">菜单</div>
          </div>
          <div class="min-w-20 border-l border-border px-3 py-2">
            <div class="text-sm font-semibold">{{ menuStats.button }}</div>
            <div class="text-xs text-muted-foreground">按钮</div>
          </div>
        </div>

        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.menu.name')]) }}
        </Button>
      </div>
    </div>

    <Grid table-title="菜单列表">
      <template #title="{ row }">
        <div class="relative flex w-full min-w-0 items-center gap-2 pr-8">
          <div
            class="flex size-8 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
          >
            <IconifyIcon
              v-if="row.type === 'button'"
              icon="carbon:security"
              class="size-4"
            />
            <IconifyIcon
              v-else-if="row.meta?.icon"
              :icon="row.meta?.icon || 'carbon:circle-dash'"
              class="size-4"
            />
            <IconifyIcon v-else icon="carbon:circle-dash" class="size-4" />
          </div>
          <div class="min-w-0 flex-auto">
            <div class="truncate font-medium">
              {{ $t(row.meta?.title || row.name) }}
            </div>
            <div class="truncate text-xs text-muted-foreground">
              {{ row.name || row.path || row.authCode }}
            </div>
          </div>
          <MenuBadge
            v-if="row.meta?.badgeType"
            class="menu-badge"
            :badge="row.meta.badge"
            :badge-type="row.meta.badgeType"
            :badge-variants="row.meta.badgeVariants"
          />
        </div>
      </template>
    </Grid>
  </Page>
</template>
<style lang="scss" scoped>
.menu-badge {
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  & > :deep(div) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
