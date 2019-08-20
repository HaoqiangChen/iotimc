/**
 * jvm线程使用情况统计信息
 * Created by zcl on 2016/3/23.
 */
define([
    'app',
    'safe/lib/echarts/theme/dark'
], function(app, darkTheme) {
    // jvm线程使用情况统计信息
    app.directive('systemJvmThreadChart', [
        'iTimeNow',
        '$filter',

        function(iTimeNow, $filter) {
            return {
                restrict: 'A',
                replace: true,
                compile: function() {
                    function createJvmChart(el) {
                        var char = echarts.init(el, darkTheme);
                        var option = {
                            title: {
                                text: 'Jvm线程',
                                x: 'center',
                                textStyle: {
                                    fontSize: 16,
                                    fontStyle: 'italic'
                                }
                            },
                            tooltip: {
                                trigger: 'axis',
                                formatter: '{a}：{c}'
                            },
                            calculable: true,
                            xAxis: [
                                {
                                    type: 'category',
                                    boundaryGap: true,
                                    axisLabel: {
                                        textStyle: {
                                            color: 'white'
                                        }
                                    },
                                    data: (function() {
                                        var time = iTimeNow.now;
                                        var res = [];
                                        var len = 10;
                                        while (len--) {
                                            res.unshift($filter('date')(time, 'HH:mm:ss'));
                                            time = new Date(time - 3000)
                                        }
                                        return res
                                    })()
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    scale: true,
                                    name: '数量',
                                    boundaryGap: [0.2, 0.2],
                                    min: 0,
                                    max: 500,
                                    axisLabel: {
                                        formatter: '{value}',
                                        color: 'rgb(0,0,0)',
                                        textStyle: {
                                            color: 'white'
                                        }
                                    },
                                    axisLine: {
                                        show: true,
                                        lineStyle: {
                                            color: 'white',
                                            width: 1,
                                            type: 'solid'
                                        }
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: 'JVM活动线程',
                                    type: 'line',
                                    data: (function() {
                                        var res = [];
                                        var len = 10;
                                        while (len--) {
                                            res.push(0);
                                        }
                                        return res;
                                    })()
                                }
                            ]
                        };
                        char.setOption(option);
                        return char;
                    }

                    return {
                        post: function($scope, $element) {
                            var char;

                            $scope.$on('initChartEvent', function() {
                                char = createJvmChart($element.get(0));
                            });

                            $scope.$on('chartHideEvent', function() {
                                if (char) {
                                    char.clear();
                                    char.dispose();
                                    char = null;
                                }
                            });

                            $scope.$on('refreshJvmChart', function(event, data) {
                                var axisData = $filter('date')(iTimeNow.now, 'HH:mm:ss');
                                char.addData([
                                    [
                                        0,
                                        data.threadCount,
                                        false,
                                        false,
                                        axisData
                                    ]
                                ])
                            });

                        }
                    }

                }
            }
        }
    ]);
});