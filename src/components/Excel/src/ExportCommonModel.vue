<template>
  <BasicModal
    v-bind="$attrs"
    title="选择导出列"
    @ok="handleOk"
    ok-text="导出"
    @register="registerModal"
    @height-change="heightChange"
  >
    <div class="flex w-full p-2" :style="`height:` + state.height + `px`">
      <BasicTable @register="registerTable" :rowSelection="{ type: stats.selectType }" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { RowSelectionType } from 'ant-design-vue/lib/table/interface';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { propTypes } from '/@/utils/propTypes';
  import { h, reactive, unref } from 'vue';
  import { Switch } from 'ant-design-vue';
  import { isFunction } from 'lodash-es';
  import { downloadByData, findFileName } from '/@/utils/file/download';

  const props = defineProps({
    // 查询导出参数API
    paramApi: propTypes.func,
    // 导出数据API
    exportApi: propTypes.func,
  });

  const state = reactive({
    height: 0,
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
      title: '字段名称',
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
          onClick: (checked: boolean | string | number)=>{record.isDesensitized = checked},
        });
      },
    },
  ];

  const [registerTable, { getSelectRows, getDataSource }] = useTable({
    api: props.paramApi,
    columns: columns,
    showIndexColumn: false,
    bordered: true,
    pagination: false,
    isCanResizeParent: true,
    rowKey: 'field',
  });
  const handleOk = async () => {
    const allData = unref(getDataSource());
    const allfieldList = allData.map((o) => o.fieldName);
    const data = unref(getSelectRows());
    const fieldListSet = new Set(data.map((o) => o.fieldName));
    const desensitizedList = data.filter((o) => o.isDesensitized).map((o) => o.fieldName);
    const fieldList = Array.from(allfieldList.filter((item) => !fieldListSet.has(item)));
    const param = {
      request: stats.searchParam,
      fieldList: fieldList,
      desensitizedList: desensitizedList,
    };
    if (!props.exportApi || !isFunction(props.exportApi)) return;
    const res = await props.exportApi(param);
    downloadByData(res.data, findFileName(res));
    closeModal();
  };
  const heightChange = (height) => {
    state.height = height - 5;
  };
</script>
