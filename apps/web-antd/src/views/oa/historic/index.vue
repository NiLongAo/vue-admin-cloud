<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ActivitiUserAlreadyEntity } from '#/api/oa/activiti';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { doFindAlreadyList } from '#/api/oa/activiti';
import { buildWorkflowBusinessPath } from '#/views/work/oa/modules/workflow';

import { useColumns, useGridFormSchema } from './modules/data';

const router = useRouter();

function onView(row: ActivitiUserAlreadyEntity) {
  const path = buildWorkflowBusinessPath({
    businessKey: row.businessKey,
    mode: '2',
    processDefinitionId: row.processDefinitionId,
    taskId: row.taskId,
  });
  if (!path) {
    message.warning('未找到该流程对应的业务页面');
    return;
  }
  router.push(path);
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ActivitiUserAlreadyEntity>) {
  if (code === 'detail') {
    onView(row);
  }
}

const [Grid] = useVbenVxeGrid({
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
          return await doFindAlreadyList({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'historicInstanceId',
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
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="历史流程列表" />
  </Page>
</template>
