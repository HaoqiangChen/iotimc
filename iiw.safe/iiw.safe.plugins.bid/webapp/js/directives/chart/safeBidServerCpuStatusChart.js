/**
 * Created by zcl on 2018-11-16.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidServerCpuStatusChart', ['$interval', '$filter', 'iTimeNow', 'iAjax', function($interval, $filter, iTimeNow, iAjax) {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-server-cpu-status-chart-panel').get(0);
                $(childEle).css({'width': 755, 'height': 400});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var datas = [0,0,0,0,0,0,0,0,0,0];
                var xAxis = (function() {
                    var now = iTimeNow.now;
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.unshift($filter('date')(now, 'HH:mm:ss'));
                        now = new Date(now - 3000);
                    }
                    return res;
                })();
                $scope.cpu = [];
                var _option = {
                    title: {
                        text: '数据中心服务器CPU使用情况',
                        x: 'center',
                        textStyle: {
                            fontSize: 16,
                            color: '#ffffff',
                            letterSpace: '2px',
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: '{a}：{c}%'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: true,
                            axisLine: {
                                lineStyle: {
                                    color: '#00abfd'
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#2cd6e3'
                                },
                                margin: 15
                            },
                            data: xAxis
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            scale: true,
                            name: '百分比',
                            boundaryGap: [0.2, 0.2],
                            min: 0,
                            max: 100,
                            axisLabel: {
                                formatter: '{value} %',
                                textStyle: {
                                    color: '#23a9da'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: '#2c4c66'
                                }
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#00abfd'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: 'CPU使用率',
                            type: 'line',
                            data: datas
                        }
                    ]
                };
                _chart.setOption(_option);
                _chart.hideLoading();
                var interval = $interval(function() {
                    iAjax.post('security/homepage.do?action=getCpuInformation').then(function(data) {
                        if (
                            data.result && data.result.rows) {
                            $scope.cpu = data.result.rows[0];
                            var axisData = $filter('date')(iTimeNow.now, 'HH:mm:ss');
                            xAxis.shift();
                            xAxis.push(axisData);
                            datas.shift();
                            datas.push($scope.cpu.value[0]);
                            _chart.setOption({
                                xAxis: [
                                    {data: xAxis}
                                ],
                                series: [
                                    {data: datas}
                                ]
                            });
                        }
                    });
                }, 3000);

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