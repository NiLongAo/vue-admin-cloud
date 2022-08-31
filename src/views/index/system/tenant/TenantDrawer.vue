<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
    width="35%"
    showFooter
    @ok="handleOk"
  >
    <CollapseContainer title="租户信息" :canExpan="false">
      <Row :gutter="24">
        <Col :span="16">
          <BasicForm @register="registerTenantForm">
            <template #privilege="{ model, field }">
              <BasicTree
                v-model:value="model[field]"
                :treeData="treeData"
                :fieldNames="{ title: 'k', key: 'v' }"
                checkable
                toolbar
                title="权限分配"
              />
            </template>
          </BasicForm>
        </Col>
      </Row>
    </CollapseContainer>
    <CollapseContainer title="用户设置" :canExpan="false" v-if="!isUpdate">
      <Row :gutter="24">
        <Col :span="16">
          <BasicForm @register="registerUserForm" />
        </Col>
        <Col :span="8">
          <div class="change-avatar">
            <div class="mb-2">头像</div>
            <CropperAvatar
              :uploadApi="upload"
              width="150"
              btnText="更换头像"
              :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
              :value="avatar"
              @change="handleFileVal"
            />
          </div>
        </Col>
      </Row>
    </CollapseContainer>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import { uploadApi } from '/@/api/sys/upload';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { CollapseContainer } from '/@/components/Container';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { doTenantDetail, doTenantInsert, doTenantUpdate } from '/@/api/sys/tenant';
  import { doMenuPrivilegeTree } from '/@/api/sys/menu';
  import { doTenantPrivilegeList, doTenantPrivilegeSave } from '/@/api/sys/privilege';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import headerImg from '/@/assets/images/header.jpg';
  import { SystemEnum } from '/@/enums/systemEnum';
  import { useSystemStore } from '/@/store/modules/system';
  import { CropperAvatar } from '/@/components/Cropper';
  import { insertSetschemas } from '/@/views/index/system/user/data';
  const emit = defineEmits(['success', 'register']);
  const treeData = ref<TreeItem[]>([]);
  const image = ref();
  const upload = uploadApi as any;
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'));
  const systemStore = useSystemStore();
  const staticPath = systemStore.getSystemConfigMap[SystemEnum.SYSTEM_PATH];
  const avatar = computed(() => {
    return !!unref(image) ? staticPath + image.value : headerImg;
  });

  const schemasTenant: FormSchema[] = [
    {
      field: 'id',
      show: false,
      component: 'Input',
      label: '编号',
      colProps: {
        span: 24,
      },
    },
    {
      field: 'tenantName',
      component: 'Input',
      label: '租户名',
      colProps: {
        span: 24,
      },
      required: true,
    },
    {
      field: 'accountCount',
      component: 'InputNumber',
      label: '账号数量',
      colProps: {
        span: 24,
      },
      componentProps: {
        min: 0,
        max: 1000,
      },
      defaultValue: 0,
    },
    {
      field: 'status',
      component: 'Switch',
      label: '租户状态',
      colProps: {
        span: 24,
      },
      defaultValue: true,
    },
    {
      label: ' ',
      field: 'privilege',
      show: () => {
        return unref(isUpdate);
      },
      slot: 'privilege',
      component: 'Input',
      defaultValue: [],
    },
  ];
  const [registerTenantForm, { setFieldsValue, validate: TenantValidate, resetFields }] = useForm({
    labelWidth: 120,
    baseColProps: { span: 24 },
    schemas: schemasTenant,
    showActionButtonGroup: false,
  });
  const [registerUserForm, { setFieldsValue: setUserFieldsValue, validate: UserValidate }] =
    useForm({
      labelWidth: 120,
      schemas: insertSetschemas,
      showActionButtonGroup: false,
    });

  const handleOk = async () => {
    try {
      const { status, privilege, ...TenantValues } = await TenantValidate();
      if (!unref(isUpdate)) {
        const { isAdmin, isEnabled, areaList, ...UserValues } = await UserValidate();
        let map = {
          tenant: { status: status === true ? 1 : 0, ...TenantValues },
          user: {
            ...UserValues,
            isAdmin: isAdmin === true ? 1 : 0,
            isEnabled: isEnabled === true ? 1 : 0,
            provinceId: areaList[0],
            cityId: areaList[1],
            areaId: areaList[2],
          },
        };
        //新增
        await doTenantInsert(map);
      } else {
        //修改
        await doTenantUpdate({
          status: status === true ? 1 : 0,
          ...TenantValues,
        });
        await doTenantPrivilegeSave({
          tenantId: TenantValues.id,
          privilegeList: getPrivilega(privilege),
        });
      }
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  const getPrivilega = (privilega: []) => {
    return privilega.filter((val: String) => val.match(/:/));
  };

  //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    getMenu();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      const { status, ...entity } = await doTenantDetail({ id: data.id });
      const privilege = await doTenantPrivilegeList({ tenantId: data.id });
      setFieldsValue({
        ...entity,
        privilege,
        status: status === 0 ? false : true,
      });
    }
  });

  const handleFileVal = (data) => {
    image.value = data.path;
    setUserFieldsValue({ imageUrl: data.path });
  };

  //获取权限组
  const getMenu = async () => {
    const data = await doMenuPrivilegeTree();
    treeData.value = data;
  };
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      margin-bottom: 15px;
      border-radius: 50%;
    }
  }
</style>
