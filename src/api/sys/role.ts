import { defHttp } from '/@/utils/http/axios';
import { RoleModel, RoleParams, RolePageResultModel } from './model/roleModel';

enum Api {
  //获取角色分页
  page = '/webapi/bean/role/page',
  //查询所有角色
  all = '/webapi/bean/role/all',
  //保存角色
  detail = '/webapi/bean/role/detail',
  //保存角色
  save = '/webapi/bean/role/save',
  //删除角色
  remove = '/webapi/bean/role/remove',
  //角色信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/role/select',
}

export function getRolePage(params: RoleParams) {
  return defHttp.post<RolePageResultModel>({
    url: Api.page,
    params,
  });
}

export function doSelect(params) {
  return defHttp.get({ url: Api.select, params });
}

export function doAll(params) {
  return defHttp.get({ url: Api.all, params });
}

export function doSave(params: RoleModel) {
  return defHttp.post({ url: Api.save, params });
}

export function doRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
