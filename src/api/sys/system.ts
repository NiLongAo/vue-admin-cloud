import { defHttp } from '/@/utils/http/axios';
import { GetSystemModel } from './model/systemModel';
enum Api {
  GetSystemApi = '/webapi/config/config/all',
}

/**
 * @description: 获取系统配置信息
 */
export function getSystem() {
  return defHttp.get<Array<GetSystemModel>>({ url: Api.GetSystemApi });
}
