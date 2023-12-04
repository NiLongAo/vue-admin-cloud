import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description: 系统设置信息
 */
export interface LogsEntity {
  //日志类型 0.其他 1.登录 2.新增 3.修改 4.删除
  type: string;
  //访问者ip
  ip: string;
  //ip归属地信息
  ipAttribution: string;
  //请求方式
  method: string;
  //访问接口
  api: string;
  //请求参数
  param: string;
  //响应参数
  result: string;
  //持续时间
  duration: number;
  //持续时间 开始
  durationStart: number;
  //持续时间 结束
  durationEnd: number;
}

/**
 * 查询参数类型
 */
export type LogsParams = BasicPageParams;

export type LogsPageResultModel = BasicFetchResult<LogsEntity>;
