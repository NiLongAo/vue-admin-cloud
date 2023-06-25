import { defHttp } from '/@/utils/http/axios';
import {PlatformParams,PlatformPageResultModel} from './model/platformModel';

enum Api {
  //分页
  doPlatformPage = '/webapi/video/parent/platform/page',
  //详情
  doPlatformDetail = '/webapi/video/parent/platform/detail',
  //新增
  doPlatformInsert =  '/webapi/video/parent/platform/insert',
  //编辑
  doPlatformUpdate =  '/webapi/video/parent/platform/update',
  //移除
  doPlatformRemove = '/webapi/video/parent/platform/remove',
}

export function doPlatformPage(params: PlatformParams) {
  return defHttp.post<PlatformPageResultModel>({
    url: Api.doPlatformPage,
    params,
  });
}
export function doPlatformInsert(params) {
  return defHttp.post({ url: Api.doPlatformInsert, params });
}
export function doPlatformUpdate(params) {
  return defHttp.post({ url: Api.doPlatformUpdate, params });
}
export function doPlatformDetail(params: Recordable) {
  return defHttp.get({ url: Api.doPlatformDetail, params });
}
export function doPlatformRemove(params: Recordable) {
  return defHttp.delete({ url: Api.doPlatformRemove, params });
}