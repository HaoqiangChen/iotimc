/**
 * 应用服务器内存使用情况统计信息
 * Created by zcl on 2016/3/23.
 */
define([
    'app',
    'safe/lib/echarts/theme/dark'
], function(app, darkTheme) {
    // 服务器内存使用情况统计信息
    app.directive('systemServerMemoryChart', ['$interval', 'iTimeNow', '$filter', function($interval, iTimeNow, $filter) {

        return {
            restrict: 'A',
            replace: true,
            compile: function() {
                function createMemoryChart(el) {
                    var char = echarts.init(el, darkTheme);

                    var option = {
                        title: {
                            text: '服务器内存使用率',
                            x: 'center',
                            textStyle: {
                                fontSize: 16,
                                fontStyle: 'italic',
                                letterSpace: '2px'
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
                                axisLabel: {
                                    textStyle: {
                                        color: 'white'
                                    }
                                },
                                data:(function() {
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
                                name: '百分比',
                                boundaryGap: [0.2, 0.2],
                                min: 0,
                                max: 100,
                                axisLabel: {
                                    formatter: '{value} %',
                                    textStyle: {
                                        color: 'white'
                                    }
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: 'rgba(255,255,255,0.5)',
                                        width: 1,
                                        type: 'solid'
                                    }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '内存利用率',
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
                            char = createMemoryChart($element.get(0), $scope);
                        });

                        $scope.$on('chartHideEvent', function() {
                            if (char) {
                                char.clear();
                                char.dispose();
                                char = null;
                            }
                        });

                        $scope.$on('refreshMemoryChart', function(event, data) {
                            var axisData = $filter('date')(iTimeNow.now, 'HH:mm:ss');
                            char.addData([
                                [
                                    0,        // 系列索引
                                    data.value[0], // 新增数据
                                    false,     // 新增数据是否从队列头部插入
                                    false,     // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                                    axisData
                                ]
                            ]);

                        });
                    }
                }
            }
        }
    }]);
});