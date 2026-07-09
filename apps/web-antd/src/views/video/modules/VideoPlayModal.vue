<script lang="ts" setup>
import type { StreamPlayType } from './video-play-url';

import type { VideoPlayResult } from '#/api/video/play';

import { computed, nextTick, onUnmounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import {
  Button,
  Descriptions,
  DescriptionsItem,
  Divider,
  Input,
  message,
  Select,
  Slider,
  Space,
  Tag,
} from 'ant-design-vue';

import { doMediaInfo } from '#/api/video/mediaServer';
import { doPtzFocus, doPtzIris, doPtzPtz } from '#/api/video/ptz';
import { VideoJessibucaPlay } from '#/components/Video';

import {
  buildVideoPlayOptions,
  getDefaultStreamPlayType,
} from './video-play-url';

const accessStore = useAccessStore();
const playData = ref<VideoPlayResult>();
const playerRef = ref<InstanceType<typeof VideoJessibucaPlay>>();
const selectedPlayType = ref<StreamPlayType>();
const controlSpeed = ref(30);
const streamInfo = ref<Record<string, any>>();
let streamInfoTimer: ReturnType<typeof setInterval> | undefined;

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
const hasPtz = computed(
  () => !!playData.value?.deviceId && !!playData.value?.channelId,
);
const hasStreamInfo = computed(
  () =>
    !!playData.value?.app &&
    !!playData.value?.stream &&
    !!playData.value?.mediaServerId,
);

const streamSummary = computed(() => {
  const tracks = streamInfo.value?.tracks ?? playData.value?.tracks ?? [];
  const videoTrack = tracks.find(
    (item: Record<string, any>) =>
      item.codec_type === 0 || item.codec_type === '0',
  );
  const audioTrack = tracks.find(
    (item: Record<string, any>) =>
      item.codec_type === 1 || item.codec_type === '1',
  );
  return {
    aliveSecond: formatAliveSecond(streamInfo.value?.aliveSecond ?? 0),
    audioCodec: audioTrack?.codec_id_name || '',
    audioSampleRate: audioTrack?.sample_rate || '',
    bytesSpeed: formatByteSpeed(streamInfo.value?.bytesSpeed ?? 0),
    readerCount: streamInfo.value?.totalReaderCount ?? 0,
    schema: streamInfo.value?.schema || '',
    videoCodec: videoTrack?.codec_id_name || '',
    videoFps: videoTrack?.fps || '',
    videoLoss: videoTrack?.loss || '',
    videoSize:
      videoTrack?.width || videoTrack?.height
        ? `${videoTrack?.width ?? 0}x${videoTrack?.height ?? 0}`
        : '',
  };
});

async function copyUrl(value: string) {
  if (!value) {
    message.warning('未获取到可复制的播放地址');
    return;
  }
  await navigator.clipboard.writeText(value);
  message.success('播放地址已复制');
}

function buildPtzBaseParams() {
  return {
    channelId: playData.value?.channelId,
    deviceId: playData.value?.deviceId,
  };
}

function speed(max: number) {
  return Math.max(1, Math.round((controlSpeed.value * max) / 100));
}

async function ptz(command: string) {
  if (!hasPtz.value) {
    return;
  }
  await doPtzPtz({
    ...buildPtzBaseParams(),
    command,
    horizonSpeed: speed(255),
    verticalSpeed: speed(255),
    zoomSpeed: speed(16),
  });
}

async function focus(command: string) {
  if (!hasPtz.value) {
    return;
  }
  await doPtzFocus({
    ...buildPtzBaseParams(),
    command,
    speed: speed(255),
  });
}

async function iris(command: string) {
  if (!hasPtz.value) {
    return;
  }
  await doPtzIris({
    ...buildPtzBaseParams(),
    command,
    speed: speed(255),
  });
}

async function loadStreamInfo() {
  if (!hasStreamInfo.value) {
    return;
  }
  try {
    streamInfo.value = await doMediaInfo({
      app: playData.value?.app,
      mediaServerId: playData.value?.mediaServerId,
      stream: playData.value?.stream,
    });
  } catch {
    stopStreamInfoTask();
  }
}

function startStreamInfoTask() {
  stopStreamInfoTask();
  if (!hasStreamInfo.value) {
    return;
  }
  loadStreamInfo();
  streamInfoTimer = setInterval(loadStreamInfo, 2000);
}

function stopStreamInfoTask() {
  if (streamInfoTimer) {
    clearInterval(streamInfoTimer);
    streamInfoTimer = undefined;
  }
}

function formatByteSpeed(value: number) {
  const unit = 1024;
  if (value < unit) return `${value} B/S`;
  if (value < unit ** 2) return `${(value / unit).toFixed(2)} KB/S`;
  if (value < unit ** 3) return `${(value / unit ** 2).toFixed(2)} MB/S`;
  if (value < unit ** 4) return `${(value / unit ** 3).toFixed(2)} GB/S`;
  return `${(value / unit ** 4).toFixed(2)} TB/S`;
}

function formatAliveSecond(value: number) {
  const hour = Math.floor(value / 3600);
  const minute = Math.floor((value / 60) % 60);
  const second = Math.ceil(value % 60);
  return `${hour > 0 ? `${hour}小时` : ''}${String(minute).padStart(2, '0')}分${String(second).padStart(2, '0')}秒`;
}

function resetPlayState() {
  stopStreamInfoTask();
  playerRef.value?.destroy?.();
  playData.value = undefined;
  streamInfo.value = undefined;
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
    startStreamInfoTask();
    await nextTick();
    playerRef.value?.play?.();
  },
});

