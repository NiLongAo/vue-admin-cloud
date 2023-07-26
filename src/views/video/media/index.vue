<template>
  <div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('video.media:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('video.media:delete'),
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
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('video.media:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <MediaDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doMediaPage, doMediaRemove } from '/@/api/video/mediaServer';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useDrawer } from '/@/components/Drawer';
  import MediaDrawer from './MediaDrawer.vue';
  const [register, { openDrawer }] = useDrawer();
  const { hasPermission } = usePermission();

  const [registerTable, { reload }] = useTable({
    title: '流媒体列表',
    api: doMediaPage,
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
    openDrawer(true, { isUpdate:false,id: undefined });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      isUpdate:true,
      id: record.id,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };
  async function handleDelete(record: Recordable) {
    //删除
    await doMediaRemove({ id: record.id });
    //刷新表单
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `online`,
          label: `状态`,
          component: 'Select',
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps: {
            options: [
              {
                label: '在线',
                value: '1',
                key: '1',
              },
              {
                label: '离线',
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
        title: 'IP',
        dataIndex: 'ip',
        fixed: 'left',
        width: 200,
      },
      {
        title: '平台IP',
        dataIndex: 'hookIp',
        width: 200,
      },
      {
        title: 'ssl',
        dataIndex: 'sslStatus',
        width: 200,
        customRender: ({ record }) => {
          const status = record.sslStatus;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: 'SdpIP',
        dataIndex: 'sdpIp',
        width: 200,
      },
      {
        title: '流Ip',
        dataIndex: 'streamIp',
        width: 200,
      },
      {
        title: 'HTTP端口',
        dataIndex: 'httpPort',
        width: 200,
      },
      {
        title: 'HTTPS端口',
        dataIndex: 'httpSslPort',
        width: 200,
      },
      {
        title: 'RTMP端口',
        dataIndex: 'rtmpPort',
        width: 200,
      },
      {
        title: 'RTMPS端口',
        dataIndex: 'rtmpSslPort',
        width: 200,
      },
      {
        title: 'RTP收流端口',
        dataIndex: 'rtpProxyPort',
        width: 200,
      },
      {
        title: 'RTSP端口',
        dataIndex: 'rtspPort',
        width: 200,
      },
      {
        title: 'RTSPS端口',
        dataIndex: 'rtspSslPort',
        width: 200,
      },
      {
        title: '心跳时间',
        dataIndex: 'keepaliveTime',
        width: 200,
      },
      {
        title: '是否启用',
        dataIndex: 'enable',
        width: 200,
        customRender: ({ record }) => {
          const status = record.enable;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '自动配置',
        dataIndex: 'autoConfig',
        width: 200,
        customRender: ({ record }) => {
          const status = record.autoConfig;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '多端口模式',
        dataIndex: 'rtpEnable',
        width: 200,
        customRender: ({ record }) => {
          const status = record.rtpEnable;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '状态',
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
        title: 'RTP端口范围',
        dataIndex: 'rtpPortRange',
        width: 200,
      },
      {
        title: '默认ZLM',
        dataIndex: 'defaultServer',
        width: 200,
        customRender: ({ record }) => {
          const status = record.rtpEnable;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '心跳间隔(秒)',
        dataIndex: 'hookAliveInterval',
        width: 200,
      },
    ];
  }
</script>
