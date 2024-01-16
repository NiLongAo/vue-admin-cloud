import { useUserStore } from '@/store/modules/user';
import { useSocketStore } from '@/store/modules/socket';
import { SocketNamespace } from '@/enums/SocketEnum';
import { Socket } from 'socket.io-client';
import { watch } from 'vue';
import { Namespace } from './common';

export async function useSocket() {
  const userStore = useUserStore();
  const useSocket = useSocketStore();
  const notTokenNamespaceMap: Record<SocketNamespace, Namespace> | {} = {},
    tokenNamespaceMap: Record<SocketNamespace, Namespace> | {} = {};
  //获取namespace 下所有空间
  const namespaceFiles: Record<SocketNamespace, any> = import.meta.glob('./namespace/**/*.ts', {
    eager: true,
  });
  Object.keys(namespaceFiles).forEach((key: string | SocketNamespace) => {
    const namespace: Namespace = new namespaceFiles[key].default();
    const param = namespace.getParam();
    if (!param.token) {
      notTokenNamespaceMap[param.namespace] = namespace;
    }
    tokenNamespaceMap[param.namespace] = namespace;
  });
  watch(
    () => userStore.getToken,
    () => {
      Object.keys(tokenNamespaceMap).forEach(async (key: string | SocketNamespace) => {
        const namespace: Namespace = tokenNamespaceMap[key];
        const socket = namespace.getSocket();
        if (socket) {
          socket.disconnect();
        }
      });
      if (userStore.getToken) {
        Object.keys(tokenNamespaceMap).forEach(async (key: string | SocketNamespace) => {
          const namespace: Namespace = tokenNamespaceMap[key];
          let socket = namespace.getSocket();
          //创建Socket监听
          socket = await useSocket.setSocketMap(key, userStore.getToken);
          setEvent(socket);
          namespace.setSocket(socket);
        });
      } else {
        Object.keys(notTokenNamespaceMap).forEach(async (key) => {
          const namespace: Namespace = notTokenNamespaceMap[key];
          let socket = namespace.getSocket();
          socket = await useSocket.setSocketMap(key);
          setEvent(socket);
          namespace.setSocket(socket);
        });
      }
    },
    { immediate: true },
  );
}

/**
 * 设置监听公共事件
 * @param socket 客户端
 * @param reconnectCount 重连次数
 * @param reconnectErrorCount 默认错误次数
 */
const setEvent = (socket: Socket, reconnectCount = 0, reconnectErrorCount = 10) => {
  if (socket) {
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
        socket.disconnect();
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
  }
};
