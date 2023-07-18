<template>
  <BasicTree 
    toolbar
    search
    size="small"
    title="目录"
    defaultExpandAll
    ref="platformJoinTree"
    :selectedKeys="defaultKey"
    :fieldNames="stats.fieldNames"
    :clickRowToExpand="false"
    :treeData="stats.treeData"
    @select="handleSelect"
  />
</template>
<script lang="ts" setup>
  import { reactive,ref,unref,watch,onMounted} from 'vue';
  import { isEmpty } from '/@/utils/is';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { doPlatformCatalogTree } from '/@/api/video/platform';

  const emit = defineEmits(['select', 'register']);
  const defaultKey = ref([]) as any;
  const platformJoinTree = ref<Nullable<TreeActionType>>(null);
  const props = defineProps({
    serverGbId: {
      type: String,
    },
  });
  const stats = reactive({
    fieldNames:{
      key:"id",
      title:"name"
    },
    treeData:[]
  })
  watch(
    () => props.serverGbId,
    () => {
      fetch(props.serverGbId);
    },
  );

  const fetch = async (serverGbId)=>{
    if(isEmpty(serverGbId)) return;
    stats.treeData = (await doPlatformCatalogTree({platformId:serverGbId}));
    if (unref(stats.treeData) && unref(stats.treeData).length > 0) {
      defaultKey.value = [unref(stats.treeData)[0]['id']];
      unref(platformJoinTree)?.setSelectedKeys(unref(defaultKey));
      emit('select', defaultKey.value);
    }
  }

  const handleSelect = (_,info) =>{
    emit('select', [info.node.key]);
  }

  onMounted( ()=>{
    fetch(props.serverGbId);
  })

</script>