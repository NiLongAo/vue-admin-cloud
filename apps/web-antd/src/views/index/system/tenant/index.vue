<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { TenantModel } from '#/api/sys/tenant';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doTenantRemove, getTenantPage } from '#/api/sys/tenant';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

function onEdit(row: TenantModel) {
  formDrawerApi.setData({ id: row.id }).open();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}

function onDelete(row: TenantModel) {
  Modal.confirm({
    title: '删除操作',
    content: `确定删除租户“${row.tenantName ?? row.id}”？`,
    async onOk() {
      await doTenantRemove({ id: row.id });
      refreshGrid();
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<TenantModel>) {
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
          return await getTenantPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
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
  <Page auto-content-height>
    <FormDrawer @success="refreshGrid" />
    <Grid table-title="租户列表">
      <template #toolbar-tools>
        <Button
          v-access:code="'system.tenant:add'"
          type="primary"
          @click="onCreate"
        >
          <Plus class="size-5" />
          新增租户
        </Button>
      </template>
    </Grid>
  </Page>
</template>
