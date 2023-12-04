import { defHttp } from '@/utils/http/axios';
import { TenantParams, TenantPageResultModel, TenantModel } from './model/tenantModel';

enum Api {
  //获取租户分页
  page = '/webapi/config/tenant/page',
  //保存租户
  detail = '/webapi/config/tenant/detail',
  //新增租户
  insert = '/webapi/config/tenant/insert',
  //编辑租户
  update = '/webapi/config/tenant/update',
  //删除租户
  remove = '/webapi/config/tenant/remove',
  //租户信息下拉展示(动态搜索数据源)
  select = '/webapi/config/tenant/select',
}

export function getTenantPage(params: TenantParams) {
  return defHttp.post<TenantPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doTenantSelect(params) {
  return defHttp.get({ url: Api.select, params });
}

export function doTenantInsert(params: Recordable) {
  return defHttp.post({ url: Api.insert, params });
}

export function doTenantUpdate(params: TenantModel) {
  return defHttp.post({ url: Api.update, params });
}

export function doTenantRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doTenantDetail(params: Recordable) {
  return defHttp.get<TenantModel>({ url: Api.detail, params });
}
