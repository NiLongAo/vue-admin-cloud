<template>
  <div>
    <BasicTree
      title="目录"
      toolbar
      search
      size="small"
      :selectedKeys="defaultKey"
      ref="platformJoinTree"
      :fieldNames="stats.fieldNames"
      :clickRowToExpand="false"
      :beforeRightClick="getRightMenuList"
      :treeData="stats.treeData"
      @select="handleSelect"
    />
    <PlatformCatalogModel @register="registerModal" @success="handleCatalogSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, watch, onMounted, nextTick } from 'vue';
  import { useModal } from '@/components/Modal';
  import { isEmpty } from '@/utils/is';
  import {
    BasicTree,
    TreeItem,
    TreeActionType,
    ContextMenuItem,
    ContextMenuOptions,
  } from '@/components/Tree';
  import {
    doPlatformCatalogTree,
    doPlatformCatalogDelete,
    doPlatformCatalogDeleteRelation,
  } from '@/api/video/platform';
  import { usePermission } from '@/hooks/web/usePermission';
  import PlatformCatalogModel from './PlatformCatalogModel.vue';

  const emit = defineEmits(['select', 'clean']);
  const { hasPermission } = usePermission();
  const [registerModal, { openModal }] = useModal();

  const defaultKey = ref([]) as any;
  const platformJoinTree = ref<Nullable<TreeActionType>>(null);
  const props = defineProps({
    serverGbId: {
      type: String,
    },
  });
  const stats = reactive({
    fieldNames: {
      key: 'id',
      title: 'name',
    },
    treeData: [] as TreeItem[],
  });
  watch(
    () => props.serverGbId,
    () => {
      fetch(props.serverGbId);
    },
  );

  watch(
    () => defaultKey.value,
    () => {
      if (!isEmpty(defaultKey.value)) {
        emit('select', defaultKey.value[0]);
      }
    },
  );

  const fetch = async (serverGbId) => {
    if (isEmpty(serverGbId)) return;
    stats.treeData = await doPlatformCatalogTree({ platformId: serverGbId });
    if (unref(stats.treeData) && unref(stats.treeData).length > 0) {
      defaultKey.value = [unref(stats.treeData)[0]['id']];
      unref(platformJoinTree)?.setSelectedKeys(unref(defaultKey));
    }
    // 展开全部
    nextTick(() => {
      unref(platformJoinTree)?.expandAll(true);
    });
  };

  const getRightMenuList = (node: any): Promise<ContextMenuItem[] | ContextMenuOptions> => {
    const data = [
      {
        disabled: !hasPermission('system.dictionary:delete_type'),
        label: '添加下级目录',
        handler: async () => {
          openModal(true, { isUpdate: false, node });
        },
        icon: 'bx:bxs-folder-open',
      },
      {
        disabled: !hasPermission('system.dictionary:delete_type') || isEmpty(node.parentId),
        label: '编辑当前目录',
        handler: () => {
          openModal(true, { isUpdate: true, node });
        },
        icon: 'bx:bxs-folder-open',
      },
      {
        disabled: !hasPermission('system.dictionary:delete_type'),
        label: '解除国标绑定',
        handler: async () => {
          await doPlatformCatalogDeleteRelation({ id: node.id, type: 0 });
          fetch(props.serverGbId);
          emit('clean');
        },
        icon: 'bx:bxs-folder-open',
      },
      {
        disabled: !hasPermission('system.dictionary:delete_type') || isEmpty(node.parentId),
        label: '删除当前目录',
        handler: async () => {
          await doPlatformCatalogDelete({ id: node.id });
          fetch(props.serverGbId);
          emit('clean');
        },
        icon: 'bx:bxs-folder-open',
      },
    ];
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  };

  const handleSelect = (_, info) => {
    defaultKey.value = [info.node.key];
  };

  //点击字典类型编辑事件
  const handleCatalogSuccess = () => {
    //刷新字典类型树
    fetch(props.serverGbId);
  };
  onMounted(() => {
    fetch(props.serverGbId);
  });
</script>
