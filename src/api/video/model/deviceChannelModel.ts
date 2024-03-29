import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';
/**
 * @description: 系统设置信息
 */
export interface DeviceChannelEntity {}

/**
 * 查询参数类型
 */
export type DeviceChannelParams = BasicPageParams;

export type DeviceChannelPageResultModel = BasicFetchResult<DeviceChannelEntity>;
