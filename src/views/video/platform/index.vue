<template>
  <div>
    <BasicTable @register="registerTable">
      <template #transportType="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[TRANSPORT_TYPE_ENUM][record.transport] }}
        </Tag>
      </template>
      <template #characterSetType="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[CHARSET_TYPE_ENUM][record.characterSet] }}
        </Tag>
      </template>
      <template #treeType="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[TREE_TYPE_ENUM][record.treeType] }}
        </Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('video.platform:join'),
              icon: 'ic-round-join-left',
              tooltip: '关联国标',
              onClick: handleJoinGb.bind(null, record),
            },
            {
              ifShow: hasPermission('video.platform:update'),
              icon: 'mdi:file-edit-outline',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('video.platform:delete'),
              color: 'error',
              icon: 'mdi:delete-outline',
              tooltip: '删除',
              popConfirm: {
                title: '是否删除？',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('video.platform:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <PlatformDrawer @register="register" @success="handleSuccess" />
    <PlatformJoinGbModel @register="registerModal" @success="handleSuccess"/>
  </div>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';
  import { useSystemStore } from '@/store/modules/system';
  import { TRANSPORT_TYPE_ENUM ,CHARSET_TYPE_ENUM,TREE_TYPE_ENUM} from '@/enums/commonEnum';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '@/components/Table';
  import { doPlatformPage, doPlatformRemove } from '@/api/video/platform';
  import { usePermission } from '@/hooks/web/usePermission';
  import { useDrawer } from '@/components/Drawer';
  import { useModal } from '@/components/Modal';
  import PlatformDrawer from './PlatformDrawer.vue';
  import PlatformJoinGbModel from './PlatformJoinGbModel.vue';
  const [ register, { openDrawer }] = useDrawer();
  const [ registerModal, { openModal }] = useModal();
  const { hasPermission } = usePermission();
  const systemStore = useSystemStore();

  const [registerTable, { reload }] = useTable({
    title: '国标级联列表',
    api: doPlatformPage,
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
  function handleJoinGb(record: Recordable) {
    openModal(true, record);
  }
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
    await doPlatformRemove({ id: record.id });
    //刷新表单
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field:"query",
          label:"IP地址",
          component:"Input",
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
        {
          field: `status`,
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
        title: 'SIP国标编码',
        dataIndex: 'serverGbId',
        fixed: 'left',
        width: 200,
      },
      {
        title: '名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: 'SIP服务IP',
        dataIndex: 'serverIp',
        width: 200,
      },
      {
        title: 'SIP服务端口',
        dataIndex: 'serverPort',
        width: 200,
      },
      {
        title: '设备国标编号',
        dataIndex: 'deviceGbId',
        width: 200,
      },
      {
        title: '设备IP',
        dataIndex: 'deviceIp',
        width: 200,
      },
      {
        title: '设备端口',
        dataIndex: 'devicePort',
        width: 200,
      },
      {
        title: 'SIP认证用户名',
        dataIndex: 'username',
        width: 200,
      },
      {
        title: '注册周期 (秒)',
        dataIndex: 'expires',
        width: 200,
      },
      {
        title: '心跳周期(秒)',
        dataIndex: 'keepTimeout',
        width: 200,
      },
      {
        title: '启用',
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
        title: '传输协议',
        dataIndex: 'transport',
        width: 200,
        slots: { customRender: 'transportType' },
      },
      {
        title: '字符集',
        dataIndex: 'characterSet',
        width: 200,
        slots: { customRender: 'characterSetType' },
      },
      {
        title: '树类型',
        dataIndex: 'treeType',
        width: 200,
        slots: { customRender: 'treeType' },
      },
      {
        title: '云台控制',
        dataIndex: 'ptz',
        width: 200,
        customRender: ({ record }) => {
          const status = record.ptz;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '允许' : '拒绝';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: 'RTCP流保活',
        dataIndex: 'rtcp',
        width: 200,
        customRender: ({ record }) => {
          const status = record.rtcp;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '主动拉流',
        dataIndex: 'startOfflinePush',
        width: 200,
        customRender: ({ record }) => {
          const status = record.startOfflinePush;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '消息通道',
        dataIndex: 'asMessageChannel',
        width: 200,
        customRender: ({ record }) => {
          const status = record.asMessageChannel;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
    ];
  }
</script>
