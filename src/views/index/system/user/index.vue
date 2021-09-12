<template>
  <BasicTable
    @register="registerTable"
    :rowSelection="{ type: 'checkbox', selectedRowKeys: checkedKeys, onChange: onSelectChange }"
  >
  </BasicTable>
</template>
<script lang="ts" setup>
import { BasicTable, useTable,BasicColumn,FormProps } from '/@/components/Table';
import { getUserPage } from '/@/api/sys/user';
import { ref } from 'vue';
  const checkedKeys = ref<Array<string | number>>([]);
  const [registerTable] = useTable({
      title: '用户列表',
      api: getUserPage,
      columns: getBasicColumns(),
      formConfig: getFormConfig(),
      useSearchForm: true,
      showTableSetting: true,
      tableSetting: { fullScreen: true },
      showIndexColumn: false,
      rowKey: 'userId',
  });

  function onSelectChange(selectedRowKeys: (string | number)[]) {
    console.log(selectedRowKeys);
    checkedKeys.value = selectedRowKeys;
  }

  function getFormConfig(): Partial<FormProps> {
    return {
      labelWidth: 100,
      schemas: [
        {
          field: `userName`,
          label: `人员名称`,
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
        title: '用户编号',
        dataIndex: 'userId',
        fixed: 'left',
        width: 200,
      },
       {
        title: '账号',
        dataIndex: 'loginAccount',
        fixed: 'left',
        width: 200,
      },
       {
        title: '人员名称',
        dataIndex: 'userName',
        fixed: 'left',
        width: 200,
      },
       {
        title: '昵称',
        dataIndex: 'nickName',
        fixed: 'left',
        width: 200,
      },
       {
        title: '身份证号',
        dataIndex: 'idCard',
        fixed: 'left',
        width: 200,
      },
       {
        title: '电话',
        dataIndex: 'phone',
        fixed: 'left',
        width: 200,
      },
       {
        title: '居住地址',
        dataIndex: 'address',
        fixed: 'left',
        width: 200,
      },
       {
        title: '登录时间',
        dataIndex: 'loginLastTime',
        fixed: 'left',
        width: 200,
      },
    ]
  }


</script>