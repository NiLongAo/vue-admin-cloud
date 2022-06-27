<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
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
  import { ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { doTenantDetail, doTenantInsert, doTenantUpdate } from '/@/api/sys/tenant';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'));

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
      const { status, ...values } = await validate();
      if (!unref(isUpdate)) {
        //新增
        await doTenantInsert({ status: status === true ? 1 : 0, ...values });
      } else {
        //新增
        await doTenantUpdate({ status: status === true ? 1 : 0, ...values });
      }
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
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      const { status, ...entity } = await doTenantDetail({ id: data.id });
      setFieldsValue({
        status: status === 0 ? false : true,
        ...entity,
      });
    }
  });
</script>
