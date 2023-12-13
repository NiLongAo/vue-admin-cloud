<template>
  <Dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.imageUrl" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.userName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          key="doc"
          :text="t('layout.header.dropdownItemDoc')"
          icon="ion:document-text-outline"
          v-if="getShowDoc"
        />
        <MenuDivider v-if="getShowDoc" />
	      <MenuItem
          v-if="getShowApi"
          key="api"
          :text="t('layout.header.dropdownChangeApi')"
          icon="ant-design:swap-outlined"
        />
        <MenuItem
          key="personal"
          :text="t('layout.header.tooltipPersonalCenter')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem
          v-if="isSysTenant"
          key="tenant"
          :text="t('layout.header.switchTenants')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
  <ChangeApi @register="registerApi" />
  <TenantAction @register="registerTenantAction" :isSysTenant="isSysTenant" />
</template>
<script lang="ts" setup>
  // components
  import { Dropdown, Menu,MenuDivider } from 'ant-design-vue';
  import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface';

  import { computed } from 'vue';

  import { DOC_URL } from '@/settings/siteSetting';

  import { useUserStore } from '@/store/modules/user';
  import { useHeaderSetting } from '@/hooks/setting/useHeaderSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useModal } from '@/components/Modal';
  import { sysTenantId } from '@/api/sys/model/tenantModel';
  import headerImg from '@/assets/images/header.jpg';
  import { propTypes } from '@/utils/propTypes';
  import { openWindow } from '@/utils';
  import { useGo } from '@/hooks/web/usePage';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'api' | 'tenant' | 'personal';
  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));
  const LockAction = createAsyncComponent(() => import('../lock/LockModal.vue'));
  const ChangeApi = createAsyncComponent(() => import('../ChangeApi/index.vue'));
  const TenantAction = createAsyncComponent(() => import('../tenant/TenantModal.vue'));
  defineOptions({ name: 'UserDropdown' });
  defineProps({
    theme: propTypes.oneOf(['dark', 'light']),
  });
  const { prefixCls } = useDesign('header-user-dropdown');
  const { t } = useI18n();
  const go = useGo();
  const { getShowDoc, getUseLockPage ,getShowApi} = useHeaderSetting();
  const userStore = useUserStore();
  const getUserInfo = computed(() => {
    const { userName = '', imageUrl, tenantId } = userStore.getUserInfo || {};
    return {
      userName,
      tenantId,
      imageUrl: imageUrl ? imageUrl : headerImg,
    };
  });

  const isSysTenant = computed(() => {
    return sysTenantId == getUserInfo.value.tenantId;
  });

  const [register, { openModal }] = useModal();
  const [registerApi, { openModal: openApiModal }] = useModal();
  const [registerTenantAction, { openModal: openModalTenantAction }] = useModal();

  function handleLock() {
    openModal(true);
  }
  function handleApi() {
    openApiModal(true, {});
  }
  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }

  // open doc
  function openDoc() {
    openWindow(DOC_URL);
  }

  //open tenant
  const handleTenant = () => {
    openModalTenantAction(true);
  };
  function handleMenuClick(e: MenuInfo) {
    switch (e.key as MenuEvent) {
      case 'logout':
        handleLoginOut();
        break;
      case 'doc':
        openDoc();
        break;
      case 'lock':
        handleLock();
        break;
      case 'api':
        handleApi();
        break;
      case 'tenant':
        handleTenant();
        break;
      case 'personal':
        go('/work/personal');
        break;
    }
  }
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    align-items: center;
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
