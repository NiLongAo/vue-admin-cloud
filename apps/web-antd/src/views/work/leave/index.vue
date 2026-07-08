<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { LeaveEntity } from '#/api/oa/leave';

import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { doDeleteLeave, doFindLeave, doInsertLeave } from '#/api/oa/leave';

import ProcessDetailShell from '../oa/components/ProcessDetailShell.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const leaveData = ref<LeaveEntity>();
const routeParam = computed(() => String(route.params.id ?? 'undefined'));
const routeParts = computed(() => routeParam.value.split(':'));
const businessKey = computed(() => routeParts.value[0] ?? 'undefined');
const mode = computed(() => (routeParts.value[1] === '1' ? '1' : '2'));
const taskId = computed(() => routeParts.value[2] ?? '');
const instanceId = computed(() => leaveData.value?.processInstanceId ?? '');
const readonly = computed(() => !!instanceId.value || mode.value === '2');

const schema: VbenFormSchema[] = [
  {
    component: 'DatePicker',
    componentProps: {
      class: 'w-full',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    fieldName: 'startTime',
    label: '开始时间',
    rules: 'required',
  },
  {
    component: 'DatePicker',
    componentProps: {
      class: 'w-full',
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    fieldName: 'endTime',
    label: '结束时间',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 0.5,
      precision: 1,
    },
    controlClass: 'w-full',
    fieldName: 'day',
    label: '天数',
    rules: 'required',
  },
  {
    component: 'Textarea',
    componentProps: {
      rows: 4,
    },
    fieldName: 'memo',
    label: '备注',
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema,
  showDefaultActions: false,
});

function setReadonlyForm() {
  formApi.updateSchema(
    schema.map((item) => ({
      componentProps: {
        disabled: true,
      },
      fieldName: item.fieldName,
    })),
  );
}

async function init() {
  if (!businessKey.value || businessKey.value === 'undefined') {
    return;
  }
  const data = await doFindLeave({ id: businessKey.value });
  if (!data) {
    message.warning('请假记录不存在或已删除');
    return;
  }
  leaveData.value = data;
  formApi.setValues(data);
  if (readonly.value) {
    setReadonlyForm();
  }
}

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  try {
    await doInsertLeave((await formApi.getValues()) as LeaveEntity);
    message.success('请假申请已提交');
    router.back();
  } finally {
    loading.value = false;
  }
}

function onDelete() {
  if (!businessKey.value || businessKey.value === 'undefined') {
    return;
  }
  Modal.confirm({
    async onOk() {
      await doDeleteLeave({ id: businessKey.value });
      message.success('请假申请已删除');
      router.back();
    },
    content: '确定删除该请假申请？',
    title: '删除请假申请',
  });
}

onMounted(() => {
  init();
});
</script>

<template>
  <ProcessDetailShell
    :instance-id="instanceId"
    :loading="loading"
    :mode="mode"
    :task-id="taskId"
    title="请假申请"
    @save="onSubmit"
  >
    <template #content>
      <div class="mx-auto max-w-[760px]">
        <Form />
        <div
          v-if="taskId"
          class="mt-4 text-center text-xs text-muted-foreground"
        >
          当前任务：{{ taskId }}
        </div>
      </div>
    </template>
    <template #footer-extra>
      <Button
        v-if="businessKey !== 'undefined' && !readonly"
        danger
        @click="onDelete"
      >
        删除
      </Button>
    </template>
  </ProcessDetailShell>
</template>
