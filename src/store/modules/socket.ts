import { defineStore } from 'pinia';
import { store } from '/@/store';
import { SocketNamespace, SocketEvent } from '../../enums/SocketEnum';
import io, { Socket } from 'socket.io-client';

interface SocketState {
  socketMap: Recordable<Socket> | {};
}
export const useSocketStore = defineStore({
  id: 'app-socket',
  state: (): SocketState => ({
    socketMap: {},
  }),
  getters: {
    getSocketMap(): Recordable<Socket> | {} {
      return this.socketMap;
    },
  },
  actions: {
    /**
     * 创建socket
     * @param namespace 空间名
     * @param token 是否添加token
     * @returns
     */
    setSocketMap(namespace: string, token?: string) {
      let socket: Socket = this.socketMap[namespace];
      if (socket) {
        socket.disconnect();
      }
      const query = token
        ? {
            Authorization: 'Bearer ' + token,
          }
        : {};
      socket = io(import.meta.env.VITE_SOCKET_URL + namespace, {
        //自动链接
        autoConnect: false,
        //重新链接
        reconnection: true,
        //重新链接的最大延迟（毫秒）
        reconnectionDelayMax: 5000,
        //链接地址
        path: '/sms-socket/socket.io',
        //请求附加参数
        query: query,
        transports: ['websocket', 'polling'],
        // 请求头
        // extraHeaders: {},
      });
      socket.connect();
      this.socketMap[namespace] = socket;
      return socket;
    },
    getSocket(namespace: SocketNamespace): Socket {
      return this.socketMap[namespace];
    },
    sendMessage(namespace: SocketNamespace, event: SocketEvent, message: any) {
      return new Promise((resolve, reject) => {
        const socket: Socket = this.socketMap[namespace];
        if (!socket) {
          reject(new Error('socket is null! namespace:' + namespace));
        }
        const data = socket.emit(event, message);
        resolve(data);
      });
    },
  },
});

// Need to be used outside the setup
export function useSocketWithOut() {
  return useSocketStore(store);
}
