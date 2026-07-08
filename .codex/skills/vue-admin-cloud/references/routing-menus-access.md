# Routing, Menus, And Access

## Router Files

| File | Role |
|---|---|
| `apps/web-antd/src/router/index.ts` | Creates router with hash/history based on `VITE_ROUTER_HISTORY`. |
| `apps/web-antd/src/router/guard.ts` | Progress guard, login redirect guard, dynamic access route generation. |
| `apps/web-antd/src/router/access.ts` | Calls backend menu API and maps layout/page components. |
| `apps/web-antd/src/router/routes/index.ts` | Loads static route modules and exports `accessRoutes`, `componentKeys`, `routes`. |
| `apps/web-antd/src/router/routes/core.ts` | Root, auth routes, fallback. |
| `apps/web-antd/src/router/routes/modules/*.ts` | Static route modules merged by `import.meta.glob`. |
| `apps/web-antd/src/router/personal-center.ts` | Shared personal center path constant. |

## Dynamic Route Loading

`routes/index.ts` eagerly imports:

```ts
const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', {
  eager: true,
});
```

Because every `.ts` under `router/routes/modules` is treated as a route module, never put tests, helpers, fixtures, or data-only files there. Put tests next to router root or under a non-globbed folder.

`componentKeys` is generated from `../../views/**/*.vue` and filters out `/modules/`:

```ts
import.meta.glob('../../views/**/*.vue')
```

This means page components should usually be normal view files, while modal/data helper components can live under `modules`.

## Backend Menu Access

Backend menu fetch:

- API: `apps/web-antd/src/api/core/menu.ts`
- Endpoint: `POST /webapi/bean/menu/user_tree_menu`
- Function: `getAllMenusApi()`

`router/access.ts` passes this to `generateAccessible`:

```ts
fetchMenuListAsync: async () => await getAllMenusApi()
```

Component maps:

- `pageMap`: `import.meta.glob('../views/**/*.vue')`
- `layoutMap`: `BasicLayout`, `IFrameView`
- Forbidden page: `#/views/_core/fallback/forbidden.vue`

When a page is missing even though the backend menu exists, check:

1. Backend `component` string matches a file under `src/views`.
2. The `.vue` file is not only under a `modules` folder if it needs to be addressable.
3. `router/access.ts` page glob can see it.
4. The route is not blocked by access codes or roles.

## Guard Flow

`guard.ts` behavior:

1. Core routes are always allowed.
2. Login route redirects to `redirect`, `userInfo.homePath`, or `preferences.app.defaultHomePath` when already logged in.
3. Missing token redirects to `/auth/login`, unless `to.meta.ignoreAccess`.
4. First authenticated navigation fetches user info when needed.
5. `generateAccess` creates backend menus/routes.
6. `accessStore` saves menus/routes and marks access checked.
7. Navigation redirects to decoded intended path.

If menus/routes look stale after tenant/user changes, call the existing refresh flow or reset access state; do not manually patch menu arrays in a component.

## Static Routes

Examples:

- `routes/modules/dashboard.ts` adds `/dashboard/analytics` and `/dashboard/workspace`.
- `routes/modules/vben.ts` has Vben links and `/profile` compatibility redirect.

Use static route modules for framework/internal pages, demo pages, or hidden compatibility redirects. Use backend menu data for business navigation unless the project already uses a static route for that area.

## Personal Center Rule

The unified personal center path is:

```ts
export const PERSONAL_CENTER_PATH = '/work/personal';
```

Current behavior:

- Avatar dropdown in `layouts/basic.vue` pushes `PERSONAL_CENTER_PATH`.
- `/profile` redirects to `/work/personal`.
- `views/work/personal/index.vue` is a thin wrapper around `_core/profile/index.vue`.
- Business profile tabs/content live in `views/_core/profile/index.vue`.

Do not recreate a second personal center page. Keep avatar and menu entries pointing to the same path and component.

## Permission Usage

Use template directive for simple button visibility:

```vue
<Button v-access:code="'system.tenant:add'">Add</Button>
```

Use `useAccess()` inside column/data factories:

```ts
const { hasAccessByCodes } = useAccess();

{
  code: 'edit',
  show: () => hasAccessByCodes(['system.tenant:update']),
}
```

Permission code examples in this project:

- `system.tenant:add`
- `system.tenant:update`
- `system.tenant:delete`
- `work.personal:other_save`
- `video.push:add`

When adding a permissioned UI action, search for the closest module's permission code style first.
