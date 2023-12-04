import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export interface MobileMessageTemplateModel {
  // 编号
  id: number;
  // 短信配置编号
  configId: number;
  // 编码
  code: string;
  // 类型
  type: number;
  // 标题
  title: string;
  // 内容
  content: string;
  // 接收人
  receiver: string;
  // 变量
  variable: string;
}

/**
 * 查询参数类型
 */
export type MobileMessageTemplateParams = BasicPageParams;

export type MobileMessageTemplatePageResultModel = BasicFetchResult<MobileMessageTemplateModel>;
