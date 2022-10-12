<template>
  <PageWrapper ref="PageWrapperT" dense contentFullHeight fixedHeight>
    <div :class="`flex p-4 ${prefixCls}`" :style="`height:` + stats.rowHeightVal + `px`">
      <div class="w-2/10 !mr-4 enter-y">
        <div :class="`h-full ${prefixCls}-laft`">
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="w-8/10 enter-y"> dfasdfasdf </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, unref, reactive, onMounted, nextTick } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useUserStore } from '/@/store/modules/user';
  const rowHeight = ref();
  const PageWrapperT = ref();
  const prefixCls = ref('personal-center');

  const userStore = useUserStore();

  const stats = reactive({
    userId: userStore.getUserInfo.id,
    userName: userStore.getUserInfo.userName,
    memoRef: userStore.getUserInfo.memo,
    rowHeightVal: 0,
  });

  onMounted(() => {
    nextTick(() => {
      const rowHeightEl = unref(rowHeight)?.$el;
      stats.rowHeightVal = unref(PageWrapperT).contentHeight - (rowHeightEl?.clientHeight || 0);
    });
  });
</script>
<style lang="less" scoped>
  .personal-center {
    &-laft {
      background-color: @component-background;
    }
  }
</style>
