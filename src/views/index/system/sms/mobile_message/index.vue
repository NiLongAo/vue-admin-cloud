<template>
  <div>
    <BasicTable @register="registerTable" :rowSelection="{ type: 'checkbox' }">
      <template #smsTypeTag="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[DITE_SMS_TYPE_KEY][record.type] }}
        </Tag>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps } from '/@/components/Table';
  import { getMobileMessagePage } from '/@/api/sys/mobileMessage';
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';
  import { useSystemStore } from '/@/store/modules/system';
  import { DITE_SMS_TYPE_KEY } from '/@/enums/commonEnum';
  const systemStore = useSystemStore();

  const [registerTable] = useTable({
    title: '短信列表',
    api: getMobileMessagePage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    bordered: true,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    searchInfo: { sort: { field: 'id', order: 'desc' } },
    rowKey: 'id',
  });

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `mobile`,
          label: `手机号`,
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
        title: '手机号',
        dataIndex: 'mobile',
        width: 200,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 200,
        customRender: ({ record }) => {
          const status = record.status;
          const enable = status === 2;
          const color = enable ? 'green' : 'red';
          const text = status === 1 ? '未发' : status === 2 ? '成功' : '失败';
          return h(Tag, { color: color }, () => text);
        },
      },

      {
        title: '操作时间',
        dataIndex: 'handleTime',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 200,
      },
      {
        title: '内容',
        dataIndex: 'content',
        width: 500,
      },
    ];
  }
</script>
