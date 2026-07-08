import { describe, expect, it } from 'vitest';

import {
  buildWorkflowBusinessPath,
  canClaimTask,
  canDeleteLaunchProcess,
  canSuspendLaunchProcess,
  getWorkflowKeyField,
} from './workflow';

describe('workflow helpers', () => {
  it('builds business page paths with mode and task id', () => {
    expect(
      buildWorkflowBusinessPath({
        businessKey: '18',
        mode: '1',
        processDefinitionId: 'Leave:22:abc',
        taskId: 'task-1',
      }),
    ).toBe('/work/leave/18:1:task-1');
  });

  it('returns undefined when process definition key is unknown', () => {
    expect(
      buildWorkflowBusinessPath({
        businessKey: '18',
        mode: '2',
        processDefinitionId: 'Unknown:1:abc',
      }),
    ).toBeUndefined();
  });

  it('uses the correct row key for workflow tabs', () => {
    expect(getWorkflowKeyField('need')).toBe('taskId');
    expect(getWorkflowKeyField('launch')).toBe('instanceId');
    expect(getWorkflowKeyField('already')).toBe('historicInstanceId');
  });

  it('matches old workflow action visibility rules', () => {
    expect(canClaimTask({ assignee: null })).toBe(true);
    expect(canClaimTask({ assignee: '1' })).toBe(false);
    expect(canSuspendLaunchProcess({ processVariables: { status: 1 } })).toBe(
      true,
    );
    expect(canDeleteLaunchProcess({ processVariables: { status: 2 } })).toBe(
      false,
    );
  });
});
