import { defHttp } from '/@/utils/http/axios';
import {
  StatsItem,
  ActivitiParams,
  ActivitiUserNeedPageResultModel,
  ActivitiUserLaunchPageResultModel,
  ActivitiUserAlreadyPageResultModel,
  ActivitiRepositoryPageResultModel,
} from './model/activitiModel';

export enum OAIndex {
  Leave = '/work/leave/',
  Deploy = '/oa/deploy/',
}

enum Api {
  //获取当前用户待办事项
  statsUserOa = '/webapi/activiti/activiti/stats_user_oa',
  //获取当前用户待办事项
  findUserNeedList = '/webapi/activiti/activiti/find_user_need_list',
  //获取当前用户发起事项
  findUserLaunchList = '/webapi/activiti/activiti/find_user_launch_list',
  //获取当前用户已办事项
  findUserAlreadyList = '/webapi/activiti/activiti/find_user_already_list',
  //获取流程部署实例
  findRepositoryList = '/webapi/activiti/activiti/find_repository_list',
  //待办事项
  findNeedList = '/webapi/activiti/activiti/find_need_list',
  //历史记录
  findAlreadyList = '/webapi/activiti/activiti/find_already_list',
  //根据流程编号获取审批历史记录
  findHistoricalInstanceIdList = '/webapi/activiti/activiti/find_historical_instance_id_list',
  //获取流程定义 xml
  findRepositoryXml = '/webapi/activiti/activiti/find_repository_xml',
  //部署流程引擎实例(以参数传输方式)
  deployProcessParameter = '/webapi/activiti/activiti/deploy_process_parameter',
  //部署流程引擎实例(以文本传输方式)
  deployProcess = '/webapi/activiti/activiti/deploy_process',
  //删除流程引擎实例
  deleteProcess = '/webapi/activiti/activiti/delete_process',
  //完成任务
  complete = '/webapi/activiti/activiti/complete',
  //签收任务
  claim = '/webapi/activiti/activiti/claim',
  //任务跳转
  jump = '/webapi/activiti/activiti/jump',
  //挂起流程
  suspend = '/webapi/activiti/activiti/suspend',
  //挂起 - 激活 流程实例流程
  suspendedInstance = '/webapi/activiti/activiti/suspended_instance',
  //挂起 - 激活 流程定义
  suspendedProcessDefinition = '/webapi/activiti/activiti/suspended_process_definition',
  //驳回上一流程
  backProcess = '/webapi/activiti/activiti/back_process',
  //根据节点编号获取节点信息及实例信息
  findInstanceIdDetail = '/webapi/activiti/activiti/find_instance_id_detail',
  //根据流程实例Id,获取实时流程图片
  getFlowImgByInstanceId = '/webapi/activiti/activiti/get_flow_img_by_instance_id',
}

export function doStatsUserOa(params: Recordable) {
  return defHttp.get<StatsItem>({ url: Api.statsUserOa, params });
}
export function doFindUserNeedList(params: ActivitiParams) {
  return defHttp.post<ActivitiUserNeedPageResultModel>({ url: Api.findUserNeedList, params });
}
export function doFindUserLaunchList(params: ActivitiParams) {
  return defHttp.post<ActivitiUserLaunchPageResultModel>({ url: Api.findUserLaunchList, params });
}
export function doFindUserAlreadyList(params: ActivitiParams) {
  return defHttp.post<ActivitiUserAlreadyPageResultModel>({ url: Api.findUserAlreadyList, params });
}
export function doFindRepositoryList(params: ActivitiParams) {
  return defHttp.post<ActivitiRepositoryPageResultModel>({ url: Api.findRepositoryList, params });
}
export function doFindNeedList(params: ActivitiParams) {
  return defHttp.post<ActivitiUserNeedPageResultModel>({ url: Api.findNeedList, params });
}
export function doFindAlreadyList(params: ActivitiParams) {
  return defHttp.post<ActivitiUserAlreadyPageResultModel>({ url: Api.findAlreadyList, params });
}

export function doFindHistoricalInstanceIdList(params: Recordable) {
  return defHttp.get({ url: Api.findHistoricalInstanceIdList, params });
}
export function doFindRepositoryXml(params: Recordable) {
  return defHttp.get({ url: Api.findRepositoryXml, params });
}

export function doDeployProcessParameter(params: Recordable) {
  return defHttp.post({ url: Api.deployProcessParameter, params });
}
export function doDeployProcess(params: Recordable) {
  return defHttp.post({ url: Api.deployProcess, params });
}

export function doDeleteProcess(params: Recordable) {
  return defHttp.get({ url: Api.deleteProcess, params });
}

export function doComplete(params: Recordable) {
  return defHttp.post({ url: Api.complete, params });
}

export function doClaim(params: Recordable) {
  return defHttp.get({ url: Api.claim, params });
}

export function doJump(params: Recordable) {
  return defHttp.get({ url: Api.jump, params });
}

export function doSuspend(params: Recordable) {
  return defHttp.get({ url: Api.suspend, params });
}

export function doSuspendedInstance(params: Recordable) {
  return defHttp.get({ url: Api.suspendedInstance, params });
}
export function doSuspendedProcessDefinition(params: Recordable) {
  return defHttp.get({ url: Api.suspendedProcessDefinition, params });
}
export function doBackProcess(params: Recordable) {
  return defHttp.get({ url: Api.backProcess, params });
}
export function doFindInstanceIdDetail(params: Recordable) {
  return defHttp.get({ url: Api.findInstanceIdDetail, params });
}
export function doGetFlowImgByInstanceId(params: Recordable) {
  return defHttp.get({ url: Api.getFlowImgByInstanceId, params });
}
