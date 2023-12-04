<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="编辑配置"
    width="40%"
    showFooter
    @ok="handleOk"
  >
    <div>
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { doConfigUpdate, doConfigDetail } from '@/api/sys/config';
  import { ref, unref } from 'vue';

  const isUpdate = ref(true);
  const emit = defineEmits(['success', 'register']);
  const schemas: FormSchema[] = [
    {
      field: 'k',
      component: 'Input',
      label: '配置键',
      colProps: {
        span: 24,
      },
      componentProps: { disabled: true },
    },
    {
      field: 'v',
      component: 'Input',
      label: '配置值',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'configName',
      component: 'Input',
      label: '配置名称',
      colProps: {
        span: 24,
      },
      required: true,
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const handleOk = async () => {
    try {
      const values = await validate();
      //修改
      await doConfigUpdate({
        ...values,
      });
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = data.isUpdate;
    if (unref(isUpdate)) {
      const configInfo = await doConfigDetail({
        k: data.k,
      });
      setFieldsValue({
        ...configInfo,
      });
    }
  });
</script>
