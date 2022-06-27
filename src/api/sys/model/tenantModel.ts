import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * @description: 租户信息
 */
export interface TenantModel {
  // 键
  id: number;
  // 租户名
  tenantName?: string;
  // 租户联系人编号
  tenantUserId?: number;
  // 租户联系人名称
  tenantUserName?: string;
  // 租户状态（0正常 1停用）
  status?: number;
  // 账号数量
  accountCount?: string;
}

/**
 * 查询参数类型
 */
export type TenantParams = BasicPageParams;

export type TenantPageResultModel = BasicFetchResult<TenantModel>;
