<template>
  <div class="chart w-full h-full">
    <div ref="chart" :class="{ 'gauge-bg': type === 'Gauge' }" :style="{ height: props.height, width: props.width }">
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from "echarts";
import 'echarts-liquidfill';
import { setBar } from "./setBar";
import { setTwoYAxisBar } from "./setTwoYAxisBar";
import { setLineBar } from "./setLineBar";
import { setHorizontalBar } from "./setHorizontalBar";
import { setPolarBar } from "./setPolarBar";
import { setLine } from "./setLine";
import { setDynamicLine } from "./setDynamicLine";
import { setSankeyDiagram } from "./setSankeyDiagram";
import { setTree } from "./setTree";
import { setThreeLayeredTree } from "./setThreeLayeredTree";
import { setGraph } from "./setGraph";
import { setPie, PieOptionData, PieSeriesData } from "./setPie";
import { setRose, RoseOptionData, RoseSeriesData } from "./setRose";
import { setGauge, GaugeOptionData, GaugeSeriesData } from "./setGauge";
import { setLiquidFill, LiquidFillOptionData, LiquidFillSeriesData } from "./setLiquidFill";
import { markRaw, onMounted, onUnmounted, ref, watch, computed, onBeforeUnmount, toRefs } from "vue";
import useThemeStore from "../../js/store/theme";
import { getThemeKey } from "../../js/theme/themes";
import { useTheme } from "./theme";
import IHyTopic from "@static/components/observer/IHyTopic";
import HyEnumDataType from "@static/components/observer/HyEnumDataType";
import { createObserver } from "@static/components/observer/HyObserver";
import { useElementSize } from "@vueuse/core";

const topicManager = window.$HyGlobal.getTopicManager();

const topic = topicManager.getByKey(HyEnumDataType.THEME.getName());
if (!topic) {
  throw new Error("Failed to get theme topic from topicManager.");
}
const observer = createObserver(topic, (data: any) => {
  // data;
  refresh();
});
const unsubscribe = () => {
  observer && observer.destroy();
};
onBeforeUnmount(() => unsubscribe());

const themeStore = useThemeStore();

const theme: any = computed(() => themeStore.getTheme);
const props = defineProps({
  // 高
  height: {
    type: String,
    required: false,
    default: "100%",
  },
  // 宽
  width: {
    type: String,
    required: false,
    default: "100%",
  },
  // 图标样式选项
  option: {
    type: Object,
    require: true,
    default: () => { },
  },
  // 图标数据
  data: {
    type: Object,
    required: true,
  },
  // 图表类型
  type: {
    type: String,
    default: "Bar",
  },
});
const emits = defineEmits(["click"]);
const { type } = toRefs(props);
watch(type, () => {
  initChart();
});
const chart = ref();
const myChart = ref();
onMounted(() => {
  initChart();
  watch(theme, () => {
    echarts.registerTheme(getThemeKey(), useTheme(themeStore));
    myChart.value = markRaw(echarts.init(chart.value, getThemeKey()));
  });
});

onUnmounted(() => {
  if (!myChart.value) {
    return;
  }
  // 销毁实例
  myChart.value.dispose();
  myChart.value = null;
  window.removeEventListener("resize", () => {
    myChart.value.resize();
  });
});

