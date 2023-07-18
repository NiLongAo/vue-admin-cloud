<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerTreeModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="800px"
  >
    <div class="bg-white m-4 mr-0 overflow-hidden">
      <Transfer
        :data-source="dataSource"
        :target-keys="idList"
        :render="(item) => item.title"
        :show-select-all="false"
        @change="onChange"
      >
        <template #children="{ direction, selectedKeys, onItemSelect }">
          <BasicTree
            v-if="direction === 'left'"
            :title="getTitle"
            toolbar
            showLine
            search
            checkable
            blockNode
            checkStrictly
            :treeData="treeData"
            :checkedKeys="[...selectedKeys, ...idList]"
            ref="asyncExpandTreeRef"
            @check="
              (_, props) => {
                onChecked(_, props, [...selectedKeys, ...idList], onItemSelect);
              }
            "
            @select="
              (_, props) => {
                onChecked(_, props, [...selectedKeys, ...idList], onItemSelect);
              }
            "
          />
        </template>
      </Transfer>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { Transfer } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { doAll } from '/@/api/sys/role';
  import { doDepartmentTree } from '/@/api/sys/department';
  import { doPositionTree } from '/@/api/sys/position';
  import { ref, unref, computed, nextTick } from 'vue';

  interface TreeDataItem {
    key: string;
    title: string;
    disabled?: boolean;
    children?: TreeDataItem[];
  }

  const emit = defineEmits(['success', 'register']);
  const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
  const type = ref();
  const idList = ref<string[]>([]);
  const dataData = ref<TreeDataItem[]>([]);

  const getTitle = computed(() => {
    let title = '';
    if (unref(type) === 1) {
      title = '编辑角色';
    } else if (unref(type) === 2) {
      title = '编辑部门';
    } else {
      title = '编辑职位';
    }
    return title;
  });

  const treeData = computed(() => {
    return handleTreeData(dataData.value, idList.value);
  });

  const dataSource = computed(() => {
    return handleSourceData(dataData.value);
  });

  const [registerTreeModal, { setModalProps: setTreeModalProps, closeModal: closeTreeModal }] =
    useModalInner(async (data) => {
      setTreeModalProps({ confirmLoading: false });
      idList.value = [];
      dataData.value = [];
      type.value = data.type;
      if (unref(type) === 1) {
        const roleList = await doAll({});
        //角色信息
        dataData.value = transformation('roleId', 'roleName', roleList);
      } else if (unref(type) === 2) {
        //部门信息
        const departmenList = await doDepartmentTree({});
        dataData.value = transformation('id', 'departmentName', departmenList);
      } else {
        //职位信息
        const positionList = await doPositionTree({});
        dataData.value = transformation('id', 'positionName', positionList);
      }
      idList.value = data.idList;
      // 展开全部
      nextTick(() => {
        unref(asyncExpandTreeRef)?.expandAll(true);
      });
    });

  //对象转换
  const transformation = (key1, title1, list) => {
    let ListItem1 = list.map((obj) => {
      let ListItem2 = undefined;
      if (obj.children && obj.children.length > 0) {
        ListItem2 = transformation(key1, title1, obj.children);
      }
      return { key: String(obj[key1]), title: obj[title1], children: ListItem2 };
    });
    return ListItem1;
  };
  //转换eTreeData
  const handleTreeData = (data, targetKeys) => {
    let tree = data.map((item) => {
      let tree1 = undefined;
      if (item.children) {
        tree1 = handleTreeData(item.children, targetKeys);
      }
      return { ...item, disabled: targetKeys.includes(item.key), children: tree1 };
    });
    return tree;
  };
  //转换eTreeData
  const handleSourceData = (data) => {
    const transferDataSource = [] as any;
    data.map((item) => {
      const { children, ...obj } = item;
      let entity = [];
      if (children) {
        entity = handleSourceData(children);
      }
      transferDataSource.push(obj, ...entity);
    });
    return transferDataSource;
  };

  const onChecked = (
    _: Record<string, string[]>,
    e,
    checkedKeys: string[],
    onItemSelect: (n: any, c: boolean) => void,
  ) => {
    const { eventKey } = e.node;
    onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
  };

  function isChecked(selectedKeys: string[], eventKey: string) {
    return selectedKeys.indexOf(eventKey) !== -1;
  }
  const handleSubmit = () => {
    emit('success', unref(type), unref(idList));
    closeTreeModal();
  };

  const onChange = (keys) => {
    idList.value = keys;
  };
</script>
