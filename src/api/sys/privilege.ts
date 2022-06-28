import { defHttp } from '/@/utils/http/axios';

enum Api {
  //部门权限信息
  departmentPrivilegeList = '/webapi/bean/privilege/department_privilege_list',
  //部门权限保存
  departmentPrivilegeSave = '/webapi/bean/privilege/department_privilege_save',
  //职位权限信息
  positionPrivilegeList = '/webapi/bean/privilege/position_privilege_list',
  //职位权限保存
  positionPrivilegeSave = '/webapi/bean/privilege/position_privilege_save',
  //角色权限信息
  rolePrivilegeList = '/webapi/bean/privilege/role_privilege_list',
  //角色权限保存
  rolePrivilegeSave = '/webapi/bean/privilege/role_privilege_save',
  //租户权限信息
  tenantPrivilegeList = '/webapi/bean/privilege/tenant_privilege_list',
  //租户权限保存
  tenantPrivilegeSave = '/webapi/bean/privilege/tenant_privilege_save',
}

export function doDepartmentPrivilegeList(params) {
  return defHttp.get({ url: Api.departmentPrivilegeList, params });
}
export function doDepartmentPrivilegeSave(params) {
  return defHttp.post({ url: Api.departmentPrivilegeSave, params });
}

export function doPositionPrivilegeList(params) {
  return defHttp.get({ url: Api.positionPrivilegeList, params });
}
export function doPositionPrivilegeSave(params) {
  return defHttp.post({ url: Api.positionPrivilegeSave, params });
}

export function doRolePrivilegeList(params) {
  return defHttp.get({ url: Api.rolePrivilegeList, params });
}
export function doRolePrivilegeSave(params) {
  return defHttp.post({ url: Api.rolePrivilegeSave, params });
}
export function doTenantPrivilegeList(params) {
  return defHttp.get({ url: Api.tenantPrivilegeList, params });
}
export function doTenantPrivilegeSave(params) {
  return defHttp.post({ url: Api.tenantPrivilegeSave, params });
}
