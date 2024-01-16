import { defHttp } from '@/utils/http/axios';
import { ProxyParams, ProxyPageResultModel } from './model/proxyModel';

enum Api {
  //分页
  doProxyPage = '/webapi/video/stream/proxy/page',
  //详情
  doProxyDetail = '/webapi/video/stream/proxy/detail',
  //保存
  doProxySave = '/webapi/video/stream/proxy/save',
  //移除
  doProxyRemove = '/webapi/video/stream/proxy/remove',
  //获取流媒体中ffmpeg.cmd模板
  doProxyFindFfmpegCmd = '/webapi/video/stream/proxy/find_ffmpeg_cmd',
  //启用代理
  doProxyStart = '/webapi/video/stream/proxy/start',
  //停用代理
  doProxyStop = '/webapi/video/stream/proxy/stop',
  //停用代理
  doProxyGetPlayUrl = '/webapi/video/stream/proxy/get_play_url',
}

export function doProxyPage(params: ProxyParams) {
  return defHttp.post<ProxyPageResultModel>({
    url: Api.doProxyPage,
    params,
  });
}
export function doProxySave(params) {
  return defHttp.post({ url: Api.doProxySave, params });
}
export function doProxyDetail(params: Recordable) {
  return defHttp.get({ url: Api.doProxyDetail, params });
}
export function doProxyRemove(params: Recordable) {
  return defHttp.delete({ url: Api.doProxyRemove, params });
}
export function doProxyFindFfmpegCmd(params: Recordable) {
  return defHttp.get({ url: Api.doProxyFindFfmpegCmd, params });
}
export function doProxyStart(params: Recordable) {
  return defHttp.get({ url: Api.doProxyStart, params });
}
export function doProxyStop(params: Recordable) {
  return defHttp.get({ url: Api.doProxyStop, params });
}
export function doProxyGetPlayUrl(params: Recordable) {
  return defHttp.get({ url: Api.doProxyGetPlayUrl, params });
}
