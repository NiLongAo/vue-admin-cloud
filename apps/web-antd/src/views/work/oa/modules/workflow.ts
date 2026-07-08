import type { Recordable } from '@vben/types';

import { OAIndex } from '#/api/oa/activiti';

export type WorkflowTabKey = 'already' | 'launch' | 'need';
export type WorkflowMode = '1' | '2';

interface WorkflowPathRecord {
  businessKey?: string;
  mode: WorkflowMode;
  processDefinitionId?: string;
  taskId?: string;
}

export function buildWorkflowBusinessPath(record: WorkflowPathRecord) {
  const key = record.processDefinitionId?.split(':')?.[0];
  if (!key) {
    return undefined;
  }

  const basePath = OAIndex[key as keyof typeof OAIndex];
  if (!basePath) {
    return undefined;
  }

  const taskSuffix = record.taskId ? `:${record.taskId}` : '';
  return `${basePath}${record.businessKey ?? 'undefined'}:${record.mode}${taskSuffix}`;
}

export function getWorkflowKeyField(tabKey: string) {
  if (tabKey === 'need') {
    return 'taskId';
  }
  if (tabKey === 'already') {
    return 'historicInstanceId';
  }
  return 'instanceId';
}

export function canClaimTask(row: Recordable<any>) {
  return row.assignee === null || row.assignee === undefined;
}

export function canSuspendLaunchProcess(row: Recordable<any>) {
  return row.processVariables?.status === 1;
}

export function canDeleteLaunchProcess(row: Recordable<any>) {
  return row.processVariables?.status === 1;
}
