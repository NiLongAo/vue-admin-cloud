<script lang="ts" setup>
import type { PropType } from 'vue';

import { computed, reactive, watch } from 'vue';

import { Button, Input, Popconfirm, Select, Table } from 'ant-design-vue';

interface SubListColumn {
  customRender?: (context: {
    index: number;
    record: Record<string, any>;
  }) => any;
  dataIndex: string;
  editComponent?: 'Input' | 'Select' | string;
  editComponentProps?: Record<string, any>;
  editRow?: boolean;
  title: string;
  width?: number;
}

const props = defineProps({
  addTitle: {
    type: String,
    default: '+ 添加',
  },
  columns: {
    type: Array as PropType<SubListColumn[]>,
    required: true,
  },
  model: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  value: {
    type: Array as PropType<Array<Record<string, any>>>,
    default: () => [],
  },
});

const emit = defineEmits<{
  'update:value': [value: Array<Record<string, any>>];
}>();

const state = reactive({
  data: [] as Array<Record<string, any>>,
});

const tableColumns = computed<any[]>(() => [
  ...props.columns.map((column) => ({
    ...column,
    key: column.dataIndex,
  })),
  {
    dataIndex: '__operation',
    key: '__operation',
    title: '操作',
    width: 72,
  },
]);

function cloneRow(row: Record<string, any>) {
  return JSON.parse(JSON.stringify(row));
}

function syncData() {
  state.data = Array.isArray(props.value)
    ? props.value.map((row, index) => ({
        __key: `${index}-${JSON.stringify(row)}`,
        ...cloneRow(row),
      }))
    : [];
}

function emitChange() {
  emit(
    'update:value',
    state.data.map(({ __key, ...row }) => ({ ...row })),
  );
}

function addData() {
  state.data.push({
    __key: `${Date.now()}-${state.data.length}`,
    ...cloneRow(props.model),
  });
  emitChange();
}

function removeData(index: number) {
  state.data.splice(index, 1);
  emitChange();
}

function onCellChange() {
  emitChange();
}

function getColumnKey(column: any) {
  return String(column.dataIndex ?? '');
}

function isOperationColumn(column: any) {
  return getColumnKey(column) === '__operation';
}

function isEditableColumn(column: any) {
  return column.editRow !== false;
}

function isSelectColumn(column: any) {
  return column.editComponent === 'Select';
}

function getEditComponentProps(column: any) {
  return column.editComponentProps ?? {};
}

function renderCustomColumn(
  column: any,
  index: number,
  record: Record<string, any>,
) {
  return column.customRender?.({ index, record }) ?? '';
}

watch(() => props.value, syncData, { immediate: true });
</script>

<template>
  <div class="sublist-div">
    <Table
      bordered
      :columns="tableColumns"
      :data-source="state.data"
      :pagination="false"
      row-key="__key"
      size="small"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="isOperationColumn(column)">
          <Popconfirm title="是否删除" @confirm="removeData(index)">
            <Button danger size="small" type="link">删除</Button>
          </Popconfirm>
        </template>
        <template v-else-if="isEditableColumn(column)">
          <Select
            v-if="isSelectColumn(column)"
            v-model:value="record[getColumnKey(column)]"
            class="w-full"
            size="small"
            v-bind="getEditComponentProps(column)"
            @change="onCellChange"
          />
          <Input
            v-else
            v-model:value="record[getColumnKey(column)]"
            size="small"
            @change="onCellChange"
          />
        </template>
        <template v-else-if="column.customRender">
          {{ renderCustomColumn(column, index, record) }}
        </template>
        <template v-else>
          {{ record[getColumnKey(column)] }}
        </template>
      </template>
    </Table>
    <Button block class="mt-2" size="small" type="dashed" @click="addData">
      {{ addTitle }}
    </Button>
  </div>
</template>

<style scoped>
.sublist-div {
  width: 100%;
}
</style>
