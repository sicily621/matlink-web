import * as echarts from 'echarts';
import { getCssVar} from "@static/js/theme/var";
export const setTwoYAxisBar = (value: any, data: any, store:any) => {
    const storeParams = store;
    const colors = getCssVar('--el-supplement-color').split(',').map((item:any) => item.trim());
    const series = <any>[];
    const yAxis = <any>[];
    const hexToRgba = (hex:any, alpha:any) => {
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
    const dataProcessing = (obj:any) => {
        for (let i = 0; i < obj.length; i++) {
            series.push({
                name:obj[i].name,
                type: "bar",
                yAxisIndex: obj[i].yAxisIndex,
                barMinWidth: 8,
                barMaxWidth: 16,
                barGap: value?.series?.barGap || '100%',
                data:obj[i].data[0].value ==undefined? obj[i].data : [],
                itemStyle:{
                    color:colors[i]
                },
                label:{
                    show: value?.xAxis?.show === true ? false : (value?.xAxis?.show === false ? true : false),
                    position:'bottom',
                    formatter: obj[i].name,
                    textStyle: {
                        fontStyle: 'normal',
                        color: getCssVar("--el-text-color-primary"),
                        
                    },
                    rotate: 60, // 将标签旋转60度使其垂直显示
                        verticalAlign: 'middle', // 垂直居中
                        align: 'right' // 左对齐
                },
                
            })
            if(obj[i].data[0].value !=undefined){
                for(let y = 0; y<obj[i].data.length;y++){
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
        for(let i = 0; i < value?.yAxisList?.yCount;i++){
            yAxis.push({
                type: 'value',
                position: i % 2 === 0 ? 'left' : 'right',
                name: value?.yAxisList?.name[i],
                nameGap:10,
                minInterval:1,
                splitNumber:5,
                nameTextStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                },
                axisLabel: {
                    show:true,
                    interval: 0, // 使x轴横坐标全部显示
                    //y轴文字的配置
                    textStyle: {
                        color: getCssVar("--el-text-color-mix-2"),
                        margin: 15,
                    },
                    // formatter: '{value} %'//y轴的每一个刻度值后面加上‘%’号
                },
                axisLine: {
                    //y轴线的颜色以及宽度
                    show: true,
                    lineStyle: {
                        color: getCssVar("--el-border-color"),
                        width: 1,
                        type: "solid",
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: { color: getCssVar("--el-border-color") },
                }
            })
        }
        return yAxis;
    }
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
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            backgroundColor : 'rgba(12,27,47,0.6)',
            borderWidth: 0,
            textStyle: {
                //color: '#fff'
            },
        },
        toolbox: {
            right:"20px",
            show: value?.toolbox?.show ?? false ,

            feature: {

              magicType: { show: true, type: ['line', 'bar'] },

            }
          },
        legend: {
            show: value?.legend?.show === true ? true : (value?.legend?.show ? false : true),
            type: 'scroll',
            x: value?.legend?.legendX || 'right',
            y: value?.legend?.legendY || '3%',
            padding:  value?.legend?.legendPadding || [0, 0],
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            icon: 'rect',
            pageIconSize: 10,
            textStyle: {
                color: colors,
                fontSize: 14,
                padding:[0,6],
                height: 10,
                rich: {
                    a: {
                        verticalAlign: 'middle',
                    },
                }
            },
            data: value?.legend?.data ||[]
        },
        grid: { // 设置图形位置  横纵轴偏移
            left: value?.grid?.gridLeft || '10%',
            top: value?.grid?.gridTop || '17%',
            height: value?.grid?.height ||'66%',
            containLabel: true
        },
        xAxis: {
            show: value?.xAxis?.show === true ? true : (value?.xAxis?.show === false ? false : true),
            type: value?.xAxis?.type || 'value', //'value' : 'category'
            axisLabel: {
                //x轴文字的配置
                show: !value?.xAxis?.axisLabel?.show,
                textStyle: {
                    color: getCssVar("--el-text-color-mix-2"),
                },
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
            data:  value?.xAxis?.data || [],
        },
        yAxis: twoYAxis(),
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
        itemStyle: {
            borderWidth: 1,
            borderColor: getCssVar("--el-border-color"),
        },
        series: dataProcessing(data) ||[]
    }
    if (value?.yData) { option.yAxis.data = value?.yData }
    if (value?.xData) { option.xAxis.data = value?.xData }
    return option
}
