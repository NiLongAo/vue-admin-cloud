import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

//头部数据统计
export interface StatsItem {
  userNeedCount: number;
  userLaunchCount: number;
  userAlreadyCount: number;
  totalNeedCount: number;
  totalAlreadyCount: number;
}

/**
 * @description: 用户待办事项
 */
export interface ActivitiUserNeedEntity {
  //流程实例编号
  instanceId: string;
  //流程实例名称
  instanceName: string;
  //是否挂起
  isSuspended: boolean;
  //任务编号
  taskId: string;
  //任务名称编号
  taskName: string;
  //待办人编号
  assignee: string;
  //流程组合编号
  businessKey: string;
  //流程变量
  processVariables: Recordable;
  //流程定义编号
  processDefinitionId: string;
  //节点参数
  tackComment: Recordable;
  //实例参数
  instanceComment: Recordable;
  //创建时间
  createTime: string;
  //领取任务时间
  claimTime: string;
  //截至时间
  dueDate: string;
}

/**
 * @description: 用户发起事项
 */
export interface ActivitiUserLaunchEntity {
  //流程实例编号
  instanceId: string;
  //流程实例名称
  instanceName: string;
  //任务编号
  taskId: string;
  //任务名称编号
  taskName: string;
  //节点参数
  tackComment: Recordable;
  //实例参数
  instanceComment: Recordable;
  //流程定义编号
  processDefinitionId: string;
  //流程定义名称
  processDefinitionName: string;
  //流程组合编号
  businessKey: string;
  //开始时间
  startTime: string;
  //结束时间
  endTime: string;
}

/**
 * @description: 用户已办事项
 */
export interface ActivitiUserAlreadyEntity {
  //流程实例编号
  instanceId: string;
  //流程实例名称
  instanceName: string;
  //任务编号
  taskId: string;
  //任务名称编号
  taskName: string;
  //流程变量
  processVariables: Recordable;
  //流程定义编号
  processDefinitionId: string;
  //流程定义名称
  processDefinitionName: string;
  //节点参数
  tackComment: Recordable;
  //实例参数
  instanceComment: Recordable;
  //流程组合编号
  businessKey: string;
  //开始时间
  startTime: string;
  //结束时间
  endTime: string;
}

/**
 * @description: 流程部署
 */
export interface ActivitiRepositoryEntity {
  //流程部署id
  id: string;
  //流程部署实例名称
  deploymentName: string;
  //流程部署实例key
  key: string;
  //流程部署实例版本
  version: string;
  //实例Id
  deploymentId: string;
  //流程实例是否挂起
  isSuspended: string;
  //资源名称
  diagramResourceName: string;
}

/**
 * 查询参数类型
 */
export type ActivitiParams = BasicPageParams;

export type ActivitiUserNeedPageResultModel = BasicFetchResult<ActivitiUserNeedEntity>;
export type ActivitiUserLaunchPageResultModel = BasicFetchResult<ActivitiUserLaunchEntity>;
export type ActivitiUserAlreadyPageResultModel = BasicFetchResult<ActivitiUserAlreadyEntity>;
export type ActivitiRepositoryPageResultModel = BasicFetchResult<ActivitiRepositoryEntity>;
