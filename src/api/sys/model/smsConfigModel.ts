import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface SmsConfigModel {
  // 编号
  id: number;
  // 类型
  smsType: number;
  // 配置名称
  configName: string;
  // 账号
  account: string;
  // 密码
  password: string;
  // 余额
  balance: number;
  // 是否启用
  isActive: number;
  // 签名
  sign: string;
  // 签名
  signPlace: number;
  // 更新时间
  updateTime: string;
}

/**
 * 查询参数类型
 */
export type SmsConfigParams = BasicPageParams;

export type SmsConfigPageResultModel = BasicFetchResult<SmsConfigModel>;
