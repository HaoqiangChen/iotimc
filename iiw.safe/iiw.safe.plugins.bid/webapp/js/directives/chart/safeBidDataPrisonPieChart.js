/**
 * Created by zcl on 2018-11-28.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.directive('safeBidDataPrisonPieChart', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var childEle = $element.find('.safe-bid-data-prison-pie-chart-panel').get(0);
                $(childEle).css({'width': 755, 'height': 400});
                var _chart = echarts.init(childEle);
                _chart.showLoading({
                    text: '正在努力的读取数据中...'
                });
                var data = [
                    {value: 1000, name: '性别'},
                    {value: 400, name: '身份证号码'},
                    {value: 800, name: '职业'},
                    {value: 1200, name: '出生年月'},
                    {value: 214, name: '案件类别'},
                    {value: 345, name: '身体状况'},
                    {value: 456, name: '文化程度'}
                ];
                var _option = {
                    title : {
                        text: '监狱系统异常数据项占比情况统计',
                        x:'center',
                        textStyle: {
                            color: '#ffffff',
                            fontSize: 26
                        },
                        top: '17'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4', '#E43F3D'],
                    series: [
                        {
                            name:'监狱系统异常数据项占比',
                            type:'pie',
                            radius: ['0', '60%'],
                            color: ['#c487ee', '#deb140', '#49dff0', '#034079', '#6f81da', '#00ffb4', '#E43F3D'],
                            label: {
                                normal: {
                                    formatter: '{b}\n{d}%'
                                }
                            },
                            selectedMode: 'single',
                            data: data
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