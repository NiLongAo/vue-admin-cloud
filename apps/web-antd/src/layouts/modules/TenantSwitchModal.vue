<script lang="ts" setup>
import type { TenantSelectOption } from './tenant-switch';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { useDebounceFn } from '@vueuse/core';
import { Select } from 'ant-design-vue';

import { doTenantSelect } from '#/api/sys/tenant';

import { getTenantRecords, normalizeTenantOptions } from './tenant-switch';

const emit = defineEmits<{
  switched: [];
}>();

const userStore = useUserStore();
const selectedTenant = ref<TenantSelectOption['value']>();
const tenantOptions = ref<TenantSelectOption[]>([]);
const loading = ref(false);

async function fetchTenants(tenantName = '') {
  loading.value = true;
  try {
    const data = await doTenantSelect({ limit: 20, tenantName });
    tenantOptions.value = normalizeTenantOptions(getTenantRecords(data));
  } catch {
    tenantOptions.value = [];
  } finally {
    loading.value = false;
  }
}

const handleSearch = useDebounceFn((value: string) => {
  fetchTenants(value);
}, 300);

function handleChange() {
  fetchTenants();
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    modalApi.lock();
    try {
      userStore.setSearchTenant(selectedTenant.value);
      emit('switched');
      modalApi.close();
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      tenantOptions.value = [];
      loading.value = false;
      return;
    }

    selectedTenant.value = userStore.searchTenant;
    await fetchTenants();
  },
});
</script>

<template>
  <Modal class="w-[420px]" title="切换租户">
    <div class="mx-4 mb-2 space-y-2">
      <div class="text-sm font-medium text-foreground">租户</div>
      <Select
        v-model:value="selectedTenant"
        allow-clear
        class="w-full"
        :filter-option="false"
        :loading="loading"
        :not-found-content="loading ? '加载中...' : '暂无数据'"
        :options="tenantOptions"
        placeholder="请选择租户"
        show-search
        @change="handleChange"
        @search="handleSearch"
      />
    </div>
  </Modal>
</template>
