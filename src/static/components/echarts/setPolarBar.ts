import { getCssVar } from "@static/js/theme/var";

export const setPolarBar = (value: any, data: any) => {
    const colors = getCssVar('--el-supplement-color').split(',').map(item => item.trim());
    const series: any[] = [];
    const datas: any[] = [];
    data.forEach((value: any) => {
        datas.push(value.value);
    });
    const maxNum = Math.max(...datas);
    const dataProcessing = (obj: any) => {
        for (let i = 0; i < obj.length; i++) {
            var dd = [];
            dd[i] = obj[i].value;
            series.push({
                stack: 'ring',
                type: 'bar',
                name: obj[i].name,
                data: dd.map((v) => v || 0),
                showBackground: true,
                itemStyle: {
                    color: colors[i],
                },
                backgroundStyle: { color: getCssVar('--el-border-color-light') },
                coordinateSystem: 'polar',
                roundCap: true,
                barWidth: '55%',
                barGap: '-100%', // 两环重叠
                // radius: ['44%', '47%'],
            });
        }
        return series;
    }
    const option: any = {
        // backgroundColor: 'rgba(0,0,0,0)', // 这里将背景色设为了#f5f5f5（十六进制颜色值）
        title: {
            show: false,
            text: '26,798',
            subtext: '总数',
            textAlign: 'center',
            textVerticalAlign: 'center',
            top: '44%',
            left: '24%',
            textStyle: {
                // color: 'rgba(0,0,0,.5)',
                fontSize: 16,
            },
            subtextStyle: {
                // color: 'rgba(0,0,0,.5)',
                fontSize: 14,
            },
        },
        angleAxis: {
            max: maxNum + 100, // 一圈是多少
            clockwise: true, // 逆时针
            show: false, // 隐藏刻度线
            startAngle: 90, // startAngle表示起始角度
            axisLine: {
                show: false, // 隐藏角度轴（圆心角）
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false, // 隐藏分割线
            },
        },
        radiusAxis: {
            type: 'category',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            z: 5,
        },
        polar: {
            center: ['28%', '50%'],
            radius: value?.radiusSize || ['20%', '60%'], // 总体的最小半径、最大半径
        },
        tooltip: {
            show: true,
            formatter: function (e: any) {
                return `${e.seriesName}<br/>${e.marker} ${e.value} `;
            },
            backgroundColor: "rgba(0,0,0,0.5)", // 提示框浮层的背景颜色
        },
        legend: {
            orient: 'vertical',
            // data: data.map((v) => v.name),
            left: value?.legendLeft || '60%',
            top: 'middle',
            x: 'left',
            itemWidth: 14,
            itemHeight: 14,
            formatter: function (name: any) {
                var total = 0;
                var target;
                for (var i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name == name) {
                        target = data[i].value;
                    }
                }
                var arr = [];
                if (value?.isShowPercentage) {
                    arr = ['{a|' + name + '}\xa0\xa0\xa0\xa0 {b|' + target + '个\xa0\xa0\xa0\xa0' + ((target / total) * 100).toFixed(2) + '%}'];
                }
                else {
                    arr = ['{a|' + name + '}\xa0\xa0\xa0\xa0 {b|' + target + '个\xa0\xa0\xa0\xa0}'];
                }

                return arr;
            },
            textStyle: {
                rich: {
                    a: {
                        fontSize: 14,
                        verticalAlign: 'middle',
                        align: 'left',
                        padding: [0, 0, -2, 0],
                        lineHeight: 18,
                        color: getCssVar('--el-text-color-mix-2'),
                    },
                    b: {
                        fontSize: 14,
                        verticalAlign: 'middle',
                        align: 'bottom',
                        padding: [0, 0, -2, 0],
                        lineHeight: 18,
                        color: getCssVar('--el-text-color-primary'),
                    },
                    c: {
                        fontSize: 14,
                        align: 'bottom',
                        padding: [0, 0, -2, 0],
                        lineHeight: 18,
                        color: getCssVar('--el-text-color-mix-2'),
                    },
                },
            },
        },
        series: dataProcessing(data) || []
    }
    return option
}
