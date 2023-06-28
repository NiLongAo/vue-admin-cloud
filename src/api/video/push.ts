import { defHttp } from '/@/utils/http/axios';
import {PushParams,PushPageResultModel} from './model/pushModel';

enum Api {
  //分页
  doPushPage = '/webapi/video/stream/push/page',
  //详情
  doPushDetail = '/webapi/video/stream/push/detail',
  //保存
  doPushSave =  '/webapi/video/stream/push/save',
  //移除
  doPushRemove = '/webapi/video/stream/push/remove',
  //获取推流播放地址
  doPushGetPlayUrl = '/webapi/video/stream/push/get_play_url',
}

export function doPushPage(params: PushParams) {
  return defHttp.post<PushPageResultModel>({
    url: Api.doPushPage,
    params,
  });
}
export function doPushSave(params) {
  return defHttp.post({ url: Api.doPushSave, params });
}
export function doPushDetail(params: Recordable) {
  return defHttp.get({ url: Api.doPushDetail, params });
}
export function doPushRemove(params: Recordable) {
  return defHttp.delete({ url: Api.doPushRemove, params });
}
export function doPushGetPlayUrl(params: Recordable) {
  return defHttp.get({ url: Api.doPushGetPlayUrl, params });
}