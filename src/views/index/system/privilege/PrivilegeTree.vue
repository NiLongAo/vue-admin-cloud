<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <RadioGroup
      v-model:value="type"
      style="margin: 10px 0; width: 100%; text-align: center"
      button-style="solid"
    >
      <RadioButton :value="1">部门</RadioButton>
      <RadioButton :value="2">职位</RadioButton>
      <RadioButton :value="3">角色</RadioButton>
    </RadioGroup>
    <BasicTree
      :title="getTitle"
      toolbar
      showLine
      search
      :selectedKeys="defaultKey"
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

  const props = defineProps({
    tenant: {
      type: Object as PropType<Recordable>,
    },
  });
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
  const defaultKey = ref([]) as any;

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
      // 展开全部
      nextTick(() => {
        if (unref(treeData) && unref(treeData).length > 0) {
          defaultKey.value = [unref(treeData)[0][unref(ketFields)]];
          getTree().expandAll(true);
          getTree().checkAll(false);
          getTree().setSelectedKeys(unref(defaultKey));
          const node: any = getTree().getSelectedNode(unref(defaultKey)[0]);
          emit('select', unref(type), node[unref(ketFields)], node?.tenantId);
        } else {
          getTree().checkAll(false);
          treeData.value = [];
          emit('select', unref(type), null, null);
        }
      });
    },
  );

  watch(
    () => props.tenant,
    async (visible) => {
      await dataApi();
      if (unref(type) === 1) {
        ketFields.value = 'id';
        titleFields.value = 'departmentName';
        getTitle.value = '部门信息';
        treeData.value = unref(departmentData);
      } else if (unref(type) === 2) {
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

      // 展开全部
      nextTick(() => {
        if (unref(treeData) && unref(treeData).length > 0) {
          defaultKey.value = [unref(treeData)[0][unref(ketFields)]];
          getTree().expandAll(true);
          getTree().checkAll(false);
          getTree().setSelectedKeys(unref(defaultKey));
          const node: any = getTree().getSelectedNode(unref(defaultKey)[0]);
          emit('select', unref(type), node[unref(ketFields)], node?.tenantId);
        } else {
          getTree().checkAll(false);
          treeData.value = [];
          emit('select', unref(type), null, null);
        }
      });
    },
  );

  const dataApi = async () => {
    //部门信息
    departmentData.value = (await doDepartmentTree({ ...props.tenant })) as unknown as TreeItem[];
    //职位信息
    positionData.value = (await doPositionTree({ ...props.tenant })) as unknown as TreeItem[];
    //角色信息
    roleData.value = (await doAll({ ...props.tenant })) as unknown as TreeItem[];
  };

  //初步加载
  const fetch = async () => {
    await dataApi();
    ketFields.value = 'id';
    titleFields.value = 'departmentName';
    getTitle.value = '部门信息';
    treeData.value = unref(departmentData);
    // 展开全部
    nextTick(() => {
      if (unref(treeData) && unref(treeData).length > 0) {
        defaultKey.value = [unref(treeData)[0][unref(ketFields)]];
        getTree().expandAll(true);
        getTree().checkAll(false);
        getTree().setSelectedKeys(unref(defaultKey));
        const node: any = getTree().getSelectedNode(unref(defaultKey)[0]);
        emit('select', 1, node[unref(ketFields)], node?.tenantId);
      } else {
        getTree().checkAll(false);
        treeData.value = [];
        emit('select', unref(type), null, null);
      }
    });
  };

  const handleSelect = (keys,info) => {
    nextTick(() => {
      defaultKey.value = [info.node.key];
      const node: any = getTree().getSelectedNode(keys[0]);
      if (node) {
        emit('select', unref(type), node[unref(ketFields)], node?.tenantId);
      } else {
        emit('select', unref(type), null, null);
      }
    });
  };

  onMounted(() => {
    fetch();
  });
</script>
