# API, Auth, Tenant, And Stores

## Request Clients

Request setup lives in `apps/web-antd/src/api/request.ts`.

Use `requestClient` for normal backend APIs:

```ts
export const requestClient = createRequestClient(apiURL, {
  dataHeaderTenant: 'schemasTenantId',
  responseReturn: 'data',
});
```

Characteristics:

- Base URL comes from `useAppConfig(import.meta.env, import.meta.env.PROD)`.
- Adds `Authorization: Bearer <token>` from `useAccessStore()`.
- Adds tenant header when `useUserStore().searchTenant` exists.
- Adds `Accept-Language` from preferences.
- Uses `defaultResponseInterceptor` with `codeField: 'code'`, `dataField: 'data'`, `successCode: 0`.
- Returns `data` by default due to `responseReturn: 'data'`.
- Handles refresh token and error messages.

Use `baseRequestClient` only for endpoints that must handle the raw backend wrapper, especially login/refresh:

```ts
export const baseRequestClient = new RequestClient({ baseURL: apiURL });
```

## API File Pattern

Place domain APIs under `apps/web-antd/src/api/<domain>`.

Common pattern:

```ts
import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface DemoEntity extends Recordable<any> {
  id?: number | string;
  name?: string;
}

enum Api {
  page = '/webapi/demo/page',
  save = '/webapi/demo/save',
  detail = '/webapi/demo/detail',
  remove = '/webapi/demo/remove',
}

export function getDemoPage(params: Recordable<any>) {
  return requestClient.post<Recordable<DemoEntity>>(Api.page, params);
}

export function doDemoSave(params: DemoEntity) {
  return requestClient.post(Api.save, params);
}

export function doDemoDetail(params: Pick<DemoEntity, 'id'>) {
  return requestClient.get<DemoEntity>(Api.detail, { params });
}
```

Existing naming is mixed (`getXPage`, `doXSave`, `doXInsert`, `doXUpdate`). Match the nearest module.

## Tenant Header Behavior

Tenant header is automatic:

```ts
if (
  userStore.searchTenant &&
  config.dataHeaderTenant &&
  typeof config.dataHeaderTenant === 'string'
) {
  config.headers[config.dataHeaderTenant] = userStore.searchTenant;
}
```

Default header name is `schemasTenantId`.

To suppress tenant header for a request:

```ts
requestClient.get('/some/api', {
  dataHeaderTenant: false,
});
```

Use this only when the backend endpoint is explicitly global/system-level and must not be scoped by selected tenant.

## Tenant Switching

Files:

- `apps/web-antd/src/layouts/basic.vue`
- `apps/web-antd/src/layouts/modules/TenantSwitchModal.vue`
- `apps/web-antd/src/layouts/modules/tenant-switch.ts`
- `apps/web-antd/src/api/sys/tenant.ts`
- `packages/stores/src/modules/user.ts`

Behavior:

- System tenant id is `sysTenantId = 1`.
- Avatar menu shows tenant switch only when `Number(userInfo?.tenantId) === sysTenantId`.
- Tenant search options use `doTenantSelect({ limit: 20, tenantName })`.
- Response normalization accepts raw arrays, `.data`, `.list`, or `.records`.
- Confirm stores selected tenant in `useUserStore().setSearchTenant`.
- Basic layout calls `refresh()` after switch to reload current view.
- `searchTenant` is persisted by shared user store.

Do not store selected tenant in a component-local global or localStorage key. Use the shared user store.

## Auth Flow

Files:

- `apps/web-antd/src/store/core/auth.ts`
- `apps/web-antd/src/api/core/auth.ts`
- `apps/web-antd/src/api/core/user.ts`

Login:

1. `loginApi()` uses `baseRequestClient.post('/webapi/bean/user/login')`.
2. Backend raw wrapper is checked manually for `code`.
3. Access and refresh tokens are saved in `useAccessStore`.
4. System config, area list, and dictionary data are loaded.
5. User info is fetched by `getUserInfoApi()`.
6. `userStore.setUserInfo(imageBaseUrl, userInfo)` normalizes avatar/name fields.
7. Access codes are saved from `userInfo.privilegeList`.
8. Router goes to `userInfo.homePath` or default home path.

Refresh token:

- `refreshTokenApi()` also uses `baseRequestClient`.
- `doRefreshToken()` extracts `access_token` and `refresh_token` from raw nested data.

Logout:

- Calls `/webapi/bean/user/logout`.
- Calls `resetAllStores()`.
- Redirects to login with encoded current route unless redirect is disabled.

## User Store Normalization

Shared user store: `packages/stores/src/modules/user.ts`.

State:

- `userInfo`
- `userRoles`
- `searchTenant`

Persisted field:

```ts
export const userStorePersist = {
  pick: ['searchTenant'],
};
```

`setUserInfo(imageBaseUrl, userInfo)` normalizes:

- `httpImageUrl` from `imageBaseUrl + imageUrl`
- `nickName` fallback
- `userName` fallback from `username`
- `roles` from `roleIdList`

When profile fields look empty, inspect backend fields such as `userName`, `username`, `nickName`, `realName`, `imageUrl`, `httpImageUrl`, `provinceId`, `cityId`, `areaId`.

## System Store Responsibilities

`apps/web-antd/src/store` includes system config models and actions. Auth login loads:

- system config
- area list
- dictionary map

Profile and tenant forms depend on system config and area data. If city/area options are missing, verify the area list action ran and the backend area response contains the expected province/city/area ids.
