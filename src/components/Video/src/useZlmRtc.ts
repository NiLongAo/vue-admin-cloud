import { unref,ref,Ref,watch,nextTick } from 'vue';
import { useScript } from '/@/hooks/web/useScript';
import { isEmpty } from '/@/utils/is';
import { deepMerge } from '/@/utils';

const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';

export interface RtcProps {
  zlmsdpUrl?:string
  debug?:boolean
  simulecast?:boolean
  useCamera?:boolean
  audioEnable?:boolean
  videoEnable?:boolean
  recvOnly?:boolean
}

 export function useZlmRtc(rtcProps:RtcProps,container?:Ref){
  const { success } = useScript({src:publicPath+'script/zlmRTC/ZLMRTCClient.js'});
  let zlmRtcClient = null as any;
  let timer = null as any;
  let playTimer = null as any;
  let playTimeout = null as any;
  let localSteam = ref(false);

  //初始化video
  const createVideoDom = ()=>{
    if(isEmpty(rtcProps.zlmsdpUrl)){
      return;
    }
    zlmRtcClient = new (window as any).ZLMRTCClient.Endpoint({
      ...deepMerge(
        {
          zlmsdpUrl: '',//播放流地址
          debug: false,// 是否打印日志
          simulecast: false,
          useCamera: false,
          audioEnable: false,
          videoEnable: false,
          recvOnly:true,
        },
        rtcProps || {}
      ),
      element: unref(container) || '',// video 标签
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
            timer = setTimeout(()=>{
              zlmRtcClient.close();
              createVideoDom();
            }, 100)
        }
    });
    zlmRtcClient.on('WEBRTC_ON_LOCAL_STREAM',(s)=>{// 获取到了本地流
      localSteam.value = true;
      eventcallbacK("LOCAL STREAM", "获取到了本地流")
    });
    console.log(zlmRtcClient);
  }
  //播放
  const play = ()=>{
    if(isEmpty(rtcProps.zlmsdpUrl)){
      return;
    }
    if(unref(success)){
      if(!zlmRtcClient){
        createVideoDom();
      }
      playTimer && clearInterval(playTimer);
      playTimer = null;
      playTimeout && clearInterval(playTimeout)
      playTimeout = null;
      setTimeout(()=>{unref(container)?.play()}, 350)
    }else{
      if(!playTimer){
        playTimer = setInterval(() => play(), 800);
        playTimeout= setTimeout(()=>{
          playTimer && clearInterval(playTimer)
          playTimer = null;
        },5000);
      }
      return;
    }
    
  }
  //暂停
  const pause =() =>{
    if(!zlmRtcClient){
      return;
    }
    zlmRtcClient.close();
    localSteam.value = false;
  }
  /**
   * 销毁事件
   * @returns 
   */
  const destroy = () =>{
    timer && clearTimeout(timer);
    playTimer && clearInterval(playTimer);
    playTimeout && clearInterval(playTimeout)
    localSteam.value = false;
    timer = null;
    playTimer = null;
    playTimeout = null;
    if(!zlmRtcClient){
      return;
    }
    zlmRtcClient.close();
    zlmRtcClient = null;
    
  }

  watch(
    () => rtcProps,
    () => {
      nextTick(()=>{
        //先注销
        destroy();
        //然后播放
        play();
      })
    },
    {immediate: true,deep: true,},
  );

  /**
   * Rtc播放事件
   * @param type 事件类型
   * @param message 事件消息
   */
  const eventcallbacK = (type:string,message:string) =>{
    console.log("RTC 事件回调 type:"+type +" message:" +message);
  }
  return {zlmRtcClient,success,localSteam,play,pause,destroy};
}