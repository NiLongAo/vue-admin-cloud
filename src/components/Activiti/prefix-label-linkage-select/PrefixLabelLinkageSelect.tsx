import { Select } from 'ant-design-vue';
import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
import { doSelect as doUserSelect } from '/@/api/sys/user';
import { doSelect as doRoleSelect } from '/@/api/sys/role';
import { doSelect as doDepartmentSelect } from '/@/api/sys/department';
import { debounce } from 'lodash-es';
import { defineComponent, computed, reactive, unref, watch } from 'vue';
import { propTypes } from '/@/utils/propTypes';
import './prefix-label-linkage-select.css';
const PrefixLabelSelect = defineComponent({
  props: {
    ...Select.props,
    prefixTitle: propTypes.string.def(''),
  },
  emits: ['update:value'],
  setup(props, { emit, slots }) {
    const delSApi = () => {
      return {};
    };
    const stats = reactive({
      keyword: '',
      searchApi: delSApi as Function,
      labelField: 'name',
      selectValue: '',
      apiSelectValue: [],
      valueField: 'id',
    });

    const computedModelValue = computed({
      get: () => {
        if (!!props.value && props.value.startsWith("${assignments.resolve(execution,'")) {
          let jsonStr = props.value.split("${assignments.resolve(execution,'")[1];
          jsonStr = jsonStr.split("')}")[0];
          if (jsonStr) {
            const json = JSON.parse(jsonStr)[0];
            stats.selectValue = json.dimension;
            stats.apiSelectValue = json.values.map((obg) => Number(obg));
          }
        }
        return props.value;
      },
      set: (val) => {
        emit('update:value', val);
      },
    });
    const searchParams = reactive({
      idList: stats.apiSelectValue,
      name: stats.keyword,
      limit: 20,
    });
    const onSearch = debounce((value) => {
      stats.keyword = value;
    }, 300);

    watch(
      () => stats.selectValue,
      () => {
        if (stats.selectValue == 'user') {
          stats.searchApi = doUserSelect;
        } else if (stats.selectValue == 'role') {
          stats.searchApi = doRoleSelect;
        } else if (stats.selectValue == 'dept') {
          stats.searchApi = doDepartmentSelect;
        } else {
          stats.searchApi = delSApi;
        }
      },
      { deep: true },
    );
    watch(
      () => stats.apiSelectValue,
      () => {
        // 数据组装
        if (stats.apiSelectValue.length > 0) {
          const jsonString = "${assignments.resolve(execution,'JSON')}";
          const json = [
            {
              dimension: stats.selectValue,
              values: stats.apiSelectValue.map((obg) => String(obg)),
            },
          ];
          computedModelValue.value = jsonString.replace('JSON', JSON.stringify(json));
        } else {
          computedModelValue.value = '';
        }
      },
      { deep: true },
    );
    //调用一次方法值
    computedModelValue.value;
    return () => (
      <div class="prefix-label-linkage-select-container">
        {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}

        <Select
          class="w-1/2"
          options={[
            { value: 'user', label: '用户' },
            { value: 'role', label: '角色' },
            { value: 'dept', label: '部门' },
          ]}
          onChange={() => {
            stats.apiSelectValue = [];
          }}
          v-model:value={stats.selectValue}
          allowClear={true}
        />
        <ApiSelect
          class="w-1/2"
          {...props}
          mode="multiple"
          maxTagTextLength={4}
          maxTagCount={2}
          optionFilterProp="label"
          labelField={stats.labelField}
          api={stats.searchApi}
          params={unref(searchParams)}
          onSearch={onSearch}
          valueField={stats.valueField}
          v-model:value={stats.apiSelectValue}
          v-slots={slots}
        />
      </div>
    );
  },
});

export default PrefixLabelSelect;
