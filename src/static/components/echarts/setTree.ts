import { getCssVar } from "@static/js/theme/var";

// 传参optionData：图表标题、样式设置
// 传参seriesData：
export const setTree = (seriesData: any) => {
    const option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: 'rgba(12,27,47,0.6)',
            borderWidth: 0,
            formatter: '{b}'
        },
        series: [
            {
                type: 'tree',
                initialTreeDepth: 10, //展示的层数(从0开始)
                left: '35%',
                symbol: 'circle',
                symbolSize: (e: any, data: any) => {//每个节点尺寸大小
                    if (data.data.isTopLevel) {
                        return 20;
                    }
                    else {
                        return 12;
                    }
                },
                data: seriesData.seriesData,
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: getCssVar("--el-text-color-mix-2"), // 节点文字颜色
                            textShadowColor: 'transparent', // 去掉阴影
                            textShadowBlur: 0 // 设置模糊度为0
                        },
                        position: 'top',
                        fontSize: 14,
                        fontWeight: 'bold',
                        width: 100,
                        overflow: 'truncate',
                        ellipsis: '...',
                    },
                    formatter: '{b|}',
                },
                lineStyle: { // 树图边的样式
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0, color: 'rgba(28, 66, 242, 1)' // 0% 处的颜色
                            },
                            {
                                offset: 0.5, color: 'rgba(36, 70, 90, 0.4)' // 0% 处的颜色
                            }
                        ],
                        global: false // 缺省为 false
                    }, // 树图边的颜色
                    curveness: 0.6
                },
                leaves: {
                    label: {
                        position: 'top',
                        align: 'center',
                        width: 280,
                        // 文字超出宽度是否截断或者换行；只有配置width时有效
                        overflow: 'truncate', // truncate截断，并在末尾显示ellipsis配置的文本，默认为...;break换行;breakAll换行，并强制单词内换行
                        ellipsis: '...'
                    }

                },
                emphasis: {
                    focus: 'descendant'
                },
                expandAndCollapse: true,
                animationDuration: 550,
                animationDurationUpdate: 750
            }
        ]
    }
    return option
}
