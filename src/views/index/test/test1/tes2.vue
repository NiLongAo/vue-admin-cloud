<template>
  <div class="app-containers">
    <Input placeholder="Basic usage" v-model:value="stats.message" />
    <Button type="primary" @click="onClick"> 更新基本信息 </Button>
  </div>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { reactive, computed, watchEffect } from 'vue';
  import { Input, Button } from 'ant-design-vue';

  const socket = inject('socket');

  const stats = reactive({
    message: '',
  });
  console.log(socket);

  socket.on('message_event', (data) => {
    console.log('client has connected' + data);
  });

  socket.on('connect', () => {
    console.log('开启链接！！！');
  });

  const onClick = () => {
    //const socket = useSocket.getSocket;
    socket.emit('message_event', {
      msgType: 4,
      outType: 1,
      msgContent: stats.message,
    });

    // import { reactive, computed, watchEffect } from 'vue';
    // import { useWebSocket } from '@vueuse/core';
    // import { useSocketStore } from '/@/store/modules/socket';
    // import { Input, Button } from 'ant-design-vue';
    // import io, { ManagerOptions } from 'socket.io-client';
    // import VueSocketIO from 'vue-socket.io';
    // import { useUserStore } from '/@/store/modules/user';
    // const userStore = useUserStore();
    // const stats = reactive({
    //   message: '',
    // });

    // const socket = new VueSocketIO({
    //   debug: true,
    //   connection: 'http://localhost:9190',
    //   options: {
    //     path: '/sms-socket/socket.io',
    //     transports: ['websocket', 'polling'],
    //     query: {
    //       Authorization: 'Bearer ' + userStore.getToken,
    //     },
    //   },
    // });
    // console.log(socket);

    // socket.io.on('connect', () => {
    //   console.log('开启链接！！！');
    // });

    // socket.io.on('message_event', (data) => {
    //   console.log('client has connected' + data);
    // });

    // //const useSocket = useSocketStore();

    // const onClick = () => {
    //   //const socket = useSocket.getSocket;
    //   socket.io.emit('message_event', {
    //     msgType: 4,
    //     outType: 1,
    //     msgContent: stats.message,
    //   });
  };
</script>
<style scoped>
  .app-containers {
    height: 100%;
  }
</style>
