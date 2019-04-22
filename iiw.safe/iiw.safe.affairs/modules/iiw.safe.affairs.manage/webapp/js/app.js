/**
 * 日常事务-管理
 *
 * Created by YBW on 2017-04-01
 */
define([
    'app',
    'safe/affairs/manage/js/services/affairsLocalpollingService',
    'cssloader!safe/affairs/manage/css/index'
], function(app) {

    app.controller('affairsManageController', [
        '$scope',
        'iAjax',
        '$state',
        'unitTree',
        '$rootScope',
        'devicesStorage',
        '$filter',
        'iMessage',
        'iTimeNow',
        'iConfirm',
        'affairsLocalpollingStorage',
        'iGetLang',
        function($scope, iAjax, $state, unitTree, $rootScope, devicesStorage, $filter, iMessage, iTimeNow, iConfirm, affairsLocalpollingStorage, iGetLang) {
            $scope.manage = {
                list: [],
                syou: [],
                signList: [],
                deviceAction: {},
                deviceName: {},
                polling: [],    // 电视墙轮巡组
                themes: [], // 电视墙模式
                selectList: [],
                save: {
                    name: '',
                    ouname: '',
                    type: 'POLICE',
                    drule: 'E',
                    starttime: $filter('date')(new Date().getTime(), 'H:00'),
                    endtime: $filter('date')(new Date().getTime(), 'H:59'),
                    devices: [],
                    polling: [],
                    way: 'Y',
                    week: '?',
                    daymoth: '*'
                },
                weekList: [
                    {name: '星期日', checked: false, value: 1},
                    {name: '星期一', checked: false, value: 2},
                    {name: '星期二', checked: false, value: 3},
                    {name: '星期三', checked: false, value: 4},
                    {name: '星期四', checked: false, value: 5},
                    {name: '星期五', checked: false, value: 6},
                    {name: '星期六', checked: false, value: 7}
                ],
                filterTime: $filter('date')(iTimeNow.getTime(), 'yyyy-MM-dd'),
                tempId: '',
                type: '',
                selectTime: '',
                filterAll: 'yes',
                toggleBack: true,

                //返回日常事务列表
                goBack: function() {
                    $state.go('safe.affairs');
                    $scope.$parent.affairs.getList();
                    //if($scope.$parent.affairs.device.id && $scope.$parent.affairs.device.id != '') {
                    //    $scope.$parent.affairs.getDevice();
                    //}
                },

                //选择事务
                chooseAffairs: function(data) {
                    $scope.manage.selectList = [];
                    $scope.manage.weekList = [
                        {name: '星期日', checked: false, value: 1},
                        {name: '星期一', checked: false, value: 2},
                        {name: '星期二', checked: false, value: 3},
                        {name: '星期三', checked: false, value: 4},
                        {name: '星期四', checked: false, value: 5},
                        {name: '星期五', checked: false, value: 6},
                        {name: '星期六', checked: false, value: 7}
                    ];
                    this.save = JSON.parse(JSON.stringify(data));
                    if(this.save.devices) {
                        $.each(this.save.devices, function(i, o) {
                            o.deviceid = o.devicefk;

                            if(o.devicetype == 'bigmonitor') {
                                $scope.manage.deviceAction[o.devicetype] = [{
                                    actionstr: 'polling',
                                    name: '启动轮巡组'
                                }, {
                                    actionstr: 'setLayOut',
                                    name: '切换模式'
                                }];

                                getArgs(o, i);
                            } else {
                                //if(!$scope.manage.deviceAction[o.devicetype]) {
                                //    getDeviceAction(o.devicefk , o.devicetype);
                                //    getArgs(o, i);
                                //}

                                getDeviceAction(o.devicefk , o.devicetype);
                                getArgs(o, i);
                            }

                        });

                    } else {
                        this.save.devices = [];
                    }

                    if(this.save.handletype) {
                        this.save.way = this.save.handletype;
                    } else {
                        this.save.way = 'N';
                    }

                    if(this.save.devices.length) {
                        this.save.way = this.save.devices[0].type;
                    }

                    if(this.save.dispatchs.length) {
                        $.each(this.save.dispatchs, function(i, o) {
                            if(o.month != '*' && o.day != '*') {
                                $scope.manage.selectList.push(o.year + '-' + o.month + '-' + o.day)
                            }
                        });
                    }
                    if(this.save.dispatchs[0].week != '?' && this.save.dispatchs[0].week != '*') {
                        $.each(this.save.dispatchs[0].week, function(index, week) {
                            $scope.manage.weekList[week - 1].checked = true;
                        })
                    }
                    this.daymoth = $scope.manage.selectList;
                    this.toggleBack = false;
                    this.syou = data.syou;

                },

                //显示单位树
                showUnitTree: function() {
                    unitTree.show('iiwOmsAffairsManage', 'single');
                },

                //删除执行设备
                delDevice: function(index) {
                    this.save.devices.splice(index, 1);
                },

                //删除轮巡组
                delPolling: function(index) {
                    this.save.polling.splice(index, 1);
                },

                //清空单位
                clearSyou: function() {

                    this.syou = [];
                    this.save.ouname = '';

                },

                //添加执行设备
                addDevices: function() {

                    var ids = '';
                    $.each(this.save.devices, function(i, o) {
                        ids += o.deviceid + ',';
                    });
                    devicesStorage.show('iiwSafeAffairsDevice', ids, 'single');

                },

                // 添加本地轮巡组
                addLocalpolling: function() {
                    affairsLocalpollingStorage.show(this.save.polling);
                },

                //提交
                submit: function() {
                    var manage = $scope.manage;

                    $.each(this.save.devices, function(i, o) {
						o.args = o.args ? o.args.toString() : '';
                        if(manage.save.way == 'N') {
                            o.type = 'N'
                        } else {
                            o.type = 'Y'
                        }
                    });

                    // 根据手自动类型增加字段
                    if(manage.save.way == 'Y') {
                        this.save.handletype = 'Y';
                    } else {
                        this.save.handletype = '';
                    }

                    switch (this.save.drule) {
                        case 'D':
                            this.save.daymoth = $scope.manage.selectList;
                            this.save.week = '?';
                            break;
                        case 'W':
                            var list = [];
                            angular.forEach($scope.manage.weekList, function(item) {
                                if(item.checked == true) {
                                    list.push(item.value);
                                }
                            });
                            this.save.week = list;
                            this.save.daymoth = ['?'];
                            break;
                        default :
                            this.save.daymoth = ['*'];
                            this.save.week = '?';
                            break;
                    }

                    if((this.save.drule == 'D' && this.save.daymoth.length == 0) || (this.save.drule == 'W' && this.save.week.length == 0)) {
                        remind(3, '请选择时间');
                        return false;
                    }

                    var data = {};
                    if(this.save.id) {
                        // 修改操作

                        this.save.id = this.save.id.split(',');
                        this.save.syou = this.syou;

                        data = {
                            rows: this.save
                        };

                        if(data.rows.dispatchs) {
                            data.rows.dispatchs = [];
                        }

                        $.each(data.rows.syou, function(i, o) {
                            delete  data.rows.syou[i].timecfgdtlid;
                        });

                    } else {
                        // 新增操作
                        data = {
                            rows: {
                                timecfg: [
                                    this.save
                                ],
                                syoufilter: 'Y'
                            }
                        }
                    }

                    iAjax.post('sys/web/Sydispatcher.do?action=addTimecfg', data).then(function() {
                        $scope.manage.getList();
                        $scope.manage.clear();
                        $scope.manage.syou = [];
                        remind(1, '提交成功');
                    }, function() {
                        remind(4, '网络连接出错，提交失败');
                    });
                },

                //删除事务
                del: function(id) {
                    $scope.manage.tempId = id;
                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '删除信息后将无法还原，是否确认删除？',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'manage.confirmSuccess'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'manage.confirmClose'
                        }]
                    });
                },

                //获取列表
                getList: function(filterAll) {
                    if(filterAll) {
                        $scope.manage.filterAll = filterAll;
                    }
                    iAjax.post('sys/web/Sydispatcher.do?action=getTimecfg', {
                        filter: {
                            syoufilter: 'Y',
                            all: $scope.manage.filterAll,
                            time: $scope.manage.filterTime
                        }
                    }).then(function(data) {
                        console.log('return data ->',data)
                        if(data.result && data.result.rows) {
                            $scope.manage.list = data.result.rows;
                        }
                    }, function() {
                        remind(4, '网络连接出错，获取事务列表失败');
                    });
                },

                //清空执行设备-轮巡组
                clearDevice: function() {
                    this.save.devices = [];
                    this.save.polling = [];
                },

                //取消操作
                clear: function(data) {

                    if(data == 'add') {
                        this.toggleBack = false;
                    } else {
                        this.toggleBack = true;
                    }
                    $scope.manage.selectList = [];
                    $scope.manage.weekList = [
                        {name: '星期日', checked: false, value: 1},
                        {name: '星期一', checked: false, value: 2},
                        {name: '星期二', checked: false, value: 3},
                        {name: '星期三', checked: false, value: 4},
                        {name: '星期四', checked: false, value: 5},
                        {name: '星期五', checked: false, value: 6},
                        {name: '星期六', checked: false, value: 7}
                    ];
                    this.signList = [];
                    this.save = {
                        name: '',
                        ouname: '',
                        type: 'POLICE',
                        drule: 'E',
                        starttime: $filter('date')(new Date().getTime(), 'H:00'),
                        endtime: $filter('date')(new Date().getTime(), 'H:59'),
                        devices: [],
                        polling: [],
                        way: 'Y'
                    };

                    $scope.$broadcast('safe.affairs.manager.localpolling.clear');

                },

                //显示执行参数提示框
                //showSign: function(index, obj) {
                //
                //    var devices = this.save.devices;
                //    if(obj == 'focus' && this.signList[index] && this.signList[index].length) {
                //        devices[index].toggleSign = true;
                //    } else if(obj == 'blur') {
                //        devices[index].toggleSign = false;
                //    }
                //
                //},

                //选择执行参数
                chooseSign: function(id, value) {

                    var obj = _.where(this.save.devices, {deviceid: id})[0];
                    obj.args = value;
                    $('.iiw-safe-affairs-signInput' + id).blur();

                },
                changeTime: function(item) {
                    if($scope.manage.selectList.indexOf(item) == -1) {
                        $scope.manage.selectList.push($scope.manage.selectTime);
                    } else {
                        return;
                    }
                },
                closeTime: function(index) {
                    if($scope.manage.selectList.length) {
                        $scope.manage.selectList.splice(index, 1);
                    } else {
                        $scope.manage.selectList = [];
                    }
                },
                chooseWeek: function(week) {
                    week.checked = !week.checked;
                },
                showDate: function() {
                    $('#safeAffairsDateInput').focus();
                },
                chooseParams: function (row, index) {
                    getArgs(row, index);
                },
                confirmSuccess: function(id) {
                    iConfirm.close(id);
                    var ids = $scope.manage.tempId.split(',');
                    iAjax.post('sys/web/Sydispatcher.do?action=delTimecfg', {
                        id: ids
                    }).then(function() {
                        remind(1, '成功删除');
                        if($scope.manage.save.id) {
                            delete $scope.manage.save.id;
                        }
                        $scope.manage.getList();
                    }, function() {
                        remind(4, '网络连接出错，获取删除事务失败');
                    });
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                }
            };

            $scope.dialect = {
                'PTN_C': iGetLang.get('PTN_C')
            };

            //获取执行参数
            function getArgs(data, index) {
                if(data.action == 'polling') {
                    getPolling(data.deviceid);
                } else if(data.action == 'setLayOut') {
                    getThemes(data.deviceid);
                } else {
                    iAjax.post('security/device.do?action=getDeviceParameter', {
                        filter: {
                            id: data.deviceid,
                            actionstr: data.action
                        }
                    }).then(function (data) {

                        if (data.result && data.result.rows) {
                            var width = 0;
                            $.each(data.result.rows, function (i, o) {
                                var length = o.name.length;
                                if (length) {
                                    width = length;
                                }
                                o.value = o.value.toString();
                            });

                            $scope.manage.signList[index] = data.result.rows;
                            $scope.manage.save.devices[index].signWidth = (width * 14 + 30);

                        }

                    }, function () {
                        remind(4, '网络连接出错，获取执行参数失败');
                    });
                }
            }

            //获取设备动作
            function getDeviceAction(devicefk, devicetype) {

                iAjax.post('security/deviceComm.do?action=getDeviceAction', {
                    deviceid: devicefk
                }).then(function(data) {

                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.manage.deviceAction[devicetype] = data.result.rows;
                    }

                }, function() {
                    remind(4, '网络连接出错，获取设备类型失败');
                });

            }

            /**
             * 获取轮巡组
             *
             * @author ybw
             * @data 2017/6/1
             * @version 1.0
             */
            function getPolling(devicefk) {
                iAjax.post('security/polling/polling.do?action=getBigmonitorPollingList', {
                    filter: {
                        relationid: devicefk
                    }
                }).then(function(data) {

                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.manage.polling[devicefk] = data.result.rows;
                    }

                }, function() {
                    remind(4, '网络连接出错，获取设备类型失败');
                });
            }

            /**
             * 获取电视墙模式
             * @author : zhs
             * @version : 1.0
             * @date : 2018-08-30
            */
            function getThemes(devicefk) {
                iAjax.post('security/bigmonitor/theme.do?action=getUesrBigmonitorTheme', {
                    id: devicefk
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.manage.themes[devicefk] = data.result.rows;
                    }
                });
            }

            //选择设备回调函数
            $rootScope.iiwSafeAffairsDevice = function(data, result) {
                if(result == 'add') {
                    $scope.manage.save.devices.push({
                        deviceid: data.id,
                        action: '',
                        args: '',
                        type: 'Y',
                        devicename: data.name,
                        devicetype: data.type
                    });
                    var obj = $scope.manage.save.devices[$scope.manage.save.devices.length - 1];


                    if(data.type == 'bigmonitor') {

                        $scope.manage.deviceAction[data.type] = [{
                            actionstr: 'polling',
                            name: '启动轮巡组'
                        }, {
                            actionstr: 'setLayOut',
                            name: '切换模式'
                        }];

                    } else {

                        //getArgs(data, $scope.manage.save.devices.length - 1);
                        if(data.type && !$scope.manage.deviceAction[data.type]) {
                            getDeviceAction(data.id, data.type);
                        }
                    }

                } else if(result == 'del') {

                    $.each($scope.manage.save.devices, function(i, o) {
                        if(o.deviceid == data.id) {
                            $scope.manage.save.devices.splice(i, 1);
                        }
                    })

                }

            };

            //选择单位回调函数
            $rootScope.iiwOmsAffairsManage = function(data) {
                var name = '';
                $scope.manage.syou = [];
                for(var obj in data) {

                    $scope.manage.syou.push({
                        id: obj,
                        name: data[obj].name
                    });
                    name += data[obj].name + '，';
                }

                $scope.manage.save.ouname = name.slice(0, -1);

                setTimeout(function() {
                    var height = $('.iiw-safe-affairs-manage-body-right span').height(),
                        target = $('.iiw-safe-affairs-manage-body-right .syou');

                    target.css({
                        'height': ((height - 21) / 40 + 1) * 40 + 'px'
                    });
                }, 100);
            };

            //消息提示
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒'),
                    content: (content || '网络出错'),
                    level: level
                };

                iMessage.show(message, false);
            }

            $scope.$on('affairsManageControllerOnEvent', function() {
                $scope.manage.getList();
            });

            $scope.$on('safe.affairs.manager.localpolling', function(event, data) {
                $scope.manage.save.polling = data;
            });
        }]);
});