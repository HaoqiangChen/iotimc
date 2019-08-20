/**
 * 设备联动管理—列表
 *
 *  Created by YBW on 2016-8-20
 */
define([
    'app',
    'safe/js/directives/safePicker',
    'cssloader!system/deviceeventmanage/css/index.css'
], function(app) {
    app.controller('deviceeventmanageController', ['$scope', '$state', 'iAjax', 'iMessage', 'iTimeNow', 'mainService', function($scope, $state, iAjax, iMessage, iTimeNow, mainService) {
        mainService.moduleName = '设备联动管理';
        $scope.deviceEvent = {
            title: '设备联动管理—列表',
            modDis: true,
            delDis: true,
            addDis: false,
            chooce: function(data) {
                if(data) {
                    data.checked = !data.checked;
                } else {
                    var choice = this.checked;
                    $.each(this.list, function(i, o) {
                        o.checked = choice;
                    });
                }

                if(_.where(this.list, {checked: true}).length == 1) {
                    this.delDis = false;
                    this.modDis = false;
                } else if(_.where(this.list, {checked: true}).length > 1) {
                    this.delDis = false;
                    this.modDis = true;
                } else {
                    this.delDis = true;
                    this.modDis = true;
                }
            },
            list: [],
            checked: false,

            /**
             * 跳到添加界面
             */
            addBtn: function() {
                var params = {
                    data: {
                        who: 'add'
                    }
                };
                $state.params = params;
                this.checked = false;
                this.chooce();
                this.title = '设备联动管理—增加';
                $state.go('system.deviceeventmanage.add', params);
            },

            /**
             * 弹出删除框
             */
            delBtn: function() {
                $('.modal').modal();
            },

            /**
             * 跳到修改界面
             */
            modBtn: function() {
                var params = {
                    data: {
                        num: _.where(this.list, {checked: true}),
                        who: 'mod'
                    }
                };
                $state.params = params;
                this.checked = false;
                this.chooce();
                this.title = '设备联动管理—修改';
                $state.go('system.deviceeventmanage.add', params);
                this.checked = false;
                $.each(this.list, function(i, o) {
                    o.checked = false;
                });
            },

            /**
             * 确认删除
             */
            delete: function() {
                var data = [];
                $.each(this.list, function(i, o) {
                    if(o.checked) {
                        data.push(o.id);
                    }
                });
                iAjax.post('security/devicerelated/events.do?action=delDeviceExecuteEventById', data).then(function() {
                    $scope.init();
                    $scope.deviceEvent.checked = false;
                    $scope.deviceEvent.chooce();
                    remind(1, '删除成功！');
                }, function() {
                    remind(4, '网络连接失败！');
                });
            }
        };

        /**
         * 初始化设备执行事件列表
         */
        $scope.init = function() {
            iAjax.post('security/devicerelated/events.do?action=getDeviceExecuteEventByAll').then(function(data) {
                if(data.result && data.result.rows) {
                    $scope.deviceEvent.list = data.result.rows;
                    $.each($scope.deviceEvent.list, function(i, o) {
                        if(!o.deviceid) {
                            if(!o.mapid) {
                                o.devicename = '所有“' + o.devicetypename + '(设备类型)”设备';
                            } else if(!o.areaid) {
                                o.devicename = '所有“' + o.mapname + '(地图)”内的“' + o.devicetypename + '(设备类型)”设备';
                            } else {
                                o.devicename = '所有“' + o.areaname + '(区域)”内的“' + o.devicetypename + '(设备类型)”设备';
                            }
                        }
                    })
                }
            }, function() {
                remind(4, '网络连接失败！');
            })
        };
        $scope.init();

        /**
         * 弹出信息提示框
         */
        function remind(level, content, title) {
            var message = {
                id: iTimeNow.getTime(),
                level: level,
                title: (title || '消息提醒'),
                content: content
            };
            iMessage.show(message, false);
        }
    }]);
});