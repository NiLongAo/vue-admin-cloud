<template>
  <div>
    <VxeBasicTable ref="tableRef" v-bind="gridOptions">
      <template #action="{ row }">
        <TableAction outside :actions="createActions(row)" />
      </template>
    </VxeBasicTable>
    <MenuDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { ActionItem, TableAction } from '/@/components/Table';
  import {
    BasicTableProps,
    VxeBasicTable,
    VxeGridInstance,
    VxeGridPropTypes,
    VxeFormItemProps,
  } from '/@/components/VxeTable';
  import { doMenuPage, doMenuRemove, doPrivilegeRemove } from '/@/api/sys/menu';
  import { h, ref,unref, reactive } from 'vue';
  import { Tag } from 'ant-design-vue';
  import Icon from '/@/components/Icon/Icon.vue';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  import { usePermission } from '/@/hooks/web/usePermission';

  const tableRef = ref<VxeGridInstance>();
  const { hasPermission } = usePermission();
  const [register, { openDrawer }] = useDrawer();

  const gridOptions = reactive<BasicTableProps>({
    id: 'VxeTable',
    keepSource: true,
    showOverflow: true,
    //height: 'auto',
    stripe: true,
    //loading: true,
    editConfig: { trigger: 'click', mode: 'row', showStatus: true },
    scrollY: { enabled: false },
    rowConfig: { keyField: 'id' },
    checkboxConfig: { labelField: 'id' },
    treeConfig: {
      transform: false,
      accordion: true,
      rowField: 'id',
      parentField: 'parentId',
      childrenField: 'children',
    },
    proxyConfig: {
      props: {
        list: 'data',
      },
      ajax: {
        query: async ({ page, form }) => {
          return await doMenuPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...form,
          });
        },
      },
    },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      buttons: [
        {
          content: '添加',
          disabled: hasPermission('system.menu:add'),
          buttonRender: {
            name: 'AButton',
            props: {
              type: 'primary',
              //preIcon: 'mdi:page-next-outline',
            },
            events: {
              click: () => handleAdd(),
            },
          },
        },
      ],
    },
    formConfig: {
      enabled: true,
      items: getFormConfig(),
    },
    columns: getBasicColumns(),
  });

  function handleAdd() {
    //3为权限  1丶2 为菜单
    openDrawer(true, { id: undefined, isUpdate: false });
    unref(tableRef)?.commitProxy('reload');
  }
  function handleEdit(record: Recordable) {
    //3为权限  1丶2 为菜单
    openDrawer(true, {
      id: record.id,
      type: record.type,
      isUpdate: true,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    unref(tableRef)?.commitProxy('reload');
  };

  async function handleDelete(record: Recordable) {
    //3为权限  1丶2 为菜单
    const boolean = record.type === 3 ? true : false;
    if (boolean) {
      await doPrivilegeRemove({ id: record.id });
    } else {
      await doMenuRemove({ id: record.id });
    }
    //刷新表单
    handleSuccess();
  }

  function getFormConfig(): VxeFormItemProps[] {
    return [
      {
        field: 'menuName',
        title: '菜单名称',
        itemRender: {
          name: 'AInput',
        },
        span: 6,
      },
      {
        span: 18,
        align: 'right',
        className: '!pr-0',
        itemRender: {
          name: 'AButtonGroup',
          children: [
            {
              props: { type: 'primary', htmlType: 'submit', content: '查询' },
              //attrs: { class: 'mr-2' },
            },
            { props: { type: 'default', htmlType: 'reset', content: '重置' } },
          ],
        },
      },
    ];
  }

  function getBasicColumns(): VxeGridPropTypes.Columns {
    return [
      {
        title: '菜单编号',
        fixed: 'left',
        treeNode: true,
        type: 'seq',
        field: 'id',
        width: 150,
      },
      {
        title: '菜单名称',
        field: 'menuName',
        fixed: 'left',
        showOverflow: 'tooltip',
        width: 150,
      },
      {
        title: '类型',
        field: 'type',
        fixed: 'left',
        width: 100,
        slots: {
          default: ({ row }) => {
            const status = row.type;
            const enable = ~~status;
            const color = enable === 1 ? '#BBFF66' : enable === 2 ? '#FF8888' : '#FFDD55';
            const text = enable === 1 ? '父级菜单' : enable === 2 ? '子级菜单' : '菜单权限';
            return h(Tag, { color: color }, () => text);
          },
        },
      },
      {
        title: '图标',
        field: 'icon',
        width: 100,
        slots: {
          default: ({ row }) => {
            return h(Icon, { icon: row.icon });
          },
        },
      },
      {
        title: '级别',
        field: 'level',
        width: 100,
      },
      {
        title: '序号',
        field: 'num',
        width: 100,
      },
      {
        title: '是否启用',
        field: 'isOpen',
        width: 100,
        slots: {
          default: ({ row }) => {
            const status = row.isOpen;
            const enable = ~~status === 1;
            const color = enable ? 'green' : 'red';
            const text = enable ? '启用' : '停用';
            return h(Tag, { color: color }, () => text);
          },
        },
      },
      {
        title: '是否隐藏',
        field: 'hideMenu',
        width: 100,
        slots: {
          default: ({ row }) => {
            const status = row.hideMenu;
            const enable = ~~status === 1;
            const color = enable ? 'green' : 'red';
            const text = enable ? '启用' : '停用';
            return h(Tag, { color: color }, () => text);
          },
        },
      },
      {
        title: '跳转路径',
        field: 'path',
        width: 200,
      },
      {
        title: '页面路由',
        field: 'viewPath',
        width: 200,
      },
      {
        title: '备注',
        field: 'memo',
        width: 200,
      },
      {
        title: '操作',
        align: 'center',
        slots: { default: 'action' },
        fixed: 'right',
      },
    ];
  }
  // 操作按钮（权限控制）
  const createActions = (record) => {
    const actions: ActionItem[] = [
      {
        ifShow: hasPermission('system.menu:update'),
        icon: 'mdi:file-edit-outline',
        onClick: handleEdit.bind(null, record),
      },
      {
        ifShow: hasPermission('system.menu:delete'),
        color: 'error',
        icon: 'mdi:delete-outline',
        popConfirm: {
          title: '是否删除？',
          confirm: handleDelete.bind(null, record),
        },
      },
    ];
    return actions;
  };
</script>
