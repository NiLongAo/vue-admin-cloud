<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <PrivilegeTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <PrivilegeCheckbox
      ref="handleCheckRef"
      class="w-3/4 xl:w-4/5"
      :treeData="treeData"
      :checkedList="checkedList"
    />
  </PageWrapper>
</template>
<script ang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import PrivilegeTree from './PrivilegeTree.vue';
  import PrivilegeCheckbox from './PrivilegeCheckbox.vue';
  import { ref, onMounted } from 'vue';
  import { doMenuPrivilegeTree } from '/@/api/sys/menu';

  const treeData = ref();
  const checkedList = ref();
  //初始化
  onMounted(() => {
    getMenu();
    getChecked();
  });

  //获取权限组
  const getMenu = async () => {
    const data = await doMenuPrivilegeTree();
    treeData.value = data;
  };
  //获取当前选中权限
  const getChecked = () => {};

  //点击字典类型事件
  const handleSelect = (type = undefined, id = '') => {
    console.log(type, id);
  };

  //获取选中的元素
  const handleTypeSuccess = () => {
    //刷新字典类型树
    let checkList = handleCheckRef.value.handleCheck();
    console.log(checkList);
  };
</script>
