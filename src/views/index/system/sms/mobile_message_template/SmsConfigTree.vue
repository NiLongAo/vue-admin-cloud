<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="短信配置"
      toolbar
      search
      ref="asyncExpandTreeRef"
      :selectedKeys="defaultKey"
      :fieldNames="{ key: 'id', title: 'configName' }"
      :clickRowToExpand="false"
      :treeData="treeData"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { BasicTree, TreeItem, TreeActionType } from '@/components/Tree';
  import { doAll } from '@/api/sys/smsConfig';
  const defaultKey = ref();
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);

  const treeData = ref<TreeItem[]>([]);
  const emit = defineEmits(['select', 'edit', 'remove']);

  const fetch = async () => {
    treeData.value = (await doAll()) as unknown as TreeItem[];
    if (unref(treeData) && unref(treeData).length > 0) {
      defaultKey.value = [unref(treeData)[0]['id']];
      unref(asyncExpandTreeRef)?.setSelectedKeys(unref(defaultKey));
    }
    emit('select', unref(defaultKey)[0]);
  };

  const handleSelect = (_,info) => {
    defaultKey.value = [info.node.key];
    emit('select', info.node.key);
  };

  defineExpose({ fetch });
  onMounted(() => {
    fetch();
  });
</script>
