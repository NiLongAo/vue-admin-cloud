# Example: List Page Pattern

Use this as a template after checking the nearest existing module.

## `index.vue`

```vue
<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DemoEntity } from '#/api/demo/demo';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doDemoRemove, getDemoPage } from '#/api/demo/demo';

import { useColumns, useGridFormSchema } from './modules/data';
import DemoModal from './modules/DemoModal.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DemoModal,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: DemoEntity) {
  formModalApi.setData({ id: row.id }).open();
}

function onDelete(row: DemoEntity) {
  Modal.confirm({
    title: 'Delete',
    content: `Delete ${row.name ?? row.id}?`,
    async onOk() {
      await doDemoRemove({ id: row.id });
      refreshGrid();
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<DemoEntity>) {
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
          return await getDemoPage({
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
    <FormModal @success="refreshGrid" />
    <Grid table-title="Demo List">
      <template #toolbar-tools>
        <Button v-access:code="'demo:add'" type="primary" @click="onCreate">
          <Plus class="size-5" />
          Add
        </Button>
      </template>
    </Grid>
  </Page>
</template>
```

## `modules/data.ts`

```ts
import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DemoEntity } from '#/api/demo/demo';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
      componentProps: {
        placeholder: 'Please enter name',
      },
    },
  ];
}

export function useColumns<T = DemoEntity>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { type: 'seq', width: 80 },
    { field: 'name', minWidth: 180, showOverflow: true, title: 'Name' },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: 'demo',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          { code: 'edit', show: () => hasAccessByCodes(['demo:update']) },
          { code: 'delete', show: () => hasAccessByCodes(['demo:delete']) },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: 'Operation',
      width: 140,
    },
  ];
}
```
