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

//socket发送事件
export enum SocketInEvent {
  IN_LOGIN_QR_CODE_EVENT = 'in_login_qr_code_event', //发送二维码信息
}

//socket监听事件
export enum SocketOutEvent {
  OUT_LOGIN_QR_CODE_EVENT = 'out_login_qr_code_event', //二维码信息
  OUT_LOGIN_INFO_EVENT = 'out_login_info_event', //登陆信息
  OUT_LOGIN_BIND_EVENT = 'out_login_bind_event', //绑定信息
  PUBLIC_MEMBER_EVENT = 'public_member_event', //平台通知信息
}

//socket监听事件
export enum SocketData {
  WX_MINI_QR_LOGIN_DATA = 1, //微信小程序二维码登录
  WX_MINI_QR_BIND_DATA = 2, //微信小程序二维码绑定web
}
