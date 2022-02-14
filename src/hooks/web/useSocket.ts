import { useWebSocket } from '@vueuse/core';
import { useUserStore } from '/@/store/modules/user';
import { reactive, watch, watchEffect, computed } from 'vue';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useSocket() {
  const userStore = useUserStore();
  const state = reactive({
    server: 'ws://localhost:9190/sms-socket/socket.io?Authorization=Bearer ' + userStore.getToken,
    sendValue: '',
    recordList: [] as { id: number; time: number; res: string }[],
  });

  const { status, data, send, close, open } = useWebSocket(state.server, {
    autoReconnect: false,
    heartbeat: true,
  });

  watch(
    () => userStore.getToken,
    () => {
      close();
      state.server =
        'ws://localhost:9190/sms-socket/socket.io?Authorization=Bearer ' + userStore.getToken;
      open();
    },
  );

  watchEffect(() => {
    if (data.value) {
      try {
        const res = JSON.parse(data.value);
        state.recordList.push(res);
      } catch (error) {
        state.recordList.push({
          res: data.value,
          id: Math.ceil(Math.random() * 1000),
          time: new Date().getTime(),
        });
      }
    }
  });

  const getIsOpen = computed(() => status.value === 'OPEN');

  const getTagColor = computed(() => (getIsOpen.value ? 'success' : 'red'));

  const getList = computed(() => {
    return [...state.recordList].reverse();
  });

  function handlerSend() {
    send(state.sendValue);
    state.sendValue = '';
  }

  function toggle() {
    if (getIsOpen.value) {
      close();
    } else {
      open();
    }
  }
}
