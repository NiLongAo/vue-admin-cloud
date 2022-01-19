import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  UserInfoModel,
  GetUserInfoModel,
  UserPageResultModel,
  LoginMobileParams,
  UserParams,
} from './model/userModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  //账号密码登录
  Login = '/webapi/bean/user/login',
  //手机号登录
  LoginMobile = '/webapi/bean/user/login_mobile',
  //手机号登录
  SmsSend = '/webapi/sms/sms_send/send',
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
  //获取用户角色
  GetUserRole = '/webapi/bean/user/user_connect_role',
  //保存用户角色
  SaveUserRole = '/webapi/bean/user/save_user_role',
  //获取用户部门
  GetUserDepartment = '/webapi/bean/user/user_connect_department',
  //保存用户部门
  SaveUserDepartment = '/webapi/bean/user/save_user_department',
  //获取用户职位
  GetUserPosition = '/webapi/bean/user/user_connect_position',
  //保存用户职位
  SaveUserPosition = '/webapi/bean/user/save_user_position',
  //生成验证码的接口
  getCode = '/webapi/bean/user/getcode',
  //获取用户列表信息
  choiceUserPage = '/webapi/bean/user/choice_user_page',
  //用户信息下拉展示(动态搜索数据源)
  select = '/webapi/bean/user/select',
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
    },
  );
}

/**
 * @description: user login api
 */
export function loginMobileApi(params: LoginMobileParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.LoginMobile,
      params,
    },
    {
      errorMessageMode: mode,
    },
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

export function doSelect(params) {
  return defHttp.get({ url: Api.select, params });
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

/**
 * @description: 获取用户分页接口
 */
export function getChoiceUserPage(params: UserParams) {
  return defHttp.post<UserPageResultModel>({
    url: Api.choiceUserPage,
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

export function GetUserRole(params: Recordable) {
  return defHttp.get({ url: Api.GetUserRole, params });
}

export function SaveUserRole(params: Recordable) {
  return defHttp.post({ url: Api.SaveUserRole, params });
}

export function GetUserDepartment(params: Recordable) {
  return defHttp.get({ url: Api.GetUserDepartment, params });
}

export function SaveUserDepartment(params: Recordable) {
  return defHttp.post({ url: Api.SaveUserDepartment, params });
}

export function GetUserPosition(params: Recordable) {
  return defHttp.get({ url: Api.GetUserPosition, params });
}

export function SaveUserPosition(params: Recordable) {
  return defHttp.post({ url: Api.SaveUserPosition, params });
}

export function doGetCode() {
  return defHttp.post({ url: Api.getCode });
}
