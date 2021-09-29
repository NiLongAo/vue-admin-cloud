<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <TypeTree
      ref="TypeTreeRef"
      class="w-1/4 xl:w-1/5"
      @select="handleSelect"
      @edit="handleTypeEdit"
      @remove="handleTypeRemove"
    />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          @click="handleTypeCreate"
          v-if="hasPermission('system.dictionary:add_type')"
          >新增类型</a-button
        >
        <a-button
          type="primary"
          @click="handleCreate"
          v-if="hasPermission('system.dictionary:add_item')"
          >新增条目</a-button
        >
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.dictionary:update_item'),
              icon: 'clarity:note-edit-line',
              //tooltip: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.dictionary:delete_item'),
              icon: 'ant-design:delete-outlined',
              color: 'error',
              //tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <DictionaryItemDrawer @register="register" @success="handleSuccess" />
    <DictionaryTypeModal @register="registerModal" @success="handleTypeSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { useDrawer } from '/@/components/Drawer';
  import { useModal } from '/@/components/Modal';
  import TypeTree from './TypeTree.vue';
  import DictionaryItemDrawer from './DictionaryItemDrawer.vue';
  import DictionaryTypeModal from './DictionaryTypeModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    doDictionaryTypeRemove,
    doDictionaryItemPage,
    doDictionaryItemRemove,
  } from '/@/api/sys/dictionary';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const TypeTreeRef = ref();
  const searchInfo = reactive<Recordable>({});
  const [register, { openDrawer }] = useDrawer();
  const [registerModal, { openModal }] = useModal();
  const { createConfirm } = useMessage();

  const [registerTable, { reload }] = useTable({
    title: '字典条目列表',
    api: doDictionaryItemPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    useSearchForm: true,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      width: 160,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `name`,
          label: `字典条目名称`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
      ],
    };
  }

  function getBasicColumns(): BasicColumn[] {
    return [
      {
        title: '条目编号',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
      },
      {
        title: '排序',
        dataIndex: 'sort',
        fixed: 'left',
        width: 100,
      },
      {
        title: '字典条目名称',
        dataIndex: 'name',
        width: 200,
      },
      {
        title: '字典条目值',
        dataIndex: 'value',
        width: 200,
      },
    ];
  }

  //点击字典类型事件
  const handleSelect = (typeId = '') => {
    searchInfo.typeId = typeId;
    reload();
  };
  //点击字典类型新增事件
  const handleTypeCreate = () => {
    openModal(true, { isUpdate: false, id: undefined });
  };

  //点击字典类型修改事件
  const handleTypeEdit = (id = '') => {
    openModal(true, { isUpdate: true, id: id });
  };

  //点击字典类型删除事件
  const handleTypeRemove = async (id = '') => {
    createConfirm({
      iconType: 'error',
      title: '删除操作',
      content: '确定删除此字典类型？',
      onOk: async () => {
        await doDictionaryTypeRemove({ id: id });
        TypeTreeRef.value.fetch();
      },
    });
  };
  //点击字典类型编辑事件
  const handleTypeSuccess = () => {
    //刷新字典类型树
    TypeTreeRef.value.fetch();
  };

  //新增条目
  const handleCreate = (record: Recordable) => {
    console.log(record);
    openDrawer(true, { id: undefined, typeId: searchInfo.typeId });
    reload();
  };
  //编辑条目
  const handleEdit = (record: Recordable) => {
    console.log(record);
    openDrawer(true, { id: record.id, typeId: searchInfo.typeId });
    reload();
  };
  //删除条目
  const handleDelete = (record: Recordable) => {
    console.log(record);
    doDictionaryItemRemove(record.id);
    reload();
  };

  const handleSuccess = () => {
    //刷新表单
    reload();
  };
</script>
