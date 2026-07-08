import { describe, expect, it } from 'vitest';

import {
  getPageTotal,
  mapNoticeItems,
  mapTodoItems,
  resolveNoticeDetailUrl,
} from './headerNotification';

describe('header notification mapping', () => {
  it('maps user notices and preserves read state', () => {
    const items = mapNoticeItems({
      items: [
        {
          createTime: '2026-07-08 10:00:00',
          id: 1,
          readNotice: 0,
          title: '平台公告',
        },
        {
          createTime: '2026-07-08 11:00:00',
          id: 2,
          readNotice: 1,
          title: '已读公告',
        },
      ],
    });

    expect(items).toMatchObject([
      {
        extra: '未读',
        id: 1,
        isRead: false,
        title: '平台公告',
        type: 'notice',
      },
      { extra: '已读', id: 2, isRead: true, title: '已读公告', type: 'notice' },
    ]);
  });

  it('maps workflow todo tasks', () => {
    const items = mapTodoItems({
      items: [
        {
          createTime: '2026-07-08 12:00:00',
          instanceName: '请假审批',
          isSuspended: false,
          taskId: 'task-1',
          taskName: '部门审核',
        },
      ],
    });

    expect(items).toMatchObject([
      {
        description: '部门审核',
        extra: '待处理',
        id: 'task-1',
        isRead: false,
        title: '请假审批',
        type: 'todo',
      },
    ]);
  });

  it('reads totals from backend page response', () => {
    expect(getPageTotal({ items: [{ id: 1 }], total: 20 })).toBe(20);
    expect(getPageTotal({ data: [{ id: 1 }, { id: 2 }] })).toBe(2);
  });

  it('builds notice detail url from minio path and content path', () => {
    expect(
      resolveNoticeDetailUrl('/notice/detail.html', 'https://cdn.example.com'),
    ).toBe('https://cdn.example.com/notice/detail.html');
    expect(resolveNoticeDetailUrl('', 'https://cdn.example.com')).toBe('');
  });
});
