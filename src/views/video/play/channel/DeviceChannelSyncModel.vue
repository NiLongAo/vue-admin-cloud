<template>
 <BasicModal
    v-bind="$attrs"
    centered
    :wrapClassName="`${prefixCls}`"
    :canFullscreen="false"
    :maskClosable="false"
    :width="250"
    :minHeight="250"
    :footer="null"
    destroyOnClose
    @register="registerModal"
    @cancel="handleCancel"
  >
    <Progress 
      class="grow justify-center items-center"
      type="circle" 
      :percent="stats.percent" 
      :status="stats.status" 
    >
    <template #format >
        <span >{{ stats.massage }}</span>
      </template>
    </Progress>

  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive,watch} from 'vue';
  import { Progress } from 'ant-design-vue';
  import { isEmpty } from '/@/utils/is';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { doSyncStatusDeviceChannel} from '/@/api/video/deviceChannel';
  import { useDesign } from '/@/hooks/web/useDesign';

  const emit = defineEmits(['close', 'register']);
  const { prefixCls } = useDesign('device-channel-model');
  
  const stats = reactive({
    deviceId:'',
    massage:"同步中",
    status : undefined,
    percent : 0,
    total:0,
    current:0,
    syncIng : false,
    errorMsg : '',
    timer: null as any | NodeJS.Timer,
  })

  watch(
    () => stats.deviceId ,
     ()=>{
      fetch(true);
    }
  )

  const handleCancel = () =>{
    stats.deviceId = '';
  }

  const fetch = async(circulate:boolean) =>{
    if(isEmpty(stats.deviceId)){
        return;
    }
    const {syncIng,total,current,errorMsg} = await doSyncStatusDeviceChannel({deviceId:stats.deviceId});
    stats.percent = current / total *100;
    if(syncIng){
      if(isEmpty(errorMsg)){
        stats.massage = "同步完成";
        setTimeout(function () {
          stats.deviceId = '';
          closeModal();
          emit('close');
        },1500);
      }else{
        stats.massage = errorMsg;
      }
      //关闭循环任务
      stats.timer && clearInterval(stats.timer);
    }else{
      stats.massage = current+"/"+total;
      //开启循环任务
      if(!circulate){
          return;
      }
      stats.timer = setInterval(() => fetch(false), 800);
    }
  }

  const [registerModal,{closeModal}] = useModalInner((data) => {
    const {deviceId} = data;
    stats.deviceId = deviceId;
  });
</script>
<style lang="less">
 @prefix-cls: ~'@{namespace}-device-channel-model';
 .@{prefix-cls}{
  .ant-modal .ant-modal-body > .scrollbar {
    padding: 0px;
  }
  .scroll-container .scrollbar__wrap {
    margin-bottom: 0px !important;
  }
  .scroll-container .scrollbar__view div{
    display: flex;
  }

 }
</style>