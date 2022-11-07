/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 0, //操作完成
  OVERDUE = 1, //二维码已过期
  ERROR = 2, //操作错误
}
//socket空间
export enum SocketNamespace {
  PUBLIC_MEMBER_NAMESPACE = 'public_member_namespace', //通知公告
  QR_NAMESPACE = 'qr_namespace', //微信扫码
}

//socket监听事件
export enum SocketEvent {
  PUBLIC_MEMBER_EVENT = 'public_member_event', //通知公告事件
  WX_MINI_QR_BIND_EVENT = 'wx_mini_qr_bind_event', //web绑定微信小程序事件
  WX_MINI_QR_LOGIN_EVENT = 'wx_mini_qr_login_event', //web扫微信小程序码登陆事件
}

//socket监听事件
export enum SocketData {
  WX_MINI_QR_LOGIN_DATA = 1, //微信小程序二维码登录
  WX_MINI_QR_BIND_DATA = 2, //微信小程序二维码绑定web
}
