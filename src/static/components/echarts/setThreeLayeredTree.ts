import { getCssVar } from "@static/js/theme/var";
import { zrem } from "@static/js/theme/zrem";

// 传参optionData：图表标题、样式设置
// 传参seriesData：
export const setThreeLayeredTree = (seriesData: any) => {
    const option = {
        tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
            backgroundColor: getCssVar("--el-fill-color"),
            borderWidth: 0,
            formatter: "{b}",
            textStyle: {
                color: getCssVar("--el-text-color-primary"),
            },
        },
        legend: {
            show: true,
            left: "5%",
            bottom: "5%",
            orient: "vertical",
            icon: "roundRect",
            textStyle: {
                color: getCssVar("--el-text-color-primary"), // 节点文字颜色
                textShadowColor: "transparent", // 去掉阴影
                textShadowBlur: 0, // 设置模糊度为0
            },
        },
        series: [
            {
                type: "tree",
                name: "上游",
                data: seriesData?.[0] ? [seriesData?.[0]] : [],
                top: "20%",
                left: "20%",
                bottom: "50%",
                right: "20%",
                symbolSize: 7,
                itemStyle: {
                    color: getCssVar("--el-color-success"),
                },
                lineStyle: {
                    color: getCssVar("--el-color-success"),
                },
                orient: "BT",
                label: {
                    position: "bottom",
                    distance: 10,
                    verticalAlign: "middle",
                    align: "center",
                    fontSize: zrem(14),
                    textStyle: {
                        color: getCssVar("--el-text-color-primary"), // 节点文字颜色
                        textShadowColor: "transparent", // 去掉阴影
                        textShadowBlur: 0, // 设置模糊度为0
                    },
                },
                leaves: {
                    label: {
                        position: "top",
                        verticalAlign: "middle",
                        align: "center",
                    },
                },
                emphasis: {
                    focus: "none",
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750,
            },
            {
                type: "tree",
                name: "下游",
                data: seriesData?.[1] ? [seriesData?.[1]] : [],
                top: "50%",
                left: "20%",
                bottom: "20%",
                right: "20%",
                symbolSize: 7,
                itemStyle: {
                    color: getCssVar("--el-color-primary"),
                },
                lineStyle: {
                    color: getCssVar("--el-color-primary"),
                },
                orient: "vertical",
                label: {
                    position: "top",
                    distance: 10,
                    verticalAlign: "middle",
                    align: "center",
                    fontSize: zrem(14),
                    textStyle: {
                        color: getCssVar("--el-text-color-primary"), // 节点文字颜色
                        textShadowColor: "transparent", // 去掉阴影
                        textShadowBlur: 0, // 设置模糊度为0
                    },
                },

                leaves: {
                    label: {
                        position: "bottom",
                        verticalAlign: "middle",
                        align: "center",
                    },
                },
                expandAndCollapse: true,
                emphasis: {
                    focus: "none",
                },
                animationDuration: 550,
                animationDurationUpdate: 750,
            },
        ],
    }
    return option
}
