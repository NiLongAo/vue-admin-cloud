import { defHttp } from '@/utils/http/axios';
import {
  DictionaryTypeEntity,
  DictionaryItemEntity,
  DictionaryItemParams,
  DictionaryItemPageResultModel,
} from './model/dictionaryModel';

enum DictionaryTypeApi {
  //获取字典类型集合
  typeList = '/webapi/config/dictionary_type/find_type_list',
  //字典类型
  save = '/webapi/config/dictionary_type/save',
  //删除字典类型
  remove = '/webapi/config/dictionary_type/remove',
  //字典类型详情
  detail = '/webapi/config/dictionary_type/detail',
}
export function doDictionaryTypeList() {
  return defHttp.get<Array<DictionaryTypeEntity>>({ url: DictionaryTypeApi.typeList });
}

export function doDictionaryTypeSave(params: DictionaryTypeEntity) {
  return defHttp.post({ url: DictionaryTypeApi.save, params });
}

export function doDictionaryTypeRemove(params: Recordable) {
  return defHttp.get({ url: DictionaryTypeApi.remove, params });
}

export function doDictionaryTypeDetail(params: Recordable) {
  return defHttp.get({ url: DictionaryTypeApi.detail, params });
}

enum DictionaryItemApi {
  //获取字典条目集合
  itemList = '/webapi/config/dictionary_item/find_item_list',
  //分页信息
  page = '/webapi/config/dictionary_item/page',
  //保存字典条目
  save = '/webapi/config/dictionary_item/save',
  //删除字典条目
  remove = '/webapi/config/dictionary_item/remove',
  //字典条目详情
  detail = '/webapi/config/dictionary_item/detail',
  //获取有效字典条目
  findDict = '/webapi/config/dictionary_item/find_dict',
}
export function doDictionaryItemList() {
  return defHttp.get<Array<DictionaryItemEntity>>({ url: DictionaryItemApi.itemList });
}

export function doDictionaryItemPage(params: DictionaryItemParams) {
  return defHttp.post<DictionaryItemPageResultModel>({
    url: DictionaryItemApi.page,
    params,
  });
}

export function doDictionaryItemSave(params: DictionaryItemEntity) {
  return defHttp.post({ url: DictionaryItemApi.save, params });
}

export function doDictionaryItemRemove(params: Recordable) {
  return defHttp.get({ url: DictionaryItemApi.remove, params });
}

export function doDictionaryItemDetail(params: Recordable) {
  return defHttp.get({ url: DictionaryItemApi.detail, params });
}

export function doDictionaryItemMap() {
  return defHttp.get({ url: DictionaryItemApi.findDict });
}
