<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="字典类型"
      toolbar
      search
      :replaceFields="{ key: 'typeId', title: 'name' }"
      :clickRowToExpand="false"
      :beforeRightClick="getRightMenuList"
      :treeData="treeData"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { BasicTree, TreeItem, ContextMenuItem } from '/@/components/Tree';
  import { doDictionaryTypeList } from '/@/api/sys/dictionary';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const treeData = ref<TreeItem[]>([]);
  const emit = defineEmits(['select', 'edit', 'remove']);

  const fetch = async () => {
    treeData.value = (await doDictionaryTypeList()) as unknown as TreeItem[];
  };

  const handleSelect = (keys) => {
    emit('select', keys[0]);
  };

  const getRightMenuList = (node: any): ContextMenuItem[] => {
    return [
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
  };
  defineExpose({ fetch });
  onMounted(() => {
    fetch();
  });
</script>
