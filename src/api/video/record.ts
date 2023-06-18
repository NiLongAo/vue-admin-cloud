import { defHttp } from '/@/utils/http/axios';
import { RecordInfo } from './model/recordModel';
enum Api {
  //录像查询列表
  doRecordList = '/webapi/video/gb/video/list',
  //开始下载录像
  doRecordDownloadStart =  '/webapi/video/gb/video/download/start',
  //停止下载录像
  doRecordDownloadStop = '/webapi/video/gb/video/download/stop',
  //获取当前用户下载录像信息
  doRecordDownloadList = '/webapi/video/gb/video/download/list',
  //清除用户下载录像
  doRecordDownloadDel = '/webapi/video/gb/video/download/del',
}


export function doRecordList(params: Recordable) {
  return defHttp.get<RecordInfo>({ url: Api.doRecordList, params });
}
export function doRecordDownloadStart(params: Recordable) {
  return defHttp.get({ url: Api.doRecordDownloadStart, params });
}
export function doRecordDownloadStop(params: Recordable) {
  return defHttp.get({ url: Api.doRecordDownloadStop, params });
}
export function doRecordDownloadList(params: Recordable) {
  return defHttp.get({ url: Api.doRecordDownloadList, params });
}
export function doRecordDownloadDel(params: Recordable) {
  return defHttp.get({ url: Api.doRecordDownloadDel, params });
}