onUnmounted(() => {
  resetPlayState();
});
</script>

<template>
  <Modal class="w-[1180px]" title="视频播放">
    <div class="video-play-modal">
      <section class="video-play-modal__main">
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
      </section>

      <aside class="video-play-modal__side">
        <div v-if="hasPtz" class="video-play-panel">
          <div class="video-play-panel__title">云台控制</div>
          <div class="ptz-pad">
            <Button
              class="ptz-pad__btn ptz-pad__up"
              @mousedown="ptz('up')"
              @mouseup="ptz('stop')"
            >
              ↑
            </Button>
            <Button
              class="ptz-pad__btn ptz-pad__left"
              @mousedown="ptz('left')"
              @mouseup="ptz('stop')"
            >
              ←
            </Button>
            <Button class="ptz-pad__btn ptz-pad__center" @click="ptz('stop')">
              ■
            </Button>
            <Button
              class="ptz-pad__btn ptz-pad__right"
              @mousedown="ptz('right')"
              @mouseup="ptz('stop')"
            >
              →
            </Button>
            <Button
              class="ptz-pad__btn ptz-pad__down"
              @mousedown="ptz('down')"
              @mouseup="ptz('stop')"
            >
              ↓
            </Button>
          </div>
          <Slider v-model:value="controlSpeed" :min="1" :max="100" />
          <div class="video-play-actions">
            <Button
              size="small"
              @mousedown="ptz('zoomin')"
              @mouseup="ptz('stop')"
            >
              变倍+
            </Button>
            <Button
              size="small"
              @mousedown="ptz('zoomout')"
              @mouseup="ptz('stop')"
            >
              变倍-
            </Button>
            <Button
              size="small"
              @mousedown="focus('near')"
              @mouseup="focus('stop')"
            >
              聚焦+
            </Button>
            <Button
              size="small"
              @mousedown="focus('far')"
              @mouseup="focus('stop')"
            >
              聚焦-
            </Button>
            <Button
              size="small"
              @mousedown="iris('in')"
              @mouseup="iris('stop')"
            >
              光圈+
            </Button>
            <Button
              size="small"
              @mousedown="iris('out')"
              @mouseup="iris('stop')"
            >
              光圈-
            </Button>
          </div>
        </div>

        <div class="video-play-panel">
          <div class="video-play-panel__title">流信息</div>
          <Descriptions size="small" :column="1" bordered>
            <DescriptionsItem label="观看人数">
              {{ streamSummary.readerCount }}
            </DescriptionsItem>
            <DescriptionsItem label="协议">
              {{ streamSummary.schema || '-' }}
            </DescriptionsItem>
            <DescriptionsItem label="持续时间">
              {{ streamSummary.aliveSecond }}
            </DescriptionsItem>
            <DescriptionsItem label="网络">
              {{ streamSummary.bytesSpeed }}
            </DescriptionsItem>
          </Descriptions>
          <Divider v-if="streamSummary.videoCodec" />
          <Descriptions
            v-if="streamSummary.videoCodec"
            size="small"
            :column="1"
            bordered
          >
            <DescriptionsItem label="视频编码">
              {{ streamSummary.videoCodec }}
            </DescriptionsItem>
            <DescriptionsItem label="分辨率">
              {{ streamSummary.videoSize || '-' }}
            </DescriptionsItem>
            <DescriptionsItem label="FPS">
              {{ streamSummary.videoFps || '-' }}
            </DescriptionsItem>
            <DescriptionsItem label="丢包率">
              {{ streamSummary.videoLoss || '-' }}
            </DescriptionsItem>
          </Descriptions>
          <Divider v-if="streamSummary.audioCodec" />
          <Descriptions
            v-if="streamSummary.audioCodec"
            size="small"
            :column="1"
            bordered
          >
            <DescriptionsItem label="音频编码">
              {{ streamSummary.audioCodec }}
            </DescriptionsItem>
            <DescriptionsItem label="采样率">
              {{ streamSummary.audioSampleRate || '-' }}
            </DescriptionsItem>
          </Descriptions>
        </div>
      </aside>
    </div>
  </Modal>
</template>

<style scoped>
.video-play-modal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 12px;
  min-height: 0;
}

.video-play-modal__main {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
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
  width: min(520px, 44vw);
}

.video-play-modal__side {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  max-height: calc(min(62vh, 560px) + 42px);
  overflow: auto;
}

.video-play-panel {
  padding: 12px;
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 6px;
}

.video-play-panel__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}

.ptz-pad {
  display: grid;
  grid-template:
    '. up .' 36px
    'left center right' 36px
    '. down .' 36px
    / 40px 40px 40px;
  gap: 6px;
  justify-content: center;
}

.ptz-pad__btn {
  width: 40px;
  height: 36px;
  padding: 0;
}

.ptz-pad__up {
  grid-area: up;
}

.ptz-pad__left {
  grid-area: left;
}

.ptz-pad__center {
  grid-area: center;
}

.ptz-pad__right {
  grid-area: right;
}

.ptz-pad__down {
  grid-area: down;
}

.video-play-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

@media (max-width: 900px) {
  .video-play-modal {
    grid-template-columns: 1fr;
  }

  .video-play-modal__side {
    max-height: none;
  }

  .video-play-modal__url {
    width: min(520px, 68vw);
  }
}
</style>
