import { defHttp } from '/@/utils/http/axios';

export enum SmsType {
  //发送登录验证码
  LOGIN_VERIFICATION_CODE = 1,
  //发送注册验证码
  REGISTER_VERIFICATION_CODE = 2,
  //发送重置密码验证码
  RESET_VERIFICATION_CODE = 3,
}

enum Api {
  //手机号登录
  SmsSend = '/webapi/sms/sms_send/send',
}

export function doSmsSendSave(params) {
  return defHttp.post({ url: Api.SmsSend, params });
}
