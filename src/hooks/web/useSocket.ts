import { useUserStore } from '/@/store/modules/user';
import { useSocketStore } from '/@/store/modules/socket';
import { reactive, watch, watchEffect, computed } from 'vue';

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useSocket() {
  const userStore = useUserStore();
  const useSocket = useSocketStore();
  let socket = useSocket.getSocket;

  watchEffect(() => {
    if (userStore.getToken) {
      useSocket.setSocket(userStore.getToken);
      socket = useSocket.getSocket;
    }
  });
  socket?.emit('message_event', (data) => {
    console.log(data);
  });
}
