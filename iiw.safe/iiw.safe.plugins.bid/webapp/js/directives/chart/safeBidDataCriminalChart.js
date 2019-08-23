/**
 * Created by zcl on 2018-11-28.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidDataCriminalChart', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-data-criminal-chart-panel').get(0);
                $(childEle).css({'width': 755, 'height': 400});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var _option = {
                    title: {
                        text: '罪犯信息统计',
                        left: '50%',
                        textAlign: 'center',
                        textStyle:{
                            color:'#FFF',
                            fontSize:'24'
                        },
                        top: 10
                    },
                    backgroundColor:'#062135',
                    tooltip: {
                        show:true,
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '50',
                        right: '50',
                        bottom: '3%',
                        top: '100',
                        containLabel: true
                    },
                    xAxis: {
                        data: ['监狱系统', '社矫系统', '安置帮教系统', '公安系统', '检察院系统', '法院系统'],
                        axisLine:{
                            lineStyle:{
                                color:'rgba(53,153,196,0.6)'
                            }
                        },
                        axisLabel:{
                            color:'#ffffff',
                            fontSize:12
                        },
                        axisTick: {
                            show: false,
                            alignWithLabel: true
                        }
                    },
                    yAxis: {
                        name:'数量（百万条）',
                        nameTextStyle:{
                            color: 'white',
                            fontSize: 12,
                            padding:[0,30,10,0]
                        },
                        axisLine:{
                            lineStyle:{
                                color:'rgba(53,153,196,0.6)'
                            }
                        },
                        axisLabel:{
                            color:'#ffffff',
                            fontSize:12
                        },
                        splitLine:{
                            lineStyle:{
                                color:'rgba(251,197,44,0.3)',
                                type:'dotted'
                            }
                        }
                    },
                    series: [{
                        name: '记录总数',
                        type: 'bar',
                        barWidth: '50%',
                        data: [129, 17, 3, 12, 6, 3]
                    }],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}',
                            color: '#ffffff'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#1089E7'
                        }
                    }
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