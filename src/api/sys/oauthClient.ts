import { defHttp } from '/@/utils/http/axios';
import {
  OauthClientModel,
  OauthClientParams,
  OauthClientPageResultModel,
} from './model/oauthClientModel';

enum Api {
  //获取客户端分页
  page = '/webapi/config/oauth_client/page',
  //客户端详情
  detail = '/webapi/config/oauth_client/detail',
  //保存客户端
  save = '/webapi/config/oauth_client/save',
  //删除客户端
  remove = '/webapi/config/oauth_client/remove',
}

export function getOauthClientPage(params: OauthClientParams) {
  return defHttp.post<OauthClientPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doOauthClientSave(params: OauthClientModel) {
  return defHttp.post({ url: Api.save, params });
}

export function doOauthClientRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doOauthClientDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
