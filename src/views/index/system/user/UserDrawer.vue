<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="修改用户"
    width="40%"
    showFooter
    @ok="handleOk"
  >
    <div>
      <BasicForm @register="registerForm">
        <template #imageUrl="{ model, field }">
          <CropperAvatar
            :uploadApi="upload"
            width="80px"
            :value="model[field]"
            @change="handleFileVal"
          />
        </template>
      </BasicForm>
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { CropperAvatar } from '/@/components/Cropper';
  import { UserInfoApi } from '/@/api/sys/user';
  import { uploadApi } from '/@/api/sys/upload';
  import { ref, unref } from 'vue';
  const isUpdate = ref(true);
  const emit = defineEmits(['success', 'register']);
  const upload = uploadApi as any;
  const schemas: FormSchema[] = [
    {
      field: 'imageUrl',
      component: 'Input',
      label: '图像',
      slot: 'imageUrl',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'userName',
      component: 'Input',
      label: '用户名',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'nickName',
      component: 'Input',
      label: '昵称',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'phone',
      component: 'Input',
      label: '手机号',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'gender',
      component: 'RadioGroup',
      label: '性别',
      colProps: {
        span: 24,
      },
      componentProps: {
        options: [
          {
            label: '男',
            value: 1,
          },
          {
            label: '女',
            value: 2,
          },
          {
            label: '未知',
            value: 0,
          },
        ],
      },
    },
    {
      field: 'idCard',
      component: 'Input',
      label: '身份证',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'address',
      component: 'Input',
      label: '地址',
      colProps: {
        span: 24,
      },
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
      setDrawerProps({ confirmLoading: true });
      if (unref(isUpdate)) {
        //修改
      } else {
        //新增
      }
      console.log(values);
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  const handleFileVal = (data) => {
    setFieldsValue({ imageUrl: data });
  };
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = data.isUpdate;
    if (unref(isUpdate)) {
      const userInfo = await UserInfoApi({ id: data.userId });
      setFieldsValue({
        ...userInfo,
      });
    }
  });
</script>
