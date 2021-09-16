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
            :value="model[field] ? staticPath + model[field] : ''"
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
  import { UserInfoApi, doInsert, doUpdate } from '/@/api/sys/user';
  import { uploadApi } from '/@/api/sys/upload';
  import { isPhone, isIdCard } from '/@/utils/validate';
  import { useSystemStore } from '/@/store/modules/system';
  import { SystemEnum } from '/@/enums/systemEnum';
  import { ref, unref } from 'vue';
  const isUpdate = ref(true);
  const emit = defineEmits(['success', 'register']);
  const upload = uploadApi as any;
  const staticPath = ref({});
  const systemStore = useSystemStore();
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
      rules: [
        {
          required: true,
          message: '手机号格式错误',
          validator(_, value) {
            if (!isPhone(value)) {
              return Promise.reject('值不能为空');
            }
            return Promise.resolve();
          },
        },
      ],
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
            label: '隐藏',
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
      rules: [
        {
          required: true,
          message: '身份证格式错误',
          validator(_, value) {
            if (!isIdCard(value)) {
              return Promise.reject('值不能为空');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'isAdmin',
      component: 'Switch',
      label: '是否系统管理员',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'isEnabled',
      component: 'Switch',
      label: '是否禁止登录',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'address',
      component: 'Cascader',
      label: '地址',
      colProps: {
        span: 24,
      },
      componentProps: {
        options: systemStore.getAreaList,
      },
      defaultValue: '',
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
      const { isAdmin, isEnabled } = values;
      if (unref(isUpdate)) {
        //修改
        await doUpdate({
          ...values,
          isAdmin: isAdmin === true ? 1 : 0,
          isEnabled: isEnabled === true ? 1 : 0,
        });
      } else {
        //新增
        await doInsert({
          ...values,
          isAdmin: isAdmin === true ? 1 : 0,
          isEnabled: isEnabled === true ? 1 : 0,
        });
      }
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  const handleFileVal = (data) => {
    setFieldsValue({ imageUrl: data.path, allImageUrl: data.fullPath });
  };
  //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    staticPath.value = systemStore.getSystemConfigMap[SystemEnum.SYSTEM_PATH];
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = data.isUpdate;
    if (unref(isUpdate)) {
      const userInfo = await UserInfoApi({ id: data.userId });
      const { isAdmin, isEnabled } = userInfo;
      setFieldsValue({
        ...userInfo,
        isAdmin: isAdmin === 0 ? false : true,
        isEnabled: isEnabled === 0 ? false : true,
      });
    }
  });
</script>
