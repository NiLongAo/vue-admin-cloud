import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

/**
 * 查询参数类型
 */
export type PublicNoticeParams = BasicPageParams;
/**
 * 分页查询参数
 */
export type PublicNoticePageResultModel = BasicFetchResult<PublicNoticeParams>;

/**
 * @description: 平台通知公告
 */
export interface PublicNoticeEntity {
  //公告编号
  id: number;
  //通知类型
  noticeType: number;
  //标题
  title: string;
  //内容
  content: string;
  //公告开始时间
  beginTime: string;
  //公告结束时间
  endTime: string;
  //状态 1正常,2已过期
  status: number;
  //创建时间
  createTime: string;
}
