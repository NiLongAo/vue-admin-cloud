import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * @description: 系统设置信息
 */
export interface DeviceEntity {
}

/**
 * 查询参数类型
 */
export type DeviceParams = BasicPageParams;

export type DevicePageResultModel = BasicFetchResult<DeviceEntity>;