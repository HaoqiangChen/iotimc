/**
 * 设备统计报表
 * Created by zcl on 2016/3/23.
 */
define([
    'app',
    'safe/lib/echarts/theme/dark'
], function(app, darkTheme) {
    // 硬件设备统计信息
    app.directive('systemDeviceChart', ['iAjax', 'iMessage', function(iAjax, iMessage) {
        return {
            restrict: 'A',
            replace: true,
            compile: function() {
                function createTypeColumnReport(el) {
                    var char = echarts.init(el, darkTheme);
                    char.showLoading({
                        text: '正在努力的读取数据中...'
                    });
                    var data = {
                        filter: {
                            type: ['door', 'monitor', 'light', 'broadcast', 'tv', 'talk', 'alarm']
                        }
                    };
                    iAjax.post('security/device.do?action=getDeviceTypeList', data).then(function(data) {
                        char.hideLoading();
                        if (data.result && data.result.rows) {
                            var name = [];
                            var numbers = [];
                            var totalDeviceNum = 0;
                            $.each(data.result.rows, function(i, o) {
                                name.push(o.name);
                                numbers.push(o.count);
                                totalDeviceNum += o.count;
                            });

                            var option = {
                                title: {
                                    x: 'center',
                                    text: '硬件设备数量统计',
                                    link: '',
                                    textStyle: {
                                        fontSize: 16,
                                        fontStyle: 'italic'
                                    },
                                    subtext: '设备总数：' + totalDeviceNum,
                                    subtextStyle: {
                                        fontSize: 12,
                                        color: 'white'
                                    }
                                },
                                tooltip: {
                                    trigger: 'item'
                                },
                                calculable: false,
                                grid: {
                                    borderWidth: 0,
                                    y: 80,
                                    y2: 60
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        show: false,
                                        data: name
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        show: false
                                    }
                                ],
                                series: [
                                    {
                                        name: '设备数量',
                                        type: 'bar',
                                        itemStyle: {
                                            normal: {
                                                color: function(params) {
                                                    var colorList = [
                                                        '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                                                        '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                                                        '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                                                    ];
                                                    return colorList[params.dataIndex]
                                                },
                                                label: {
                                                    show: true,
                                                    position: 'top',
                                                    formatter: '{b}\n{c}',
                                                    textStyle: {
                                                        fontWeight: 'normal',
                                                        fontSize: 16,
                                                        fontStyle: 'normal'
                                                    }
                                                }
                                            }
                                        },
                                        data: numbers
                                    }
                                ]
                            };
                            char.setOption(option);
                        }
                    }, function() {
                        var message = {};
                        message.level = 4;
                        message.title = '消息提醒';
                        message.content = '网络连接失败!';
                        iMessage.show(message, false);
                    });
                    return char;
                }

                return {
                    post: function($scope, $element) {
                        var char;
                        $scope.$on('initChartEvent', function() {
                            char = createTypeColumnReport($element.get(0), $scope);
                        });

                        $scope.$on('chartHideEvent', function() {
                            if (char) {
                                char.clear();
                                char.dispose();
                                char = null;
                            }
                        });
                    }
                }
            }
        }
    }]);
});