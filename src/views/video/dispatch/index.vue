<template>
  <PageWrapper dense contentFullHeight :contentClass="`${prefixCls} flex`">
    <VideoDeviceChannelTree
      ref="TypeTreeRef"
      class="w-1/4 xl:w-1/5 tree"
      @select="handleSelect">
    </VideoDeviceChannelTree>
      <div class="lg:w-7/10">
          测试 测试 测试 测试 测试 测试 
      </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageWrapper } from '/@/components/Page';
  import { VideoDeviceChannelTree } from '/@/components/Video';

  const { prefixCls } = useDesign('video-dispatch');


  //点击字典类型事件
  const handleSelect = (typeId = '') => {
  };
</script>
<style lang="less" scoped>
 @prefix-cls: ~'@{namespace}-video-dispatch';
 .@{prefix-cls} {
    .tree{

    }
 }

</style>