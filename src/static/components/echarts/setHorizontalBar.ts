import * as echarts from 'echarts';
import { getCssVar} from "@static/js/theme/var";
export const setHorizontalBar = (value: any, data: any) => {
    const colors = getCssVar('--el-supplement-color').split(',').map((item:any) => item.trim());
    const  datas = <any>[];
    const series = <any>[];
    const valDatas = <any>[];
    data.forEach((value:any) => {
        valDatas.push(value.value);
        datas.push(value.value * 1.2);
    });
    const maxNum = Math.max(...datas);
    const dataLength = data.length;
    const outData=[];
    for(let i = 0;i < dataLength; i++){
        outData.push(maxNum)
    }

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
                name: obj[i].name,
                value: obj[i].value,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                        offset: 0,
                        color: hexToRgba(colors[i],0.5)
                    },
                        {
                            offset: 1,
                            color: hexToRgba(colors[i],1)
                        }
                    ]),
                },
            })
        }
        return series;
    }

    const option: any = {
        xAxis: {
            max: maxNum,
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false,
                textStyle: {
                    color: getCssVar('--el-text-color-primary'),
                    margin: 15,
                },
            },
            axisTick: {
                show: false
            }
        },
        grid: {
            left: value?.grid?.gridLeft || '16%',
            right: value?.grid?.gridRight || '16%',
            top: value?.grid?.gridTop || '10%',
            height: value?.grid?.height || '66%',
            containLabel: true
        },
        yAxis: [{
            type: "category",
            inverse: true,
            data: data || [],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
                //y轴文字的配置
                textStyle: {
                    color: getCssVar('--el-text-color-primary'),
                    margin: 15,
                },
            }
        }],
        series: [{
            // 内
            type: "bar",
            silent: true,     // 禁用交互
            barWidth: 18,
            legendHoverLink: false,
            itemStyle: {
                color: 'rgba(200, 200, 200, 0.3)'  // 半透明灰色背景
            },
            label: {
                normal: {
                    show: true,
                    position: "left",
                    formatter: "{b}",
                    textStyle: {
                        color: getCssVar('--el-text-color-mix-2'),
                        fontSize: 14,
                        width:'10%'
                    }
                }
            },
            data: dataProcessing(data) || [],
            z: 1,
            animationEasing: "elasticOut"
        },
            {
                // 分隔
                type: "pictorialBar",
                itemStyle: {
                    normal:{
                        color:getCssVar('--el-bg-color')
                    }
                },
                symbolRepeat: "fixed",
                symbolMargin: 6,
                symbol: "rect",
                symbolClip: true,
                symbolSize: [1, 21],
                symbolPosition: "start",
                symbolOffset: [1, -1],
                symbolBoundingData: Math.max(...datas),
                data: data || [],
                z: 2,
                animationEasing: "elasticOut"
            },
            {
                // 外边框
                type: "pictorialBar",
                symbol: "rect",
                symbolBoundingData: Math.max(...datas),
                itemStyle: {
                    normal: {
                        color: "none"
                    }
                },
                label: {
                    normal: {
                        formatter: (params:any) => {
                            var text;
                            if(params.dataIndex==1){
                                text = '{f|  '+params.data+'}';
                            }else if(params.dataIndex==2){
                                text = '{f|  '+params.data+'}';
                            }else if(params.dataIndex==3){
                                text = '{f|  '+params.data+'}';
                            }else{
                                text = '{f|  '+params.data+'}';
                            }
                            return text;
                        },
                        rich:{
                            f:{
                                color:getCssVar('--el-text-color-primary'),
                                fontWeight:700,
                            }
                        },
                        position: 'right',
                        distance: 0, // 向右偏移位置
                        show: true
                    }
                },
                data: valDatas || [],
                z: 0,
                animationEasing: "elasticOut"
            },
            {
                name: "外框",
                type: "bar",
                barGap: "-120%", // 设置外框粗细
                data: outData, //外框长度
                barWidth: 25,
                itemStyle: {
                    normal: {
                        color: getCssVar('--el-border-color-light'), // 填充色
                        barBorderColor: 'transparent', // 边框色
                        barBorderWidth: 1, // 边框宽度
                        // barBorderRadius: 0, //圆角半径
                        label: {
                            // 标签显示位置
                            show: false,
                            position: "top" // insideTop 或者横向的 insideLeft
                        }
                    },
                    emphasis:{
                        color: getCssVar('--el-border-color-light'), // 填充色
                        barBorderColor: 'transparent', // 边框色
                    }
                },
                z: 0
            }
        ]
    }
    if (value?.yData) { option.yAxis.data = value?.yData }
    if (value?.xData) { option.xAxis.data = value?.xData }
    return option
}