const initChart = (): void => {
  echarts.registerTheme(getThemeKey(), useTheme(themeStore));
  myChart.value = markRaw(echarts.init(chart.value, getThemeKey()));
  // 监听窗口大小，自适应
  window.addEventListener("resize", () => {
    if (myChart.value) myChart.value.resize();
  });
  setTimeout(() => {
    setOptions();
  });
};
const { width: canvasWidth, height: canvasHeight } = useElementSize(chart);
const setOptions = (): void => {
  if (!myChart.value) {
    return;
  }
  switch (props.type) {
    case "Line":
      myChart.value.setOption(setLine(props.option, props.data, themeStore, canvasWidth.value, canvasHeight.value));
      break;
    case "DynamicLine":
      myChart.value.setOption(setDynamicLine(props.option, props.data, themeStore));
      break;
    case "SankeyDiagram":
      myChart.value.setOption(setSankeyDiagram(props.option, props.data, themeStore), false);
      break;
    case "Bar":
      myChart.value.setOption(setBar(props.option, props.data, themeStore, canvasWidth.value, canvasHeight.value));
      break;
    case "TwoYAxisBar":
      myChart.value.setOption(setTwoYAxisBar(props.option, props.data, themeStore));
      break;
    case "LineBar":
      myChart.value.setOption(setLineBar(props.option, props.data, canvasWidth.value, canvasHeight.value));
      break;
    case "HorizontalBar":
      myChart.value.setOption(setHorizontalBar(props.option, props.data, themeStore));
      break;
    case "PolarBar":
      myChart.value.setOption(setPolarBar(props.option, props.data));
      break;
    case "tree":
      myChart.value.setOption(setTree(props.data));
      break;
    case "ThreeLayeredTree":
      myChart.value.setOption(setThreeLayeredTree(props.data));
      myChart.value.on("click", (params: any) => {
        if (params.componentType === "series") {
          emits("click", params.data);
        }
      });
      break;
    case "graph":
      myChart.value.setOption(setGraph(props.data));
      break;
    case "Pie":
      myChart.value.setOption(setPie(props.option as PieOptionData, props.data as PieSeriesData, themeStore, canvasWidth.value, canvasHeight.value));
      // 默认高亮
      let pie_index = 0; // 高亮索引
      // 是否被点击筛选
      let isSelect = false;
      let pieIndex = -1; // 点击的高亮
      myChart.value.dispatchAction({
        type: "highlight",
        seriesIndex: pie_index,
        dataIndex: pie_index,
      });
      myChart.value.on("mouseover", (e: { dataIndex: any }) => {
        if (isSelect) {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: pieIndex,
          });
        } else {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: pieIndex,
          });
        }

        myChart.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
      myChart.value.on("mouseout", (e: { dataIndex: number }) => {
        pie_index = e.dataIndex;
        if (isSelect) {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: pie_index,
          });
          myChart.value.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: pieIndex,
          });
        } else {
          myChart.value.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: e.dataIndex,
          });
        }
      });
      // 点击时高亮当前数据
      myChart.value.on("click", (e: { dataIndex: number }) => {
        pie_index = e.dataIndex;
        isSelect = true;
        pieIndex = e.dataIndex;
        myChart.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
      break;
    case "Rose":
      myChart.value.setOption(setRose(props.option as RoseOptionData, props.data as RoseSeriesData, themeStore));
      // 默认高亮
      let rose_index = 0; // 高亮索引
      // 是否被点击筛选
      let RoseIsSelect = false;
      let RoseIndex = -1; // 点击的高亮
      myChart.value.dispatchAction({
        type: "highlight",
        seriesIndex: rose_index,
        dataIndex: rose_index,
      });
      myChart.value.on("mouseover", (e: { dataIndex: any }) => {
        if (RoseIsSelect) {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: RoseIndex,
          });
        } else {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: rose_index,
          });
        }

        myChart.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
      myChart.value.on("mouseout", (e: { dataIndex: number }) => {
        rose_index = e.dataIndex;
        if (RoseIsSelect) {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: rose_index,
          });
          myChart.value.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: RoseIndex,
          });
        } else {
          myChart.value.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: e.dataIndex,
          });
        }
      });
      // 点击时高亮当前数据
      myChart.value.on("click", (e: { dataIndex: number }) => {
        rose_index = e.dataIndex;
        RoseIsSelect = true;
        RoseIndex = e.dataIndex;
        myChart.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
      break;
    case "Gauge":
      myChart.value.setOption(setGauge(props.option as GaugeOptionData, props.data as GaugeSeriesData, themeStore));
      // 默认高亮
      let gauge_index = 0; // 高亮索引
      // 是否被点击筛选
      let gaugeIsSelect = false;
      let gaugeIndex = -1; // 点击的高亮
      myChart.value.dispatchAction({
        type: "highlight",
        seriesIndex: gauge_index,
        dataIndex: gauge_index,
      });
      myChart.value.on("mouseover", (e: { dataIndex: any }) => {
        if (gaugeIsSelect) {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: gaugeIndex,
          });
        } else {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: gauge_index,
          });
        }

        myChart.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
      myChart.value.on("mouseout", (e: { dataIndex: number }) => {
        gauge_index = e.dataIndex;
        if (gaugeIsSelect) {
          myChart.value.dispatchAction({
            type: "downplay",
            seriesIndex: 0,
            dataIndex: gauge_index,
          });
          myChart.value.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: gaugeIndex,
          });
        } else {
          myChart.value.dispatchAction({
            type: "highlight",
            seriesIndex: 0,
            dataIndex: e.dataIndex,
          });
        }
      });
      // 点击时高亮当前数据
      myChart.value.on("click", (e: { dataIndex: number }) => {
        gauge_index = e.dataIndex;
        gaugeIsSelect = true;
        gaugeIndex = e.dataIndex;
        myChart.value.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: e.dataIndex,
        });
      });
      break;
    case "LiquidFill":
      myChart.value.setOption(setLiquidFill(props.option as LiquidFillOptionData, props.data as LiquidFillSeriesData, themeStore));
      break;
  }
};

// watch(
//     [() => props.option, () => props.data, theme],
//     (value) => {
//         if (value) {
//           console.log('执行了没有:', JSON.parse(JSON.stringify(props.data)));
//             refresh()
//         }
//     }
// )

const refresh = (): void => {
  myChart.value && myChart.value.clear();
  // 销毁实例再重新创建，防止setoption数据残留
  myChart.value.dispose();
  initChart();
  myChart.value.resize();
};

watch(canvasWidth, () => {
  myChart.value && refresh();
});
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
watch(locale, () => {
  refresh();
})
defineExpose({ refresh });
</script>
<style lang="scss">
.gauge-bg {
  background: url(../../images/gauge-bg.png) 50% 33% no-repeat;
  background-size: 68%;
}
</style>
