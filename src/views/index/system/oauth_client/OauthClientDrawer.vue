<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
    width="40%"
    showFooter
    :showOkBtn="hasPermission('system.oauth_client:update')"
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
  import { doOauthClientDetail, doOauthClientSave } from '@/api/sys/oauthClient';
  import { useSystemStore } from '@/store/modules/system';
  import { DITE_AUTHORIZED_KEY } from '@/enums/commonEnum';
  import { ref, unref, computed } from 'vue';
  import { usePermission } from '@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const systemStore = useSystemStore();
  const authorizedGrantTypesOptions = computed(() => {
    const authorizedGrantTypes = systemStore.getDictMap[DITE_AUTHORIZED_KEY];
    const types = [] as any;
    Object.keys(authorizedGrantTypes).forEach((key) => {
      types.push({ label: authorizedGrantTypes[key], key: authorizedGrantTypes[key], value: key });
    });
    return types;
  });
  const schemas: FormSchema[] = [
    {
      field: 'clientId',
      component: 'Input',
      label: '客户端编号',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'resourceIds',
      component: 'Input',
      label: '资源编号列表',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'clientSecret',
      component: 'Input',
      label: '客户端密钥',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'scope',
      component: 'Input',
      label: '域',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'authorizedGrantTypes',
      component: 'Select',
      label: '授权方式',
      colProps: {
        span: 24,
      },
      componentProps: {
        mode: 'multiple',
        optionFilterProp: 'key',
        options: unref(authorizedGrantTypesOptions),
      },
      required: true,
    },
    {
      field: 'webServerRedirectUri',
      component: 'Input',
      label: '回调地址',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'authorities',
      component: 'Input',
      label: '权限列表',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'accessTokenValidity',
      component: 'InputNumber',
      label: '认证令牌时效(秒)',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'refreshTokenValidity',
      component: 'InputNumber',
      label: '刷新令牌时效(秒)',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'additionalInformation',
      component: 'Input',
      label: '扩展信息',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'autoapprove',
      component: 'Switch',
      label: '是否自动放行',
      colProps: {
        span: 24,
      },
      required: true,
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const handleOk = async () => {
    try {
      const { authorizedGrantTypes, autoapprove, ...values } = await validate();
      //新增
      await doOauthClientSave({
        ...values,
        autoapprove: autoapprove ? 'true' : 'false',
        authorizedGrantTypes: authorizedGrantTypes.join(','),
      });
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };
  const getTitle = computed(() => (!unref(isUpdate) ? '新增客户端' : '编辑客户端'));

  //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = data.isUpdate;
    if (data.isUpdate) {
      const { authorizedGrantTypes, autoapprove, ...entity } = await doOauthClientDetail({
        clientId: data.clientId,
      });
      setFieldsValue({
        ...entity,
        autoapprove: autoapprove === 'true' ? true : false,
        authorizedGrantTypes: authorizedGrantTypes.split(','),
      });
      updateSchema([
        {
          field: 'clientId',
          componentProps: { disabled: true },
        },
      ]);
    } else {
      updateSchema([
        {
          field: 'clientId',
          componentProps: { disabled: false },
        },
      ]);
    }
  });
</script>
