<template>
  <PageWrapper dense contentFullHeight fixedHeight :contentClass="`${prefixCls} flex`">
    <VideoDeviceChannelTree
      ref="TypeTreeRef"
      class="lg:w-2/10 tree bg-white overflow-hidden mr-4"
      @select="handleSelect">
    </VideoDeviceChannelTree>
    
    <div class="lg:w-8/10 ">
        <div class="h-12 bg-slate-50 w-full flex items-center text-xl px-4">
            分屏：
            <Icon icon="mingcute-fullscreen-line" size ="30" :color="`${state.num === 1 ?'#3b82f6':''}`" @click="checkGrid(1)"/>
            <Icon icon="ic:outline-grid-view" size ="30" :color="`${state.num === 4 ?'#3b82f6':''}`" @click="checkGrid(4)"/>
            <Icon icon="ic:outline-grid-on" size ="30" :color="`${state.num === 9 ?'#3b82f6':''}`" @click="checkGrid(9)"/>
        </div>
        <div :class="`inline-grid ${videoClass}  gap-0.5 w-full h-full`" >
          <div :class="`bg-black border-2 ${state.checkIndex ===i?' border-pink-700':''} flex items-center`" v-for="i in state.num" @click="checkVideo(i)">
              <p class="w-full text-center font-semibold text-xl m-0 text-gray-50">{{i}}</p>
          </div>
        </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageWrapper } from '/@/components/Page';
  import { VideoDeviceChannelTree } from '/@/components/Video';
  import Icon from '@/components/Icon/Icon.vue';
  import { computed, unref, reactive } from 'vue';

  const { prefixCls } = useDesign('video-dispatch');
  const state = reactive({
    num : 1,
    checkIndex : 0
  })

  /**
   * 点击字典类型事件
   * @param typeId 
   */
  const handleSelect = (typeId = '') => {
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
  /**
   * 动态样式
   */
  const videoClass = computed(()=>{
    if(state.num === 4){
        return "grid-cols-2";
    }else if(state.num === 9){
      return "grid-cols-3";
    }else{
      return ""
    }
  })
</script>
<style lang="less" scoped>
 @prefix-cls: ~'@{namespace}-video-dispatch';
 .@{prefix-cls} {
    .tree{

    }
 }

</style>