<template>
  <PageWrapper
    class="high-form h-full flex flex-col"
    title="请假记录审批"
    @back="goBack"
    contentFullHeight
  >
    <!-- 内容卡槽 -->
    <Card :bordered="false" :style="`height:calc(100% - ${150}px)`">
      <slot name="content"></slot>
    </Card>
    <!-- 审核时信息 -->
    <Card :bordered="false" class="!mt-5" style="height: 150px">
      <div>审核时信息 </div>
    </Card>

    <!-- 按钮 -->
    <template #rightFooter>
      <!-- 发起审核按钮 -->
      <Button style="margin-right: 10px" type="primary" v-if="status" @click="save()">确定</Button>
      <!-- 提交审核按钮 -->
      <Button style="margin-right: 10px" type="primary" v-if="!status" @click="handleComplete()"
        >审核提交</Button
      >
      <!-- 驳回按钮 -->
      <Button style="margin-right: 10px" v-if="!status" @click="handleBackProcess()" danger
        >驳回</Button
      >
      <!-- 取消按钮 -->
      <Button style="margin-right: 10px" @click="goBack()">取消</Button>
      <!-- 删除按钮 -->
      <Button style="margin-right: 10px" v-if="isAdmin" @click="remove()" danger>删除</Button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';
  import { PageWrapper } from '/@/components/Page';
  import { reactive } from 'vue';
  import { Card, Button } from 'ant-design-vue';
  import { doComplete, doBackProcess, getFlowImgByInstanceId } from '/@/api/oa/activiti';
  const emit = defineEmits(['save', 'remove']);
  const go = useGo();
  const props = defineProps({
    //状态 true.创建时 false.审核时
    data: {
      type: Object as PropType<Recordable>,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    instanceId: {
      type: String,
      default: null,
    },
  });

  // const stats = reactive({
  //   memoRef: '',
  // });

  const handleComplete = () => {
    doComplete({
      instanceId: props.instanceId,
      ...props.data,
    });
  };

  const handleBackProcess = () => {
    doBackProcess({
      instanceId: props.instanceId,
    });
  };

  const save = () => {
    emit('save');
  };

  const remove = () => {
    emit('remove');
  };

  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/work/oa');
  }
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
</style>
