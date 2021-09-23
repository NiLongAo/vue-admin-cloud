import { defHttp } from '/@/utils/http/axios';
import { EnumModel } from './model/enumModel';
enum Api {
  //获取客户端分页
  check = '/webapi/common/enum/check',
}

export function doEnumCheck() {
  return defHttp.get<EnumModel>({ url: Api.check });
}
