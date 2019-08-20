/**
 * 运维故障等级管理
 *
 * Created by YBW on 2017/4/17.
 */
define([
    'app',
    'cssloader!system/devicedetection/css/index'
], function(app) {
    app.controller('devicedetectionController', [
        '$scope',
        'mainService',
        'iAjax',
        'iMessage',
        function($scope, mainService, iAjax, iMessage) {

            mainService.moduleName = '设备检测管理';
            $scope.detection = {
                title: '设备检测管理-设置',
                wait: '',
                executing: '',
                timeOut: '',
                list: [
                    {name: '未处理的设备', type: 'notdispose', notes: '', content: ''},
                    {name: '处理中的设备', type: 'dispose', notes: '', content: ''},
                    {name: '超时未处理的设备', type: 'overnotdispose', notes: '', content: ''}
                ],
                save: function() {
                    var data = {
                        rows: $scope.detection.list,
                        typename: "repairlevel"
                    };
                    iAjax
                        .post('oms/devicemaintain.do?action=updatedevicelevel', data)
                        .then(function(data) {
                            if (data && data.status == 1) {
                                showMessage(1, '提交成功!');
                                $scope.detection.getDeviceLevel();
                            }
                        })
                },
                getDeviceLevel: function() {
                    var data = {
                        typename: "diagnosisfraction"
                    };
                    iAjax
                        .post('oms/devicemaintain.do?action=getdevicelevel', data)
                        .then(function(data) {
                            if (data.result && data.result.rows) {
                                $scope.detection.list = data.result.rows;
                            }
                        })
                }
            };

            $scope.init = function() {
                $scope.detection.getDeviceLevel();
            };

            $scope.init();

            function showMessage(level, content) {
                var json = {
                    title: $scope.detection.title,
                    level: level,
                    content: content
                };
                iMessage.show(json);
            }
        }
    ]);
});
