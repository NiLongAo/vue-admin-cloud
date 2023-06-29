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
  import { doPushDetail, doPushSave } from '/@/api/video/push';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增推流' : '编辑推流'));


  const handleOk = async () => {
    try {
      const { enable,enableAudio,enableMp4,enableRemoveNoneReader,enableDisableNoneReader,type,url,srcUrl, ...values } = await validate();
      await doPushSave({
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
      field: 'gbId',
      component: 'Input',
      label: '国标编号',
      colProps: {
        span: 12,
      },
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
      const { ...entity } = await doPushDetail({ id: data.id });
      setFieldsValue({
        ...entity,
      });
    }
  });

</script>
