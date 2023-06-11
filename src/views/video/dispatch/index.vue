<template>
  <PageWrapper dense contentFullHeight fixedHeight :contentClass="`${prefixCls} flex`">
    <VideoDeviceChannelTree
      ref="TypeTreeRef"
      class="lg:w-2/10 tree bg-white overflow-hidden mr-4"
      @select="handleSelect">
    </VideoDeviceChannelTree>
    
    <div class="lg:w-8/10 flex flex-col">
        <div class="h-12 bg-slate-50 w-full flex items-center text-xl px-4">
            分屏：
            <Icon class="cursor-pointer" icon="mingcute-fullscreen-line" size ="30" :color="`${state.num === 1 ?'#3b82f6':''}`" @click="checkGrid(1)"/>
            <Icon class="cursor-pointer" icon="ic:outline-grid-view" size ="30" :color="`${state.num === 4 ?'#3b82f6':''}`" @click="checkGrid(4)"/>
            <Icon class="cursor-pointer" icon="ic:outline-grid-on" size ="30" :color="`${state.num === 9 ?'#3b82f6':''}`" @click="checkGrid(9)"/>
        </div>
        <div :class="`inline-grid ${state.num===4?'grid-cols-2':state.num===9?'grid-cols-3':''}  gap-0.5 w-full h-full`" >
          <div :class="`bg-black border-2 ${state.checkIndex ===i?' border-pink-700':''} flex items-center`" v-for="i in state.num" @click="checkVideo(i)">
              <p v-if="isEmpty(state.videoUrl[i-1])" class="w-full text-center font-semibold text-xl m-0 text-gray-50">{{i}}</p>
              <VideoZlmRtcPlay v-else :videoUrl="state.videoUrl[i-1]"/>
          </div>
        </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageWrapper } from '/@/components/Page';
  import { VideoDeviceChannelTree ,VideoJessibucaPlay,VideoZlmRtcPlay} from '/@/components/Video';
  import Icon from '@/components/Icon/Icon.vue';
  import { doPlayStart } from '/@/api/video/paly';
  import { isEmpty } from '/@/utils/is';
  import { reactive } from 'vue';

  const { prefixCls } = useDesign('video-dispatch');
  const state = reactive({
    num : 1,
    checkIndex : 1,
    videoUrl:[] as Array<String>,
  })

  /**
   * 点击字典类型事件
   * @param typeId 
   */
  const handleSelect = async(obj) => {
    if(isEmpty(obj)){
      return;
    }
    /**
     * type  类型 1.设备 2.通道
     * isChildren 是否有下级
     * deviceId 设备编号
     * channelId 通道编号
     */
    const {type,isChildren,parentId:deviceId,id:channelId} = obj;
    if(type == 1 || isChildren || !deviceId){
      return;
    }
    //state.videoUrl[state.checkIndex-1]="https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv";
    state.videoUrl[state.checkIndex-1]="http://192.168.1.130:8080/index/api/webrtc?app=app&stream=chient&type=play";
    //开始播放接口 flv http地址 wsFlv ws播放地址
    const {flv} = await doPlayStart({deviceId,channelId});
    state.videoUrl[state.checkIndex-1] = flv.url
    if(state.checkIndex >= state.num){
      state.checkIndex = 1;
    }else{
      state.checkIndex = state.checkIndex +1;
    }
  };
/**
   * 点击字典类型事件
   * @param typeId 
   */
   const checkGrid = (num) => {
    state.num =num;
  };
  /**
   * 选中video框事件
   * @param index 下表
   */
  const checkVideo = (index) => {
    state.checkIndex =index
  };
</script>
<style lang="less" scoped>
 @prefix-cls: ~'@{namespace}-video-dispatch';
 .@{prefix-cls} {
    .tree{

    }
 }

</style>