import { defHttp } from '/@/utils/http/axios';
import {
  DepartmentEntity,
  DepartmentParams,
  DepartmentTree,
  DepartmentPageResultModel,
} from './model/departmentModel';

enum Api {
  //获取部门分页
  page = '/webapi/bean/department/page',
  //查询所有部门
  all = '/webapi/bean/department/all',
  //保存部门
  detail = '/webapi/bean/department/detail',
  //保存部门
  save = '/webapi/bean/department/save',
  //删除部门
  remove = '/webapi/bean/department/remove',
  //获取下拉部门树
  tree = '/webapi/bean/department/tree',
  //部门信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/department/select',
}

export function doDepartmentPage(params: DepartmentParams) {
  return defHttp.post<DepartmentPageResultModel>({
    url: Api.page,
    params,
  });
}

export function doDepartmentAll() {
  return defHttp.get({ url: Api.all });
}

export function doSelect(params: Recordable) {
  return defHttp.get({ url: Api.select, params });
}

export function doDepartmentSave(params: DepartmentEntity) {
  return defHttp.post({ url: Api.save, params });
}

export function doDepartmentRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doDepartmentDetail(params: Recordable) {
  return defHttp.get({ url: Api.detail, params });
}

export function doDepartmentTree(params: Recordable) {
  return defHttp.post<DepartmentTree>({ url: Api.tree, params });
}
