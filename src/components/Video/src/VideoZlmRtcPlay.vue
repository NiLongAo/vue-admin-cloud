<template>
  <video :class="`${prefixCls} relative w-full h-full m-auto `" controls autoplay id="containerRef" ref="containerRef">
    Your browser is too old which doesn't support HTML5 video.
  </video>
</template>
<script lang="ts" setup>
  import { isEmpty } from '/@/utils/is';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useScript } from '/@/hooks/web/useScript';
  import { ref, reactive,defineProps,onUnmounted,watch,nextTick } from 'vue';

  /**
   * 此播放器只能播放 H264
   */
  const {toPromise} =  useScript({src:"/src/components/Video/script/zlmRTC/ZLMRTCClient.js"});
  const containerRef = ref();
  let zlmRtcClient;
  const { prefixCls } = useDesign('video-rtp-play');
  const props = defineProps({
    //播放url
    videoUrl: {
        type: String ,
        default: null
    }
  });
  
  const stats = reactive({
    //播放url
    videoUrl:null as string | any,
    timer: undefined as NodeJS.Timeout | string | number | undefined,
  })

  watch(
    () => props.videoUrl,
    () => {
      //先注销
      pause();
      //然后播放
      play();
    },
  );

  const createVideoDom =(url:string)=>{
    console.log("url"+url);
    
    zlmRtcClient = new (window as any).ZLMRTCClient.Endpoint({
      element:containerRef.value,// video 标签
      debug: true,// 是否打印日志
      zlmsdpUrl: url,//流地址
      simulecast: false,
      useCamera: false,
      audioEnable: false,
      videoEnable: false,
      recvOnly: true,
    });
    zlmRtcClient.on('WEBRTC_ICE_CANDIDATE_ERROR',(e)=>{// ICE 协商出错
        eventcallbacK("ICE ERROR", "ICE 协商出错")
    });

    zlmRtcClient.on('WEBRTC_ON_REMOTE_STREAMS',(e)=>{//获取到了远端流，可以播放
        eventcallbacK("playing", "播放成功")
    });

    zlmRtcClient.on('WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED',(e)=>{// offer anwser 交换失败
        eventcallbacK("OFFER ANSWER ERROR ", "offer anwser 交换失败")
        if (e.code ==-400 && e.msg=="流不存在"){
            console.log("流不存在")
            stats.timer = setTimeout(()=>{
              zlmRtcClient.close();
                createVideoDom(url);
            }, 100)
        }
    });
    zlmRtcClient.on('WEBRTC_ON_LOCAL_STREAM',(s)=>{// 获取到了本地流
        eventcallbacK("LOCAL STREAM", "获取到了本地流")
    });
  }
  /**
   * Rtc播放事件
   * @param type 事件类型
   * @param message 事件消息
   */
  const eventcallbacK = (type:string,message:string) =>{
    console.log("RTC 事件回调 type:"+type +" message:" +message);
  }

   /**
   * 播放事件
   */
  const play =() =>{
    if(isEmpty(stats.videoUrl)){
      stats.videoUrl =props.videoUrl;
    }
    createVideoDom(stats.videoUrl);
  }
  /**
   * 暂停 事件 false 暂停 true 继续
   */
  const pause =() =>{
    if(!zlmRtcClient){
      return;
    }
    zlmRtcClient.close();
    zlmRtcClient = null;
  }
  
  //构建完成相关js后添加视频组件
  toPromise().then((msg)=>{
    play();
  })
  
  onUnmounted(()=>{
    stats.timer && clearTimeout(stats.timer);;
  });
</script>

<style lang="less" scoped>
 @prefix-cls: ~'@{namespace}-video-rtp-play';
 .@{prefix-cls} {
 }

</style>