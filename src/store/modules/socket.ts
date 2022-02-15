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
      // if (this.socket) {
      //   this.socket.disconnect();
      // }
      this.socket = io('http://localhost:9190', {
        path: '/sms-socket/socket.io',
        // autoConnect: false,
        reconnection: false,
        transports: ['websocket'],
        query: {
          Authorization: 'Bearer ' + token,
        },
      });
      // this.socket.connect();
    },
  },
});

// Need to be used outside the setup
export function useSocketWithOut() {
  return useSocketStore(store);
}
