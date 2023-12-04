import { defHttp } from '@/utils/http/axios';
import {
  PublicNoticePageResultModel,
  PublicNoticeParams,
  PublicNoticeEntity,
} from './model/publicNoticeModel';
/**
 * 平台通知公告相关接口
 */
enum Api {
  //获取分页信息
  page = '/webapi/notice/public_notice/page',
  //获取用户分页信息
  userPage = '/webapi/notice/public_notice/user_page',
  //新增平台通知公告
  insert = '/webapi/notice/public_notice/insert',
  //修改平台通知公告
  update = '/webapi/notice/public_notice/update',
  //删除平台通知公告
  remove = '/webapi/notice/public_notice/remove',
  //根据编号查询平台通知公告信息
  detail = '/webapi/notice/public_notice/detail',
  //用户查看平台通知公告并标记已读
  userReadNoticeDetail = '/webapi/notice/public_notice/user_read_notice_detail',
}

export function getPublicNoticePage(params: PublicNoticeParams) {
  return defHttp.post<PublicNoticePageResultModel>({
    url: Api.page,
    params,
  });
}

export function getUserPublicNoticePage(params: PublicNoticeParams) {
  return defHttp.post<PublicNoticePageResultModel>({
    url: Api.userPage,
    params,
  });
}

export function doPublicNoticeInsert(params: PublicNoticeEntity) {
  return defHttp.post({ url: Api.insert, params });
}

export function doPublicNoticeUpdate(params: PublicNoticeEntity) {
  return defHttp.post({ url: Api.update, params });
}

export function doPublicNoticeRemove(params: Recordable) {
  return defHttp.get({ url: Api.remove, params });
}

export function doPublicNoticeDetail(params: Recordable) {
  return defHttp.get<PublicNoticeEntity>({ url: Api.detail, params });
}

export function doUserReadNoticeDetail(params: Recordable) {
  return defHttp.get<PublicNoticeEntity>({ url: Api.userReadNoticeDetail, params });
}
