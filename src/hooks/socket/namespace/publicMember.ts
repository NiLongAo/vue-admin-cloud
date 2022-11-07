import { Socket } from 'socket.io-client';
import { SocketModel, Namespace } from '../common';
import { SocketNamespace, SocketEvent } from '/@/enums/SocketEnum';
import mitt from '/@/utils/mitt';

class PublicMemberNamespace implements Namespace {
  private socket: Socket;
  private readonly namespace: SocketNamespace;
  private readonly token: Boolean;

  constructor() {
    this.namespace = SocketNamespace.PUBLIC_MEMBER_NAMESPACE;
    this.token = true;
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
    //监听事件
    this.socket.on(SocketEvent.PUBLIC_MEMBER_EVENT, (data) => {
      const rootSocketEmitter = mitt();
      rootSocketEmitter.emit(SocketEvent.PUBLIC_MEMBER_EVENT, data);
    });
  }
}
export default PublicMemberNamespace;
