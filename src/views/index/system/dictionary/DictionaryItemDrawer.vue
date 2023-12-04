<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="编辑字典条目"
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
  import { doDictionaryItemSave, doDictionaryItemDetail } from '@/api/sys/dictionary';

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
      field: 'typeId',
      show: false,
      component: 'Input',
      label: '字典类型编号',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'name',
      component: 'Input',
      label: '字典条目名称',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'value',
      component: 'Input',
      label: '字典条目值',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'sort',
      component: 'Input',
      label: '排序',
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
      const { isEnable, sort, ...values } = await validate();
      //新增
      await doDictionaryItemSave({
        isEnable: isEnable === true ? 1 : 0,
        num: sort,
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
    let id = data.id;

    //更新表单下拉数据
    if (id) {
      const dictionaryType = await doDictionaryItemDetail({ id: id });
      setFieldsValue({
        typeId: data.typeId,
        ...dictionaryType,
      });
    } else {
      setFieldsValue({
        typeId: data.typeId,
      });
    }
  });
</script>
