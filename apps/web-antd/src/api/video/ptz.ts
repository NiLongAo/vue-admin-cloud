import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

enum Api {
  auxiliary = '/webapi/video/ptz/auxiliary',
  cruisePointAdd = '/webapi/video/ptz/add_cruise_point',
  cruisePointDel = '/webapi/video/ptz/del_cruise_point',
  cruisePointSpeed = '/webapi/video/ptz/speed_cruise_point',
  cruisePointStart = '/webapi/video/ptz/start_cruise_point',
  cruisePointStop = '/webapi/video/ptz/stop_cruise_point',
  cruisePointTime = '/webapi/video/ptz/time_cruise_point',
  focus = '/webapi/video/ptz/focus',
  frontEndCommand = '/webapi/video/ptz/front_end_command',
  iris = '/webapi/video/ptz/iris',
  presetAdd = '/webapi/video/ptz/add_preset',
  presetCall = '/webapi/video/ptz/call_preset',
  presetDel = '/webapi/video/ptz/del_preset',
  presetQuery = '/webapi/video/ptz/preset_query',
  ptz = '/webapi/video/ptz/ptz',
  scanSetLeft = '/webapi/video/ptz/set_left_scan',
  scanSetRight = '/webapi/video/ptz/set_right_scan',
  scanSetSpeed = '/webapi/video/ptz/set_speed_scan',
  scanStart = '/webapi/video/ptz/start_scan',
  scanStop = '/webapi/video/ptz/stop_scan',
  wiper = '/webapi/video/ptz/wiper',
}

export function doPtzPtz(params: Recordable<any>) {
  return requestClient.get(Api.ptz, { params });
}

export function doPtzFocus(params: Recordable<any>) {
  return requestClient.get(Api.focus, { params });
}

export function doPtzIris(params: Recordable<any>) {
  return requestClient.get(Api.iris, { params });
}

export function doPtzFrontEndCommand(params: Recordable<any>) {
  return requestClient.get(Api.frontEndCommand, { params });
}

export function doPtzPresetQuery(params: Recordable<any>) {
  return requestClient.get<Recordable<any>[]>(Api.presetQuery, { params });
}

export function doPtzPresetDel(params: Recordable<any>) {
  return requestClient.get(Api.presetDel, { params });
}

export function doPtzPresetAdd(params: Recordable<any>) {
  return requestClient.get(Api.presetAdd, { params });
}

export function doPtzPresetCall(params: Recordable<any>) {
  return requestClient.get(Api.presetCall, { params });
}

export function doCruisePointAdd(params: Recordable<any>) {
  return requestClient.get(Api.cruisePointAdd, { params });
}

export function doCruisePointDel(params: Recordable<any>) {
  return requestClient.get(Api.cruisePointDel, { params });
}

export function doCruisePointSpeed(params: Recordable<any>) {
  return requestClient.get(Api.cruisePointSpeed, { params });
}

export function doCruisePointTime(params: Recordable<any>) {
  return requestClient.get(Api.cruisePointTime, { params });
}

export function doCruisePointStart(params: Recordable<any>) {
  return requestClient.get(Api.cruisePointStart, { params });
}

export function doCruisePointStop(params: Recordable<any>) {
  return requestClient.get(Api.cruisePointStop, { params });
}

export function doScanStart(params: Recordable<any>) {
  return requestClient.get(Api.scanStart, { params });
}

export function doScanStop(params: Recordable<any>) {
  return requestClient.get(Api.scanStop, { params });
}

export function doScanSetLeft(params: Recordable<any>) {
  return requestClient.get(Api.scanSetLeft, { params });
}

export function doScanSetRight(params: Recordable<any>) {
  return requestClient.get(Api.scanSetRight, { params });
}

export function doScanSetSpeed(params: Recordable<any>) {
  return requestClient.get(Api.scanSetSpeed, { params });
}

export function doWiper(params: Recordable<any>) {
  return requestClient.get(Api.wiper, { params });
}

export function doAuxiliary(params: Recordable<any>) {
  return requestClient.get(Api.auxiliary, { params });
}
