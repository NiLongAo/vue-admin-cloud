import { FormSchema } from '/@/components/Form/src/types/form';
import { doTenantSelect } from '/@/api/sys/tenant';
import { isString, isNumber } from '/@/utils/is';
import { sysTenantId } from '/@/api/sys/model/tenantModel';
import { useUserStore } from '/@/store/modules/user';
import { debounce } from 'lodash-es';
import { defHttp } from '/@/utils/http/axios';
import { reactive, computed, unref } from 'vue';

const userStore = useUserStore();

const state = reactive({
  tenantName: '',
});

const searchParams = computed<Recordable>(() => {
  const searchName = { tenantName: state.tenantName, limit: 20 };
  return searchName;
});

//默认api传入租户名称与后端名称对应
const schemasTenantId = defHttp.getOptions().requestOptions?.dataHeaderTenant;

export const tenantObj = computed(() => {
  const tenantId = userStore.getUserInfo?.tenantId;
  const obj = {};
  if (isString(schemasTenantId)) {
    obj[schemasTenantId] = tenantId;
  }
  return obj;
});

export const isTenant = computed<Boolean>(() => {
  const tenantId = userStore.getUserInfo?.tenantId;
  if (schemasTenantId && !isString(tenantId) && !isNumber(tenantId)) {
    return false;
  }
  if (sysTenantId !== tenantId) {
    return false;
  }
  return true;
});

const onTenantSearch = debounce((value) => {
  state.tenantName = value;
}, 300);

const handleSelectChange = () => {
  state.tenantName = '';
};

export const tenantSchemas: FormSchema[] = [
  {
    field: schemasTenantId as string,
    label: `租户`,
    component: 'ApiSelect',
    colProps: {
      xl: 6,
      xxl: 5,
    },
    show: () => {
      return unref(isTenant) as boolean;
    },
    componentProps: {
      api: doTenantSelect,
      filterable: true,
      multiple: true,
      allowCreate: true,
      showSearch: true,
      filterOption: false,
      params: searchParams,
      onSearch: onTenantSearch,
      onChange: handleSelectChange,
      labelField: 'name',
      valueField: 'id',
    },
  },
];
