<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <div class="enter-x min-w-64 min-h-64">
      <Image
        :src="stats.img"
        :preview="false"
        class="enter-x flex justify-center xl:justify-start"
        @click="qrCode()"
      />
      <Divider class="enter-x">{{ t('sys.login.scanSign') }}</Divider>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </div>
  </template>
</template>
<script lang="ts" setup>
  import { computed, reactive, unref, onMounted, onBeforeUnmount } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Button, Divider, Image } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';
  import { dogetQrCode, doMiniWebLogin } from '/@/api/sys/user';
  import { useUserStore } from '/@/store/modules/user';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  const stats = reactive({
    img: '',
    scene: '',
  });
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.WX_MINI);

  const qrCode = async () => {
    const { img, scene } = await dogetQrCode();
    stats.img = img;
    stats.scene = scene;
  };

  const timeInter = setInterval(async () => {
    if (!stats.scene) {
      return;
    }
    const { code, message, data } = await doMiniWebLogin({
      scene: stats.scene,
    });
    if (code != ResultEnum.SUCCESS) {
      createMessage.error(message);
      stats.scene = '';
    }

    const { status, access_token, refresh_token } = data;
    if (status === 2) {
      //二维码过期;刷新二维码
      qrCode();
    } else if (status == 0) {
      userStore.setToken(access_token, refresh_token);
      userStore.afterLoginAction(true);
    }
  }, 3000);

  onBeforeUnmount(() => {
    clearInterval(timeInter);
  });

  onMounted(() => {
    qrCode();
  });
</script>
