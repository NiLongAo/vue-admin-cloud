# Example: Profile And Tenant Patterns

## Unified Personal Center

Use the shared path:

```ts
import { PERSONAL_CENTER_PATH } from '#/router/personal-center';
```

Avatar menu handler:

```ts
router.push(PERSONAL_CENTER_PATH);
```

Compatibility route:

```ts
{
  name: 'Profile',
  path: '/profile',
  redirect: PERSONAL_CENTER_PATH,
  meta: {
    hideInMenu: true,
    title: $t('page.auth.profile'),
  },
}
```

Menu route wrapper:

```vue
<script lang="ts" setup>
import Profile from '#/views/_core/profile/index.vue';
</script>

<template>
  <Profile />
</template>
```

## Profile Base Info Save

The base setting component exposes its form API:

```vue
<BaseSetting v-model:form-api="formApi" :user-id="userId" />
```

Parent saves:

```ts
const { valid } = await formApi.value.validate();
if (!valid) return;

const values = await formApi.value.getValues();
await doUpdateLoginUserInfo(buildLoginUserInfoPayload(values));
```

Payload helper maps:

- `areaList[0]` to `provinceId`
- `areaList[1]` to `cityId`
- `areaList[2]` to `areaId`
- Upload file array to backend `imageUrl`
- boolean switch values to `1` or `0`

## Account Binding

Use the existing component:

```ts
import AccountBind from '#/views/index/system/user/component/accountBind/index.vue';
```

It uses:

- `doFindUserBind()`
- `doUnBindMiniWeb()`
- `QrCodeBindModel`
- `CellTag`
- `CellOperation`
- no pagination
- `rowConfig.keyField: 'loginType'`

When table styling is wrong, fix this component or VXE adapter behavior; do not duplicate it inside profile.

## Tenant Switch Modal

Open from avatar menu only for system tenant users:

```ts
const isSysTenant = computed(
  () => Number(userStore.userInfo?.tenantId) === sysTenantId,
);
```

Menu item:

```ts
{
  handler: () => tenantSwitchModalApi.open(),
  icon: 'lucide:repeat-2',
  text: 'Switch tenant',
}
```

Modal fetch:

```ts
const data = await doTenantSelect({ limit: 20, tenantName });
tenantOptions.value = normalizeTenantOptions(getTenantRecords(data));
```

Confirm:

```ts
userStore.setSearchTenant(selectedTenant.value);
emit('switched');
modalApi.close();
```

Layout refresh:

```ts
async function handleTenantSwitched() {
  await refresh();
}
```

## Tenant Option Normalization

Helpers accept several backend shapes:

```ts
export function getTenantRecords(response: unknown): TenantSelectRecord[] {
  if (Array.isArray(response)) return response;
  if (!response || typeof response !== 'object') return [];

  const data = (response as any).data;
  if (Array.isArray(data)) return data;

  return (response as any).list ?? (response as any).records ?? [];
}
```

Keep this because some backend endpoints return wrapped data and some return already-unwrapped data through `requestClient`.
