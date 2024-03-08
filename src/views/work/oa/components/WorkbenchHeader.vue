<template>
  <div class="lg:flex">
    <Avatar :src="stats.avatar" :size="72" class="!mx-auto !block" />
    <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
      <h1 class="md:text-lg text-md">{{ holle }}</h1>
      <!-- <span class="text-secondary"> 今日晴，20℃ - 32℃！ </span> -->
    </div>
    <div class="flex flex-1 justify-end md:mt-0 mt-4">
      <div class="flex flex-col justify-center text-right">
        <span class="text-secondary"> 待办 </span>
        <span class="text-2xl text-center">{{ stats.userNeedCount }}</span>
      </div>

      <div class="flex flex-col justify-center text-right md:ml-16 ml-12">
        <span class="text-secondary"> 发起 </span>
        <span class="text-2xl text-center">{{ stats.userLaunchCount }}</span>
      </div>
      <div class="flex flex-col justify-center text-right md:mx-16 mx-12">
        <span class="text-secondary"> 已办 </span>
        <span class="text-2xl text-center">{{ stats.userAlreadyCount }}</span>
      </div>
      <div class="flex flex-col justify-center text-right md:mr-10 mr-4">
        <span class="text-secondary"> 部门人数 </span>
        <span class="text-2xl text-center">300</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, reactive, onMounted } from 'vue';
  import { Avatar } from 'ant-design-vue';
  import { useUserStore } from '@/store/modules/user';
  import headerImg from '@/assets/images/header.jpg';
  import { formatToDate } from '@/utils/dateUtil';
  import { doStatsUserOa } from '@/api/oa/activiti';

  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);

  const stats = reactive({
    avatar: userinfo.value.imageUrl ? userinfo.value.imageUrl : headerImg,
    userNeedCount: 0,
    userLaunchCount: 0,
    userAlreadyCount: 0,
  });

  onMounted(() => {
    init();
  });

  const init = async () => {
    const { userNeedCount, userLaunchCount, userAlreadyCount } = await doStatsUserOa();
    stats.userNeedCount = userNeedCount;
    stats.userLaunchCount = userLaunchCount;
    stats.userAlreadyCount = userAlreadyCount;
  };

  const holle = computed(() => {
    const h = Number(formatToDate(new Date(), 'HH'));
    let holle;
    if (0 <= h && h < 10) {
      holle = '早上好,  ' + userinfo.value.nickName + '  开始您一天的工作吧！';
    } else if (10 <= h && h < 12) {
      holle = '中午好,  ' + userinfo.value.nickName + '  继续努力哟！';
    } else if (12 <= h && h < 18) {
      holle = '下午好,  ' + userinfo.value.nickName + '  保持完美工作状态！';
    } else if (18 <= h && h < 24) {
      holle = '晚上好,  ' + userinfo.value.nickName + '  早点休息吧！';
    }
    return holle;
  });
</script>
