/**
 * Created by zcl on 2018-11-16.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidBusinessTypeChart', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-business-type-chart-panel').get(0);
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
                        data: ['业务数据排名'],
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
                            fontSize: 14,
                        },

                        type: 'category',
                        position: 'left',
                        data: ['安置帮教人员档案数据', '社矫人员档案数据', '罪犯档案数据']

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
                    series: [{
                        name: '业务数据排名',
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
                        data: [23123, 51231, 102131],
                    }]
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