<template>
  <PageWrapper dense contentFullHeight  @back="goBack" :title="`国标通道：` + formData.deviceId">
    <VxeBasicTable ref="tableRef" v-bind="gridOptions">
      <template #action="{ row }">
        <TableAction outside
          :actions="[
            {
              ifShow: hasPermission('system.tenant:update'),
              tooltip: '播放',
              icon: 'ic-outline-play-circle',
              onClick: handlePlay.bind(null, row),
            },
            {
              ifShow: hasPermission('system.tenant:update'),
              tooltip: '历史回放',
              icon: 'ic-round-history',
              onClick: handleRecord.bind(null, row),
            },
            {
              ifShow: hasPermission('system.tenant:update'),
              tooltip: '编辑',
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, row),
            },
            {
              ifShow: hasPermission('system.tenant:delete'),
              color: 'error',
              icon: 'mdi:delete-outline',
              tooltip: '删除',
              popConfirm: {
                title: '是否删除？',
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </VxeBasicTable>
    <DeviceChannelDrawer @register="register" @success="handleSuccess" />
    <PlayModel @register="registerModal" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import {
    BasicTableProps,
    VxeBasicTable,
    VxeGridInstance,
    VxeGridPropTypes,
    VxeFormItemProps,
  } from '/@/components/VxeTable';
  import { useGo } from '/@/hooks/web/usePage';
  import { TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { computed, reactive,h ,ref,unref} from 'vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import { Tag } from 'ant-design-vue';
  import { useSystemStore } from '/@/store/modules/system';
  import { useRoute } from 'vue-router';
  import { DEVICE_TYPE_ENUM,PTZ_TYPE_ENUM } from '/@/enums/commonEnum';
  import { doPlayStart} from '/@/api/video/paly';
  import { doDeviceChannelPage ,doDelDeviceChannel} from '/@/api/video/deviceChannel';
  import DeviceChannelDrawer from './DeviceChannelDrawer.vue';
  import {PlayModel} from '/@/components/Video/index';

  const tableRef = ref<VxeGridInstance>();
  const { hasPermission } = usePermission();
  const systemStore = useSystemStore();
  const route = useRoute();
  const formData = reactive({
    deviceId: route.params?.id,
  });

  const onlineTypes = computed(() => {
    const template = systemStore.getDictMap[DEVICE_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
  const [register, { openDrawer }] = useDrawer();
  const [registerModal, { openModal }] = useModal();

  const gridOptions = reactive<BasicTableProps>({
    id: 'VxeTable',
    keepSource: true,
    showOverflow: true,
    //height: 'auto',
    stripe: false,
    //loading: true,
    editConfig: { trigger: 'click', mode: 'row', showStatus: true },
    scrollY: { enabled: false },
    rowConfig: { keyField: 'id' },
    checkboxConfig: { labelField: 'id' },
    treeConfig: {
      transform: false,
      accordion: true,
      rowField: 'channelId',
      parentField: 'parentId',
      children: 'children',
    },
    proxyConfig: {
      props: {
        list: 'data',
      },
      ajax: {
        query: async ({ page, form }) => {
          return await doDeviceChannelPage({
            deviceId:formData.deviceId,
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            ...form,
          });
        },
      },
    },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      buttons: [
        {
          content: '添加',
          buttonRender: {
            name: 'AButton',
            props: {
              type: 'primary',
              //preIcon: 'mdi:page-next-outline',
            },
            events: {
              click: () => handleAdd(),
            },
          },
        },
      ],
    },
    formConfig: {
      enabled: true,
      items: getFormConfig(),
    },
    columns: getBasicColumns(),
  });
  //播放
  const handlePlay = async(data)=>{
    //const values = await doPlayStart({ deviceId:data.deviceId,channelId:data.channelId});
    openModal(true, {});
  }
  //历史回放
  const handleRecord = (data) =>{
    go('/video/play/record/'+data.deviceId+'/'+data.channelId);
  }
  function handleAdd() {
    openDrawer(true, { 
      deviceId:formData.deviceId,
      channelId: undefined, 
      isUpdate: false 
    });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      channelId: record.channelId,
      deviceId:formData.deviceId,
      isUpdate: true,
    });
  }
  const handleSuccess = () => {
   //刷新表单
   unref(tableRef)?.commitProxy('reload');
  };
  async function handleDelete(record: Recordable) {
    //删除
    await doDelDeviceChannel({ deviceId: record.deviceId ,channelId: record.channelId});
     //刷新表单
    unref(tableRef)?.commitProxy('reload');
  }

  function getFormConfig(): VxeFormItemProps[] {
    return [
      {
        field: 'online',
        title: '通道状态',
        itemRender: {
          name: 'ASelect',
          props:{
            options: onlineTypes,
          }
        },
        span: 6,
      },
      {
        span: 18,
        align: 'right',
        className: '!pr-0',
        itemRender: {
          name: 'AButtonGroup',
          children: [
            {
              props: { type: 'primary', htmlType: 'submit', content: '查询' },
              //attrs: { class: 'mr-2' },
            },
            { props: { type: 'default', htmlType: 'reset', content: '重置' } },
          ],
        },
      },
    ];
  }

  function getBasicColumns(): VxeGridPropTypes.Columns {
    return [
      {
        title: '编号',
        treeNode: true,
        type: 'seq',
        fixed:'left',
        field: 'id',
        width: 100,
      },
      {
        title: '通道国标编号',
        field: 'channelId',
        fixed:'left',
        showOverflow: 'tooltip',
        width: 200,
      },
      {
        title: '父级国标',
        field: 'parentId',
        width: 200,
      },
      {
        title: '通道名称',
        field: 'name',
        width: 100,
      },
      {
        title: '通道状态',
        field: 'status',
        width: 100,
        slots: {
          default: ({ row }) => {
            const status = row.status;
            const enable = ~~status === 1;
            const color = enable ? 'green' : 'red';
            const text = enable ? '在线' : '离线';
            return h(Tag, { color: color }, () => text);
          },
        },
      },
      {
        title: '音频状态',
        field: 'hasAudio',
        width: 100,
        slots: {
          default: ({ row }) => {
            const status = row.hasAudio;
            const enable = ~~status === 1;
            const color = enable ? 'green' : 'red';
            const text = enable ? '开启' : '关闭';
            return h(Tag, { color: color }, () => text);
          },
        },
      },
      {
        title: '云台类型',
        field: 'ptzType',
        width: 100,
        slots: {
          default: ({row})=>{
            const template = systemStore.getDictMap[PTZ_TYPE_ENUM];
            return h(Tag, { color: 'green' }, () => template[row.ptzType]);
          },
        },
      },
      {
        title: '位置',
        field: 'longitude',
        width: 150,
        slots: {
          default: ({row})=>{
            return row.latitude+','+row.longitude
          },
        },
      },
      {
        title: '安装地址',
        field: 'address',
        width: 100,
      },
      {
        title: '厂商',
        field: 'manufacture',
        width: 150,
      },
      {
        title: '型号',
        field: 'model',
        width: 100,
      },
      {
        title: '设备归属',
        field: 'owner',
        width: 150,
      },
      {
        minWidth:100,
        title: '操作',
        align: 'center',
        slots: { default: 'action' },
        fixed: 'right',
      },
    ];
  }
  const go = useGo();
  // 此处可以得到用户ID
  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/video/play');
  }
  
</script>
