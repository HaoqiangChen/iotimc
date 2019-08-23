/**
 * Created by zcl on 2018-11-17.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidDataQualityChart', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-data-quality-chart-panel').get(0);
                $(childEle).css({'width': 1510, 'height': 400});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var _option = {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    title : {
                        text: '数据离群情况占比统计',
                        textStyle:{
                            color:"#fff"
                        },
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {d}% <br/> {c}"
                    },
                    graphic: {
                        elements: [{
                            type: 'image',
                            style: {
                                //image: giftImageUrl,
                                width: 100,
                                height: 100
                            },
                            left: 'center',
                            top: 'center'
                        }]
                    },
                    legend: {
                        orient: 'horizontal',
                        icon: 'circle',
                        bottom: 20,
                        x: 'center',
                        textStyle: {
                            color: '#fff'
                        },
                        data: ['数据不完整', '数据不一致', '数据不准确', '无效数据', '数据不唯一']
                    },
                    series: [{
                        type: 'pie',
                        radius: ['40%', '50%'],
                        center: ['50%', '50%'],
                        color: ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0'],
                        data: [{
                            value: 335,
                            name: '数据不完整'
                        },
                            {
                                value: 310,
                                name: '数据不一致'
                            },
                            {
                                value: 234,
                                name: '数据不准确'
                            },
                            {
                                value: 235,
                                name: '无效数据'
                            },
                            {
                                value: 254,
                                name: '数据不唯一'
                            }
                        ],
                        labelLine: {
                            normal: {
                                show: true,
                                length: 20,
                                length2: 20,
                                lineStyle: {
                                    color: '#12EABE',
                                    width: 2
                                }
                            }
                        },
                        label: {
                            normal: {
                                formatter: '{c|{c}}\n{hr|}\n{d|{d}%}',
                                rich: {
                                    b: {
                                        fontSize: 20,
                                        color: 'white',
                                        align: 'left',
                                        padding: 4
                                    },
                                    hr: {
                                        borderColor: '#12EABE',
                                        width: '100%',
                                        borderWidth: 2,
                                        height: 0
                                    },
                                    d: {
                                        fontSize: 20,
                                        color: '#fff',
                                        align: 'left',
                                        padding: 4
                                    },
                                    c: {
                                        fontSize: 20,
                                        color: '#fff',
                                        align: 'left',
                                        padding: 4
                                    }
                                }
                            }
                        }
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