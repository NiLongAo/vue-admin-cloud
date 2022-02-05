<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="修改职位"
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
  import { doPositionDetail, doPositionSave, doPositionTree } from '/@/api/sys/position';

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
      field: 'parentId',
      component: 'TreeSelect',
      label: '上级职位',
      colProps: {
        span: 24,
      },
      componentProps: {
        fieldNames: {
          label: 'positionName',
          key: 'id',
          value: 'id',
        },
        showSearch: true,
      },
      defaultValue: '',
    },
    {
      field: 'positionName',
      component: 'Input',
      label: '职位名称',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'isEnable',
      component: 'Switch',
      label: '是否开启',
      colProps: {
        span: 24,
      },
      defaultValue: false,
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
      const { isEnable, ...values } = await validate();
      //新增
      await doPositionSave({
        isEnable: isEnable === true ? 1 : 0,
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
    const treeData = await doPositionTree({ topName: '默认' });
    //更新表单下拉数据
    updateSchema([
      {
        field: 'parentId',
        componentProps: { treeData },
      },
    ]);
    if (id) {
      const { isEnable, parentId, ...department } = await doPositionDetail({ id: id });
      setFieldsValue({
        parentId: parentId === null ? '' : parentId,
        isEnable: isEnable === 0 ? false : true,
        ...department,
      });
    }
  });
</script>
