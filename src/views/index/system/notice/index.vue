<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.notice:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.notice:delete'),
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
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('system.notice:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <PublicNoticeDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doPublicNoticeRemove, getPublicNoticePage } from '/@/api/notice/publicNotice';
  import { tenantSchemas } from '/@/settings/tenantSetting';
  import { stringToTime } from '/@/utils/dateUtil';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useDrawer } from '/@/components/Drawer';
  import PublicNoticeDrawer from './PublicNoticeDrawer.vue';
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';

  const [register, { openDrawer }] = useDrawer();
  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    title: '平台公告通知列表',
    api: getPublicNoticePage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    bordered: true,
    defSort: {
      field: 'createTime',
      order: 'descend',
    },
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
    await doPublicNoticeRemove({ id: record.id });
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
          field: `noticeType`,
          label: `通知类型`,
          component: 'Select',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            options: [
              {
                label: '系统公告',
                value: 1,
                key: 1,
              },
            ],
          },
        },
        {
          field: `status`,
          label: `通知类型`,
          component: 'Select',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            options: [
              {
                label: '正常',
                value: '1',
                key: '1',
              },
              {
                label: '已过期',
                value: '2',
                key: '2',
              },
            ],
          },
        },
        {
          field: `beginTime`,
          label: `开始时间`,
          component: 'DatePicker',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            showTime: {
              defaultValue: stringToTime('00:00:00'),
            },
          },
        },
        {
          field: `endTime`,
          label: `结束时间`,
          component: 'DatePicker',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            showTime: {
              defaultValue: stringToTime('23:59:59'),
            },
          },
        },
        {
          field: `title`,
          label: `标题`,
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
        fixed: 'left',
        width: 100,
      },
      {
        title: '通知类型',
        dataIndex: 'noticeType',
        fixed: 'left',
        width: 100,
        customRender: ({ record }) => {
          const status = record.noticeType;
          const enable = ~~status;
          const color = enable === 1 ? '#BBFF66' : '#FF8888';
          const text = enable === 1 ? '系统公告' : '无此类型';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '公告开始时间',
        dataIndex: 'beginTime',
        width: 100,
      },
      {
        title: '公告结束时间',
        dataIndex: 'endTime',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        customRender: ({ record }) => {
          const status = record.status;
          const enable = ~~status;
          const color = enable === 1 ? '#BBFF66' : '#FF8888';
          const text = enable === 1 ? '正常' : '已过期';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        defaultSortOrder: 'descend',
        width: 100,
      },
    ];
  }
</script>
