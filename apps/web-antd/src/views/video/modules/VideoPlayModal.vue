<script lang="ts" setup>
import type { VideoPlayResult } from '#/api/video/play';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { VideoJessibucaPlay } from '#/components/Video';

import { buildVideoPlayUrl } from './video-play-url';

const playData = ref<VideoPlayResult>();

const videoUrl = computed(() => {
  const data = playData.value;
  const url =
    data?.sslStatus === 0
      ? data?.wsFlv?.url || data?.flv?.url
      : data?.wssFlv?.url || data?.httpsFlv?.url;
  return buildVideoPlayUrl(url, data?.auth || data?.token);
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen) {
    if (!isOpen) {
      playData.value = undefined;
      return;
    }
    playData.value = modalApi.getData<VideoPlayResult>();
  },
});
</script>

<template>
  <Modal class="w-[920px]" title="视频播放">
    <div class="h-[560px] bg-black">
      <VideoJessibucaPlay :has-audio="true" :video-url="videoUrl" />
    </div>
  </Modal>
</template>
