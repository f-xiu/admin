<template>
  <div ref="barRef" class="w-full h-360px"></div>
</template>

<script setup lang="ts">
import { useEcharts, type ECOption } from '@/composables';
import { Ref, ref, watch } from 'vue';
const props = defineProps(['xData', 'value'])
const option = ref<ECOption>() as Ref<ECOption>;
const { domRef: barRef } = useEcharts(option);
watch(props, (newProps) => {
  option.value = {
    title: {
      text: '用户文章统计表',
      left: 'center',
    },
    xAxis: {
      type: "category",
      data: newProps.xData,
      name: '用户名',
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      name: "数量"
    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        data: newProps.value,
        type: "bar",
        label: {
          show: true,
          formatter: "{c}篇",
          position: 'top'
        }
      },
    ],
  }
})

</script>

<style scoped></style>