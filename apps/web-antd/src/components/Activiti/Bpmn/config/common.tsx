import type { ModdleElement } from '../type';
import type { GroupProperties, PropertiesMap } from './index';

import type { FieldDefine } from '#/components/Activiti/dynamic-binder';

import { Input } from 'ant-design-vue';

import SubList from '#/components/Activiti/sublist/SubList.vue';

import { BpmnStore } from '../store';
import { TaskNameMapping } from './TypeNameMapping';

const addon = (label: string) => ({
  addonBefore: () => <span>{label}</span>,
});

const commonProperties: PropertiesMap<FieldDefine> = {
  id: {
    component: Input,
    placeholder: '节点编号',
    vSlots: addon('节点编号'),
    setValue(_sourceObject: ModdleElement, key: string, value: string) {
      const latestValue = value || ' ';
      BpmnStore.getModeling().updateProperties(BpmnStore.getShape(), {
        [key]: value ? latestValue.trim() : latestValue,
      });
    },
  },
  name: {
    component: Input,
    placeholder: '节点名称',
    vSlots: addon('节点名称'),
  },
};

export const CommonGroupProperties: GroupProperties = {
  name: '基础信息',
  properties: { ...commonProperties },
};

export const DocumentGroupProperties: GroupProperties = {
  name: '元素文档',
  properties: {
    'documentation.text': {
      component: Input.TextArea,
      getValue: (obj: { documentation?: Array<{ text: string }> }): string =>
        obj.documentation?.[0]?.text ?? '',
      placeholder: '元素文档',
      setValue(
        _businessObject: ModdleElement,
        _key: string,
        value: string,
      ): void {
        BpmnStore.createElement(
          'bpmn:Documentation',
          'documentation',
          { text: value },
          true,
        );
      },
    },
  },
};

const TYPE_OPTIONS = [
  { label: 'Java 类', value: 'class' },
  { label: '表达式', value: 'expression' },
  { label: '委托表达式', value: 'delegateExpression' },
];

const taskTags = Object.keys(TaskNameMapping);

export const getElementTypeListenerProperties = function (options: {
  eventOptions?: Array<{ label: string; value: string }>;
  name: string;
}): GroupProperties {
  const eventOptions = options.eventOptions || [
    { label: '开始', value: 'start' },
    { label: '结束', value: 'end' },
  ];
  return {
    name: options.name,
    properties: {
      'extensionElements.listeners': {
        columns: [
          {
            customRender: ({ index }: { index: number }) => `${index + 1}`,
            dataIndex: 'index',
            editRow: false,
            title: '序号',
            width: 60,
          },
          {
            dataIndex: 'event',
            editComponent: 'Select',
            editComponentProps: { options: eventOptions },
            title: '事件',
          },
          {
            dataIndex: 'type',
            editComponent: 'Select',
            editComponentProps: { options: TYPE_OPTIONS },
            title: '执行类型',
          },
          {
            dataIndex: 'content',
            title: '执行内容',
          },
        ],
        component: SubList,
        getValue: (
          businessObject: ModdleElement,
        ): Array<Record<string, string>> => {
          const listenerTagName = taskTags.includes(businessObject.$type)
            ? 'activiti:TaskListener'
            : 'activiti:ExecutionListener';
          return (
            businessObject?.extensionElements?.values
              ?.filter((item: ModdleElement) => item.$type === listenerTagName)
              ?.map((item: ModdleElement) => {
                const type = item.expression
                  ? 'expression'
                  : item.delegateExpression
                    ? 'delegateExpression'
                    : 'class';
                return {
                  content: item[type],
                  event: item.event,
                  type,
                };
              }) ?? []
          );
        },
        setValue(
          businessObject: ModdleElement,
          _key: string,
          value: Array<Record<string, string>>,
        ) {
          const moddle = BpmnStore.getModeler().get('moddle');
          const listenerTagName = taskTags.includes(businessObject.$type)
            ? 'activiti:TaskListener'
            : 'activiti:ExecutionListener';
          BpmnStore.updateExtensionElements(
            listenerTagName,
            value.map((item) =>
              moddle.create(listenerTagName, {
                event: item.event,
                [item.type || 'class']: item.content,
              }),
            ),
          );
        },
      },
    },
  };
};

export const ExtensionGroupProperties: GroupProperties = {
  name: '扩展属性',
  properties: {
    'extensionElements.properties': {
      columns: [
        {
          customRender: ({ index }: { index: number }) => `${index + 1}`,
          dataIndex: 'index',
          editRow: false,
          title: '序号',
          width: 60,
        },
        { dataIndex: 'name', title: '属性名' },
        { dataIndex: 'value', title: '属性值' },
      ],
      component: SubList,
      getValue: (
        businessObject: ModdleElement,
      ): Array<Record<string, string>> =>
        businessObject?.extensionElements?.values
          ?.find((item: ModdleElement) => item.$type === 'activiti:Properties')
          ?.values?.map((item: ModdleElement) => ({
            name: item.name,
            value: item.value,
          })) ?? [],
      setValue(
        _businessObject: ModdleElement,
        _key: string,
        value: Array<Record<string, string>>,
      ) {
        const moddle = BpmnStore.getModeler().get('moddle');
        const properties = moddle.create('activiti:Properties', {
          values: value.map((item) =>
            moddle.create('activiti:Property', {
              name: item.name,
              value: item.value,
            }),
          ),
        });
        BpmnStore.updateExtensionElements('activiti:Properties', properties);
      },
    },
  },
};

export const FormGroupProperties: GroupProperties = {
  name: '表单信息',
  properties: {
    formKey: {
      component: Input,
      placeholder: '表单 Key',
      vSlots: addon('表单 Key'),
    },
    'extensionElements.formProperty': {
      columns: [
        { dataIndex: 'id', title: '编码' },
        { dataIndex: 'type', title: '类型' },
        { dataIndex: 'name', title: '名称' },
      ],
      component: SubList,
      getValue: (
        businessObject: ModdleElement,
      ): Array<Record<string, string>> =>
        businessObject?.extensionElements?.values
          ?.filter(
            (item: ModdleElement) => item.$type === 'activiti:FormProperty',
          )
          ?.map((item: ModdleElement) => ({
            id: item.id,
            name: item.$attrs?.name,
            type: item.type,
          })) ?? [],
      setValue(
        _businessObject: ModdleElement,
        _key: string,
        value: Array<Record<string, string>>,
      ) {
        const moddle = BpmnStore.getModeler().get('moddle');
        BpmnStore.updateExtensionElements(
          'activiti:FormProperty',
          value.map((item) =>
            moddle.create('activiti:FormProperty', {
              id: item.id,
              name: item.name,
              type: item.type,
            }),
          ),
        );
      },
    },
  },
};
