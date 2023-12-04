<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="字典类型"
      toolbar
      search
      :selectedKeys="defaultKey"
      ref="asyncExpandTreeRef"
      :fieldNames="{ key: 'typeId', title: 'name' }"
      :clickRowToExpand="false"
      :beforeRightClick="getRightMenuList"
      :treeData="treeData"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, unref } from 'vue';
  import { BasicTree, TreeItem, ContextMenuItem, TreeActionType,ContextMenuOptions } from '@/components/Tree';
  import { doDictionaryTypeList } from '@/api/sys/dictionary';
  import { usePermission } from '@/hooks/web/usePermission';
  const defaultKey = ref();
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
  const { hasPermission } = usePermission();

  const treeData = ref<TreeItem[]>([]);
  const emit = defineEmits(['select', 'edit', 'remove']);

  const fetch = async () => {
    treeData.value = (await doDictionaryTypeList()) as unknown as TreeItem[];
    if (unref(treeData) && unref(treeData).length > 0) {
      defaultKey.value = [unref(treeData)[0]['typeId']];
      unref(asyncExpandTreeRef)?.setSelectedKeys(unref(defaultKey));
    }
    emit('select', unref(defaultKey)[0]);
  };

  const handleSelect = (_,info) => {
    defaultKey.value = [info.node.key];
    emit('select', info.node.key);
  };

  const getRightMenuList = (node: any): Promise<ContextMenuItem[] | ContextMenuOptions> => {
    const data = [
      {
        disabled: !hasPermission('system.dictionary:update_type'),
        label: '编辑',
        handler: () => {
          emit('edit', node.eventKey);
        },
        icon: 'bi:plus',
      },
      {
        disabled: !hasPermission('system.dictionary:delete_type'),
        label: '删除',
        handler: () => {
          emit('remove', node.eventKey);
        },
        icon: 'bx:bxs-folder-open',
      },
    ];
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };
  defineExpose({ fetch });
  onMounted(() => {
    fetch();
  });
</script>
