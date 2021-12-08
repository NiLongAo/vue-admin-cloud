import { defHttp } from '/@/utils/http/axios';

enum Api {
  //获取当前用户待办事项
  find = '/webapi/oa/leave/find',
  //获取当前用户发起事项
  insert = '/webapi/oa/leave/insert',
  //获取当前用户已办事项
  delete = '/webapi/oa/leave/delete',
}

export function doFind(params: Recordable) {
  return defHttp.get({ url: Api.find, params });
}
export function doInsert(params: Recordable) {
  return defHttp.post({ url: Api.insert, params });
}
export function doDelete(params: Recordable) {
  return defHttp.post({ url: Api.delete, params });
}
