<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModal"
    :ok-button-props="{ disabled: true }"
    title="绑定账户"
    @cancel="closeCancel"
  >
    <div class="enter-x min-w-64 min-h-64 flex justify-center">
      <Image :src="stats.img" :preview="false" :width="240" class="enter-x" @click="qrCode()" />
    </div>
    <Divider class="enter-x">{{ t('sys.login.scanSign') }}</Divider>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, onBeforeUnmount } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Divider, Image } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { dogetQrCode, doBindMiniWeb } from '/@/api/sys/user';
  import { ResultEnum } from '/@/enums/httpEnum';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);

  const stats = reactive({
    img: '',
    scene: '',
  });

  const qrCode = async () => {
    const { img, scene } = await dogetQrCode();
    stats.img = img;
    stats.scene = scene;
  };
  let timeInter;
  const [registerModal, { setModalProps }] = useModalInner(async (res) => {
    setModalProps({ loading: true });
    await qrCode();
    setModalProps({ loading: false });
    timeInter = setInterval(async () => {
      if (!stats.scene) {
        return;
      }
      const { code, message, data } = await doBindMiniWeb({
        scene: stats.scene,
      });
      if (code != ResultEnum.SUCCESS) {
        createMessage.error(message);
        stats.scene = '';
        return;
      }
      const { status } = data;
      if (status === 2) {
        //二维码过期;刷新二维码
        qrCode();
      } else if (status == 0) {
        //绑定成功 关闭弹窗
        createMessage.success('绑定成功');
        clearInterval(timeInter);
        emit('success');
      }
    }, 3000);
  });

  const closeCancel = () => {
    clearInterval(timeInter);
  };

  onBeforeUnmount(() => {
    clearInterval(timeInter);
  });
</script>
