<template>
  <PageWrapper ref="PageWrapperT" dense contentFullHeight fixedHeight>
    <Row ref="rowHeight" v-if="isTenant">
      <Col :span="24">
        <div class="box-border p-2 bg-white">
          <BasicForm @register="registerForm" @submit="handleSubmit" />
        </div>
      </Col>
    </Row>
    <Row class="relative" :style="`height:` + state.rowHeightVal + `px`">
      <Col :span="5"> <PrivilegeTree @select="handleSelect" :tenant="state.tenant" /></Col>
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
  import { Row, Col } from 'ant-design-vue';
  import PrivilegeTree from './PrivilegeTree.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { tenantSchemas, isTenant } from '/@/settings/tenantSetting';
  import PrivilegeCheckbox from './PrivilegeCheckbox.vue';
  import { ref, unref, reactive, onMounted, nextTick } from 'vue';
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
  const PageWrapperT = ref();
  const rowHeight = ref();
  const treeData = ref();
  const checkedList = ref();
  const selectType = ref();
  const selectId = ref();
  const handleCheckRef = ref();

  const state = reactive({
    rowHeightVal: 0,
    tenant: {},
  });

  //获取权限组
  const getMenu = async (tenantId) => {
    let data;
    if (tenantId) {
      data = await doTenantMenuPrivilegeTree({ tenantId });
    } else {
      data = await doMenuPrivilegeTree();
    }
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
    } else {
      treeData.value = [];
    }
    checkedList.value = checked;
  };

  const [registerForm] = useForm({
    labelWidth: 120,
    schemas: tenantSchemas,
    actionColOptions: {
      span: 24,
    },
  });

  const handleSubmit = (values) => {
    state.tenant = values;
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

  onMounted(() => {
    nextTick(() => {
      const rowHeightEl = unref(rowHeight)?.$el;
      state.rowHeightVal = unref(PageWrapperT).contentHeight - (rowHeightEl?.clientHeight || 0);
    });
  });
</script>
