/**
 * 硬件关联
 * Created by ZCL in 2016-03-16.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/hardwarerelate/css/index.css',
    'system/hardwarerelate/js/directives/systemDeviceIconDirective'
], function(app, angularAMD) {
    var packageName = 'iiw.system.hardwarerelate';

    app.controller('hardwarerelateController', ['$scope', '$state', 'iAjax', 'iMessage', 'mainService', 'iTimeNow', '$location', function($scope, $state, iAjax, iMessage, mainService, iTimeNow, $location) {

        $scope.title = '硬件关联';
        mainService.moduleName = '设备管理';
        $scope.companyList = [];
        $scope.listFilter = {
            type: '',
            searchText: '',
            related: '',
            company: ''
        };

        $scope.mainFilter = {
            type: '',
            searchText: '',
            selectMainAll: false
        };

        $scope.relatedFilter = {
            type: '',
            searchText: '',
            selectRelateAll: false
        };

        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.countInfo = {totalSize: 0, yes: 0, no: 0};
        $scope.mainType = '';
        $scope.relateType = '';

        $scope.mainCurrentPage = 1;
        $scope.mainTotalPage = 1;

        $scope.relateCurrentPage = 1;
        $scope.relateTotalPage = 1;

        /**
         * 模块加载完成后事件
         *
         */
        $scope.$on('hardwarerelateControllerOnEvent', function() {
            $scope.mainDevice = [];
            $scope.relateDevice = [];
            getHardwareRelate();
            getDeviceType();
            $scope.filterMainDevice();
            $scope.filterRelateDevice();
        });

        /**
         * 查询设备信息
         *
         */
        function getHardwareRelate() {
            var url, data;
            url = '/security/hardwarerelated.do?action=getHardwarefind';
            data = {
                params: {
                    pageNo: $scope.currentPage,
                    pageSize: $scope.pageSize
                },
                filter: $scope.listFilter
            };

            iAjax.post(url, data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.countInfo.yes = data.result.rows.yes;
                    $scope.countInfo.no = data.result.rows.no;
                    $scope.countInfo.totalSize = data.result.params.totalSize;
                    $scope.list = data.result.rows.value;
                } else {
                    $scope.list = [];
                    $scope.countInfo = {total: 0, yes: 0, no: 0};
                }
                if (data.result.params) {
                    var params = data.result.params;
                    $scope.totalSize = params.totalSize;
                    $scope.pageSize = params.pageSize;
                    $scope.totalPage = params.totalPage;
                    $scope.currentPage = params.pageNo;
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        /**
         * 查询设备类型数据
         *
         */
        function getDeviceType() {
            var url = '/security/deviceCode.do?action=getDevicecodeType';
            iAjax.post(url).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.deviceTypeList = data.result.rows;
                } else {
                    $scope.deviceTypeList = [];
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        /**
         * 点击分页页码后页面跳转事件
         *
         */
        $scope.pageChanged = function() {
            $scope.currentPage = this.currentPage;
            getHardwareRelate();
        };

        /**
         * 根据设备类型查询设备信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.filterDevice = function(data) {
            if(data) {
                $scope.companyList = _.where($scope.deviceTypeList, {content: data})[0].child;
            }
            getHardwareRelate();
        };

        /**
         * 搜索设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.search = function() {
            getHardwareRelate();
        };

        /**
         * 根据设备类型查询设备信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.getDeviceListByType = function() {
            var url, data;
            url = '/security/device.do?action=getDevice';
            data = {
                params: {
                    pageNo: $scope.currentPage,
                    pageSize: $scope.pageSize
                },
                filter: {
                    type: $scope.deviceType
                }
            };
            iAjax.post(url, data).then(function(data) {
                if (data.result && data.result.rows) {
                    if (data.status == '1') {
                        $scope.list = data.result.rows;
                    } else {
                        $scope.list = [];
                    }
                }
                if (data.result.params) {
                    var params = data.result.params;
                    $scope.totalSize = params.totalSize;
                    $scope.pageSize = params.pageSize;
                    $scope.totalPage = params.totalPage;
                    $scope.currentPage = params.pageNo;
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        /**
         * 设备选中事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.chooseRow = function(row) {
            var matchRows = _.where($scope.list, {checked: true});
            if (matchRows.length > 0) {
                $.each(matchRows, function(i, o) {
                    o.checked = false;
                });
            }
            row.checked = true;
            $scope.mainDevice = [row];
            $scope.relateDevice = row.minordevice ? row.minordevice : [];
        };

        /**
         * 配置设备关联
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.config = function() {
            reset();
            $state.go('system.hardwarerelate.mod');
        };

        /**
         * 根据联动设备信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.filterMainDevice = function() {
            var url, data;
            url = '/security/hardwarerelated.do?action=getHardwarefind';
            data = {
                params: {
                    pageNo: $scope.mainCurrentPage,
                    pageSize: $scope.pageSize
                },
                filter: $scope.mainFilter
            };

            iAjax.post(url, data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.mainDeviceList = data.result.rows.value;
                } else {
                    $scope.mainDeviceList = [];
                }

                if (data.result.params) {
                    var params = data.result.params;
                    $scope.mainTotalSize = params.totalSize;
                    $scope.pageSize = params.pageSize;
                    $scope.mainTotalPage = params.totalPage;
                    $scope.mainCurrentPage = params.pageNo;
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        };

        /**
         * 查询关联设备信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.filterRelateDevice = function() {
            var url, data;
            url = '/security/hardwarerelated.do?action=getHardwarefind';
            data = {
                params: {
                    pageNo: $scope.relateCurrentPage,
                    pageSize: $scope.pageSize
                },
                filter: $scope.relatedFilter
            };

            iAjax.post(url, data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.relateDeviceList = data.result.rows.value;
                } else {
                    $scope.relateDeviceList = [];
                }

                if (data.result.params) {
                    var params = data.result.params;
                    $scope.relateTotalSize = params.totalSize;
                    $scope.pageSize = params.pageSize;
                    $scope.relateTotalPage = params.totalPage;
                    $scope.relateCurrentPage = params.pageNo;
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        };

        /**
         * 搜索设备信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.searchDevice = function(flag) {
            $scope.mainFilter.selectMainAll = false;
            $scope.relatedFilter.selectRelateAll = false;
            if (flag == 'main') {
                $scope.filterMainDevice();
            } else if (flag == 'relate') {
                $scope.filterRelateDevice();
            }
        };

        /**
         * 设备分页跳转事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.pageOnChanged = function(flag) {
            if (flag == 'main') {
                $scope.mainCurrentPage = this.mainCurrentPage;
                $scope.filterMainDevice();
            } else if (flag == 'relate') {
                $scope.relateCurrentPage = this.relateCurrentPage;
                $scope.filterRelateDevice();
            }
        };

        /**
         * 添加联动设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.addDevice = function(row, flag) {
            if (row.checked) {
                var nodes = _.where($scope.mainDevice, {id: row.id});
                if (nodes.length > 0) {
                    var message = {};
                    message.level = 3;
                    message.title = '消息提醒';
                    message.content = '该设备已添加至关联设备中，不能重复添加!';
                    iMessage.show(message, false);
                    return;
                }

                var relateNodes = _.where($scope.relateDevice, {id: row.id});
                if (relateNodes.length > 0) {
                    var message = {};
                    message.level = 3;
                    message.title = '消息提醒';
                    message.content = '该设备已添加至联动设备中，不能重复添加!';
                    iMessage.show(message, false);
                    return;
                }

                if (flag == 'main') {
                    $scope.mainDevice.push(row);
                    getRelateDevice(row);
                } else {
                    $scope.relateDevice.push(row);
                }
            } else {
                if (flag == 'main') {
                    $scope.mainDevice = _.without($scope.mainDevice, row);
                    getRelateDevice(row);
                } else {
                    $scope.relateDevice = _.without($scope.relateDevice, row);
                }
            }
        };

        function getRelateDevice(row) {
            var checkRow = row;
            var url, data;
            url = 'security/device.do?action=getDeviceRelatedList';
            data = {
                filter: {
                    id: checkRow.id
                }
            };

            iAjax.post(url, data).then(function(data) {
                if (data.result && data.result.rows) {
                    var result = data.result.rows;
                    $.each(result, function(i, o) {
                        if (checkRow.checked) {
                            var nodes = _.where($scope.relateDevice, {id: o.id});
                            if (nodes.length == 0) {
                                $scope.relateDevice.push(o);
                            }
                        } else {
                            $scope.relateDevice = _.filter($scope.relateDevice, function(obj) {
                                return obj.id != o.id;
                            });
                        }
                    });
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        /**
         * 移除关联设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.removeMainDevice = function(row) {
            row.checked = false;
            getRelateDevice(row);
            $scope.mainDevice = _.without($scope.mainDevice, row);
        };

        /**
         * 移除联动设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.removeRelateDevice = function(row) {
            $scope.relateDevice = _.without($scope.relateDevice, row);
        };

        /**
         * 清除关联设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.cleanMainDevice = function() {
            $.each($scope.mainDevice, function(i, o) {
                o.checked = false;
                getRelateDevice(o);
            });
            $scope.mainDevice = [];
        };

        /**
         * 清除联动设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.cleanRelateDevice = function() {
            $scope.relateDevice = [];
        };

        /**
         * 返回
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.back = function() {
            reset();
            $scope.cleanMainDevice();
            $scope.cleanRelateDevice();
            getHardwareRelate();
            $location.path('/system/hardwarerelate');
        };

        /**
         * 重置相关参数信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        function reset() {
            $scope.mainCurrentPage = 1;
            $scope.mainTotalPage = 1;

            $scope.relateCurrentPage = 1;
            $scope.relateTotalPage = 1;
        }

        /**
         * 全选关联设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.selAllMainService = function() {
            $.each($scope.mainDeviceList, function(i, o) {
                var mainNodes = _.where($scope.mainDevice, {id: o.id});
                if ($scope.mainFilter.selectMainAll) {
                    if (mainNodes.length == 0) {
                        getRelateDevice(o);
                        $scope.mainDevice.push(o);
                    }
                } else {
                    mainNodes = _.where($scope.mainDevice, {id: o.id});
                    if (mainNodes.length > 0) {
                        getRelateDevice(o);
                        $scope.mainDevice = _.without($scope.mainDevice, o);
                    }
                }
                o.checked = $scope.mainFilter.selectMainAll;
            });
        };

        /**
         * 全选联动设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.selAllRelateService = function() {
            $.each($scope.relateDeviceList, function(i, o) {
                var relateNodes = _.where($scope.relateDevice, {id: o.id});
                if ($scope.relatedFilter.selectRelateAll) {
                    if (relateNodes.length == 0) {
                        $scope.relateDevice.push(o);
                    }
                } else {
                    if (relateNodes.length > 0) {
                        $scope.relateDevice = _.without($scope.relateDevice, o);
                    }
                }
                o.checked = $scope.relatedFilter.selectRelateAll;
            });
        };

        /**
         * 保存设备联动信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.save = function() {
            var mainIDs = [];
            $.each($scope.mainDevice, function(i, o) {
                mainIDs.push(o.id);
            });

            var relateIDs = [];
            $.each($scope.relateDevice, function(i, o) {
                relateIDs.push(o.id);
            });

            var url, data;
            url = 'security/device.do?action=addDeviceRelated';
            data = {
                filter: {
                    maindeviceid: mainIDs,
                    minordeviceid: relateIDs
                }
            };

            iAjax.post(url, data).then(function(data) {
                if (data.result.rows) {
                    var message = {};
                    message.level = 1;
                    message.title = '消息提醒';
                    message.content = '提交成功!';
                    iMessage.show(message, false);

                    reset();
                    $scope.mainDevice = [];
                    $scope.relateDevice = [];
                } else {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '保存记录失败!';
                    iMessage.show(message, false);
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        };
    }]);

    // 模块内部路由
    angularAMD.config(function($stateProvider) {
        $stateProvider.state('system.hardwarerelate.add', {
            url: '/add',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        }).state('system.hardwarerelate.mod', {
            url: '/mod',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        });
    });
});