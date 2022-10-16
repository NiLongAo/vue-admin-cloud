import { defineStore } from 'pinia';
import { store } from '/@/store';
import io, { Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  type: number | null;
  message: OutMessage | {};
}
interface OutMessage {
  //发送人编号
  userId: string;
  //发送人名称
  userName: string;
  /**
   * 消息类型
   *  1.平台通知公告
   * 2.强制下线
   */
  type: number;
  /**
   * 消息类型
   * 1.字符串
   * 2.图片
   * 3.视频
   */
  outType: number;
  //消息主体
  message: string;
  //创建时间
  createTime: string;
}
export const useSocketStore = defineStore({
  id: 'app-socket',
  state: (): SocketState => ({
    socket: null,
    type: null,
    message: {},
  }),
  getters: {
    getSocket(): Socket | null {
      return this.socket as Socket;
    },
    getType(): number | null {
      return this.type;
    },
    getMessage(): OutMessage | null {
      //获取消息后重置类型，防止无法监听到值改变
      this.type = null;
      return this.message as Socket;
    },
  },
  actions: {
    setSocket(token: string) {
      if (this.socket) {
        this.socket.disconnect();
      }
      this.socket = io(import.meta.env.VITE_SOCKET_URL, {
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
    messageEvent(data: OutMessage) {
      debugger;
      this.type = data.type;
      this.message = data;
    },
  },
});

// Need to be used outside the setup
export function useSocketWithOut() {
  return useSocketStore(store);
}
