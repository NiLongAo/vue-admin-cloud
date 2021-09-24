import { defHttp } from '/@/utils/http/axios';
import {
  getMenuListResultModel,
  MenuEntity,
  MenuParams,
  MenuTree,
  MenuPageResultModel,
  PrivilegeEntity,
} from './model/menuModel';
//权限与菜单在一个ts中
enum Api {
  /**
   * 菜单协议
   */
  //获取用户路由菜单
  GetMenuList = '/webapi/bean/menu/user_tree_menu',
  //获取菜单分页
  menuPage = '/webapi/bean/menu/page',
  //查询所有菜单
  menuAll = '/webapi/bean/menu/all',
  //菜单详情
  menuDetail = '/webapi/bean/menu/detail',
  //保存菜单
  menuSave = '/webapi/bean/menu/save',
  //删除菜单
  menuRemove = '/webapi/bean/menu/remove',
  //获取下拉菜单树
  menuTree = '/webapi/bean/menu/tree',

  /**
   * 权限协议
   */
  //保存权限
  privilegeSave = '/webapi/bean/privilege/save',
  //删除权限
  privilegeRemove = '/webapi/bean/privilege/remove',
  //权限详情
  privilegeDetail = '/webapi/bean/privilege/detail',
}

/**
 * @description: 菜单协议
 */
//获取用户路由菜单
export const getMenuList = () => {
  return defHttp.post<getMenuListResultModel>({ url: Api.GetMenuList });
};
//获取菜单分页
export function doMenuPage(params: MenuParams) {
  return defHttp.post<MenuPageResultModel>({
    url: Api.menuPage,
    params,
  });
}
//查询所有菜单
export function doMenuAll() {
  return defHttp.get({ url: Api.menuAll });
}
//保存菜单
export function doMenuSave(params: MenuEntity) {
  return defHttp.post({ url: Api.menuSave, params });
}
//删除菜单
export function doMenuRemove(params: Recordable) {
  return defHttp.get({ url: Api.menuRemove, params });
}
//菜单详情
export function doMenuDetail(params: Recordable) {
  return defHttp.get({ url: Api.menuDetail, params });
}
//菜单树
export function doMenuTree(params: Recordable) {
  return defHttp.post<MenuTree>({ url: Api.menuTree, params });
}
/**
 * @description: 权限协议
 */
//保存权限
export function doPrivilegeSave(params: PrivilegeEntity) {
  return defHttp.post({ url: Api.privilegeSave, params });
}
//删除权限
export function doPrivilegeRemove(params: Recordable) {
  return defHttp.get({ url: Api.privilegeRemove, params });
}
//权限详情
export function doPrivilegeDetail(params: Recordable) {
  return defHttp.get({ url: Api.privilegeDetail, params });
}
