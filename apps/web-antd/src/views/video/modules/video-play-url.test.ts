import { describe, expect, it } from 'vitest';

import { buildVideoPlayUrl } from './video-play-url';

describe('video play url', () => {
  it('does not append a token when no video token is provided', () => {
    expect(
      buildVideoPlayUrl('wss://www.nilongao.cn/video_server/cctv/6.live.flv'),
    ).toBe('wss://www.nilongao.cn/video_server/cctv/6.live.flv');
  });

  it('appends explicit video tokens', () => {
    expect(
      buildVideoPlayUrl(
        'wss://www.nilongao.cn/video_server/cctv/6.live.flv?existing=1',
        'token value',
      ),
    ).toBe(
      'wss://www.nilongao.cn/video_server/cctv/6.live.flv?existing=1&token=token%20value',
    );
  });
});
