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
      v-show="stats.tabsKey === '1' && getStatus"
      class="!mt-5"
      style="height: 150px"
    >
      <div>审核时信息 </div>
    </Card>
    <Card :bordered="false" class="flex-auto" :style="`height:100%`" v-show="stats.tabsKey == '2'">
      <Image :src="stats.images" :preview="false" class="object-center" />
    </Card>

    <!-- 按钮 -->
    <template #rightFooter>
      <!-- 发起审核按钮 -->
      <Button style="margin-right: 10px" type="primary" v-if="!getStatus" @click="save()"
        >确定</Button
      >
      <!-- 提交审核按钮 -->
      <Button style="margin-right: 10px" type="primary" v-if="getStatus" @click="handleComplete()"
        >审核提交</Button
      >
      <!-- 驳回按钮 -->
      <Button style="margin-right: 10px" v-if="getStatus" @click="handleBackProcess()" danger
        >驳回</Button
      >
      <!-- 取消按钮 -->
      <Button style="margin-right: 10px" @click="closeCurrent()">取消</Button>
      <!-- 删除按钮 -->
      <Button style="margin-right: 10px" v-if="isAdmin" @click="remove()" danger>删除</Button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { PageWrapper } from '/@/components/Page';
  import { reactive, computed, watch, unref } from 'vue';
  import { Card, Button, Tabs, Image } from 'ant-design-vue';
  import { doComplete, doBackProcess, doGetFlowImgByInstanceId } from '/@/api/oa/activiti';
  const TabsPane = Tabs.TabPane;
  const emit = defineEmits(['save', 'remove']);
  const { closeCurrent } = useTabs();
  const go = useGo();
  const props = defineProps({
    data: {
      type: Object as PropType<Recordable>,
      default: null,
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

  watch(
    () => props.instanceId,
    async (_value) => {
      if (getStatus.value) {
        const url = await doGetFlowImgByInstanceId({
          instanceId: props.instanceId,
          useCustomColor: true,
        });
        stats.images = String(unref(url));
      }
    },
  );

  //状态 true.创建时 false.审核时
  const getStatus = computed(() => {
    return !!props.instanceId;
  });

  const getTital = computed(() => {
    return getStatus.value ? '请假记录审批' : '请假单';
  });

  const stats = reactive({
    tabsKey: '1',
    images: '',
  });

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
