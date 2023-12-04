import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface OauthClientModel {
  // 客户端ID
  clientId: string;
  // 客户端密钥
  resourceIds: string;
  // 资源id列表
  clientSecret: string;
  // 域
  scope: string;
  // 授权方式
  authorizedGrantTypes: string;
  // 回调地址
  webServerRedirectUri: string;
  // 权限列表
  authorities: string;
  // 认证令牌时效
  accessTokenValidity: number;
  // 刷新令牌时效
  refreshTokenValidity: number;
  // 扩展信息
  additionalInformation: string;
  // 是否自动放行
  autoapprove: string;
}

/**
 * 查询参数类型
 */
export type OauthClientParams = BasicPageParams;

export type OauthClientPageResultModel = BasicFetchResult<OauthClientModel>;
