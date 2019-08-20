/**
 * 设备联动管理—添加
 *
 *  Created by YBW on 2016-8-20
 */
define([
    'app',
    'safe/js/directives/safePicker',
    'cssloader!system/deviceeventmanage/add/css/index.css'
], function(app) {
    app.controller('deviceeventmanageAddController', ['$scope', '$state', 'iAjax', 'iMessage', '$stateParams', 'iTimeNow', function($scope, $state, iAjax, iMessage, $stateParams, iTimeNow) {

        $scope.deviceAction = {
            num: 0,
            type: [],
            map: [],
            area: [],
            trigger: [],
            devicesList: [],
            temporaryList: [],
            triggerDevice: [],
            submitValue: {
                type: '',
                map: '',
                area: '',
                trigger: '',
                action: [{
                    actionTrigger: [],
                    event: '',
                    relateType: 'current',
                    devices: {
                        name: '',
                        id: '',
                        type: ''
                    },
                    parameter: ''
                }]
            },
            inquire: '',
            tempDevice: [],
            tempActionDevice: [],
            actionDevice: [],
            deviceWindow: false,
            scDevice: {
                index: ''
            },
            argsList: [],
            time: true,
            mod: false,


            /**
             *提交信息
             */
            submit: function() {

                var data = {
                    devices: [],
                    child: []
                };

                $.each(this.triggerDevice, function(i, o) {
                    data.devices.push({
                        devicetype: o.type,
                        mapfk: null,
                        mapdtlfk: null,
                        devicefk: o.id,
                        action: $scope.deviceAction.submitValue.trigger
                    })
                });

                $.each(this.submitValue.action, function(i, o) {

                    data.child.push({
                        step: i + 1,
                        devicefk: o.devices.id,
                        devicetype: o.devices.type,
                        gettype: o.relateType,
                        action: o.event,
                        args: o.parameter
                    });

                });

                if($stateParams.data && $stateParams.data.who == 'mod') {
                    data.devices[0].id = $stateParams.data.num[0].id;
                }

                iAjax.post('security/devicerelated/events.do?action=addOrUpdDeviceEvent', data).then(function() {

                    $scope.$parent.deviceEvent.title = '设备联动管理—列表';
                    $state.go('system.deviceeventmanage');
                    $scope.$parent.init();
                    remind(1, '提交成功！');

                }, function() {
                    remind(4, '网络连接失败！');
                });
            },

            /**
             * 增加事件
             */
            addEvent: function() {

                this.submitValue.action.push({
                    event: '',
                    relateType: 'current',
                    devices: {
                        name: '',
                        id: '',
                        type: ''
                    },
                    parameter: null
                });

            },

            /**
             * 关闭选择执行设备窗口
             */
            cancelWindow: function() {
                this.deviceWindow = false;
            },

            /**
             * 选择设备
             */
            confirmDevice: function(data) {

                if(this.scDevice.index == 'trigger') {


                    if(_.where(this.triggerDevice, {id: data.id}).length == 0) {
                        this.triggerDevice.push(data);
                    }

                    if(this.triggerDevice.length == 1) {
                        getTrigger();
                    }

                } else {

                    this.cancelWindow();
                    this.submitValue.action[this.scDevice.index].devices = {
                        id: data.id,
                        type: data.type,
                        name: data.name
                    };
                    getTrigger('action');

                }
            },

            /**
             * 删除或清空触发设备
             */
            closeDevice: function(data) {
                if(data == 'clear') {
                    this.triggerDevice = [];
                } else {
                    this.triggerDevice.splice(data, 1);
                }
            },

            /**
             * 打开选择执行设备窗口
             */
            deviceFocus: function(data) {
                this.deviceWindow = true;
                this.scDevice.index = data;
                if(this.triggerDevice.length > 0 && this.scDevice.index == 'trigger') {
                    this.submitValue.type = this.triggerDevice[0].type;
                    this.input();
                }
            },

            /**
             * 获取设备列表
             */
            input: function() {

                var postData = {};
                var submit = $scope.deviceAction.submitValue;

                postData.type = submit.type;

                iAjax.post('security/devicerelated/events.do?action=getDeviceStats', postData).then(function(data) {

                    $scope.deviceAction.tempDevice = [];
                    if(data.result && data.result.rows) {
                        var deviceAction = $scope.deviceAction;

                        deviceAction.devicesList = data.result.rows;
                        deviceAction.temporaryList = deviceAction.devicesList;

                        var devicesList = deviceAction.devicesList;

                        var mapObj = {};
                        var mapdtlObj = {};

                        $.each(devicesList, function(i, o) {

                            var delMapNum = [];
                            var delareaNum = [];

                            if(o.mapname) {
                                o.mapname = delHtmlTag(o.mapname);

                                if(o.mapname.length > 8) {
                                    o.mapnameTemp = o.mapname.slice(0, 8) + '....';
                                }
                                o.mapnameArray = o.mapname.split(',');

                                $.each(o.mapnameArray, function(j, k) {

                                    if(mapObj[k] != undefined) {

                                        if(mapObj[k] == i) {
                                            delMapNum.push(j);
                                        }

                                    } else {
                                        mapObj[k] = i;
                                    }

                                });

                                $.each(delMapNum, function(j, k) {
                                    o.mapnameArray.splice(k, 1);
                                })

                            }


                            if(o.mapdtlname) {
                                o.mapdtlname = delHtmlTag(o.mapdtlname);


                                if(o.mapdtlname.length > 8) {
                                    o.mapdtlnameTemp = o.mapdtlname.slice(0, 8) + '....';
                                }

                                o.mapdtlnameArray = o.mapdtlname.split(',');
                                $.each(o.mapdtlnameArray, function(j, k) {

                                    if(mapdtlObj[k] != null) {

                                        if(mapdtlObj[k] == i) {
                                            delareaNum.push(j);
                                        }

                                    } else {
                                        mapdtlObj[k] = i;
                                    }

                                });

                                $.each(delareaNum, function(j, k) {
                                    o.mapdtlnameArray.splice(k, 1);
                                })
                            }
                        });

                        deviceAction.map = [];
                        deviceAction.area = [];
                        deviceAction.submitValue.map = '';
                        deviceAction.submitValue.area = '';

                        for(var obj in mapObj) {
                            deviceAction.map.push({
                                name: obj
                            });
                        }

                        for(var obj in mapdtlObj) {
                            deviceAction.area.push({
                                name: obj
                            });
                        }

                    }

                }, function() {
                    remind(4, '网络连接失败');
                });
            },

            /**
             * 过滤设备
             */
            inquiry: function() {

                var deviceAction = $scope.deviceAction;
                deviceAction.temporaryList = [];

                $.each(deviceAction.devicesList, function(i, o) {

                    var num = 0;

                    if(deviceAction.submitValue.map) {
                        if(o.mapnameArray) {

                            $.each(o.mapnameArray, function(j, k) {
                                if(k == deviceAction.submitValue.map) {
                                    num++;
                                    return false;
                                }
                            });

                        }

                    } else {
                        num++;
                    }


                    if(deviceAction.submitValue.area) {
                        if(o.mapdtlnameArray) {

                            $.each(o.mapdtlnameArray, function(j, k) {
                                if(k == deviceAction.submitValue.area) {
                                    num++;
                                    addDevice();
                                    return false;
                                }

                            });

                        }

                    } else {
                        num++;
                        addDevice();
                    }

                    function addDevice() {

                        if(num == 2) {
                            deviceAction.temporaryList.push(o);
                        }

                    }
                });
            },

            /**
             * 移动执行事务
             */
            direction: function(index, direction) {

                var action = this.submitValue.action;
                var data = {};
                var actionObj = action[index];

                for(var obj in actionObj) {
                    if(obj != '$$hashKey') {
                        data[obj] = actionObj[obj];
                    }
                }

                if(direction == 'top' && index) {

                    this.submitValue.action.splice(index - 1, 0, data);
                    this.submitValue.action.splice(index + 1, 1);

                } else if(direction == 'bottom' && index != action.length - 1) {

                    this.submitValue.action.splice(index + 2, 0, data);
                    this.submitValue.action.splice(index, 1);

                }
            },

            /**
             * 删除指定执行事件
             */
            delEvent: function(index) {
                if(this.submitValue.action.length == 1) {
                    this.submitValue.action[0] = {
                        event: '',
                        relateType: 'current',
                        devices: {
                            name: '',
                            id: '',
                            type: ''
                        },
                        parameter: null
                    };
                } else {
                    this.submitValue.action.splice(index, 1);
                }
            },

            /**
             * 退出添加或修改界面，回到列表界面
             */
            cancel: function() {

                $scope.deviceAction.type = [];
                $scope.deviceAction.map = [];
                $scope.deviceAction.area = [];
                $scope.deviceAction.trigger = [];
                $scope.deviceAction.submitValue = {
                    type: '',
                    map: '',
                    area: '',
                    trigger: '',
                    deviceId: '',
                    action: [{
                        event: '',
                        relateType: 'current',
                        devices: {
                            name: '',
                            id: '',
                            type: ''
                        },
                        parameter: ''
                    }]
                };
                $scope.deviceAction.actionMap = [];
                $scope.deviceAction.actionArea = [];
                $scope.deviceAction.actionTrigger = [];
                $scope.deviceAction.actionValue = {
                    type: '',
                    map: '',
                    area: ''
                };
                $scope.$parent.deviceEvent.title = '设备联动管理—列表';
                $state.go('system.deviceeventmanage');
            },

            /**
             * 选择设备关联类型
             */
            selectRelateType: function(index) {

                $.each($scope.deviceAction.submitValue.action, function(i, o) {

                    if(!o.relateType) {
                        o.relateType = $scope.deviceAction.submitValue.action[index].relateType;
                    }

                })

            },

            /**
             * 显示或隐藏执行参数提示
             */
            remindArgs: function(index, who) {
                if(who == 'focus') {
                    var id = this.submitValue.action[index].devices.id;
                    if(!id) {
                        return false;
                    }
                    var deviceAction = $scope.deviceAction;
                    iAjax.post('security/device.do?action=getDeviceParameter', {
                        filter: {
                            id: id
                        }
                    }).then(function(data) {

                        if(data.result && data.result.rows) {

                            deviceAction.argsList = data.result.rows;
                            var width = 0;

                            $.each(deviceAction.argsList, function(i, o) {
                                if(o.name.length > width) {
                                    width = o.name.length;
                                }
                            });
                            if(deviceAction.argsList.length) {

                                if(who == 'focus') {

                                    var argsListNum = deviceAction.argsList.length;

                                    if($('.iiw-system-reaction .input' + index).get(0).getBoundingClientRect().top > 500) {

                                        $('.iiw-system-reaction .args' + index).css({
                                            display: 'block',
                                            left: '20px',
                                            bottom: '57px',
                                            top: 'none',
                                            width: width * 18 + 'px'
                                        }).animate({
                                            opacity: 1,
                                            height: 30 * argsListNum + 2 + 'px'
                                        }, 300);

                                    } else {

                                        $('.iiw-system-reaction .args' + index).css({
                                            display: 'block',
                                            left: '20px',
                                            bottom: 'none',
                                            top: '57px',
                                            width: width * 18 + 'px'
                                        }).animate({
                                            opacity: 1,
                                            height: 30 * argsListNum + 2 + 'px'
                                        }, 300);

                                    }

                                }
                            }
                        }
                    }, function() {
                        remind(4, '网络连接失败！');
                    });
                } else {

                    $('.iiw-system-reaction .args' + index).eq(0).css({
                        display: 'none',
                        opacity: 0,
                        height: '10px'
                    });

                }
            },

            /**
             * 获取执行参数的value
             */
            getArgs: function(data, vlaue) {
                data.parameter = vlaue;
            }
        };

        /**
         * 获取地图
         */
        function getTrigger(who, modIndex) {

            var data = {};

            if(who) {

                var index = modIndex == null ? $scope.deviceAction.scDevice.index : modIndex;
                data.type = $scope.deviceAction.submitValue.action[index].devices.type;
                data.devicefk = $scope.deviceAction.submitValue.action[index].devices.id;
                iAjax.post('security/devicerelated/events.do?action=getDeviceTypeActions', data).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.deviceAction.submitValue.action[index].actionTrigger = data.result.rows;
                        $.each(data.result.rows, function(i, o) {
                            if($scope.deviceAction.submitValue.action[index].event == o.action) {
                                $scope.deviceAction.submitValue.action[index].event = o.action;
                            }
                        });
                    }

                }, function() {
                    remind(4, '网络连接失败');
                });

            } else {

                data.type = $scope.deviceAction.triggerDevice[0].type;
                data.devicefk = $scope.deviceAction.triggerDevice[0].id;
                iAjax.post('security/devicerelated/events.do?action=getCallBackAction', data).then(function(data) {

                    if(data.result && data.result.rows) {

                        $scope.deviceAction.trigger = data.result.rows;

                        if(data.result.rows.length > 0 && !($stateParams.data && $stateParams.data.who == 'mod')) {
                            $scope.deviceAction.submitValue.trigger = data.result.rows[0].action;
                        }
                    }

                }, function() {
                    remind(4, '网络连接失败');
                });
            }
        }

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

        function delHtmlTag(obj) {
            obj = obj.replace(/\/?[^>]*>/gim, '');
            obj = obj.replace(/(^\s+)|(\s+$)/g, '');
            obj = obj.replace(/\s/g, '');
            return obj;
        }

        iAjax.post('security/devicerelated/events.do?action=getDeviceType').then(function(data) {

            var obj = $scope.deviceAction;

            if(data.result && data.result.rows) {

                obj.type = data.result.rows;
                if($stateParams.data && $stateParams.data.who == 'mod') {
                    $scope.deviceAction.submitValue.type = $stateParams.data.num[0].devicetype;
                } else {
                    $scope.deviceAction.submitValue.type = obj.type[0].type;
                }
                $scope.deviceAction.input();
            }
        }, function() {
            remind(4, '网络连接失败');
        });


        $scope.$on('deviceeventmanageAddControllerOnEvent', function() {

            if($stateParams.data && $stateParams.data.who == 'mod') {

                var params = $stateParams.data.num[0];
                var deviceAction = $scope.deviceAction;
                deviceAction.submitValue.trigger = params.action;
                deviceAction.submitValue.action = [];
                deviceAction.mod = true;

                deviceAction.triggerDevice = [{
                    type: params.devicetype,
                    id: params.deviceid,
                    name: params.devicename,
                    typename: params.devicetypename
                }];


                $.each(params.devicerelateddtlData, function(i, o) {

                    deviceAction.submitValue.action.push({
                        actionTrigger: [],
                        event: o.action,
                        relateType: o.gettype,
                        devices: {
                            name: o.devicename,
                            id: o.devicefk,
                            type: o.devicetype
                        },
                        parameter: o.args
                    });

                    getTrigger();
                    getTrigger('action', i);
                });
            }
        });
    }]);
});