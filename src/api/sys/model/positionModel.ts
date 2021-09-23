import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * @description: 职位信息
 */
export interface PositionEntity {
  //父级编号
  parentId: number;
  //当前编号
  id: number;
  //职位名称
  positionName: string;
  //是否开启
  isEnable: string;
  //备注
  memo: string;
}

export interface PositionTree {
  //父级编号
  parentId: number;
  //当前编号
  id: number;
  //部门名称
  title: string;
  //下级目录
  children: Array<PositionTree>;
}
/**
 * 查询参数类型
 */
export type PositionParams = BasicPageParams;

export type PositionPageResultModel = BasicFetchResult<PositionEntity>;
