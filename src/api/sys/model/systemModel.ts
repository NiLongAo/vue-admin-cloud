/**
 * @description: 获取系统配置信息
 */
export interface GetSystemModel {
  // 键
  k: string;
  // 值
  v?: string;
  // 配置名称
  configName?: string;
}

/**
 * @description: 获取省市区信息
 */
export interface AreaEntity {
  //父级编号
  parentId: number;
  //当前编号
  value: number;
  //名称
  label: string;
  //是否有下级
  children?: Array<AreaEntity>;
}
