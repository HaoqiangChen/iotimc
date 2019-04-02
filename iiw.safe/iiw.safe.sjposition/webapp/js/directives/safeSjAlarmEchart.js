define([
    'app',
    'safe/report/lib/echarts.min'
], function(app, echarts) {
    app.directive('safeSjAlarmEchart', ['iAjax', '$state', '$rootScope', function(iAjax, $state, $rootScope) {
        return {
            restrict: 'AE',
            replace: true,
            compile: function() {
                var datas = [{
                    name: '低电', value: 5
                }, {
                    name: '进入禁止令限制区域', value: 0
                }, {
                    name: '离线', value: 2
                }, {
                    name: '越界', value: 1
                }, {
                    name: '拆卸', value: 2
                }];

                var colors = ['#00da9c', '#c4e300', '#008cff', '#FFA500', '#FF69B4', '#5c57c6'];

                var option = {
                    color: colors,
                    backgroundColor: 'transparent',
                    tooltip : {
                        show: true,
                        formatter: "{a} <br/>{b} : {c} "
                    },
                    series: [
                        {
                            name: '报警类型统计',
                            type: 'pie',
                            center: ['50%', '50%'],
                            radius: ['50%', '80%'],
                            label: {
                                normal: {
                                    show: true,
                                    formatter: function(param) {
                                        return param.name + '\n' + param.percent.toFixed(0) + '%';
                                    }
                                }
                            },
                            data: datas
                        }
                    ]
                };

                return {
                    post: function(scope, el) {
                        var char = echarts.init(el[0], echarts);
                        function initData() {
                            var data = {
                                filter: {
                                    type: 'sqjz'
                                }
                            };
                            iAjax
                                .post('security/information/information.do?action=getSqjzrywgxxCountNum', data)
                                .then(function(data) {
                                    if(data.result && data.result.rows) {
                                        option.series[0].data = data.result.rows;
                                        char.setOption(option);
                                    }
                                })

                            char.setOption(option);
                        }

                        initData();
                    }
                }
            }
        }
    }]);
});
