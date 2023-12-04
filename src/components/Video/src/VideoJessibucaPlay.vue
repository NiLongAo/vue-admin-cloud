<template>
  <div :class="`${prefixCls} relative w-full h-full m-auto `"  id="containerRef" ref="containerRef">
      <div class="absolute bottom-0 w-full h-8 bg-slate-800 backdrop-opacity-50 flex z-10" >
          <div class="h-full w-full flex items-center  space-x-3 pl-4">
            <Icon class="cursor-pointer" :icon="`${!stats.playing?'ri:play-fill':'ic-sharp-pause'}`" size="25" color="#f8fafc" @click="pause(!stats.playing)"/>
            <Icon class="cursor-pointer" icon="ic-baseline-stop" size="25" color="#f8fafc" @click="destroy()"/>
            <Icon class="cursor-pointer" :icon="`${stats.isMute?'mdi-volume-high':'mdi-volume-off'}`" size="25" color="#f8fafc" @click="onMute(!stats.isMute)"/>
          </div>
          <div class="h-full w-full flex items-center justify-end space-x-3 pr-4">
            <span class="text-white select-none">{{ stats.kBps }} kb/s</span>
            <Icon class="cursor-pointer" icon="ri-screenshot-fill" size="25" color="#f8fafc" @click="screenshot()"/>
            <Icon class="cursor-pointer" icon="ic-twotone-refresh" size="25" color="#f8fafc" @click="refresh()"/>
            <Icon class="cursor-pointer" :icon="`${!stats.fullscreen?'mdi-fullscreen':'mdi-fullscreen-exit'}`" size="25" color="#f8fafc" @click="fullscreenSwich(!stats.fullscreen)"/>
          </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useJessibuca } from './useJessibuca';
  import { ref,reactive,onUnmounted,watch } from 'vue';

  const containerRef = ref();
  const { prefixCls } = useDesign('video-play');

  const props = defineProps({
    //播放url
    videoUrl: {
        type: String ,
        default: null
    },
    //是否开启音频解码 默认不开启，
    hasAudio: {
        type: Boolean ,
        default: false
    },
    //播放器参数
    options:{
      type: Object as PropType<Recordable>,
      default: {}
    }
  });
  const use =  reactive({
    videoUrl:props.videoUrl,
    options:{},
    hasAudio:false,
    isMute: false,
  });
  const { stats,play,pause,refresh, screenshot,onMute,fullscreenSwich,destroy } = useJessibuca(containerRef,use);
  watch(
    () => props.videoUrl,
    () => {
      use.videoUrl = props.videoUrl;
    }
  );
  onUnmounted(()=>{
    destroy();
  });
  defineExpose({play,destroy });
</script>

<style lang="less" scoped>
 @prefix-cls: ~'@{namespace}-video-play';

</style>