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
  import { doInsert, doUpdate, doDetail } from '/@/api/sys/mobileMessageTemplate';
  import { ref, unref, computed } from 'vue';
  import { useSystemStore } from '/@/store/modules/system';
  import { MOBILE_MESSAGE_TEMPLATE_TYPES } from '/@/enums/commonEnum';

  const isUpdate = ref(true);
  const configId = ref();
  const emit = defineEmits(['success', 'register']);
  const systemStore = useSystemStore();
  const templateTypes = computed(() => {
    const template = systemStore.getEnumMap[MOBILE_MESSAGE_TEMPLATE_TYPES];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
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
      field: 'configId',
      show: false,
      component: 'Input',
      label: '短信配置编号',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'title',
      component: 'Input',
      label: '标题',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'code',
      component: 'Input',
      label: '唯一编码',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'type',
      component: 'Select',
      label: '类型',
      colProps: {
        span: 24,
      },
      required: true,
      componentProps: {
        options: templateTypes,
      },
    },
    {
      field: 'receiver',
      component: 'Input',
      label: '接收人',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'content',
      component: 'InputTextArea',
      label: '内容',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'variable',
      component: 'InputTextArea',
      label: '变量',
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
  const getTitle = computed(() => (!unref(isUpdate) ? '新增短信模板' : '编辑短信模板'));
  const handleOk = async () => {
    try {
      const { isEnable, sort, ...values } = await validate();
      if (unref(isUpdate)) {
        //编辑
        await doUpdate({
          isEnable: isEnable === true ? 1 : 0,
          num: sort,
          ...values,
        });
      } else {
        //新增
        await doInsert({
          isEnable: isEnable === true ? 1 : 0,
          num: sort,
          ...values,
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
    configId.value = data.configId;
    let id = data.id;
    //更新表单下拉数据
    if (unref(isUpdate)) {
      const template = await doDetail({ id: id });
      setFieldsValue({
        configId: unref(configId),
        ...template,
      });
    } else {
      setFieldsValue({
        configId: unref(configId),
      });
    }
  });
</script>
