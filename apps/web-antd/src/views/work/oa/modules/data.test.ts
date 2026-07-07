import { describe, expect, it } from 'vitest';

import { flowTodoItems, quickNavItems, tabOptions } from './data';

describe('work oa dashboard data', () => {
  it('uses the workflow tabs shown on the page', () => {
    expect(tabOptions.map((item) => item.label)).toEqual([
      '待办任务',
      '发起任务',
      '参与任务',
    ]);
  });

  it('provides the six workspace-style quick navigation entries', () => {
    expect(quickNavItems).toHaveLength(6);
    expect(quickNavItems.map((item) => item.title)).toEqual([
      '请假',
      '仪表盘',
      '组件',
      '系统管理',
      '权限管理',
      '图表',
    ]);
    expect(quickNavItems.every((item) => item.icon && item.url)).toBe(true);
  });

  it('provides workflow todo items for the right sidebar', () => {
    expect(flowTodoItems).toHaveLength(5);
    expect(flowTodoItems[0]).toMatchObject({
      completed: false,
      title: '处理待办审批',
    });
  });
});
