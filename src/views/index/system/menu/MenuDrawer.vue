<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
    width="40%"
    showFooter
    @ok="handleOk"
  >
    <div>
      <RadioGroup
        v-model:value="type"
        style="margin-bottom: 16px; width: 100%; text-align: center"
        :disabled="isUpdate"
        button-style="solid"
      >
        <RadioButton :value="1">父级菜单</RadioButton>
        <RadioButton :value="2">子级菜单</RadioButton>
        <RadioButton :value="3">菜单权限</RadioButton>
      </RadioGroup>
      <BasicForm v-if="type === 3" @register="privilegeForm" />
      <BasicForm v-else @register="menuForm" />
    </div>
  </BasicDrawer>
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
  import { ref, unref, computed, watch, nextTick } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { menuSchemas, privilegeSchemas } from './menuDrawerData';
  import {
    doMenuDetail,
    doMenuSave,
    doMenuTree,
    doPrivilegeDetail,
    doPrivilegeSave,
  } from '/@/api/sys/menu';
  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(false);
  const meunId = ref();
  const type = ref(1);

  const [
    privilegeForm,
    {
      setFieldsValue: setPrivilegeFieldsValue,
      validate: validatePrivilege,
      resetFields: resetPrivilegeFields,
      updateSchema: updatePrivilegeSchema,
    },
  ] = useForm({
    labelWidth: 120,
    schemas: privilegeSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const [
    menuForm,
    {
      setFieldsValue: setMenuFieldsValue,
      validate: validateMenu,
      resetFields: resetMenuFields,
      updateSchema: updateMenuSchema,
    },
  ] = useForm({
    labelWidth: 120,
    schemas: menuSchemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });

  const getTitle = computed(() => {
    let title = '';
    title += !unref(isUpdate) ? '新增' : '编辑';
    title += ~~unref(type) === 3 ? '权限信息' : '菜单信息';
    return title;
  });

  //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    isUpdate.value = data.isUpdate;
    meunId.value = data.id;
    if (data.type) {
      type.value = data.type;
    } else {
      type.value = 1;
    }
    nextTick(() => {
      if (~~unref(type) === 3) {
        privilegeUpdate(unref(meunId));
      } else {
        menuUpdate(unref(meunId));
      }
    });
  });

  watch(
    () => type.value,
    (visible) => {
      nextTick(() => {
        if (~~visible === 3) {
          privilegeUpdate(unref(meunId));
        } else {
          menuUpdate(unref(meunId));
        }
      });
    },
  );

  const menuUpdate = async (id) => {
    setDrawerProps({ confirmLoading: false });
    resetMenuFields();
    const treeData = await doMenuTree({ topName: '默认', isShowPrivilege: 0 });
    updateMenuSchema([
      {
        field: 'id',
        show: !unref(isUpdate),
        componentProps: { disabled: unref(isUpdate) },
      },
      {
        field: 'parentId',
        componentProps: { treeData, disabled: unref(isUpdate) },
      },
    ]);
    if (unref(isUpdate)) {
      const { isOpen, hideMenu, parentId, ...menu } = await doMenuDetail({ id: id });
      setMenuFieldsValue({
        ...menu,
        parentId: parentId === null ? '' : parentId,
        isOpen: isOpen === 0 ? false : true,
        hideMenu: hideMenu === 0 ? false : true,
      });
    }
  };

  const privilegeUpdate = async (id) => {
    setDrawerProps({ confirmLoading: false });
    resetPrivilegeFields();
    const treeData = await doMenuTree({ topName: '默认' });

    updatePrivilegeSchema([
      {
        field: 'id',
        show: !unref(isUpdate),
        componentProps: { disabled: unref(isUpdate) },
      },
      {
        field: 'menuId',
        componentProps: { treeData, disabled: unref(isUpdate) },
      },
    ]);
    if (unref(isUpdate)) {
      const { isOpen, ...privilege } = await doPrivilegeDetail({ id: id });
      setPrivilegeFieldsValue({
        ...privilege,
        isOpen: isOpen === 0 ? false : true,
      });
    }
  };
  //保存
  const handleOk = async () => {
    ~~unref(type) === 3 ? savePrivilege() : saveMenu();
  };
  //保存权限
  const savePrivilege = async () => {
    try {
      const { isOpen, ...values } = await validatePrivilege();
      await doPrivilegeSave({
        isOpen: isOpen === true ? 1 : 0,
        ...values,
      });
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };
  //保存菜单
  const saveMenu = async () => {
    try {
      const { isOpen, hideMenu, ...values } = await validateMenu();
      await doMenuSave({
        isOpen: isOpen === true ? 1 : 0,
        hideMenu: hideMenu === true ? 1 : 0,
        ...values,
      });
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };
</script>
