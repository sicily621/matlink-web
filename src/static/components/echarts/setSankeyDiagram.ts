import { getCssVar } from "@static/js/theme/var";
export const setSankeyDiagram = (value: any, data: any, store: any) => {
  const { colors } = store.getTheme;
  const option: any = {
    title: {
      show: !!value?.title,
      text: value?.title || null,
      textStyle: {
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
      triggerOn: 'mousemove',
      backgroundColor: 'rgba(12,27,47,0.6)',
      borderWidth: 0,
    },
    series: []
  }
  const seriesNameList = Object.keys(data);
  option.series = [];
  const levelList: any[] = [];
  for (let i = 0; i <= value.level; i++) {
    levelList.push({
      depth: i,
      itemStyle: {//柱子的颜色
        color: colors[i]
      }
    })
  }

  if (seriesNameList.length) {
    seriesNameList.map((name) => {
      option.series.push({
        type: 'sankey',
        layout: 'none',
        nodeGap: 15, // 设置节点间间距
        data: data[name].nodes,
        links: data[name].links,
        nodeAlign: 'center', // 设置节点对齐方式
        label: {
          normal: {
            show: true, // 显示标签
            formatter: function (node: any) {
              return node.data.name;// 自定义标签内容
            },
            textStyle: {
              color: getCssVar("--el-text-color-primary")
            },
          }
        },
        emphasis: {
          focus: 'adjacency'
        },
        levels: levelList,
        lineStyle: {
          curveness: 0.5
        }
      });
    })
  }
  return option
}
