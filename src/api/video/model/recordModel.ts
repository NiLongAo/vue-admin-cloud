import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';
/**
 * @description: 录像信息
 */
interface RecordInfo {
  //设备国标编号
  deviceId:string;
  //设备通道编号
  channelId:string;
  //设备mn码
  sn:string;
  name:string;
  sumNum:number;
  count:number;
  //录像记录信息
  recordList:Array<RecordItem>;
}

interface RecordItem {
  //设备国标编号
  deviceId:string;
  name:string;
  filePath?:string;
  fileSize?:string;
  address?:string;
  startTime:string;
  endTime:string;
  secrecy?:number;
  type?:string;
  recorderId:string;
}



export{ type RecordInfo,type RecordItem,type BasicPageParams,type BasicFetchResult}