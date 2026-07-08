<script lang="ts" setup>
import type { PublicNoticeEntity } from '#/api/notice/publicNotice';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  doPublicNoticeDetail,
  doPublicNoticeInsert,
  doPublicNoticeUpdate,
} from '#/api/notice/publicNotice';

import { useFormSchema } from './data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<PublicNoticeEntity>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-1 lg:col-span-1',
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 gap-x-4 lg:grid-cols-2',
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();
    try {
      const data = (await formApi.getValues()) as PublicNoticeEntity;
      const params = {
        ...data,
        id: formData.value?.id,
      };
      await (formData.value?.id
        ? doPublicNoticeUpdate(params)
        : doPublicNoticeInsert(params));
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formApi.resetForm();
      formData.value = undefined;
      return;
    }

    const data = modalApi.getData<PublicNoticeEntity>();
    if (data?.id) {
      formData.value = data;
      formApi.setValues(data);
      try {
        const detail = await doPublicNoticeDetail({ id: data.id });
        formData.value = { ...data, ...detail };
        formApi.setValues(formData.value);
      } catch {
        message.warning('详情接口暂不可用，已使用列表数据打开编辑');
      }
      return;
    }
    formData.value = undefined;
    formApi.setValues({
      noticeType: 1,
      status: 1,
    });
  },
});

const getTitle = computed(() =>
  formData.value?.id ? '编辑平台公告通知' : '新增平台公告通知',
);
</script>

<template>
  <Modal class="w-full max-w-[860px]" :title="getTitle">
    <Form class="px-1 sm:px-4" />
  </Modal>
</template>
