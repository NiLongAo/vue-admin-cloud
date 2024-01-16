import { defHttp } from '@/utils/http/axios';

enum Api {
  //获取语音对讲推流地址
  findAudioPushPath = '/webapi/video/audio/push/audio_push_path',
  //语音广播命令
  broadcast = '/webapi/video/audio/push/broadcast',
}

export function doAudioPushPath(params: Recordable) {
  return defHttp.get({ url: Api.findAudioPushPath, params });
}

export function doPlayBroadcast(params: Recordable) {
  return defHttp.get({ url: Api.broadcast, params });
}
