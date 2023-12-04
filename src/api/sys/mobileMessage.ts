import { defHttp } from '@/utils/http/axios';
import { MobileMessageParams, MobileMessagePageResultModel } from './model/mobileMessageModel';
enum Api {
  //发送短信分页
  page = '/webapi/sms/mobile_message/page',
  //发送短信详情
  detail = '/webapi/sms/mobile_message/detail',
}

export function getMobileMessagePage(params: MobileMessageParams) {
  return defHttp.post<MobileMessagePageResultModel>({
    url: Api.page,
    params,
  });
}

export function doDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
