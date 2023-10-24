<template>
  <div>
    <BasicTable @register="registerTable">
      <template #proxyType="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[PROXY_TYPE_ENUM][record.type] }}
        </Tag>
      </template>
      <template #proxyRtpType="{ record }">
        <Tag color="green">
          {{ systemStore.getDictMap[PROXY_RTP_TYPE_ENUM][record.rtpType] }}
        </Tag>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
             {
              ifShow: hasPermission('video.proxy:enable'),
              color:( record.status === 1?'error':undefined),
              tooltip: record.status === 1?'停用':'启用',
              icon: record.status === 1?'ic:outline-toggle-off':'ic:outline-toggle-on',
              onClick: handleEnable.bind(null, record),
            },
            {
              ifShow: hasPermission('video.proxy:play') && (record.status === 1),
              tooltip: '播放',
              icon: 'ic-outline-play-circle',
              onClick: handlePlay.bind(null, record),
            },
            {
              ifShow: hasPermission('video.proxy:update'),
              tooltip: '编辑',
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('video.proxy:delete'),
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
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('video.proxy:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <ProxyDrawer @register="register" @success="handleSuccess" />
    <PlayModel @register="registerModal" :auth="userStore.getToken"/>
  </div>
</template>
<script lang="ts" setup>
  import { Tag } from 'ant-design-vue';
  import { h } from 'vue';
  import { useSystemStore } from '/@/store/modules/system';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { PROXY_TYPE_ENUM,PROXY_RTP_TYPE_ENUM } from '/@/enums/commonEnum';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doProxyPage, doProxyRemove,doProxyStart,doProxyStop,doProxyGetPlayUrl } from '/@/api/video/proxy';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal';
  import { useDrawer } from '/@/components/Drawer';
  import {PlayModel} from '/@/components/Video';
  import ProxyDrawer from './ProxyDrawer.vue';
  const [register, { openDrawer }] = useDrawer();
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();
  const systemStore = useSystemStore();
  const userStore = useUserStoreWithOut();

  const [registerTable, { reload }] = useTable({
    title: '拉流列表',
    api: doProxyPage,
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
    await doProxyRemove({ id: record.id });
    //刷新表单
    reload();
  }
  //启用 禁用 
  const handleEnable = async(val) =>{
    const {id,status} = val;
    if(status ===1){
      await doProxyStop({id})
    }else{
      await doProxyStart({id})
    }
    //刷新表单
    reload();
  }
  //播放
  const handlePlay = async(val) =>{
     const {id} = val;
     const data = await doProxyGetPlayUrl({id});
     openModal(true,data);
  }


  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field:"query",
          label:"查询",
          component:"Input",
          colProps: {
            xl: 6,
            xxl: 5,
          },
          componentProps:{
            placeholder:'名称，应用名，流ID，国标ID'
          }
        },
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
        title: '拉流类型',
        dataIndex: 'type',
        width: 200,
        slots: { customRender: 'proxyType' },
      },
      {
        title: '拉流方式',
        dataIndex: 'rtpType',
        width: 200,
        slots: { customRender: 'proxyRtpType' },
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
        title: '拉流地址',
        dataIndex: 'url',
        width: 200,
        ellipsis:true,
        customRender: ({ record }) => {
          return record.type===1?record.url:record.srcUrl
        },
      },
      {
        title: '目标地址',
        dataIndex: 'dstUrl',
        width: 200,
      },
      {
        title: '启用状态',
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
        title: '启用音频',
        dataIndex: 'enableAudio',
        width: 200,
        customRender: ({ record }) => {
          const status = record.enableAudio;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '启用MP4',
        dataIndex: 'enableMp4',
        width: 200,
        customRender: ({ record }) => {
          const status = record.enableMp4;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '无人观看删除',
        dataIndex: 'enableRemoveNoneReader',
        width: 200,
        customRender: ({ record }) => {
          const status = record.enableRemoveNoneReader;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '无人观看停用',
        dataIndex: 'enableDisableNoneReader',
        width: 200,
        customRender: ({ record }) => {
          const status = record.enableDisableNoneReader;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '是' : '否';
          return h(Tag, { color: color }, () => text);
        },
      },
    ];
  }
</script>
