import { getCssVar } from "@static/js/theme/var";
import { fontSize, zrem } from "@static/js/theme/zrem";

export interface LiquidFillOptionData {
    isTitle?: boolean,
    titleText?: string,
    titleFamily?: string,
    titleFontSize?: number;
    titleExtendColor?: string;
    radiusSize?: string
}
export interface LiquidFillSeriesData {
    seriesData: number; // 单个数据值
    color?: string;
    labelFontSize?: number; // 数据字体大小

}
// 传参optionData：图表标题、样式设置
// 传参seriesData：
export const setLiquidFill = (optionData: LiquidFillOptionData, seriesData: LiquidFillSeriesData, store: any) => {
    // const { colors: themeColors, textColorRegular } = store.getTheme;
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
    const option = {
        title: {
            show: optionData.isTitle || true,
            text: optionData.titleText || '', // 标题名
            // 标题的样式
            textStyle: {
                color: optionData?.titleExtendColor || getCssVar('--el-label-text-color'), // 字体颜色
                fontFamily: optionData.titleFamily || "Bgothm", // 字体
                fontSize: optionData.titleFontSize || 20,
                fontWeight: '400',
                align: 'center', // 文字的水平方式
            },
            left: 'center', // 定位
            top: '52%'
        },
        series: [{
            type: 'liquidFill',
            radius: optionData?.radiusSize || '100%',
            waveAnimation: true,
            data: [{
                value: seriesData.seriesData,
                direction: 'left',
                itemStyle: {
                    normal: {
                        color: hexToRgba(seriesData.color, 0.8) || '#7DCEA0'
                    }
                }
            },
            {
                value: 0.45,
                direction: 'right',
                itemStyle: {
                    normal: {
                        color: hexToRgba(seriesData.color, 1) || '#52BE80 '
                    }
                }
            },
            ],
            outline: {
                show: true,
                borderDistance: 5, // 边框线与图表的距离 数字
                itemStyle: {
                    opacity: 0.9, // 边框的透明度   默认为 1
                    borderWidth: 2, // 边框的宽度
                    shadowBlur: 14, // 边框的阴影范围 一旦设置了内外都有阴影
                    // shadowColor: "#fff", // 边框的阴影颜色,
                    borderColor: hexToRgba(seriesData.color, 1) || '#3AA66E' // 边框颜色
                }
            },
            itemStyle: {
                opacity: 0.9, // 波浪的透明度
                shadowBlur: 0 // 波浪的阴影范围
            },
            backgroundStyle: {
                color: '#fff' // 图表的背景颜色
            },
            label: { // 数据展示样式
                show: true,
                color: optionData?.titleExtendColor || getCssVar('--el-label-text-color'),
                insideColor: '#fff',
                fontSize: seriesData?.labelFontSize || 24,
                fontWeight: 400,
            }
        }]
    }
    return option
}
