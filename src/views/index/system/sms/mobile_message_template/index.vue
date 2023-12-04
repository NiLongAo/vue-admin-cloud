<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <SmsConfigTree ref="TypeTreeRef" class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          @click="handleCreate"
          v-if="hasPermission('system.sms.mobile_message_template:add')"
          >新增模板</a-button
        >
      </template>
      <template #typeTag="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[DITE_SMS_SEND_TYPE_KEY][record.type] }}
        </Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.sms.mobile_message_template:update'),
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.sms.mobile_message_template:delete'),
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <MobileMessageTemplateDrawer @register="register" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { PageWrapper } from '@/components/Page';
  import { useDrawer } from '@/components/Drawer';
  import SmsConfigTree from './SmsConfigTree.vue';
  import MobileMessageTemplateDrawer from './MobileMessageTemplateDrawer.vue';
  import { getSmsConfigPage, doRemove } from '@/api/sys/mobileMessageTemplate';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useSystemStore } from '@/store/modules/system';
  import { DITE_SMS_SEND_TYPE_KEY } from '@/enums/commonEnum';
  const { hasPermission } = usePermission();
  const systemStore = useSystemStore();

  const TypeTreeRef = ref();
  const searchInfo = reactive<Recordable>({});
  const [register, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: '短信模板列表',
    api: getSmsConfigPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    bordered: true,
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

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `title`,
          label: `模板标题`,
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
        title: '标题',
        dataIndex: 'title',
        width: 100,
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: 150,
        slots: { customRender: 'typeTag' },
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: 400,
      },
      {
        title: '变量',
        dataIndex: 'variable',
        width: 200,
      },
    ];
  }

  //点击字典类型事件
  const handleSelect = (configId = '') => {
    searchInfo.configId = configId;
    reload();
  };

  //新增模板
  const handleCreate = () => {
    openDrawer(true, { isUpdate: false, id: undefined, configId: searchInfo.configId });
    reload();
  };
  //编辑模板
  const handleEdit = (record: Recordable) => {
    openDrawer(true, { isUpdate: true, id: record.id, configId: searchInfo.configId });
    reload();
  };
  //删除模板
  const handleDelete = async (record: Recordable) => {
    await doRemove({ id: record.id });
    reload();
  };

  const handleSuccess = () => {
    //刷新表单
    reload();
  };
</script>
