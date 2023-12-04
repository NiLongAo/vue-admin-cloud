import { defHttp } from '@/utils/http/axios';
import { LogsParams, LogsPageResultModel } from './model/logsModel';

enum Api {
  //获取系统设置分页
  page = '/webapi/config/logs/page',
  //保存系统设置
  detail = '/webapi/config/logs/detail',
}

export function doLogsPage(params: LogsParams) {
  return defHttp.post<LogsPageResultModel>({
    url: Api.page,
    params,
  });
}
export function doLogsDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}
