<template>
  <div>
    <BasicTable
      @register="registerTable"
      :rowSelection="{ type: 'checkbox', selectedRowKeys: checkedKeys, onChange: onSelectChange }"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.role:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.role:delete'),
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
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('system.role:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <RoleDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doRemove, getRolePage } from '/@/api/sys/role';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { tenantSchemas } from '/@/settings/tenantSetting';
  import { ref } from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';
  const checkedKeys = ref<Array<string | number>>([]);
  const [register, { openDrawer }] = useDrawer();
  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    title: '角色列表',
    api: getRolePage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    bordered: true,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleAdd() {
    openDrawer(true, { id: undefined });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      id: record.id,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };
  async function handleDelete(record: Recordable) {
    //删除
    await doRemove({ id: record.id });
    //刷新表单
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        ...tenantSchemas,
        {
          field: `roleName`,
          label: `角色名称`,
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
        title: '角色编号',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: 200,
      },
    ];
  }

  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }
</script>
