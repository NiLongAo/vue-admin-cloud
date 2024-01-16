import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

/**
 * @description: 流媒体相关信息
 */
export interface MediaServerEntity {
  /**
   * 主键
   */
  id: string;
  /**
   * IP
   */
  ip: string;
  /**
   * hook使用的IP（zlm访问 使用的IP）
   */
  sslStatus: number;
  /**
   * hook使用的IP（zlm访问 使用的IP）
   */
  hookIp: string;
  /**
   * SDP IP
   */
  sdpIp: string;
  /**
   * 流IP
   */
  streamIp: string;
  /**
   * HTTP端口
   */
  httpPort: number;
  /**
   * HTTPS端口
   */
  httpSslPort: number;
  /**
   * RTMP端口
   */
  rtmpPort: number;
  /**
   * RTMPS端口
   */
  rtmpSslPort: number;
  /**
   * RTP收流端口（单端口模式有用）
   */
  rtpProxyPort: number;
  /**
   * RTSP端口
   */
  rtspPort: number;
  /**
   * RTSPS端口
   */
  rtspSslPort: number;
  /**
   * 是否开启自动配置ZLM
   */
  autoConfig: number;
  /**
   * ZLM鉴权参数
   */
  secret: string;
  /**
   * 是否使用多端口模式
   */
  rtpEnable: number;
  /**
   * 状态
   */
  status: number;
  /**
   * 多端口RTP收流端口范围
   */
  rtpPortRange: string;
  /**
   * assist服务端口
   */
  recordAssistPort: number;
  /**
   * 是否是默认ZLM
   */
  defaultServer: number;
  /**
   * keepalive hook触发间隔,单位秒
   */
  hookAliveInterval: number;
}
/**
 * 查询参数类型
 */
export type MediaServerParams = BasicPageParams;

export type MediaServerPageResultModel = BasicFetchResult<MediaServerEntity>;
