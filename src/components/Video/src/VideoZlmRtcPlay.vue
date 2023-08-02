<template>
  <video :class="`${prefixCls} relative w-full h-full m-auto `" controls muted id="containerRef" ref="containerRef">
    Your browser is too old which doesn't support HTML5 video.
  </video>
</template>
<script lang="ts" setup>
  import { useDesign } from '/@/hooks/web/useDesign';
  import { ref,reactive,onUnmounted ,watch} from 'vue';
  import { useZlmRtc } from './useZlmRtc';
  const containerRef = ref();
  const { prefixCls } = useDesign('video-rtp-play');
  const props = defineProps({
    //播放url
    videoUrl: {
        type: String ,
        default: null
    }
  });

  const use =  reactive({
    zlmsdpUrl:props.videoUrl,
  });

  const {play,destroy} = useZlmRtc(use,containerRef);

  watch(
    () => props.videoUrl,
    () => {
      use.zlmsdpUrl = props.videoUrl;
    }
  );

  onUnmounted(()=>{
    destroy();
  });

  defineExpose({ play,destroy });
</script>

<style lang="less" scoped>
 @prefix-cls: ~'@{namespace}-video-rtp-play';
 .@{prefix-cls} {
 }

</style>