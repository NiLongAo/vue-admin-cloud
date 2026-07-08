# Domain Feature Reference

## Tenant Management

Files:

- `apps/web-antd/src/views/index/system/tenant/index.vue`
- `apps/web-antd/src/views/index/system/tenant/data.ts`
- `apps/web-antd/src/views/index/system/tenant/modules/form.vue`
- `apps/web-antd/src/api/sys/tenant.ts`

Patterns:

- List page uses `Page auto-content-height`.
- Grid uses `height: 'auto'`, `rowConfig.keyField: 'id'`.
- Search schema lives in `data.ts`.
- Columns live in `data.ts`.
- Form modal lives under `modules/form.vue`.
- Add button uses `v-access:code="'system.tenant:add'"`.
- Edit/delete button visibility uses `hasAccessByCodes`.

Important APIs:

- `/webapi/config/tenant/page`
- `/webapi/config/tenant/select`
- `/webapi/config/tenant/insert`
- `/webapi/config/tenant/update`
- `/webapi/config/tenant/remove`
- `/webapi/config/tenant/tenant_privilege_list`
- `/webapi/config/tenant/tenant_privilege_save`

## Tenant Switching

Files:

- `layouts/basic.vue`
- `layouts/modules/TenantSwitchModal.vue`
- `layouts/modules/tenant-switch.ts`

Switching is an avatar-dropdown action, visible only to system tenant users. It stores selected tenant in `useUserStore().searchTenant`; requests then send `schemasTenantId`.

## Personal Center

Unified route:

```ts
PERSONAL_CENTER_PATH = '/work/personal'
```

Files:

- `router/personal-center.ts`
- `router/routes/modules/vben.ts`
- `layouts/basic.vue`
- `views/work/personal/index.vue`
- `views/_core/profile/index.vue`
- `views/_core/profile/profile-user.ts`
- `views/index/system/user/component/baseSetting/index.vue`
- `views/index/system/user/component/accountBind/index.vue`

Current intended composition:

- Menu entry and avatar entry navigate to `/work/personal`.
- `/profile` redirects to `/work/personal`.
- `work/personal/index.vue` wraps `_core/profile/index.vue`.
- `_core/profile/index.vue` integrates base info, account binding, security, password, notice tabs.
- Base info save calls `doUpdateLoginUserInfo(buildLoginUserInfoPayload(values))`.
- Account binding uses `doFindUserBind()` and `doUnBindMiniWeb()`.

Do not split this into two profile pages again.

Profile data helpers:

- `normalizeProfileUserInfo`: normalizes avatar/name/roles fields for the profile shell.
- `buildLoginUserInfoPayload`: maps `areaList` to `provinceId`, `cityId`, `areaId`; normalizes switches and image upload.

## Workspace Dashboard

Files:

- `apps/web-antd/src/views/dashboard/workspace/index.vue`
- `apps/web-antd/src/router/routes/modules/dashboard.ts`

Current page is mostly sample Vben workbench data. When optimizing it:

- Preserve `WorkbenchHeader`, `WorkbenchProject`, `WorkbenchQuickNav`, `WorkbenchTodo`, `WorkbenchTrends`, `AnalysisChartCard` unless the user asks for a new dashboard model.
- Replace sample content with real business data when APIs exist.
- For layout issues, prefer flex/grid min-height fixes and full-height parent constraints over fixed pixel heights.

## System Modules

System module conventions:

- API files: `apps/web-antd/src/api/sys/*.ts`
- Pages: `apps/web-antd/src/views/index/system/<module>/index.vue`
- Page-local columns/schema: `modules/data.ts` or `data.ts`
- Modals: `modules/*Modal.vue` or `modules/*Model.vue` depending on existing local spelling.

Existing modules include:

- user
- tenant
- role
- menu
- dictionary
- config
- department
- position
- privilege
- notice
- OAuth client
- SMS config/message/template

Before adding a system module, copy the nearest sibling module's structure.

## Video Modules

Files:

- APIs: `apps/web-antd/src/api/video/*`
- Views: `apps/web-antd/src/views/video/*`
- Shared components: `apps/web-antd/src/components/Video/*`

Video pages use the same `Page + useVbenVxeGrid + Modal` pattern but have domain-specific play/sync/catalog modals.

## OA Modules

Files:

- APIs: `apps/web-antd/src/api/oa/*`
- Views: `apps/web-antd/src/views/oa/*`, `apps/web-antd/src/views/work/oa`, `apps/web-antd/src/views/work/leave`

OA pages include process repository, deployment, need/historic lists, work OA and leave pages. Search existing `api/oa/activiti.ts` before adding new workflow operations.

## Flow And FS

Files:

- `apps/web-antd/src/components/FlowChart`
- `apps/web-antd/src/views/fs/*`

Use the existing flowchart components for IVR/logic flow rather than inventing a new graph implementation.
