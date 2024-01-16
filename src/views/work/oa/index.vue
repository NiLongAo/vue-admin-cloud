<template>
  <PageWrapper contentFullHeight fixedHeight>
    <template #headerContent><WorkbenchHeader /> </template>
    <div class="lg:flex">
      <div class="lg:w-7/10 lg:!mr-4 enter-y">
        <ActivitiPage />
      </div>
      <div class="lg:w-3/10 enter-y">
        <QuickNav />
        <Card class="!my-4 enter-y">
          <img class="xl:h-50 h-30 mx-auto" src="../../../assets/svg/illustration.svg" />
        </Card>
        <SaleRadar class="enter-y" />
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Card } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import QuickNav from './components/QuickNav.vue';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import SaleRadar from './components/SaleRadar.vue';
  import ActivitiPage from './components/ActivitiPage.vue';
</script>
