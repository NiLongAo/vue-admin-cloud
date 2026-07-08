# CRUD/List Page Workflow

Use this for normal admin list pages, system pages, and modules that combine search form, VXE grid, toolbar, and modal form.

## Files To Create Or Edit

Typical structure:

```text
apps/web-antd/src/api/<domain>/<module>.ts
apps/web-antd/src/views/<domain>/<module>/index.vue
apps/web-antd/src/views/<domain>/<module>/modules/data.ts
apps/web-antd/src/views/<domain>/<module>/modules/<Module>Modal.vue
```

Some existing modules put `data.ts` directly beside `index.vue`; match the nearest sibling.

## Steps

1. Search for the closest existing module:

```bash
rg -n "table-title|useVbenVxeGrid|useVbenModal" apps/web-antd/src/views/index/system
```

2. Add API wrappers under `src/api`, using `requestClient`.
3. Build search schema and table columns in `data.ts`.
4. Build `index.vue` with `Page auto-content-height`, modal connection, grid, toolbar tools.
5. Build modal form with `useVbenForm` and `useVbenModal`.
6. Add permission codes using `v-access` and/or `hasAccessByCodes`.
7. Add route/menu support:
   - Backend menu if it is business navigation.
   - Static route module only for framework/internal/demo pages.
8. Run targeted tests/typecheck/lint.
9. Verify UI with `agent-browser-cli`.

## API Rules

- `page` queries usually use `post`.
- `detail` usually uses `get` with `{ params }`.
- `save/insert/update` usually use `post`.
- `remove` can be `get` or `delete`; match backend and nearest module.
- If backend returns `{ items, total }`, VXE proxy defaults already know how to consume it.

## Grid Rules

Minimum grid options:

```ts
gridOptions: {
  columns: useColumns(onActionClick),
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getPage({
          pageNumber: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
}
```

If no pagination is needed:

```ts
pagerConfig: {
  enabled: false,
}
```

## Toolbar Rules

Use `#toolbar-tools` for primary commands:

```vue
<template #toolbar-tools>
  <Button v-access:code="'domain.module:add'" type="primary" @click="onCreate">
    <Plus class="size-5" />
    Add
  </Button>
</template>
```

## Modal Rules

Parent emits:

```vue
<FormModal @success="refreshGrid" />
```

On save success:

```ts
emit('success');
modalApi.close();
```

Do not make parent read modal internals.

## Route/Menu Checklist

- Backend component path points to a `.vue` file under `src/views`.
- The component file is not only under a `/modules/` directory if backend route needs to load it.
- Permission code matches backend menu/button permission.
- Static route module is not used for backend-owned business menu unless local code already follows that pattern.
