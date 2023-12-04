import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description: 拉流信息
 */
export interface ProxyEntity {
  /**
   * 编号
   */
  id:number;
  /**
   * 类型
   */
  type:number;
  /**
   * 应用名
   */
  app:string;
  /**
   * 流id
   */
  stream:string;
  /**
   * 名称
   */
  name:string;
  /**
   * 状态
   */
  status:number;
  /**
   * 使用的流媒体ID
   */
  mediaServerId:string;
  /**
   * 拉流地址
   */
  url:string;
  /**
   * 拉流地址
   */
  srcUrl:string;
  /**
   * 目标地址
   */
  dstUrl:string;
  /**
   * 超时时间
   */
  timeoutMs:number;
  /**
   * ffmpeg模板KEY
   */
  ffmpegCmdKey:string;
  /**
   * rtsp拉流时，拉流方式，0：tcp，1：udp，2：组播
   */
  rtpType:number;
  /**
   * 是否启用
   */
  enable:number;
  /**
   * 是否启用音频
   */
  enableAudio:number;
  /**
   * 是否启用MP4
   */
  enableMp4:number;
  /**
   * 是否 无人观看时删除
   */
  enableRemoveNoneReader:number;
  /**
   * 是否 无人观看时自动停用
   */
  enableDisableNoneReader:number;
  /**
   * 国标流编号
   */
  gbStreamId?:number;
  /**
   * 国标ID
   */
  gbId?:string;
  /**
   * 经度
   */
  longitude?:number;
  /**
   * 纬度
   */
  latitude?:number;
}

/**
 * 查询参数类型
 */
export type ProxyParams = BasicPageParams;

export type ProxyPageResultModel = BasicFetchResult<ProxyEntity>;