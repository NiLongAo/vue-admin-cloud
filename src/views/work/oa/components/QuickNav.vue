<template>
  <Card title="快捷导航" v-bind="$attrs">
    <CardGrid v-for="item in navItems" :key="item" @click="goUrl(item.url)">
      <span class="flex flex-col items-center">
        <Icon :icon="item.icon" :color="item.color" size="20" />
        <span class="text-md mt-2">{{ item.title }}</span>
      </span>
    </CardGrid>
  </Card>
</template>
<script lang="ts" setup>
  import { Card,CardGrid } from 'ant-design-vue';
  import { navItems } from './data';
  import { Icon } from '/@/components/Icon';
  import { useGo } from '/@/hooks/web/usePage';  
  const go = useGo();
  const goUrl = (url: string | unknown) =>{
    if (typeof url === 'string') {
      go(String(url));
    }
  }
</script>
