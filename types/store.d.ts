import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
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
  roleIdList?: Array<number>;
  /**
   * 用户职位
   */
  positionIdList?: Array<number>;
  /**
   * 用户部门
   */
  departmentIdList?: Array<number>;
  /**
   * 用户权限
   */
  privilegeList?: Array<string>;
  /**
   * 用户首页
   */
  homePath?: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
