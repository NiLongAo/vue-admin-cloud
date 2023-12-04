import { defHttp } from '@/utils/http/axios';
import { GetSystemModel, AreaEntity } from './model/systemModel';
enum Api {
  GetSystemApi = '/webapi/config/config/all',
  GetAreaList = '/webapi/config/area/all',
}

/**
 * @description: 获取系统配置信息
 */
export function getSystem() {
  return defHttp.get<Array<GetSystemModel>>({ url: Api.GetSystemApi });
}

/**
 * @description: 获取地图信息
 */
export function getAreaInfoList() {
  return defHttp.get<Array<AreaEntity>>({ url: Api.GetAreaList });
}
