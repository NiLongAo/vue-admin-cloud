import { defHttp } from '/@/utils/http/axios';
import {PlatformParams,PlatformPageResultModel} from './model/platformModel';

enum Api {
  //分页
  doPlatformPage = '/webapi/video/parent/platform/page',
  //详情
  doPlatformDetail = '/webapi/video/parent/platform/detail',
  //新增
  doPlatformInsert =  '/webapi/video/parent/platform/insert',
  //编辑
  doPlatformUpdate =  '/webapi/video/parent/platform/update',
  //移除
  doPlatformRemove = '/webapi/video/parent/platform/delete',

  //级联国标目录数
  doPlatformCatalogTree = '/webapi/video/platform/catalog/tree',
  //级联国标目录新增
  doPlatformCatalogInsert = '/webapi/video/platform/catalog/insert',
  //级联国标目录修改
  doPlatformCatalogUpdate = '/webapi/video/platform/catalog/update',
  //级联国标目录删除
  doPlatformCatalogDelete = '/webapi/video/platform/catalog/delete',
  //级联国标目录删除关联
  doPlatformCatalogDeleteRelation = '/webapi/video/platform/catalog/delete_relation',

  //国标级联通道列表
  doPlatformGbChannelList = '/webapi/video/platform/gb_channel/device_channel_list',
  //国标级联绑定的通道key集合
  doPlatformChannelBindKey = '/webapi/video/platform/gb_channel/channel_bind_key',
  //级联国标通道分页接口
  doPlatformGbChannelInsert = '/webapi/video/platform/gb_channel/insert',
  //级联国标通道分页接口
  doPlatformGbChannelDelete = '/webapi/video/platform/gb_channel/delete',

  //级联国标流列表
  doPlatformGbStreamList = '/webapi/video/platform/gb_stream/gb_stream_list',
  //级联国标流列表
  doPlatformStreamBindKey = '/webapi/video/platform/gb_stream/stream_bind_key',
  //级联国标流分页接口
  doPlatformGbStreamInsert = '/webapi/video/platform/gb_stream/add',
  //级联国标流分页接口
  doPlatformGbStreamDelete = '/webapi/video/platform/gb_stream/del',

}

export function doPlatformPage(params: PlatformParams) {
  return defHttp.post<PlatformPageResultModel>({
    url: Api.doPlatformPage,
    params,
  });
}
export function doPlatformInsert(params) {
  return defHttp.post({ url: Api.doPlatformInsert, params });
}
export function doPlatformUpdate(params) {
  return defHttp.post({ url: Api.doPlatformUpdate, params });
}
export function doPlatformDetail(params: Recordable) {
  return defHttp.get({ url: Api.doPlatformDetail, params });
}
export function doPlatformRemove(params: Recordable) {
  return defHttp.delete({ url: Api.doPlatformRemove, params });
}

export function doPlatformCatalogTree(params: Recordable) {
  return defHttp.get({ url: Api.doPlatformCatalogTree, params });
}
export function doPlatformCatalogInsert(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformCatalogInsert, params });
}
export function doPlatformCatalogUpdate(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformCatalogUpdate, params });
}
export function doPlatformCatalogDelete(params: Recordable) {
  return defHttp.delete({ url: Api.doPlatformCatalogDelete, params });
}
export function doPlatformCatalogDeleteRelation(params: Recordable) {
  return defHttp.delete({ url: Api.doPlatformCatalogDeleteRelation, params });
}


export function doPlatformGbChannelList() {
  return defHttp.get({ url: Api.doPlatformGbChannelList });
}
export function doPlatformChannelBindKey(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformChannelBindKey, params });
}
export function doPlatformGbChannelInsert(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformGbChannelInsert, params });
}
export function doPlatformGbChannelDelete(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformGbChannelDelete, params });
}

export function doPlatformGbStreamList() {
  return defHttp.get({ url: Api.doPlatformGbStreamList });
}
export function doPlatformStreamBindKey(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformStreamBindKey, params });
}
export function doPlatformGbStreamInsert(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformGbStreamInsert, params });
}
export function doPlatformGbStreamDelete(params: Recordable) {
  return defHttp.post({ url: Api.doPlatformGbStreamDelete, params });
}