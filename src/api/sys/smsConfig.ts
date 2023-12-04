import { defHttp } from '@/utils/http/axios';
import { SmsConfigModel, SmsConfigParams, SmsConfigPageResultModel } from './model/smsConfigModel';
enum Api {
  //手机号登录
  //短信配置分页
  all = '/webapi/sms/sms_config/all',
  //短信配置分页
  page = '/webapi/sms/sms_config/page',
  //短信配置新增
  insert = '/webapi/sms/sms_config/insert',
  //短信配置修改
  update = '/webapi/sms/sms_config/update',
  //短信配置删除
  remove = '/webapi/sms/sms_config/remove',
  //短信配置详情
  detail = '/webapi/sms/sms_config/detail',
}

export function doAll() {
  return defHttp.get({ url: Api.all });
}

export function getSmsConfigPage(params: SmsConfigParams) {
  return defHttp.post<SmsConfigPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doInsert(params: SmsConfigModel) {
  return defHttp.post({ url: Api.insert, params });
}

export function doUpdate(params: SmsConfigModel) {
  return defHttp.post({ url: Api.update, params });
}

export function doRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
