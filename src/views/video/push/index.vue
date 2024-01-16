<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('video.push:play') && record.pushIng === 1,
              tooltip: '播放',
              icon: 'ic-outline-play-circle',
              onClick: handlePlay.bind(null, record),
            },
            {
              ifShow: hasPermission('video.push:update'),
              tooltip: '编辑',
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('video.push:delete'),
              color: 'error',
              tooltip: '删除',
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
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('video.push:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <PushDrawer @register="register" @success="handleSuccess" />
    <PlayModel @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { doPushPage, doPushRemove, doPushGetPlayUrl } from '@/api/video/push';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useModal } from '@/components/Modal';
  import { useDrawer } from '@/components/Drawer';
  import { PlayModel } from '@/components/Video';
  import PushDrawer from './PushDrawer.vue';
  const [register, { openDrawer }] = useDrawer();
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    title: '推流列表',
    api: doPushPage,
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
    await doPushRemove({ id: record.id });
    //刷新表单
    reload();
  }

  //播放
  const handlePlay = async (val) => {
    const { id } = val;
    const data = await doPushGetPlayUrl({ id });
    openModal(data);
  };

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: 'query',
          label: '查询',
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            placeholder: '名称，应用名，流ID，国标ID',
          },
        },
        {
          field: `pushing`,
          label: `推流状态`,
          component: 'Select',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            options: [
              {
                label: '是',
                value: '1',
                key: '1',
              },
              {
                label: '否',
                value: '0',
                key: '0',
              },
            ],
          },
        },
      ],
    };
  }

  function getBasicColumns(): BasicColumn[] {
    return [
      {
        title: '应用名',
        dataIndex: 'app',
        fixed: 'left',
        width: 200,
      },
      {
        title: '流ID',
        dataIndex: 'stream',
        fixed: 'left',
        width: 200,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '观看总人数',
        dataIndex: 'totalReaderCount',
        width: 200,
      },
      {
        title: '源类型',
        dataIndex: 'originTypeStr',
        width: 200,
      },
      {
        title: '存活时间(秒)',
        dataIndex: 'aliveSecond',
        width: 200,
      },
      {
        title: '国标编号',
        dataIndex: 'gbId',
        width: 200,
      },
      {
        title: '流媒体编号',
        dataIndex: 'mediaServerId',
        width: 200,
      },
      {
        title: '服务编号',
        dataIndex: 'serverId',
        width: 200,
      },
      {
        title: '推流时间',
        dataIndex: 'pushTime',
        width: 200,
      },
      {
        title: '在线状态',
        dataIndex: 'status',
        width: 200,
        customRender: ({ record }) => {
          const status = record.status;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '在线' : '离线';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '推流状态',
        dataIndex: 'pushIng',
        width: 200,
        customRender: ({ record }) => {
          const status = record.pushIng;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
    ];
  }
</script>
