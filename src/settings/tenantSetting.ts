import { FormSchema } from '/@/components/Form/src/types/form';
import { doTenantSelect } from '/@/api/sys/tenant';
import { debounce } from 'lodash-es';
import { reactive, computed } from 'vue';

const state = reactive({
  tenantName: '',
});

const searchParams = computed<Recordable>(() => {
  const searchName = { tenantName: state.tenantName, limit: 20 };
  return searchName;
});

const onTenantSearch = debounce((value) => {
  state.tenantName = value;
}, 300);

const handleChange = () => {
  state.tenantName = '';
};

export const schemas: FormSchema[] = [
  {
    field: `tenantId`,
    label: `租户`,
    component: 'ApiSelect',
    colProps: {
      xl: 6,
      xxl: 5,
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
      change: handleChange,
      labelField: 'name',
      valueField: 'id',
    },
  },
];
