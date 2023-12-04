<template>
  <div :class="`${prefixCls}`">
    <Row type="flex" justify="center">
      <Col class="px-4 pt-4">
        <div :class="`${prefixCls}-top-avatar`">
          <img :src="stats.userImages" width="100" />
          <span>{{ stats.userName }}</span>
        </div>
      </Col>
    </Row>
    <Divider dashed orientation="left">基本设置</Divider>
    <Menu :selectedKeys="key" @click="handleClick">
      <MenuItem key="account_config" text="账号管理" />
      <MenuItem key="account_bind" text="账号绑定" />
      <MenuItem key="mail_config" disabled text="邮箱管理" />
    </Menu>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useUserStore } from '@/store/modules/user';
  import { Row, Col, Divider, Menu } from 'ant-design-vue';
  import MenuItem from '@/layouts/default/header/components/user-dropdown/DropMenuItem.vue';
  export type ButtonType = 'account_config' | 'account_bind' | 'mail_config';
  const key = ref(['account_config']);

  const emit = defineEmits(['handleMenuClick']);

  const prefixCls = ref('personal-menu');
  const userStore = useUserStore();

  const stats = reactive({
    userId: userStore.getUserInfo.id,
    userName: userStore.getUserInfo.userName,
    userImages: userStore.getUserInfo.imageUrl,
    memoRef: userStore.getUserInfo.memo,
  });

  const handleClick = (e: { key: ButtonType } | any) => {
    key.value = [e.key];
    emit('handleMenuClick', e.key);
  };
</script>
<style lang="less" scoped>
  .personal-menu {
    text-align: center;

    &-top-avatar {
      font-size: 20px;
      font-weight: 500;
    }

    &-top-set {
      font-size: 14px;
      font-weight: 200;
    }
  }
</style>
