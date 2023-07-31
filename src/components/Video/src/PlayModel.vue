<template>
  <BasicModal v-bind="$attrs" :maskClosable="false" @register="registerModal" title="播放器" @cancel="handleCancel" width="1200px" :footer="null">
    <div :class="` ${prefixCls} flex flex-row gap-x-px `">
      <div :class="props.control?`${prefixCls}-left grid grid-rows-16  grid-cols-1 basis-16/20`:`${prefixCls}-left grid grid-rows-16  grid-cols-1 grow`">
        <!-- 选择器 :footer="{ disabled: true }"-->
        <div :class="`${prefixCls}-left-top row-span-1`">
            <RadioButtonGroup :value="stats.selectPlay" :options="stats.options" @change="handleSelectPlay"/>
        </div>
        <!-- 播放器 -->
        <div :class=" `${prefixCls}-left-video bg-black grid row-span-15`">
            <component ref="payVideo" :is="payComponent" :videoUrl='payUrl'/>
        </div>
          <!-- 播放地址 -->
        <div :class="`${prefixCls}-left-bot mt-2 row-span-0 space-y-2`" v-if="stats.selectPlay === 'Jessibuca'">
          <Input v-model:value="payUrl" disabled>
            <template #addonBefore > 
              <Dropdown trigger="click" :overlayClassName="`${prefixCls}-left-dropdown`">
                <template #overlay >
                  <Menu @click="handleMenuClick">
                    <MenuItem :key="val" v-for="val in Object.keys(stats.jessibucaMap)">
                      <Input :defaultValue="stats.jessibucaMap[val].value" disabled>
                        <template #addonBefore >
                          {{stats.jessibucaMap[val].name}} 
                        </template>
                        <template #addonAfter>
                          <Button :class="`${prefixCls}-left-bot-cope`" @click="handleCopy(stats.jessibucaMap[val].value)">复制</Button>
                        </template>
                      </Input>
                    </MenuItem>
                  </Menu>
                </template>
                <Button :class="`${prefixCls}-left-bot-cope`">
                  更多地址
                  <Icon class="cursor-pointer" icon="ic-baseline-keyboard-arrow-down" />
                </Button>
              </Dropdown>
            </template>
            <template #addonAfter>
              <Button :class="`${prefixCls}-left-bot-cope`" @click="handleCopy(stats.jessibucaMap[stats.playType].value)">复制</Button>
            </template>
          </Input>
        </div>
      </div>
      <Divider  v-if="props.control" style="height: auto;background-color: #fff;" type="vertical" dashed />
      <div v-if="props.control" :class="`${prefixCls}-right basis-4/20 row-span-3 flex flex-col `">
        <!-- 方向控制 -->
        <div :class="`${prefixCls}-right-direction`">
          <Divider>方向控制</Divider>
          <div class="flex relative">
            <div class="grow flex items-center justify-center h-35 relative ">
              <div class=" grid grid-cols-2 gap-4 place-content-stretch h-36 w-36 rotate-45 z-0">
                <div class="relative border-solid border-1 border-sky-500  rounded-tl-full  cursor-pointer" @mousedown="ptzCamera('up')" @mouseup="ptzCamera('stop')">
                  <div class="absolute bottom-0 right-0 w-9 h-9 border-t-1 border-l-1  border-solid border-sky-500 rounded-tl-full"></div>
                  <Icon class="absolute cursor-pointer  bottom-6.5 right-6.5 z-3 -rotate-45" icon="teenyicons-triangle-solid"  color="#0ea5e9"/>
                </div>
                <div class="relative  border-solid border-1 border-sky-500 rounded-tr-full cursor-pointer" @mousedown="ptzCamera('right')" @mouseup="ptzCamera('stop')">
                  <div class="absolute bottom-0 left-0 w-9 h-9  border-t-1 border-r-1 border-solid border-sky-500 rounded-tr-full"></div>
                  <Icon class="absolute cursor-pointer  bottom-6.5 left-6.5 z-3 rotate-45" icon="teenyicons-triangle-solid"  color="#0ea5e9"/>
                </div>
                <div class="relative  border-solid border-1 border-sky-500 rounded-bl-full cursor-pointer" @mousedown="ptzCamera('left')" @mouseup="ptzCamera('stop')">
                  <div class="absolute top-0 right-0 w-9 h-9 border-b-1 border-l-1 border-solid border-sky-500 rounded-bl-full"></div>
                  <Icon class="absolute cursor-pointer  top-6.5 right-6.5 z-3 rotate-225" icon="teenyicons-triangle-solid"  color="#0ea5e9"/>
                </div>
                <div class="relative  border-solid border-1 border-sky-500 rounded-br-full cursor-pointer" @mousedown="ptzCamera('down')" @mouseup="ptzCamera('stop')">
                  <div class="absolute top-0 left-0 w-9 h-9 border-b-1 border-r-1 border-solid  border-sky-500 rounded-br-full"></div>
                  <Icon class="absolute cursor-pointer  top-6.5 left-6.5 z-3 rotate-135" icon="teenyicons-triangle-solid"  color="#0ea5e9"/>
                </div>
              </div>
              <div class="absolute bg-white h-22 w-22 border-solid rounded-full z-1"></div>
              <div :class="`${audioClickStyle} absolute z-2  h-15 w-15 border-solid rounded-full border-1 border-sky-500 flex items-center justify-center cursor-pointer`" @click="audioIntercom">
                <Icon class="cursor-pointer " :icon="`ic-outline-keyboard-voice`" size="40" color="#0ea5e9"/>
              </div>
            </div>
            <div class=" flex flex-col relative">
              <div class="flex-1 flex items-center ">
                <Icon class="cursor-pointer" size="26" icon="solar-magnifer-zoom-in-outline" @mousedown="ptzCamera('zoomin')" @mouseup="ptzCamera('stop')"/>
              </div>
              <div class="flex-1 flex items-center ">
                <Icon class="cursor-pointer" size="26" icon="solar-magnifer-zoom-out-linear" @mousedown="ptzCamera('zoomout')" @mouseup="ptzCamera('stop')"/>
              </div>
            </div>
          </div>
          <div>
            <Slider v-model:value="stats.directionSpeed" :min="0" :max="255"/>
          </div>
        </div>
        <!-- 云台控制 -->
        <div :class="`${prefixCls}-right-ptz grow `">
          <Divider>云台控制</Divider>
          <div class="flex flex-col space-y-3">
            <div class="flex flex-col space-y-1">
              <div>
                <InputNumber v-model:value="stats.presetPositionNo" :min="1" :max="255" size="small">
                  <template #addonBefore >
                    预设位编号
                  </template>
                  <template #addonAfter>
                    <Button size="small" @click="ptzCommand(129,0,stats.presetPositionNo,0)">设置</Button>
                  </template>
                </InputNumber>
              </div>
              <div class="flex flex-row">
                <Button class="flex-1" @click="ptzCommand(131,0,stats.presetPositionNo,0)" size="small">删除</Button>
                <Button type="primary" class="flex-1" @click="ptzCommand(130,0,stats.presetPositionNo,0)" size="small">调用</Button>
              </div>
            </div>
            <div class="flex flex-col space-y-1">
              <div>
                <InputNumber v-model:value="stats.ruiseSpeed" :min="1" :max="4095" size="small">
                  <template #addonBefore >
                    巡航速度
                  </template>
                  <template #addonAfter>
                    <Button size="small" @click="ptzCommand(134,stats.cruiseGroupNo,(stats.ruiseSpeed % 256),(Math.floor(stats.ruiseSpeed / 256) * 16))">设置</Button>
                  </template>
                </InputNumber>
                <InputNumber v-model:value="stats.ruiseResidenceTime" :min="1" :max="4095" size="small">
                  <template #addonBefore >
                    停留时间
                  </template>
                  <template #addonAfter>
                    <Button size="small" @click="ptzCommand(135,stats.cruiseGroupNo,(stats.ruiseResidenceTime % 256),(Math.floor(stats.ruiseResidenceTime / 256) * 16))">设置</Button>
                  </template>
                </InputNumber>
                <InputNumber v-model:value="stats.cruiseGroupNo" :min="1" :max="255" size="small">
                  <template #addonBefore >
                    巡航组编号
                  </template>
                </InputNumber>
              </div>
              <div class="flex flex-row">
                <Button class="flex-1" size="small" @click="ptzCommand(132,stats.cruiseGroupNo,stats.presetPositionNo,0)">添加点</Button>
                <Button class="flex-1" size="small" @click="ptzCommand(133,stats.cruiseGroupNo,stats.presetPositionNo,0)"> 删除点</Button>
                <Button class="flex-1" size="small" @click="ptzCommand(133,stats.cruiseGroupNo,0,0)">删除组</Button>
                <Button type="primary" size="small" class="flex-1" @click="ptzCommand(136,stats.cruiseGroupNo,0,0)">巡航</Button>
              </div>
            </div>
            <div class="flex flex-col space-y-1">
              <div>
                <InputNumber v-model:value="stats.scanSpeed" :min="1" :max="4095" size="small">
                  <template #addonBefore >
                    扫描速度
                  </template>
                  <template #addonAfter>
                    <Button size="small" @click="ptzCommand(138,stats.scanGroupNo,(stats.scanSpeed % 256),(Math.floor(stats.scanSpeed / 256) * 16))">设置</Button>
                  </template>
                </InputNumber>
                <InputNumber v-model:value="stats.scanGroupNo" :min="1" :max="255" size="small">
                  <template #addonBefore >
                    扫描组编号
                  </template>
                </InputNumber>
              </div>
              <div class="flex flex-row">
                <Button class="flex-1" size="small" @click="ptzCommand(137,stats.cruiseGroupNo,1,0)">左边界</Button>
                <Button class="flex-1" size="small" @click="ptzCommand(137,stats.cruiseGroupNo,2,0)" >右边界</Button>
                <Button type="primary" size="small" class="flex-1" @click="ptzCommand(137,stats.cruiseGroupNo,0,0)">扫描</Button>
                <Button type="primary" size="small" danger class="flex-1" @click="ptzCamera('stop')">停止</Button>
              </div>
            </div>
          </div>
        </div>
        <!-- 流信息 -->
        <div :class="`${prefixCls}-right-stream overflow-y-auto`">
          <Divider>流信息</Divider>
          <p v-if="isEmpty(stats.tracks)">暂无数据</p>
          <Descriptions title="视频1" size="small" :column="1" v-if="isNotEmpty(stats.tracks)">
            <template :key="index" v-for="(val,index) in stats.tracks">
              <template v-if="val.codecType == 0">
                <DescriptionsItem label="格式：">{{ val?.codecIdName }}</DescriptionsItem>
                <DescriptionsItem label="类型：">视频</DescriptionsItem>
                <DescriptionsItem label="分辨率：">{{ val.width }} x {{ val.height }}</DescriptionsItem>
                <DescriptionsItem label="帧率：">{{ val.fps }}</DescriptionsItem>
              </template>
              <template v-if="val.codecType == 1">>
                <DescriptionsItem label="格式：">{{ val.codecIdName }}</DescriptionsItem>
                <DescriptionsItem label="类型：">音频</DescriptionsItem>
                <DescriptionsItem label="采样位数：">{{ val.sampleBit }}</DescriptionsItem>
                <DescriptionsItem label="采样率：">{{ val.sampleRate }}</DescriptionsItem>
              </template>
              <template v-if="index < stats.tracks.length">
                <DescriptionsItem ><Divider/></DescriptionsItem>
              </template>
            </template>
          </Descriptions>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive,ref,unref,computed,nextTick,defineAsyncComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { RadioButtonGroup } from '/@/components/Form';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isEmpty,isNotEmpty,isFunction } from '/@/utils/is';
  import { setObjToUrlParams } from '/@/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Icon from '@/components/Icon/Icon.vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import {doPtzPtz,doPtzFrontEndCommand} from '/@/api/video/ptz';
  import { useZlmRtc } from '/@/components/Video';
  import { Input,InputNumber,Descriptions,DescriptionsItem, Button ,Divider ,Slider,Dropdown,Menu,MenuItem} from 'ant-design-vue';

  const VideoJessibucaPlay = defineAsyncComponent(() => import('./VideoJessibucaPlay.vue'))
  const VideoZlmRtcPlay = defineAsyncComponent(() => import('./VideoZlmRtcPlay.vue'))
  const payVideo = ref();
  const { prefixCls } = useDesign('video-play-model');
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const { createMessage } = useMessage();
  const payComponent : any = computed(()=>{
    if(stats.selectPlay =="Jessibuca"){
      return VideoJessibucaPlay;
    }else if(stats.selectPlay =="ZlmRtc"){
      return VideoZlmRtcPlay;
    }
  })

  const props = defineProps({
    //播放url
    control: {
        type: Boolean ,
        default: false
    },
    auth: {
        type: String ,
        default: null
    },
    //获取推流地址
    audioPushApi: {
        type: Function as PropType<PromiseFn>,
        default: null
    },
    //广播推流地址
    broadcastApi: {
        type: Function as PropType<PromiseFn>,
        default: null
    },
  });
  const stats = reactive({
    //视频相关
    selectPlay:"Jessibuca",//选择的播放器
    playType:"wsFlv",//默认播放地址
    playing: true,//播放状态
    options:[
      {
        label:"Jessibuca",
        value:"Jessibuca",
      },
      {
        label:"ZlmRtc",
        value:"ZlmRtc",
      }
    ],//播放器信息
    //控制相关
    directionSpeed:30,//方向速度
    presetPositionNo:1,//预设位编号
    cruiseGroupNo:1,//巡航组编号
    ruiseSpeed:1,//巡航速度
    ruiseResidenceTime:1,//巡航停留时间
    scanGroupNo:1,//扫描组编号
    scanSpeed:1,//扫描速度
    //视频流相关
    app:"",//app编号
    stream:"",//流编号
    deviceId:"",//设备编号
    channelId:"",//通道编号
    mediaServerId:"",//流媒体编号
    tracks:[] as any,// 流编码信息
    zlmRtcUrl:{}  as any,//zlmrtc播放地址
    jessibucaMap:{}  as any,//jessibuca播放地址
    //语音对讲相关
    onAudio:0 as number,//语音对讲状态 0.关闭中 1.加载中 2.加载完成
    audioTimer:null as any,//语音加载检测器
    audioTimeout:null as any,//语音加载检测器
    broadcastTimer:null as any,//语音广播加载检测器
    broadcastTimeout:null as any,//语音广播加载检测器
  })
  const pushStats = reactive({
    zlmsdpUrl: '',
    audioEnable:true,
    recvOnly:false,
    debug:true
  })

  const audioClickStyle = computed(()=>{
    if(stats.onAudio===1){
      return "bg-amber-200";
    }else if(stats.onAudio===2){
      return "bg-sky-300";
    }
    return "";
  })


  //获取播放地址
  const payUrl = computed(()=>{
    let url ;
    if(stats.selectPlay === 'Jessibuca'){
      url = stats.jessibucaMap[stats.playType]?.value;
    }else{
      url = stats.zlmRtcUrl?.value;
    }
    return url;
  })
  const handleSelectPlay=(val)=>{
    stats.selectPlay = val;
  }
  //复制触发
  const handleCopy=(value)=>{
    if (!value) {
      createMessage.warning('未获取要拷贝的内容！');
      return;
    }
    clipboardRef.value = value;
    if (unref(copiedRef)) {
       createMessage.success('复制成功。');
    }
  }
  //下拉更多点击
  const handleMenuClick = (val)=>{
    stats.playType = val.key;//切换播放key
  }
  //云台控制请求
  const ptzCamera = async (code:string) =>{
    await doPtzPtz({
      deviceId:stats.deviceId,
      channelId:stats.channelId,
      command:code,
      horizonSpeed:stats.directionSpeed,
      verticalSpeed:stats.directionSpeed,
      zoomSpeed:stats.directionSpeed
    });
  }
  //云台指令请求
  const ptzCommand = async (code:number,parameter1:number,parameter2:number,combindCode2:number) =>{
    await doPtzFrontEndCommand({
      deviceId:stats.deviceId,
      channelId:stats.channelId,
      cmdCode:code,
      parameter1:parameter1,
      parameter2:parameter2,
      combindCode2:combindCode2
    });
  }
  //语音对讲
  const {success,localSteam,destroy} = useZlmRtc(pushStats);//加载 webrtc 语音对讲配置
  const audioIntercom = async () =>{
    if(!isFunction(props.audioPushApi)){
      return;
    }
    if(stats.onAudio == 1){
      console.log("组件加载中，防止重新点击");
      return;
    }else if(stats.onAudio == 0){//关闭时触发查询 并 初始化语音组件
      const data = await props.audioPushApi({deviceId:stats.deviceId});
      pushStats.zlmsdpUrl = authUrl(data);
      console.log("语音组件参数：",pushStats);
    }
    initAudio();
  }
  const initAudio= () =>{
    if(stats.onAudio == 0 || stats.onAudio == 1){
      stats.onAudio = 1;
      if(!unref(success)){
        console.log("语音组件加载中...");
        if(!stats.audioTimer){
          stats.audioTimer = setInterval(() => initAudio(), 500);
          stats.audioTimeout = setTimeout(()=>{
            stats.onAudio = 0;
            stats.audioTimer && clearInterval(stats.audioTimer);
            stats.audioTimer = null;
            clearInterval(stats.audioTimeout);
            stats.audioTimeout = null;
          },5000);
        }
        return;
      }
      console.log("语音组件加载完成...");
      stats.onAudio = 2;
      stats.audioTimer && clearInterval(stats.audioTimer);
      stats.audioTimeout && clearInterval(stats.audioTimeout);
      stats.audioTimer = null;
      stats.audioTimeout = null;
      //加载完成后准备开始语音广播
      initBroadcast();
    }else{
      stats.onAudio = 0;
      pushStats.zlmsdpUrl="";
      //销毁对讲
      destroy();
      console.log("语音组件销毁完成...");
    }
  }

  const initBroadcast = () =>{
    //查看流是否已加载
    if(!isFunction(props.broadcastApi)){
      return;
    }
    if(!unref(localSteam)){
      console.log("语音流加载中...");
      if(!stats.broadcastTimer){
        stats.broadcastTimer = setInterval(() => initBroadcast(), 500);
        stats.broadcastTimeout = setTimeout(()=>{
          stats.broadcastTimer && clearInterval(stats.broadcastTimer);
          stats.broadcastTimer = null;
          clearInterval(stats.broadcastTimeout);
          stats.broadcastTimeout = null;
        },5000);
      }
      return;
    }else{
      stats.broadcastTimer && clearInterval(stats.broadcastTimer);
      stats.broadcastTimer = null;
      stats.broadcastTimeout && clearInterval(stats.broadcastTimeout);
      stats.broadcastTimeout = null;
      props.broadcastApi({deviceId:stats.deviceId});
    }
  }

  const authUrl= (url) =>{
    if(isEmpty(props.auth)){
        return url;
    }
    return setObjToUrlParams(url,{token:props.auth});
  }

  const handleCancel = () =>{
    unref(payVideo).destroy();
  }

  const [registerModal, { setModalProps }] = useModalInner((data) => {
    setModalProps({ confirmLoading: false });
    if(!data){
        return
    }
    const {sslStatus,app,stream,deviceId,channelId,mediaServerId,tracks,flv,wsFlv,ts,wsTs,httpsFlv,wssFlv,httpsTs,wssTs,rtc,rtcs} = data;
    stats.app = app;
    stats.stream = stream;
    stats.deviceId = deviceId;
    stats.channelId = channelId;
    stats.mediaServerId = mediaServerId;
    stats.tracks = tracks;
    stats.jessibucaMap={
      flv:{
        name:"flv地址",
        value:authUrl(sslStatus==0?flv?.url:httpsFlv?.url)
      },
      wsFlv:{
        name:"wsFlv地址",
        value:authUrl(sslStatus==0?wsFlv?.url:wssFlv?.url)
      },
      ts:{
        name:"ts地址",
        value:authUrl(sslStatus==0?ts?.url:httpsTs?.url)
      },
      wsTs:{
        name:"wsTs地址",
        value:authUrl(sslStatus==0?wsTs?.url:wssTs?.url)
      },
    }
    stats.zlmRtcUrl={
      name: "rtc地址",
      value: authUrl(sslStatus==0?rtc?.url:rtcs?.url)
    }
    nextTick(()=>{
      unref(payVideo)?.play();
    })
  });

</script>
<style lang="less">
 @prefix-cls: ~'@{namespace}-video-play-model';
.@{prefix-cls} {
  min-height: 680px;
  &-left{
    min-width: 600px;
    &-bot{
      &-cope{
        border: none;
        height: 30px;
      }
      .ant-input-group-addon{
        padding: 0 0;
      }
    }
    &-dropdown{
      width: 853px;
      .ant-dropdown-menu-item{
        padding: 4px 1px;
      }
      .ant-input-group-addon{
        padding: 0 0;
      }
      .ant-input-group-addon:nth-of-type(1){
        width: 108px;
      }
      .ant-input-group-addon:nth-of-type(2){
        width: 63px;
      }
    }
  }
  &-right{
    min-width: 300px;
    &-ptz{
      .ant-input-number-group-addon:first-child {
          width: 83px;
          border-right: 0;
      }
      .ant-input-number-group-addon:last-child {
          border-left: 0;
          border: none;
          padding:0
      }
    }
    &-stream{
      min-height: 186px;
      height: 186px;
    }
    .ant-divider-with-text-center{
      margin: 5px 0;
    }
  }
}
</style>