import { useUserStore } from '/@/store/modules/user';
import { useSocketStore } from '/@/store/modules/socket';
import { watch } from 'vue';
/**
 * Listening to page changes and dynamically changing site titles
 */
export function useSocket() {
  const userStore = useUserStore();
  const useSocket = useSocketStore();

  let socket, //客户端
    reconnectCount = 0 as number, // 重连次数
    reconnectErrorCount = 10 as number;
  watch(
    () => userStore.getToken,
    () => {
      if (userStore.getToken) {
        useSocket.setSocket(userStore.getToken);
      }
    },
    { immediate: true },
  );
  watch(
    () => useSocket.getSocket,
    () => {
      if (useSocket.getSocket) {
        socket = useSocket.getSocket;
        //https://socket.io/docs/v2/client-api/#event-error
        socket?.on('connect', () => {
          console.log('开启链接！！！');
        });
        //发生错误时激发
        socket?.on('error', (e) => {
          console.log('errer:' + e);
        });
        //在连接错误时激发
        socket?.on('connect_error', () => {
          console.log('connect_error');
        });
        //在连接超时时激发
        socket?.on('connect_timeout', () => {
          console.log('connect_timeout');
        });
        //在成功的重新连接后发射。
        socket?.on('reconnect', () => {
          reconnectCount = 0;
          console.log('reconnect');
        });
        //在成功的重新连接后发射。
        socket?.on('reconnect_attempt', () => {
          reconnectCount = reconnectCount + 1;
          console.log('reconnect_attempt');
        });
        //试图重新连接时被触发。
        socket?.on('reconnecting', () => {
          if (reconnectErrorCount <= reconnectCount) {
            console.log('重连次数超出' + reconnectErrorCount + '次');
            useSocket.disconnectSocket();
          }
          console.log('reconnecting');
        });
        //在尝试重新连接错误时激发。
        socket?.on('reconnect_error', () => {
          console.log('reconnect_error');
        });
        //当客户端无法在中重新连接时激发
        socket?.on('reconnect_failed', () => {
          console.log('reconnect_failed');
        });
        //接收服务端发送来消息
        socket.on('message_event', (data) => {
          useSocket.messageEvent(data);
        });
      }
    },
    { immediate: true },
  );
}
