<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { computed, ref, unref, watch } from 'vue';

import { cloneDeep } from '@vben/utils';

import { Button } from 'ant-design-vue';

import MyCheckBox from './MyCheckBox.vue';

const props = defineProps({
  showSave: {
    default: false,
    type: Boolean,
  },
  treeData: {
    default: () => [],
    type: Array<CheckboxGroupEntity>,
  },
});

const emit = defineEmits<{
  save: [ids: string[]];
}>();

const checkedList = defineModel<string[]>('checkedList', { default: () => [] });
const dataTree = ref<CheckboxGroupEntity[]>([]);
const tree = ref<CheckboxGroupEntity[]>([]);
const last = ref<string[]>([]);
const isInternal = ref(false);
const selected = ref(new Set(unref(checkedList)));
const idMap = ref(new Map<string, CheckboxGroupEntity>());
const checkedCount = computed(() => checkedList.value.length);

function onInit() {
  const lastIds: string[] = [];
  const data = cloneDeep(props.treeData) as CheckboxGroupEntity[];
  const map = new Map<string, CheckboxGroupEntity>();

  function addParentKey(
    nodes: CheckboxGroupEntity[],
    parentKey: string | undefined,
  ) {
    nodes.forEach((node) => {
      const children = node.children ?? [];
      const id = String(node.id);

      node.id = id;
      node.children = children;
      node.parentId = parentKey;
      node.indeterminate = false;
      node.checked = false;
      map.set(id, node);

      if (children.length > 0) {
        addParentKey(children, id);
      } else {
        lastIds.push(id);
      }
    });
  }

  addParentKey(data, undefined);
  last.value = lastIds;
  dataTree.value = data;
  tree.value = unref(dataTree);
  idMap.value = map;
}

watch(
  () => checkedList.value,
  (list) => {
    if (isInternal.value) return;

    isInternal.value = true;
    selected.value = new Set(list.map(String));
    onInit();
    list.forEach((id) => {
      loops(true, String(id));
    });
    tree.value = unref(dataTree);
    isInternal.value = false;
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  () => props.treeData,
  () => {
    selected.value = new Set(unref(checkedList).map(String));
    onInit();
  },
  {
    deep: true,
    immediate: true,
  },
);

async function handleSubsetChange({ flag, id }: any) {
  loops(flag, String(id));
  tree.value = unref(dataTree);
  isInternal.value = true;
  checkedList.value = [...selected.value];
  isInternal.value = false;
}

function loops(flag: boolean, id: string) {
  const item = unref(idMap).get(id);
  if (!item) return;

  handleCascade(item, flag);
}

function selectAllChildren(item: CheckboxGroupEntity, flag: boolean) {
  if (!item.children) return;

  item.children.forEach((child) => {
    child.checked = flag;
    child.indeterminate = false;
    updateSelected(flag, child.id);
    selectAllChildren(child, flag);
  });
}

function handleCascade(item: CheckboxGroupEntity, flag: boolean) {
  item.checked = flag;
  item.indeterminate = false;
  updateSelected(flag, item.id);

  if (item.children?.length > 0) {
    selectAllChildren(item, flag);
  }

  if (item.parentId) {
    updateCascadeParentOnly(item.parentId);
  }
}

function updateCascadeParentOnly(parentId: string) {
  const parent = getItem(parentId);
  if (!parent?.children?.length) return;

  const allChecked = parent.children.every((child) => child.checked);
  const someChecked = parent.children.some(
    (child) => child.checked || child.indeterminate,
  );

  if (allChecked) {
    parent.checked = true;
    parent.indeterminate = false;
    updateSelected(true, parent.id);
  } else if (someChecked) {
    parent.checked = false;
    parent.indeterminate = true;
    updateSelected(false, parent.id);
  } else {
    parent.checked = false;
    parent.indeterminate = false;
    updateSelected(false, parent.id);
  }

  if (parent.parentId) {
    updateCascadeParentOnly(parent.parentId);
  }
}

function getItem(id: string) {
  return unref(idMap).get(id);
}

function updateSelected(flag: boolean, id: string) {
  if (flag) {
    selected.value.add(id);
  } else {
    selected.value.delete(id);
  }
}

function handleSave() {
  const resultArray = unref(checkedList)
    .map(String)
    .filter((item) => unref(last).includes(item));
  emit('save', resultArray);
}

defineExpose({ onInit });
</script>

<template>
  <div class="flex h-full flex-col">
    <div
      class="flex shrink-0 flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="min-w-0">
        <div class="text-base font-medium">权限配置</div>
        <div class="mt-1 text-xs text-muted-foreground">
          已选择 {{ checkedCount }} 项权限
        </div>
      </div>

      <Button v-if="showSave" type="primary" @click="handleSave">保存</Button>
    </div>

    <div class="min-h-0 flex-1 overflow-auto p-4">
      <MyCheckBox :tree-data="tree" @subset="handleSubsetChange" />
    </div>
  </div>
</template>
