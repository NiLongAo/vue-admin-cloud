import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';
/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  grantType:
    | 'authorization_code'
    | 'password'
    | 'refresh_token'
    | 'implicit'
    | 'client_credentials'
    | 'sms'
    | 'code';
  authorizationCode?: AuthorizationCodeParams;
  code?: CodeParams;
  sms?: SmsParams;
  refreshToken?: RefreshTokenParams;
}

export interface AuthorizationCodeParams {
  code: string;
  redirectUri: string;
}
export interface CodeParams {
  username: string;
  password: string;
  key: string;
  verificationCode: string;
}
export interface SmsParams {
  smsCodeCode: string;
  phone: string;
}
export interface RefreshTokenParams {
  refreshToken: string;
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
  refresh_token: string;
  role?: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  /**
   * 用户编号
   */
  id: string | number;
  /**
   * 用户姓名
   */
  userName: string;
  /**
   * 用户昵称
   */
  nickName?: string;
  /**
   * 用户图像
   */
  imageUrl: string;
  /**
   * 登录账号
   */
  loginAccount?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 性别
   */
  gender?: number;
  /**
   * 省编码
   */
  provinceId?: number;
  /**
   * 市编码
   */
  cityId?: number;
  /**
   * 区编码
   */
  areaId?: number;
  /**
   * 身份证
   */
  idCard?: string;
  /**
   * 住址
   */
  address?: string;
  /**
   * 备注
   */
  memo?: string;
  /**
   * 最后登录时间
   */
  loginLastTime?: string;
  /**
   * 是否系统管理员
   */
  isAdmin?: number;
  /**
   * 是否启用
   */
  isEnabled?: number;
  /**
   * 租户编号
   */
  tenantId?: number;
  /**
   * 租户是否被禁用
   */
  tenantStatus?: number;
  /**
   * 用户角色
   */
  roleIdList?: Array<string>;
  /**
   * 用户职位
   */
  positionIdList?: Array<string>;
  /**
   * 用户部门
   */
  departmentIdList?: Array<string>;
  /**
   * 用户权限
   */
  privilegeList?: Array<string>;
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
  // 省区编码
  provinceId?: number;
  // 市区编码
  cityId?: number;
  // 区域编码
  areaId?: number;
}

export interface RememberLoing {
  rememberMe: boolean;
  username: string;
  password: string;
}
