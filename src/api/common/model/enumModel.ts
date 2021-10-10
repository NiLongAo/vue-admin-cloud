import {
  AUTHORIZED_GRANT_TYPES,
  SMS_CONFIG_TYPES,
  MOBILE_MESSAGE_TEMPLATE_TYPES,
} from '/@/enums/commonEnum';

export interface EnumModel {
  [AUTHORIZED_GRANT_TYPES]: any[];
  [SMS_CONFIG_TYPES]: any[];
  [MOBILE_MESSAGE_TEMPLATE_TYPES]: any[];
}
