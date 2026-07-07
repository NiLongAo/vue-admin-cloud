import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicUserInfo {
  [key: string]: any;
  avatar?: string;
  homePath?: string;
  httpImageUrl?: string | undefined;
  id?: string;
  /**
   * 头像
   */
  imageUrl: string;
  /**
   * 用户昵称
   */
  nickName: string;
  realName?: string;
  roleIdList?: string[];
  roles?: string[];
  userId?: string;
  /**
   * 用户名
   */
  userName: string;
  username?: string;
}

interface AccessState {
  /**
   * 租户编号
   */
  searchTenant?: number | string | undefined;
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(imageBaseUrl: string, userInfo: any | null) {
      const imageUrl = userInfo?.imageUrl ?? '';
      const httpImageUrl = imageUrl
        ? `${imageBaseUrl}${imageUrl}`
        : userInfo?.httpImageUrl;
      // 设置用户信息
      this.userInfo = userInfo
        ? {
            ...userInfo,
            httpImageUrl,
            imageUrl,
            nickName: userInfo.nickName ?? '',
            userName: userInfo.userName ?? userInfo.username ?? '',
          }
        : null;
      // 设置角色信息
      const roles = userInfo?.roleIdList ?? [];
      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
    setSearchTenant(searchTenant?: number | string | undefined) {
      this.searchTenant = searchTenant;
    },
  },
  state: (): AccessState => ({
    searchTenant: undefined,
    userInfo: null,
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
