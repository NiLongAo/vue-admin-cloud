// 妯″瀷鑺傜偣
import { UnwrapRef } from 'vue';

import Modeler from 'bpmn-js/lib/Modeler';

import { GroupProperties } from './config';

export interface BpmnState {
  /**
   * 褰撳墠娲诲姩鐨勮妭鐐?   */
  activeElement: any;
  /**
   * 褰撳墠娲诲姩鑺傜偣鐨勪笟鍔″璞?   */
  businessObject: any;
  /**
   * 鏄惁娲诲姩
   */
  isActive: boolean;

  /**
   * 褰撳墠娲诲姩鑺傜偣鐨勭粦瀹氬瓧娈甸厤缃?   */
  activeBindDefine: Array<GroupProperties> | never | null;
}

export interface ModdleElement {
  id: string;
  $type: string;
  value?: [ModdleElement];
  $attrs: { [key: string]: any };

  [key: string]: any;
}

/**
 * 娴佺▼绠＄悊鐨勪笂涓嬫枃
 */
export interface BpmnContext {
  /**
   * 娴佺▼璁捐鍣?   */
  modeler: any;
  /**
   * 鐘舵€佺鐞?   */
  state: UnwrapRef<BpmnState>;

  /**
   * 鑾峰彇褰撳墠鐨勭姸鎬?   */
  getState(): UnwrapRef<BpmnState>;

  refresh: () => void;

  /**
   * 鍒濆鍖栨祦绋嬭璁″櫒
   * @param options 娴佺▼璁捐鍣ㄥ弬鏁?   */
  initModeler(options: unknown): void;

  /**
   *鑾峰彇璁捐鍣?   */
  getModeler(): typeof Modeler;

  /**
   * 瀵煎叆xml
   * @param xml xml瀛楃涓?   */
  importXML(xml: string): Promise<any | Array<string>>;

  /**
   * 鑾峰彇娴佺▼xml
   */
  getXML(): Promise<{ xml: string }>;

  /**
   * 鑾峰彇娴佺▼鐨凷VG鍥?   */
  getSVG(): Promise<{ svg: string }>;

  /**
   * 鑾峰彇褰撳墠鑺傜偣鐨凷hape瀵硅薄锛屾瀵硅薄鐢ㄤ簬鎿嶄綔鑺傜偣涓庝笟鍔℃祦绋嬪璞＄瓑
   */
  getShape(): any;

  getShapeById(id: string): any;

  /**
   * 鑾峰彇褰撳墠鐨勬祦绋嬬殑涓氬姟瀵硅薄
   */
  getBusinessObject(): any;

  /**
   * 鑾峰彇褰撳墠鐨勬椿鍔ㄨ妭鐐?   */
  getActiveElement(): any;

  /**
   * 鑾峰彇褰撳墠鑺傜偣鐨勫悕绉?   */
  getActiveElementName(): string;

  /**
   * 鑾峰彇褰撳墠鑺傜偣鐨刴odeling
   */
  getModeling(): any;

  /**
   * 鑾峰彇bpmnFactory
   */
  getBpmnFactory(): any;

  /**
   * 鍒涘缓鑺傜偣
   * @param nodeName 鑺傜偣鍚嶇О
   * @param modelName 妯″瀷鍚嶇О
   * @param value 鍑犵偣鍊?   * @param multiple 鏄惁鏄鑺傜偣
   */
  createElement(
    nodeName: string,
    modelName: string,
    value?: never | { [key: string]: any },
    multiple?: boolean,
  ): void;

  /**
   * 娣诲姞璁捐鍣ㄤ簨浠剁洃鍚?   * @param name 浜嬩欢鍚嶇О
   * @param func 瑙﹀彂浜嬩欢鐨勫洖璋?   */
  addEventListener(name: string, func: (e: any) => void): void;

  /**
   * 鏇存柊鎵╁睍鑺傜偣
   * @param elementName 鑺傜偣鍚?   * @param value 鍊?   */
  updateExtensionElements(
    elementName: string,
    value: Array<ModdleElement> | ModdleElement,
  ): void;
}
