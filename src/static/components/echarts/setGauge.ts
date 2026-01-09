import * as echarts from "echarts";
import { zrem } from "../../js/theme/zrem";
import { getCssVar } from "@static/js/theme/var";

export interface GaugeOptionData {
  name: string; // 标题
  titleFamily: string; //标题字体
  unit: any; //单位
  minData: number; //最小值
  splitNumber: number; //分割段数
  dataName: string;
  isShowTitle: boolean;
  offsetCenter: any;
  colors?: string[];
  detailFormatter?: any;
  tooltipFormatter?: any;
}
export interface GaugeSeriesData {
  seriesData: number; // 单个数据值
  color?: string;
}
// 传参optionData：图表标题、样式设置
// 传参seriesData：
export const setGauge = (optionData: GaugeOptionData, seriesData: GaugeSeriesData, store: any): any => {
  const { colors: themeColors, textColorRegular } = store.getTheme;
  // const colors = optionData?.colors ?? themeColors;
  const colors = ["#FC4A4A", "#FCA344", "#88FF6F", "#19E3E6", "#199FE6", "#197EE6"];

  const option = {
    tooltip: {
      backgroundColor: "rgba(12,27,47,0.6)",
      borderWidth: 0,
      confine: true,
      formatter: optionData?.tooltipFormatter || "{a} <br/>{b}: {c}%",
    },
    graphic: [
      {
        type: "text",
        left: "center",
        bottom: "20%", // 调整位置到底部
        style: {
          text: seriesData.seriesData, // 第一行显示 value
          formatter:
            optionData?.detailFormatter ||
            function (value: any) {
              return value.toFixed(0) + (optionData?.unit || "");
            },
          fill: seriesData?.color || getCssVar("--el-color-primary"),
          fontSize: zrem(22),
          fontFamily: "impact",
          textAlign: "center", // 水平居中
          textVerticalAlign: "middle", // 垂直居中（相对于定位点）
        },
      },
      {
        type: "text",
        left: "center",
        bottom: "13%", // 第二行显示标题
        style: {
          text: optionData.name,
          fill: getCssVar("--el-label-text-color"),
          fontFamily: "PingFangSC",
          fontSize: zrem(14),
          textAlign: "center", // 水平居中
          textVerticalAlign: "middle", // 垂直居中（相对于定位点）
        },
      },
    ],
    series: [
      {
        name: optionData?.name || null,
        type: "gauge",
        radius: "60%",
        center: ["50%", "45%"],
        startAngle: 225,
        endAngle: -45,
        min: 60,
        max: 100,
        splitNumber: optionData?.splitNumber || 5,
        axisLine: {
          lineStyle: {
            color: [
              [
                0.25,
                new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 1,
                      color: colors[0],
                    },
                    {
                      offset: 0,
                      color: colors[1],
                    },
                  ],
                  false
                ),
              ],
              [
                0.5,
                new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 1,
                      color: colors[2],
                    },
                    {
                      offset: 0,
                      color: colors[1],
                    },
                  ],
                  false
                ),
              ],
              [
                0.75,
                new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  [
                    {
                      offset: 1,
                      color: colors[3],
                    },
                    {
                      offset: 0,
                      color: colors[2],
                    },
                  ],
                  false
                ),
              ],
              [
                1,
                new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 1,
                      color: colors[4],
                    },
                    {
                      offset: 0,
                      color: colors[3],
                    },
                  ],
                  false
                ),
              ],
            ],
            width: 20,
            shadowColor: "rgba(69 ,221 ,255, 0.4)", //默认透明
            shadowBlur: 15,
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
          distance: -3,
          textStyle: {
            color: textColorRegular,
            fontSize: 14,
            fontFamily: optionData?.titleFamily || "Bgothm",
          },
        },
        splitLine: {
          show: false,
        },
        pointer: {
          width: 80,
          length: 90,
          offsetCenter: [0, 35],
          icon: "image://./gaugePointer.svg",
        },
        title: {
          show: optionData?.isShowTitle === true ? true : false,
          color: textColorRegular,
        },
        detail: {
          show: false,
          fontSize: 24,
          fontFamily: optionData?.titleFamily || "Bgothm",
          offsetCenter: [0, "70%"],
          color: textColorRegular,
          formatter:
            optionData?.detailFormatter ||
            function (value: any) {
              return value.toFixed(0) + (optionData?.unit || "");
            },
        },
        data: [
          {
            value: seriesData.seriesData,
            name: optionData?.dataName || "",
            title: {
              offsetCenter: ["0%", "35%"], // 调整文本的位置
            },
            detail: {
              offsetCenter: ["0%", "55%"], // 调整数值的位置
            },
          },
        ],
      },
    ],
  };
  return option;
};
