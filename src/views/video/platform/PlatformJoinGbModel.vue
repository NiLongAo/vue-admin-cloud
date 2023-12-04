<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose 
    :maskClosable="false"
    :footer="null"
    @register="registerModal"
    width="90%"
  >
    <div :class="`${prefixCls} flex flex-row`">
      <PlatformTree 
        :class="`${prefixCls}-tree  min-w-60`"
        :server-gb-id="stats.data?.serverGbId" 
        @select="handleTreeSelect"
        @clean="handleTreeclean"
      />
      <div class="grow">
        <Card
          :tab-list="stats.cardTabList"
          :active-tab-key="stats.activeKey"
          @tabChange="onTabChange"
        >
          <PlatformTransfer 
            ref="platformTransfer"
            :server-gb-id="stats.data?.serverGbId" 
            :active-key="stats.activeKey" 
            :catalog-id="stats.catalogId"
          />
        </Card>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref,unref,reactive} from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { useDesign } from '@/hooks/web/useDesign';
  import { Card } from 'ant-design-vue';
  import PlatformTree from './components/PlatformTree.vue';
  import PlatformTransfer from './components/PlatformTransfer.vue';

  const platformTransfer = ref();
  const { prefixCls } = useDesign('platform-join-model');
  const stats = reactive({
    data : {} as any,
    catalogId:'',
    keys:[],
    activeKey:'gbChannel',
    cardTabList:[
      {
        key: 'gbChannel',
        tab: '国标通道',
      },
      {
        key: 'gbStream',
        tab: '国标流',
      },
    ],
  });

  const handleTreeSelect = (val) => {
    stats.catalogId = val;
  };

  const onTabChange = async (key)=>{
    stats.activeKey = key;
  }
  const handleTreeclean = () =>{
    unref(platformTransfer).refresh();
  }
  const [registerModal] = useModalInner(async (data) => {
    if (!data) {
      return;
    }
    stats.data = data;
    await onTabChange(stats.activeKey);
  });
  
</script>
<style lang="less">
 @prefix-cls: ~'@{namespace}-platform-join-model';
 .@{prefix-cls}{
    &-tree{
      
    }
 }

</style>