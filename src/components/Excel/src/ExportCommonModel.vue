<template>
  <BasicModal
    v-bind="$attrs"
    title="选择导出列"
    @ok="handleOk"
    ok-text="导出"
    @register="registerModal"
    width="900px"
  >
    <div class="p-4">
      <BasicTable @register="registerTable" :rowSelection="{ type: stats.selectType }" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { RowSelectionType } from 'ant-design-vue/lib/table/interface';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { propTypes } from '/@/utils/propTypes';
  import { h, reactive } from 'vue';
  import { Switch } from 'ant-design-vue';
  import { isFunction } from 'lodash-es';
  import { downloadByUrl } from '/@/utils/file/download';

  const props = defineProps({
    // 查询导出参数API
    paramApi: propTypes.func,
    // 导出数据API
    exportApi: propTypes.func,
  });

  const stats = reactive({
    selectType: 'checkbox' as RowSelectionType,
    //传过来的数据
    searchParam: null,
  });

  const [registerModal, { closeModal, setModalProps }] = useModalInner(async (data) => {
    stats.searchParam = data.searchParam;
    setModalProps({ confirmLoading: false });
  });

  const columns: BasicColumn[] = [
    {
      title: '字段编号',
      dataIndex: 'field',
      width: 200,
    },
    {
      title: '字段名词',
      dataIndex: 'fieldName',
      width: 200,
    },
    {
      title: '是否加敏',
      dataIndex: 'isDesensitized',
      width: 120,
      customRender: ({ record }) => {
        return h(Switch, {
          checked: record.isDesensitized,
          disabled: !record.isDesensitized,
          checkedChildren: '已启用',
          unCheckedChildren: '已禁用',
          onChange(checked: boolean) {
            record.isDesensitized = checked;
          },
        });
      },
    },
  ];

  const [registerTable, { getSelectRows }] = useTable({
    api: props.paramApi,
    columns: columns,
    showIndexColumn: false,
    bordered: true,
    pagination: false,
    rowKey: 'field',
  });
  const handleOk = async () => {
    const data = getSelectRows();
    const param = { request: stats.searchParam, result: data };
    if (!props.exportApi || !isFunction(props.exportApi)) return;
    const val = await props.exportApi(param);
    const fullPath = val[0].fullPath;
    downloadByUrl({
      url: fullPath,
      target: '_self',
    });
    closeModal();
  };
</script>
