import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description: 拉流信息
 */
export interface PushEntity {
  /**
   * 编号
   */
  id: number;
  /**
   * 应用名
   */
  app: string;
  /**
   * 流id
   */
  stream: string;
  /**
   * 观看总人数，包括hls/rtsp/rtmp/http-flv/ws-flv
   */
  totalReaderCount: string;
  /**
   * 产生源类型 unknown = 0,rtmp_push=1,rtsp_push=2,rtp_push=3,pull=4,ffmpeg_pull=5,mp4_vod=6,device_chn=7
   */
  originType: number;
  /**
   * 产生源类型的字符串描述
   */
  originTypeStr: string;
  /**
   * 存活时间，单位秒
   */
  aliveSecond: number;
  /**
   * 使用的流媒体ID
   */
  mediaServerId: string;
  /**
   * 使用的服务ID
   */
  serverId: string;
  /**
   * 推流时间
   */
  pushTime: string;
  /**
   * 状态
   */
  status: number;
  /**
   * 是否正在推流
   */
  pushIng: number;
  /**
   * 是否自己平台的推流
   */
  onSelf: number;
  /**
   * 国标流编号
   */
  gbStreamId?: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 国标ID
   */
  gbId?: string;
  /**
   * 经度
   */
  longitude?: number;
  /**
   * 纬度
   */
  latitude?: number;
}

/**
 * 查询参数类型
 */
export type PushParams = BasicPageParams;

export type PushPageResultModel = BasicFetchResult<PushEntity>;
