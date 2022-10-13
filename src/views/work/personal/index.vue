<template>
  <PageWrapper dense contentFullHeight fixedHeight>
    <div :class="`flex h-full p-4 ${prefixCls}`">
      <div :class="`w-68 h-full !mr-4 enter-y ${prefixCls}-menu`">
        <PersonalMenu @handleMenuClick="handleClick" />
      </div>
      <div :class="`w-full h-full enter-y ${prefixCls}-context`">
        <component v-bind="$attrs" :is="comp" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, shallowRef } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import PersonalMenu, { ButtonType } from './components/PersonalMenu.vue';
  const AccountConfig = createAsyncComponent(
    () => import('./components/context/AccountConfig.vue'),
  );
  const AccountBind = createAsyncComponent(() => import('./components/context/AccountBind.vue'));

  let comp = shallowRef(AccountConfig);

  const prefixCls = ref('personal-center');

  const handleClick = (k: ButtonType) => {
    switch (k) {
      case 'account_config':
        comp.value = AccountConfig;
        break;
      case 'account_bind':
        comp.value = AccountBind;
        break;
      case 'mail_config':
        break;
    }
  };
</script>
<style lang="less" scoped>
  .personal-center {
    &-menu {
      background-color: @component-background;
    }

    &-context {
      background-color: @component-background;
    }
  }
</style>
