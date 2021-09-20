import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export interface RoleModel {
  // 角色编号
  id: number;
  // 角色名称
  roleName: string;
  // 角色备注
  memo: string;
}

/**
 * 查询参数类型
 */
export type RoleParams = BasicPageParams;

export type RolePageResultModel = BasicFetchResult<RoleModel>;
