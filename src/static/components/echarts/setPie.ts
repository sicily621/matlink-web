import * as echarts from 'echarts';
import { getCssVar } from "@static/js/theme/var";
import { lighten } from '@static/js/common/color';
import { zrem } from "../../js/theme/zrem";

export interface PieOptionData {
    isShowPercentage: boolean;
    title: string, // 标题
    hideLegend: boolean,//图例是否显示
    legendX: string, // 图例位置
    legendY: string // 图例位置
    showTotal: boolean;//中心是否显示总数
    titleSize: number;//标题字号
    titleExtendColor: string;//标题颜色
    titleExtendSize: number;//标题字号
    unit?: string;//标题扩展内容
    itemColorWidth: number;//图例颜色块的宽度
    piePosition: string;//饼图位置
    pieTopPosition: string;//饼图top位置
    titlePosition: string;//标题位置
    titlePositionY: string;
    radiusSize: string;//图标尺寸
    legendDirection: string;//图例方向
    padAngle: number;//环间距
    borderRadius: number;//环角度
    isShowLabelLine: boolean;//是否显示标注线
    seriesLable: string;//标注内容
    seriesLableSize: number;//标注字体大小
    seriesLineHeight: number;//标注行高
    isAvoidLabelOverlap: boolean;//标注内容是否可重叠
    borderWidth: number;//边框宽度
    borderColor:string;
    labelPosition: string;//标注位置
    labelAlignTo: string;//标注对齐方式
    labelEdgeDistance: string;//标注与边缘的距离
    emphasisLabel: string;//标注内容
    isShowEmphasis: boolean;//是否显示标注
    isShowCount: boolean;//图例是否显示数量
    isCustomize: boolean;//自定义图例内容
    isShowTotalUnit: boolean;//标题单位是否显示
    textLegendWidth: number;//图例内容宽度
    secondTextLegendWidth: number;
    gridLeft: string;//图形位置
    gridRight: string;
    gridBottom: string;
}
export interface PieSeriesData {
    seriesName: string, // 数据名称
    seriesData: series[] // 图表数据
    legendData?: string[] // 图例
}
interface series {
    name: string, // 单个数据名称
    value: number // 单个数据值 
}
// 传参optionData：图表标题、样式设置
// 传参seriesData：
export const setPie = (optionData: PieOptionData, seriesData: PieSeriesData, store: any, width: number, height: number): any => {
    const baseColors = getCssVar('--el-supplement-color').split(',').map((item: any) => item.trim());
    // 循环使用 pieColors 中的颜色
    const pieColors = seriesData.seriesData.map((item, index) => {
        return baseColors[index % baseColors.length]; // 使用取模运算循环颜色
    });
    const { textColorRegular, bgColor, textColorPrimary, textColorDisabled } = store.getTheme;
    let total = 0;
    if (optionData?.isCustomize) {
        let totalArr = <any>[];
        seriesData.seriesData.forEach((item: any) => {
            totalArr.push(item.value[0]);
            totalArr.push(item.value[1]);
        });
        total = totalArr.reduce((pre: any, cur: any) => pre + cur, 0);
    }
    else {
        total = seriesData.seriesData.reduce((pre, cur) => pre + cur.value, 0);
    }
    const option = {
        grid: {
            left: optionData?.gridLeft || '1%',
            right: optionData?.gridRight || '2%',
            bottom: optionData?.gridBottom || '1%',
            containLabel: true
        },
        title: {
            show: optionData?.showTotal,
            text: [
                total,
                optionData?.isShowTotalUnit === false ? "" : "{unit|" + (optionData?.unit || '') + "}",
            ].join(""),
            left:optionData?.titlePosition|| '24.5%',
            top: height < 150 ? '30%' : '37%',
            textStyle: {
                color: optionData?.titleExtendColor || getCssVar('--el-label-text-color'),
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: "DINAlternate",
                fontSize: `${zrem(optionData?.titleSize ?? 24)}`,
                rich: {
                    unit: {
                        fontSize: `${zrem(optionData?.titleSize - 10 || 14)}`,
                        verticalAlign: "bottom",
                        padding: [0, 0, 0, 2],
                    }
                },
            },
            subtext: optionData?.title,
            subtextStyle: {
                fontFamily: "DINAlternate",
                color: getCssVar('--el-label-text-color'),
                fontSize: `${zrem(optionData?.titleExtendSize || 14)}`,

            },
            textAlign: 'center',

        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(12,27,47,0.6)',
            borderWidth: 0,
            textStyle: {
                //color:'#fff'
            },
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            show: !optionData?.hideLegend,
            type: 'scroll',
            origin: 'vertical',
            orient: optionData?.legendDirection || 'vertical',
            x: optionData?.legendX || '70%',
            y: optionData?.legendY || 'center',
            align: 'left',
            itemWidth: optionData?.itemColorWidth || 5,
            itemHeight: 11,
            itemGap: 15,
            icon: 'rect',
            // data: seriesData.legendData,
            pageIconSize: 10,
            pageIconColor: `rgb(${textColorPrimary})`,
            pageIconInactiveColor: textColorDisabled,
            formatter: function (name: any) {
                var total = 0;
                var target: any;
                for (var i = 0, l = seriesData.seriesData.length; i < l; i++) {
                    total += seriesData.seriesData[i].value;
                    if (seriesData.seriesData[i].name == name) {
                        target = seriesData.seriesData[i].value;
                    }
                }
                var arr = <any>[];
                if (optionData?.isShowPercentage) {
                    if (!isNaN(target)) {
                        arr = ['{a|' + name + '}\xa0\xa0\xa0\xa0 {b|' + target + '' + (optionData?.unit || '') + '\xa0\xa0\xa0\xa0' + ((target / total) * 100).toFixed(2) + '%}'];
                    }
                }
                else if (!optionData?.isShowCount) {
                    if (!isNaN(target)) {
                        arr = ['{a|' + name + '}\xa0\xa0\xa0\xa0 {b|' + target + '' + (optionData?.unit || '') + '\xa0\xa0\xa0\xa0}'];
                    }
                }
                else {
                    arr = [name];
                }
                if (optionData?.isCustomize) {
                    // if(!isNaN(target)){
                    arr = [name + "\xa0\xa0\xa0\xa0" + target[0] + "个 (未完成) \xa0\xa0\xa0\xa0 | \xa0\xa0\xa0\xa0" + target[1] + "个 (已审核)"];
                    // }
                }
                return arr;
            },
            textStyle: {
                //color: 'auto',//textColorRegular,
                //color:`rgb(${textColorPrimary})`,
                color: getCssVar('--el-label-text-color'),
                fontSize: zrem(14),
                padding: [0, 6],
                height: 10,
                rich: {
                    a: {
                        width: optionData?.textLegendWidth || Math.min(width * 0.26, 120), // 固定宽度，确保名称左对齐
                        align: 'left',
                        color: getCssVar('--el-label-text-color'),
                        fontSize: zrem(14),

                    },
                    b: {
                        width: optionData?.secondTextLegendWidth || (width * 0.15), // 固定宽度，确保数值右对齐
                        align: 'right',
                        padding: [0, 10, 0, 0], // 调整间距
                        color: getCssVar('--el-value-text-color'),
                        fontSize: zrem(14),
                    },
                    c: {
                        width: optionData?.percentLegendWidth || (width * 0.15), // 固定宽度，确保百分比右对齐
                        align: 'right',
                        padding: [0, 10, 0, 0], // 调整间距
                        fontSize: zrem(14),
                    },
                },
            },
        },
        series: [
            {
                startAngle: 180,
                minAngle: 5, // 最小值
                legendHoverLink: false, // 取消图例悬浮高亮事件
                name: seriesData?.seriesName || '暂无数据',
                type: 'pie',
                radius: optionData?.radiusSize || ['68%', '50%'],
                left: optionData?.piePosition || '-20%',
                top: optionData?.pieTopPosition || 0,
                avoidLabelOverlap: optionData?.isAvoidLabelOverlap || false,
                padAngle: optionData?.padAngle || 0,
                label: {
                    normal: {
                        show: optionData?.isShowLabelLine || false,
                        position: optionData?.labelPosition || 'center',
                        lineHeight: optionData?.seriesLineHeight || 20,
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: zrem(14),
                            color: getCssVar("--el-text-color-mix-2")
                        },
                        formatter: optionData?.seriesLable || "{b}",
                        alignTo: optionData?.labelAlignTo || 'labelLine', // 标签与引导线对齐
                        avoidLabelOverlap: true, // 避免标签重叠
                        edgeDistance: optionData?.labelEdgeDistance || '10%', // 标签与边缘的距离
                    }
                },
                itemStyle: {
                    borderRadius: optionData?.borderRadius || 11,
                    borderColor: optionData?.borderColor|| bgColor,
                    borderWidth: optionData?.borderWidth === 0 ? 0 : (optionData?.borderWidth || 0),
                    color: (param: any) => {
                        const { dataIndex } = param;
                        return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: pieColors[dataIndex] },
                            { offset: 0.5, color: lighten(pieColors[dataIndex], 0.2) },
                            { offset: 1, color: pieColors[dataIndex] }
                        ])
                    }
                },
                labelLine: {
                    show: optionData?.isShowLabelLine || false
                },
                data: seriesData.seriesData,
                select: {
                    disabled: true
                },
                emphasis: {
                    scale: false,
                    label: {
                        // formatter: [
                        //     '{b|{b}}',
                        //     '{c|{c}}'
                        // ].join('\n') + (optionData?.emphasisLabel || ''),
                        formatter: optionData?.seriesLable || '',
                        show: optionData?.isShowEmphasis || false,
                        fontSize: optionData?.seriesLableSize + 'px' || '24px',
                        //color: () => {
                        //},
                        rich: {
                            b: {
                                //color: 'black',
                                fontSize: optionData?.seriesLableSize + 'px' || '24px',
                                lineHeight: optionData?.seriesLineHeight || 30
                            },
                            c: {
                                fontSize: optionData?.seriesLableSize + 'px' || '24px',
                                lineHeight: optionData?.seriesLineHeight || 50,
                                fontWeight: 'bold'
                            }
                        }
                    }

                }
            }
        ]
    }
    // 当没有数据的时候隐藏 label 设置边框以及白色填充色
    if (seriesData?.seriesData && seriesData?.seriesData[0]?.name === '暂无数据') {
        // option.legend['show'] = false
        option.series[0].itemStyle.borderWidth = optionData?.borderWidth === 0 ? 0 : (optionData?.borderWidth || 1)
    } else {
        // option.legend['show'] = true
    }
    return option
}
