/**
 * 日常事务
 *
 * Created by YBW on 2016-10-26.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/timeline/css/index.css',
    'safe/js/directives/safePicker',
    'system/timeline/js/directives/timelineDirectiveOuSwitch',
    'system/timeline/js/directives/timelineDirectiveTimeMask',
    'system/timeline/js/directives/timelineChooseDevice'
], function(app, angularAMD) {
    var packageName = 'iiw.system.timeline';
    app.controller('timelineController', ['$scope', '$state', 'iAjax', 'iTimeNow', 'mainService', 'iMessage', '$uibModal', '$rootScope', '$filter', 'iConfirm',
        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, $uibModal, $rootScope, $filter, iConfirm) {
        mainService.moduleName = '日常事务';

        $scope.title = '日常事务—列表';
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.modBtnFlag = true;
        $scope.select = {
            all: false
        };
        $scope.selectTime = '';
        $scope.selectList = [];
        $scope.delBtnFlag = true;
        $scope.confirmMessage = '确认删除已选择的记录吗？';
        $scope.showOneStep = true;
        $scope.filter = {searchText: ''};
        $scope.weekShow = false;
        $scope.selectOUname = false;
        $scope.OUnameLG = false;
        $scope.ouname = '请选择单位！';
        $scope.deviceLise = [];
        $scope.ouTrace = [];
        $scope.argsList = [];
        $scope.polling = [];
        $scope.deviceParams = {
            pageNo: 0,
            pageSize: 14,
            totalSize: 0
        };
        $scope.deviceType = [];
        $scope.manufacturer = {};
        $scope.manufacturerMG = {};
        $scope.movement = [];
        $scope.device = {
            manufacturerList: [],
            type: '',
            manufacturer: ''
        };
        $scope.attr = ['一', '二', '三', '四', '五', '六', '日'];

        $scope.timeLine = {
            chooseAllBtn: false,
            showAffairs: 0,
            showWho: 1
        };
        $rootScope.timeline = {
            id: '',
            name: '',
            index: ''
        };

        $scope.weekList =  [
            {name: '星期日', checked: false, value: 1},
            {name: '星期一', checked: false, value: 2},
            {name: '星期二', checked: false, value: 3},
            {name: '星期三', checked: false, value: 4},
            {name: '星期四', checked: false, value: 5},
            {name: '星期五', checked: false, value: 6},
            {name: '星期六', checked: false, value: 7}
        ];
        /**
         * 选择全部单位
         */
        $scope.chooseAll = function() {

            $scope.timeLine.chooseAllBtn = !$scope.timeLine.chooseAllBtn;
            $.each($scope.syouList, function(i, o) {
                o.checked = $scope.timeLine.chooseAllBtn;
            });

        };

        /**
         * 反选单位
         */
        $scope.oppositeChoose = function() {

            var falseNum = 0,
                trueNum = 0;

            $.each($scope.syouList, function(i, o) {
                o.checked = !o.checked;
                if(o.checked) {
                    trueNum++;
                } else {
                    falseNum++;
                }
            });

            if($scope.syouList.length && ($scope.syouList.length == falseNum || $scope.syouList.length == trueNum)) {
                $scope.timeLine.chooseAllBtn = $scope.syouList[0].checked;
            }
        };

        /**
         * 切换事务
         */
        $scope.shiftAffairs = function() {

            var width = $('.timeline .affairs').eq(0).outerWidth();
            $('.timeline .affairs > .col-md-12').css({
                display: 'block'
            });

            $('.timeline .login-window').stop();
            $('.timeline .login-window').animate({
                'position': 'absolute',
                left: -((width + 20) * ($scope.timeLine.showWho - 1)),
                top: 0
            }, 600, function() {
                $('.timeline .affairs:not(.affairs' + ($scope.timeLine.showWho - 1) + ') > .col-md-12').css({
                    display: 'none'
                });
            });

        };

        $scope.chooseWeek = function(week) {
            week.checked = !week.checked;
        };

        $scope.closeTime = function(index) {
            if($scope.selectList.length) {
                $scope.selectList.splice(index, 1);
            } else {
                $scope.selectList = [];
            }
        };

        $scope.changeTime = function(item) {
            if($scope.selectList.indexOf(item) == -1) {
                $scope.selectList.push(item);
            } else {
                return;
            }
        };

        $scope.showDate = function() {
            $('#systemTimeLineDateInput').focus();
        };

        /**
         * 添加事务
         */
        $scope.addAffairs = function() {
            $scope.selectList = [];

            $scope.entityItem.push({
                name: '',
                type: 'POLICE',
                drule: 'E',
                starttime: '',
                endtime: '',
                submitDevice: [{
                    way: 'Y',
                    deviceId: '',
                    movementId: '',
                    parameter: '',
                    movement: [],
                    deviceName: ''
                }]
            });


            var clear = setInterval(function() {
                var num = $scope.entityItem.length - 1;
                $scope.timeLine.showWho = num + 1;
                if($('.timeline .affairs').eq(num).width()) {

                    clearInterval(clear);
                    var width = $('.timeline .affairs').eq(0).outerWidth();
                    $('.timeline .login-window').css({
                        width: (width + 20) * $('.timeline .affairs').length
                    });

                    $('.timeline .affairs').css({
                        width: width,
                        'margin-right': 20
                    });

                    $('.timeline .affairs').eq(num).css({
                        display: 'block'
                    });

                    $('.timeline .login-window').stop();
                    $('.timeline .login-window').animate({
                        'position': 'absolute',
                        left: -((width + 20) * num),
                        top: 0
                    }, 600, function() {
                        $('.timeline .affairs > .col-md-12').eq(num - 1).css({
                            display: 'none'
                        });
                    });
                }
            }, 10);
        };

        $scope.$watch('timeline.id', function() {
            var rootScope = $rootScope.timeline;
            if(rootScope && rootScope.id){
                $scope.selectEvent(rootScope.id, rootScope.name, rootScope.index, rootScope.type);
            }
        });

        /**
         * 添加日常事务
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.add = function() {
            $.each($scope.syouList, function(i, ou) {
                ou.checked = false;
            });
            $scope.entityItem = [{
                name: '',
                type: 'POLICE',
                drule: 'E',
                starttime: $filter('date')(new Date().getTime(), 'H:00'),
                endtime: $filter('date')(new Date().getTime(), 'H:59'),
                submitDevice: [{
                    way: 'Y',
                    deviceId: '',
                    movementId: '',
                    parameter: '',
                    movement: [],
                    deviceName: ''
                }]
            }];
            $scope.title = '日常事务—添加';

            $scope.selectList = [];
            $scope.weekList =  [
                {name: '星期日', checked: false, value: 1},
                {name: '星期一', checked: false, value: 2},
                {name: '星期二', checked: false, value: 3},
                {name: '星期三', checked: false, value: 4},
                {name: '星期四', checked: false, value: 5},
                {name: '星期五', checked: false, value: 6},
                {name: '星期六', checked: false, value: 7}
            ];
            $state.go('system.timeline.add');
        };

        /**
         * 添加日常事务
         *
         * @author : ybw
         * @version : 2.0
         * @Date : 2016-10-24
         */
        $scope.save = function() {
            var aSelect = _.where($scope.weekList, {checked: true});
            if($scope.entityItem[0].drule == 'D' && !$scope.selectList.length) {
                iConfirm.show({
                    scope: $scope,
                    title: '日常事务',
                    content: '当前没有选择节假日日期,是否保存？',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmSuccess'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });
            } else if($scope.entityItem[0].drule == 'W' && !aSelect.length) {
                iConfirm.show({
                    scope: $scope,
                    title: '日常事务',
                    content: '当前没有选择周末日期,是否保存？',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmSuccess'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });
            } else {
                $scope.submitData();
            }
        };

        $scope.confirmClose = function(id) {
            iConfirm.close(id);
            return true;
        };

        $scope.confirmSuccess = function(id) {
            iConfirm.close(id);
            $scope.submitData();

        };

        $scope.submitData  = function() {
            var url = 'sys/web/Sydispatcher.do?action=addTimecfg';
            var data = {};

            if($scope.entityItem && $scope.entityItem[0].id) {
                data.rows = copyObj($scope.entityItem[0]);
                data.rows.syou = $scope.syou;
            } else {
                data.rows = {
                    syou: [],
                    timecfg: []
                };

                $.each($scope.entityItem, function(i, o) {
                    data.rows.timecfg[i] = copyObj(o);
                });
                data.rows.syou = $scope.syou;
            }

            function copyObj(o) {
                var obj = {};
                if(o.id) {
                    obj.id = o.id.split(',');
                    obj.dispatchs = [];
                }

                obj.drule = o.drule;
                obj.starttime = o.starttime;
                obj.endtime = o.endtime;
                obj.name = o.name;
                obj.ouname = $scope.ouname;
                obj.type = o.type;

                obj.devices = [];

                $.each(o.submitDevice, function(j, k) {
                    if(k.deviceId) {
                        obj.devices[j] = {};
                        var device = obj.devices[j];
                        device.deviceid = k.deviceId;
                        device.type = k.way;
                        device.action = k.movementId;
                        if(k.parameter) {
                            device.args = k.parameter;
                        }
                    }
                });

                switch (o.drule) {
                    case 'D':
                        if(!$scope.selectList.length) {
                            obj.daymoth = ['*'];
                            obj.week = '?';
                        } else {
                            obj.daymoth = $scope.selectList;
                            obj.week = '?';
                        }
                        break;
                    case 'W':
                        obj.week = [];
                        obj.daymoth = ['?'];
                        $.each($scope.weekList, function(index, week) {
                            if(week.checked == true) {
                                obj.week.push(week.value)
                            }
                        });
                        break;
                    default :
                        obj.daymoth = ['*'];
                        obj.week = '?';
                        break;
                }
                return obj;
            }
            iAjax.post(url, data).then(function(data) {
                if(data.status == '1') {
                    remind(1, '保存成功！');
                    $scope.cancel();
                } else {
                    remind(4, '保存失败！');
                }
            }, function() {
                remind(4, '网络连接失败');
            });
        };

        $scope.switchRule = function(data) {
            if(data != 'M') {
                $scope.proceedTime.month = '1';
            }

            if(data != 'M') {
                $scope.proceedTime.week = '1';
            }
        };


        /**
         * 删除事务（包括设备）
         */
        $scope.closeEvent = function(index) {
            $scope.entityItem.splice(index, 1);
            $scope.shiftAffairs();
        };


        /**
         * 设备参数动态提示
         */
        $scope.remindArgs = function(index, event) {
            if(event == 'focus') {
                var id = $scope.entityItem[$scope.timeLine.showWho - 1].submitDevice[index].deviceId;
                if(!id) {
                    return false;
                }
                iAjax.post('security/device.do?action=getDeviceParameter', {
                    filter: {
                        id: id
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows) {

                        $scope.argsList[index] = [];
                        $scope.argsList[index] = data.result.rows;
                        var width = 0;

                        $.each($scope.argsList[index], function(i, o) {
                            if(o.name.length > width) {
                                width = o.name.length;
                            }
                        });

                        if($scope.argsList[index].length) {
                            if(event == 'focus') {

                                if($('.timeline .input' + index).get(0).getBoundingClientRect().top > 500) {
                                    $('.timeline .args' + index).css({
                                        display: 'block',
                                        left: '10px',
                                        bottom: '53px',
                                        top: 'none',
                                        width: width * 18 + 'px'
                                    }).animate({
                                        opacity: 1,
                                        height: 30 * $scope.argsList[index].length + 2 + 'px'
                                    }, 300);
                                } else {
                                    $('.timeline .args' + index).css({
                                        display: 'block',
                                        left: '10px',
                                        bottom: 'none',
                                        top: '53px',
                                        width: width * 18 + 'px'
                                    }).animate({
                                        opacity: 1,
                                        height: 30 * $scope.argsList[index].length + 2 + 'px'
                                    }, 300);
                                }

                            }
                        }
                    }
                }, function() {
                    remind(4, '网络连接失败！');
                });
            } else {
                setTimeout(function() {
                    $('.timeline .args' + index).eq(0).css({
                        display: 'none',
                        opacity: 0,
                        height: '10px'
                    });
                }, 100)
            }
        };


        /**
         * 单击动态提示的设备参数后获取设备参数给input输入框
         */
        $scope.getArgs = function(data, value) {
            data.parameter = value;
        };


        /**
         * 事务执行设备相关操作
         *
         * @author : ybw
         * @version : 2.0
         * @Date : 2016-10-25
         */
        $scope.deviceWindow = function(index) {
            $rootScope.timeline.index = index;
            $uibModal.open({
                templateUrl: 'chooseDevice2.html',
                controller: 'timelineChooseDeviceController',
                size: 'lg',
                windowClass: 'modal-timeline'
            });
        };


        /**
         * 添加事务（包括设备）
         */
        $scope.addDevice = function(num, index) {
            $scope.entityItem[$scope.timeLine.showWho - 1].submitDevice.splice(index + 1, 0, {
                way: 'Y',
                deviceId: '',
                movementId: '',
                parameter: '',
                movement: [],
                deviceName: ''
            });
        };

        $scope.delDevice = function(index) {
            if($scope.entityItem[0].submitDevice.length == 1) {
                $scope.entityItem[$scope.timeLine.showWho - 1].submitDevice.splice(index, 1);
                $scope.entityItem[$scope.timeLine.showWho - 1].submitDevice.splice(index + 1, 0, {
                    way: 'Y',
                    deviceId: '',
                    movementId: '',
                    parameter: '',
                    movement: [],
                    deviceName: ''
                });
            } else {
                $scope.entityItem[$scope.timeLine.showWho - 1].submitDevice.splice(index, 1)
            }
        };


        /**
         * 移动动作设备位置
         */
        $scope.shiftLocation = function(direction, index) {
            var temporaryArray = $scope.entityItem[$scope.timeLine.showWho - 1].submitDevice;
            var temporaryObj = temporaryArray[index];
            var addObj = {};
            for(var obj in temporaryObj) {
                if(obj != '$$hashKey') {
                    addObj[obj] = temporaryObj[obj];
                }
            }
            if(direction == 'top') {

                temporaryArray.splice(index - 1, 0, addObj);
                temporaryArray.splice(index + 1, 1);

            } else if(direction == 'bottom') {

                temporaryArray.splice(index + 2, 0, addObj);
                temporaryArray.splice(index, 1);

            }
        };


        /**
         * 模块加载完成事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.$on('timelineControllerOnEvent', function() {
            init();
        });


        /**
         * 模块初始化事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        function init() {
            getSyouList();
            getList();
        }


        /**
         * 查询日常事务信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        function getList() {
            var data = {
                params: {
                    pageNo: $scope.currentPage,
                    pageSize: $scope.pageSize
                },
                filter: {
                    name: $scope.filter.searchText
                }
            };
            iAjax.post('sys/web/Sydispatcher.do?action=getTimecfg', data).then(function(data) {

                if(data.result && data.result.rows) {
                    $scope.list = data.result.rows;
                    $scope.totalSize = data.result.params.totalSize;
                    $scope.currentPage = data.result.params.pageNo;
                } else {
                    $scope.list = [];
                }
            }, function() {
                remind(4, '网络连接失败!');
            });
        }


        /**
         * 修改日常事务
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.mod = function() {
            $scope.selectList = [];
            $scope.weekList =  [
                {name: '星期日', checked: false, value: 1},
                {name: '星期一', checked: false, value: 2},
                {name: '星期二', checked: false, value: 3},
                {name: '星期三', checked: false, value: 4},
                {name: '星期四', checked: false, value: 5},
                {name: '星期五', checked: false, value: 6},
                {name: '星期六', checked: false, value: 7}
            ];
            $scope.modBtnFlag = true;
            $scope.title = '日常事务—修改';
            var nodes = _.where($scope.list, {checked: true});

            if(nodes.length == 1) {

                $state.go('system.timeline.add');
                $scope.entityItem = [{}];
                $scope.entityItem[0] = nodes[0];
                $scope.syou = nodes[0].syou;
                $scope.ouname = nodes[0].ouname;
                if(nodes[0].dispatchs.length) {
                    $.each(nodes[0].dispatchs, function(i, o) {
                        if(o.month != '*' && o.day != '*') {
                            $scope.selectList.push(o.year + '-' + o.month + '-' + o.day)
                        }
                    });
                    if(nodes[0].dispatchs[0].week != '?' && nodes[0].dispatchs[0].week != 0 && nodes[0].dispatchs[0].week != '*') {
                        $.each(nodes[0].dispatchs[0].week, function(index, week) {
                            $scope.weekList[week - 1].checked = true;
                        })
                    }
                }

                $scope.entityItem[0].submitDevice = [];

                if(nodes[0].devices) {
                    $.each(nodes[0].devices, function(i, o) {

                        $scope.entityItem[0].submitDevice[o.idx - 1] = {};
                        var submitDevice = $scope.entityItem[0].submitDevice[o.idx - 1];
                        if(o.devicetype == 'bigmonitor') {
                            submitDevice.movement = [{
                                actionstr: 'polling',
                                name: '启动轮巡组'
                            }];

                            $scope.polling[o.devicefk] || getPolling(o.devicefk);
                        } else {
                            iAjax.post('security/deviceComm.do?action=getDeviceAction', {
                                deviceid: o.devicefk
                            }).then(function(data) {
                                if(data.result && data.result.rows) {
                                    submitDevice.movement = data.result.rows;
                                }
                            }, function() {
                                remind(4, '网络连接失败！');
                            });
                        }

                        submitDevice.parameter = o.args;
                        submitDevice.movementId = o.action;
                        submitDevice.deviceId = o.devicefk;
                        submitDevice.deviceName = o.devicename;
                        submitDevice.way = o.type;
                    });
                } else {
                    $scope.entityItem[0].submitDevice.push({
                        way: 'Y',
                        deviceId: '',
                        movementId: '',
                        parameter: '',
                        movement: [],
                        deviceName: ''
                    });
                }

                $.each($scope.syouList, function(i, o) {

                    var ret = _.filter($scope.syou, {id: o.id});
                    if(ret.length > 0) {
                        o.checked = true;
                    } else {
                        o.checked = false;
                    }

                });
            }
        };


        /**
         * 显示删除提示框
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.delete = function() {
            var aSelect = _.where($scope.list, {checked: true}),
                aName = [];
            aName = aSelect.map(function(item, i) {
                return (i + 1 +  '、' + item.name)
            });
            iConfirm.show({
                scope: $scope,
                title: '确认删除？',
                content: '共选择' + aSelect.length + '条数据，分别为：<br>' + aName.join('<br>'),
                buttons: [{
                    text: '确认',
                    style: 'button-primary',
                    action: 'confirmDelete '
                }, {
                    text: '取消',
                    style: 'button-caution',
                    action: 'confirmClose'
                }]
            });
        };


        /**
         * 确认删除
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.confirmDelete = function(id) {
            iConfirm.close(id);
            var nodes = _.where($scope.list, {checked: true});
            var ids = [];
            if(nodes.length > 0) {
                $.each(nodes, function(i, o) {
                    ids = ids.concat(o.dispatchfk.split(','));
                });
                var data = {
                    id: ids
                };

                iAjax.post('/sys/web/Sydispatcher.do?action=delTimecfg', data).then(function(data) {
                    if(data.status == '1') {
                        remind(1, '删除成功!');
                        init();
                        $scope.select.all = false;
                    } else {
                        remind(4, '删除失败!');
                    }
                }, function() {
                    remind(4, '网络连接失败!');
                });
            }
        };

        $scope.confirmClose = function(id) {
            iConfirm.close(id);
        };


        /**
         * 全选/反选事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.selAll = function() {

            $.each($scope.list, function(i, o) {
                o.checked = $scope.select.all;
            });
            $scope.chooseRow();

        };

        /**
         * 取消添加/修改事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.cancel = function() {
            $state.go('system.timeline');
            $scope.entityItem = [{
                name: '',
                type: 'POLICE',
                drule: 'D',
                starttime: '',
                endtime: '',
                submitDevice: [{
                    way: 'Y',
                    deviceId: '',
                    movementId: '',
                    parameter: '',
                    movement: [],
                    deviceName: ''
                }]
            }];
            $scope.ouname = '请选择单位！';
            $scope.month = '';
            $scope.week = '';
            $scope.select.all = false;
            $scope.title = '日常事务—列表';
            $rootScope.timelineFilter = null;
            getList()
        };

        /**
         * 设置按钮可用状态
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.checkBtnFlag = function() {

            var nodes = _.where($scope.list, {checked: true});
            if(nodes.length == 1) {
                $scope.modBtnFlag = false;
            } else {
                $scope.modBtnFlag = true;
            }

            if(nodes.length > 0) {
                $scope.delBtnFlag = false;
            } else {
                $scope.delBtnFlag = true;
            }
        };

        /**
         * 选择记录
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.chooseRow = function() {
            $scope.checkBtnFlag();
        };

        /**
         * 查询单位列表
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        function getSyouList() {

            iAjax.post('sys/web/syou.do?action=getSyouAll', {}).then(function(data) {

                if(data.result && data.result.rows) {
                    $scope.syouList = data.result.rows;
                } else {
                    $scope.syouList = [];
                }

            }, function() {
                remind(4, '网络连接失败!');
            });

        }

        $scope.timeLinePageChanged = function() {
            $scope.currentPage = this.currentPage;
            getList();
        };

        $scope.$watch('filter.searchText', function() {
           getList();
        });

        $scope.pageChanged = function() {
            $scope.getDevice();
        };

        var time = null;

        $scope.searchKey = function() {

            if(time) {
                clearTimeout(time);
            }

            time = setTimeout(function() {
                $scope.getDevice()
            }, 500);

        };


        /**
         * 查询和选择事务执行动作
         *
         * @author : ybw
         * @version : 2.0
         * @Date : 2016-10-24
         */
        $scope.selectEvent = function(id, name, index, type) {
            var temporaryArray = $scope.entityItem[$scope.timeLine.showWho - 1].submitDevice;
            temporaryArray[index].deviceId = id;
            temporaryArray[index].deviceName = name;
            temporaryArray[index].parameter = '';

            iAjax.post('security/deviceComm.do?action=getDeviceAction', {
                deviceid: id
            }).then(function(data) {

                if(data.result && data.result.rows && data.result.rows.length) {
                    temporaryArray[index].movement = data.result.rows;
                    temporaryArray[index].movementId = data.result.rows[0].actionstr;

                    if(temporaryArray.length > 1) {
                        $.each(temporaryArray, function(i, o) {
                            if(!o.deviceId) {
                                o.movement = data.result.rows;
                                o.deviceId = id;
                                o.deviceName = name;
                                o.movementId = data.result.rows[0].actionstr;
                            }
                        });
                    }
                } else {
                    temporaryArray[index].movement = [];
                    temporaryArray[index].movementId = '';
                }

                if(type == 'bigmonitor') {
                    temporaryArray[index].movement = [{
                        actionstr: 'polling',
                        name: '启动轮巡组'
                    }];

                    temporaryArray[index].movementId = 'polling';
                    $scope.polling[id] || getPolling(id);
                }

            }, function() {
                remind(4, '网路出错，获取设备动作失败！')
            });
        };

        /**
         * 获取电视墙轮巡组
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
                    $scope.polling[devicefk] = data.result.rows;
                }

            }, function() {
                remind(4, '网络连接出错，获取轮巡组失败');
            });
        }

        $scope.chooseOu = function(obj, index, id) {

            if(!$scope.ouTrace[id]) {

                $scope.ouTrace.push({
                    index: index,
                    checked: (obj.checked || false)
                });
                $scope.ouTrace[id] = id;

            }
            if(obj.checked) {

                var item = _.filter($scope.syouList, {id: obj.id});
                if(item && item.length > 0) {
                    item[0].checked = false;
                }

            } else {

                var item = _.filter($scope.syouList, {id: obj.id});
                if(item && item.length > 0) {
                    item[0].checked = true;
                }

            }
            event.stopPropagation();

        };

        $scope.cancelOUname = function() {

            windowShow('hide');
            $.each($scope.ouTrace, function(i, o) {
                $scope.syouList[o.index].checked = o.checked;
            });
            $scope.ouTrace = [];

        };

        function windowShow(show) {

            var titleText = $('.title').eq(0);
            var height = titleText.height();
            var OUnameWindow = $('#OUnameFrame');

            if(show == 'show') {

                OUnameWindow.css({
                    left: titleText.position().left,
                    top: titleText.position().top,
                    width: '900px',
                    height: height
                });

                $scope.selectOUname = true;
                $scope.OUnameLG = true;
                $('#OUnameFrame').height(height);
                $('#OUnameFrame > .col-lg-12').height(height);
                $('#OUnameFrame > .col-lg-12 > .col-lg-12:eq(0)').height(420);
                $('#OUnameFrame > .col-lg-12').animate({
                    height: '500px',
                    opacity: 1
                }, 500);

            } else {

                $scope.OUnameLG = false;

                $('#OUnameFrame > .col-lg-12').animate({
                    height: height,
                    opacity: 0
                }, 300, function() {
                    $scope.selectOUname = false;
                });
            }
        }

        $scope.confirmChoose = function() {

            if($scope.selectOUname) {

                windowShow('hide');
                $scope.syou = _.filter($scope.syouList, {checked: true});

                if($scope.syou.length > 0) {
                    $scope.names = [];
                    $.each($scope.syou, function(i, o) {
                        $scope.names.push(o.name);
                    });
                    $scope.ouname = $scope.names.join('，');
                } else {
                    $scope.ouname = '请选择单位！';
                }

                $scope.ouTrace = [];

            } else {
                windowShow('show');
            }
        };


        /**
         * 消息提醒
         */
        function remind(level, content, title) {

            var message = {
                id: iTimeNow.getTime(),
                level: level,
                content: content,
                title: (title || '消息提醒')
            };

            iMessage.show(message, false);
        }
    }]);

    angularAMD.config(['$stateProvider', function($stateProvider) {

        $stateProvider.state('system.timeline.add', {
            url: '/add',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        });

    }]);
});