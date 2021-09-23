import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * @description: 字典类型信息
 */
export interface DictionaryTypeEntity {
  //编号
  id: number;
  //编码
  code: number;
  //状态
  status: string;
  //字典类型名称
  name: string;
}

/**
 * @description: 字典条目信息
 */
export interface DictionaryItemEntity {
  //编号
  id: number;
  //顺序
  sort: number;
  //字典条目名称
  name: string;
  //字典类型编号
  typeId: string;
  //值
  value: string;
}

/**
 * 查询参数类型
 */
export type DictionaryItemParams = BasicPageParams;

export type DictionaryItemPageResultModel = BasicFetchResult<DictionaryItemEntity>;
