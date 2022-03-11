<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerBasicModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="900px"
  >
    <BasicTable
      @register="registerTable"
      :rowSelection="{
        type: stats.selectType,
        selectedRowKeys: checkedKeys,
        onChange: onSelectChange,
      }"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getChoiceUserPage } from '/@/api/sys/user';
  import { doAll as doRoleAll } from '/@/api/sys/role';
  import { doPositionAll } from '/@/api/sys/position';
  import { RowSelectionType } from 'ant-design-vue/lib/table/interface';
  import { doDepartmentAll } from '/@/api/sys/department';
  import { BasicTable, useTable, BasicColumn, FormProps } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['success', 'register']);
  const getTitle = computed(() => '用户选择器');
  const checkedKeys = ref<Array<string | number>>([]);
  const { notification } = useMessage();

  const stats = reactive({
    selectType: 'radio' as RowSelectionType,
    //传过来的数据
    data: null,
  });

  const handleSubmit = () => {
    try {
      if (unref(checkedKeys).length <= 0) {
        notification.error({
          message: '请选择人员',
          duration: 3,
        });
        return;
      }
      emit('success', unref(stats.data), unref(checkedKeys));
      closeModal();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  };

  const [registerBasicModal, { setModalProps, closeModal }] = useModalInner((data) => {
    stats.data = data.data;
    if (data.selectType) {
      stats.selectType = data.selectType;
    }
    if (data.useSearchForm != null) {
      setProps({ useSearchForm: data.useSearchForm });
    }
    if (data.api != null) {
      setProps({ api: data.api });
    }

    setModalProps({ confirmLoading: false });
  });

  const basicColumns = (): BasicColumn[] => {
    return [
      {
        title: '人员名称',
        dataIndex: 'id',
        fixed: 'left',
        width: 100,
      },
      {
        title: '账号',
        dataIndex: 'loginAccount',
        width: 200,
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        width: 200,
      },
      {
        title: '身份证号',
        dataIndex: 'idCard',
        width: 200,
      },
    ];
  };

  const formConfig = (): Partial<FormProps> => {
    return {
      labelWidth: 100,
      autoSubmitOnEnter: true,
      schemas: [
        {
          field: `type`,
          label: `查询类型`,
          component: 'Select',
          colProps: {
            xl: 6,
            xxl: 6,
          },
          componentProps: {
            onChange: fromChange,
            options: [
              {
                label: '角色',
                value: 'ROLE',
                key: 'ROLE',
              },
              {
                label: '职位',
                value: 'POSITION',
                key: 'POSITION',
              },
              {
                label: '部门',
                value: 'DEPARTMENT',
                key: 'DEPARTMENT',
              },
            ],
          },
        },
        {
          field: `typeId`,
          label: `类型编码`,
          component: 'ApiSelect',
          colProps: {
            xl: 6,
            xxl: 6,
          },
          componentProps: {
            api: doRoleAll,
            labelField: 'roleName',
            valueField: 'roleId',
          },
        },
        {
          field: `userName`,
          label: `人员名称`,
          component: 'Input',
          colProps: {
            xl: 6,
            xxl: 6,
          },
        },
      ],
    };
  };

  const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    checkedKeys.value = selectedRowKeys;
  };
  const fromChange = (val) => {
    const from = getForm();
    let labelField, valueField, api;
    if (val == 'ROLE') {
      api = doRoleAll;
      labelField = 'roleName';
      valueField = 'roleId';
    } else if (val == 'POSITION') {
      api = doPositionAll;
      labelField = 'positionName';
      valueField = 'positionId';
    } else {
      api = doDepartmentAll;
      labelField = 'departmentName';
      valueField = 'departmentId';
    }
    from.updateSchema([
      {
        field: 'typeId',
        componentProps: { api: api, labelField: labelField, valueField: valueField },
      },
    ]);
  };

  const [registerTable, { getForm, setProps }] = useTable({
    api: getChoiceUserPage,
    columns: basicColumns(),
    formConfig: formConfig(),
    useSearchForm: true,
    bordered: true,
    defaultExpandAllRows: true,
    isCanResizeParent: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    size: 'small',
    rowKey: 'userId',
    scroll: { y: 500 },
  });
</script>
