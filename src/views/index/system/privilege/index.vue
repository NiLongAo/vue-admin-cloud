<template>
  <PageWrapper dense contentFullHeight fixedHeight>
    <Row>
      <Col :span="24">
        <CollapseContainer title="useForm示例">
          <BasicForm @register="registerForm" @submit="handleSubmit" /> </CollapseContainer
      ></Col>
    </Row>
    <Row class="fixed h-1/1">
      <Col :span="5">
        <PrivilegeTree @select="handleSelect" />
      </Col>
      <Col :span="19">
        <PrivilegeCheckbox
          ref="handleCheckRef"
          :treeData="treeData"
          :checkedList="checkedList"
          @save="handleSave"
        />
      </Col>
    </Row>
  </PageWrapper>
</template>
<script ang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { CollapseContainer } from '/@/components/Container/index';
  import { Row, Col } from 'ant-design-vue';
  import PrivilegeTree from './PrivilegeTree.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { tenantSchemas } from '/@/settings/tenantSetting';
  import PrivilegeCheckbox from './PrivilegeCheckbox.vue';
  import { ref, unref } from 'vue';
  import { doTenantMenuPrivilegeTree } from '/@/api/sys/menu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    doDepartmentPrivilegeList,
    doDepartmentPrivilegeSave,
    doPositionPrivilegeList,
    doPositionPrivilegeSave,
    doRolePrivilegeList,
    doRolePrivilegeSave,
  } from '/@/api/sys/privilege';

  const { createMessage } = useMessage();
  const { error } = createMessage;
  const treeData = ref();
  const checkedList = ref();
  const selectType = ref();
  const selectId = ref();
  const handleCheckRef = ref();

  //获取权限组
  const getMenu = async (tenantId) => {
    const data = await doTenantMenuPrivilegeTree({ tenantId });
    treeData.value = data;
  };

  //点击字典类型事件
  const handleSelect = async (type = undefined, id = '', tenantId = '') => {
    await handleCheckRef.value.onInit();
    let checked = [];
    if (!!id) {
      await getMenu(tenantId);
      selectType.value = type;
      selectId.value = id;
      if (~~type === 1) {
        checked = await doDepartmentPrivilegeList({ departmentId: id });
      } else if (~~type === 2) {
        checked = await doPositionPrivilegeList({ positionId: id });
      } else {
        checked = await doRolePrivilegeList({ roleId: id });
      }
    }
    checkedList.value = checked;
  };

  const [registerForm, { setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: tenantSchemas,
    actionColOptions: {
      span: 24,
    },
  });

  const handleSubmit = (values) => {
    console.log(values);
  };

  //保存选中的元素
  const handleSave = async (checkIdList) => {
    if (!unref(selectType)) {
      error('请选择权限类型');
      return;
    }
    if (unref(selectType) === 1) {
      await doDepartmentPrivilegeSave({
        departmentId: unref(selectId),
        privilegeList: checkIdList,
      });
    } else if (unref(selectType) === 2) {
      await doPositionPrivilegeSave({
        positionId: unref(selectId),
        privilegeList: checkIdList,
      });
    } else {
      await doRolePrivilegeSave({ roleId: unref(selectId), privilegeList: checkIdList });
    }
  };
</script>
