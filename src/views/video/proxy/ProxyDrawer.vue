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
  import { doProxyDetail, doProxySave } from '/@/api/video/proxy';
  import { PROXY_TYPE_ENUM,PROXY_RTP_TYPE_ENUM} from '/@/enums/commonEnum';
  import { useSystemStore } from '/@/store/modules/system';

  const emit = defineEmits(['success', 'register']);
  const systemStore = useSystemStore();
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增拉流' : '编辑拉流'));


  const handleOk = async () => {
    try {
      const { enable,enableAudio,enableMp4,enableRemoveNoneReader,enableDisableNoneReader,type,url,srcUrl, ...values } = await validate();
      await doProxySave({
        ...values,
        type:type,
        url:type===1?url:'',
        srcUrl:type===1?'':url,
        enable: enable === true ? 1 : 0,
        enableAudio: enableAudio === true ? 1 : 0,
        enableMp4: enableMp4 === true ? 1 : 0,
        enableRemoveNoneReader: enableRemoveNoneReader === true ? 1 : 0,
        enableDisableNoneReader: enableDisableNoneReader === true ? 1 : 0,
      });
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  const proxyTypes = computed(() => {
    const template = systemStore.getDictMap[PROXY_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
  const proxyRtpTypes = computed(() => {
    const template = systemStore.getDictMap[PROXY_RTP_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
  
  const schemasDevice: FormSchema[] = [
    {
      field: 'app',
      component: 'Input',
      label: '应用名',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'stream',
      component: 'Input',
      label: '流ID',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'name',
      component: 'Input',
      label: '名称',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'name',
      component: 'Input',
      label: '名称',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'url',
      component: 'Input',
      label: '拉流地址',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'timeoutMs',
      component: 'InputNumber',
      label: '超时时间(毫秒)',
      colProps: {
        span: 12,
      },
      componentProps: {
        min:1000,
        max:60000
      },
      defaultValue: 10000,
    },
    {
      field: 'type',
      component: 'Select',
      label: '拉流类型',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: proxyTypes,
      },
      defaultValue: 1,
      required: true,
    },
    {
      field: 'rtpType',
      component: 'Select',
      label: '拉流方式',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: proxyRtpTypes,
      },
      defaultValue: 1,
      required: true,
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
      field: 'enableAudio',
      component: 'Switch',
      label: '启用音频',
      colProps: {
        span: 12,
      },
      defaultValue: false,
    },
    {
      field: 'enableMp4',
      component: 'Switch',
      label: '启用MP4',
      colProps: {
        span: 12,
      },
      defaultValue: false,
    },
    {
      field: 'enableRemoveNoneReader',
      component: 'Switch',
      label: '无人观看删除',
      colProps: {
        span: 12,
      },
      defaultValue: false,
    },
    
    {
      field: 'enableDisableNoneReader',
      component: 'Switch',
      label: '无人观看停用',
      colProps: {
        span: 12,
      },
      defaultValue: true,
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
      const { enable,enableAudio,enableMp4,enableRemoveNoneReader,enableDisableNoneReader,type,url,srcUrl ,...entity } = await doProxyDetail({ id: data.id });
      const proxyUrl =type===1?url:srcUrl;
      setFieldsValue({
        ...entity,
        type:type,
        url:proxyUrl,
        enable: enable === 1 ? true : false,
        enableAudio: enableAudio === 1 ? true : false,
        enableMp4: enableMp4 === 1 ? true : false,
        enableRemoveNoneReader: enableRemoveNoneReader === 1 ? true : false,
        enableDisableNoneReader: enableDisableNoneReader === 1 ? true : false,
      });
    }
  });

</script>
