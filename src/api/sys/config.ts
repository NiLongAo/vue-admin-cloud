import { defHttp } from '@/utils/http/axios';
import { ConfigEntity, ConfigParams, ConfigPageResultModel } from './model/configModel';

enum Api {
  //获取系统设置分页
  page = '/webapi/config/config/page',
  //查询系统设置
  all = '/webapi/config/config/all',
  //保存系统设置
  detail = '/webapi/config/config/detail',
  //保存系统设置
  update = '/webapi/config/config/update',
}
export function doConfigPage(params: ConfigParams) {
  return defHttp.post<ConfigPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doConfigAll() {
  return defHttp.get({ url: Api.all });
}

export function doConfigUpdate(params: ConfigEntity) {
  return defHttp.post({ url: Api.update, params });
}

export function doConfigDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
