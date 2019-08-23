/**
 * Created by zcl on 2018-11-18.
 */
/**
 * Created by zcl on 2018-11-16.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidLogManagerChart', ['$interval', '$filter', 'iTimeNow', 'iAjax', function($interval, $filter, iTimeNow, iAjax) {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-log-manager-chart-panel').get(0);
                $(childEle).css({'width': '1510', 'height': '600'});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var xData = function() {
                    var data = [];
                    for (var i = 1; i < 13; i++) {
                        data.push(i + "月份");
                    }
                    return data;
                }();

                var _option = {
                    backgroundColor: "rgba(0,0,0,0.1)",
                    "title": {
                        "text": '交换日志数据分析',
                        x: "1%",
                        top:'10',
                        textStyle: {
                            color: '#fff',
                            fontSize: '22'
                        },
                        subtextStyle: {
                            color: '#90979c',
                            fontSize: '16'
                        }
                    },
                    "tooltip": {
                        "trigger": "axis",
                        "axisPointer": {
                            "type": "shadow",
                            textStyle: {
                                color: "#fff"
                            }

                        }
                    },
                    "grid": {
                        "borderWidth": 0,
                        "top": 110,
                        "bottom": 95,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    "legend": {
                        x: '4%',
                        top: '5%',
                        textStyle: {
                            color: '#fff'
                        },
                        left: 'center',
                        "data": ['接收资源数', '提供资源数', '资源交换数', '资源交换量']
                    },
                    "calculable": true,
                    "xAxis": [{
                        "type": "category",
                        "axisLine": {
                            lineStyle: {
                                color: '#90979c'
                            }
                        },
                        "splitLine": {
                            "show": false
                        },
                        "axisTick": {
                            "show": false
                        },
                        "splitArea": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0

                        },
                        "data": xData
                    }],
                    "yAxis": [{
                        "type": "value",
                        "splitLine": {
                            "show": false
                        },
                        "axisLine": {
                            lineStyle: {
                                color: '#90979c'
                            }
                        },
                        "axisTick": {
                            "show": false
                        },
                        "axisLabel": {
                            "interval": 0
                        },
                        "splitArea": {
                            "show": false
                        }
                    }],
                    "dataZoom": [{
                        "show": true,
                        "height": 30,
                        "xAxisIndex": [
                            0
                        ],
                        bottom: 30,
                        "start": 0,
                        "end": 100,
                        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                        handleSize: '110%',
                        handleStyle:{
                            color:"#d3dee5"
                        },
                        textStyle:{
                            color:"#fff"},
                        borderColor:"#90979c"
                    }, {
                        "type": "inside",
                        "show": true,
                        "height": 15,
                        "start": 1,
                        "end": 35
                    }],
                    "series": [{
                        "name": "接收资源数",
                        "type": "bar",
                        "stack": "资源交换量",
                        "barMaxWidth": 35,
                        "barGap": "10%",
                        "itemStyle": {
                            "normal": {
                                "color": "rgba(233,28,98,1)",
                                "label": {
                                    "show": true,
                                    "textStyle": {
                                        "color": "#fff"
                                    },
                                    "position": "insideTop",
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                        "data": [
                            100,
                            100,
                            100,
                            200,
                            200,
                            100,
                            100,
                            100,
                            100,
                            20,
                            50,
                            100
                        ]
                    }, {
                            "name": "提供资源数",
                            "type": "bar",
                            "stack": "资源交换量",
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(54,205,209,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        },
                                        textStyle: {
                                            color: 'white'
                                        }
                                    }
                                }
                            },
                            "data": [
                                100,
                                300,
                                400,
                                200,
                                100,
                                100,
                                500,
                                100,
                                100,
                                30,
                                100,
                                100]
                        }, {
                            "name": "资源交换数",
                            "type": "bar",
                            "stack": "资源交换量",
                            "itemStyle": {
                                "normal": {
                                    "color": "#f4e925",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": [
                                200,
                                100,
                                100,
                                100,
                                100,
                                100,
                                100,
                                300,
                                0,
                                50,
                                0,
                                100]
                        }, {
                            "name": "资源交换量",
                            "type": "line",
                            "stack": "资源交换量",
                            symbolSize:10,
                            symbol:'circle',
                            "itemStyle": {
                                "normal": {
                                    "color": "rgba(255,193,6,1)",
                                    "barBorderRadius": 0,
                                    "label": {
                                        "show": true,
                                        "position": "top",
                                        formatter: function(p) {
                                            return p.value > 0 ? (p.value) : '';
                                        }
                                    }
                                }
                            },
                            "data": [
                                400,
                                500,
                                600,
                                500,
                                400,
                                300,
                                700,
                                500,
                                200,
                                100,
                                150,
                                300
                            ]
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