<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    legend: {
      bottom: 0,
      data: ['待办', '已办'],
    },
    radar: {
      indicator: [
        { max: 100, name: '请假' },
        { max: 100, name: '报销' },
        { max: 100, name: '采购' },
        { max: 100, name: '合同' },
        { max: 100, name: '用印' },
        { max: 100, name: '其他' },
      ],
      radius: '60%',
      splitNumber: 6,
    },
    series: [
      {
        areaStyle: {
          opacity: 0.2,
        },
        data: [
          {
            itemStyle: { color: '#5ab1ef' },
            name: '待办',
            value: [90, 62, 74, 48, 58, 36],
          },
          {
            itemStyle: { color: '#67e0e3' },
            name: '已办',
            value: [68, 78, 66, 82, 42, 76],
          },
        ],
        symbolSize: 0,
        type: 'radar',
      },
    ],
    tooltip: {},
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" class="h-full min-h-[180px]" />
</template>
