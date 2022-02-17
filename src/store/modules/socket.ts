import { defineStore } from 'pinia';
import { store } from '/@/store';
import io, { Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
}
export const useSocketStore = defineStore({
  id: 'app-socket',
  state: (): SocketState => ({
    socket: null,
  }),
  getters: {
    getSocket(): Socket | null {
      return this.socket as Socket;
    },
  },
  actions: {
    setSocket(token: string) {
      if (this.socket) {
        this.socket.disconnect();
      }
      this.socket = io('ws://localhost:9190', {
        //自动链接
        autoConnect: false,
        //重新链接
        reconnection: true,
        //重新链接的最大延迟（毫秒）
        reconnectionDelayMax: 5000,
        //链接地址
        path: '/sms-socket/socket.io',
        //请求附加参数
        query: {
          Authorization: 'Bearer ' + token,
        },
        transports: ['websocket', 'polling'],
        // 请求头
        // extraHeaders: {},
      });
      this.socket.connect();
    },
    async disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
  },
});

// Need to be used outside the setup
export function useSocketWithOut() {
  return useSocketStore(store);
}
