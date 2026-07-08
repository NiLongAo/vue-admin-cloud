import type { PropType } from 'vue';

import type { FieldDefine } from './index';

import { defineComponent, h, reactive, toRaw, watch, watchEffect } from 'vue';

import ScriptHelper, {
  resolve,
} from '#/components/Activiti/utils/script-helper';

function flatObject(
  source: FieldDefine,
  target: FieldDefine,
  prefix = '',
): FieldDefine {
  Object.keys(source || {}).forEach((key) => {
    const current = source[key];
    if (!current || typeof current !== 'object') {
      return;
    }
    if (current.component) {
      target[prefix + key] = current;
    } else {
      flatObject(current, target, `${key}.`);
    }
  });
  return target;
}

function predicate(fieldDefine: FieldDefine, value: unknown): boolean {
  const bindDefinePredicate = fieldDefine.predicate;
  if (typeof bindDefinePredicate === 'string') {
    return ScriptHelper.executeEl(value, bindDefinePredicate) as boolean;
  }
  if (typeof bindDefinePredicate === 'function') {
    return bindDefinePredicate(value);
  }
  return true;
}

function defaultTransformer(
  sourceModel: unknown,
  bindKey: string,
  bindDefine: FieldDefine,
) {
  return reactive({
    bindKey,
    ...bindDefine,
    sourceModel,
    value: bindDefine.getValue
      ? bindDefine.getValue(toRaw(sourceModel))
      : resolve(bindKey, sourceModel) || '',
  });
}

export default defineComponent({
  name: 'DynamicBinder',
  props: {
    bindTransformer: {
      type: Function,
      default: undefined,
    },
    fieldDefine: {
      type: Object as PropType<FieldDefine>,
      default: () => ({}),
    },
    value: {
      type: Object as PropType<unknown>,
      default: () => ({}),
    },
  },
  emits: ['fieldChange', 'update:value'],
  setup(props, { emit }) {
    const state = reactive({
      flatFieldDefine: flatObject(props.fieldDefine || {}, {}),
      handingModel: props.value,
    });

    watchEffect(() => {
      state.handingModel = props.value;
      state.flatFieldDefine = flatObject(props.fieldDefine || {}, {});
    });

    return () =>
      h(
        'div',
        { class: 'dynamic-binder' },
        Object.keys(state.flatFieldDefine).map((key) => {
          const define = state.flatFieldDefine[key];
          if (!define || !predicate(define, toRaw(props.value))) {
            return null;
          }

          const bindData = define.bindTransformer
            ? define.bindTransformer(state.handingModel, key, define)
            : defaultTransformer(state.handingModel, key, define);
          const Component = toRaw(define.component) as any;

          watch(
            () => bindData.value,
            () => {
              emit('update:value', state.handingModel);
              if (bindData.setValue) {
                const callback = bindData.setValue(
                  toRaw(props.value),
                  bindData.bindKey,
                  bindData.value,
                );
                if (typeof callback === 'function') {
                  callback();
                }
              } else {
                emit('fieldChange', bindData.bindKey, bindData.value);
              }
            },
          );

          return h(
            Component,
            {
              ...bindData,
              class: `${Component.name || 'field'}-${key} dynamic-binder-item`,
              value: bindData.value,
              'onUpdate:value': (value: unknown) => {
                bindData.value = value;
              },
            },
            bindData.vSlots,
          );
        }),
      );
  },
});
