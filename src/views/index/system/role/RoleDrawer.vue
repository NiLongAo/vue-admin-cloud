<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="修改角色"
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
  import { doDetail, doSave } from '@/api/sys/role';

  const emit = defineEmits(['success', 'register']);
  const schemas: FormSchema[] = [
    {
      field: 'id',
      show: false,
      component: 'Input',
      label: '编号',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'roleName',
      component: 'Input',
      label: '角色名称',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'memo',
      component: 'InputTextArea',
      label: '备注',
      colProps: {
        span: 24,
      },
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
      //新增
      await doSave({ ...values });
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
    let id = data.id;
    if (id) {
      const role = await doDetail({ id: id });
      setFieldsValue({
        ...role,
      });
    }
  });
</script>
