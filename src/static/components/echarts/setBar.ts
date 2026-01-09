import * as echarts from 'echarts';
import { getCssVar } from "@static/js/theme/var";
import { zrem } from "../../js/theme/zrem";

export const setBar = (value: any, data: any, store: any, width: number, height: number) => {
    const storeParams = store;
    const transparentColors = getCssVar("--el-supplement-color-opacity-3").match(/rgba\([^)]+\)/g);
    const baseColors = getCssVar('--el-supplement-color').split(',').map((item: any) => item.trim());

    const series = <any>[];
    const allData = data.reduce((acc: any, item: any) => {
        return acc.concat(item.data);
    }, []);
    // 循环使用 barColors 中的颜色
    const barColors = allData.map((item: any, index: any) => {
        return baseColors[index % baseColors.length]; // 使用取模运算循环颜色
    });
    const colors = value?.transparentStyle ? transparentColors : barColors;
    const max = Math.max(...allData);
    const defaultMax = Math.ceil((max / 0.8));
    let dataZoomArr: any[] = [];
    if (value?.dataZoom?.show) {
        dataZoomArr = [
            {
                type: 'slider',
                start: 0,
                end: 50,
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
        let r = '0', g = '0', b = '0';

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
        const totalData: number[] = [];
        for (let i = 0; i < data[0]?.data.length; ++i) {
            let sum = 0;
            for (let j = 0; j < data.length; ++j) {
                sum += data[j]?.data[i] ?? 0;
            }
            totalData.push(sum);
        }
        for (let i = 0; i < obj.length; i++) {
            series.push({
                name: obj[i].name,
                type: "bar",
                barMinWidth: 8,
                barMaxWidth: 16,
                barGap: value?.series?.barGap || '20%',
                data: obj[i].data[0]?.value == undefined ? obj[i].data : [],
                itemStyle: {
                    borderColor: "transparent",
                    color: (colors && colors[i]) ? colors[i] : '#cccccc',
                    // 添加圆角支持
                    barBorderRadius: value?.series?.itemStyle?.barBorderRadius || 0,
                },
                label: {
                    show: value?.xAxis?.show === true ? false : (value?.xAxis?.show === false ? true : false),
                    position: 'bottom',
                    formatter: obj[i].name,
                    textStyle: {
                        fontStyle: 'normal',
                        color: getCssVar("--el-text-color-primary"),

                    },
                    rotate: 60, // 将标签旋转60度使其垂直显示
                    verticalAlign: 'middle', // 垂直居中
                    align: 'right' // 左对齐
                }
            })
            if (obj[i].data[0]?.value != undefined) {
                for (let y = 0; y < obj[i].data.length; y++) {
                    let color = (colors ?? [])[y];
                    let test = {
                        value: obj[i].data[y].value,
                        itemStyle: {
                            color: hexToRgba(color, 1),
                            // borderColor: hexToRgba(color, 1),
                            // 添加圆角支持
                            barBorderRadius: obj[i].data[y].itemStyle?.barBorderRadius || 0,
                        },
                    }
                    series[i].data.push(test);
                }
            }
            if (obj[i]?.stack) {
                series[i].stack = obj[i]?.stack;
                series[i].barMinWidth = 16
                series[i].barMaxWidth = 32
                series[i].label = { show: false }
                series[i].emphasis = {
                    label: {
                        show: true,
                        textStyle: {
                            fontStyle: 'normal',
                            color: getCssVar("--el-color-white"),
                        },
                        formatter: (params: any) => {
                            return totalData?.[params.dataIndex] ? parseInt(`` + params.value / totalData[params.dataIndex] * 100) : '0'
                        }
                    },
                }
            }
        }
        return series;
    }
    const getXAxisInterval = (dataLength: number, maxShowCount = value?.xAxis?.maxShowCount ?? 31) => {
        if (dataLength <= maxShowCount) {
            return 0;
        }
        const interval = Math.ceil(dataLength / maxShowCount);
        return interval;
    };
    const option: any = {
        color: colors,
        title: {
            show: value?.title?.show === true ? true : (value?.title?.show ? false : true),
            text: value?.title?.text || null,
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
            subtext: value?.title?.subtext || null,
            //副标题文本样式
            subtextStyle: {},
        },
        tooltip: {
            confine: true,
            className: value?.tooltip?.className ?? "tooltip-wrap",
            trigger: value?.tooltip?.triggerType ?? 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            backgroundColor: 'rgba(12,27,47,0.6)',
            borderWidth: 0,
            textStyle: {
                //color: '#fff'
            },
        },
        toolbox: {
            // right: "20px",
            show: value?.toolbox?.show ?? false,
            textStyle: {
                fontSize: zrem(14),
                fonFamily: "PingFang SC"
            },
            feature: {
                magicType: { show: true, type: ['line', 'bar'] },
            }
        },
        legend: {
            show: value?.legend?.show === true ? true : (value?.legend?.show ? false : true),
            type: 'scroll',
            x: value?.legend?.legendX || 'right',
            y: value?.legend?.legendY || '0%',
            padding: value?.legend?.legendPadding || [0, 0],
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            icon: 'rect',
            pageIconSize: 10,
            textStyle: {
                color: getCssVar('--el-label-text-color'),
                fontSize: zrem(14),
                padding: [0, 6],
                height: 10,
                rich: {
                    a: {
                        verticalAlign: 'middle',
                    },
                }
            },
            data: value?.legend?.data || []
        },
        grid: {
            left: "0.5%",
            right: width < 600 ? '5%' : '2%',
            top: "35",
            bottom: value?.grid?.gridBottom || "0%",
            containLabel: true
        },
        xAxis: {
            show: value?.xAxis?.show === true ? true : (value?.xAxis?.show === false ? false : true),
            name: value?.xAxis?.name,
            nameGap: 5,
            nameTextStyle: {
                // align: "right",
                // lineHeight: 30,
                // verticalAlign: "top",
                color: getCssVar("--el-text-color-mix-2"),
                fontSize: zrem(14),
                fonFamily: "PingFang SC",
                // padding: [0, (value?.xAxis?.name?.length ?? 0) * 2, 0, 0]
            },
            type: value?.xAxis?.type || 'value', //'value' : 'category'
            axisLabel: {
                //x轴文字的配置
                show: !value?.xAxis?.axisLabel?.show,
                interval: value?.xAxis?.maxShowCount ? getXAxisInterval(value?.xAxis?.data?.length || 0) : "auto",
                textStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                    fontSize: zrem(14),
                    fonFamily: "PingFang SC"
                },
                rotate: value?.xAxis?.rotate || 0,  // 倾斜角度（-90到90）
            },
            splitLine: {
                //分割线配置
                show: false,
                lineStyle: {
                    color: getCssVar("--el-border-color"),
                },
            },
            axisTick: {
                lineStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                },
            },
            axisLine: {
                // 设置x轴的线条样式
                lineStyle: {
                    show: true,
                    width: 1,
                    color: getCssVar("--el-border-color"),
                    // color: "red",
                },
            },
            data: value?.xAxis?.data || [],
        },
        yAxis: {
            show: value?.yAxis?.show === true ? true : (value?.yAxis?.show ? false : true),
            type: value?.yAxis?.type || 'value',  //'category' : 'value'
            //name: value?.yAxis?.name,
            // nameGap: 0,
            // nameTextStyle: {
            //     color: getCssVar("--el-text-color-mix-2"),
            //     verticalAlign: 'bottom',
            //     align: 'center',
            //     fontSize: zrem(14),
            //     padding: [0, 28, height < 200 ? 8 : 15, (value?.yAxis?.name?.length ?? 0) * 4]
            // },
            axisLabel: {
                show: !value?.yAxis?.axisLabel?.show,
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
                show: !value?.yAxis?.axisLabel?.show,
                lineStyle: { color: getCssVar("--el-border-color") },
            },
            splitNumber: height < 200 ? 2 : 5,
            data: value?.yAxis?.data || [],
            max: value?.yAxis?.max ?? defaultMax,
            min: 0
        },
        dataZoom: dataZoomArr,
        graphic: {
            elements: [
                {
                    type: 'text',
                    left: '0.8%',
                    top: '0.5%',
                    silent: true,
                    invisible: (value?.yAxis?.name.length ?? 0) === 0, // 是否可见，这里的意思是当没有数据时可见
                    style: {
                        text: value?.yAxis?.name,
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
                        fill: getCssVar("--el-text-color-mix-2")
                    },
                }
            ]

        },
        itemStyle: {
            borderWidth: 1,
            borderColor: getCssVar("--el-border-color"),
        },
        series: dataProcessing(data) || []
    }
    if (value?.yData) { option.yAxis.data = value?.yData }
    if (value?.xData) { option.xAxis.data = value?.xData }
    if (defaultMax > 0) {
        option.yAxis.interval = Math.ceil(option.yAxis.max / (height < 200 ? 3 : 5))
    }
    return option
}
