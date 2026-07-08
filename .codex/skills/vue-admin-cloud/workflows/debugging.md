# Debugging Workflow

Use this for runtime warnings, layout issues, missing data, broken routes, table height problems, tenant issues, and profile bugs.

## First Moves

1. Reproduce or inspect the current behavior.
2. Search for the exact error/warning text.
3. Locate the owning adapter/package before editing a business page.
4. Add or run targeted tests for data mapping/helper logic.
5. Use browser console/network checks for UI/runtime issues.

## Common Symptoms

### `<TransitionGroup> children must be keyed`

Likely AntD `Upload` file list items missing `uid`.

Check:

```bash
rg -n "Upload|fileList|uid|imageUrl" apps/web-antd/src
```

Fix file list objects so each item has a stable `uid`.

### Table Height Or Double Scroll

Check page uses:

```vue
<Page auto-content-height>
```

and grid uses:

```ts
height: 'auto'
```

Also inspect parent flex/grid containers for missing `min-height: 0` or `min-width: 0`.

### Backend Menu Page Missing

Check:

- `getAllMenusApi()` response from `/webapi/bean/menu/user_tree_menu`.
- Component string maps to `src/views/**/*.vue`.
- File is not inside an excluded `/modules/` folder when route component must load.
- No `.test.ts` under `router/routes/modules`.

### Personal Center Wrong Page

Check all entry points:

- `PERSONAL_CENTER_PATH`
- avatar dropdown in `layouts/basic.vue`
- `/profile` redirect in `routes/modules/vben.ts`
- `views/work/personal/index.vue`
- `views/_core/profile/index.vue`

There should be one actual profile implementation.

### Tenant Data Not Applied

Check:

- Is user system tenant? `Number(userInfo?.tenantId) === sysTenantId`
- Is `userStore.searchTenant` set?
- Does request include `schemasTenantId`?
- Did current page refresh after tenant switch?
- Did a request set `dataHeaderTenant: false`?

### User Area/City Missing

Check:

- `authLogin()` loaded `systemStore.getAreaListAction()`.
- Backend user detail returns `provinceId`, `cityId`, `areaId`.
- Form sets `areaList: [provinceId, cityId, areaId]`.
- Cascader options come from `systemStore.getAreaList`.

## Browser Debugging

Use:

```bash
agent-browser-cli open http://localhost:5666/<path>
agent-browser-cli scan --text-only
agent-browser-cli snapshot --limit 200
agent-browser-cli console start --tab <tabId>
agent-browser-cli console list --tab <tabId> --level error
agent-browser-cli network start --tab <tabId>
agent-browser-cli network list --tab <tabId> --filter webapi
```

Stop monitors when done:

```bash
agent-browser-cli console stop --tab <tabId>
agent-browser-cli network stop --tab <tabId>
```

## Test Placement

Good:

- `apps/web-antd/src/views/_core/profile/profile-user.test.ts`
- `apps/web-antd/src/layouts/modules/tenant-switch.test.ts`
- package tests under `packages/**/__tests__` or beside source where existing style does that.

Bad:

- `apps/web-antd/src/router/routes/modules/*.test.ts`

## Fix Strategy

- Fix helpers with unit tests when bug is mapping/normalization.
- Fix adapters when many pages have the same issue.
- Fix page CSS when only one page has layout constraints.
- Fix route/menu mapping at router/access level only when backend menu integration is wrong globally.
