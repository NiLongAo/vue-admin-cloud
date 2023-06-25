import { defHttp } from '/@/utils/http/axios';
import {MediaServerParams,MediaServerPageResultModel} from './model/mediaServerModel';

enum Api {
  //分页
  doMediaPage = '/webapi/video/media/server/page',
  //详情
  doMediaDetail = '/webapi/video/media/server/detail',
  //保存
  doMediaSave =  '/webapi/video/media/server/save',
  //移除
  doMediaRemove = '/webapi/video/media/server/remove',
  //根据应用名和流id获取播放地址
  doMediaFindPlayUrl = '/webapi/video/media/server/find_play_url',
}

export function doMediaPage(params: MediaServerParams) {
  return defHttp.post<MediaServerPageResultModel>({
    url: Api.doMediaPage,
    params,
  });
}
export function doMediaSave(params) {
  return defHttp.post({ url: Api.doMediaSave, params });
}
export function doMediaDetail(params: Recordable) {
  return defHttp.get({ url: Api.doMediaDetail, params });
}
export function doMediaRemove(params: Recordable) {
  return defHttp.delete({ url: Api.doMediaRemove, params });
}
export function doMediaFindPlayUrl(params: Recordable) {
  return defHttp.get({ url: Api.doMediaFindPlayUrl, params });
}