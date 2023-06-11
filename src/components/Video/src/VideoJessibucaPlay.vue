<template>
  <div :class="`${prefixCls} relative w-full h-full m-auto `"  id="containerRef" ref="containerRef">
      <div class="absolute bottom-0 w-full h-8 bg-slate-800 backdrop-opacity-50 flex z-10" ref="buttonsBox">
          <div class="h-full w-full flex items-center  space-x-3 pl-4">
            <Icon class="cursor-pointer" :icon="`${!stats.playing?'ri:play-fill':'ic-sharp-pause'}`" size="25" color="#f8fafc" @click="pause(!stats.playing)"/>
            <Icon class="cursor-pointer" icon="ic-baseline-stop" size="25" color="#f8fafc" @click="destroy()"/>
            <Icon class="cursor-pointer" :icon="`${stats.isMute?'mdi-volume-high':'mdi-volume-off'}`" size="25" color="#f8fafc" @click="isMute(!stats.isMute)"/>
          </div>
          <div class="h-full w-full flex items-center justify-end space-x-3 pr-4">
            <span class="text-white select-none">{{ stats.kBps }} kb/s</span>
            <Icon class="cursor-pointer" icon="ri-screenshot-fill" size="25" color="#f8fafc" @click="screenshot()"/>
            <Icon class="cursor-pointer" icon="ic-twotone-refresh" size="25" color="#f8fafc" @click="play()"/>
            <Icon class="cursor-pointer" :icon="`${!stats.fullscreen?'mdi-fullscreen':'mdi-fullscreen-exit'}`" size="25" color="#f8fafc" @click="fullscreenSwich(!stats.fullscreen)"/>
          </div>
      </div>
  </div>
