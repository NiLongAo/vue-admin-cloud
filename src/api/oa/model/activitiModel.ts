import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

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
  //任务编号
  taskId: string;
  //任务名称
  name: string;
  //用户编号
  assignee: string;
  //流程实例编号
  instanceId: string;
  //流程定义编号
  processDefinitionId: string;
  //创建时间
  createTime: string;
  //接受时间
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
  //流程名称
  name: string;
  //流程定义名称
  processDefinitionName: string;
  //流程定义编号
  processDefinitionId: string;
  //源数据编号
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
  historicInstanceId: string;
  //任务名称
  name: string;
  //流程定义名称
  processDefinitionName: string;
  //流程定义编号
  processDefinitionId: string;
  //源数据编号
  businessKey: string;
  //开始时间
  startTime: string;
  //结束时间
  endTime: string;
}

/**
 * 查询参数类型
 */
export type ActivitiParams = BasicPageParams;

export type ActivitiUserNeedPageResultModel = BasicFetchResult<ActivitiUserNeedEntity>;
export type ActivitiUserLaunchPageResultModel = BasicFetchResult<ActivitiUserLaunchEntity>;
export type ActivitiUserAlreadyPageResultModel = BasicFetchResult<ActivitiUserAlreadyEntity>;
