<script lang="ts" setup>
import type { StreamPlayType } from './video-play-url';

import type { VideoPlayResult } from '#/api/video/play';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Button, Input, message, Select, Space, Tag } from 'ant-design-vue';

import { VideoJessibucaPlay } from '#/components/Video';

import {
  buildVideoPlayOptions,
  getDefaultStreamPlayType,
} from './video-play-url';

const accessStore = useAccessStore();
const playData = ref<VideoPlayResult>();
const playerRef = ref<InstanceType<typeof VideoJessibucaPlay>>();
const selectedPlayType = ref<StreamPlayType>();

const playOptions = computed(() =>
  buildVideoPlayOptions(playData.value, accessStore.accessToken),
);

const videoUrl = computed(() => {
  if (!selectedPlayType.value) {
    return '';
  }
  return playOptions.value.streamMap[selectedPlayType.value]?.value || '';
});

const streamSelectOptions = computed(() =>
  Object.entries(playOptions.value.streamMap).map(([value, item]) => ({
    label: item.label,
    value,
  })),
);

const rtcUrl = computed(() => playOptions.value.zlmRtcUrl?.value || '');

async function copyUrl(value: string) {
  if (!value) {
    message.warning('未获取到可复制的播放地址');
    return;
  }
  await navigator.clipboard.writeText(value);
  message.success('播放地址已复制');
}

function resetPlayState() {
  playerRef.value?.destroy?.();
  playData.value = undefined;
  selectedPlayType.value = undefined;
}

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (!isOpen) {
      resetPlayState();
      return;
    }
    playData.value = modalApi.getData<VideoPlayResult>();
    selectedPlayType.value = getDefaultStreamPlayType(
      playOptions.value.streamMap,
    );
    await nextTick();
    playerRef.value?.play?.();
  },
});
</script>

<template>
  <Modal class="w-[960px]" title="视频播放">
    <div class="video-play-modal">
      <div class="video-play-modal__player">
        <VideoJessibucaPlay
          ref="playerRef"
          :has-audio="true"
          :video-url="videoUrl"
        />
      </div>

      <div class="video-play-modal__toolbar">
        <Space wrap>
          <Tag color="blue">Stream</Tag>
          <Select
            v-model:value="selectedPlayType"
            class="w-36"
            :disabled="streamSelectOptions.length === 0"
            :options="streamSelectOptions"
            size="small"
          />
          <Input
            class="video-play-modal__url"
            readonly
            size="small"
            :value="videoUrl"
          />
          <Button size="small" @click="copyUrl(videoUrl)">复制</Button>
          <Button v-if="rtcUrl" size="small" @click="copyUrl(rtcUrl)">
            复制RTC
          </Button>
        </Space>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.video-play-modal {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.video-play-modal__player {
  height: min(62vh, 560px);
  min-height: 420px;
  overflow: hidden;
  background: #000;
}

.video-play-modal__toolbar {
  min-width: 0;
}

.video-play-modal__url {
  width: min(560px, 52vw);
}
</style>
