import type { PublicNoticeEntity } from '#/api/notice/publicNotice';
import type { ActivitiUserNeedEntity } from '#/api/oa/activiti';

export type HeaderNotificationType = 'message' | 'notice' | 'todo';

export interface HeaderNotificationItem {
  color?: string;
  date?: string;
  description?: string;
  extra?: string;
  id: number | string;
  isRead?: boolean;
  raw?: unknown;
  title: string;
  type: HeaderNotificationType;
}

export function getPageItems<T>(result: any): T[] {
  return (result?.items ?? result?.data ?? result?.records ?? []) as T[];
}

export function getPageTotal(result: any): number {
  const items = getPageItems(result);
  return Number(result?.total ?? result?.totalCount ?? items.length ?? 0);
}

export function mapNoticeItems(result: any): HeaderNotificationItem[] {
  return getPageItems<PublicNoticeEntity>(result).map((item) => ({
    color: Number(item.readNotice) === 1 ? 'blue' : 'gold',
    date: item.createTime,
    extra: Number(item.readNotice) === 1 ? '已读' : '未读',
    id: item.id ?? item.title ?? '',
    isRead: Number(item.readNotice) === 1,
    raw: item,
    title: item.title ?? '未命名公告',
    type: 'notice',
  }));
}

export function mapTodoItems(result: any): HeaderNotificationItem[] {
  return getPageItems<ActivitiUserNeedEntity>(result).map((item) => ({
    color: item.isSuspended ? 'red' : 'green',
    date: item.createTime,
    description: item.taskName,
    extra: item.isSuspended ? '已挂起' : '待处理',
    id: item.taskId ?? item.instanceId ?? item.instanceName ?? '',
    isRead: false,
    raw: item,
    title: item.instanceName ?? item.taskName ?? '未命名待办',
    type: 'todo',
  }));
}

export function resolveNoticeDetailUrl(
  content?: null | string,
  basePath?: null | string,
): string {
  if (!content) return '';
  return `${basePath ?? ''}${content}`;
}
