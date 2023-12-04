import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description: 部门信息
 */
export interface DepartmentEntity {
  //父级编号
  parentId: number;
  //当前编号
  id: number;
  //部门名称
  departmentName: string;
  //是否开启
  isEnable: string;
  //备注
  memo: string;
}

export interface DepartmentTree {
  //父级编号
  parentId: number;
  //当前编号
  id: number;
  //部门名称
  title: string;
  //下级目录
  children: Array<DepartmentTree>;
}
/**
 * 查询参数类型
 */
export type DepartmentParams = BasicPageParams;

export type DepartmentPageResultModel = BasicFetchResult<DepartmentEntity>;
