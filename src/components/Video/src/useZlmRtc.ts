import { unref,Ref } from 'vue';
import { useScript } from '/@/hooks/web/useScript';

export function useZlmRtc(rtcProps:RtcProps){
  let init = false;
  let success = false;
  let zlmRtcClient = null as any;
  let timer = null as any;
  let playTimer = null as any;
  let containerRef = rtcProps.containerRef;
  const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
  const {toPromise } = useScript({src:publicPath+'script/zlmRTC/ZLMRTCClient.js'});
  toPromise().then(()=>{
    createVideoDom();
    init = true;
  });
  //初始化video
  const createVideoDom =()=>{
    zlmRtcClient = new (window as any).ZLMRTCClient.Endpoint({
      element: unref(containerRef) || '',// video 标签
      debug: rtcProps.debug || true,// 是否打印日志
      zlmsdpUrl: rtcProps.videoUrl || '',//播放流地址
      simulecast: rtcProps.simulecast || false,
      useCamera: rtcProps.useCamera || false,
      audioEnable: rtcProps.audioEnable || false,
      videoEnable: rtcProps.videoEnable || false,
      recvOnly: rtcProps.recvOnly || true,
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
              success = false;
              zlmRtcClient.close();
              createVideoDom();
            }, 100)
        }
    });
    zlmRtcClient.on('WEBRTC_ON_LOCAL_STREAM',(s)=>{// 获取到了本地流
        eventcallbacK("LOCAL STREAM", "获取到了本地流")
    });
    success = true;
  }
  //播放
  const play = async ()=>{
    if(init && success){
      console.log("静态文件加载完成");
      playTimer && clearInterval(playTimer);
      unref(containerRef).play();
    }else{
      if(!playTimer){
        console.log("静态文件加载中...");
        if(init && !zlmRtcClient){
          createVideoDom();
        }
        playTimer = setInterval(() => play(), 800);
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
  }
  /**
   * 销毁事件
   * @returns 
   */
  const destroy = () =>{
    timer && clearTimeout(timer);
    playTimer && clearInterval(playTimer);
    if(!zlmRtcClient){
      return;
    }
    zlmRtcClient.close();
    zlmRtcClient = null;
    timer = null;
    playTimer = null;
    success = false;
  }

  /**
   * Rtc播放事件
   * @param type 事件类型
   * @param message 事件消息
   */
  const eventcallbacK = (type:string,message:string) =>{
    console.log("RTC 事件回调 type:"+type +" message:" +message);
  }
  return {zlmRtcClient,play,pause,destroy};
}


export interface RtcProps {
  containerRef?: Ref
  videoUrl?:string
  debug?:boolean
  simulecast?:boolean
  useCamera?:boolean
  audioEnable?:boolean
  videoEnable?:boolean
  recvOnly?:boolean
}