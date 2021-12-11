<template>
  <PageWrapper class="high-form h-full" title="请假记录审批" @back="goBack" contentFullHeight>
    <div class="h-full">
      <!-- 内容卡槽 -->
      <Card :bordered="false" class="h-4/5">
        <slot name="content"></slot>
      </Card>
      <!-- 审核时信息 -->
      <Card :bordered="false" class="!mt-5 h-1/5">
        <div>审核时信息 </div>
      </Card>
    </div>
    <!-- 按钮 -->
    <template #rightFooter>
      <!-- 发起审核按钮 -->
      <a-button style="margin-right: 10px" color="primary" v-if="status" @click="save()"
        >确定</a-button
      >
      <!-- 提交审核按钮 -->
      <a-button style="margin-right: 10px" color="success" v-if="!status">审核提交</a-button>
      <!-- 驳回按钮 -->
      <a-button style="margin-right: 10px" color="warning" v-if="!status">驳回</a-button>
      <!-- 取消按钮 -->
      <a-button style="margin-right: 10px">取消</a-button>
      <!-- 删除按钮 -->
      <a-button style="margin-right: 10px" color="error" v-if="isAdmin">删除</a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';
  import { PageWrapper } from '/@/components/Page';
  // import { reactive } from 'vue';
  import { Card } from 'ant-design-vue';
  // import { complete, claim, jump, backProcess, getFlowImgByInstanceId } from '/@/api/oa/activiti';
  const emit = defineEmits(['save']);

  const go = useGo();

  const props = defineProps({
    //状态 true.创建时 false.审核时
    status: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    removeApi: {
      type: Function,
      default: null,
    },
    instanceId: {
      type: String,
      default: null,
    },
  });

  // const stats = reactive({
  //   memoRef: '',
  // });

  const save = () => {
    emit('save');
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
