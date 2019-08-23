define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidDataRankingChart', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-data-ranking-chart-panel').get(0);
                $(childEle).css({'width': 1510, 'height': 700});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var _option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        }
                    },

                    legend: {
                        left: '30',
                        data: ['数据总量', '表总量'],
                        textStyle:{
                            color:"#fff"
                        }
                    },
                    yAxis: [{
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            color: '#ffffff',
                            fontWeight :'bold',
                            fontSize: 14
                        },
                        type: 'category',
                        position: 'left',
                        data: ['司法行政系统', '安置帮教系统', '社矫系统', '监狱系统']

                    }],
                    xAxis: [{
                        type: 'value',
                        axisLabel: {
                            margin: 10,
                            textStyle: {
                                fontSize: 12,
                                color:'#53a8fa'
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#192469'
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#17367c'
                            }
                        }
                    }],
                    /*xAxis: [{
                        show: false,
                        axisTick: {
                            show: false
                        },
                        type: 'value',
                        name: '数据库',
                        min: 0,
                        max: 100000000,
                        inverse: false,
                        axisLine: {
                            show: false,
                        }
                    }],*/
                    series: [{
                        name: '数据总量',
                        align: 'left',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#00C1FF'
                            }
                        },
                        barWidth: '17',
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#CEC608'
                                }
                            }
                        },
                        data: [1239889, 2869870, 4539970, 49979757]
                    }, {
                            name: '表总量',
                            align: 'left',
                            type: 'bar',
                            barGap: '99%',
                            barWidth: '17',
                            itemStyle: {
                                normal: {
                                    color: '#3dd17d'
                                }
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    textStyle: {
                                        color: '#969cd6'
                                    }
                                }
                            },
                            data: [347, 222, 120, 89],
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