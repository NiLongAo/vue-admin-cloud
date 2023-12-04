import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface MobileMessageModel {
  // 编号
  id: number;
  // 内容
  content: string;
  // 手机号
  mobile: string;
  // 状态
  status: number;
  // 类型
  type: number;
  // 操作时间
  handleTime: string;
  // 创建时间
  createTime: string;
}

/**
 * 查询参数类型
 */
export type MobileMessageParams = BasicPageParams;

export type MobileMessagePageResultModel = BasicFetchResult<MobileMessageModel>;
