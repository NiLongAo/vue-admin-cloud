import type { Recordable } from '@vben/types';

export function normalizeProfileUserInfo(userInfo: Recordable<any> = {}) {
  const roles = userInfo.roles ?? userInfo.roleIdList ?? [];
  const username = userInfo.username ?? userInfo.userName ?? '';
  const realName = userInfo.realName ?? userInfo.nickName ?? '';

  return {
    ...userInfo,
    avatar: userInfo.avatar ?? userInfo.httpImageUrl ?? userInfo.imageUrl,
    imageUrl: userInfo.imageUrl ?? '',
    nickName: userInfo.nickName ?? realName,
    realName,
    roles: Array.isArray(roles) ? roles.map(String) : [],
    userName: userInfo.userName ?? username,
    username,
  };
}

function normalizeSwitchValue(value: unknown) {
  if (value === true) return 1;
  if (value === false) return 0;
  return value;
}

function normalizeImageUrl(value: unknown) {
  if (!Array.isArray(value)) return value;

  const firstFile = value[0] as Recordable<any> | undefined;
  return firstFile?.path ?? firstFile?.response?.path ?? firstFile?.url;
}

export function buildLoginUserInfoPayload(formValues: Recordable<any>) {
  const { areaList, imageUrl, isAdmin, isEnabled, ...values } = formValues;

  return {
    ...values,
    areaId: areaList?.[2],
    cityId: areaList?.[1],
    imageUrl: normalizeImageUrl(imageUrl),
    isAdmin: normalizeSwitchValue(isAdmin),
    isEnabled: normalizeSwitchValue(isEnabled),
    provinceId: areaList?.[0],
  };
}
