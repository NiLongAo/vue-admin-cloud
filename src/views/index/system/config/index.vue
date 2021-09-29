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
              ifShow: hasPermission('system.config:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <ConfigDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doConfigPage } from '/@/api/sys/config';
  import { ref } from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  import ConfigDrawer from './ConfigDrawer.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const checkedKeys = ref<Array<string | number>>([]);
  const [register, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: '系统设置列表',
    titleHelpMessage: '温馨提醒:在无必要情况下,请勿随意更改系统配置，负责导致系统无法正常运行',
    api: doConfigPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'k',
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      isUpdate: true,
      k: record.k,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `configName`,
          label: `系统设置名称`,
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
        title: '配置键',
        dataIndex: 'k',
        fixed: 'left',
        width: 100,
      },
      {
        title: '配置值',
        dataIndex: 'v',
        width: 200,
      },
      {
        title: '配置名称',
        dataIndex: 'configName',
        fixed: 'left',
        width: 100,
      },
    ];
  }
</script>
