# UI, Forms, Tables, And Layout

## Page Layout

Use `Page` from `@vben/common-ui` for full app pages:

```vue
<Page auto-content-height>
  <Grid table-title="List" />
</Page>
```

For list pages, pair `Page auto-content-height` with VXE grid `height: 'auto'`. Avoid fixed heights like `500px` unless the component is intentionally fixed-size.

Do not wrap cards inside cards. For dense admin pages, keep the composition quiet and utilitarian: compact toolbars, readable tables, stable heights, and clear form groups.

## Form Adapter

Use:

```ts
import { useVbenForm, z } from '#/adapter/form';
```

The app adapter configures:

- default model prop: `value`
- `Checkbox`, `Radio`, `Switch`: `checked`
- `Upload`: `fileList`
- rules: `required`, `selectRequired`

Basic pattern:

```ts
const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 lg:grid-cols-2',
});
```

For custom components or AntD components not covered by the adapter, set `modelPropName` in the schema.

## Upload Rules

AntD Upload file lists must have stable `uid` values. Missing `uid` causes:

```text
<TransitionGroup> children must be keyed.
```

Good pattern:

```ts
formApi.setValues({
  imageUrl: [
    {
      uid: file.uid ?? file.response.path ?? file.response.fullPath,
      status: 'done',
      url: file.response.fullPath,
      path: file.response.path,
    },
  ],
});
```

When converting form values back to payload, extract the backend path, not the full preview URL:

```ts
const firstFile = imageUrl?.[0];
const path = firstFile?.path ?? firstFile?.response?.path ?? firstFile?.url;
```

## Modal Pattern

Use:

```ts
import { useVbenModal } from '@vben/common-ui';
```

Parent:

```ts
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: Entity) {
  formModalApi.setData({ id: row.id }).open();
}
```

Child modal:

```ts
const emit = defineEmits<{ success: [] }>();

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      await saveApi(await formApi.getValues());
      emit('success');
      modalApi.close();
    } finally {
      modalApi.lock(false);
    }
  },
});
```

## VXE Table Adapter

Use:

```ts
import { useVbenVxeGrid } from '#/adapter/vxe-table';
```

The adapter configures:

- center align
- resizable columns
- `minHeight: 180`
- disabled VXE built-in form, use `formOptions`
- proxy response maps `items` and `total`
- small table size
- custom renderers: `CellImage`, `CellLink`, `CellTag`, `CellSwitch`, `CellOperation`

Common list pattern:

```ts
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
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
    toolbarConfig: {
      custom: true,
      refresh: true,
      search: true,
      zoom: true,
    },
  },
});
```

Prefer `minWidth` for most data columns. Use fixed `width` only for sequence, checkbox, narrow status, or right operation columns.

## CellOperation

Use the custom renderer for operation buttons:

```ts
{
  align: 'center',
  cellRender: {
    name: 'CellOperation',
    attrs: {
      nameField: 'tenantName',
      nameTitle: 'tenant',
      onClick: onActionClick,
    },
    options: [
      { code: 'edit', show: () => hasAccessByCodes(['system.tenant:update']) },
      { code: 'delete', show: () => hasAccessByCodes(['system.tenant:delete']) },
    ],
  },
  field: 'operation',
  fixed: 'right',
  title: 'Operation',
  width: 140,
}
```

`delete` gets Popconfirm behavior automatically. For custom actions, use a custom `code` and handle it in `onActionClick`.

## Responsive Admin UI

- Use dense but readable grids, not marketing layouts.
- Keep table pages full-height and avoid nested scroll regions.
- For right toolbars or side panels, reduce fixed widths and ensure main grid has `min-width: 0`.
- For two-column forms, use `wrapperClass: 'grid-cols-1 lg:grid-cols-2'`.
- For full-width form rows, use `formItemClass: 'col-span-1 lg:col-span-2'`.
- Use `min-height: 0` in flex/grid children that need to shrink.
- Avoid viewport-based font scaling.

## Profile UI Specifics

The profile shell lives in `packages/effects/common-ui/src/ui/profile/profile.vue`. App-specific profile tabs are composed in `apps/web-antd/src/views/_core/profile/index.vue`.

If tabs do not switch content, inspect the `Profile` component and its `v-model` behavior before duplicating profile pages.
