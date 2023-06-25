<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
    width="35%"
    showFooter
    @ok="handleOk"
  >
    <div>
      <BasicForm @register="registerDeviceForm" />
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { doPlatformDetail, doPlatformInsert,doPlatformUpdate } from '/@/api/video/platform';
  import { TRANSPORT_TYPE_ENUM ,CHARSET_TYPE_ENUM,TREE_TYPE_ENUM} from '/@/enums/commonEnum';
  import { useSystemStore } from '/@/store/modules/system';
  import { isEmpty } from '/@/utils/is';

  const emit = defineEmits(['success', 'register']);
  const systemStore = useSystemStore();
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增平台' : '编辑平台'));


  const handleOk = async () => {
    try {
      const { enable,rtcp,ptz,startOfflinePush,asMessageChannel, ...values } = await validate();
      if(unref(isUpdate)){
        await doPlatformUpdate({
        ...values,
        enable: enable === true ? 1 : 0,
        rtcp: rtcp === true ? 1 : 0,
        ptz: ptz === true ? 1 : 0,
        startOfflinePush: startOfflinePush === true ? 1 : 0,
        asMessageChannel: asMessageChannel === true ? 1 : 0,
      });
      }else{
        await doPlatformInsert({
        ...values,
        enable: enable === true ? 1 : 0,
        rtcp: rtcp === true ? 1 : 0,
        ptz: ptz === true ? 1 : 0,
        startOfflinePush: startOfflinePush === true ? 1 : 0,
        asMessageChannel: asMessageChannel === true ? 1 : 0,
      });
      }
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  const transportTypes = computed(() => {
    const template = systemStore.getDictMap[TRANSPORT_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
  const charsetTypes = computed(() => {
    const template = systemStore.getDictMap[CHARSET_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
  const treeTypes = computed(() => {
    const template = systemStore.getDictMap[TREE_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });

  const schemasDevice: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: '编号',
      show: false,
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'serverGbId',
      component: 'Input',
      label: 'SIP国标编码',
      colProps: {
        span: 12,
      },
      componentProps:{
        onChange:(val) =>{
          let {serverGbId:serverId,catalogId,administrativeDivision,serverGbDomain} = getFieldsValue();
          const serverGbId= val?.target?.value;
          if(val === serverId){
            return;
          }
          if(isEmpty(catalogId) || catalogId === serverId){
            setFieldsValue({
              catalogId:serverGbId,
            });
          }
          if(isEmpty(administrativeDivision) || administrativeDivision === serverId){
            administrativeDivision = serverGbId?.length >=6 ?serverGbId.slice(0, 6):val?.target?.value;
            setFieldsValue({
              administrativeDivision:administrativeDivision,
            });
          }
          if(isEmpty(serverGbDomain) || serverGbDomain === serverId){
            serverGbDomain = serverGbId?.length >=6 ?serverGbId.slice(0, 6):val?.target?.value;
            setFieldsValue({
              serverGbDomain:serverGbDomain,
            });
          }
        }
      },
      required: true,
    },
    {
      field: 'serverGbDomain',
      component: 'Input',
      label: 'SIP国标域',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'serverIp',
      component: 'Input',
      label: 'SIP服务IP',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'serverPort',
      component: 'InputNumber',
      label: 'SIP服务端口',
      colProps: {
        span: 12,
      },
      componentProps: {
        min:0,
        max:65535
      },
      defaultValue: 0,
      required: true,
    },
    {
      field: 'username',
      component: 'Input',
      label: 'SIP认证账号',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'password',
      component: 'Input',
      label: 'SIP认证密码',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'name',
      component: 'Input',
      label: 'SIP服务名称',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'administrativeDivision',
      component: 'Input',
      label: '行政区划',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'catalogId',
      component: 'Input',
      label: '目录编号',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'catalogGroup',
      component: 'Select',
      label: '目录分组',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: [
          {
            label:'1',
            value:1,
            key:'1',
          },
          {
            label:'2',
            value:2,
            key:'2',
          },
          {
            label:'4',
            value:4,
            key:'4',
          },
          {
            label:'8',
            value:8,
            key:'8',
          },
        ],
      },
      defaultValue: 1,
      required: true,
    },
    {
      field: 'deviceIp',
      component: 'Input',
      label: '设备IP',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'devicePort',
      component: 'InputNumber',
      label: '设备端口',
      colProps: {
        span: 12,
      },
      componentProps: {
        min:0,
        max:65535
      },
      defaultValue: 0,
      required: true,
    },
    {
      field: 'deviceGbId',
      component: 'Input',
      label: '设备国标编号',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'expires',
      component: 'InputNumber',
      label: '注册周期 (秒)',
      colProps: {
        span: 12,
      },
      componentProps: {
        min:30,
        max:68400
      },
      defaultValue: 30,
      required: true,
    },
    {
      field: 'keepTimeout',
      component: 'InputNumber',
      label: '心跳周期(秒)',
      colProps: {
        span: 12,
      },
      componentProps: {
        min:30,
        max:600
      },
      defaultValue: 30,
      required: true
    },
    {
      field: 'treeType',
      component: 'Select',
      label: '树类型',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: treeTypes,
      },
      defaultValue: 215,
      required: true,
    },
    {
      field: 'transport',
      component: 'Select',
      label: '传输协议',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: transportTypes,
      },
      required: true,
      defaultValue: 1,
    },
    {
      field: 'characterSet',
      component: 'Select',
      label: '字符集',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: charsetTypes,
      },
      defaultValue: 2,
      required: true,
    },
    {
      field: 'ptz',
      component: 'Switch',
      label: '云台控制',
      colProps: {
        span: 12,
      },
      defaultValue: true,
    },
    {
      field: 'rtcp',
      component: 'Switch',
      label: 'RTCP流保活',
      colProps: {
        span: 12,
      },
      defaultValue: false,
    },
    {
      field: 'startOfflinePush',
      component: 'Switch',
      label: '主动拉流',
      colProps: {
        span: 12,
      },
      defaultValue: true,
    },
    {
      field: 'enable',
      component: 'Switch',
      label: '是否启用',
      colProps: {
        span: 12,
      },
      defaultValue: true,
    },
    {
      field: 'asMessageChannel',
      component: 'Switch',
      label: '消息通道',
      colProps: {
        span: 12,
      },
      defaultValue: true,
    },
  ];

  const [registerDeviceForm, { setFieldsValue, validate,resetFields,getFieldsValue }] = useForm({
    labelWidth: 120,
    schemas: schemasDevice,
    showActionButtonGroup: false,
  });

    //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      const { enable,rtcp,ptz,startOfflinePush,asMessageChannel, ...entity } = await doPlatformDetail({ id: data.id });
      setFieldsValue({
        ...entity,
        enable: enable === 1 ? true : false,
        rtcp: rtcp === 1 ? true : false,
        ptz: ptz === 1 ? true : false,
        startOfflinePush: startOfflinePush === 1 ? true : false,
        asMessageChannel: asMessageChannel === 1 ? true : false,
      });
    }
  });

</script>
