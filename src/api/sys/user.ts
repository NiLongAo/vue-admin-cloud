import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  UserInfoModel,
  GetUserInfoModel,
  UserPageResultModel,
  UserParams,
} from './model/userModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  //登录
  Login = '/webapi/bean/user/login',
  //退出
  Logout = '/webapi/bean/user/logout',
  //获取用户信息
  UserInfo = '/webapi/bean/user/info',
  //获取当前登录用户信息
  GetUserInfo = '/webapi/bean/user/login_info',
  //获取权限（废弃）
  GetPermCode = '/webapi/bean/user/getPermCode',
  //获取用户列表信息
  GetUserPage = '/webapi/bean/user/page',
  //新增用户
  insert = '/webapi/bean/user/insert',
  //修改用户
  update = '/webapi/bean/user/update',
  //删除用户
  delete = '/webapi/bean/user/delete',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function UserInfoApi(params) {
  return defHttp.get<UserInfoModel>({ url: Api.UserInfo, params });
}

/**
 * @description: 获取用户分页接口
 */
export function getUserPage(params: UserParams) {
  return defHttp.post<UserPageResultModel>({
    url: Api.GetUserPage,
    params,
  });
}

export function doInsert(params: Recordable) {
  return defHttp.post({ url: Api.insert, params });
}

export function doUpdate(params: Recordable) {
  return defHttp.post({ url: Api.update, params });
}

export function doDelete(params: Recordable) {
  return defHttp.get({ url: Api.delete, params });
}
