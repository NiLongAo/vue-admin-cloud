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
  import { doMediaDetail, doMediaSave } from '/@/api/video/mediaServer';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增流媒体' : '编辑流媒体'));


  const handleOk = async () => {
    try {
      const { enable,sslStatus,autoConfig,rtpEnable,defaultServer, ...values } = await validate();
      await doMediaSave({
        ...values,
        enable: enable === true ? 1 : 0,
        sslStatus: sslStatus === true ? 1 : 0,
        autoConfig: autoConfig === true ? 1 : 0,
        rtpEnable: rtpEnable === true ? 1 : 0,
        defaultServer: defaultServer === true ? 1 : 0,
      });
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };
  
  const schemasDevice: FormSchema[] = [
    {
      field: 'ip',
      component: 'Input',
      label: '流媒体IP',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'sdpIp',
      component: 'Input',
      label: 'SDPIP',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'streamIp',
      component: 'Input',
      label: '流IP',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'hookIp',
      component: 'Input',
      label: '回调服务IP',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'httpPort',
      component: 'InputNumber',
      label: 'HTTP端口',
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
      field: 'httpSslPort',
      component: 'InputNumber',
      label: 'HTTPS端口',
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
      field: 'rtmpPort',
      component: 'InputNumber',
      label: 'RTMP端口',
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
      field: 'rtmpSslPort',
      component: 'InputNumber',
      label: 'RTMPS端口',
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
      field: 'rtpProxyPort',
      component: 'InputNumber',
      label: 'RTP收流端口',
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
      field: 'rtspPort',
      component: 'InputNumber',
      label: 'RTSP端口',
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
      field: 'rtspSslPort',
      component: 'InputNumber',
      label: 'RTSPS端口',
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
      field: 'rtpPortRange',
      component: 'Input',
      label: 'RTP端口范围',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'hookAliveInterval',
      component: 'InputNumber',
      label: '心跳触发间隔',
      colProps: {
        span: 12,
      },
      componentProps: {
        min:10,
        max:3600
      },
      defaultValue: 10,
      required: true,
    },
    {
      field: 'secret',
      component: 'Input',
      label: '鉴权参数',
      colProps: {
        span: 12,
      },
      required: true,
      defaultValue:'035c73f7-bb6b-4889-a715-d9eb2d1925cc'
    },
    {
      field: 'enable',
      component: 'Switch',
      label: '是否启用',
      colProps: {
        span: 12,
      },
      defaultValue:true,
    },
    {
      field: 'defaultServer',
      component: 'Switch',
      label: '默认ZLM',
      colProps: {
        span: 12,
      },
      defaultValue:true,
    },
    {
      field: 'sslStatus',
      component: 'Switch',
      label: '是否SSL',
      colProps: {
        span: 12,
      },
      defaultValue:false,
    },
    {
      field: 'rtpEnable',
      component: 'Switch',
      label: '多端口模式',
      colProps: {
        span: 12,
      },
      defaultValue:true,
    },
    
    {
      field: 'autoConfig',
      component: 'Switch',
      label: '自动配置ZLM',
      colProps: {
        span: 12,
      },
      defaultValue:true,
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
      const { enable,sslStatus,autoConfig,rtpEnable,defaultServer, ...entity } = await doMediaDetail({ id: data.id });
      setFieldsValue({
        ...entity,
        enable: enable === 1 ? true : false,
        sslStatus: sslStatus === 1 ? true : false,
        autoConfig: autoConfig === 1 ? true : false,
        rtpEnable: rtpEnable === 1 ? true : false,
        defaultServer: defaultServer === 1 ? true : false,
      });
    }
  });

</script>
