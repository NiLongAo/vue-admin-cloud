import { BasicFetchResult } from '/@/api/model/baseModel';

export interface LeaveEntity {
  startTime: string;
  endTime: string;
  day: number;
  processInstanceId: string;
  state: number;
  memo: string;
  userId: number;
  userName: string;
  departmentId: number;
  departmentName: string;
  createUserId: number;
  createTime: string;
}

export type LeavePageResultModel = BasicFetchResult<LeaveEntity>;
