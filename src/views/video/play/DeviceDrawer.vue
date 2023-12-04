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
  import { ref, unref, computed,reactive } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { TRANSPORT_TYPE_ENUM ,CHARSET_TYPE_ENUM,TREE_TYPE_ENUM,GEO_COORD_SYS_TYPE_ENUM,STREAM_MODE_TYPE_ENUM} from '@/enums/commonEnum';
  import { useSystemStore } from '@/store/modules/system';
  import { doFindDeviceId,doSaveDevice } from '@/api/video/device';
  import { doMediaPage } from '@/api/video/mediaServer';
  import { debounce } from 'lodash-es';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增设备' : '编辑设备'));
  const systemStore = useSystemStore();

  const stats = reactive({
    query:"",
  });

  const handleOk = async () => {
    try {
      const { ssrcCheck, asMessageChannel,hasAdministrator, ...values } = await validate();
      if (!unref(isUpdate)) {
        //新增
        await doSaveDevice({
            ...values,
            ssrcCheck: ssrcCheck === true ? 1 : 0,
            asMessageChannel: asMessageChannel === true ? 1 : 0,
            hasAdministrator: hasAdministrator === true ? 1 : 0,
          });
      } else {
        //修改
        await doSaveDevice({
          ...values,
          ssrcCheck: ssrcCheck === true ? 1 : 0,
          asMessageChannel: asMessageChannel === true ? 1 : 0,
          hasAdministrator: hasAdministrator === true ? 1 : 0,
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
  const geoCoordSysTypes = computed(() => {
    const template = systemStore.getDictMap[GEO_COORD_SYS_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
  const streamModeTypes = computed(() => {
    const template = systemStore.getDictMap[STREAM_MODE_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
  
  const schemasDevice: FormSchema[] = [
    {
      field: 'id',
      show: false,
      component: 'Input',
      label: '编号',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'deviceId',
      component: 'Input',
      label: '设备国标编号',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'name',
      component: 'Input',
      label: '设备名',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'mediaServerId',
      label: '流媒体',
      colProps: {
        span: 12,
      },
      component: 'ApiSelect',
      componentProps: {
        api: doMediaPage,
        filterable: true,
        multiple: true,
        allowCreate: true,
        showSearch: true,
        filterOption: false,
        params: computed(()=> {return { query: stats.query, pageSize: 20 }}),
        onSearch: debounce((value)=>{
          return stats.query = value;
        },300),
        onChange: ()=>{stats.query = '';},
        resultField:'data',
        labelField: 'ip',
        valueField: 'id',
      },
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
      field: 'password',
      component: 'Input',
      label: '设备密码',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'sdpIp',
      component: 'Input',
      label: '收流IP',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'charset',
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
      field: 'treeType',
      component: 'Select',
      label: '设备类型',
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
      field: 'geoCoordSys',
      component: 'Select',
      label: '地理坐标系',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: geoCoordSysTypes,
      },
      defaultValue: 1,
      required: true,
    },
    {
      field: 'streamMode',
      component: 'Select',
      label: '数据流传输模式',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: streamModeTypes,
      },
      defaultValue: 1,
      required: true,
    },
    {
      field: 'mobilePositionSubmissionInterval',
      component: 'InputNumber',
      label: '位置上报周期(s)',
      colProps: {
        span: 12,
      },
      componentProps: {
        min: 0,
      },
      defaultValue: 0,
      required: true,
    },
    {
      field: 'subscribeCycleForCatalog',
      component: 'InputNumber',
      label: '目录订阅周期(s)',
      colProps: {
        span: 12,
      },
      componentProps: {
        min: 0,
      },
      defaultValue: 0,
      required: true,
    },
    {
      field: 'subscribeCycleForMobilePosition',
      component: 'InputNumber',
      label: '位置订阅周期(s)',
      colProps: {
        span: 12,
      },
      componentProps: {
        min: 0,
      },
      defaultValue: 0,
      required: true,
    },
    {
      field: 'subscribeCycleForAlarm',
      component: 'InputNumber',
      label: '报警订阅周期(s)',
      colProps: {
        span: 12,
      },
      componentProps: {
        min: 0,
      },
      defaultValue: 0,
      required: true,
    },
    {
      field: 'ssrcCheck',
      component: 'Switch',
      label: '开启ssrc校验',
      colProps: {
        span: 12,
      },
      defaultValue: false,
      required: true,
    },
    {
      field: 'asMessageChannel',
      component: 'Switch',
      label: '是否为消息通道',
      colProps: {
        span: 12,
      },
      defaultValue: false,
      required: true,
    },
    {
      field: 'hasAdministrator',
      helpMessage:'开启后普通用户无法看到当前设备',
      component: 'Switch',
      label: '开启数据限制',
      colProps: {
        span: 12,
      },
      defaultValue: false,
      required: true,
    },
  ];

  const [registerDeviceForm, { setFieldsValue, validate,resetFields }] = useForm({
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
      const { ssrcCheck,asMessageChannel,hasAdministrator, ...entity } = await doFindDeviceId({ deviceId: data.deviceId });
      setFieldsValue({
        ...entity,
        ssrcCheck: ssrcCheck ===  1 ? true : false,
        asMessageChannel: asMessageChannel ===  1 ? true : false,
        hasAdministrator: hasAdministrator === 1 ? true : false,
      });
    }
  });

</script>
