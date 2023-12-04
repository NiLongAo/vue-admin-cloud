<template>
  <PageWrapper
    class="high-form h-full"
    :title="getTital"
    @back="goBack"
    contentFullHeight
    contentClass="flex flex-col "
  >
    <template #footer>
      <Tabs v-if="getStatus" v-model:activeKey="stats.tabsKey">
        <TabsPane key="1" tab="详情" />
        <TabsPane key="2" tab="流程图" />
      </Tabs>
    </template>
    <!-- 内容卡槽 -->
    <Card
      v-show="stats.tabsKey === '1'"
      :bordered="false"
      class="flex-auto"
      :style="!getStatus ? `height:calc(100% - ${150}px)` : `height:100%`"
    >
      <slot name="content"></slot>
    </Card>
    <!-- 审核时信息 -->
    <Card
      :bordered="false"
      v-if="buttomType"
      v-show="stats.tabsKey === '1' && getStatus"
      class="!mt-5"
      style="height: 150px"
    >
      <div><BasicForm @register="registerForm" /> </div>
    </Card>
    <Card :bordered="false" class="flex-auto" :style="`height:100%`" v-show="stats.tabsKey == '2'">
      <div>
        <div class="w-full enter-y">
          <Card title="审核信息" :bordered="false" v-if="stats.stepList">
            <Steps :current="stats.stepList.length" progress-dot size="small" direction="vertical">
              <template v-for="(step, index) in stats.stepList" :key="index">
                <Step :title="step.activityName">
                  <template #description>
                    <p class="m-0" v-if="step.tackComment"
                      >审核人：{{ step.tackComment?.departmentName }}
                      {{ step.tackComment?.userName }}</p
                    >
                    <p class="m-0" v-if="step.tackComment"
                      >审核状态：{{
                        !step.tackComment.statusName ? '审核中' : step.tackComment.statusName
                      }}</p
                    >
                    <p class="m-0" v-if="step.endTime">审核时间：{{ step.endTime }}</p>
                    <p class="m-0" v-if="step.tackComment">备注：{{ step.tackComment.memo }}</p>
                  </template>
                </Step>
              </template>
            </Steps>
          </Card>
        </div>
        <div class="w-full !mr-4 enter-y">
          <Card title="流程图" :bordered="false">
            <Image :src="stats.images" :preview="false" class="object-contain object-bottom" />
          </Card>
        </div>
      </div>
    </Card>

    <!-- 按钮 -->
    <template #rightFooter>
      <!-- 发起审核按钮 -->
      <Button
        style="margin-right: 10px"
        :loading="stats.loading"
        type="primary"
        v-if="!getStatus && buttomType"
        @click="save()"
        >确定</Button
      >
      <!-- 提交审核按钮 -->
      <Button
        style="margin-right: 10px"
        :loading="stats.loading"
        type="primary"
        v-if="getStatus && getExamine && buttomType"
        @click="handleComplete()"
        >审核提交</Button
      >
      <!-- 取消按钮 -->
      <Button style="margin-right: 10px" :loading="stats.loading" @click="closeCurrent()"
        >取消</Button
      >
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useGo } from '@/hooks/web/usePage';
  import { useTabs } from '@/hooks/web/useTabs';
  import { PageWrapper } from '@/components/Page';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { reactive, computed, watch, unref } from 'vue';
  import { Card, Button, Tabs, Image, Steps } from 'ant-design-vue';
  import {
    doComplete,
    doGetFlowImgByInstanceId,
    doFindInstanceIdDetail,
    doFindHistoricalInstanceIdList,
  } from '@/api/oa/activiti';

  const Step = Steps.Step;
  const TabsPane = Tabs.TabPane;
  const emit = defineEmits(['save']);
  const { closeCurrent } = useTabs();
  const go = useGo();
  const props = defineProps({
    data: {
      type: Object as PropType<Recordable>,
      default: null,
    },
    //流程变量
    variables: {
      type: Object as PropType<Recordable>,
      default: null,
    },
    //任务变量
    taskVariables: {
      type: Object as PropType<Recordable>,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    instanceId: {
      type: String,
      default: null,
    },
    taskId: {
      type: String,
      default: null,
    },
    buttomType: {
      type: Boolean,
      default: false,
    },
  });
  const stats = reactive({
    tabsKey: '1',
    images: '',
    loading: false,
    data: {} as Recordable,
    stepList: [] as Array<Recordable>,
    processVariables: {} as Recordable,
  });

  //状态 true.创建时 false.审核时
  const getStatus = computed(() => {
    return !!props.instanceId;
  });

  watch(
    () => props.loading,
    async (value) => {
      stats.loading = value;
    },
  );
  watch(
    () => props.instanceId,
    async (_value) => {
      if (getStatus.value) {
        const url = await doGetFlowImgByInstanceId({
          instanceId: props.instanceId,
          useCustomColor: true,
        });
        stats.data = await doFindInstanceIdDetail({ instanceId: props.instanceId });
        stats.stepList = await doFindHistoricalInstanceIdList({ instanceId: props.instanceId });
        stats.images = String(unref(url));
        stats.processVariables = stats.data.processVariables;
      }
    },
    {
      immediate: true,
    },
  );

  //状态 true.创建时 false.审核时
  const getExamine = computed(() => {
    return (
      stats.processVariables &&
      stats.processVariables?.status &&
      stats.processVariables.status === 1
    );
  });

  const getTital = computed(() => {
    return getStatus.value ? '请假记录审批' : '请假单';
  });

  const handleComplete = async () => {
    const val: any = await validate();
    const { status, memo } = val;
    await doComplete({
      taskId: props.taskId,
      comment: { ...val },
      variables: { ...props.variables },
      taskVariables: { ...props.taskVariables, examineStatus: status, examineMemo: memo },
      ...props.data,
    });
    closeCurrent();
  };

  const save = () => {
    emit('save');
  };

  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/work/oa');
  }

  const schemas: FormSchema[] = [
    {
      field: 'status',
      component: 'RadioGroup',
      label: '审核状态',
      colProps: {
        span: 24,
      },
      defaultValue: 2,
      required: true,
      componentProps: {
        options: [
          {
            label: '审核通过',
            value: 2,
          },
          {
            label: '审核驳回',
            value: 3,
          },
        ],
      },
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

  //初始化表单
  const [registerForm, { validate }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
