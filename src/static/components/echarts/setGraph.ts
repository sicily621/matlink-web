import { getCssVar } from "@static/js/theme/var";
import { fontSize, zrem } from "@static/js/theme/zrem";

// 传参optionData：图表标题、样式设置
// 传参seriesData：
export const setGraph = (seriesData: any) => {
    const option = {
        tooltip: {
            backgroundColor: getCssVar("--el-fill-color"),
            borderWidth: 0,
            formatter: "{b}",
            textStyle: {
                color: getCssVar("--el-text-color-primary"),
            },
        },
        legend: [
            {
                show: true,
                left: "5%",
                top: "5%",
                icon: "roundRect",
                textStyle: {
                    color: getCssVar("--el-text-color-primary"), // 节点文字颜色
                    textShadowColor: "transparent", // 去掉阴影
                    textShadowBlur: 0, // 设置模糊度为0
                    fontSize: zrem(14)
                },
                data: seriesData.categories
            },
        ],
        series: [
            {
                type: "graph",
                layout: "force",
                data: seriesData.data,
                links: seriesData.links,
                categories: seriesData.categories,
                symbolSize: 60,
                edgeSymbol: ["circle", "arrow"],
                edgeSymbolSize: [5, 10],
                force: {
                    repulsion: 600, //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                    edgeLength: 100, //边的两个节点之间的距离，值越小则长度越长，这个距离也会受 repulsion影响。
                    gravity: 0.03, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                    layoutAnimation: true, //初始化时转动动画
                },
                roam: true,
                draggable: false,
                lineStyle: {
                    color: "source",
                    curveness: 0.3,
                },
                edgeLabel: {
                    normal: {
                        show: false,
                    },
                },
                label: {
                    normal: {
                        show: true,
                        fontSize: zrem(14),
                        textStyle: {
                            color: getCssVar("--el-text-color-primary"), // 节点文字颜色
                            textShadowColor: "transparent", // 去掉阴影
                            textShadowBlur: 0, // 设置模糊度为0
                        },
                        position: "bottom",
                    },
                },
                emphasis: {
                    focus: "adjacency",
                    lineStyle: {
                        width: zrem(10),
                    },
                },
            },
        ],
    }
    return option
}
