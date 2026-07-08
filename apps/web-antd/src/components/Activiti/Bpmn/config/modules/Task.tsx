/* eslint-disable vue/multi-word-component-names */
import type { ModdleElement } from '../../type';
import type { GroupProperties } from '../index';

import type { FieldDefine } from '#/components/Activiti/dynamic-binder';

import { computed, reactive, toRaw } from 'vue';

import { Input } from 'ant-design-vue';

import { getChoiceUserPage } from '#/api/sys/user';
import PrefixLabelLinkageSelect from '#/components/Activiti/prefix-label-linkage-select';
import PrefixLabelNumBer from '#/components/Activiti/prefix-label-number';
import PrefixLabelSelect from '#/components/Activiti/prefix-label-select';
import { resolve } from '#/components/Activiti/utils/script-helper';

import { BpmnStore } from '../../store';
import {
  CommonGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
  FormGroupProperties,
  getElementTypeListenerProperties,
} from '../common';

const TASK_EVENT_OPTIONS = [
  { label: '创建', value: 'create' },
  { label: '签收', value: 'assignment' },
  { label: '完成', value: 'complete' },
  { label: '删除', value: 'delete' },
  { label: '全部', value: 'all' },
];

const TaskListenerProperties = getElementTypeListenerProperties({
  eventOptions: TASK_EVENT_OPTIONS,
  name: '任务监听器',
});

export const BpmnUserGroupProperties: GroupProperties = {
  name: '人员设置',
  properties: {
    assignee: {
      allowClear: true,
      api: getChoiceUserPage,
      bindTransformer: (
        sourceModel: unknown,
        bindKey: string,
        bindDefine: FieldDefine,
      ) =>
        reactive({
          bindKey,
          ...bindDefine,
          sourceModel,
          value: computed(() => {
            const val = bindDefine.getValue
              ? bindDefine.getValue(toRaw(sourceModel))
              : resolve(bindKey, sourceModel) || '';
            return Number.isNaN(Number.parseInt(val)) ? val : Number(val);
          }),
        }),
      component: PrefixLabelSelect,
      filterOption: false,
      isApi: true,
      labelField: 'userName',
      params: {
        pageNumber: 1,
        pageSize: 100,
      },
      prefixTitle: '处理人',
      resultField: 'data',
      searchName: 'search',
      showSearch: true,
      valueField: 'id',
    },
    candidateUsers: {
      component: PrefixLabelLinkageSelect,
      filterOption: false,
      getValue(businessObject: ModdleElement): string {
        return businessObject.candidateUsers;
      },
      multiple: true,
      prefixTitle: '候选人',
      showSearch: true,
    },
    collection: {
      component: PrefixLabelLinkageSelect,
      filterOption: false,
      getValue(businessObject: ModdleElement): string {
        return businessObject.loopCharacteristics?.collection ?? '';
      },
      multiple: true,
      predicate(businessObject: ModdleElement): boolean {
        return !!businessObject.loopCharacteristics;
      },
      prefixTitle: '参与人',
      setValue(
        businessObject: ModdleElement,
        _key: string,
        value: string,
      ): void {
        businessObject.loopCharacteristics.collection = value;
        BpmnStore.getModeling().updateProperties(BpmnStore.getShape(), {
          loopCharacteristics: businessObject.loopCharacteristics,
        });
      },
      showSearch: true,
    },
    elementVariable: {
      component: Input,
      getValue(businessObject: ModdleElement): string {
        return businessObject.loopCharacteristics?.elementVariable ?? '';
      },
      placeholder: '元素变量',
      predicate(businessObject: ModdleElement): boolean {
        return !!businessObject.loopCharacteristics;
      },
      setValue(
        businessObject: ModdleElement,
        _key: string,
        value: string,
      ): void {
        businessObject.loopCharacteristics.elementVariable = value;
        BpmnStore.getModeling().updateProperties(BpmnStore.getShape(), {
          loopCharacteristics: businessObject.loopCharacteristics,
        });
      },
      vSlots: {
        addonBefore: () => <span>元素变量</span>,
      },
    },
    loopCardinality: {
      component: PrefixLabelNumBer,
      getValue(businessObject: ModdleElement): string {
        return businessObject.loopCharacteristics?.loopCardinality?.body ?? '';
      },
      min: 0,
      precision: 0,
      predicate(businessObject: ModdleElement): boolean {
        return !!businessObject.loopCharacteristics;
      },
      prefixTitle: '循环数',
      setValue(
        businessObject: ModdleElement,
        _key: string,
        value: string,
      ): void {
        const moddle = BpmnStore.getModeler().get('moddle');
        businessObject.loopCharacteristics.loopCardinality = moddle.create(
          'bpmn:FormalExpression',
          { body: String(value) },
        );
        BpmnStore.getModeling().updateProperties(BpmnStore.getShape(), {
          loopCharacteristics: businessObject.loopCharacteristics,
        });
      },
    },
  },
};

const LOOP_OPTIONS = [
  { label: '无', value: 'Null' },
  { label: '并行多实例', value: 'Parallel' },
  { label: '串行多实例', value: 'Sequential' },
  { label: '循环', value: 'StandardLoop' },
];

const BaseTaskProperties: GroupProperties = {
  ...CommonGroupProperties,
  properties: {
    ...CommonGroupProperties.properties,
    loopCharacteristics: {
      component: PrefixLabelSelect,
      getValue(businessObject: ModdleElement): string {
        const loopCharacteristics = businessObject.loopCharacteristics;
        if (!loopCharacteristics) {
          return 'Null';
        }
        if (
          loopCharacteristics.$type === 'bpmn:MultiInstanceLoopCharacteristics'
        ) {
          return loopCharacteristics.isSequential ? 'Sequential' : 'Parallel';
        }
        return 'StandardLoop';
      },
      options: LOOP_OPTIONS,
      prefixTitle: '回路特性',
      setValue(
        _businessObject: ModdleElement,
        _key: string,
        value: string,
      ): () => void {
        const shape = BpmnStore.getShape();
        const modeling = BpmnStore.getModeling();
        switch (value) {
          case 'Null': {
            modeling.updateProperties(shape, { loopCharacteristics: null });
            break;
          }
          case 'StandardLoop': {
            BpmnStore.createElement(
              'bpmn:StandardLoopCharacteristics',
              'loopCharacteristics',
            );
            break;
          }
          default: {
            BpmnStore.createElement(
              'bpmn:MultiInstanceLoopCharacteristics',
              'loopCharacteristics',
              {
                isSequential: value === 'Sequential',
              },
            );
          }
        }
        return () => BpmnStore.refresh();
      },
    },
  },
};

const commonTaskGroups = [
  BaseTaskProperties,
  TaskListenerProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

export default {
  'bpmn:BusinessRuleTask': commonTaskGroups,
  'bpmn:CallActivity': commonTaskGroups,
  'bpmn:ManualTask': commonTaskGroups,
  'bpmn:ReceiveTask': commonTaskGroups,
  'bpmn:ScriptTask': commonTaskGroups,
  'bpmn:SendTask': commonTaskGroups,
  'bpmn:ServiceTask': commonTaskGroups,
  'bpmn:Task': commonTaskGroups,
  'bpmn:UserTask': [
    BaseTaskProperties,
    BpmnUserGroupProperties,
    TaskListenerProperties,
    FormGroupProperties,
    ExtensionGroupProperties,
    DocumentGroupProperties,
  ],
};
