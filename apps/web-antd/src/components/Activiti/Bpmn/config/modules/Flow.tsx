/* eslint-disable vue/multi-word-component-names */
import type { ModdleElement } from '../../type';
import type { GroupProperties } from '../index';

import { Input } from 'ant-design-vue';

import PrefixLabelSelect from '#/components/Activiti/prefix-label-select';

import { BpmnStore } from '../../store';
import { CommonGroupProperties, DocumentGroupProperties } from '../common';

const CONDITION_TYPE_OPTIONS = [
  { label: '无', value: 'none' },
  { label: '表达式', value: 'expression' },
];

const FlowConditionProperties: GroupProperties = {
  name: '流转条件',
  properties: {
    conditionType: {
      component: PrefixLabelSelect,
      getValue(businessObject: ModdleElement): string {
        return businessObject.conditionExpression ? 'expression' : 'none';
      },
      options: CONDITION_TYPE_OPTIONS,
      prefixTitle: '条件类型',
      setValue(
        businessObject: ModdleElement,
        _key: string,
        value: string,
      ): () => void {
        if (value === 'none') {
          BpmnStore.getModeling().updateProperties(BpmnStore.getShape(), {
            conditionExpression: null,
          });
        } else if (!businessObject.conditionExpression) {
          const moddle = BpmnStore.getModeler().get('moddle');
          BpmnStore.getModeling().updateProperties(BpmnStore.getShape(), {
            conditionExpression: moddle.create('bpmn:FormalExpression', {
              body: '',
            }),
          });
        }
        return () => BpmnStore.refresh();
      },
    },
    'conditionExpression.body': {
      component: Input,
      getValue(businessObject: ModdleElement): string {
        return businessObject.conditionExpression?.body ?? '';
      },
      placeholder: String.raw`\${approved == true}`,
      predicate(businessObject: ModdleElement): boolean {
        return !!businessObject.conditionExpression;
      },
      setValue(
        businessObject: ModdleElement,
        _key: string,
        value: string,
      ): void {
        businessObject.conditionExpression.body = value;
        BpmnStore.getModeling().updateProperties(BpmnStore.getShape(), {
          conditionExpression: businessObject.conditionExpression,
        });
      },
      vSlots: {
        addonBefore: () => <span>表达式</span>,
      },
    },
  },
};

export default {
  'bpmn:SequenceFlow': [
    CommonGroupProperties,
    FlowConditionProperties,
    DocumentGroupProperties,
  ],
};
