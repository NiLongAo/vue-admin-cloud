<template>
  <div>
    <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
      <template #smsTypeTag="{ record }">
        <Tag color="green">
          {{ systemStore.getEnumMap[SMS_CONFIG_TYPES][record.smsType] }}
        </Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.sms.sms_config:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.sms.sms_config:delete'),
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
        <a-button
          type="primary"
          @click="handleAdd"
          v-if="hasPermission('system.sms.sms_config:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <SmsConfigDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doRemove, getSmsConfigPage } from '/@/api/sys/smsConfig';
  import { Tag } from 'ant-design-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { h } from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useSystemStore } from '/@/store/modules/system';
  import { SMS_CONFIG_TYPES } from '/@/enums/commonEnum';
  import SmsConfigDrawer from './SmsConfigDrawer.vue';
  const [register, { openDrawer }] = useDrawer();
  const systemStore = useSystemStore();
  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    title: '短信配置列表',
    api: getSmsConfigPage,
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
    openDrawer(true, { isUpdate: false, id: undefined });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      isUpdate: true,
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
        {
          field: `configName`,
          label: `配置名称`,
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
        title: '编号',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
      },
      {
        title: '类型',
        dataIndex: 'smsType',
        width: 100,
        slots: { customRender: 'smsTypeTag' },
      },
      {
        title: '配置名称',
        dataIndex: 'configName',
        width: 200,
      },
      {
        title: '账号',
        dataIndex: 'account',
        width: 200,
      },
      {
        title: '是否启用',
        dataIndex: 'isActive',
        width: 200,
        customRender: ({ record }) => {
          const status = record.isActive;
          const enable = status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '签名',
        dataIndex: 'sign',
        width: 200,
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        width: 200,
      },
    ];
  }
</script>
