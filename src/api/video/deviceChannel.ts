import { defHttp } from '@/utils/http/axios';
import { DeviceChannelEntity, DeviceChannelParams, DeviceChannelPageResultModel } from './model/deviceChannelModel';

enum Api {
  //通道树
  tree = '/webapi/video/device/channel/tree',
  //通道分页
  page = '/webapi/video/device/channel/page',
   //通道详情
  detail = '/webapi/video/device/channel/detail',
  //保存通道信息
  save =  '/webapi/video/device/channel/save',
  //同步设备通道
  sync = '/webapi/video/device/channel/sync',
  //获取通道同步进度
  syncStatus = '/webapi/video/device/channel/sync_status',
  //删除通道
  del = '/webapi/video/device/channel/del',
}

export function doTreeDeviceChannel() {
  return defHttp.get({ url: Api.tree });
}
export function doDeviceChannelPage(params: Recordable) {
  return defHttp.post<DeviceChannelPageResultModel>({
    url: Api.page,
    params,
  });
}
export function doSaveDeviceChannel(params) {
  return defHttp.post({ url: Api.save, params });
}
export function doDetailDeviceChannel(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
export function doDelDeviceChannel(params: Recordable) {
  return defHttp.delete({ url: Api.del, params });
}
export function doSyncDeviceChannel(params: Recordable) {
  return defHttp.get({ url: Api.sync, params });
}
export function doSyncStatusDeviceChannel(params: Recordable) {
  return defHttp.get({ url: Api.syncStatus, params });
}
