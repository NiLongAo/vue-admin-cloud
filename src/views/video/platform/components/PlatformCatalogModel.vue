<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { computed,reactive } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { doPlatformCatalogInsert ,doPlatformCatalogUpdate} from '/@/api/video/platform';

  const emit = defineEmits(['success', 'register']);
  const getTitle = computed(() => (stats.isUpdate ?'编辑目录': '新增目录'));
  const isUpdate = computed(() => stats.isUpdate);
  const stats = reactive({
    isUpdate : true as boolean,
    data:{} as any,
  });

  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: '目录编号',
      colProps: {
        span: 24,
      },
      required: true,
      componentProps: { 
        disabled: isUpdate 
      },
    },
    {
      field: 'name',
      component: 'Input',
      label: '目录名称',
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
  const handleSubmit = async () => {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      if(stats.isUpdate){
        await  doPlatformCatalogUpdate({
          ...values
        });
      }else{
        await  doPlatformCatalogInsert({
          ...values,
          parentId:stats.data.id,
          platformId:stats.data.platformId,
        });
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  //初始化页面
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    const {isUpdate ,node} = data;
    stats.isUpdate = isUpdate;
    stats.data = node;
    console.log(stats.data);
    if (isUpdate) {
      setFieldsValue({
        id: node.id,
        name : node.name.el.innerText,
      });
    }
  });
</script>