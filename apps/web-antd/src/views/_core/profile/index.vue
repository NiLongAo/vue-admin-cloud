<script setup lang="ts">
import { computed, ref } from 'vue';

import { Profile } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, message } from 'ant-design-vue';

import { doUpdateLoginUserInfo } from '#/api/sys/user';
import AccountBind from '#/views/index/system/user/component/accountBind/index.vue';
import BaseSetting from '#/views/index/system/user/component/baseSetting/index.vue';

import ProfileNotificationSetting from './notification-setting.vue';
import ProfilePasswordSetting from './password-setting.vue';
import {
  buildLoginUserInfoPayload,
  normalizeProfileUserInfo,
} from './profile-user';
import ProfileSecuritySetting from './security-setting.vue';

type PersonalFormApi = {
  getValues: () => Promise<Record<string, any>>;
  validate: () => Promise<{ valid: boolean }>;
};

const userStore = useUserStore();
const profileUserInfo = computed(() =>
  normalizeProfileUserInfo(userStore.userInfo ?? {}),
);

const tabsValue = ref<string>('basic');
const formApi = ref<PersonalFormApi>();
const saving = ref(false);
const userId = computed(() => userStore.userInfo?.id);

const tabs = ref([
  {
    label: '基本设置',
    value: 'basic',
  },
  {
    label: '账号绑定',
    value: 'bind',
  },
  {
    label: '安全设置',
    value: 'security',
  },
  {
    label: '修改密码',
    value: 'password',
  },
  {
    label: '新消息提醒',
    value: 'notice',
  },
]);

async function handleSaveBaseInfo() {
  if (!formApi.value || saving.value) return;

  const { valid } = await formApi.value.validate();
  if (!valid) return;

  saving.value = true;
  try {
    const values = await formApi.value.getValues();
    await doUpdateLoginUserInfo(buildLoginUserInfoPayload(values));
    message.success('保存成功');
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <Profile
    v-model="tabsValue"
    title="个人中心"
    :user-info="profileUserInfo"
    :tabs="tabs"
  >
    <template #content>
      <div v-if="tabsValue === 'basic'" class="profile-content-panel">
        <BaseSetting v-model:form-api="formApi" :user-id="userId" />
        <div class="profile-actions">
          <Button :loading="saving" type="primary" @click="handleSaveBaseInfo">
            更新基本信息
          </Button>
        </div>
      </div>
      <AccountBind v-if="tabsValue === 'bind'" />
      <ProfileSecuritySetting v-if="tabsValue === 'security'" />
      <ProfilePasswordSetting v-if="tabsValue === 'password'" />
      <ProfileNotificationSetting v-if="tabsValue === 'notice'" />
    </template>
  </Profile>
</template>

<style scoped>
.profile-content-panel {
  min-width: 0;
}

.profile-actions {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}
</style>
