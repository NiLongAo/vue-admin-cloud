# Example: Form Modal Pattern

Use this after checking the nearest existing modal.

## API Shape

```ts
enum Api {
  detail = '/webapi/demo/detail',
  insert = '/webapi/demo/insert',
  update = '/webapi/demo/update',
}

export function doDemoDetail(params: Pick<DemoEntity, 'id'>) {
  return requestClient.get<DemoEntity>(Api.detail, { params });
}

export function doDemoInsert(params: DemoEntity) {
  return requestClient.post(Api.insert, params);
}

export function doDemoUpdate(params: DemoEntity) {
  return requestClient.post(Api.update, params);
}
```

## Modal Component

```vue
<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { DemoEntity } from '#/api/demo/demo';

import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { doDemoDetail, doDemoInsert, doDemoUpdate } from '#/api/demo/demo';

const emit = defineEmits<{ success: [] }>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: 'Name',
    rules: 'required',
  },
  {
    component: 'Switch',
    defaultValue: 1,
    fieldName: 'status',
    label: 'Enabled',
    componentProps: {
      checkedValue: 1,
      unCheckedValue: 0,
    },
  },
];

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1',
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const values = (await formApi.getValues()) as DemoEntity;
      if (values.id) {
        await doDemoUpdate(values);
      } else {
        await doDemoInsert(values);
      }
      emit('success');
      modalApi.close();
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(open) {
    if (!open) return;

    const data = modalApi.getData<DemoEntity>();
    await formApi.resetForm();
    if (data.id) {
      const detail = await doDemoDetail({ id: data.id });
      await formApi.setValues(detail);
    } else {
      await formApi.setValues(data);
    }
  },
});

const title = computed(() => {
  const data = modalApi.getData<DemoEntity>();
  return data.id ? 'Edit' : 'Create';
});
</script>

<template>
  <Modal :title class="w-[640px]">
    <Form />
  </Modal>
</template>
```

## Upload Field Pattern

```ts
async function handleUploadChange({ file }: any) {
  if (!file.response) return;

  await formApi.setValues({
    imageUrl: [
      {
        uid: file.uid ?? file.response.path ?? file.response.fullPath,
        status: 'done',
        url: file.response.fullPath,
        path: file.response.path,
      },
    ],
  });
}
```

Schema:

```ts
{
  component: 'Upload',
  componentProps: {
    accept: '.png,.jpg,.jpeg',
    customRequest: ({ file, onError, onProgress, onSuccess }: any) =>
      upload_file({ file, onError, onProgress, onSuccess, type: 1 }),
    handleChange: handleUploadChange,
    listType: 'picture-card',
    maxCount: 1,
    multiple: false,
    showUploadList: true,
  },
  fieldName: 'imageUrl',
  label: 'Avatar',
}
```
