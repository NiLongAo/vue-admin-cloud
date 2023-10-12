import type { LockInfo } from '/#/store';

import { defineStore } from 'pinia';

import { LOCK_INFO_KEY } from '/@/enums/cacheEnum';
import { Persistent } from '/@/utils/cache/persistent';
import { useUserStore } from './user';
import { AesEncryption } from '/@/utils/cipher';
import { SECRET_KEY, SECRET_IV } from '/@/enums/commonEnum';

const encryption = new AesEncryption({ key: SECRET_KEY, iv: SECRET_IV });

interface LockState {
  lockInfo: Nullable<LockInfo>;
}

export const useLockStore = defineStore({
  id: 'app-lock',
  state: (): LockState => ({
    lockInfo: Persistent.getLocal(LOCK_INFO_KEY),
  }),
  getters: {
    getLockInfo(state): Nullable<LockInfo> {
      return state.lockInfo;
    },
  },
  actions: {
    setLockInfo(info: LockInfo) {
      this.lockInfo = Object.assign({}, this.lockInfo, info);
      Persistent.setLocal(LOCK_INFO_KEY, this.lockInfo, true);
    },
    resetLockInfo() {
      Persistent.removeLocal(LOCK_INFO_KEY, true);
      this.lockInfo = null;
    },
    // Unlock
    async unLock(password?: string) {
      const userStore = useUserStore();
      if (this.lockInfo?.pwd === password) {
        this.resetLockInfo();
        return true;
      }
      const tryLogin = async () => {
        return false;
        // try {
        //   const loginAccount = userStore.getUserInfo?.loginAccount;
        //   const res = await userStore.login({
        //     grantType: 'password',
        //     goHome: false,
        //     mode: 'none', //不要默认的错误提示
        //     code: {
        //       username: encryption.encryptByAES(loginAccount || ''),
        //       password: encryption.encryptByAES(password!),
        //       key: '',
        //       verificationCode: '',
        //     },
        //   });
        //   if (res) {
        //     this.resetLockInfo();
        //   }
        //   return res;
        // } catch (error) {
        //   return false;
        // }
      };
      return await tryLogin();
    },
  },
});
