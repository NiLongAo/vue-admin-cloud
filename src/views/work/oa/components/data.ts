import { BasicColumn } from '@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { doFindUserNeedList, doFindUserLaunchList, doFindUserAlreadyList } from '@/api/oa/activiti';

//表格tabs
export const tabListTitle = [
  {
    key: 'need',
    tab: '代办任务',
  },
  {
    key: 'launch',
    tab: '发起任务',
  },
  {
    key: 'already',
    tab: '参与任务',
  },
];

//表格数据组装 代办-发起-已办
export interface TableItem {
  rowKey: string;
  api: (...arg: any) => Promise<any>;
  columns: BasicColumn[];
}

// 代办
const need: TableItem = {
  rowKey: 'taskId',
  api: doFindUserNeedList,
  columns: [
    {
      title: '流程名称',
      dataIndex: 'instanceName',
      width: 100,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      width: 100,
    },
    {
      title: '发起部门',
      dataIndex: 'instanceComment.departmentName',
      width: 100,
      customRender: ({ record }) => {
        return record.instanceComment.departmentName;
      },
    },
    {
      title: '发起用户',
      dataIndex: 'instanceComment.userId',
      width: 100,
      customRender: ({ record }) => {
        return record.instanceComment.userName;
      },
    },
    {
      title: '状态',
      dataIndex: 'isSuspended',
      width: 100,
      customRender: ({ record }) => {
        const { isSuspended } = (record as Recordable) || {};
        const status = !isSuspended;
        const color = status ? 'green' : 'red';
        const text = status ? '启用' : '挂起';
        return h(Tag, { color: color }, () => text);
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 100,
    },
    {
      title: '截至时间',
      dataIndex: 'dueDate',
      width: 100,
    },
  ],
};

// 发起
const launch: TableItem = {
  rowKey: 'instanceId',
  api: doFindUserLaunchList,
  columns: [
    {
      title: '流程定义名称',
      dataIndex: 'processDefinitionName',
      width: 100,
    },
    {
      title: '流程名称',
      dataIndex: 'instanceName',
      width: 100,
    },
    {
      title: '当前节点名称',
      dataIndex: 'taskName',
      width: 100,
    },
    {
      title: '审核状态',
      dataIndex: 'statusName',
      customRender: ({ record }) => {
        return record.processVariables.statusName;
      },
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'isSuspended',
      width: 100,
      customRender: ({ record }) => {
        const { isSuspended } = (record as Recordable) || {};
        const status = !isSuspended;
        const color = status ? 'green' : 'red';
        const text = status ? '启用' : '挂起';
        return h(Tag, { color: color }, () => text);
      },
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 100,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 100,
    },
  ],
};

// 已办
const already: TableItem = {
  rowKey: 'historicInstanceId',
  api: doFindUserAlreadyList,
  columns: [
    {
      title: '流程定义名称',
      dataIndex: 'processDefinitionName',
      width: 100,
    },
    {
      title: '流程名称',
      dataIndex: 'instanceName',
      width: 100,
    },
    {
      title: '参与节点名称',
      dataIndex: 'taskName',
      width: 100,
    },
    {
      title: '流程状态',
      dataIndex: 'statusName',
      customRender: ({ record }) => {
        return record.processVariables.statusName;
      },
      width: 100,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 100,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 100,
    },
  ],
};

export const tableDate: Record<string, TableItem> = { need, launch, already };

// 快捷导航设置
interface NavItem {
  title: string;
  icon: string;
  color: string;
  url?: string;
}

export const navItems: NavItem[] = [
  {
    title: '请假',
    icon: 'flat-color-icons:leave',
    color: '#1fdaca',
    url: '/work/leave/' + undefined,
  },
  {
    title: '仪表盘',
    icon: 'ion:grid-outline',
    color: '#bf0c2c',
  },
  {
    title: '组件',
    icon: 'ion:layers-outline',
    color: '#e18525',
  },
  {
    title: '系统管理',
    icon: 'ion:settings-outline',
    color: '#3fb27f',
  },
  {
    title: '权限管理',
    icon: 'ion:key-outline',
    color: '#4daf1bc9',
  },
  {
    title: '图表',
    icon: 'ion:bar-chart-outline',
    color: '#00d8ff',
  },
];
