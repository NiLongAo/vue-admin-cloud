<template>
  <BasicTree
      title="设备通道"
      toolbar
      search
      ref="asyncExpandTreeRef"
      :fieldNames="{ key: 'id', title: 'name' }"
      :clickRowToExpand="false"
      :treeData="treeData"
      @select="handleSelect"
    />
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { doTreeDeviceChannel } from '/@/api/video/deviceChannel';
  const emit = defineEmits(['select', 'edit', 'remove']);
  const defaultKey = ref();
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
  const treeData = ref<TreeItem[]>([]);
  

  const fetch = async () => {
    treeData.value = (await doTreeDeviceChannel()) as unknown as TreeItem[];
    if (unref(treeData) && unref(treeData).length > 0) {
      defaultKey.value = [unref(treeData)[0]['id']];
      unref(asyncExpandTreeRef)?.setSelectedKeys(unref(defaultKey));
      emit('select', unref(treeData)[0]);
    }
  };

  const handleSelect = (keys) => {
    emit('select', unref(asyncExpandTreeRef)?.getSelectedNode(keys[0]));
  };

  defineExpose({ fetch });
  onMounted(() => {
    fetch();
  });
</script>
