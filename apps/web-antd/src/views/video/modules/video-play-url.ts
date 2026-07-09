import type { VideoPlayResult } from '#/api/video/play';

export type StreamPlayType = 'flv' | 'ts' | 'wsFlv' | 'wsTs';

export interface VideoPlayOption {
  label: string;
  value: string;
}

export type VideoStreamMap = Partial<Record<StreamPlayType, VideoPlayOption>>;

export function buildVideoPlayUrl(url?: string, token?: null | string) {
  if (!url || !token) {
    return url || '';
  }
  return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}`;
}

function toOption(label: string, url?: string, token?: null | string) {
  const value = buildVideoPlayUrl(url, token);
  return value ? { label, value } : undefined;
}

export function buildVideoPlayOptions(
  data?: VideoPlayResult,
  fallbackToken?: null | string,
) {
  const token = data?.auth || data?.token || fallbackToken;
  const isSsl = data?.sslStatus !== 0;
  const streamMap: VideoStreamMap = {};

  const flv = toOption(
    'FLV地址',
    isSsl ? data?.httpsFlv?.url : data?.flv?.url,
    token,
  );
  const wsFlv = toOption(
    'WS-FLV地址',
    isSsl ? data?.wssFlv?.url : data?.wsFlv?.url,
    token,
  );
  const ts = toOption(
    'TS地址',
    isSsl ? data?.httpsTs?.url : data?.ts?.url,
    token,
  );
  const wsTs = toOption(
    'WS-TS地址',
    isSsl ? data?.wssTs?.url : data?.wsTs?.url,
    token,
  );

  if (flv) {
    streamMap.flv = flv;
  }
  if (wsFlv) {
    streamMap.wsFlv = wsFlv;
  }
  if (ts) {
    streamMap.ts = ts;
  }
  if (wsTs) {
    streamMap.wsTs = wsTs;
  }

  return {
    streamMap,
    zlmRtcUrl: toOption(
      'RTC地址',
      isSsl ? data?.rtcs?.url : data?.rtc?.url,
      token,
    ),
  };
}

export function getDefaultStreamPlayType(streamMap: VideoStreamMap) {
  if (streamMap.wsFlv?.value) {
    return 'wsFlv';
  }
  return Object.keys(streamMap)[0] as StreamPlayType | undefined;
}
