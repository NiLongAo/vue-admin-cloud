import { getSystem, getAreaInfoList } from '/@/api/sys/system';
import { doEnumCheck } from '/@/api/common/enum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { SYSYTEM_KEY, AREA_KEY, ENUM_KEY, DITC_KEY } from '/@/enums/cacheEnum';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { AreaEntity } from '/@/api/sys/model/systemModel';
import { EnumModel } from '/@/api/common/model/enumModel';
interface SystemState {
  systemConfigMap: Recordable | undefined;
  areaList: Array<AreaEntity> | undefined;
  dictMap: Recordable | undefined;
  enumMap: EnumModel | undefined;
}

export const useSystemStore = defineStore({
  id: 'app-system',
  state: (): SystemState => ({
    systemConfigMap: undefined,
    areaList: undefined,
    dictMap: undefined,
    enumMap: undefined,
  }),
  getters: {
    getSystemConfigMap(): Recordable {
      return this.systemConfigMap || getAuthCache<Recordable>(SYSYTEM_KEY) || {};
    },
    getAreaList(): Array<AreaEntity> {
      return this.areaList || getAuthCache<Array<AreaEntity>>(AREA_KEY) || [];
    },
    getEnumMap(): EnumModel {
      return this.enumMap || getAuthCache<EnumModel>(ENUM_KEY) || {};
    },
    getDictMap(): Recordable {
      return this.dictMap || getAuthCache<Recordable>(DITC_KEY) || {};
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
    setEnumMap(enumMap: EnumModel) {
      this.enumMap = enumMap;
      setAuthCache(ENUM_KEY, enumMap);
    },
    setDictMap(dictMap: Recordable) {
      this.dictMap = dictMap;
      setAuthCache(DITC_KEY, dictMap);
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
    async getEnumMapAction(): Promise<EnumModel> {
      const enumMap = await doEnumCheck();
      this.setEnumMap(enumMap);
      return enumMap;
    },
    async getDictMapAction(): Promise<Recordable<any>> {
      const enumMap = await doEnumCheck();
      this.setEnumMap(enumMap);
      return enumMap;
    },
  },
});

// Need to be used outside the setup
export function useSystemStoreWithOut() {
  return useSystemStore(store);
}
