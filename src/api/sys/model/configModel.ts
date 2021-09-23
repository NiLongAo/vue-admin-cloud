import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * @description: 系统设置信息
 */
export interface ConfigEntity {
  //编码
  k: string;
  //值
  v: string;
  //设置名称
  configName: string;
}

/**
 * 查询参数类型
 */
export type ConfigParams = BasicPageParams;

export type ConfigPageResultModel = BasicFetchResult<ConfigEntity>;
