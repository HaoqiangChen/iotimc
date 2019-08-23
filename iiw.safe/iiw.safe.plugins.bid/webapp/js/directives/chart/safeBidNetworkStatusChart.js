/**
 * Created by zcl on 2018-11-16.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidNetworkStatusChart', ['$interval', '$filter', 'iTimeNow', 'iAjax', function($interval, $filter, iTimeNow, iAjax) {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-network-status-chart-panel').get(0);
                $(childEle).css({'width': 755, 'height': 400});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var _option = {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    title: {
                        show: true,
                        text: '网络使用率',
                        textStyle: {
                            color: '#fff'
                        },
                        left: 'center'
                    },
                    tooltip : {
                        formatter: "{a} <br/>{b} = {c}%"
                    },
                    series: [{
                        name: '',
                        type: "gauge",
                        startAngle: 180,
                        endAngle: 0,
                        min: 0,
                        max: 100,
                        radius: "80%",
                        center: ["50%", "65%"],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                width: 30,
                                shadowBlur: 0,
                                color: [[0.3, '#00FF00'],[0.8, '#00FF00'],[1, 'red']]
                            }
                        },
                        //修改指标
                        itemStyle: {
                            normal: {
                                shadowBlur: 10
                            }
                        },
                        detail: {formatter:'{value}%'},
                        data: [{value: 28, name: '网络使用率'}],
                        title: {
                            show: true,
                            textStyle: {
                                color: '#fffff'
                            }
                        }
                    }]
                };

                window.setInterval(function () {
                    _option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
                    _chart.setOption(_option, true);
                }, 5000);

                _chart.setOption(_option);
                _chart.hideLoading();
                $scope.$on('$destroy', function() {
                    if(_chart) {
                        _chart.dispose();
                        _chart = null;
                        $interval.cancel(interval);
                    }
                });
            }
        }
    }]);
});