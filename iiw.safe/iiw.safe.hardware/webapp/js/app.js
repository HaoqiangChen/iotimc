/**
 * Created by yjj on 2016-03-21.
 */
define([
    'app',
    'safe/hardware/js/directives/safeHardwareList',
    'cssloader!safe/hardware/css/index'
], function(app) {

    app.controller('hardwareController', ['$scope', '$state', 'safeMainTitle', 'iAjax', function($scope, $state, safeMainTitle, iAjax) {
        safeMainTitle.title = '设备控制中心';

        $scope.hardwareList = [];
        $scope.moduleList = [
            {
                name: '监控中心',
                type: 'monitor',
                url: 'safe.monitorcenter',
                icon: 'picture-o',
                on: '0',
                off: '0',
                role: false
            }, {
                name: '录像中心',
                type: 'monitor',
                url: 'safe.record',
                icon: 'film',
                on: '0',
                off: '0',
                role: false
            }
        ];

        $scope.hardware = {
            deviceStatus: []
        };

        $scope.getDeviceTypeList = function(callback) {
            var url = 'security/device/device.do?action=getDeviceTypes',
                data = {};

            iAjax
                .post(url, data)
                .then(function(data) {
                    if (data && data.result && data.result.rows) {
                        _.each(data.result.rows, function(row) {
                            if (row.type == 'mattress') {
                                row.start = 'security/check/check.do?action=getMattressStatus';
                                row.stop = 'security/check/check.do?action=stopMattressStatus';
                            }
                        });

                        $scope.hardwareList = data.result.rows;
                        if (callback) {
                            callback();
                        }
                    }
                });
        };

        $scope.getStat = function() {
            $.each($scope.hardwareList, function(i, o) {
                iAjax.post('security/device/device.do?action=getMapOuActionList', {
                    filter: {
                        cascade: 'Y',
                        type: o.type
                    }
                }).then(function(data) {
                    if (data.result.rows && data.result.rows.length) {
                        var list = _.where(data.result.rows, {type: 'ou'});
                        $.each(list, function(i, row) {
                            if (!row.parentid) {
                                o.on = (row.on || 0) + '';
                                o.off = (row.off || 0) + '';
                                return false;
                            }
                        });
                    }
                });
            });
        };

        $scope.goList = function(hardware) {
            $scope.active = hardware;
            $state.go('safe.hardware.list');
        };

        $scope.showModule = function(module) {
            var data = {data: {type: 'hardware'}};
            $state.params = data;
            $state.go(module.url, data);
        };

        $scope.getDeviceTypeList(function() {
            $scope.getStat();
        });

        $scope.$on('hardwareControllerOnEvent', function() {
            getDeviceStatus();
        });

        //查看有权限访问什么模块并回去设备在线与离线数
        function getDeviceStatus() {
            iAjax.post('security/device/device.do?action=getDeviceCheckRecord').then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.hardware.deviceStatus = data.result.rows;

                    iAjax.post('sys/web/symenu.do?action=getUserMenu', {
                        type: 'safe.hardware'
                    }).then(function(data) {
                        if (data.result && data.result.rows) {

                            $.each(data.result.rows, function(i, o) {
                                var menu = _.where($scope.moduleList, {url: o.url});
                                if (menu.length) {

                                    menu[0].role = true;
                                    var status = _.where($scope.hardware.deviceStatus, {type: menu[0].type})[0];
                                    menu[0].off = status.off || 0;
                                    menu[0].on = status.on || 0;

                                }
                            });

                        }
                    });


                }
            });
        }


    }]);
});