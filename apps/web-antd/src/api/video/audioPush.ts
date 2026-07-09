import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

enum Api {
  broadcast = '/webapi/video/audio/push/broadcast',
  findAudioPushPath = '/webapi/video/audio/push/audio_push_path',
  stopAudioPush = '/webapi/video/audio/push/stop_audio_push',
}

export function doAudioPushPath(params: Recordable<any>) {
  return requestClient.get<string>(Api.findAudioPushPath, { params });
}

export function doPlayBroadcast(params: Recordable<any>) {
  return requestClient.get(Api.broadcast, { params });
}

export function doStopAudioPush(params: Recordable<any>) {
  return requestClient.get(Api.stopAudioPush, { params });
}
