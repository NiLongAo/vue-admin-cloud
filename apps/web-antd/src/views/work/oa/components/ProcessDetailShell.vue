<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Empty,
  Image,
  message,
  Space,
  Spin,
  Steps,
  Tabs,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  doComplete,
  doFindHistoricalInstanceIdList,
  doFindInstanceIdDetail,
  doGetFlowImgByInstanceId,
} from '#/api/oa/activiti';

const props = withDefaults(
  defineProps<{
    data?: Recordable<any>;
    instanceId?: string;
    loading?: boolean;
    mode?: '1' | '2';
    taskId?: string;
    taskVariables?: Recordable<any>;
    title: string;
    variables?: Recordable<any>;
  }>(),
  {
    data: () => ({}),
    instanceId: '',
    loading: false,
    mode: '2',
    taskId: '',
    taskVariables: () => ({}),
    variables: () => ({}),
  },
);

const emit = defineEmits<{
  save: [];
}>();

const router = useRouter();
const activeTab = ref('detail');
const flowImage = ref('');
const detail = ref<Recordable<any>>({});
const stepList = ref<Recordable<any>[]>([]);
const loadingFlow = ref(false);
const submitting = ref(false);

const hasWorkflow = computed(() => !!props.instanceId);
const processVariables = computed(
  () => detail.value?.processVariables ?? props.variables ?? {},
);
const canApprove = computed(
  () =>
    hasWorkflow.value &&
    props.mode === '1' &&
    !!props.taskId &&
    processVariables.value?.status === 1,
);

const auditSchema: VbenFormSchema[] = [
  {
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '审核通过', value: 2 },
        { label: '审核驳回', value: 3 },
      ],
    },
    defaultValue: 2,
    fieldName: 'status',
    label: '审核状态',
    rules: 'required',
  },
  {
    component: 'Textarea',
    componentProps: {
      rows: 3,
    },
    fieldName: 'memo',
    label: '备注',
  },
];

const [AuditForm, auditFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: auditSchema,
  showDefaultActions: false,
});

function getStepComment(step: Recordable<any>) {
  return step.tackComment ?? step.taskComment ?? step.comment ?? {};
}

async function loadWorkflowInfo(instanceId: string) {
  loadingFlow.value = true;
  try {
    const [image, detailData, history] = await Promise.all([
      doGetFlowImgByInstanceId({ instanceId, useCustomColor: true }),
      doFindInstanceIdDetail({ instanceId }),
      doFindHistoricalInstanceIdList({ instanceId }),
    ]);
    flowImage.value = String(image || '');
    detail.value = (detailData as Recordable<any>) ?? {};
    stepList.value = Array.isArray(history) ? history : [];
  } finally {
    loadingFlow.value = false;
  }
}

async function onSubmitAudit() {
  const { valid } = await auditFormApi.validate();
  if (!valid) {
    return;
  }

  const values = (await auditFormApi.getValues()) as Recordable<any>;
  submitting.value = true;
  try {
    await doComplete({
      ...props.data,
      comment: { ...values },
      taskId: props.taskId,
      taskVariables: {
        ...props.taskVariables,
        examineMemo: values.memo,
        examineStatus: values.status,
      },
      variables: { ...props.variables },
    });
    message.success('审批已提交');
    router.back();
  } finally {
    submitting.value = false;
  }
}

function onSave() {
  emit('save');
}

watch(
  () => props.instanceId,
  (instanceId) => {
    if (instanceId) {
      loadWorkflowInfo(instanceId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <Page auto-content-height :title="title">
    <div class="flex h-full min-h-0 flex-col gap-4">
      <Tabs v-if="hasWorkflow" v-model:active-key="activeTab" class="shrink-0">
        <Tabs.TabPane key="detail" tab="详情" />
        <Tabs.TabPane key="flow" tab="流程图" />
      </Tabs>

      <div v-show="activeTab === 'detail'" class="min-h-0 flex-1">
        <Card class="h-full overflow-auto" :bordered="false">
          <slot name="content"></slot>
        </Card>
      </div>

      <Card
        v-if="canApprove && activeTab === 'detail'"
        class="shrink-0"
        :bordered="false"
      >
        <AuditForm />
      </Card>

      <div
        v-if="hasWorkflow"
        v-show="activeTab === 'flow'"
        class="min-h-0 flex-1"
      >
        <Spin :spinning="loadingFlow">
          <div
            class="grid min-h-0 gap-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]"
          >
            <Card title="审核信息" :bordered="false">
              <Steps
                v-if="stepList.length > 0"
                :current="stepList.length"
                direction="vertical"
                progress-dot
                size="small"
              >
                <Steps.Step
                  v-for="(step, index) in stepList"
                  :key="step.id ?? step.taskId ?? index"
                  :title="step.activityName ?? step.taskName ?? '-'"
                >
                  <template #description>
                    <p class="m-0">
                      审核人：{{ getStepComment(step).departmentName ?? '-' }}
                      {{ getStepComment(step).userName ?? '' }}
                    </p>
                    <p class="m-0">
                      审核状态：{{
                        getStepComment(step).statusName ?? '审核中'
                      }}
                    </p>
                    <p v-if="step.endTime" class="m-0">
                      审核时间：{{ step.endTime }}
                    </p>
                    <p v-if="getStepComment(step).memo" class="m-0">
                      备注：{{ getStepComment(step).memo }}
                    </p>
                  </template>
                </Steps.Step>
              </Steps>
              <Empty v-else description="暂无审核记录" />
            </Card>

            <Card title="流程图" :bordered="false">
              <Image
                v-if="flowImage"
                :preview="false"
                :src="flowImage"
                class="max-h-[calc(100vh-260px)] object-contain"
              />
              <Empty v-else description="暂无流程图" />
            </Card>
          </div>
        </Spin>
      </div>

      <div class="flex shrink-0 justify-center">
        <Space>
          <Button @click="router.back()">返回</Button>
          <slot name="footer-extra"></slot>
          <Button
            v-if="!hasWorkflow"
            :loading="loading"
            type="primary"
            @click="onSave"
          >
            提交
          </Button>
          <Button
            v-if="canApprove"
            :loading="submitting"
            type="primary"
            @click="onSubmitAudit"
          >
            审批提交
          </Button>
        </Space>
      </div>
    </div>
  </Page>
</template>
