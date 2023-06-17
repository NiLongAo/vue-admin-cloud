<template>
  <PageWrapper dense contentFullHeight  @back="goBack" :title="`国标录像：` + formData.deviceId +`/`+formData.channelId">
    
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { useGo } from '/@/hooks/web/usePage';
  import { PageWrapper } from '/@/components/Page';
  import { computed, reactive,h ,ref,unref} from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const formData = reactive({
    deviceId: route.params?.deviceId,
    channelId: route.params?.channelId,
  });

  const go = useGo();
  // 此处可以得到用户ID
  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/video/play/channel/'+formData.deviceId);
  }
  
</script>
