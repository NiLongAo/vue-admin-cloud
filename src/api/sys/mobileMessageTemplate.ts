import { defHttp } from '@/utils/http/axios';
import {
  MobileMessageTemplateModel,
  MobileMessageTemplateParams,
  MobileMessageTemplatePageResultModel,
} from './model/mobileMessageTemplateModel';
enum Api {
  //手机号登录
  //短信配置模板分页
  page = '/webapi/sms/mobile_message_template/page',
  //短信配置模板新增
  insert = '/webapi/sms/mobile_message_template/insert',
  //短信配置模板修改
  update = '/webapi/sms/mobile_message_template/update',
  //短信配置模板删除
  remove = '/webapi/sms/mobile_message_template/remove',
  //短信配置模板详情
  detail = '/webapi/sms/mobile_message_template/detail',
}

export function getSmsConfigPage(params: MobileMessageTemplateParams) {
  return defHttp.post<MobileMessageTemplatePageResultModel>({
    url: Api.page,
    params,
  });
}

export function doInsert(params: MobileMessageTemplateModel) {
  return defHttp.post({ url: Api.insert, params });
}

export function doUpdate(params: MobileMessageTemplateModel) {
  return defHttp.post({ url: Api.update, params });
}

export function doRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
