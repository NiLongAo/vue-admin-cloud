<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal, useVbenModal } from '@vben/common-ui';
import { useRefresh, useWatermark } from '@vben/hooks';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { sysTenantId } from '#/api/sys/tenant';
import { $t } from '#/locales';
import { PERSONAL_CENTER_PATH } from '#/router/personal-center';
import { useAuthStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';

import HeaderNotification from './modules/HeaderNotification.vue';
import TenantSwitchModal from './modules/TenantSwitchModal.vue';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const { refresh } = useRefresh();
const { destroyWatermark, updateWatermark } = useWatermark();
const { isDark } = usePreferences();
const isSysTenant = computed(
  () => Number(userStore.userInfo?.tenantId) === sysTenantId,
);
const [TenantSwitchModalInstance, tenantSwitchModalApi] = useVbenModal({
  connectedComponent: TenantSwitchModal,
});

const menus = computed(() => [
  {
    handler: () => {
      router.push(PERSONAL_CENTER_PATH);
    },
    icon: 'lucide:user',
    text: $t('page.auth.profile'),
  },
  ...(isSysTenant.value
    ? [
        {
          handler: () => {
            tenantSwitchModalApi.open();
          },
          icon: 'lucide:repeat-2',
          text: '切换租户',
        },
      ]
    : []),
]);

const avatar = computed(() => {
  return userStore.userInfo?.httpImageUrl || preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

async function handleTenantSwitched() {
  await refresh();
}

watch(
  () => ({
    enable: preferences.app.watermark,
    content: preferences.app.watermarkContent,
    isDark: isDark.value,
  }),
  async ({ enable, content, isDark: isDarkValue }) => {
    if (enable) {
      const watermarkColor = isDarkValue
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)';

      await updateWatermark({
        advancedStyle: {
          colorStops: [
            {
              color: watermarkColor,
              offset: 0,
            },
            {
              color: watermarkColor,
              offset: 1,
            },
          ],
          type: 'linear',
        },
        content:
          content ||
          `${userStore.userInfo?.nickName} - ${userStore.userInfo?.nickName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        :text="userStore.userInfo?.nickName"
        description="ann.vben@gmail.com"
        tag-text="Pro"
        @logout="handleLogout"
      />
    </template>
    <template #notification>
      <HeaderNotification />
    </template>
    <template #extra>
      <TenantSwitchModalInstance @switched="handleTenantSwitched" />
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
