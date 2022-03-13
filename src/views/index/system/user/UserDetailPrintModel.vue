<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
    title="用户详情打印"
    okText="打印"
    width="90%"
  >
    <Description id="myHtmlElement" @register="basicRegister" watermark="测试水印" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, ref, nextTick, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { UserInfoApi } from '/@/api/sys/user';
  import { doConfigDetail } from '/@/api/sys/config';
  import { PRINT_NAME } from '/@/enums/commonEnum';
  import printJS from 'print-js';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  import { useWatermark } from '/@/hooks/web/useWatermark';

  defineEmits(['register']);

  const formData = reactive({
    data: {},
  });

  const htmlElement = ref<HTMLElement | null>(null);

  const basicSchema: DescItem[] = [
    {
      field: 'userName',
      label: '用户名',
    },
    {
      field: 'nickName',
      label: '昵称',
    },
    {
      field: 'phone',
      label: '联系电话',
    },
    {
      field: 'gender',
      label: '性别',
      render: (curVal) => {
        return curVal === 1 ? '男' : curVal === 2 ? '女' : '保密';
      },
    },
    {
      field: 'idCard',
      label: '身份证号',
    },
    {
      field: 'address',
      label: '地址',
    },
    {
      field: 'memo',
      label: '备注',
    },
  ];

  const [basicRegister, { setDescProps }] = useDescription({});

  const [registerModal] = useModalInner(async (data) => {
    console.log(data);
    const usetId = data?.id;
    if (!usetId) {
      return;
    }
    const val = await UserInfoApi({ id: usetId });
    const model = await doConfigDetail({ k: PRINT_NAME });
    formData.data = val;
    const { userName, nickName, phone, gender, idCard, address, memo } = val;
    setDescProps({
      data: { userName, nickName, phone, gender, idCard, address, memo },
      column: 3,
      schema: basicSchema,
      collapseOptions: { canExpand: true, helpMessage: '用户基本信息' },
    });
    nextTick(() => {
      htmlElement.value = document.getElementById('myHtmlElement');
      console.log(unref(htmlElement));
      const { setWatermark } = useWatermark(htmlElement);
      setWatermark(model.v);
    });
  });

  const handleSubmit = () => {
    printJS({
      printable: 'myHtmlElement',
      type: 'html',
      targetStyles: ['*'],
      ignoreElements: ['no-print'],
      maxWidth: 1000,
    });
  };
</script>
