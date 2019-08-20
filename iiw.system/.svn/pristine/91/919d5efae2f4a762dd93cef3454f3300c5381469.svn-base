/**
 * 运维故障等级管理
 *
 * Created by LLX on 2017/4/17.
 */
define([
    'app',
    'cssloader!system/stoppagelevel/history/css/index.css'
], function(app) {
    app.controller('stoppagelevelHistoryController', [
        '$scope',
        '$state',
        'iAjax',
        '$filter',
        'iMessage',
        function($scope, $state, iAjax, $filter, iMessage) {
            $scope.title = '故障等级管理-历史记录';
            $scope.history = {
                filterValue: '',
                list: [],
                back: function() {
                    $state.go('system.stoppagelevel');
                    $scope.$parent.getList();
                },
                getHistoryList: function() {
                    var data = {
                        filter: {
                            filter: $scope.history.filterValue
                        }
                    };
                    iAjax
                        .post('oms/devicemaintain.do?action=getdevicelevelhistory', data)
                        .then(function(data) {
                            if (data.result && data.result.row) {
                                $.each(data.result.row, function(i, o) {
                                    o.time = $filter('date')(o.time, 'yyyy-MM-dd HH:mm:dd')
                                });
                                $scope.history.list = data.result.row;
                            }
                        })
                },
                resetHistory: function(item) {
                    var data = {
                        row: {
                            id: item.id,
                            status: 'P'
                        }
                    };
                    iAjax
                        .post('sys/web/sycode.do?action=upSycode', data)
                        .then(function(data) {
                            if (data && data.status == 1) {
                                showMessage(1, '故障等级还原成功!');
                                $scope.history.getHistoryList();
                            }
                        })
                }
            };
            $scope.init = function() {
                $scope.history.getHistoryList();
            };
            $scope.init();

            function showMessage(level, content) {
                var json = {
                    title: $scope.title,
                    level: level,
                    content: content
                };
                iMessage.show(json)
            }
        }
    ])
});