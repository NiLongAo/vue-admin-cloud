<template>
  <PageWrapper
    :title="`用户` + formData.userName + `的资料`"
    :content="formData.memoRef"
    @back="goBack"
  >
    <Description @register="basicRegister" />
    <Description @register="setUpRegister" class="mt-4" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { onMounted, reactive } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { useGo } from '@/hooks/web/usePage';
  import { useTabs } from '@/hooks/web/useTabs';
  import { UserInfoApi } from '@/api/sys/user';
  import { Description, DescItem, useDescription } from '@/components/Description/index';
  // import { UserInfoModel } from '@/api/sys/model/userModel';
  const route = useRoute();
  const { setTitle } = useTabs();

  const formData = reactive({
    userId: route.params?.id,
    userName: '',
    memoRef: '',
  });

  const initUserInfo = async () => {
    const { userName, nickName, phone, gender, idCard, address, memo, isAdmin, isEnabled } =
      await UserInfoApi({ id: formData.userId });
    formData.userName = userName;
    //设置导航名称
    setTitle('详情：用户' + userName);
    //初始化基本详情信息
    basicSetDescProps({
      title: '基本信息',
      data: { userName, nickName, phone, gender, idCard, address, memo },
      column: 3,
      schema: basicSchema,
      collapseOptions: { canExpand: true, helpMessage: '用户基本信息' },
    });
    //初始化设置信息
    setUpSetDescProps({
      title: '用户设置',
      data: { isAdmin, isEnabled },
      column: 2,
      layout: 'vertical',
      schema: setUpSchema,
      collapseOptions: { canExpand: true, helpMessage: '用户设置信息' },
    });
  };

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

  const setUpSchema: DescItem[] = [
    {
      field: 'isAdmin',
      label: '系统管理员',
      render: (curVal) => {
        return curVal === 1 ? '是' : '否';
      },
    },
    {
      field: 'isEnabled',
      label: '启用状态',
      render: (curVal) => {
        return curVal === 1 ? '是' : '否';
      },
    },
  ];

  const [basicRegister, { setDescProps: basicSetDescProps }] = useDescription({});
  const [setUpRegister, { setDescProps: setUpSetDescProps }] = useDescription({});

  onMounted(() => {
    initUserInfo();
  });

  const go = useGo();
  // 此处可以得到用户ID

  function goBack() {
    // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
    go('/system/user');
  }
</script>
