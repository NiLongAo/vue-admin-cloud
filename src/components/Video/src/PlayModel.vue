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
            <div class="flex" :key="key" v-for=" key in Object.keys(stats.jessibucaMap)">
              <Input  :defaultValue="stats.jessibucaMap[key].value" disabled>
                <template #addonBefore > {{stats.jessibucaMap[key].name}} </template>
              </Input>
              <Button  @click="handleCopy(stats.jessibucaMap[key].value)">复制</Button>
              <Button type="primary" :disabled="stats.playType===key" @click="handlePlay(key)">播放</Button>
            </div>
          </div>
        </div>
        <Divider style="height: auto;background-color: #fff;" type="vertical" dashed />
        <div  :class="`${prefixCls}-right basis-4/20 row-span-3 `">
          <!-- 控制器 -->
          <div>

          </div>
          <!-- 流信息 -->
          <div>

          </div>
        </div>
      </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive,unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { RadioButtonGroup } from '/@/components/Form';
  import { useDesign } from '/@/hooks/web/useDesign';
  import VideoJessibucaPlay from './VideoJessibucaPlay.vue';
  import VideoZlmRtcPlay from './VideoZlmRtcPlay.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { Input, Button ,Divider } from 'ant-design-vue';

  const { prefixCls } = useDesign('video-play-model');
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const { createMessage } = useMessage();

  const stats = reactive({
    selectPlay:"Jessibuca",
    playType:"flv",
    options:[
      {
        label:"Jessibuca",
        value:"Jessibuca",
      },
      {
        label:"ZlmRtc",
        value:"ZlmRtc",
      }
    ],
    zlmRtcUrl:{
      name:"flv地址",
      value:"https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"
    },
    jessibucaMap:{
      flv:{
        name:"flv地址",
        value:"https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"
      },
      wsFlv:{
        name:"wsFlv地址",
        value:"https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"
      },
      ts:{
        name:"ts地址",
        value:"https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"
      },
      wsTs:{
        name:"wsTs地址",
        value:"https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv"
      },
    },
    app:"",//app编号
    stream:"",//流编号
    deviceId:"",//设备编号
    channelId:"",//通道编号
    mediaServerId:"",//流媒体编号
    tracks:"",// 流编码信息
  })


  const handleSelectPlay=(val)=>{
    stats.selectPlay = val;
  }
  //复制触发
  const handleCopy=(value)=>{
    if (!value) {
      createMessage.warning('请输入要拷贝的内容！');
      return;
    }
    clipboardRef.value = value;
    if (unref(copiedRef)) {
       createMessage.success('复制成功。');
    }
  }
  //播放
  const handlePlay = (key) =>{
    stats.playType = key;//切换播放key
  }

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
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
          value:flv?.ur
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
  min-height: 780px;
  &-left{
      min-width: 600px;
    &-bot{
      .ant-input-group-addon{
        width: 90px;
      }
    }
  }
  &-right{
    min-width: 300px;
  }
}

</style>