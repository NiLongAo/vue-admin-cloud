<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
    width="35%"
    showFooter
    @ok="handleOk"
  >
    <div>
      <BasicForm @register="registerDeviceForm" />
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { PTZ_TYPE_ENUM } from '@/enums/commonEnum';
  import { useSystemStore } from '@/store/modules/system';
  import { doDetailDeviceChannel, doSaveDeviceChannel } from '@/api/video/deviceChannel';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const getTitle = computed(() => (!unref(isUpdate) ? '新增通道' : '编辑通道'));
  const systemStore = useSystemStore();

  const handleOk = async () => {
    try {
      const { ...values } = await validate();
      if (!unref(isUpdate)) {
        //新增
        await doSaveDeviceChannel({
          ...values,
        });
      } else {
        //修改
        await doSaveDeviceChannel({
          ...values,
        });
      }
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  };

  const ptzTypes = computed(() => {
    const template = systemStore.getDictMap[PTZ_TYPE_ENUM];
    const types = [] as any;
    Object.keys(template).forEach((key) => {
      types.push({ label: template[key], value: Number(key), key: Number(key) });
    });
    return types;
  });

  const schemasDevice: FormSchema[] = [
    {
      field: 'parentId',
      component: 'Input',
      label: '父级编号',
      colProps: {
        span: 12,
      },
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'deviceId',
      component: 'Input',
      label: '设备编号',
      colProps: {
        span: 12,
      },
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'channelId',
      component: 'Input',
      label: '通道国标编号',
      colProps: {
        span: 12,
      },
      required: true,
    },
    {
      field: 'civilCode',
      component: 'Input',
      label: '行政区域',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'name',
      component: 'Input',
      label: '通道名',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'address',
      component: 'Input',
      label: '安装地址',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ptzType',
      component: 'Select',
      label: '云台类型',
      colProps: {
        span: 12,
      },
      componentProps: {
        options: ptzTypes,
      },
      required: true,
      defaultValue: 0,
    },
    {
      field: 'password',
      component: 'Input',
      label: '密码',
      colProps: {
        span: 12,
      },
      componentProps: {
        min: 0,
      },
    },
    {
      field: 'hasRecord',
      component: 'Switch',
      label: '录像状态',
      colProps: {
        span: 12,
      },
      componentProps: {
        unCheckedValue: 0,
        checkedValue: 1,
      },
      defaultValue: 0,
      required: true,
    },
    {
      field: 'hasAudio',
      component: 'Switch',
      label: '音频状态',
      colProps: {
        span: 12,
      },
      componentProps: {
        unCheckedValue: 0,
        checkedValue: 1,
      },
      defaultValue: 0,
      required: true,
    },
  ];

  const [registerDeviceForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: schemasDevice,
    showActionButtonGroup: false,
  });

  //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      const { ...entity } = await doDetailDeviceChannel({ channelId: data.channelId });
      setFieldsValue({
        ...entity,
      });
    } else {
      setFieldsValue({
        parentId: data.deviceId,
        deviceId: data.deviceId,
      });
    }
  });
</script>
