import type { Recordable } from '@vben/types';

import { computed, defineComponent, onMounted, ref, unref, watch } from 'vue';

import { Select } from 'ant-design-vue';

import './prefix-label-select.css';

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => fn(...args), wait);
  };
}

function normalizeOptions(
  response: any,
  resultField: string,
  labelField: string,
  valueField: string,
) {
  const source =
    (resultField && response?.[resultField]) ??
    response?.items ??
    response?.records ??
    response?.list ??
    response;

  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item) => ({
    label: item?.[labelField] ?? item?.label ?? item?.name ?? item?.title,
    value: item?.[valueField] ?? item?.value ?? item?.id,
  }));
}

function omitDynamicProps(props: Recordable<any>) {
  const {
    api: _api,
    bindKey: _bindKey,
    bindTransformer: _bindTransformer,
    component: _component,
    getValue: _getValue,
    isApi: _isApi,
    labelField: _labelField,
    'onUpdate:value': _onUpdateValue,
    onUpdateValue: _onUpdateValueProp,
    params: _params,
    predicate: _predicate,
    prefixTitle: _prefixTitle,
    resultField: _resultField,
    searchName: _searchName,
    setValue: _setValue,
    sourceModel: _sourceModel,
    value: _value,
    valueField: _valueField,
    vSlots: _vSlots,
    ...selectProps
  } = props;
  return selectProps;
}

const PrefixLabelSelect = defineComponent({
  name: 'PrefixLabelSelect',
  props: {
    ...Select.props,
    api: {
      type: Function,
      default: undefined,
    },
    isApi: {
      type: Boolean,
      default: false,
    },
    labelField: {
      type: String,
      default: 'label',
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    prefixTitle: {
      type: String,
      default: '',
    },
    resultField: {
      type: String,
      default: '',
    },
    searchName: {
      type: String,
      default: 'name',
    },
    valueField: {
      type: String,
      default: 'value',
    },
  },
  emits: ['update:value'],
  setup(rawProps, { emit, slots }) {
    const props = rawProps as any;
    const keyword = ref('');
    const loading = ref(false);
    const apiOptions = ref<Array<{ label: string; value: number | string }>>(
      [],
    );

    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('update:value', value),
    });

    const loadOptions = async (searchValue = '') => {
      if (!props.isApi || !props.api) {
        return;
      }

      loading.value = true;
      try {
        const params: Recordable<any> = {
          ...unref(props.params as any),
        };
        if (props.searchName) {
          params[props.searchName] = searchValue;
        }
        const response = await props.api(params);
        apiOptions.value = normalizeOptions(
          response,
          props.resultField,
          props.labelField,
          props.valueField,
        );
      } finally {
        loading.value = false;
      }
    };

    const onSearch = debounce((value: string) => {
      keyword.value = value;
      loadOptions(value);
    });

    onMounted(() => loadOptions());

    watch(
      () => props.params,
      () => loadOptions(keyword.value),
      { deep: true },
    );

    return () => (
      <div class="prefix-label-select-container">
        {props.prefixTitle && (
          <div class="prefix-title">{props.prefixTitle}</div>
        )}
        <Select
          {...omitDynamicProps(props)}
          class="prefix-label-select"
          filterOption={props.isApi ? false : props.filterOption}
          loading={loading.value}
          onSearch={props.isApi ? onSearch : undefined}
          onUpdate:value={(value) => {
            modelValue.value = value;
          }}
          options={props.isApi ? apiOptions.value : props.options}
          showSearch={props.showSearch}
          v-slots={slots}
          value={modelValue.value}
        />
      </div>
    );
  },
});

export default PrefixLabelSelect;
