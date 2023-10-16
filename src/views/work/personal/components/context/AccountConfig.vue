<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <Row :gutter="24">
      <Col :span="16">
        <BasicForm @register="register" />
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
    <div class="flex justify-center">
      <Button type="primary" @click="handleSubmit" v-if="hasPermission('work.personal:user_save')">
        更新基本信息
      </Button>
    </div>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { Button, Row, Col } from 'ant-design-vue';
  import { computed, ref, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';
  import { UserInfoApi, doUpdateLoginUserInfo } from '/@/api/sys/user';
  import { useSystemStore } from '/@/store/modules/system';
  import headerImg from '/@/assets/images/header.jpg';
  import { baseSetschemas } from '../../data';
  import { uploadApi } from '/@/api/sys/upload';
  import { SystemEnum } from '/@/enums/systemEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { usePermission } from '/@/hooks/web/usePermission';
  const { hasPermission } = usePermission();

  const userStore = useUserStore();
  const systemStore = useSystemStore();
  const staticPath = systemStore.getSystemConfigMap[SystemEnum.SYSTEM_PATH];
  const image = ref();
  const upload = uploadApi as any;

  const [register, { setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    showActionButtonGroup: false,
    schemas: baseSetschemas,
  });
  onMounted(async () => {
    initModel();
  });

  const initModel = async () => {
    const user = userStore.getUserInfo;
    const { isAdmin, isEnabled, provinceId, cityId, areaId, imageUrl, ...userInfo } =
      await UserInfoApi({
        id: user.id,
      });
    image.value = imageUrl;
    setFieldsValue({
      ...userInfo,
      imageUrl: imageUrl,
      isAdmin: isAdmin === 0 ? false : true,
      isEnabled: isEnabled === 0 ? false : true,
      areaList: [provinceId, cityId, areaId],
    });
  };

  const avatar = computed(() => {
    return !!unref(image) ? staticPath + image.value : headerImg;
  });

  const handleFileVal = ({source, data}) => {
    image.value = data.path;
    setFieldsValue({ imageUrl: data.path });
  };

  const handleSubmit = async () => {
    const { isAdmin, isEnabled, areaList, ...values } = await validate();
    //修改
    await doUpdateLoginUserInfo({
      ...values,
      isAdmin: isAdmin === true ? 1 : 0,
      isEnabled: isEnabled === true ? 1 : 0,
      provinceId: areaList[0],
      cityId: areaList[1],
      areaId: areaList[2],
    });
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
