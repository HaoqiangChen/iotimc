/**
 * Created by zcl on 2018-11-16.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidDataDynamicAnalysisChart', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-data-dynamic-analysis-chart-panel').get(0);
                $(childEle).css({'width': 1510, 'height': 400});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var _option = {
                    backgroundColor: "rgba(0,0,0,0.1)",
                    color: ["rgb(253, 124, 41)", "rgb(249, 196, 6)", "rgb(104, 221, 109)", "#a2f2f2", "#e50ee6", "#146fb9"],
                    title: {
                        text: '数据更新趋势',
                        left: 'left',
                        textStyle: {
                            fontWeight: 'normal',
                            fontSize: 20,
                            color: '#FFF'
                        },
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [
                            {name: "监狱", icon: "rect"},
                            {name: "社区矫正", icon: "rect"},
                            {name: "安置帮教", icon: "rect"},
                            {name: "公安", icon: "rect"},
                            {name: "检察院", icon: "rect"},
                            {name: "法院", icon: "rect"}
                        ],
                        align: "left",
                        left: "right",
                        textStyle: {
                            fontSize: 12,
                            color: '#F1F1F3'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {},

                        },
                        show: false
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['11月1日', '11月2日', '11月3日', '11月4日', '11月5日', '11月6日', '11月7日'],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'white'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#ffffff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        name: '更新记录数（条）',
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#ffffff'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#ffffff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '监狱',
                            type: 'line',
                            data: [1220, 832, 601, 734, 900, 830, 910],
                            symbolSize: 15,
                            label: {
                                normal: {
                                    show: true
                                }

                            },
                            lineStyle: {
                                normal: {
                                    color: "rgb(253, 124, 41)",
                                    width: 3
                                }
                            }
                        },{
                            name: '社区矫正',
                            type: 'line',
                            label: {
                                normal: {
                                    show: true
                                }

                            },
                            data: [220, 182, 191, 234, 290, 330, 310],
                            symbolSize: 15,
                            lineStyle: {
                                normal: {
                                    width: 3,
                                    color: "rgb(249, 196, 6)"
                                }
                            }
                        },{
                            name: '安置帮教',
                            type: 'line',
                            label: {
                                normal: {
                                    show: true
                                }

                            },
                            data: [22, 18, 11, 23, 20, 33, 10],
                            symbolSize: 15,
                            lineStyle: {
                                normal: {
                                    width: 3,
                                    color: "#c4c4c4"
                                }
                            }
                        },{
                            name: '公安',
                            type: 'line',
                            label: {
                                normal: {
                                    show: true
                                }

                            },
                            data: [2, 8, 11, 4, 2, 3, 1],
                            symbolSize: 15,
                            lineStyle: {
                                normal: {
                                    width: 3,
                                    color: "#a2f2f2"
                                }
                            }
                        },{
                            name: '检察院',
                            type: 'line',
                            label: {
                                normal: {
                                    show: true
                                }

                            },
                            data: [22, 12, 19, 23, 29, 33, 10],
                            symbolSize: 15,
                            lineStyle: {
                                normal: {
                                    width: 3,
                                    color: "#e50ee6"
                                }
                            }
                        },{
                            name: '法院',
                            type: 'line',
                            label: {
                                normal: {
                                    show: true
                                }

                            },
                            data: [100, 112, 101, 134, 190, 130, 110],
                            symbolSize: 15,
                            lineStyle: {
                                normal: {
                                    width: 3,
                                    color: "#c4c4c4"
                                }
                            }
                        }
                    ]
                };
                _chart.setOption(_option);
                _chart.hideLoading();

                $scope.$on('$destroy', function() {
                    if(_chart) {
                        _chart.dispose();
                        _chart = null;
                    }
                });
            }
        }
    }]);
});