</template>
<script lang="ts" setup>
  import Icon from '@/components/Icon/Icon.vue';
  import { isEmpty } from '/@/utils/is';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useScript } from '/@/hooks/web/useScript';
  import { deepMerge } from '/@/utils';
  import { type Jessibuca} from '/@/components/Video';
  import { ref, reactive,defineProps,onMounted,onUnmounted,watch,nextTick } from 'vue';

  /**
   * 此播放器只能播放 H264
   */
  const {toPromise} =  useScript({src:"/src/components/Video/script/jessibuca/jessibuca.js"});
  const containerRef = ref();
  const buttonsBox = ref<HTMLElement | string>('');
  let jessibucaPlayer : Jessibuca;
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
  
  const stats = reactive({
    //播放url
    videoUrl:null as string | any,
    //网速
    kBps: 0,
    //是否开启声音，默认是关闭声音播放的
    isMute: false,
    //播放状态
    performance:"",
    //是否全屏
    fullscreen:false,
    //播放状态 true播放中 false暂停中
    playing:false,
    //是否已销毁
    destroy:true,
    //播放器所有参数
    options:{} as Jessibuca.Config,
  })

  watch(
    () => props.videoUrl,
    () => {
      //先注销
      destroy();
      //然后播放
      play();
    },
  );
  
  // watch(
  //   () => props.options,
  //   () => {
  //     //先注销
  //     destroy();
  //     //然后播放
  //     play();
  //   },
  //   { immediate: true },
  // );

  const createVideoDom =()=>{
    jessibucaPlayer = new (window as any).Jessibuca({...{container: containerRef.value},...stats.options}) as Jessibuca;
    jessibucaPlayer.on("load", function () {
      console.log("on load init");
    });

    jessibucaPlayer.on("log", function (msg) {
      console.log("on log", msg);
    });
    jessibucaPlayer.on("record", function (msg) {
      console.log("on record:", msg);
    });
    jessibucaPlayer.on("pause", function () {
      stats.playing = false;
    });
    jessibucaPlayer.on("play", function () {
      stats.playing = true;
    });
    jessibucaPlayer.on("fullscreen", function (msg) {
      console.log("on fullscreen", msg);
      stats.fullscreen = msg
    });

    jessibucaPlayer.on("mute", function (msg) {
      console.log("on mute", msg);
      stats.isMute = !msg;
    });
    jessibucaPlayer.on("audioInfo", function (msg) {
      console.log("audioInfo", msg);
    });

    jessibucaPlayer.on("bps", function (bps) {
      // console.log('bps', bps);

    });
    jessibucaPlayer.on("timeUpdate", function (ts) {
      // console.log('timeUpdate,old,new,timestamp', _ts, ts, ts - _ts);
    });

    jessibucaPlayer.on("videoInfo", function (info) {
      console.log("videoInfo", info);
    });

    jessibucaPlayer.on("error", function (error) {
      console.log("error", error);
    });

    jessibucaPlayer.on("timeout", function () {
      console.log("timeout");
    });

    jessibucaPlayer.on('start', function () {
      console.log('start');
    })

    jessibucaPlayer.on("performance", function (performance) {
      let show = "卡顿";
      if (performance === 2) {
        show = "非常流畅";
      } else if (performance === 1) {
        show = "流畅";
      }
      stats.performance = show;
    });
    jessibucaPlayer.on('buffer', function (buffer) {
      // console.log('buffer', buffer);
    })

    jessibucaPlayer.on('stats', function (stats) {
      // console.log('stats', stats);
    })

    jessibucaPlayer.on('kBps', function (kBps) {
      stats.kBps = Math.round(kBps);
    });
    // 显示时间戳 PTS
    jessibucaPlayer.on('videoFrame', function () {

    })

    jessibucaPlayer.on('metadata', function () {

    });
  }
  

   /**
   * 播放事件
   */
  const play =() =>{
    if(isEmpty(stats.videoUrl)){
      stats.videoUrl =props.videoUrl;
    }
    if(jessibucaPlayer.hasLoaded()){
      jessibucaPlayer.play(props.videoUrl);
      stats.videoUrl=props.videoUrl;
    }else{
      jessibucaPlayer.on("load",()=>{
        jessibucaPlayer.play(props.videoUrl);
        stats.videoUrl=props.videoUrl;
      })
    }
  }
  /**
   * 暂停/继续 事件 false 暂停 true 继续
   */
  const pause =(isPaly:boolean) =>{
    if(!jessibucaPlayer){
      return;
    }
    if(!isPaly){
      jessibucaPlayer?.pause();
      return;
    }
    if(!isEmpty(stats.videoUrl)){
      jessibucaPlayer?.play();
      return;
    }
    play();
  }
  /**
   * 截图事件
   */
  const screenshot =() =>{
    if(!jessibucaPlayer){
      return;
    }
    jessibucaPlayer?.screenshot();
  }
  /**
   * 声音事件 
   * isMute true 有声  false 无声
   */
  const isMute =(isMute:boolean) =>{
    if(!jessibucaPlayer){
      return;
    }
    if(!isMute){
      jessibucaPlayer?.mute();
    }else{
      jessibucaPlayer?.cancelMute();
    }
  }
  /**
   * 全屏事件
   * screen 是否全屏
   */
  const fullscreenSwich = (screen : boolean)=>{
    stats.fullscreen = screen;
    if(!jessibucaPlayer){
      return;
    }
    jessibucaPlayer.setFullscreen(screen);
  }
  /**
   * 销毁事件
   */
  const destroy = () =>{
    if(jessibucaPlayer){
      jessibucaPlayer?.destroy();
    }
    createVideoDom();
    stats.videoUrl=null;
    stats.kBps  = 0;
    stats.isMute=  false;
    stats.performance= "";
    stats.playing= false;
    stats.destroy= true;
  }
  //构建完成相关js后添加视频组件
  toPromise().then((msg)=>{
    createVideoDom();
    //进入直接播放
    play();
  })
  onMounted(()=>{
    stats.options = deepMerge(
        {
          autoWasm: true,
          background: "",
          controlAutoHide: false,
          debug: false,
          decoder: "/src/components/Video/script/jessibuca/decoder.js",
          forceNoOffscreen: true,
          hasAudio: typeof (props.hasAudio) == "undefined" ? true : props.hasAudio,
          hasVideo: true,
          heartTimeout: 10,
          heartTimeoutReplay: true,
          heartTimeoutReplayTimes: 3,
          hiddenAutoPause: false,
          hotKey: false,
          isFlv: false,
          isFullResize: false,
          isNotMute: stats.isMute,
          isResize: false,
          keepScreenOn: false,
          loadingText: "请稍等, 视频加载中......",
          loadingTimeout: 10,
          loadingTimeoutReplay: true,
          loadingTimeoutReplayTimes: 3,
          openWebglAlignment: false,
          operateBtns: {
            fullscreen: false,
            screenshot: false,
            play: false,
            audio: false,
            record: false
          },
          recordType: "webm",
          rotate: 0,
          showBandwidth: false,
          supportDblclickFullscreen: true,
          timeout: 10,
          useMSE: location.hostname !== "localhost" && location.protocol !== "https:",
          useOffscreen: false,
          useWCS: location.hostname === "localhost" || location.protocol === "https",
          useWebFullScreen: false,
          videoBuffer: 0.2,
          wasmDecodeAudioSyncVideo: true,
          wasmDecodeErrorReplay: true,
          wcsUseVideoRender: true
        },
        props?.options || {},
    ) as any;
    nextTick(()=>{
      const observer = new ResizeObserver((entries)=>{
        jessibucaPlayer && jessibucaPlayer?.resize()
      });
      observer.observe(containerRef.value);
    })
  })
  
  onUnmounted(()=>{
    jessibucaPlayer && jessibucaPlayer?.destroy();
  });
</script>

<style lang="less" scoped>
 @prefix-cls: ~'@{namespace}-video-play';
 .@{prefix-cls} {
 }

</style>