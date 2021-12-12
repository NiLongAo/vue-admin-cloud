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
  import { tabListTitle, tableDate } from './data';
  import { useGo } from '/@/hooks/web/usePage';

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
      // {
      //   label: '签收',
      //   ifShow: tableRef.activeKey === 'need',
      //   onClick: handleClaim.bind(null, record),
      // },
      {
        label: '跳转',
        ifShow: tableRef.activeKey === 'need',
        onClick: handleJump.bind(null, record),
      },
      {
        label: '激活',
        ifShow: tableRef.activeKey === 'need',
        onClick: handleActivate.bind(null, record),
      },
      {
        label: '挂起',
        ifShow: tableRef.activeKey === 'need',
        onClick: handleSuspend.bind(null, record),
      },
      {
        label: '驳回',
        ifShow: tableRef.activeKey === 'need',
        onClick: handleBackProcess.bind(null, record),
      },
      // {
      //   label: '删除',
      //   ifShow: hasPermission('system.role:update'),
      //   onClick: handleDeleteProcess.bind(null, record),
      // },
    ];
  };

  const handleNeedExamine = () => {};
  const handleNeedView = (record) => {
    go('/work/leave/' + record.businessKey);
  };
  const handleClaim = () => {};
  const handleJump = () => {};
  const handleActivate = () => {};
  const handleSuspend = () => {};
  const handleBackProcess = () => {};
  const handleDeleteProcess = () => {};
</script>
