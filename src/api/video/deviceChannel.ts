import { defHttp } from '/@/utils/http/axios';
import { DeviceChannelEntity, DeviceChannelParams, DeviceChannelPageResultModel } from './model/deviceChannelModel';

enum Api {
  //通道分页
  tree = '/webapi/video/device/channel/tree',
  //通道分页
  page = '/webapi/video/device/channel/page',
  //保存通道信息
  save =  '/webapi/video/device/channel/save',
  //同步设备通道
  sync = '/webapi/video/device/channel/sync',
  //获取通道同步进度
  syncStatus = '/webapi/video/device/channel/sync_status',
}

export function doTreeDeviceChannel() {
  return defHttp.get({ url: Api.tree });
}
export function doDeviceChannelPage(params: DeviceChannelParams) {
  return defHttp.post<DeviceChannelPageResultModel>({
    url: Api.page,
    params,
  });
}
export function doSaveDeviceChannel(params) {
  return defHttp.post({ url: Api.save, params });
}
export function doSyncDeviceChannel(params: Recordable) {
  return defHttp.get({ url: Api.sync, params });
}
export function doSyncStatusDeviceChannel(params: Recordable) {
  return defHttp.get({ url: Api.syncStatus, params });
}