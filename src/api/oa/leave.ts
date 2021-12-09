import { defHttp } from '/@/utils/http/axios';

import { LeaveEntity } from './model/leaveModel';

enum Api {
  //获取当前用户待办事项
  find = '/webapi/oa/leave/find',
  //获取当前用户发起事项
  insert = '/webapi/oa/leave/insert',
  //获取当前用户已办事项
  delete = '/webapi/oa/leave/delete',
}

export function doFind(params: Recordable) {
  return defHttp.get<LeaveEntity>({ url: Api.find, params });
}
export function doInsert(params: LeaveEntity) {
  return defHttp.post({ url: Api.insert, params });
}
export function doDelete(params: LeaveEntity) {
  return defHttp.post({ url: Api.delete, params });
}
