/**
 * 安全指标统计报表
 *
 * Created by YJJ on 2015-11-25.
 */
define([
    'app',
    'safe/lib/echarts/theme/dark'
], function(app, darkTheme) {
    app.directive('safeMainCheckReport', [function() {
        return {
            restrict: 'A',
            compile: function() {
                function createMarkReport(el, $scope) {
                    var char = echarts.init(el, darkTheme);

                    char.showLoading({
                        text: '正在努力的读取数据中...'
                    });

                    var option = {
                        title : {
                            text: ($scope.safe.ouname || '') + '安全指标',
                            subtext: '数据来自各区域安全指标汇总',
                            textStyle: {
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic'
                            }
                        },
                        series : [
                            {
                                type:'gauge',
                                startAngle: -70,
                                endAngle : -340,
                                axisLine: {
                                    lineStyle: {
                                        color: [[0.6, '#ff4500'],[0.8, 'orange'],[1, 'lightgreen']],
                                        width: 90
                                    }
                                },
                                axisTick: {
                                    show: true,
                                    splitNumber: 2,
                                    length: 5,
                                    lineStyle: {
                                        color: '#eee',
                                        width: 2,
                                        type: 'solid'
                                    }
                                },
                                axisLabel: {
                                    formatter: function(v){
                                        switch (v+''){
                                            case '0': return '0';
                                            case '30': return '30';
                                            case '60': return '60';
                                            case '80': return '80';
                                            case '100': return '100';
                                            default: return '';
                                        }
                                    },
                                    textStyle: {
                                        fontSize: 18,
                                        color: '#fff'
                                    }
                                },
                                splitLine: {
                                    show: true,
                                    length: 45,
                                    lineStyle: {
                                        color: '#eee',
                                        width: 4,
                                        type: 'solid'
                                    }
                                },
                                pointer : {
                                    length : '80%',
                                    width : 8,
                                    color : 'auto'
                                },
                                title : {
                                    show : true,
                                    offsetCenter: [100, 15],
                                    textStyle: {
                                        align: 'left',
                                        color: '#fff',
                                        fontSize : 30
                                    }
                                },
                                detail : {
                                    show : true,
                                    offsetCenter: [100, 50],
                                    textStyle: {
                                        align: 'left',
                                        color: 'auto',
                                        fontSize : 60
                                    }
                                },
                                data:[{value: $scope.safe.score || 0, name: '安全指标'}]
                            }
                        ]
                    };

                    char.hideLoading();

                    char.setOption(option);

                    return char;
                }

                function createLineReport(el, $scope) {
                    var char = echarts.init(el, darkTheme);

                    var names = [],
                        scores = [],
                        min = 100,
                        max = 0;

                    if($scope.safe.child) {
                        $.each($scope.safe.child, function(i, o) {
                            names.push(o.name);
                            scores.push(o.score);
                            min = (o.score < min) ? o.score : min;
                            max = (o.score > max) ? o.score : max;
                        });
                        if(min > 60) {
                            min = 60;
                        } else if(min > 1) {
                            min--;
                        }
                    }

                    char.showLoading({
                        text: '正在统计数据中...'
                    });

                    var option = {
                        title : {
                            text: '安全指标分项统计',
                            subtext: '数据来自日常事务、巡更、在线运维、报警处警',
                            textStyle: {
                                fontWeight: 'bolder',
                                fontSize: 20,
                                fontStyle: 'italic'
                            }
                        },
                        grid: {
                            y: 70
                        },
                        yAxis : [
                            {
                                type : 'value',
                                min: min,
                                max: max,
                                scale: true,
                                axisLabel: {
                                    textStyle: {
                                        fontSize: 14,
                                        color: '#fff'
                                    }
                                }
                            }
                        ],
                        xAxis : [
                            {
                                type : 'category',
                                axisLabel: {
                                    textStyle: {
                                        fontSize: 14,
                                        color: '#fff'
                                    }
                                },
                                data : names
                            }
                        ],
                        series : [
                            {
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            var result = '';
                                            if(params.data >= 80) {
                                                result = 'lightgreen';
                                            } else if(params.data >= 60) {
                                                result = 'orange';
                                            } else {
                                                result = '#ff4500';
                                            }
                                            return result;
                                        },
                                        label: {
                                            show: true,
                                            position: 'top'
                                        }
                                    }
                                },
                                data: scores || 0
                            }
                        ]
                    };

                    if($scope.safe.child.length) {
                        char.hideLoading();
                        char.setOption(option);
                    }

                    char.on(echarts.config.EVENT.CLICK, function(e) {
                        var item = $scope.safe.child[e.dataIndex];
                        if(item) {
                            if(item.type == 'ou') {
                                $scope.safe.getData(item.id);
                            } else {
                                switch(item.stype) {
                                    case 'device':
                                        $scope.goDeviceStat();
                                        break;
                                    case 'alert':
                                        $scope.goAlarm();
                                        break;
                                }
                            }
                            $scope.$broadcast('safeLineChartClickEvent', item);
                        }
                    });

                    return char;
                }

                return {
                    post: function($scope, $element, attr) {
                        var char;

                        $scope.$on('safeMainMenuShowEvent', function() {
                            create();
                        });

                        $scope.$on('safeMainMenuHideEvent', function() {
                            dispose();
                        });


                        $scope.$on('safeMainUpdateReportEvent', function() {
                            if(char) {
                                dispose();
                                create();
                            }
                        });


                        function create() {
                            if(attr.report == 'mark') {
                                char = createMarkReport($element.get(0), $scope);
                            } else if(attr.report == 'line') {
                                char = createLineReport($element.get(0), $scope);
                            }
                            $element.data('char', char);
                        }


                        function dispose() {
                            if(char) {
                                char.clear();
                                char.dispose();
                                char = null;
                                $element.data('char', null);
                            }
                        }
                    }
                }
            }
        }
    }]);
});