import { defHttp } from '/@/utils/http/axios';
import {
  PositionEntity,
  PositionTree,
  PositionPageResultModel,
  PositionParams,
} from './model/positionModel';

enum Api {
  //获取职位分页
  page = '/webapi/bean/position/page',
  //查询所有职位
  all = '/webapi/bean/position/all',
  //保存职位
  detail = '/webapi/bean/position/detail',
  //保存职位
  save = '/webapi/bean/position/save',
  //删除职位
  remove = '/webapi/bean/position/remove',
  //获取下拉职位树
  tree = '/webapi/bean/position/tree',
  //职位信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/position/select',
}

export function doPositionPage(params: PositionParams) {
  return defHttp.post<PositionPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doSelect(params) {
  return defHttp.get({ url: Api.select, params });
}

export function doPositionAll() {
  return defHttp.get({ url: Api.all });
}

export function doPositionSave(params: PositionEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doPositionRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doPositionDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}

export function doPositionTree(params: Recordable) {
  return defHttp.post<PositionTree>({ url: Api.tree, params });
}
