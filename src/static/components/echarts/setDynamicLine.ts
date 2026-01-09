import * as echarts from 'echarts';
import { hexToRgb } from '@static/js/common/color';
import { getCssVar } from "@static/js/theme/var";
export const setDynamicLine = (value: any, data: any, store: any) => {
    const colors = getCssVar('--el-supplement-color').split(',').map((item: any) => item.trim());
    const option: any = {
        title: {
            show: !!value?.title,
            text: value?.title || null,
            textStyle: {
                //文字颜色
                //color: '#fff',
                //字体风格,'normal','italic','oblique'
                fontStyle: 'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight: 'normal',
                //字体系列
                fontFamily: 'sans-serif',
                //字体大小
                fontSize: 14
            },
            //4.副标题
            subtext: '副标题',
            //副标题文本样式
            subtextStyle: {},
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: 'rgba(12,27,47,0.6)'
                }
            }
        },
        legend: {
            show: !value?.hideLegend,
            type: 'scroll',
            x: value?.legendX || 'right',
            y: value?.legendY || '0%',
            padding: [0, 0],
            itemWidth: value?.legend?.itemWidth || 3,
            itemHeight: 11,
            itemGap: 15,
            icon: 'rect',
            pageIconSize: 10,
            textStyle: {
                color: getCssVar("--el-text-color-mix-2"),
                fontSize: 14,
                padding: [0, 6],
                height: 10,
                rich: {
                    a: {
                        verticalAlign: 'middle',
                    },
                }
            },
        },
        grid: {
            left: "0.5%",
            right: '2%',
            top: "35",
            bottom: value?.grid?.bottom || "0%",
            containLabel: true
        },
        xAxis: {
            type: value?.reverse ? 'value' : 'category',
            boundaryGap: value?.boundaryGap ? true : false,
            axisTick: { show: false },
            axisLabel: {
                show: true,
                textStyle: {// x轴字体样式
                    color: getCssVar("--el-text-color-mix-2"),
                    // margin: 15,
                },
                // formatter  (value, index) {
                //     return value?.replace(' ', '\r\n')
                // },
                // interval: 0, // 使x轴横坐标全部显示
            },
            splitLine: {
                show: false
            },
            data: value?.xAxis?.data || [],

        },

        graphic: {
            type: 'text',
            left: 'center',
            top: '30%',
            silent: true,
            invisible: Object.keys(data).length !== 0, // 是否可见，这里的意思是当没有数据时可见
            style: {
                text: '暂无数据',
                fontSize: '16px',
                fill: getCssVar("--el-text-color-mix-2")
            },
        },
        yAxis: [],
        series: []
    }
    if (value?.yData) { option.yAxis.data = value?.yData }
    if (value?.xData) { option.xAxis.data = value?.xData }
    const seriesNameList = Object.keys(data);
    option.series = [];
    if (seriesNameList.length) {
        option.legend.data = seriesNameList
        seriesNameList.map((name, index) => {
            const rgb = hexToRgb(colors[index]);
            option.series.push({
                name: name,
                type: 'line',
                yAxisIndex: index,
                barGap: 0,
                smooth: value?.smooth || false,
                showSymbol: value?.showSymbol || false, // 显示标记点
                symbol: 'circle', // 标记点形状
                symbolSize: 8, // 标记点大小                
                color: colors[index],
                realtimeSort: value?.realtimeSort,
                barMinWidth: 8,
                barMaxWidth: 16,
                data: data[name],
                itemStyle: {
                    show: true,
                    normal: {
                        barBorderRadius: [9, 9, 0, 0],
                    },
                },
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            color: colors[index], // 节点文字颜色
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
                areaStyle: {
                    opacity: value?.areaColor ? 1 : 0,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: `rgba(${rgb},0.2)`
                        },
                        {
                            offset: 1,
                            color: `rgba(${rgb},0)`
                        }
                    ])
                },
                // 高亮时聚焦该条，淡出其他数据
                emphasis: {
                    focus: 'self',
                    blurScope: 'global'
                },
                // 取消悬浮高亮行为
                legendHoverLink: false,
                // hoverAnimation: false,
                // 最小高度中写自定义函数
                barMinHeight: (function () {
                    // 判断数据是否为0
                    if (data[name].value === 0) {
                        // 是0则不设置高度，否则设置最小高度5
                        return 0
                    } else {
                        return 5
                    }
                })()
            });
            const yAxisItem = {
                type: 'value',
                name: name,
                position: index % 2 === 0 ? 'left' : 'right',
                offset: index * 10,
                splitLine: {
                    show: false
                },
                nameTextStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: getCssVar("--el-text-color-mix-2"),
                    },
                },
            }
            option.yAxis.push(yAxisItem);
        })
    }
    return option
}
