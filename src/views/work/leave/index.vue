<template>
  <Exanube :removeApi="doDelete" :instanceId="stats.processInstanceId" @save="save">
    <template #content>
      <BasicForm @register="registerForm" />
    </template>
  </Exanube>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { reactive, onMounted, unref } from 'vue';
  import Exanube from '../oa/common/Examine.vue';
  import { doFind, doInsert, doDelete } from '/@/api/oa/leave';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';

  const route = useRoute();

  const stats = reactive({
    // 业务主键
    businessKey: route.params?.id,
    // 表格中的值
    startTime: '',
    endTime: '',
    day: 0,
    processInstanceId: '',
    memo: '',
  });

  onMounted(() => {
    init();
  });
  const init = async () => {
    if (stats.businessKey === 'undefined') {
      return;
    }
    const { startTime, endTime, day, processInstanceId, memo } = await doFind({
      id: stats.businessKey,
    });
    stats.processInstanceId = processInstanceId;
    stats.startTime = startTime;
    stats.endTime = endTime;
    stats.day = day;
    stats.memo = memo;
    console.log(unref(stats));
    setFieldsValue(unref(stats));
    updateSchema([
      {
        field: 'startTime',
        componentProps: { disabled: !!stats.processInstanceId },
      },
      {
        field: 'endTime',
        componentProps: { disabled: !!stats.processInstanceId },
      },
      {
        field: 'day',
        componentProps: { disabled: !!stats.processInstanceId },
      },
      {
        field: 'memo',
        componentProps: { disabled: !!stats.processInstanceId },
      },
    ]);
  };

  const schemas: FormSchema[] = [
    {
      field: 'startTime',
      component: 'DatePicker',
      label: '开始时间',
      colProps: {
        span: 24,
      },
      defaultValue: stats.startTime,
      required: true,
    },
    {
      field: 'endTime',
      component: 'DatePicker',
      label: '结束时间',
      colProps: {
        span: 24,
      },
      defaultValue: stats.endTime,
      required: true,
      componentProps: { disabled: !!stats.processInstanceId },
    },
    {
      field: 'day',
      component: 'InputNumber',
      label: '天数',
      colProps: {
        span: 24,
      },
      defaultValue: stats.day,
      required: true,
      componentProps: { disabled: !!stats.processInstanceId },
    },
    {
      field: 'memo',
      component: 'InputTextArea',
      label: '备注',
      colProps: {
        span: 24,
      },
      defaultValue: stats.memo,
      componentProps: { disabled: !!stats.processInstanceId },
    },
  ];

  //初始化表单
  const [registerForm, { validate, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const save = async () => {
    const val: any = await validate();
    await doInsert(val);
  };
</script>
