<template>
  <Card
    :tab-list="tabListTitle"
    v-bind="$attrs"
    :active-tab-key="tableRef.activeKey"
    @tabChange="onTabChange"
  >
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction :actions="actions(record)" :dropDownActions="dropDownActions(record)" />
      </template>
    </BasicTable>
  </Card>
</template>
<script lang="ts" setup>
  import { unref, reactive } from 'vue';
  import { Card } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import {
    doClaim,
    doSuspendedInstance,
    doDeleteProcessInstance,
    doBackProcess,
  } from '/@/api/oa/activiti';
  import { tabListTitle, tableDate } from './data';
  import { useGo } from '/@/hooks/web/usePage';
  import { OAIndex } from '/@/api/oa/activiti';
  const go = useGo();

  const tableRef = reactive({
    activeKey: 'need',
    rowKey: tableDate['need'].rowKey,
    api: tableDate['need'].api,
    columns: tableDate['need'].columns,
    bordered: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    size: 'small',
    actionColumn: {
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  const handleSuccess = () => {
    //刷新表单
    reload();
  };

  function onTabChange(key) {
    tableRef.activeKey = key;
    tableRef.api = tableDate[unref(key)].api;
    tableRef.columns = tableDate[unref(key)].columns;
    tableRef.rowKey = tableDate[unref(key)].rowKey;
  }
  const [registerTable, { reload }] = useTable(tableRef);

  const actions = (record): ActionItem[] => {
    return [
      {
        label: '审核',
        ifShow: tableRef.activeKey === 'need',
        onClick: handleNeedExamine.bind(null, record),
      },
      {
        label: '查看',
        onClick: handleNeedView.bind(null, record),
      },
    ];
  };

  const dropDownActions = (record): ActionItem[] => {
    return [
      {
        label: '签收',
        ifShow: tableRef.activeKey === 'need' && record.assignee === null,
        onClick: handleClaim.bind(null, record),
      },
      {
        label: record.isSuspended ? '激活' : '挂起',
        ifShow: tableRef.activeKey === 'launch' && record.processVariables.status === 1,
        onClick: handleSuspend.bind(null, record),
      },
      {
        label: '驳回',
        ifShow: tableRef.activeKey === 'need',
        onClick: handleBackProcess.bind(null, record),
      },
      {
        label: '删除',
        ifShow: tableRef.activeKey === 'launch' && record.processVariables.status === 1,
        onClick: handleDeleteProcessInstance.bind(null, record),
      },
    ];
  };
  // OAIndex:跳转路径集合枚举
  // key[0] ：定义那个地址
  // record.businessKey 业务主键

  const handleNeedExamine = (record) => {
    const key = record.processDefinitionId.split(':');
    go(OAIndex[key[0]] + record.businessKey + ':1');
  };
  const handleNeedView = (record) => {
    const key = record.processDefinitionId.split(':');
    go(OAIndex[key[0]] + record.businessKey + ':2');
  };
  const handleClaim = async (record) => {
    await doClaim({ taskId: record.taskId });
    handleSuccess();
  };

  const handleSuspend = async (record) => {
    await doSuspendedInstance({ instanceId: record.instanceId });
    handleSuccess();
  };
  const handleDeleteProcessInstance = async (record) => {
    await doDeleteProcessInstance({ processInstanceId: record.instanceId, memo: '' });
    handleSuccess();
  };
  const handleBackProcess = async (record) => {
    await doBackProcess({ taskId: record.taskId });
    handleSuccess();
  };
</script>
