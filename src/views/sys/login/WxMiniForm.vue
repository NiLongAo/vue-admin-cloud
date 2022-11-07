<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <div class="enter-x min-w-64 min-h-64">
      <Image
        :src="stats.img"
        :preview="false"
        :width="280"
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
  import { computed, reactive, unref, onMounted } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Button, Divider, Image } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SocketNamespace, SocketEvent, SocketData, ResultEnum } from '/@/enums/SocketEnum';
  import { useSocketStore } from '/@/store/modules/socket';
  import mitt from '/@/utils/mitt';

  const rootSocketEmitter = mitt();
  const useSocket = useSocketStore();
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
    const val: any = await useSocket.sendMessage(
      SocketNamespace.QR_NAMESPACE,
      SocketEvent.WX_MINI_QR_LOGIN_EVENT,
      {
        type: SocketData.WX_MINI_QR_LOGIN_DATA,
      },
    );
    const { code, message, data } = val;
    if (code != ResultEnum.SUCCESS) {
      createMessage.error(message || '获取消息错误');
      console.log(val);
      return;
    }
    const { scene, img } = data;
    stats.img = img;
    stats.scene = scene;
  };
  rootSocketEmitter.on(SocketEvent.WX_MINI_QR_LOGIN_EVENT, (val) => {
    const { code, message, data } = val;
    if (code == ResultEnum.OVERDUE) {
      qrCode();
      createMessage.info('二维码过期');
    } else if (code != ResultEnum.SUCCESS) {
      createMessage.error(message || '获取消息错误');
      console.log(val);
      return;
    }
    const { access_token, refresh_token } = data;
    userStore.setToken(access_token, refresh_token);
    userStore.afterLoginAction(true);
  });

  onMounted(() => {
    qrCode();
  });
</script>
