/**
 * Created by zcl on 2018-11-28.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidDataPrisonGaugeChart', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-data-prison-gauge-chart-panel').get(0);
                $(childEle).css({'width': 755, 'height': 400});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var gauge_value = 100;
                var _option = {
                    tooltip: {
                        formatter: "{a} <br/>{b} : {c}%"
                    },
                    series: [{
                        name: '数据完整度',
                        type: 'gauge',
                        detail: {
                            formatter: '{value}%',
                            textStyle: {
                                fontSize: 20
                            }
                        },
                        title: {
                            offsetCenter: [0, '-30%'],
                            textStyle: {
                                fontSize: 18,
                                color:'#fff'
                            }
                        },
                        radius: "100%",
                        center: ["50%", "50%"],
                        axisLine: { // 坐标轴线
                            lineStyle: { // 属性lineStyle控制线条样式
                                color: [
                                    [0.7, '#E43F3D'],
                                    [0.85, 'rgba(0,171,228,1)'],
                                    [1, 'rgba(72,247,182,1)']
                                ]
                            }
                        },
                        data: [{value: 88, name: '监狱系统数据完整度'}]
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