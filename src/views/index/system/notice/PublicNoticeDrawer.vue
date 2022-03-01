<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
    width="40%"
    showFooter
    @ok="handleOk"
  >
    <div>
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>

<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { stringToTime } from '/@/utils/dateUtil';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import {
    doPublicNoticeInsert,
    doPublicNoticeUpdate,
    doPublicNoticeDetail,
  } from '/@/api/notice/publicNotice';
  import { Tinymce } from '/@/components/Tinymce/index';
  import { ref, unref, computed, h, onUnmounted } from 'vue';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);

  const schemas: FormSchema[] = [
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
      field: 'noticeType',
      component: 'Select',
      label: '通知类型',
      colProps: {
        span: 24,
      },
      required: true,
      componentProps: {
        options: [
          {
            label: '系统公告',
            value: 1,
            key: 1,
          },
        ],
      },
    },
    {
      field: 'title',
      component: 'Input',
      label: '标题',
      colProps: {
        span: 24,
      },
      rules: [{ required: true }],
    },
    {
      field: 'beginTime',
      component: 'DatePicker',
      label: '公告开始时间',
      colProps: {
        span: 24,
      },
      rules: [{ required: true }],
      componentProps: {
        showTime: {
          defaultValue: stringToTime('00:00:00'),
        },
      },
    },
    {
      field: 'endTime',
      component: 'DatePicker',
      label: '公告结束时间',
      colProps: {
        span: 24,
      },
      rules: [{ required: true }],
      componentProps: {
        showTime: {
          defaultValue: stringToTime('23:59:59'),
        },
      },
    },
    {
      field: 'content',
      component: 'Input',
      label: '内容',
      colProps: {
        span: 24,
      },
      rules: [{ required: true }],
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
  });
  const handleOk = async () => {
    try {
      const { ...values } = await validate();
      if (!unref(isUpdate)) {
        //新增
        await doPublicNoticeInsert({
          ...values,
        });
      } else {
        //修改
        await doPublicNoticeUpdate({
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
  const getTitle = computed(() => (!unref(isUpdate) ? '新增客户端' : '编辑客户端'));
  onUnmounted(() => {
    closeDrawer();
  });

  //初始化页面
  const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = data.isUpdate;
    if (isUpdate.value) {
      const entity = await doPublicNoticeDetail({
        id: data.id,
      });
      setFieldsValue(entity);
    }
  });
</script>
