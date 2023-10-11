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
  import { reactive, onBeforeMount } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Divider, Image } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    SocketNamespace,
    SocketInEvent,
    SocketOutEvent,
    SocketData,
    ResultEnum,
  } from '/@/enums/SocketEnum';
  import { useSocketStore } from '/@/store/modules/socket';
  import rootSocketEmitter from '/@/hooks/socket/rootSocketEmitter';

  const useSocket = useSocketStore();

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);

  const stats = reactive({
    img: '',
    scene: '',
  });

  const qrCode = () => {
    useSocket.sendMessage(SocketNamespace.QR_NAMESPACE, SocketInEvent.IN_LOGIN_QR_CODE_EVENT, {
      type: SocketData.WX_MINI_QR_BIND_DATA,
    });
  };

  const [registerModal, { setModalProps }] = useModalInner(async (_res) => {
    setModalProps({ loading: true });
    await qrCode();
  });

  onBeforeMount(() => {
    rootSocketEmitter.on(SocketOutEvent.OUT_LOGIN_QR_CODE_EVENT, (val:any) => {
      const { code, message, data } = val;
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      const { scene, type, img } = data;
      if (type && type == SocketData.WX_MINI_QR_BIND_DATA) {
        stats.img = img;
        stats.scene = scene;
      }
      setModalProps({ loading: false });
    });
    //检测socket平台消息
    rootSocketEmitter.on(SocketOutEvent.OUT_LOGIN_BIND_EVENT, (val:any) => {
      const { code, message } = val;
      if (code == ResultEnum.OVERDUE) {
        qrCode();
        createMessage.info('二维码过期');
      } else if (code != ResultEnum.SUCCESS) {
        createMessage.error(message || '获取消息错误');
        return;
      }
      createMessage.success('绑定成功');
      emit('success');
    });
  });
</script>
