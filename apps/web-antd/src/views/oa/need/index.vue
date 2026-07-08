<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  doAppointClaim,
  doBackProcess,
  doFindNeedList,
  doSuspendedInstance,
} from '#/api/oa/activiti';
import { buildWorkflowBusinessPath } from '#/views/work/oa/modules/workflow';

import { useColumns, useGridFormSchema } from './modules/data';

const router = useRouter();

function refreshGrid() {
  gridApi.query();
}

function goBusinessPage(row: ActivitiUserNeedEntity, mode: '1' | '2') {
  const path = buildWorkflowBusinessPath({
    businessKey: row.businessKey,
    mode,
    processDefinitionId: row.processDefinitionId,
    taskId: row.taskId,
  });
  if (!path) {
    message.warning('未找到该流程对应的业务页面');
    return;
  }
  router.push(path);
}

function onClaim(row: ActivitiUserNeedEntity) {
  Modal.confirm({
    async onOk() {
      await doAppointClaim({ taskId: row.taskId });
      refreshGrid();
    },
    content: `确定签收任务“${row.instanceName ?? row.taskName}”？`,
    title: '签收任务',
  });
}

function onSuspended(row: ActivitiUserNeedEntity) {
  Modal.confirm({
    async onOk() {
      await doSuspendedInstance({ instanceId: row.instanceId });
      refreshGrid();
    },
    content: `确定${row.isSuspended ? '激活' : '挂起'}流程“${row.instanceName ?? row.taskName}”？`,
    title: '状态切换',
  });
}

function onBackProcess(row: ActivitiUserNeedEntity) {
  Modal.confirm({
    async onOk() {
      await doBackProcess({ taskId: row.taskId });
      refreshGrid();
    },
    content: `确定驳回任务“${row.instanceName ?? row.taskName}”到上一节点？`,
    title: '驳回任务',
  });
}

function onActionClick({
  code,
  row,
}: OnActionClickParams<ActivitiUserNeedEntity>) {
  switch (code) {
    case 'audit': {
      goBusinessPage(row, '1');
      break;
    }
    case 'detail': {
      goBusinessPage(row, '2');
      break;
    }
    case 'pending': {
      onSuspended(row);
      break;
    }
    case 'reject': {
      onBackProcess(row);
      break;
    }
    case 'sign_for': {
      onClaim(row);
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
          return await doFindNeedList({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
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
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="待办流程列表" />
  </Page>
</template>
