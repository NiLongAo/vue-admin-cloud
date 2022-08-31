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
    <Button type="primary" @click="handleSubmit"> 更新基本信息 </Button>
  </CollapseContainer>
</template>
<script lang="ts" setup>
  import { Button, Row, Col } from 'ant-design-vue';
  import { computed, ref, unref, onMounted } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';
  import { UserInfoApi, doInsert, doUpdate } from '/@/api/sys/user';
  import { useSystemStore } from '/@/store/modules/system';
  import headerImg from '/@/assets/images/header.jpg';
  import { baseSetschemas, insertSetschemas } from './data';
  import { uploadApi } from '/@/api/sys/upload';
  import { SystemEnum } from '/@/enums/systemEnum';
  import { isFunction } from '/@/utils/is';

  const systemStore = useSystemStore();
  const staticPath = systemStore.getSystemConfigMap[SystemEnum.SYSTEM_PATH];
  const image = ref();
  const upload = uploadApi as any;
  const props = defineProps({
    userId: {
      type: Number,
    },
    closeModal: {
      type: Function,
    },
    reload: {
      type: Function,
    },
  });

  const [register, { setFieldsValue, resetSchema, resetFields, validate }] = useForm({
    labelWidth: 120,
    showActionButtonGroup: false,
  });
  onMounted(async () => {
    initModel();
  });

  const initModel = async () => {
    console.log(props.userId);
    resetSchema(!!unref(props.userId) ? baseSetschemas : insertSetschemas);
    resetFields();
    if (!!props.userId) {
      const { isAdmin, isEnabled, provinceId, cityId, areaId, imageUrl, ...userInfo } =
        await UserInfoApi({
          id: props.userId,
        });
      image.value = imageUrl;
      setFieldsValue({
        ...userInfo,
        imageUrl: imageUrl,
        isAdmin: isAdmin === 0 ? false : true,
        isEnabled: isEnabled === 0 ? false : true,
        areaList: [provinceId, cityId, areaId],
      });
    }
  };

  const avatar = computed(() => {
    return !!unref(image) ? staticPath + image.value : headerImg;
  });

  const handleFileVal = (data) => {
    image.value = data.path;
    setFieldsValue({ imageUrl: data.path });
  };

  const handleSubmit = async () => {
    const closeModal = props.closeModal;
    const reload = props.reload;
    try {
      const { isAdmin, isEnabled, areaList, ...values } = await validate();
      if (unref(props.userId)) {
        //修改
        await doUpdate({
          ...values,
          isAdmin: isAdmin === true ? 1 : 0,
          isEnabled: isEnabled === true ? 1 : 0,
          provinceId: areaList[0],
          cityId: areaList[1],
          areaId: areaList[2],
        });
      } else {
        //新增
        await doInsert({
          ...values,
          isAdmin: isAdmin === true ? 1 : 0,
          isEnabled: isEnabled === true ? 1 : 0,
          provinceId: areaList[0],
          cityId: areaList[1],
          areaId: areaList[2],
        });
        if (closeModal && isFunction(closeModal)) {
          closeModal();
        }
      }
    } finally {
      if (reload && isFunction(reload)) {
        reload();
      }
    }
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
