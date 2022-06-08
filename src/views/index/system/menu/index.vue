<template>
  <div>
    <BasicTable
      @register="registerTable"
      @fetch-success="onFetchSuccess"
      :rowSelection="{ type: 'checkbox', selectedRowKeys: checkedKeys , onChange: onSelectChange}"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
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
          ]"
        />
      </template>
      <template #toolbar>
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('system.menu:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <MenuDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doMenuPage, doMenuRemove, doPrivilegeRemove } from '/@/api/sys/menu';
  import { ref, nextTick } from 'vue';
  import { h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { useDrawer } from '/@/components/Drawer';
  import MenuDrawer from './MenuDrawer.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const checkedKeys = ref<Array<string | number>>([]);
  const [register, { openDrawer }] = useDrawer();

  const [registerTable, { reload, expandAll }] = useTable({
    title: '菜单列表',
    api: doMenuPage,
    columns: getBasicColumns(),
    formConfig: getFormConfig(),
    isTreeTable: true,
    pagination: false,
    striped: false,
    defaultExpandAllRows: true,
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    canResize: false,
    rowKey: 'id',
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleAdd() {
    //3为权限  1丶2 为菜单
    openDrawer(true, { id: undefined, isUpdate: false });
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
    reload();
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
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `menuName`,
          label: `菜单名称`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 5,
          },
        },
      ],
    };
  }
  function onFetchSuccess() {
    // 演示默认展开所有表项
    nextTick(expandAll);
  }
  function getBasicColumns(): BasicColumn[] {
    return [
      {
        title: '菜单名称',
        dataIndex: 'menuName',
        fixed: 'left',
        width: 150,
      },
      {
        title: '类型',
        dataIndex: 'type',
        fixed: 'left',
        width: 100,
        customRender: ({ record }) => {
          const status = record.type;
          const enable = ~~status;
          const color = enable === 1 ? '#BBFF66' : enable === 2 ? '#FF8888' : '#FFDD55';
          const text = enable === 1 ? '父级菜单' : enable === 2 ? '子级菜单' : '菜单权限';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '菜单编号',
        dataIndex: 'id',
        width: 100,
      },
      {
        title: '图标',
        dataIndex: 'icon',
        width: 100,
        customRender: ({ record }) => {
          return h(Icon, { icon: record.icon });
        },
      },
      {
        title: '级别',
        dataIndex: 'level',
        width: 100,
      },
      {
        title: '是否启用',
        dataIndex: 'isOpen',
        width: 100,
        customRender: ({ record }) => {
          const status = record.isOpen;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '启用' : '停用';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '是否隐藏',
        dataIndex: 'hideMenu',
        width: 100,
        customRender: ({ record }) => {
          const status = record.hideMenu;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '启用' : '停用';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '跳转路径',
        dataIndex: 'path',
        width: 200,
      },
      {
        title: '页面路由',
        dataIndex: 'viewPath',
        width: 200,
      },

      {
        title: '序号',
        dataIndex: 'num',
        width: 200,
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: 200,
      },
    ];
  }
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }
</script>
