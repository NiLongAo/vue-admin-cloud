<template>
  <SubList :modelValue="sublistState.data" :columns="columns" :model="sublistState.model" />
</template>

<script lang="ts" setup>
  import SubList from '/@/components/Activiti/sublist/SubList.vue';
  import { BasicColumn } from '/@/components/Table';
  import { reactive } from 'vue';
  const sublistState = reactive({
    data: [
      {
        name: 12,
        name7: 12,
        name1: 12,
      },
    ],
    model: {
      name: '',
      name7: '',
      name1: '',
    },
  });
  const columns: BasicColumn[] = [
    {
      title: '输入框',
      dataIndex: 'name',
      editRow: true,
      editComponentProps: {
        prefix: '$',
      },
      width: 150,
    },
    {
      title: '默认输入状态',
      dataIndex: 'name7',
      editRow: true,
      width: 150,
    },
    {
      title: '输入框校验',
      dataIndex: 'name1',
      editRow: true,
      align: 'left',
      // 默认必填校验
      editRule: true,
      width: 150,
    },
  ];
</script>
