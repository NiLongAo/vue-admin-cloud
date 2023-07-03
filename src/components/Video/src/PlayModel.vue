<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="播放器" width="1200px" :footer="null">
    <div :class="` ${prefixCls} flex flex-row gap-x-px `">
      <div :class="`${prefixCls}-left  basis-16/20 grid grid-rows-16 grid-cols-1`">
        <!-- 选择器 :footer="{ disabled: true }"-->
        <div :class="`${prefixCls}-left-top row-span-1`">
            <RadioButtonGroup :value="stats.selectPlay" :options="stats.options" @change="handleSelectPlay"/>
        </div>
        <!-- 播放器 -->
        <div :class=" `${prefixCls}-left-video bg-black grid row-span-15`">
            <VideoJessibucaPlay v-if="stats.selectPlay === 'Jessibuca'" :videoUrl='stats.jessibucaMap[stats.playType]?.value' />
            <VideoZlmRtcPlay v-if="stats.selectPlay === 'ZlmRtc'" :videoUrll='stats.zlmRtcUrl?.value'/>
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
      <Divider style="height: auto;background-color: #fff;" type="vertical" dashed />
      <div  :class="`${prefixCls}-right basis-4/20 row-span-3 flex flex-col `">
        <!-- 方向控制 -->
        <div :class="`${prefixCls}-right-direction`">
          <Divider>方向控制</Divider>
          <div class="flex relative">
            <div class="grow flex items-center justify-center h-35 relative ">
              <div class=" grid grid-cols-2 gap-4 place-content-stretch h-36 w-36 rotate-45 z-0">
                <div class="relative border-solid border-1 border-blue-600  rounded-tl-full  cursor-pointer" @mousedown="ptzCamera('up')" @mouseup="ptzCamera('stop')">
                  <div class="absolute bottom-0 right-0 w-9 h-9 border-t-1 border-l-1  border-solid border-blue-600 rounded-tl-full"></div>
                  <Icon class="absolute cursor-pointer  bottom-6.5 right-6.5 z-3 -rotate-45" icon="teenyicons-triangle-solid"  color="#3b82f6"/>
                </div>
                <div class="relative  border-solid border-1 border-blue-600 rounded-tr-full cursor-pointer" @mousedown="ptzCamera('right')" @mouseup="ptzCamera('stop')">
                  <div class="absolute bottom-0 left-0 w-9 h-9  border-t-1 border-r-1 border-solid border-blue-600 rounded-tr-full"></div>
                  <Icon class="absolute cursor-pointer  bottom-6.5 left-6.5 z-3 rotate-45" icon="teenyicons-triangle-solid"  color="#3b82f6"/>
                </div>
                <div class="relative  border-solid border-1 border-blue-600 rounded-bl-full cursor-pointer" @mousedown="ptzCamera('left')" @mouseup="ptzCamera('stop')">
                  <div class="absolute top-0 right-0 w-9 h-9 border-b-1 border-l-1 border-solid border-blue-600 rounded-bl-full"></div>
                  <Icon class="absolute cursor-pointer  top-6.5 right-6.5 z-3 rotate-225" icon="teenyicons-triangle-solid"  color="#3b82f6"/>
                </div>
                <div class="relative  border-solid border-1 border-blue-600 rounded-br-full cursor-pointer" @mousedown="ptzCamera('down')" @mouseup="ptzCamera('stop')">
                  <div class="absolute top-0 left-0 w-9 h-9 border-b-1 border-r-1 border-solid  border-blue-600 rounded-br-full"></div>
                  <Icon class="absolute cursor-pointer  top-6.5 left-6.5 z-3 rotate-135" icon="teenyicons-triangle-solid"  color="#3b82f6"/>
                </div>
              </div>
              <div class="absolute bg-white h-22 w-22 border-solid rounded-full z-1"></div>
              <div class="absolute z-2  h-15 w-15 border-solid rounded-full border-1 border-blue-600 flex items-center justify-center cursor-pointer">
                <Icon class="cursor-pointer " :icon="`${!stats.playing?'ri:play-fill':'ic-sharp-pause'}`" size="40" color="#3b82f6"/>
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
                    <Button size="small" @click="ptzCommand(129,0,1,0)">设置</Button>
                  </template>
                </InputNumber>
              </div>
              <div class="flex flex-row">
                <Button class="flex-1" @click="ptzCommand(131,0,1,0)" size="small">删除</Button>
                <Button type="primary" class="flex-1" @click="ptzCommand(130,0,1,0)" size="small">调用</Button>
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
  import { reactive,unref,computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { RadioButtonGroup } from '/@/components/Form';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isEmpty,isNotEmpty } from '/@/utils/is';
  import VideoJessibucaPlay from './VideoJessibucaPlay.vue';
  import VideoZlmRtcPlay from './VideoZlmRtcPlay.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Icon from '@/components/Icon/Icon.vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import {doPtzPtz,doPtzFrontEndCommand} from '/@/api/video/ptz';
  import { Input,InputNumber,Descriptions,DescriptionsItem, Button ,Divider ,Slider,Dropdown,Menu,MenuItem} from 'ant-design-vue';

  const { prefixCls } = useDesign('video-play-model');
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const { createMessage } = useMessage();

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
  })
  //获取播放地址
  const payUrl = computed(()=>{
    if(stats.selectPlay === 'Jessibuca'){
      return stats.jessibucaMap[stats.playType]?.value;
    }else{
      return stats.zlmRtcUrl?.value;
    }
  })
  const handleSelectPlay=(val)=>{
    console.log(val);
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

  const [registerModal, { setModalProps }] = useModalInner((data) => {
      setModalProps({ confirmLoading: false });
      if(!data){
          return
      }
      const {app,stream,deviceId,channelId,mediaServerId,tracks,flv,wsFlv,ts,wsTs,rtc} = data;
      stats.app = app;
      stats.stream = stream;
      stats.deviceId = deviceId;
      stats.channelId = channelId;
      stats.mediaServerId = mediaServerId;
      stats.tracks = tracks;
      stats.jessibucaMap={
        flv:{
          name:"flv地址",
          value:flv?.url
        },
        wsFlv:{
          name:"wsFlv地址",
          value:wsFlv?.url
        },
        ts:{
          name:"ts地址",
          value:ts?.url
        },
        wsTs:{
          name:"wsTs地址",
          value:wsTs?.url
        },
      }
      stats.zlmRtcUrl={
        name:"rtc地址",
        value:rtc?.url
      }
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