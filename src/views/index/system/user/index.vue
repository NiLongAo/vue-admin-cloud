<template>
  <div>
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', selectedRowKeys: checkedKeys }"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
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
        <a-button type="primary" @click="handleAdd">添加</a-button>
      </template>
    </BasicTable>
    <UserDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { getUserPage, doDelete } from '/@/api/sys/user';
  import { ref } from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useGo } from '/@/hooks/web/usePage';
  import UserDrawer from './UserDrawer.vue';
  const checkedKeys = ref<Array<string | number>>([]);
  const [register, { openDrawer }] = useDrawer();
  const go = useGo();

  const [registerTable, { reload }] = useTable({
    title: '用户列表',
    api: getUserPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'userId',
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleAdd() {
    console.log('点击了添加');
    openDrawer(true, {
      isUpdate: false,
    });
  }
  function handleView(record: Recordable) {
    console.log('点击了查看', record.userId);
    go('/system/user/user_detail/' + record.userId);
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      userId: record.userId,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };
  async function handleDelete(record: Recordable) {
    //删除
    await doDelete({ id: record.userId });
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
        dataIndex: 'userId',
        fixed: 'left',
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
        width: 200,
      },
    ];
  }
</script>
