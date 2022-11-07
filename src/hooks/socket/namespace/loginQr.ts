import { Socket } from 'socket.io-client';
import { SocketModel, Namespace } from '../common';
import { SocketNamespace, SocketEvent } from '/@/enums/SocketEnum';
import mitt from '/@/utils/mitt';

class LoginQrNamespace implements Namespace {
  private socket: Socket;
  private readonly namespace: SocketNamespace;
  private readonly token: Boolean;

  constructor() {
    this.namespace = SocketNamespace.QR_NAMESPACE;
    this.token = false;
  }

  //获取当前类参数
  getParam(): SocketModel {
    return {
      namespace: this.namespace,
      token: this.token,
    };
  }
  //设置当前Socket
  setSocket(socket: Socket) {
    this.socket = socket;
    //设置事件
    this.setEvent();
  }
  getSocket() {
    return this.socket;
  }
  private setEvent() {
    if (!this.socket) return;
    this.socket.on(SocketEvent.WX_MINI_QR_BIND_EVENT, (data) => {
      const rootSocketEmitter = mitt();
      rootSocketEmitter.emit(SocketEvent.WX_MINI_QR_BIND_EVENT, data);
    });
    this.socket.on(SocketEvent.WX_MINI_QR_LOGIN_EVENT, (data) => {
      const rootSocketEmitter = mitt();
      rootSocketEmitter.emit(SocketEvent.WX_MINI_QR_LOGIN_EVENT, data);
    });
  }
}

export default LoginQrNamespace;
