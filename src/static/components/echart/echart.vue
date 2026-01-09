<template>
    <div class="zc-echart-con" ref="chartConRef" @resize="resizeFunc">
        <div class="zc-echart" ref="chartRef" :style="{ width: '100%', height: '100%' }"></div>
    </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts'
const props = defineProps<{ option: any }>();
const chartRef = ref();
const chartConRef = ref();
const chart = ref();
let observer = null;
let resizeTimer:any = null;
const handleResize = (entries:any) => {
    entries.forEach(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            chart.value.resize();
        }, 400)
    });
};
onMounted(() => {
    chart.value = echarts.init(chartRef.value);
    if (props.option) {
        chart.value.setOption(props.option);
    } else {
        chart.value.setOption({
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line'
                }
            ]
        })
    }
    observer = new ResizeObserver(handleResize);
    observer.observe(chartConRef.value);
})
const resizeFunc = () => {
    console.log('这里会执行吗?');
}

const setOption = () => {
    chart.value.setOption(props.option);
}
defineExpose({
    setOption
})
</script>
<style lang="scss" scoped>
.zc-echart-con {
    width: 100%;
    height: 100%;
}
</style>