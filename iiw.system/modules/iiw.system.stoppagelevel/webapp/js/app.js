/**
 * 运维故障等级管理
 *
 * Created by YBW on 2017/4/17.
 */
define([
    'app',
    'cssloader!system/stoppagelevel/css/index',
    'cssloader!system/stoppagelevel/lib/jquery.bigcolorpicker',
    'system/stoppagelevel/lib/jquery.bigcolorpicker',
    'system/stoppagelevel/js/directives/systemBigColor'
], function(app) {
    app.controller('stoppagelevelController', [
        '$scope',
        'mainService',
        'iAjax',
        'iMessage',
        'iTimeNow',
        '$state',
        '$filter',
        function($scope, mainService, iAjax, iMessage, iTimeNow, $state, $filter) {

            mainService.moduleName = '故障等级管理';
            $scope.level = {
                title: '故障等级管理-设置',
                list: [],
                close: function(id, index) {
                    this.list.splice(index, 1);
                },
                submit: function() {

                    $.each(this.list, function(i, o) {
                        o.notes = o.day * 86400 + o.time * 3600 + o.minute * 60;
                    });
                    iAjax.post('oms/devicemaintain.do?action=updatedevicelevel', {
                        typename: 'repairlevel',
                        rows: this.list
                    }).then(function() {
                        remind(1, '保存成功');
                        $scope.getList();
                    }, function() {
                        remind(4, '网络连接失败！');
                    });
                },
                add: function() {
                    this.list.push({
                        status: '0',
                        type: '#000',
                        day: '0',
                        time: '0',
                        minute: '0'
                    });
                },
                goHistory: function() {
                    $state.go('system.stoppagelevel.history')
                }
            };

            $scope.getList = function() {
                iAjax.post('oms/devicemaintain.do?action=getdevicelevel', {
                    typename: 'repairlevel'
                }).then(function(data) {

                    if (data.result && data.result.rows) {
                        $scope.level.list = data.result.rows;

                        $.each($scope.level.list, function(i, o) {
                            o.day = Math.floor(o.notes / 86400);
                            o.time = Math.floor((o.notes % 86400) / 3600);
                            o.minute = Math.floor((o.notes % 3600) / 60);
                        });
                    }
                }, function() {
                    remind(4, '网络连接失败！');
                });
            };

            $scope.$on('stoppagelevelControllerOnEvent', function() {
                $scope.getList();
            });


            var number = 0;

            function remind(level, contetn, title) {

                var message = {
                    id: iTimeNow.getTime() + '' + (++number == 100 ? number = 0 : number),
                    title: (title || '消息提醒'),
                    content: (contetn || ''),
                    level: level
                };

                iMessage.show(message, false);
            }
        }
    ]);
});
