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
  Login = '/webapi/bean/user/login',
  Logout = '/webapi/bean/user/logout',
  UserInfo = '/webapi/bean/user/info',
  GetUserInfo = '/webapi/bean/user/login_info',
  GetPermCode = '/webapi/bean/user/getPermCode',
  GetUserPage = '/webapi/bean/user/page',
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
