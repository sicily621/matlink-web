import * as echarts from 'echarts';
import { hexToRgb } from '@static/js/common/color';
import { getCssVar } from "@static/js/theme/var";
import { zrem } from "../../js/theme/zrem";
export const setLine = (value: any, data: any, store: any, width: number, height: number) => {
    // 每个位数，都减去对应的5，例如10减去5 100减去50,2000减去500
    const getCustomMin = (value: number): number => {
        if (value <= 0) return value;

        const str = Math.floor(value).toString();
        const len = str.length;

        if (len === 1) {
            // 个位数：减 5
            return Math.max(0, value - 5);
        } else {
            // 多位数：减去 5 * 10^(len - 2)
            const subtract = 5 * Math.pow(10, len - 2);
            return value - subtract;
        }
    }
    const colors = getCssVar('--el-supplement-color').split(',').map((item: any) => item.trim());
    const allData = Object.keys(data).reduce((acc: any, item: any) => {
        return acc.concat(data[item]?.data ?? data[item]);
    }, []);
    const max = Math.max(...allData);
    const maxCeil = Math.ceil(max)
    const min = Math.min(...allData);
    let defaultMin = getCustomMin(Math.floor(min));
    let defaultMax = Math.ceil((defaultMin + (maxCeil - defaultMin) / 0.8));
    if (max - min < 150) {
        defaultMax = max
    }
    let dataZoomArr: any[] = [];
    const yAxis = <any>[];
    const series: any[] = [];
    if (value?.dataZoom?.show) {
        dataZoomArr = [
            {
                type: 'slider',
                start: 0,
                end: 10,
                bottom: 10,
                height: 30,
                handleSize: '100%',
                show: value?.dataZoom?.show || false,
            },
            {
                type: 'inside'
            }
        ]
    } else {
        dataZoomArr = [];
    }
    const hexToRgba = (hex: any, alpha: any) => {
        let r = "", g = "", b = "";

        // 3 digits
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
            // 6 digits
        } else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        return "rgba(" + +r + "," + +g + "," + +b + "," + alpha + ")";
    }
    const dataProcessing = (obj: any) => {
        for (let i = 0; i < obj.length; i++) {
            const rgb = hexToRgb(colors[i]);
            series.push({
                name: obj[i].name,
                type: "line",
                yAxisIndex: obj[i]?.yAxisIndex ?? 0,
                showSymbol: obj[i].showSymbol ? false : true, // 显示标记点
                symbol: 'circle', // 标记点形状
                symbolSize: 0, // 标记点大小
                barMinWidth: 8,
                barMaxWidth: 16,
                tooltip: {
                    valueFormatter: function (value: any) {
                        return value + ` ${(obj[i]?.unit || '')}`;
                    }
                },
                smooth: value?.smooth || true,
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: `rgba(${rgb},0.13)`
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
                data: obj[i].data[0]?.value == undefined ? obj[i].data : []
            })
            if (obj[i].data[0]?.value != undefined) {
                for (let y = 0; y < obj[i].data.length; y++) {
                    let color = colors[y];
                    let test = {
                        value: obj[i].data[y].value,
                        itemStyle: {
                            color: hexToRgba(color, 1),
                            // borderColor: hexToRgba(color, 1),
                        },
                    }
                    series[i].data.push(test);
                }
            }
        }
        return series;
    }
    const twoYAxis = () => {
        for (let i = 0; i < value?.yAxisList?.yCount; i++) {
            const paddingLeft = (value?.yAxisList?.name[i]?.length ?? 0) * 10;
            yAxis.push({
                type: 'value',
                name: value?.yAxisList?.name[i],
                nameGap: 0,
                minInterval: 1,
                splitNumber: 5,
                nameTextStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                    fontSize: zrem(14),
                    verticalAlign: 'bottom',
                    align: 'center',
                    padding: [0, 0, 15, (i === 0 && allData.length === 0) ? paddingLeft : 0]
                },
                axisLabel: {
                    show: true,
                    interval: 0, // 使x轴横坐标全部显示
                    //y轴文字的配置
                    textStyle: {
                        color: getCssVar("--el-text-color-mix-2"),
                        margin: 15,
                        fontSize: zrem(13),
                        fonFamily: "PingFang SC"
                    },
                    // formatter: '{value} %'//y轴的每一个刻度值后面加上‘%’号
                },
                axisLine: {
                    //y轴线的颜色以及宽度
                    show: false,
                    lineStyle: {
                        color: getCssVar("--el-border-color"),
                        width: 1,
                        type: "solid",
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: { color: getCssVar("--el-border-color") },
                },
                max: value?.yAxisList?.max?.[i] ?? defaultMax,
                min: value?.yAxis?.min ?? defaultMin,
            })
        }
        return yAxis;
    }
    const getXAxisInterval = (dataLength: number, maxShowCount = value?.xAxis?.maxShowCount ?? 60) => {
        if (dataLength <= maxShowCount) {
            return 0;
        }
        const interval = Math.ceil(dataLength / maxShowCount);
        return interval;
    };
    const option: any = {
        color: colors,
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
            className: "tooltip-wrap",
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            backgroundColor: 'rgba(12,27,47,0.6)',
            borderWidth: 0,
            textStyle: {
                //color:'#fff'
            }
        },
        legend: {
            show: !value?.hideLegend,
            type: 'scroll',
            x: value?.legendX || 'right',
            y: value?.legendY || '0%',
            itemWidth: 18,
            itemHeight: 8,
            itemGap: 16,
            itemStyle: {
                color: "#fff",
                borderWidth: 2,
                borderColor: colors,
            },
            formatter: function (name: string) {
                return `{icon|}{text|${name}}`;
            },
            textStyle: {
                color: getCssVar('--el-label-text-color'),
                fontSize: zrem(14),
                height: 10,
                rich: {
                    icon: {
                        width: 2,
                    },
                }
            },

        },
        grid: {
            left: "0.5%",
            right: width < 600 ? '5%' : '2%',
            top: "35",
            bottom: value?.grid?.bottom || "0%",
            containLabel: true
        },
        xAxis: {
            type: value?.reverse ? 'value' : 'category',
            name: value?.xAxis?.name,
            nameGap: 5,
            nameTextStyle: {
                // align: "right",
                // lineHeight: 30,
                // verticalAlign: "top",
                color: getCssVar("--el-text-color-mix-2"),
                fontSize: zrem(14),
                fonFamily: "PingFang SC",
                padding: [0, width < 600 ? (value?.xAxis?.name?.length ?? 0) * 2 : -1, 0, 0]
            },
            axisTick: { show: false },
            axisLabel: {
                show: true,
                interval: value?.xAxis?.maxShowCount ? getXAxisInterval(value?.xData?.length || 0) : "auto",
                textStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                    fontSize: zrem(14),
                    fonFamily: "PingFang SC"
                }
            },
            splitLine: {
                show: false
            },
            data: value?.xAxis?.data || [],

        },
        yAxis: value?.yAxisList ? twoYAxis() : {
            type: value?.reverse ? 'category' : 'value',
            // name: value?.yName,
            splitLine: {
                show: true,
                lineStyle: { color: getCssVar("--el-border-color") },
            },
            /* nameTextStyle: {
                color: getCssVar("--el-text-color-mix-2"),
                verticalAlign: 'bottom',
                align: 'center',
                fontSize: zrem(14),
                padding: [0, 28, height < 200 ? 8 : 15, (value?.yName?.length ?? 0) * 5]
            },
            nameGap: 0, */
            axisLabel: {
                show: true,
                interval: value?.xAxis?.maxShowCount ? getXAxisInterval(value?.xData?.length || 0) : "auto",
                textStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                    fontSize: zrem(14),
                    fontFamily: "PingFang SC"
                },
            },
            splitNumber: value?.yAxis?.splitNumber ?? (height < 200 ? 2 : 5), // ✅ 支持传参// 建议分为5段
            inverse: value?.inverse,
            data: null,
            max: value?.yAxis?.max ?? defaultMax,
            min: value?.yAxis?.min ?? defaultMin,
        },
        dataZoom: dataZoomArr,
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: '0.8%',
                    top: '0.5%',
                    silent: true,
                    invisible: (value?.yName?.length ?? 0) === 0, // 是否可见，这里的意思是当没有数据时可见
                    style: {
                        text: value?.yName,
                        fontSize: zrem(14),
                        fill: getCssVar("--el-text-color-mix-2")
                    },
                },
                {
                    type: 'text',
                    left: 'center',
                    top: '30%',
                    silent: true,
                    invisible: Object.keys(data).length !== 0, // 是否可见，这里的意思是当没有数据时可见
                    style: {
                        text: '暂无数据',
                        fontSize: zrem(16),
                        fill: getCssVar("--el-text-color-mix-2"),
                    },
                }
            ]
        },
        series: []
    }
    if (value?.yData) { option.yAxis.data = value?.yData }
    if (value?.xData) { option.xAxis.data = value?.xData }
    const seriesNameList = Object.keys(data)
    option.series = []
    if (value?.yAxisList) {
        option.series = dataProcessing(data)

    } else {
        if (seriesNameList.length) {
            option.legend.data = seriesNameList
            seriesNameList.map((name, index) => {
                const rgb = hexToRgb(colors[index]);
                option.series.push({
                    name: name,
                    type: 'line',
                    barGap: 0,
                    smooth: value?.smooth || true,
                    showSymbol: value?.showSymbol || false, // 显示标记点
                    symbol: 'circle', // 标记点形状
                    symbolSize: 0, // 标记点大小
                    //color: value?.//color,
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
                    areaStyle: {
                        // opacity: value?.areaColor ? 1 : 0,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: `rgba(${rgb},0.13)`
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
                })
            })
        }
    }

    if (defaultMax > 0 && max - min > 1) {
        option.yAxis.interval = Math.ceil(option.yAxis.max / (height < 200 ? 3 : 5))
    }
    if (max - min < 1) {
        option.yAxis.splitNumber = 3
    }
    return option
}
