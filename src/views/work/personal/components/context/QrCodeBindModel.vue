<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :ok-button-props="{ disabled: true }"
    title="绑定账户"
  >
    <div class="enter-x min-w-64 min-h-64 flex justify-center">
      <Image :src="stats.img" :preview="false" :width="240" class="enter-x" @click="qrCode()" />
    </div>
    <Divider class="enter-x">{{ t('sys.login.scanSign') }}</Divider>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Divider, Image } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SocketNamespace, SocketEvent, SocketData, ResultEnum } from '/@/enums/SocketEnum';
  import { useSocketStore } from '/@/store/modules/socket';
  import mitt from '/@/utils/mitt';

  const rootSocketEmitter = mitt();
  const useSocket = useSocketStore();

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);

  const stats = reactive({
    img: '',
    scene: '',
  });

  const qrCode = async () => {
    const val: any = await useSocket.sendMessage(
      SocketNamespace.QR_NAMESPACE,
      SocketEvent.WX_MINI_QR_BIND_EVENT,
      {
        type: SocketData.WX_MINI_QR_BIND_DATA,
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
  //检测socket平台消息
  rootSocketEmitter.on(SocketEvent.WX_MINI_QR_BIND_EVENT, (val) => {
    const { code, message } = val;
    if (code == ResultEnum.OVERDUE) {
      qrCode();
      createMessage.info('二维码过期');
    } else if (code != ResultEnum.SUCCESS) {
      createMessage.error(message || '获取消息错误');
      console.log(val);
      return;
    }
    createMessage.success('绑定成功');
    emit('success');
  });

  const [registerModal, { setModalProps }] = useModalInner(async (_res) => {
    setModalProps({ loading: true });
    await qrCode();
    setModalProps({ loading: false });
  });
</script>
