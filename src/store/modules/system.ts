import { getSystem } from '/@/api/sys/system';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { SYSYTEM_KEY } from '/@/enums/cacheEnum';
import { defineStore } from 'pinia';
import { store } from '/@/store';

interface SystemState {
  systemConfigMap: Recordable;
}

export const useSystemStore = defineStore({
  id: 'app-system',
  state: (): SystemState => ({
    systemConfigMap: {},
  }),
  getters: {
    getSystemConfigMap(): Recordable {
      return this.systemConfigMap || getAuthCache<Recordable>(SYSYTEM_KEY) || {};
    },
  },
  actions: {
    setSystemConfigMap(systemConfigMap: Recordable) {
      this.systemConfigMap = systemConfigMap;
      setAuthCache(SYSYTEM_KEY, systemConfigMap);
    },
    async getSystemConfigAction(): Promise<Recordable<any>> {
      const systemList = await getSystem();
      const systemMap: Recordable = {};
      systemList.forEach((obj) => {
        systemMap[obj.k] = obj.v;
      });
      this.setSystemConfigMap(systemMap);
      return systemMap;
    },
  },
});

// Need to be used outside the setup
export function useSystemStoreWithOut() {
  return useSystemStore(store);
}
