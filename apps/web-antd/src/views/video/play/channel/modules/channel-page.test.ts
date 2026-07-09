import { describe, expect, it } from 'vitest';

import { normalizeDeviceChannelPageResult } from './channel-page';

describe('normalizeDeviceChannelPageResult', () => {
  it('normalizes direct array responses', () => {
    expect(
      normalizeDeviceChannelPageResult([{ channelId: '3402', name: '门口' }]),
    ).toEqual({
      items: [{ channelId: '3402', name: '门口' }],
      total: 1,
    });
  });

  it('normalizes legacy data array responses', () => {
    expect(
      normalizeDeviceChannelPageResult({
        data: [{ channelId: '3403', name: '大厅' }],
      }),
    ).toEqual({
      items: [{ channelId: '3403', name: '大厅' }],
      total: 1,
    });
  });

  it('keeps paged items responses', () => {
    expect(
      normalizeDeviceChannelPageResult({
        items: [{ channelId: '3404', name: '走廊' }],
        total: 12,
      }),
    ).toEqual({
      items: [{ channelId: '3404', name: '走廊' }],
      total: 12,
    });
  });
});
