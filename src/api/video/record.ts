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
  //播放视频回放
  doRecordStartPlay = '/api/playback/start',
  //停止视频回放
  doRecordStopPlay = '/api/playback/stop',
  //暂停视频回放
  doRecordSuspend = '/api/playback/suspend',
  //暂停回放恢复
  doRecordRestore = '/api/playback/restore',
  //回放拖动播放
  doRecordSeek = '/api/playback/seek',
  //回放倍速播放
  doRecordSpeed = '/api/playback/speed',
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
export function doRecordStartPlay(params: Recordable) {
  return defHttp.get({ url: Api.doRecordStartPlay, params });
}
export function doRecordStopPlay(params: Recordable) {
  return defHttp.get({ url: Api.doRecordStopPlay, params });
}
export function doRecordSuspend(params: Recordable) {
  return defHttp.get({ url: Api.doRecordSuspend, params });
}
export function doRecordSeek(params: Recordable) {
  return defHttp.get({ url: Api.doRecordSeek, params });
}
export function doRecordSpeed(params: Recordable) {
  return defHttp.get({ url: Api.doRecordSpeed, params });
}