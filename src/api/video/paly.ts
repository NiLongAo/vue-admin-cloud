import { defHttp } from '/@/utils/http/axios';

enum Api {
  //开始点播
  start = '/webapi/video/play/start',
  //停止点播
  stop =  '/webapi/video/play/stop',
  //视频流转码 （非h264 转为 h264）
  convert = '/webapi/video/play/convert',
  //结束转码
  convertStop = '/webapi/video/play/convert_stop',

}
export function doPlayStart(params: Recordable) {
  return defHttp.get({ url: Api.start, params });
}
export function doPlayStop(params: Recordable) {
  return defHttp.get({ url: Api.stop, params });
}
export function doPlayConvert(params: Recordable) {
  return defHttp.get({ url: Api.convert, params });
}
export function doPlayConvertStop(params: Recordable) {
  return defHttp.get({ url: Api.convertStop, params });
}