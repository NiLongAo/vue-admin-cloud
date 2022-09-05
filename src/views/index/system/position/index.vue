<template>
  <div>
    <BasicTable
      @register="registerTable"
      @fetch-success="onFetchSuccess"
      :rowSelection="{ type: 'checkbox' }"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              ifShow: hasPermission('system.position:update'),
              icon: 'mdi:file-edit-outline',
              onClick: handleEdit.bind(null, record),
            },
            {
              ifShow: hasPermission('system.position:delete'),
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
        <a-button type="primary" @click="handleAdd" v-if="hasPermission('system.position:add')"
          >添加</a-button
        >
      </template>
    </BasicTable>
    <PositionDrawer @register="register" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, FormProps, TableAction } from '/@/components/Table';
  import { doPositionPage, doPositionRemove } from '/@/api/sys/position';
  import { nextTick, h } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { useDrawer } from '/@/components/Drawer';
  import PositionDrawer from './PositionDrawer.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();
  const [register, { openDrawer }] = useDrawer();

  const [registerTable, { reload, expandAll }] = useTable({
    title: '职位列表',
    api: doPositionPage,
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
    openDrawer(true, { id: undefined });
  }
  function handleEdit(record: Recordable) {
    openDrawer(true, {
      id: record.id,
    });
  }
  const handleSuccess = () => {
    //刷新表单
    reload();
  };

  async function handleDelete(record: Recordable) {
    //删除
    await doPositionRemove({ id: record.id });
    //刷新表单
    reload();
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `positionName`,
          label: `职位名称`,
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
        title: '部门名称',
        dataIndex: 'positionName',
        fixed: 'left',
        width: 150,
      },
      {
        title: '部门编号',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'isEnable',
        fixed: 'left',
        width: 100,
        customRender: ({ record }) => {
          const status = record.isEnable;
          const enable = ~~status === 1;
          const color = enable ? 'green' : 'red';
          const text = enable ? '启用' : '停用';
          return h(Tag, { color: color }, () => text);
        },
      },
      {
        title: '备注',
        dataIndex: 'memo',
        width: 200,
      },
    ];
  }
</script>
