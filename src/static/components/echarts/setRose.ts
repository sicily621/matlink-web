import * as echarts from 'echarts';
import { lighten } from '@static/js/common/color';
export interface RoseOptionData {
    title: string, // 标题   
    hideLegend: boolean,//图例是否显示
    legendX: string, // 图例位置
    legendY: string // 图例位置

}
export interface RoseSeriesData {
    seriesName: string, // 数据名称
    seriesData: series[] // 图表数据
    legendData?: string[] // 图例
    seriesRadius?: string[] | string, // 图表半径
    seriesLeft?: string // 图表位置
}
interface series {
    name: string, // 单个数据名称
    value: number // 单个数据值
}
// 传参optionData：图表标题、样式设置
// 传参seriesData：
export const setRose = (optionData: RoseOptionData, seriesData: RoseSeriesData, store: any): any => {
    const { colors, textColorPrimary, textColorDisabled } = store.getTheme;
    const option = {
        grid: {
            left: '1%',
            right: '2%',
            bottom: '1%',
            containLabel: true
        },
        title: {
            show: !!optionData?.title,
            text: optionData?.title || null,
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
            trigger: 'item',
            backgroundColor: 'rgba(12,27,47,0.6)',
            borderWidth: 0,
            textStyle: {
                //color:'#fff'
            },
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            show: true,
            type: 'scroll',
            orient: 'vertical',
            x: optionData?.legendX || '10%',
            y: optionData?.legendY || 'center',
            icon: 'rect',
            itemWidth: 3,
            itemHeight: 11,
            itemGap: 15,
            pageIconSize: 10,
            pageIconColor: `rgb(${textColorPrimary})`,
            pageIconInactiveColor: textColorDisabled,
            textStyle: {
                fontSize: 14,
                padding: [0, 6],
                height: 10,
                rich: {
                    a: {
                        verticalAlign: 'middle',
                    },
                }
            }
        },
        series: [
            {
                startAngle: 180,
                minAngle: 5, // 最小值
                name: seriesData?.seriesName || '暂无数据',
                type: 'pie',
                roseType: 'radius',
                selectedMode: 'single',
                radius: seriesData?.seriesRadius || ['30%', '75%'],
                center: ['40%', '50%'],
                left: seriesData?.seriesLeft || '-20%',
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    borderWidth: 0,
                    color: (param: any) => {
                        const { dataIndex } = param;
                        return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                            { offset: 0, color: colors[dataIndex] },
                            { offset: 1, color: lighten(colors[dataIndex], 0.2) }
                        ])
                    }
                },
                labelLine: {
                    show: false
                },
                data: seriesData.seriesData,
                emphasis: {
                    label: {
                        show: false,
                    }
                }
            }
        ]
    }
    // 当没有数据的时候隐藏 label 设置边框以及白色填充色
    if (seriesData.seriesData && seriesData.seriesData[0].name === '暂无数据') {
        // option.legend['show'] = false
        option.series[0].itemStyle.borderWidth = 1
    } else {
        // option.legend['show'] = true
    }

    return option
}
