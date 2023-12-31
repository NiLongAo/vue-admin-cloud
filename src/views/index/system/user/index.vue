<template>
  <div>
    <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.user:detail'),
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record),
            },
            {
              ifShow: hasPermission('system.user:print'),
              icon: 'ic:outline-local-printshop',
              tooltip: '打印用户详情',
              onClick: handlePrint.bind(null, record),
            },
            {
              ifShow: hasPermission('system.user:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.user:delete'),
              color: 'error',
              icon: 'mdi:delete-outline',
              popConfirm: {
                title: '是否删除？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('system.user:add')"
          >添加</a-button
        >
        <a-button type="primary" @click="handleExport" v-if="hasPermission('system.user:export')"
          >导出</a-button
        >
      </template>
    </BasicTable>
    <SettingUser
      :isUpdate="data.isUpdate"
      :userId="data.userId"
      :reload="reload"
      @register="registerModal"
      @success="handleSuccess"
    />
    <UserDetailPrintModel @register="registerPrintModal" />
    <ExpCommonModel
      :width="900"
      :min-height="600"
      :paramApi="doExportEntityInfo"
      :exportApi="doExportUrl"
      @register="registerExportCommonModel"
    />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { getUserPage, doDelete, doExportEntityInfo, doExportUrl } from '@/api/sys/user';
  import { useModal } from '@/components/Modal';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useGo } from '@/hooks/web/usePage';
  import SettingUser from './SettingUser.vue';
  import UserDetailPrintModel from './UserDetailPrintModel.vue';
  import { ExpCommonModel } from '@/components/Excel';
  import { reactive } from 'vue';

  const [registerPrintModal, { openModal: openPrintModal }] = useModal();
  const [registerExportCommonModel, { openModal: openExportCommonModel }] = useModal();
  const [registerModal, { openModal }] = useModal();
  const { hasPermission } = usePermission();
  const go = useGo();
  const data = reactive({
    isUpdate: false,
    userId: undefined,
  });

  const [registerTable, { reload, getForm, getSearchParam }] = useTable({
    title: '用户列表',
    api: getUserPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    defSort: {
      field: 'id',
      order: 'descend',
    },
    //pagination:false,
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleAdd() {
    data.isUpdate = false;
    data.userId = undefined;
    openModal(true);
  }
  function handlePrint(record: Recordable) {
    openPrintModal(true, { id: record.id });
  }
  function handleView(record: Recordable) {
    go('/system/user/user_detail/' + record.id);
  }

  const handleExport = () => {
    //获取查询参数
    const searchParam = { ...getSearchParam(), ...getForm().getFieldsValue() };

    openExportCommonModel(true, { searchParam });
  };

  function handleEdit(record: Recordable) {
    data.isUpdate = true;
    data.userId = record.id;
    openModal(true);
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };
  async function handleDelete(record: Recordable) {
    //删除
    await doDelete({ id: record.id });
    //刷新表单
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `userName`,
          label: `人员名称`,
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
        title: '用户编号',
        dataIndex: 'id',
        fixed: 'left',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 100,
      },
      {
        title: '人员名称',
        dataIndex: 'userName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '账号',
        dataIndex: 'loginAccount',
        width: 200,
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        width: 200,
      },
      {
        title: '身份证号',
        dataIndex: 'idCard',
        width: 200,
      },
      {
        title: '电话',
        dataIndex: 'phone',
        width: 200,
      },
      {
        title: '居住地址',
        dataIndex: 'address',
        width: 200,
      },
      {
        title: '登录时间',
        dataIndex: 'loginLastTime',
        sorter: true,
        width: 200,
      },
    ];
  }
</script>
