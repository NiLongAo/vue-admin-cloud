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
  //发送短信
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
  //修改用户
  updateLoginUserInfo = '/webapi/bean/user/update_login_user_info',
  //根据当前登陆用户获取绑定其他端登陆账户
  findUserBind = '/webapi/bean/user/find_user_bind',
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
  //用户信息下拉展示(动态搜索数据源)
  findExportEntityInfo = '/webapi/bean/user/find_export_entity_info',
  //用户信息下拉展示(动态搜索数据源)
  findExportUrl = '/webapi/bean/user/find_export_url',
  //获取用户微信小程序登录二维码
  getQrCode = '/webapi/mini/get_qr_code',
  //web用户登录小程序接口
  miniWebLogin = '/webapi/mini/mini_web_login',
  //web用户绑定小程序用户
  bindMiniWeb = '/webapi/mini/bind_mini_web',
  //web用户解绑小程序用户
  unbindMiniWeb = '/webapi/mini/unbind_mini_web',
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

export function doUpdateLoginUserInfo(params: Recordable) {
  return defHttp.post({ url: Api.updateLoginUserInfo, params });
}

export function doFindUserBind() {
  return defHttp.get({ url: Api.findUserBind });
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

export function doExportEntityInfo(params) {
  return defHttp.get({ url: Api.findExportEntityInfo, params });
}

export function doExportUrl(params: Recordable) {
  return defHttp.post(
    {
      url: Api.findExportUrl,
      responseType: 'blob',
      params,
    },
    { isReturnNativeResponse: true },
  );
}

export function dogetQrCode() {
  return defHttp.get({ url: Api.getQrCode });
}

export function doMiniWebLogin(params) {
  return defHttp.get({ url: Api.miniWebLogin, params }, { isTransformResponse: false });
}

export function doBindMiniWeb(params) {
  return defHttp.get({ url: Api.bindMiniWeb, params }, { isTransformResponse: false });
}
export function doUnBindMiniWeb() {
  return defHttp.post({ url: Api.unbindMiniWeb }, { isTransformResponse: false });
}
