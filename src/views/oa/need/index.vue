<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.config:update'),
              icon: 'clarity:info-standard-line',
              onClick: handleView.bind(null, record),
            },
          ]"
          :dropDownActions="[
            {
              ifShow: hasPermission('system.config:update'),
              label: '签收',
              onClick: handleClaim.bind(null, record),
            },
            {
              ifShow: hasPermission('system.config:update'),
              label: !record.isSuspended ? '挂起' : '激活',
              color: !record.isSuspended ? 'error' : 'success',
              popConfirm: {
                title: '是否挂起？',
                confirm: handleSuspended.bind(null, record),
              },
            },
            {
              ifShow: hasPermission('system.config:update'),
              label: '驳回',
              popConfirm: {
                title: '是否驳回上一节点？',
                confirm: handleBackProcess.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserModel @register="registerModal" @success="onSuccessModel" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import {
    doFindNeedList,
    doAppointClaim,
    doSuspendedInstance,
    doBackProcess,
  } from '/@/api/oa/activiti';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useGo } from '/@/hooks/web/usePage';
  import { OAIndex } from '/@/api/oa/activiti';
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';
  import { useModal } from '/@/components/Modal';
  import UserModel from '../../index/system/user/components/UserModel.vue';
  const [registerModal, { openModal }] = useModal();

  const go = useGo();
  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    title: '待办流程列表',
    api: doFindNeedList,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'k',
    actionColumn: {
      width: 80,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const handleSuccess = () => {
    //刷新表单
    reload();
  };

  const handleView = (record: Recordable) => {
    const key = record.processDefinitionId.split(':');
    go(OAIndex[key[0]] + record.businessKey + ':2');
  };

  const handleClaim = (record: Recordable) => {
    openModal(true, { data: record });
  };
  const onSuccessModel = async (data, userIdList) => {
    await doAppointClaim({ taskId: data.taskId, userId: userIdList[0] });
    handleSuccess();
  };

  const handleSuspended = async (record: Recordable) => {
    await doSuspendedInstance({ instanceId: record.instanceId });
    handleSuccess();
  };
  const handleBackProcess = async (record: Recordable) => {
    await doBackProcess({ taskId: record.taskId });
    handleSuccess();
  };

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `name`,
          label: `任务名称`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
      ],
    };
  }

  function getBasicColumns(): BasicColumn[] {
    return [
      {
        title: '定义名称',
        dataIndex: 'processDefinitionName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '实例名称',
        dataIndex: 'instanceName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '部门名称',
        dataIndex: 'departmentName',
        fixed: 'left',
        customRender: ({ record }) => {
          const { tackComment } = (record as Recordable) || {};
          return tackComment.departmentName;
        },
        width: 100,
      },
      {
        title: '审核人',
        dataIndex: 'userName',
        customRender: ({ record }) => {
          const { tackComment } = (record as Recordable) || {};
          return tackComment.userName;
        },
        width: 100,
      },
      {
        title: '节点名称',
        dataIndex: 'taskName',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'isSuspended',
        width: 200,
        customRender: ({ record }) => {
          const { isSuspended } = (record as Recordable) || {};
          const status = !isSuspended;
          const color = status ? 'green' : 'red';
          const text = status ? '启用' : '挂起';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 100,
      },
    ];
  }
</script>
