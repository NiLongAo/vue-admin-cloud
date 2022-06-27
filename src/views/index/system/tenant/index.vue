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
              ifShow: hasPermission('system.tenant:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.tenant:delete'),
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
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('system.tenant:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <TenantDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { getTenantPage, doTenantRemove } from '/@/api/sys/tenant';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { ref } from 'vue';
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import TenantDrawer from './TenantDrawer.vue';
  const checkedKeys = ref<Array<string | number>>([]);
  const [register, { openDrawer }] = useDrawer();
  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    title: '租户列表',
    api: getTenantPage,
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
    openDrawer(true, { id: undefined, isUpdate: false });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      id: record.id,
      isUpdate: true,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };
  async function handleDelete(record: Recordable) {
    //删除
    await doTenantRemove({ id: record.id });
    //刷新表单
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `tenantName`,
          label: `租户名`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
        {
          field: `tenantUserName`,
          label: `联系人名称`,
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
        title: '租户编号',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
      },
      {
        title: '租户名',
        dataIndex: 'tenantName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '联系人',
        dataIndex: 'tenantUserName',
        fixed: 'left',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        fixed: 'left',
        width: 100,
        customRender: ({ record }) => {
          const status = record.status;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '启用' : '停用';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '账号数量',
        dataIndex: 'accountCount',
        width: 100,
      },
    ];
  }

  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }
</script>
