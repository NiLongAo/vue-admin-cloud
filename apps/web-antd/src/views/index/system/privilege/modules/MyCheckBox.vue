<script lang="ts" setup>
import type { CheckboxGroupEntity } from '../model';

import { computed } from 'vue';

import { Checkbox } from 'ant-design-vue';

const props = defineProps({
  level: {
    default: 0,
    type: Number,
  },
  treeData: {
    default: () => [],
    type: Array<CheckboxGroupEntity>,
  },
});

const emit = defineEmits<{
  subset: [payload: { flag: boolean; id: string }];
}>();

const treedata = computed(() => props.treeData);

const isButtonLevel = computed(() =>
  props.treeData.every((item) => item.type === 3),
);

function subChange(e: any, id: string) {
  const flag = e.target.checked;
  emit('subset', { flag, id });
}
</script>

<template>
  <div
    v-if="isButtonLevel"
    class="flex flex-wrap gap-x-5 gap-y-2 py-2 pl-0 md:pl-6"
  >
    <div
      v-for="value in treedata"
      :key="value.id"
      class="rounded-md bg-muted/40 px-2.5 py-1.5"
    >
      <Checkbox
        v-model:checked="value.checked"
        class="select-none"
        :indeterminate="value.indeterminate"
        :value="value.id"
        @change="(e) => subChange(e, value.id)"
      >
        {{ value.menuName }}
      </Checkbox>
    </div>
  </div>

  <div v-else>
    <div
      v-for="value in treedata"
      :key="value.id"
      class="flex flex-col"
      :class="
        value.parentId
          ? 'border-l border-border/70 pl-4 md:ml-4 md:pl-5'
          : 'mb-3 rounded-lg border border-border bg-background px-4 py-3 shadow-xs'
      "
    >
      <div class="pb-2">
        <Checkbox
          v-model:checked="value.checked"
          class="select-none font-medium"
          :indeterminate="value.indeterminate"
          :value="value.id"
          @change="(e) => subChange(e, value.id)"
        >
          {{ value.menuName }}
        </Checkbox>
      </div>
      <MyCheckBox
        v-if="value.children?.length > 0"
        :level="level + 1"
        :tree-data="value.children"
        @subset="$emit('subset', $event)"
      />
    </div>
  </div>
</template>
