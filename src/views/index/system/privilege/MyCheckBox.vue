<template>
  <template v-for="(value, index) in treedata">
    <div class="ml-10 flex flex-col content-around pt-4" v-if="value.type === 1" :key="index">
      <div class="pr-6">
        <Checkbox
          class="select-none"
          :value="value.v"
          :indeterminate="value.indeterminate"
          v-model:checked="value.checked"
          @change="(e) => subChange(e, value.v)"
          >{{ value.k }}</Checkbox
        >
      </div>
      <MyCheckBox :treeData="value.children" @subset="subChan" />
    </div>
    <div
      class="ml-10 flex flex-col content-around pt-4"
      v-else-if="value.type === 2"
      :key="value.k"
    >
      <div class="pr-6">
        <Checkbox
          class="select-none"
          :value="value.v"
          v-model:checked="value.checked"
          :indeterminate="value.indeterminate"
          @change="(e) => subChange(e, value.v)"
          >{{ value.k }}</Checkbox
        >
      </div>
      <div class="ml-10 flex flex-wrap content-around pt-4">
        <MyCheckBox :treeData="value.children" @subset="subChan" />
      </div>
    </div>
    <template v-else>
      <div class="pr-6" :key="index">
        <Checkbox
          class="select-none"
          :value="value.v"
          v-model:checked="value.checked"
          :indeterminate="value.indeterminate"
          @change="(e) => subChange(e, value.v)"
        >
          {{ value.k }}
        </Checkbox>
      </div>
    </template>
  </template>
</template>

<script lang="ts" setup>
  import { Checkbox } from 'ant-design-vue';

  import { defineProps, computed } from 'vue';

  const emit = defineEmits(['subset']);

  export interface CheckboxGroupEntity {
    parentId?: string;
    k: string;
    type: number;
    indeterminate?: boolean;
    checked?: boolean;
    v: string;
    children: Array<CheckboxGroupEntity>;
  }

  const props = defineProps({
    treeData: {
      type: Array as PropType<CheckboxGroupEntity[]>,
    },
  });
  const treedata = computed(() => {
    return props.treeData;
  });
  const subChange = (e, v) => {
    let flag = e.target.checked;
    emit('subset', { flag: flag, v: v });
  };

  const subChan = (v) => {
    emit('subset', v);
  };
</script>
