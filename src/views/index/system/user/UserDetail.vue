<template>
  <PageWrapper
    :title="`用户` + formData.userNameRef + `的资料`"
    :content="formData.memoRef"
    contentBackground
    @back="goBack"
  >
    <template #footer>
      <Tabs default-active-key="detail" v-model:activeKey="formData.currentKey">
        <TabPane key="detail" tab="用户资料" />
        <TabPane key="logs" tab="操作日志" />
      </Tabs>
    </template>
    <div class="pt-4 m-4 desc-wrap">
      <template v-if="formData.currentKey == 'detail'">
        <div v-for="i in 10" :key="i">这是用户{{ formData.userNameRef }}资料Tab</div>
      </template>
      <template v-if="formData.currentKey == 'logs'">
        <div v-for="i in 10" :key="i">这是用户{{ formData.userNameRef }}操作日志Tab</div>
      </template>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { onMounted, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { UserInfoApi } from '/@/api/sys/user';
  const route = useRoute();
  const { setTitle } = useTabs();

  const formData = reactive({
    userId: route.params?.id,
    userNameRef: '',
    memoRef: '',
    currentKey: 'detail',
  });

  const initUserInfo = async () => {
    const { userName, memo } = await UserInfoApi({ id: formData.userId });
    formData.userNameRef = userName;
    formData.memoRef = memo || '';
    setTitle('详情：用户' + formData.userNameRef);
  };

  onMounted(() => {
    initUserInfo();
  });

  const go = useGo();
  // 此处可以得到用户ID

  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/system/user');
  }
</script>
