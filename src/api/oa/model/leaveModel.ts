import { BasicFetchResult } from '/@/api/model/baseModel';

export interface LeaveEntity {
  startTime: String;
  endTime: String;
  day: Number;
  processInstanceId: String;
  state: Number;
  memo: String;
  userId: Number;
  userName: String;
  departmentId: Number;
  departmentName: String;
  createUserId: Number;
  createTime: String;
}

export type LeavePageResultModel = BasicFetchResult<LeaveEntity>;
