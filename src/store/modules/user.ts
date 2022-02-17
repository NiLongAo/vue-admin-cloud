import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import {
  ROLES_KEY,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_INFO_KEY,
  CHECK_URL_TOKEN_KEY,
  ABILITY_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { GetUserInfoModel, LoginParams } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { useSocketStore } from '/@/store/modules/socket';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { useSystemStore } from './system';
import { isArray } from '/@/utils/is';
import { h } from 'vue';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  checkUrl?: string | undefined;
  refresh_token?: string;
  roleList: RoleEnum[];
  abilityList: Array<string>;
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // refresh_token
    refresh_token: undefined,
    // roleList
    roleList: [],
    // 权限集合
    abilityList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // 点击的菜单
    checkUrl: undefined,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRefreshToken(): string {
      return this.refresh_token || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getRoleList(): RoleEnum[] {
      return this.roleList && this.roleList.length > 0
        ? this.roleList
        : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getAbilityList(): Array<string> {
      return this.abilityList && this.abilityList.length > 0 ? this.abilityList : [];
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getCheckUrl(): string | undefined {
      return this.checkUrl;
    },
  },
  actions: {
    setToken(info: string | undefined, refresh_token: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      this.refresh_token = refresh_token ? refresh_token : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
      setAuthCache(REFRESH_TOKEN_KEY, refresh_token);
    },
    setRefreshToken(refresh_token: string | undefined) {
      this.refresh_token = refresh_token ? refresh_token : ''; // for null or undefined value
      setAuthCache(REFRESH_TOKEN_KEY, refresh_token);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setAbilityList(abilityList: Array<string>) {
      this.abilityList = abilityList;
      setAuthCache(ABILITY_KEY, abilityList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    setCheckUrl(url: string | undefined) {
      this.checkUrl = url;
      setAuthCache(CHECK_URL_TOKEN_KEY, url);
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { access_token, refresh_token } = data;
        // save token
        this.setToken(access_token, refresh_token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /**
     * @description: refreshToken
     */
    async refreshToken() {
      try {
        const data = await loginApi({
          grantType: 'refresh_token',
          refreshToken: {
            refreshToken: this.getRefreshToken,
          },
        });
        const { access_token, refresh_token } = data;
        // save token
        this.setToken(access_token, refresh_token);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      const systemStore = useSystemStore();
      systemStore.getSystemConfigAction(); //加载权限配置信息
      systemStore.getAreaListAction(); //加载省市区配置信息
      systemStore.getEnumMapAction(); //加载后端枚举配置类
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [], ability = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      if (isArray(ability)) {
        this.setAbilityList(ability);
      }
      this.setUserInfo(userInfo);

      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      const systemStore = useSystemStore();
      const socketIo = useSocketStore();
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined, undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      systemStore.setSystemConfigMap({}); //清空配置信息
      socketIo.disconnectSocket(); //关闭socketio
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
