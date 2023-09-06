<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <PrivilegeTree class="w-50" @select="handleSelect" :tenant="state.tenant" />
    <PrivilegeCheckbox ref="handleCheckRef" class="grow" :treeData="treeData" :checkedList="checkedList" @save="handleSave" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import PrivilegeTree from './PrivilegeTree.vue';
  import PrivilegeCheckbox from './PrivilegeCheckbox.vue';
  import { ref, unref, reactive } from 'vue';
  import { doTenantMenuPrivilegeTree, doMenuPrivilegeTree } from '/@/api/sys/menu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    doDepartmentPrivilegeList,
    doDepartmentPrivilegeSave,
    doPositionPrivilegeList,
    doPositionPrivilegeSave,
    doRolePrivilegeList,
    doRolePrivilegeSave,
  } from '/@/api/sys/privilege';

  const { createMessage } = useMessage();
  const { error } = createMessage;
  const treeData = ref();
  const checkedList = ref();
  const selectType = ref();
  const selectId = ref();
  const handleCheckRef = ref();

  const state = reactive({
    rowHeightVal: 0,
    tenant: {},
  });

  //获取权限组
  const getMenu = async (tenantId) => {
    let data;
    if (tenantId) {
      data = await doTenantMenuPrivilegeTree({ tenantId });
    } else {
      data = await doMenuPrivilegeTree();
    }
    treeData.value = data;
  };

  //点击字典类型事件
  const handleSelect = async (type = undefined as any, id = '', tenantId = '') => {
    console.log(type,"_",id,"_",tenantId);
    await handleCheckRef.value.onInit();
    let checked = [];
    if (!!id) {
      await getMenu(tenantId);
      selectType.value = type;
      selectId.value = id;
      if (~~type === 1) {
        checked = await doDepartmentPrivilegeList({ departmentId: id });
      } else if (~~type === 2) {
        checked = await doPositionPrivilegeList({ positionId: id });
      } else {
        checked = await doRolePrivilegeList({ roleId: id });
      }
    } else {
      treeData.value = [];
    }
    checkedList.value = checked;
  };

  //保存选中的元素
  const handleSave = async (checkIdList) => {
    if (!unref(selectType)) {
      error('请选择权限类型');
      return;
    }
    if (unref(selectType) === 1) {
      await doDepartmentPrivilegeSave({
        departmentId: unref(selectId),
        privilegeList: checkIdList,
      });
    } else if (unref(selectType) === 2) {
      await doPositionPrivilegeSave({
        positionId: unref(selectId),
        privilegeList: checkIdList,
      });
    } else {
      await doRolePrivilegeSave({ roleId: unref(selectId), privilegeList: checkIdList });
    }
  };
</script>
