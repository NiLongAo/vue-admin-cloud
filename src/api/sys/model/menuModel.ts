import type { RouteMeta } from 'vue-router';
import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}
/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

// 菜单
export interface MenuEntity {
  //父级菜单编号
  parentId: string;
  //本级编号
  id: string;
  //类型
  type: number;
  //级别
  level: number;
  //菜单名称
  menuName: string;
  //跳转路径
  path: string;
  //页面路径
  viewPath: string;
  //小图标
  icon: string;
  //是否开启 1.是 0否
  isOpen: number;
  //是否隐藏 1.是 0否
  hideMenu: number;
  //序号
  num: number;
  //备注
  memo: string;
}

export interface MenuTree {
  //父级编号
  parentId: number;
  //当前编号
  id: number;
  //菜单名称
  menuName: string;
  //下级目录
  children: Array<MenuTree>;
}
/**
 * 查询参数类型
 */
export type MenuParams = BasicPageParams;

export type MenuPageResultModel = BasicFetchResult<MenuEntity>;

// 权限
export interface PrivilegeEntity {
  //权限编号
  id: string;
  //权限名称
  privilegeName: string;
  //请求路径
  requestUrl: string;
  //菜单编号
  menuId: string;
  //备注
  memo: string;
  //是否开启 1.是 0否
  isOpen: number;
}
