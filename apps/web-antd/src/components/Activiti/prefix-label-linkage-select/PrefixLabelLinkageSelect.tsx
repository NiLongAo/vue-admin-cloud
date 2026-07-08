import type { Recordable } from '@vben/types';

import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { Select } from 'ant-design-vue';

import { doSelect as doDepartmentSelect } from '#/api/sys/department';
import { doSelect as doRoleSelect } from '#/api/sys/role';
import { doSelect as doUserSelect } from '#/api/sys/user';

import './prefix-label-linkage-select.css';

type Dimension = '' | 'dept' | 'role' | 'user';

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), wait);
  };
}

function getDimensionConfig(dimension: Dimension) {
  switch (dimension) {
    case 'dept': {
      return {
        api: doDepartmentSelect,
        labelField: 'departmentName',
        valueField: 'id',
      };
    }
    case 'role': {
      return { api: doRoleSelect, labelField: 'roleName', valueField: 'id' };
    }
    case 'user': {
      return { api: doUserSelect, labelField: 'userName', valueField: 'id' };
    }
    default: {
      return undefined;
    }
  }
}

function normalizeOptions(
  response: any,
  labelField: string,
  valueField: string,
) {
  const source =
    response?.data ??
    response?.items ??
    response?.records ??
    response?.list ??
    response;

  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item) => ({
    label: item?.[labelField] ?? item?.name ?? item?.label,
    value: item?.[valueField] ?? item?.id ?? item?.value,
  }));
}

function parseAssignmentExpression(value?: string) {
  if (!value?.startsWith("${assignments.resolve(execution,'")) {
    return undefined;
  }

  const jsonText = value
    .split("${assignments.resolve(execution,'")[1]
    ?.split("')}")[0];

  if (!jsonText) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(jsonText)[0];
    return {
      dimension: parsed?.dimension as Dimension,
      values: Array.isArray(parsed?.values) ? parsed.values.map(Number) : [],
    };
  } catch {
    return undefined;
  }
}

function omitDynamicProps(props: Recordable<any>) {
  const {
    bindKey: _bindKey,
    bindTransformer: _bindTransformer,
    component: _component,
    getValue: _getValue,
    'onUpdate:value': _onUpdateValue,
    onUpdateValue: _onUpdateValueProp,
    predicate: _predicate,
    prefixTitle: _prefixTitle,
    setValue: _setValue,
    sourceModel: _sourceModel,
    value: _value,
    vSlots: _vSlots,
    ...selectProps
  } = props;
  return selectProps;
}

const PrefixLabelLinkageSelect = defineComponent({
  name: 'PrefixLabelLinkageSelect',
  props: {
    ...Select.props,
    prefixTitle: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  setup(rawProps, { emit, slots }) {
    const props = rawProps as any;
    const loading = ref(false);
    const options = ref<Array<{ label: string; value: number | string }>>([]);
    const state = reactive({
      apiSelectValue: [] as Array<number | string>,
      keyword: '',
      selectValue: '' as Dimension,
    });

    const modelValue = computed({
      get: () => props.value as string,
      set: (value: string) => emit('update:value', value),
    });

    function syncFromModel() {
      const parsed = parseAssignmentExpression(modelValue.value);
      if (!parsed) {
        return;
      }
      state.selectValue = parsed.dimension;
      state.apiSelectValue = parsed.values;
    }

    async function loadOptions(search = '') {
      const config = getDimensionConfig(state.selectValue);
      if (!config) {
        options.value = [];
        return;
      }

      loading.value = true;
      try {
        const params: Recordable<any> = {
          idList: state.apiSelectValue,
          limit: 20,
          name: search,
        };
        const response = await config.api(params);
        options.value = normalizeOptions(
          response,
          config.labelField,
          config.valueField,
        );
      } finally {
        loading.value = false;
      }
    }

    const onSearch = debounce((value: string) => {
      state.keyword = value;
      loadOptions(value);
    });

    watch(
      () => state.selectValue,
      () => {
        state.apiSelectValue = [];
        loadOptions();
      },
    );

    watch(
      () => state.apiSelectValue,
      () => {
        if (state.selectValue && state.apiSelectValue.length > 0) {
          const json = [
            {
              dimension: state.selectValue,
              values: state.apiSelectValue.map(String),
            },
          ];
          modelValue.value =
            String.raw`\${assignments.resolve(execution,'JSON')}`.replace(
              'JSON',
              JSON.stringify(json),
            );
        } else {
          modelValue.value = '';
        }
      },
      { deep: true },
    );

    onMounted(() => {
      syncFromModel();
      loadOptions();
    });

    return () => (
      <div class="prefix-label-linkage-select-container">
        {props.prefixTitle && (
          <div class="prefix-title">{props.prefixTitle}</div>
        )}
        <Select
          allowClear={true}
          class="w-1/2"
          options={[
            { value: 'user', label: '用户' },
            { value: 'role', label: '角色' },
            { value: 'dept', label: '部门' },
          ]}
          v-model:value={state.selectValue}
        />
        <Select
          {...omitDynamicProps(props)}
          allowClear={true}
          class="w-1/2"
          filterOption={false}
          loading={loading.value}
          maxTagCount={2}
          maxTagTextLength={4}
          mode="multiple"
          onSearch={onSearch}
          onUpdate:value={(value) => {
            state.apiSelectValue = Array.isArray(value)
              ? value.map((item: any) =>
                  typeof item === 'object' && item ? item.value : item,
                )
              : [];
          }}
          options={options.value}
          showSearch={true}
          v-slots={slots}
          value={state.apiSelectValue}
        />
      </div>
    );
  },
});

export default PrefixLabelLinkageSelect;
