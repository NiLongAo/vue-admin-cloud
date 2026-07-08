import type { ModdleElement } from '../type';

export const TaskNameMapping: Record<string, string> = {
  'bpmn:BusinessRuleTask': '业务规则任务',
  'bpmn:CallActivity': '调用活动',
  'bpmn:ManualTask': '手工任务',
  'bpmn:ReceiveTask': '接收任务',
  'bpmn:ScriptTask': '脚本任务',
  'bpmn:SendTask': '发送任务',
  'bpmn:ServiceTask': '服务任务',
  'bpmn:Task': '任务',
  'bpmn:UserTask': '用户任务',
};

const TypeNameMapping: Record<string, string> = {
  ...TaskNameMapping,
  'bpmn:EndEvent': '结束事件',
  'bpmn:ExclusiveGateway': '排他网关',
  'bpmn:InclusiveGateway': '包容网关',
  'bpmn:ParallelGateway': '并行网关',
  'bpmn:Process': '流程',
  'bpmn:SequenceFlow': '连线',
  'bpmn:StartEvent': '开始事件',
};

export function resolveTypeName(element: ModdleElement) {
  return TypeNameMapping[element.$type] ?? element.$type ?? '元素';
}
