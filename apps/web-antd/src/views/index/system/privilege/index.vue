<script lang="ts" setup>
import { computed, ref, unref, watch } from 'vue';

import { useAccess } from '@vben/access';
import { Page } from '@vben/common-ui';

import { VbenTree } from '@vben-core/shadcn-ui';

import { InputSearch, message, Radio } from 'ant-design-vue';

import {
  doDepartmentPrivilegeList,
  doDepartmentPrivilegeSave,
  doDepartmentTree,
} from '#/api/sys/department';
import { doMenuPrivilegeTree, doTenantMenuPrivilegeTree } from '#/api/sys/menu';
import {
  doPositionPrivilegeList,
  doPositionPrivilegeSave,
  doPositionTree,
} from '#/api/sys/position';
import {
  doAll,
  doRolePrivilegeList,
  doRolePrivilegeSave,
} from '#/api/sys/role';

import PrivilegeCheckbox from './modules/PrivilegeCheckbox.vue';

const { hasAccessByCodes } = useAccess();

const type = ref(1);
const vbenTreeData = ref<any[]>([]);
const selectTreeId = ref<number | string | undefined>();
const treeData = ref<any[]>([]);
const tenant = ref([]);
const checkedList = ref<string[]>([]);
const selectId = ref<number | string>();
const treeKeyword = ref('');

const treeTitle = computed(() => {
  if (type.value === 1) return '部门信息';
  if (type.value === 2) return '职位信息';
  return '角色信息';
});

function filterTree(nodes: any[], keyword: string): any[] {
  return nodes
    .map((node) => {
      const children = filterTree(node.children ?? [], keyword);
      const matched = String(node.name ?? '')
        .toLowerCase()
        .includes(keyword);
      if (matched || children.length > 0) {
        return { ...node, children };
      }
      return undefined;
    })
    .filter(Boolean);
}

const filteredTreeData = computed(() => {
  const keyword = treeKeyword.value.trim().toLowerCase();
  if (!keyword) return vbenTreeData.value;
  return filterTree(vbenTreeData.value, keyword);
});

function formatTreeNode(
  item: any,
  keyField: string,
  titleField: string,
  tenantIdField: string,
) {
  item.key = item[keyField];
  item.id = item[keyField];
  item.name = item[titleField];
  item.tenantId = item[tenantIdField];
  if (item.children?.length > 0) {
    item.children = item.children.map((child: any) =>
      formatTreeNode(child, keyField, titleField, tenantIdField),
    );
  }
  return item;
}

async function getMenu(tenantId?: number) {
  const data = await (tenantId
    ? doTenantMenuPrivilegeTree({ tenantId })
    : doMenuPrivilegeTree());
  treeData.value = data;
}

async function handleSelect({ bind = {} as any }) {
  const current = bind.value;
  const currentId = current?.id;

  if (!currentId) {
    selectId.value = undefined;
    treeData.value = [];
    checkedList.value = [];
    return;
  }

  if (selectId.value === currentId) {
    return;
  }

  selectId.value = currentId;
  await getMenu(current.tenantId);

  if (Math.trunc(type.value) === 1) {
    checkedList.value = await doDepartmentPrivilegeList({
      departmentId: currentId,
    });
  } else if (Math.trunc(type.value) === 2) {
    checkedList.value = await doPositionPrivilegeList({
      positionId: currentId,
    });
  } else {
    checkedList.value = await doRolePrivilegeList({ roleId: currentId });
  }
}

async function handleSave(privilegeList: string[]) {
  if (!unref(type) || !unref(selectId)) {
    message.error('请选择权限类型');
    return;
  }

  if (unref(type) === 1) {
    await doDepartmentPrivilegeSave({
      departmentId: unref(selectId),
      privilegeList,
    });
  } else if (unref(type) === 2) {
    await doPositionPrivilegeSave({
      positionId: unref(selectId),
      privilegeList,
    });
  } else {
    await doRolePrivilegeSave({
      menuIdList: privilegeList,
      roleId: unref(selectId),
    });
  }
  message.success('保存成功');
}

watch(
  () => type.value,
  async (value) => {
    if (value === 1) {
      const departmentTree = await doDepartmentTree({ ...tenant.value });
      vbenTreeData.value = departmentTree.map((item: any) =>
        formatTreeNode(item, 'id', 'departmentName', 'tenantId'),
      );
    } else if (value === 2) {
      const positionTree = await doPositionTree({ ...tenant.value });
      vbenTreeData.value = positionTree.map((item: any) =>
        formatTreeNode(item, 'id', 'positionName', 'tenantId'),
      );
    } else {
      const roleTree = await doAll({ ...tenant.value });
      vbenTreeData.value = roleTree.map((item: any) =>
        formatTreeNode(item, 'roleId', 'roleName', 'tenantId'),
      );
    }

    selectId.value = undefined;
    treeKeyword.value = '';
    if (vbenTreeData.value.length > 0) {
      selectTreeId.value = vbenTreeData.value[0].id;
      await handleSelect({ bind: { value: vbenTreeData.value[0] } });
    } else {
      selectTreeId.value = undefined;
      treeData.value = [];
      checkedList.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <Page
    auto-content-height
    content-class="overflow-hidden bg-background-deep p-4"
  >
    <div
      class="grid h-full min-h-0 gap-4 overflow-auto lg:grid-cols-[280px_minmax(0,1fr)] lg:overflow-hidden"
    >
      <aside
        class="flex min-h-[280px] flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:min-h-0"
      >
        <div class="border-b border-border p-3">
          <Radio.Group
            v-model:value="type"
            button-style="solid"
            class="privilege-type-tabs flex w-full"
          >
            <Radio.Button :value="1">部门</Radio.Button>
            <Radio.Button :value="2">职位</Radio.Button>
            <Radio.Button :value="3">角色</Radio.Button>
          </Radio.Group>

          <div class="mt-3 flex items-center gap-2">
            <span class="shrink-0 text-sm font-medium">{{ treeTitle }}</span>
            <InputSearch
              v-model:value="treeKeyword"
              allow-clear
              placeholder="搜索"
              size="small"
              class="min-w-0 flex-1"
            />
          </div>
        </div>

        <VbenTree
          v-model="selectTreeId"
          :tree-data="filteredTreeData"
          class="privilege-source-tree min-h-0 flex-1 overflow-auto p-3"
          label-field="name"
          value-field="id"
          @select="handleSelect"
        />
      </aside>

      <section
        class="min-h-[360px] overflow-hidden rounded-lg border border-border bg-card shadow-sm lg:min-h-0"
      >
        <PrivilegeCheckbox
          v-model:checked-list="checkedList"
          :show-save="hasAccessByCodes(['system.privilege:save'])"
          :tree-data="treeData"
          @save="handleSave"
        />
      </section>
    </div>
  </Page>
</template>

<style scoped>
.privilege-type-tabs :deep(.ant-radio-button-wrapper) {
  flex: 1;
  text-align: center;
}

.privilege-source-tree :deep(> div:first-child) {
  display: none;
}
</style>
