export const useTheme = function (store: any) {
    const { textColorPrimary, borderColorDark, colors } = store.getTheme;
    return {
        "color": colors,
        "backgroundColor": `rgba(0,0,0,0)`,
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": `rgb(${textColorPrimary})`
            },
            "subtextStyle": {
                "color": `rgb(${textColorPrimary})`
            }
        },
        "line": {
            "itemStyle": {
                "borderWidth": "1"
            },
            "lineStyle": {
                "width": "2"
            },
            "symbolSize": "0",
            "symbol": "circle",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "borderWidth": "1"
            },
            "lineStyle": {
                "width": "2"
            },
            "symbolSize": "0",
            "symbol": "circle",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "barBorderWidth": 0,
                "barBorderColor": "#ccc"
            }
        },
        "pie": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "scatter": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "boxplot": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "parallel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "sankey": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "funnel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "gauge": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "candlestick": {
            "itemStyle": {
                "color": "#eb5454",
                "color0": "#47b262",
                "borderColor": "#eb5454",
                "borderColor0": "#47b262",
                "borderWidth": 1
            }
        },
        "graph": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "lineStyle": {
                "width": 1,
                "color": "#aaa"
            },
            "symbolSize": "0",
            "symbol": "circle",
            "smooth": false,
            "color": [
                "#3EDCFF",
                "#78e54e",
                "#f39f3b",
                "#8f8f8f",
                "#73c0de",
                "#3ba272",
                "#fc8452",
                "#9a60b4",
                "#ea7ccc"
            ],
            "label": {
                "color": "#ffffff"
            }
        },
        "map": {
            "itemStyle": {
                "areaColor": "#eee",
                "borderColor": "#444",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#000"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(255,215,0,0.8)",
                    "borderColor": "#444",
                    "borderWidth": 1
                },
                "label": {
                    "color": "rgb(100,0,0)"
                }
            }
        },
        "geo": {
            "itemStyle": {
                "areaColor": "#eee",
                "borderColor": "#444",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#000"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "rgba(255,215,0,0.8)",
                    "borderColor": "#444",
                    "borderWidth": 1
                },
                "label": {
                    "color": "rgb(100,0,0)"
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": borderColorDark
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisLabel": {
                "show": true,
                "color": `rgb(${textColorPrimary})`
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        borderColorDark
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisLabel": {
                "show": true,
                "color": `rgb(${textColorPrimary})`
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        borderColorDark
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#6E7079"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#E0E6F1"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": borderColorDark
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#6E7079"
                }
            },
            "axisLabel": {
                "show": true,
                "color": `rgb(${textColorPrimary})`
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#E0E6F1"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.2)",
                        "rgba(210,219,238,0.2)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "borderColor": `rgb(${textColorPrimary})`
            },
            "emphasis": {
                "iconStyle": {
                    "borderColor": `rgb(${textColorPrimary})`
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": `rgb(${textColorPrimary})`
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": `rgb(${textColorPrimary})`,
                    "width": "1"
                },
                "crossStyle": {
                    "color": `rgb(${textColorPrimary})`,
                    "width": "1"
                }
            },
            "textStyle": {
                "color": "#fff"
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#dae1f5",
                "width": 2
            },
            "itemStyle": {
                "color": "#a4b1d7",
                "borderWidth": 1
            },
            "controlStyle": {
                "color": "#a4b1d7",
                "borderColor": "#a4b1d7",
                "borderWidth": 1
            },
            "checkpointStyle": {
                "color": "#316bf3",
                "borderColor": "#ffffff"
            },
            "label": {
                "color": "#a4b1d7"
            },
            "emphasis": {
                "itemStyle": {
                    "color": "#ffffff"
                },
                "controlStyle": {
                    "color": "#a4b1d7",
                    "borderColor": "#a4b1d7",
                    "borderWidth": 1
                },
                "label": {
                    "color": "#a4b1d7"
                }
            }
        },
        "visualMap": {
            "color": [
                "#3EDCFF"
            ]
        },
        "dataZoom": {
            "handleSize": "undefined%",
            "textStyle": {}
        },
        "markPoint": {
            "label": {
                "color": "#ffffff"
            },
            "emphasis": {
                "label": {
                    "color": "#ffffff"
                }
            }
        }
    }
}