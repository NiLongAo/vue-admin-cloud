<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="详情"
    width="40%"
    showFooter
    destroyOnClose
  >
    <div>
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { doLogsDetail } from '/@/api/sys/logs';
  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: '编号',
      colProps: {
        span: 24,
      },
      componentProps: { disabled: true },
    },
    {
      field: 'type',
      component: 'Input',
      label: '日志类型',
      colProps: {
        span: 24,
      },
      componentProps: { disabled: true },
    },
    {
      field: 'ip',
      component: 'Input',
      label: '访问者ip',
      colProps: {
        span: 24,
      },
      componentProps: { disabled: true },
    },
    {
      field: 'ipAttribution',
      component: 'Input',
      label: '网络地址',
      colProps: {
        span: 24,
      },
      componentProps: { disabled: true },
    },
    {
      field: 'method',
      component: 'Input',
      label: '请求方式',
      colProps: {
        span: 24,
      },
      componentProps: { disabled: true },
    },
    {
      field: 'duration',
      component: 'InputNumber',
      label: '持续时间(ms)',
      colProps: {
        span: 24,
      },
      componentProps: { disabled: true },
    },
    {
      field: 'param',
      component: 'InputTextArea',
      label: '请求参数',
      colProps: {
        span: 24,
      },
      componentProps: {
        disabled: true,
        autosize: true,
      },
    },
    {
      field: 'result',
      component: 'InputTextArea',
      label: '响应参数',
      colProps: {
        span: 24,
      },
      componentProps: {
        disabled: true,
        autosize: true,
      },
    },
    {
      field: 'createTime',
      component: 'Input',
      label: '访问时间',
      colProps: {
        span: 24,
      },
      componentProps: {
        disabled: true,
      },
    },
  ];
  const [registerForm, { setFieldsValue, resetFields }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  //初始化页面
  const [register, { setDrawerProps }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    const configInfo = await doLogsDetail({
      id: data.id,
    });
    setFieldsValue({
      ...configInfo,
    });
  });
</script>
