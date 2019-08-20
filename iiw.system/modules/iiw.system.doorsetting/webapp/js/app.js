/**
 * 门禁基础设置
 * Created by gdj on 2015-10-21.
 */
define([
    'app',
    'cssloader!system/doorsetting/css/index',
    'cssloader!system/doorsetting/css/search-input',
    'cssloader!system/doorsetting/css/ds-input',
    'system/doorsetting/js/directives/doorSettingSearchDirective',
    'system/doorsetting/js/directives/doorSettingInputClickDirective',
    'system/doorsetting/js/directives/doorSettingUserTreeDirective'
], function(app) {
    app.controller('doorSettingController', ['$scope', '$rootScope', '$location', '$window', '$state', '$uibModal', 'iAjax', 'iMessage', 'mainService', 'iSocket', function($scope, $rootScope, $location, $window, $state, $uibModal, iAjax, iMessage, mainService, iSocket) {
        $scope.title = '门禁基础设置';
        mainService.moduleName = '门禁基础设置';
        $scope.resultList = [];
        $scope.ouList = [];
        $scope.ouTree = '';
        $scope.inputSearch = '';
        $scope.hasCheckDoor = false;
        /**
         * 模块加载完成后事件
         *
         */
        $scope.$on('doorSettingControllerOnEvent', function() {
            init();
        });

        function init() {
            getDoorSettingList();
            getOuList();
        }

        //监听查询文本框
        $scope.$on('search-event', function() {
            getDoorSettingList();
        });

        $scope.$watch('resultList', function() {
            $scope.hasCheckDoor = false;
            $.each($scope.resultList, function(i, row) {
                $.each(row.devices, function(i, zRow) {
                    if (zRow.select == true) {
                        $scope.hasCheckDoor = true;
                        return false;
                    }
                });
            });
        }, true);

        function appDoorSettingList(list, appObj) {
            //可以优化
            $.each(list, function(i, row) {
                for (var key in appObj) {
                    row.key = appObj[key];
                }
            });
        }

        /**
         * 添加loading背景
         * @param $obj
         */
        function setLoadingStart() {
            var childList = [];
            $.each($scope.resultList, function(i, row) {
                $.each(row.devices, function(j, zRow) {
                    zRow.syncLoading = true;
                    childList[zRow.id] = zRow;
                });
            });
            return childList;
        }

        function getOuList(fn) {
            iAjax.post('sys/web/syou.do?action=getSyouAll').then(function(data) {
                if (data.status == 1 && data.result && data.result.rows.length > 0) {
                    $scope.ouList = data.result.rows;
                    if (fn) fn.call($scope);
                }
            });
        }

        function initOuTree(fn) {
            $scope.$broadcast('ouTree-initTree', {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: 'id',
                        pIdKey: 'pId'
                    }
                },
                callback: {
                    onClick: function() {

                    }
                }
            }, $scope.ouList, function() {
                if (fn) fn.call(this);
            });
        }

        /**
         * 初始化门禁列表
         */
        function getDoorSettingList() {
            iAjax.post('door/doorset.do?action=getAreaDevice', {
                filter: {
                    name: $scope.inputSearch
                }
            }).then(function(data) {
                if (data.status == '1') {
                    $.each(data.result.rows, function(i, row) {
                        appDoorSettingList(row.devices, {
                            select: false
                        });
                    });
                    $scope.resultList = data.result.rows;
                }
            }, function() {
                iMessage.show({ //提示删除情况
                    id: 'area_sussess',
                    level: 3,
                    title: '提示',
                    timeout: 3,
                    content: '获取门禁设备列表失败，请检查网络'
                });
            });
        }

        $scope.$on('ds-input-event', function(e, $ele) {
            var index = $ele.closest('.ou-container').index(),
                obj = $scope.resultList[index];

            iAjax.post('door/doorset.do?action=saveArea', {
                id: obj.id,
                name: obj.name
            }).then(function(data) {
                if (data.status == '1') {
                    iMessage.show({ //提示删除情况
                        id: 'door_sussess',
                        level: 1,
                        title: '提示',
                        content: '修改门禁成功'
                    });
                }
            }, function() {
                // 提示删除情况
                iMessage.show({
                    id: 'area_sussess',
                    level: 3,
                    title: '提示',
                    timeout: 3,
                    content: '获取门禁设备列表失败，请检查网络'
                });
            });
        });

        $scope.addOu = function($event) {
            //界面显示
            var self = $($event.target);

            //数据提交
            iAjax.post('door/doorset.do?action=saveArea', {
                name: '区域'
            }).then(function(data) {
                if (data.status == '1') {
                    var id = data.result.id;
                    if (self.hasClass('ou-btn')) {
                        var index = self.closest('.ou-container').index();
                        $scope.resultList.splice(index + 1, 0, {
                            id: id,
                            name: '区域',
                            type: '1',
                            devices: []
                        });
                    } else {
                        $scope.resultList.push({
                            id: id,
                            name: '区域',
                            type: '1',
                            devices: []
                        });
                    }
                }
            }, function() {
                iMessage.show({ //提示保存情况
                    id: 'area_sussess',
                    level: 3,
                    title: '提示',
                    timeout: 3,
                    content: '添加区域失败，请检查网络'
                });
            });
        }

        $scope.removeOu = function($event) {
            $event.stopPropagation();
            //界面显示
            var self = $($event.target),
                index = self.closest('.ou-container').index();

            var id = $scope.resultList[index]['id'];
            iAjax.post('door/doorset.do?action=deleteArea', {
                id: id
            }).then(function(data) {
                if (data.status == '1') {
                    $scope.resultList.splice(index, 1);
                }
            }, function() {
                iMessage.show({ //提示删除情况
                    id: 'area_sussess',
                    level: 3,
                    title: '提示',
                    timeout: 3,
                    content: '删除区域失败，请检查网络'
                });
            });
        }

        $scope.addDoor = function($event) {
            var index = $($event.target).closest('.ou-container').index();

            $scope.dialogType = 'add';

            //弹出门禁明细
            var doorModal = $uibModal.open({
                templateUrl: 'doorModalContent',
                appendTo: $('.page-content').eq(0),
                scope: $scope,
                controller: ['$scope', function($scope) {
                    $scope.door = {};
                    $scope.door.name = '';
                    $scope.door.ip = '';
                    $scope.door.port = '';
                    $scope.door.vtype = '';
                    $scope.door.roletype = '1';
                    $scope.door.outtime = 30;
                    $scope.door.hostip = '';
                    $scope.door.roomnum = '';
                    $scope.door.syoufk = '';
                    $scope.door.syouname = '';
                    $scope.door.channeltype = 'io';
                    $scope.door.areafk = $scope.resultList[index].id;
                    $scope.door.cardtype = '';
                    $scope.door.doortype = '';
                    $scope.doorCancel = function() {

                        doorModal.close();
                    }

                    $scope.showOu = function() {
                        $('#syouTreeModel').show().addClass('in');
                        if (!$scope.ouTree) {
                            getOuList(function() {
                                initOuTree();
                            });
                        }
                    }

                    $scope.ouCancel = function() {
                        $('#syouTreeModel').hide().removeClass('in');
                    }

                    $scope.ouSave = function() {
                        $('#syouTreeModel').hide().removeClass('in');
                        var nodes = $scope.ouTree.getSelectedNodes();
                        if (nodes.length > 0) {
                            var node = nodes[0],
                                id = node.id,
                                name = node.name;

                            $scope.door.syoufk = id;
                            $scope.door.syouname = name;
                        }
                        else {
                            iMessage.show({
                                id: 'tree_select_error',
                                level: 3,
                                title: '所属部门',
                                content: '未选中单位'
                            });
                        }
                    }

                    $scope.doorSave = function() {
                        iAjax.post('door/doorset.do?action=saveDevice', {
                            areafk: $scope.door.areafk,
                            name: $scope.door.name,
                            ip: $scope.door.ip,
                            port: $scope.door.port,
                            vtype: $scope.door.vtype,
                            roletype: $scope.door.roletype,
                            outtime: $scope.door.outtime,
                            hostip: $scope.door.hostip,
                            syoufk: $scope.door.syoufk,
                            syouname: $scope.door.syouname,
                            roomnum: $scope.door.roomnum,
                            channeltype: $scope.door.channeltype,
                            cardtype: $scope.door.cardtype,
                            doortype: $scope.door.doortype,
                            isalarm: $scope.door.isalarm,
                            doorno: $scope.door.doorno,
                            doorsn: $scope.door.doorsn
                        }).then(function(data) {
                            if (data.status == '1') {
                                var id = data.result.id;
                                $scope.resultList[index].devices.push({
                                    id: id,
                                    areafk: $scope.door.areafk,
                                    name: $scope.door.name,
                                    ip: $scope.door.ip,
                                    port: $scope.door.port,
                                    vtype: $scope.door.vtype,
                                    roletype: $scope.door.roletype,
                                    outtime: $scope.door.outtime,
                                    hostip: $scope.door.hostip,
                                    syoufk: $scope.door.syoufk,
                                    syouname: $scope.door.syouname,
                                    roomnum: $scope.door.roomnum,
                                    channeltype: $scope.door.channeltype,
                                    select: false,
                                    cardtype: $scope.door.cardtype,
                                    doortype: $scope.door.doortype,
                                    isalarm: $scope.door.isalarm,
                                    doorno: $scope.door.doorno,
                                    doorsn: $scope.door.doorsn
                                });
                                doorModal.close();
                            }
                        }, function() {
                            iMessage.show({
                                id: 'door_sussess',
                                level: 3,
                                title: '提示',
                                timeout: 3,
                                content: '添加门禁失败，请检查网络'
                            });
                        });
                    }
                }],
                size: 'md'
            });
        }

        $scope.modDoor = function($event) {
            var self = $($event.target),
                index = self.closest('.ou-container').index(),
                rIndex = self.closest('.door-container').index();

            $scope.dialogType = 'mod';

            var doorModal = $uibModal.open({
                templateUrl: 'doorModalContent',
                appendTo: $('.page-content').eq(0),
                scope: $scope,
                controller: ['$scope', function($scope) {
                    var obj = $scope.resultList[index].devices[rIndex];

                    $scope.door = {};
                    $scope.door.id = obj.id;
                    $scope.door.name = obj.name;
                    $scope.door.ip = obj.ip;
                    $scope.door.port = obj.port;
                    $scope.door.vtype = obj.vtype;
                    $scope.door.roletype = obj.roletype;
                    $scope.door.outtime = obj.outtime;
                    $scope.door.hostip = obj.hostip;
                    $scope.door.syoufk = obj.syoufk;
                    $scope.door.syouname = obj.syouname;
                    $scope.door.roomnum = obj.roomnum;
                    $scope.door.channeltype = obj.channeltype;
                    $scope.door.areafk = $scope.resultList[index]['id'];
                    $scope.door.doortype = obj.doortype;
                    $scope.door.cardtype = obj.cardtype;
                    $scope.door.isalarm = obj.isalarm;
                    $scope.door.doorno = obj.doorno;
                    $scope.door.doorsn = obj.doorsn;
                    $scope.door.companycontent = obj.companycontent;

                    $scope.doorCancel = function() {
                        doorModal.close();
                    }

                    $scope.showOu = function() {
                        $('#syouTreeModel').show().addClass('in');
                        if (!$scope.ouTree) {
                            getOuList(function() {
                                initOuTree();
                            });
                        }
                    }

                    $scope.ouCancel = function() {
                        $('#syouTreeModel').hide().removeClass('in');
                    }

                    $scope.ouSave = function() {
                        $('#syouTreeModel').hide().removeClass('in');
                        var nodes = $scope.ouTree.getSelectedNodes();
                        if (nodes.length > 0) {
                            var node = nodes[0],
                                id = node.id,
                                name = node.name;

                            $scope.door.syoufk = id;
                            $scope.door.syouname = name;
                        }
                        else {
                            iMessage.show({
                                id: 'tree_select_error',
                                level: 3,
                                title: '所属部门',
                                content: '未选中单位'
                            });
                        }
                    }

                    $scope.doorSave = function() {
                        iAjax.post('door/doorset.do?action=saveDevice', {
                            areafk: $scope.door.areafk,
                            id: $scope.door.id,
                            name: $scope.door.name,
                            ip: $scope.door.ip,
                            port: $scope.door.port,
                            vtype: $scope.door.vtype,
                            roletype: $scope.door.roletype,
                            outtime: $scope.door.outtime,
                            hostip: $scope.door.hostip,
                            syoufk: $scope.door.syoufk,
                            syouname: $scope.door.syouname,
                            roomnum: $scope.door.roomnum,
                            channeltype: $scope.door.channeltype,
                            cardtype: $scope.door.cardtype,
                            doortype: $scope.door.doortype,
                            isalarm: $scope.door.isalarm,
                            doorno: $scope.door.doorno,
                            doorsn: $scope.door.doorsn
                        }).then(function(data) {
                            if (data.status == '1') {
                                iMessage.show({ //提示删除情况
                                    id: 'door_sussess',
                                    level: 1,
                                    title: '提示',
                                    content: '修改门禁成功'
                                });
                                doorModal.close();
                                getDoorSettingList();
                            }
                        }, function() {
                            iMessage.show({ //提示删除情况
                                id: 'door_sussess',
                                level: 3,
                                title: '提示',
                                timeout: 3,
                                content: '修改门禁失败，请检查网络'
                            });
                        });
                    }
                }],
                size: 'md'
            });
        }

        $scope.removeDoor = function($event) {
            $event.stopPropagation();
            //界面显示
            var self = $($event.target),
                index = self.closest('.ou-container').index(),
                rIndex = self.closest('.door-container').index();

            //提示删除
            iAjax.post('door/doorset.do?action=deleteDevice', {
                ids: [{
                    id: $scope.resultList[index].devices[rIndex]['id']
                }]
            }).then(function(data) {
                if (data.status == '1') {
                    $scope.resultList[index].devices.splice(rIndex, 1);
                }
            }, function() {
                iMessage.show({ //提示删除情况
                    id: 'door_sussess',
                    level: 3,
                    title: '提示',
                    timeout: 3,
                    content: '删除门禁失败，请检查网络'
                });
            });
        }

        $scope.removeBatchDoor = function() {

        }

        $scope.selectDoor = function($event) {
            var self = $($event.target),
                index = self.closest('.ou-container').index(),
                rIndex = self.closest('.door-container').index();

            $scope.resultList[index].devices[rIndex].select = $scope.resultList[index].devices[rIndex].select ? false : true;

            $event.stopImmediatePropagation();
        }

        var a = 0;
        $scope.syncDoor = function() {
            var doorList = setLoadingStart();
            iAjax.post('door/checkdoor.do?action=noticeDeviceGetData').then(function(data) {
                if (data.status == '1') {
                    iSocket.connect();
                    iSocket.on('syncNotice', function(data) {
                        try {
                            var doorfk = data.deviceid;
                            if (doorList[doorfk]) console.log(++a + ' ' + data.deviceid);
                            doorList[doorfk].syncLoading = false;
                        } catch (e) {
                            console.log(e.message);
                        }
                    });
                }
            }, function() {
                iMessage.show({ //提示删除情况
                    id: 'door_sussess',
                    level: 3,
                    title: '提示',
                    timeout: 3,
                    content: '同步失败，请检查网络'
                });
            });
        }
    }
    ]);
});