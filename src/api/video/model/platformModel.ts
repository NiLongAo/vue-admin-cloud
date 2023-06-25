import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';
/**
 * @description: 平台信息
 */
export interface PlatformEntity {
  /**
   * 主键
   */
  id:number;
  /**
   * 是否启用
   */
  enable:number;
  /**
   * 名称
   */
  name:string;
  /**
   * SIP服务国标编码
   */
  serverGbId:string;
  /**
   * SIP服务国标域
   */
  serverGbDomain:string;
  /**
   * SIP服务IP
   */
  serverIp:string;
  /**
   * SIP服务端口
   */
  serverPort:number;
  /**
   * 设备国标编号
   */
  deviceGbId:string;
  /**
   * 设备ip
   */
  deviceIp:string;
  /**
   * 设备端口
   */
  devicePort:number;
  /**
   * SIP认证用户名
   */
  username:string;
   /**
   * SIP认证密码
   */
   password:string;
  /**
   * 注册周期 (秒)
   */
  expires:number;
  /**
   * 心跳周期(秒)
   */
  keepTimeout:number;
  /**
   * 传输协议 1.UDP 2.TCP
   */
  transport:number;
  /**
   * 字符集, 1.UTF-8 2.GB2312
   */
  characterSet:number;
  /**
   * 默认目录Id,自动添加的通道多放在这个目录下
   */
  catalogId:string;
  /**
   * 目录分组-每次向上级发送通道信息时单个包携带的通道数量，取值1,2,4,8
   */
  catalogGroup:number;
  /**
   * 是否允许云台控制
   */
  ptz:number;
  /**
   * RTCP流保活
   */
  rtcp:number;
  /**
   * 在线状态
   */
  status:number;
  /**
   * 点播未推流的设备时是否使用redis通知拉起
   */
  startOfflinePush:number;
   /**
   * 行政区划
   */
   administrativeDivision:string;
    /**
   * 树类型 国标规定了两种树的展现方式 216.行政区划：CivilCode 215.业务分组:BusinessGroup
   */
    treeType:number;
   /**
   * 是否作为消息通道 1.是 0.否
   */
   asMessageChannel:number;

}
/**
 * 查询参数类型
 */
export type PlatformParams = BasicPageParams;

export type PlatformPageResultModel = BasicFetchResult<PlatformEntity>;