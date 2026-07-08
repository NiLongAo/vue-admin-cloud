import { computed, defineComponent } from 'vue';

import { InputNumber } from 'ant-design-vue';

import './prefix-label-number.css';

function omitDynamicProps(props: Record<string, any>) {
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
    ...inputProps
  } = props;
  return inputProps;
}

const PrefixLabelNumBer = defineComponent({
  name: 'PrefixLabelNumBer',
  props: {
    ...InputNumber.props,
    prefixTitle: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  setup(rawProps, { emit, slots }) {
    const props = rawProps as any;
    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('update:value', value),
    });

    return () => (
      <div class="prefix-label-number-container">
        {props.prefixTitle && (
          <div class="prefix-number-title">{props.prefixTitle}</div>
        )}
        <InputNumber
          {...omitDynamicProps(props)}
          class="prefix-label-number"
          onUpdate:value={(value) => {
            modelValue.value = value;
          }}
          v-slots={slots}
          value={modelValue.value}
        />
      </div>
    );
  },
});

export default PrefixLabelNumBer;
