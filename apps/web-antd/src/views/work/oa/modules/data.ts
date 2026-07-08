import type { WorkbenchQuickNavItem, WorkbenchTodoItem } from '@vben/common-ui';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

function statusTag(isSuspended?: boolean) {
  return h(Tag, { color: isSuspended ? 'red' : 'green' }, () =>
    isSuspended ? '挂起' : '启用',
  );
}

export const tabOptions = [
  { key: 'need', label: '待办任务' },
  { key: 'launch', label: '发起任务' },
  { key: 'already', label: '参与任务' },
];

export const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#ff6b6b',
    icon: 'ion:calendar-outline',
    title: '请假',
    url: '/work/leave/undefined',
  },
  {
    color: '#e18525',
    icon: 'ion:grid-outline',
    title: '仪表盘',
    url: '/dashboard/analytics',
  },
  {
    color: '#00d8ff',
    icon: 'ion:layers-outline',
    title: '组件',
    url: '/demos/antd',
  },
  {
    color: '#1fdaca',
    icon: 'ion:settings-outline',
    title: '系统管理',
    url: '/index/system/user',
  },
  {
    color: '#3fb27f',
    icon: 'ion:key-outline',
    title: '权限管理',
    url: '/index/system/privilege',
  },
  {
    color: '#1677ff',
    icon: 'ion:bar-chart-outline',
    title: '图表',
    url: '/dashboard/analytics',
  },
];

export const flowTodoItems: WorkbenchTodoItem[] = [
  {
    completed: false,
    content: '优先处理待办流程中的审批任务，避免流程长时间停留。',
    date: '今日',
    title: '处理待办审批',
  },
  {
    completed: true,
    content: '复核本人发起流程的当前节点，及时补充审批材料。',
    date: '今日',
    title: '跟进发起流程',
  },
  {
    completed: false,
    content: '查看历史流程记录，确认审批意见和流程状态。',
    date: '本周',
    title: '查看历史流程',
  },
  {
    completed: false,
    content: '检查流程定义与表单配置，确保常用流程可正常发起。',
    date: '本周',
    title: '维护流程仓库',
  },
  {
    completed: false,
    content: '整理异常流程并通知相关处理人继续推进。',
    date: '本周',
    title: '跟进异常任务',
  },
];

export function getColumns(type: string): VxeTableGridOptions['columns'] {
  if (type === 'need') {
    return [
      { field: 'instanceName', minWidth: 180, title: '流程名称' },
      { field: 'taskName', minWidth: 160, title: '任务名称' },
      {
        field: 'departmentName',
        minWidth: 140,
        slots: {
          default: ({ row }) => row.instanceComment?.departmentName ?? '-',
        },
        title: '发起部门',
      },
      {
        field: 'userName',
        minWidth: 140,
        slots: {
          default: ({ row }) => row.instanceComment?.userName ?? '-',
        },
        title: '发起用户',
      },
      {
        field: 'isSuspended',
        minWidth: 100,
        slots: { default: ({ row }) => statusTag(row.isSuspended) },
        title: '状态',
      },
      { field: 'createTime', minWidth: 170, title: '创建时间' },
      { field: 'dueDate', minWidth: 170, title: '截至时间' },
    ];
  }

  if (type === 'launch') {
    return [
      { field: 'processDefinitionName', minWidth: 180, title: '流程定义名称' },
      { field: 'instanceName', minWidth: 180, title: '流程名称' },
      { field: 'taskName', minWidth: 160, title: '当前节点名称' },
      {
        field: 'statusName',
        minWidth: 120,
        slots: {
          default: ({ row }) => row.processVariables?.statusName ?? '-',
        },
        title: '审核状态',
      },
      {
        field: 'isSuspended',
        minWidth: 100,
        slots: { default: ({ row }) => statusTag(row.isSuspended) },
        title: '状态',
      },
      { field: 'startTime', minWidth: 170, title: '开始时间' },
      { field: 'endTime', minWidth: 170, title: '结束时间' },
    ];
  }

  return [
    { field: 'processDefinitionName', minWidth: 180, title: '流程定义名称' },
    { field: 'instanceName', minWidth: 180, title: '流程名称' },
    { field: 'taskName', minWidth: 160, title: '参与节点名称' },
    {
      field: 'statusName',
      minWidth: 120,
      slots: {
        default: ({ row }) => row.processVariables?.statusName ?? '-',
      },
      title: '流程状态',
    },
    { field: 'startTime', minWidth: 170, title: '开始时间' },
    { field: 'endTime', minWidth: 170, title: '结束时间' },
  ];
}
