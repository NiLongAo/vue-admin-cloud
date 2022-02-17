<template>
  <div class="app-containers">
    <Input placeholder="Basic usage" v-model:value="stats.message" />
    <Button type="primary" @click="onClick"> 按钮 </Button>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { Input, Button } from 'ant-design-vue';
  import { useSocketStore } from '/@/store/modules/socket';

  // socket.io链接不成功问题 https://www.cnblogs.com/youran-he/p/15684362.html
  const stats = reactive({
    message: '',
  });
  const socketIo = useSocketStore();

  let socket;
  watch(
    () => socketIo.getSocket,
    () => {
      socket = socketIo.getSocket;
      socket.on('message_event', (data) => {
        console.log('client has connected' + data.outMessage);
      });
    },
    { immediate: true },
  );

  const onClick = () => {
    socket.emit('message_event', {
      msgType: 4,
      outType: 1,
      msgContent: stats.message,
    });
  };
</script>
<style scoped>
  .app-containers {
    height: 100%;
  }
</style>
