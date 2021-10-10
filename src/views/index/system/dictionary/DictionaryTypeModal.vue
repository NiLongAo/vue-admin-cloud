<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { doDictionaryTypeSave, doDictionaryTypeDetail } from '/@/api/sys/dictionary';

  const isUpdate = ref(true);
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
      field: 'code',
      component: 'Input',
      label: '字典类型编码',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'name',
      component: 'Input',
      label: '字典类型名称',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'status',
      component: 'Switch',
      label: '是否开启',
      colProps: {
        span: 24,
      },
      defaultValue: true,
    },
  ];

  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 100,
    schemas: schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增字典类型' : '编辑字典类型'));

  async function handleSubmit() {
    try {
      const { status, ...values } = await validate();
      setModalProps({ confirmLoading: true });
      // TODO custom api
      await doDictionaryTypeSave({ status: status === true ? 1 : 0, ...values });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      const { status, ...dictionaryType } = await doDictionaryTypeDetail({ id: data.id });
      setFieldsValue({
        status: status === 0 ? false : true,
        ...dictionaryType,
      });
    }
  });
</script>
