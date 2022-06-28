<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <div>
      <RadioGroup
        v-model:value="type"
        style="margin: 10px 0; width: 100%; text-align: center"
        button-style="solid"
      >
        <RadioButton :value="1">部门</RadioButton>
        <RadioButton :value="2">职位</RadioButton>
        <RadioButton :value="3">角色</RadioButton>
      </RadioGroup>
    </div>
    <BasicTree
      :title="getTitle"
      toolbar
      showLine
      search
      ref="asyncExpandTreeRef"
      :fieldNames="{ key: ketFields, title: titleFields }"
      :clickRowToExpand="false"
      :treeData="treeData"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { Radio } from 'ant-design-vue';
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: {
      RadioGroup: Radio.Group,
      RadioButton: Radio.Button,
    },
  });
</script>
<script lang="ts" setup>
  import { onMounted, ref, unref, watch, nextTick } from 'vue';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree';
  import { doAll } from '/@/api/sys/role';
  import { doDepartmentTree } from '/@/api/sys/department';
  import { doPositionTree } from '/@/api/sys/position';

  const emit = defineEmits(['select', 'edit', 'remove']);
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
  const type = ref(1);
  const ketFields = ref();
  const getTitle = ref();
  const titleFields = ref();
  const departmentData = ref<TreeItem[]>([]);
  const positionData = ref<TreeItem[]>([]);
  const roleData = ref<TreeItem[]>([]);
  const treeData = ref<TreeItem[]>([]);
  const defaultKey = ref();

  function getTree() {
    const tree = unref(asyncExpandTreeRef);
    if (!tree) {
      throw new Error('tree is null!');
    }
    return tree;
  }

  watch(
    () => type.value,
    (visible) => {
      if (unref(visible) === 1) {
        ketFields.value = 'id';
        titleFields.value = 'departmentName';
        getTitle.value = '部门信息';
        treeData.value = unref(departmentData);
      } else if (unref(visible) === 2) {
        ketFields.value = 'id';
        titleFields.value = 'positionName';
        getTitle.value = '职位信息';
        treeData.value = unref(positionData);
      } else {
        ketFields.value = 'roleId';
        titleFields.value = 'roleName';
        getTitle.value = '角色信息';
        treeData.value = unref(roleData);
      }
      if (unref(treeData) && unref(treeData).length > 0) {
        defaultKey.value = [unref(treeData)[0][unref(ketFields)]];
      }
      // 展开全部
      nextTick(() => {
        getTree().checkAll(false);
        getTree().setSelectedKeys(unref(defaultKey));
        const node = getTree().getSelectedNode(unref(defaultKey));
        emit('select', unref(type), node?.id, node?.tenantTd);
      });
    },
  );

  //初步加载
  const fetch = async () => {
    //部门信息
    departmentData.value = (await doDepartmentTree({})) as unknown as TreeItem[];
    //职位信息
    positionData.value = (await doPositionTree({})) as unknown as TreeItem[];
    //角色信息
    roleData.value = (await doAll()) as unknown as TreeItem[];

    ketFields.value = 'id';
    titleFields.value = 'departmentName';
    getTitle.value = '部门信息';
    treeData.value = unref(departmentData);
    if (unref(treeData) && unref(treeData).length > 0) {
      defaultKey.value = [unref(treeData)[0][unref(ketFields)]];
    }
    // 展开全部
    nextTick(() => {
      getTree().expandAll(true);
      getTree().setSelectedKeys(unref(defaultKey));
      const node = getTree().getSelectedNode(unref(defaultKey));
      emit('select', 1, node?.id, node?.tenantTd);
    });
  };

  const handleSelect = (keys) => {
    nextTick(() => {
      const node = getTree().getSelectedNode(keys[0]);
      emit('select', unref(type), node?.id, node?.tenantTd);
    });
  };

  onMounted(() => {
    fetch();
  });
</script>
