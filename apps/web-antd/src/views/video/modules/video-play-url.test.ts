import { describe, expect, it } from 'vitest';

import {
  buildVideoPlayOptions,
  buildVideoPlayUrl,
  getDefaultStreamPlayType,
} from './video-play-url';

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

  it('builds non-ssl stream options from the legacy play result shape', () => {
    const options = buildVideoPlayOptions({
      auth: 'auth token',
      flv: { url: 'http://example.com/live.flv' },
      rtc: { url: 'http://example.com/rtc' },
      sslStatus: 0,
      ts: { url: 'http://example.com/live.ts' },
      wsFlv: { url: 'ws://example.com/live.flv' },
      wsTs: { url: 'ws://example.com/live.ts' },
    });

    expect(options.streamMap).toEqual({
      flv: {
        label: 'FLV地址',
        value: 'http://example.com/live.flv?token=auth%20token',
      },
      ts: {
        label: 'TS地址',
        value: 'http://example.com/live.ts?token=auth%20token',
      },
      wsFlv: {
        label: 'WS-FLV地址',
        value: 'ws://example.com/live.flv?token=auth%20token',
      },
      wsTs: {
        label: 'WS-TS地址',
        value: 'ws://example.com/live.ts?token=auth%20token',
      },
    });
    expect(options.zlmRtcUrl).toEqual({
      label: 'RTC地址',
      value: 'http://example.com/rtc?token=auth%20token',
    });
  });

  it('builds ssl stream options from https and wss urls', () => {
    const options = buildVideoPlayOptions({
      httpsFlv: { url: 'https://example.com/live.flv' },
      httpsTs: { url: 'https://example.com/live.ts' },
      rtcs: { url: 'https://example.com/rtc' },
      sslStatus: 1,
      token: 'video-token',
      wssFlv: { url: 'wss://example.com/live.flv' },
      wssTs: { url: 'wss://example.com/live.ts' },
    });

    expect(options.streamMap.wsFlv?.value).toBe(
      'wss://example.com/live.flv?token=video-token',
    );
    expect(options.streamMap.flv?.value).toBe(
      'https://example.com/live.flv?token=video-token',
    );
    expect(options.streamMap.wsTs?.value).toBe(
      'wss://example.com/live.ts?token=video-token',
    );
    expect(options.streamMap.ts?.value).toBe(
      'https://example.com/live.ts?token=video-token',
    );
    expect(options.zlmRtcUrl?.value).toBe(
      'https://example.com/rtc?token=video-token',
    );
  });

  it('uses the login token when the play result has no auth token', () => {
    const options = buildVideoPlayOptions(
      {
        sslStatus: 0,
        wsFlv: { url: 'ws://example.com/live.flv' },
      },
      'login-token',
    );

    expect(options.streamMap.wsFlv?.value).toBe(
      'ws://example.com/live.flv?token=login-token',
    );
  });

  it('prefers the play result token over the login token', () => {
    const options = buildVideoPlayOptions(
      {
        auth: 'stream-token',
        sslStatus: 0,
        wsFlv: { url: 'ws://example.com/live.flv' },
      },
      'login-token',
    );

    expect(options.streamMap.wsFlv?.value).toBe(
      'ws://example.com/live.flv?token=stream-token',
    );
  });

  it('prefers wsFlv as the default stream play type', () => {
    expect(
      getDefaultStreamPlayType({
        flv: { label: 'FLV地址', value: 'http://example.com/live.flv' },
        wsFlv: { label: 'WS-FLV地址', value: 'ws://example.com/live.flv' },
      }),
    ).toBe('wsFlv');
  });

  it('falls back to the first available stream play type', () => {
    expect(
      getDefaultStreamPlayType({
        ts: { label: 'TS地址', value: 'http://example.com/live.ts' },
      }),
    ).toBe('ts');
  });
});
