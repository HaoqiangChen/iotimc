/**
 * 应用服务器内存使用情况统计信息
 * Created by zcl on 2016/3/23.
 */
define([
    'app',
    'safe/lib/echarts/theme/dark'
], function(app, darkTheme) {
    // 服务器内存使用情况统计信息
    app.directive('systemDiskformationChart', ['$interval', 'iTimeNow', '$filter','iAjax', function($interval, iTimeNow, $filter,iAjax) {

        return {
            restrict: 'A',
            replace: true,
            compile: function() {
                var disks=[];
                function createMemoryChart(el) {
                    var char = echarts.init(el, darkTheme);
                    char.showLoading({
                        text: '正在努力的读取数据中...'
                    });

                    iAjax.post('security/homepage.do?action=getDiskformation').then(function(data) {
                        if (data.result && data.result.rows) {
                            //$scope.$broadcast('initChartEvent');
                            char.hideLoading();
                            $.each(data.result.rows[0].detail, function(i, o) {
                                disks.push(o.name+'盘');
                            });
                            var option = {
                                title: {
                                    text: '硬盘使用率',
                                    x: 'center',
                                    textStyle: {
                                        fontSize: 16,
                                        fontStyle: 'italic',
                                        letterSpace: '2px'
                                    }
                                },
                                tooltip: {
                                    trigger: 'axis'
                                    //formatter: '{a}：{c}%'
                                },
                                calculable: false,
                                xAxis: [
                                    {
                                        type: 'category',
                                        boundaryGap: true,
                                        axisLabel: {
                                            textStyle: {
                                                color: 'white'
                                            }
                                        },
                                        data:disks
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
                                        //name: '已用空间',
                                        type: 'bar',
                                        data: disks
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
                        iMessage.show(message, true);
                    });
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

                        $scope.$on('refreshDiskformation', function(event, data) {

                            char.setOption({
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params){
                                        var name = params[0].name;
                                        var value = params[0].value;
                                        var used=data.detail[params[0].dataIndex].used;
                                        return '已用'+used+'<br/>占'+value+'%';
                                    }
                                },

                                series:[{
                                    data: (function() {
                                        var rate = [];
                                        $.each(data.detail, function(i, o) {
                                            rate.push((Number(o.used.substring(0, o.used.length-2))/ Number(o.total.substring(0, o.total.length-2))*100).toFixed(1));
                                            //rate.push(o.used);
                                        });
                                        return rate;
                                    })()
                                }]
                            })
                        });
                    }
                }
            }
        }
    }]);
});