import { unref,Ref,reactive,watch ,nextTick} from 'vue';
import { isEmpty } from '/@/utils/is';
import { deepMerge } from '/@/utils';
import { useScript } from '/@/hooks/web/useScript';


export interface JessibucaProps {
  videoUrl?:string
  options?:Recordable
  hasAudio?:boolean
  isMute?: boolean
}


export function useJessibuca(container: Ref,jessibucaProps:JessibucaProps){
  let jessibucaPlayer = null as any;
  let playTimer= null as any;

  const stats =  reactive({
     destroy: true,
     playing : false,
     fullscreen: false,
     isMute : jessibucaProps.isMute || false,
     performance: "",
     kBps: 0,
  })
  
  const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
  let options = deepMerge(
      {
        autoWasm: true,
        background: "",
        controlAutoHide: false,
        debug: false,
        decoder: publicPath+"script/jessibuca/decoder.js",
        forceNoOffscreen: true,
        hasAudio: typeof (jessibucaProps.hasAudio) == "undefined" ? true : jessibucaProps.hasAudio,
        hasVideo: true,
        heartTimeout: 5,
        heartTimeoutReplay: true,
        heartTimeoutReplayTimes:-1,
        hiddenAutoPause: false,
        hotKey: false,
        isFlv: false,
        isFullResize: false,
        isNotMute: stats.isMute,
        isResize: false,
        keepScreenOn: false,
        loadingText: "请稍等, 视频加载中......",
        loadingTimeout: 5,
        loadingTimeoutReplay: true,
        loadingTimeoutReplayTimes: -1,
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
        timeout: 5,
        useMSE: location.hostname !== "localhost" && location.protocol !== "https:",
        useOffscreen: false,
        useWCS: location.hostname === "localhost" || location.protocol === "https",
        useWebFullScreen: false,
        videoBuffer: 0,
        wasmDecodeAudioSyncVideo: true,
        wasmDecodeErrorReplay: true,
        wcsUseVideoRender: true
      },
      jessibucaProps?.options || {},
  ) as any;

  
  const { success } = useScript({src:publicPath+'script/jessibuca/jessibuca.js'});

  const createVideoDom =()=>{
    if(isEmpty(jessibucaProps.videoUrl)){
      return;
    }
    jessibucaPlayer = new (window as any).Jessibuca({...{container: unref(container)},...options});
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
      performance = show;
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
    stats.destroy =false;
  }
  /**
   * 播放事件
   */
  const play = (url?:string) =>{
    if(isEmpty(jessibucaProps.videoUrl)){
      return;
    }
    const sucs = unref(success); //true表示已加载静态文件
    const plyUrl = isEmpty(url)?jessibucaProps.videoUrl:url;
    if(sucs){
      playTimer && clearInterval(playTimer);
    }else{
      if(!playTimer){
        playTimer = setInterval(() => play(plyUrl), 800);
        setTimeout(()=>{
          playTimer && clearInterval(playTimer)
          playTimer = null;
        },5000);
      }
      return;
    }
    nextTick(()=>{
      if(!jessibucaPlayer){
        createVideoDom();
      }
      if(jessibucaPlayer.hasLoaded()){
        jessibucaPlayer.play(plyUrl);
      }else{
        jessibucaPlayer.on("load",()=>{
          jessibucaPlayer.play(plyUrl);
        })
      }
      const observer = new ResizeObserver((entries)=>{
        jessibucaPlayer && jessibucaPlayer?.resize()
      });
      observer.observe(unref(container));
    })
  }

   /**
   * 暂停/继续 事件 false 暂停 true 继续
   */
   const pause =(isPaly:boolean) =>{
    stats.playing = isPaly
    if(!isPaly){
      jessibucaPlayer?.pause();
    }else{
      if(stats.destroy){
        play();
      }else{
        jessibucaPlayer?.play();
      }
    }
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
  const onMute =(isMute:boolean) =>{
    if(!jessibucaPlayer){
      return;
    }
    stats.isMute = isMute;
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
   * 刷新
   */
  const refresh = ()=>{
    destroy();
    play();
  }

  /**
   * 销毁事件
   */
  const destroy = () =>{
    if(jessibucaPlayer){
      jessibucaPlayer?.destroy();
    }
    playTimer = null;
    stats.destroy = true;
    stats.kBps  = 0;
    stats.isMute=  false;
    stats.performance= "";
    stats.playing= false;
    jessibucaPlayer = null;
    jessibucaProps.videoUrl= "";
  }

  watch(
    () => jessibucaProps,
    () => {
      nextTick(()=>{
        //播放
        play();
      })
    },
    {immediate: true,deep: true,},
  );

  return {
    stats,
    play,
    pause,
    refresh,
    screenshot,
    onMute,
    fullscreenSwich,
    destroy
  };
}
