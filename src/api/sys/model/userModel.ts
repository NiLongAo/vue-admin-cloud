import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  loginAccount: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  access_token: string;
  role?: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  //角色
  roles?: RoleInfo[];
  //权限
  ability?: Array<string>;
  // 用户名
  userName: string;
  // 用户id
  userId?: string | number;
  // 真实名字
  realName?: string;
  // 头像
  imageUrl: string;
  // 介绍
  desc?: string;
}

/**
 * 查询参数类型
 */
export type UserParams = BasicPageParams;

/**
 * @description: 请求用户分页数据
 */
export type UserPageResultModel = BasicFetchResult<UserPageModel>;
export interface UserPageModel {
  userId: string | number;
  loginAccount: string;
  userName: string;
  nickName: string;
  idCard: string;
  phone: string;
  address: string;
  loginLastTime: string;
}
export interface UserInfoModel {
  // 用户id
  id?: string | number;
  // 头像
  imageUrl: string;
  // 用户名
  userName: string;
  //昵称
  nickName?: string;
  // 手机号
  phone?: string;
  // 男女
  gender?: number;
  // 身份证
  idCard?: string;
  // 地址
  address?: string;
  // 备注
  memo?: string;
  // 是否系统管理员
  isAdmin?: number;
  // 是否禁用
  isEnabled?: number;
}
