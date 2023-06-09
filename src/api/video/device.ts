import { defHttp } from '/@/utils/http/axios';
import { DeviceEntity, DeviceParams, DevicePageResultModel } from './model/deviceModel';

enum Api {
  //分页
  page = '/webapi/video/device/page',
  //根据国标设备编号获取设备
  findDeviceId =  '/webapi/video/device/find_device_id',
  //移除设备
  del = '/webapi/video/device/del',
  //修改数据流传输模式
  updateTransport = '/webapi/video/device/update_transport',
  //设备保存
  saveDevice = '/webapi/video/device/save_device',
  //设备状态查询
  findDeviceStatus = '/webapi/video/device/find_device_status',
  //设备报警查询
  findDeviceAlarm = '/webapi/video/device/find_device_alarm',
  //获取设备的订阅状态
  subscribeInfo = '/webapi/video/device/subscribe_info',
  //基本配置设置命令
  basicParam = '/webapi/video/device/basic_param',
  //基本配置设置命令
  queryParam = '/webapi/video/device/query_param',
  //远程启动控制
  startControl = '/webapi/video/device/start_control',
  //录像控制命令
  recordControl = '/webapi/video/device/record_control',
  //布防/撤防命令
  guardControl = '/webapi/video/device/guard_control',
  //报警复位
  resetAlarm = '/webapi/video/device/reset_alarm',
  //强制关键帧
  iFrame = '/webapi/video/device/i_frame',
  //看守位控制
  homePosition = '/webapi/video/device/home_position',
  //拉框放大
  zoomIn = '/webapi/video/device/zoom_in',
  //拉框缩小
  zoomOut = '/webapi/video/device/zoom_out',
}

export function doDevicePage(params: DeviceParams) {
  return defHttp.post<DevicePageResultModel>({
    url: Api.page,
    params,
  });
}
export function doSaveDevice(params) {
  return defHttp.post({ url: Api.saveDevice, params });
}
export function doFindDeviceId(params: Recordable) {
  return defHttp.get({ url: Api.findDeviceId, params });
}
export function doDelDeviceId(params: Recordable) {
  return defHttp.delete({ url: Api.del, params });
}
export function doUpdateTransport(params: Recordable) {
  return defHttp.get({ url: Api.updateTransport, params });
}
export function doFindDeviceStatus(params: Recordable) {
  return defHttp.get({ url: Api.findDeviceStatus, params });
}
export function doFindDeviceAlarm(params: Recordable) {
  return defHttp.get({ url: Api.findDeviceAlarm, params });
}
export function doSubscribeInfo(params: Recordable) {
  return defHttp.get({ url: Api.subscribeInfo, params });
}
export function doBasicParam(params: Recordable) {
  return defHttp.get({ url: Api.basicParam, params });
}
export function doQueryParam(params: Recordable) {
  return defHttp.get({ url: Api.queryParam, params });
}
export function doStartControl(params: Recordable) {
  return defHttp.get({ url: Api.startControl, params });
}
export function doRecordControl(params: Recordable) {
  return defHttp.get({ url: Api.recordControl, params });
}
export function doGuardControl(params: Recordable) {
  return defHttp.get({ url: Api.guardControl, params });
}
export function doResetAlarm(params: Recordable) {
  return defHttp.get({ url: Api.resetAlarm, params });
}
export function doIFrame(params: Recordable) {
  return defHttp.get({ url: Api.iFrame, params });
}
export function doHomePosition(params: Recordable) {
  return defHttp.get({ url: Api.homePosition, params });
}
export function doZoomIn(params: Recordable) {
  return defHttp.get({ url: Api.zoomIn, params });
}
export function doZoomOut(params: Recordable) {
  return defHttp.get({ url: Api.zoomOut, params });
}