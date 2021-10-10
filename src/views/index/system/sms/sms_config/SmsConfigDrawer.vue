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
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { doDetail, doInsert, doUpdate } from '/@/api/sys/smsConfig';
  import { ref, unref, computed } from 'vue';
  import { useSystemStore } from '/@/store/modules/system';
  import { SMS_CONFIG_TYPES } from '/@/enums/commonEnum';

  const systemStore = useSystemStore();
  const isUpdate = ref(true);
  const emit = defineEmits(['success', 'register']);

  const smsConfigTypes = computed(() => {
    const authorizedGrantTypes = systemStore.getEnumMap[SMS_CONFIG_TYPES];
    const types = [] as any;
    Object.keys(authorizedGrantTypes).forEach((key) => {
      types.push({ label: authorizedGrantTypes[key], value: Number(key), key: Number(key) });
    });
    return types;
  });
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
      field: 'configName',
      component: 'Input',
      label: '配置名称',
      required: true,
      colProps: {
        span: 24,
      },
    },
    {
      field: 'account',
      component: 'Input',
      required: true,
      label: '账号',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'password',
      component: 'Input',
      required: true,
      label: '密码',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'smsType',
      component: 'Select',
      label: '类型',
      colProps: {
        span: 12,
      },
      required: true,
      componentProps: {
        options: smsConfigTypes,
      },
    },
    {
      field: 'balance',
      component: 'InputNumber',
      label: '余额',
      defaultValue: 0,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'isActive',
      component: 'Switch',
      defaultValue: true,
      label: '是否启用',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'signPlace',
      component: 'RadioButtonGroup',
      label: '签名位置',
      defaultValue: 1,
      colProps: {
        span: 12,
      },
      componentProps: {
        options: [
          {
            label: '左边',
            value: 1,
          },
          {
            label: '右边',
            value: 2,
          },
        ],
      },
    },
    {
      field: 'sign',
      component: 'Input',
      label: '签名',
      colProps: {
        span: 24,
      },
    },
  ];
  const getTitle = computed(() => (!unref(isUpdate) ? '新增短信配置' : '编辑短信配置'));
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
      const { isActive, ...values } = await validate();
      //新增
      if (unref(isUpdate)) {
        await doUpdate({
          ...values,
          isActive: isActive ? 1 : 0,
        });
      } else {
        await doInsert({
          ...values,
          isActive: isActive ? 1 : 0,
        });
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
    isUpdate.value = data.isUpdate;
    let id = data.id;
    if (unref(isUpdate)) {
      const { isActive, ...config } = await doDetail({ id: id });
      setFieldsValue({
        ...config,
        isActive: isActive === 1 ? true : false,
      });
    }
  });
</script>
