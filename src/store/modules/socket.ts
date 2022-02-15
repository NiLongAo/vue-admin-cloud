import { defineStore } from 'pinia';
import { store } from '/@/store';

interface SocketState {
  message: string;
}
export const useSocketStore = defineStore({
  id: 'app-socket',
  state: (): SocketState => ({
    message: '',
  }),
  getters: {
    getSocket(): string {
      return this.message;
    },
  },
  actions: {},
  mutations: {
    connect() {
      console.log('链接成功！！！!!!!');
    },
  },
});

// Need to be used outside the setup
export function useSocketWithOut() {
  return useSocketStore(store);
}
