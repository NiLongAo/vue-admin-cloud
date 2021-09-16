import { getSystem, getAreaInfoList } from '/@/api/sys/system';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { SYSYTEM_KEY, AREA_KEY } from '/@/enums/cacheEnum';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { AreaEntity } from '/@/api/sys/model/systemModel';

interface SystemState {
  systemConfigMap: Recordable | undefined;
  areaList: Array<AreaEntity> | undefined;
}

export const useSystemStore = defineStore({
  id: 'app-system',
  state: (): SystemState => ({
    systemConfigMap: undefined,
    areaList: undefined,
  }),
  getters: {
    getSystemConfigMap(): Recordable {
      return this.systemConfigMap || getAuthCache<Recordable>(SYSYTEM_KEY) || {};
    },
    getAreaList(): Array<AreaEntity> {
      return this.areaList || getAuthCache<Array<AreaEntity>>(AREA_KEY) || [];
    },
  },
  actions: {
    setSystemConfigMap(systemConfigMap: Recordable) {
      this.systemConfigMap = systemConfigMap;
      setAuthCache(SYSYTEM_KEY, systemConfigMap);
    },
    setAreaList(areaList: Array<AreaEntity>) {
      this.areaList = areaList;
      setAuthCache(AREA_KEY, areaList);
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
    async getAreaListAction(): Promise<AreaEntity[]> {
      const areaList = await getAreaInfoList();
      this.setAreaList(areaList);
      return areaList;
    },
  },
});

// Need to be used outside the setup
export function useSystemStoreWithOut() {
  return useSystemStore(store);
}
