/**
 * 预案管理
 * Created by ZCL on 2016-03-19.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/ycpreplan/css/index.css',
    'system/ycpreplan/js/directives/systemPreplanDeviceDialogDirective'
], function(app, angularAMD) {
    var packageName = 'iiw.system.ycpreplan';

    app.controller('ycpreplanController', ['$scope', '$state', 'iAjax', 'iTimeNow', 'mainService', 'iMessage', function($scope, $state, iAjax, iTimeNow, mainService, iMessage) {
        mainService.moduleName = '预案管理';
        $scope.showDeviceDialog = false;
        $scope.title = '应急预案';
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.types = [
            {name: '警力资源', type: 'police'},
            {name: '手持对讲', type: 'intercom'},
            {name: '固定电话', type: 'telephone'},
            {name: '监控资源', type: 'monitor'},
            {name: '门禁资源', type: 'door'},
            {name: '广播资源', type: 'broadcast'},
            {name: '对讲资源', type: 'talk'},
            {name: '报警资源', type: 'alarm'},
            {name: '值班班次', type: 'duty'}
        ];
        $scope.confirmMessage = '确认删除已选择的记录吗？';

        $scope.m_sCode = null;
        $scope.modBtnFlag = true;
        $scope.delBtnFlag = true;
        $scope.preplanTitle = '';
        $scope.search = {
            name: '',
            selectAll: false
        };

        /**
         * 模块加载完成事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-19
         */
        $scope.$on('ycpreplanControllerOnEvent', function() {
            $scope.init();
        });

        /**
         * 模块初始化
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-19
         */
        $scope.init = function() {
            getPreplanList();
            getEventType();
            getSyouList();
            getDoorAction();
            getBroadAction();
        };

        /**
         * 预案页码切换
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.pageChanged = function() {
            $scope.currentPage = this.currentPage;
            getPreplanList();
        };

        /**
         * 获取应急事件类型
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        function getEventType() {
            iAjax.post('security/preplan.do?action=getEventType').then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.eventList = data.result.rows;
                } else {
                    $scope.eventList = [];
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
         * 添加预案
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.add = function() {
            $scope.entityItem = {};
            $scope.m_sCode = null;
            $state.go('system.ycpreplan.mod');
        };

        /**
         * 查询预案信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        function getPreplanList() {
            var data = {
                params: {
                    pageNo: $scope.currentPage,
                    pageSize: $scope.pageSize
                },
                filter: {
                    name: $scope.search.name
                }
            };
            iAjax.post('security/preplan.do?action=getPreplanAll', data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.preplanList = data.result.rows;
                    $scope.currentPage = data.result.params.pageNo;
                    $scope.totalPage = data.result.params.totalPage;
                    $scope.totalSize = data.result.params.totalSize;
                    checkBtnFlag();
                } else {
                    $scope.preplanList = [];
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        function getSyouList() {
            iAjax.post('sys/web/syou.do?action=getSyouAll', {}).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.syouList = data.result.rows;
                } else {
                    $scope.syouList = [];
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        function getDoorAction() {
            var data = {
                filter: {
                    types: ['door']
                }
            };
            iAjax.post('security/device/device.do?action=getTypeActionList', data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.doorAction = data.result.rows[0];
                } else {
                    $scope.doorAction = [];
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        function getBroadAction() {
            var data = {
                filter: {
                    types: ['broadcast']
                }
            };
            iAjax.post('security/device/device.do?action=getTypeActionList', data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.broadAction = data.result.rows[0] ? data.result.rows[0].actions: null;
                } else {
                    $scope.broadAction = [];
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
         * 全选关联设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.selAll = function() {
            if ($scope.preplanList && $scope.preplanList.length > 0) {
                $.each($scope.preplanList, function(i, o) {
                    o.checked = $scope.search.selectAll;
                });
                checkBtnFlag();
            }
        };

        /**
         * 检测按钮状态
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        function checkBtnFlag() {
            var nodes = _.where($scope.preplanList, {checked: true});
            if (nodes.length == 1) $scope.modBtnFlag = false;
            else $scope.modBtnFlag = true;
            if (nodes.length > 0) $scope.delBtnFlag = false;
            else $scope.delBtnFlag = true;
        }

        /**
         * 修改预案
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.mod = function() {
            var nodes = _.where($scope.preplanList, {checked: true});
            if (nodes.length > 1) {
                var message = {};
                message.level = 3;
                message.title = '消息提醒';
                message.content = '不能同时修改多条记录!';
                iMessage.show(message, false);
            } else if (nodes.length == 1) {
                $scope.m_sCode = nodes[0].id;
                getPreplanDetail();
            }
        };

        function getPreplanDetail() {
            var data = {
                filter: {
                    id: $scope.m_sCode
                }
            };
            iAjax.post('security/preplan.do?action=getPreplanDetail', data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.entityItem = data.result.rows[0];
                    $state.go('system.ycpreplan.mod');
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        $scope.isNumber = function(e, row) {
            var keyCode = e.keyCode;
            if(!((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || (keyCode == 8))) {
                if(row.steptime) row.steptime = parseInt(row.steptime.toString().replace(/[^0-9]*/g, '').replace(/[' ']*/g, ''));
                e.preventDefault();
            } else {
                if(row.steptime) row.steptime = parseInt(row.steptime.toString().replace(/[^0-9]*/g, '').replace(/[' ']*/g, ''));
            }
        };

        /**
         * 预案选择事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-21
         */
        $scope.chooseRow = function() {
            checkBtnFlag();
        };

        $scope.delete = function() {
            $('.modal').modal();
        };

        $scope.confirmDelete = function() {
            var nodes = _.where($scope.preplanList, {checked: true});
            if (nodes.length > 0) {
                var ids = [];
                $.each(nodes, function(i, o) {
                    ids.push(o.id);
                });

                var data = {
                    id: ids
                };
                iAjax.post('security/preplan.do?action=delPreplan', data).then(function(data) {
                    if (data.status == '1') {
                        var message = {};
                        message.level = 1;
                        message.title = '消息提醒';
                        message.content = '删除成功!';
                        iMessage.show(message, false);
                        $state.go('system.ycpreplan');
                        $scope.init();
                        $scope.search.selectAll = false;
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
                });
            }
        };

        $scope.searchPreplan = function(event) {
            if (event.keyCode == 13) {
                getPreplanList();
            }
        };
    }]);

    app.controller('ycpreplanItemController', ['$scope', '$state', 'iAjax', 'iTimeNow', 'mainService', 'iMessage', '$filter', function($scope, $state, iAjax, iTimeNow, mainService, iMessage, $filter) {
        $scope.wizardIndex = 1;
        $scope.loadStatus = null;
        $scope.preplanItemList = {
            searchTitle: '',
            currentPage: 1,
            totalPage: 1,
            pageSize: 10
        };
        function init() {
            if (!$scope.m_sCode) {
                $scope.entityItem = {};
                $scope.entityItem.preplandtl = [
                    {id: '1'},
                    {id: '2'},
                    {id: '3'},
                    {id: '4'},
                    {id: '5'}
                ];
            } else if ($scope.entityItem.preplandtl && $scope.entityItem.preplandtl.length == 0) {
                $scope.entityItem.preplandtl = [
                    {id: '1'},
                    {id: '2'},
                    {id: '3'},
                    {id: '4'},
                    {id: '5'}
                ];
            }

            if (!$scope.entityItem.cretime)$scope.entityItem.cretime = $filter('date')((iTimeNow.getTime()), 'yyyy-MM-dd HH:mm');
            $scope.deviceType = $scope.types[0].type;
            $scope.preplanItemList.searchTitle = '';
            $scope.relateDevice = [];
            $scope.getDeviceByType();
        }

        $scope.hideModal = function() {
            $scope.deviceType = $scope.types[0].type;
            $scope.preplanItemList.searchTitle = '';
            $scope.showDeviceDialog = false;
        };

        $scope.searchDevice = function(row) {
            loadDevice(row);
        };

        function loadDevice(row) {
            if (row)$scope.deviceType = row.type;
            else $scope.deviceType = $scope.types[0].type;
            $scope.getDeviceByType();
        }

        $scope.enterSearch = function(event) {
            if (event.keyCode == 13) {
                $scope.getDeviceByType();
            }
        };

        $scope.getDeviceByType = function() {
            $scope.loadStatus = 'W';
            switch ($scope.deviceType) {
                case 'police':
                    searchPolice();
                    break;
                case 'telephone':
                    $scope.list = [];
                    searchTelephone();
                    break;
                case 'intercom':
                    $scope.list = [];
                    searchIntercom();
                    break;
                case 'duty':
                    $scope.list = [];
                    searchDutyNames();
                    break;
                default:
                    searchHardware();
                    break;
            }
        };

        function searchPolice() {
            var data = {
                params: {
                    pageNo: $scope.preplanItemList.currentPage,
                    pageSize: $scope.preplanItemList.pageSize
                },
                filter: $scope.preplanItemList.searchTitle
            };
            iAjax.post('security/information/information.do?action=getpoliceall', data).then(function(data) {
                if (data.result && data.result.rows) {
                    angular.forEach(data.result.rows, function(o) {
                        o.type = 'police';
                        o.actions = [{action: o.id}];
                    });
                    $scope.list = data.result.rows;
                    $scope.loadStatus = null;
                    if (data.result.params) {
                        $scope.preplanItemList.currentPage = data.result.params.pageNo;
                        $scope.preplanItemList.totalPage = data.result.params.totalPage;
                        $scope.preplanItemList.totalSize = data.result.params.totalSize;
                    }
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        function searchTelephone() {
            var data = {
                params: {
                    pageNo: $scope.preplanItemList.currentPage,
                    pageSize: $scope.preplanItemList.pageSize
                },
                filter: $scope.preplanItemList.searchTitle
            };
            iAjax.post('/security/preplan.do?action=getTelephone', data).then(function(data) {
                if (data.result && data.result.rows) {
                    angular.forEach(data.result.rows, function(o) {
                        o.type = 'telephone';
                        o.actions = [{action: o.id}];
                    });
                    $scope.loadStatus = null;
                    $scope.list = data.result.rows;
                    if (data.result.params) {
                        $scope.preplanItemList.currentPage = data.result.params.pageNo;
                        $scope.preplanItemList.totalPage = data.result.params.totalPage;
                        $scope.preplanItemList.totalSize = data.result.params.totalSize;
                    }
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        function searchIntercom() {
            var data = {
                params: {
                    pageNo: $scope.preplanItemList.currentPage,
                    pageSize: $scope.preplanItemList.pageSize
                },
                filter: $scope.preplanItemList.searchTitle
            };
            iAjax.post('/security/preplan.do?action=getInterphone', data).then(function(data) {
                if (data.result && data.result.rows) {
                    angular.forEach(data.result.rows, function(o) {
                        o.type = 'interphone';
                        o.actions = [{action: o.id}];
                    });
                    $scope.loadStatus = null;
                    $scope.list = data.result.rows;
                    if (data.result.params) {
                        $scope.preplanItemList.currentPage = data.result.params.pageNo;
                        $scope.preplanItemList.totalPage = data.result.params.totalPage;
                        $scope.preplanItemList.totalSize = data.result.params.totalSize;
                    }
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        function searchHardware() {
            var data = {
                params: {
                    pageNo: $scope.preplanItemList.currentPage,
                    pageSize: $scope.preplanItemList.pageSize
                },
                filter: {
                    searchText: $scope.preplanItemList.searchTitle,
                    type: $scope.deviceType,
                    action: 'y'
                }
            };
            iAjax.post('security/device.do?action=getDevice', data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.loadStatus = null;
                    $scope.list = data.result.rows;
                    $scope.preplanItemList.currentPage = data.result.params.pageNo;
                    $scope.preplanItemList.totalPage = data.result.params.totalPage;
                    $scope.preplanItemList.totalSize = data.result.params.totalSize;
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        $scope.chooseDevice = function(row) {
            var device = _.where($scope.currentStep.dispatchdevice, {device: row.id});
            if (device.length == 0) {
                var node = {};
                node.device = row.id;
                node.devicename = row.name;
                node.deviceip = row.ip;
                node.devicetype = row.type;
                node.devicecomm = row.actions ? row.actions[0].action : '';
                node.actions = row.actions ? row.actions : '';
                node.syouname = row.syouname;
                if ($scope.currentStep.dispatchdevice) {
                    $scope.currentStep.dispatchdevice.push(node);
                } else {
                    $scope.currentStep.dispatchdevice = [];
                    $scope.currentStep.dispatchdevice.push(node);
                }
            }
        };

        $scope.previous = function() {
            $scope.wizardIndex = 1;
        };

        $scope.next = function() {
            $scope.wizardIndex = 2;
        };

        $scope.removeSelect = function(row) {
            $scope.currentStep.dispatchdevice = _.filter($scope.currentStep.dispatchdevice, function(o) {
                return row.device != o.device
            });
        };

        $scope.clean = function() {
            $scope.currentStep.dispatchdevice = [];
        };

        $scope.setDevice = function(row) {
            loadDevice();
            $scope.currentStep = row;
            $scope.deviceType = $scope.types[0].type;
            $scope.searchTitle = '';
            $scope.showDeviceDialog = true;
        };

        $scope.addStep = function(index) {
            var stepOne = _.first($scope.entityItem.preplandtl, [index + 1]);
            var id = parseInt(Math.random() * 10000);
            var newStep = {id: id, name: ''};
            var stepTwo = _.rest($scope.entityItem.preplandtl, [index + 1]);
            stepOne.push(newStep);
            $scope.entityItem.preplandtl = _.union(stepOne, stepTwo);
        };

        $scope.removeStep = function(row) {
            if ($scope.entityItem.preplandtl.length > 1) {
                $scope.entityItem.preplandtl = _.filter($scope.entityItem.preplandtl, function(obj) {
                    return obj.id != row.id;
                });
            } else {
                var message = {};
                message.level = 3;
                message.title = '消息提醒';
                message.content = '预案执行步骤不能为空!';
                iMessage.show(message, false);
            }
        };

        $scope.save = function() {
            var data = {
                row: $scope.entityItem
            };
            iAjax.post('security/preplan.do?action=savePreplan', data).then(function(data) {
                if (data.status == '1') {
                    var message = {};
                    message.level = 1;
                    message.title = '消息提醒';
                    message.content = '保存成功!';
                    iMessage.show(message, false);
                    $state.go('system.ycpreplan');
                    $scope.init();
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        };

        $scope.cancel = function() {
            $state.go('system.ycpreplan');
            $scope.init();
        };

        $scope.showStepDevices = function(row) {
            $scope.currentStep = row;
        };

        function searchDutyNames() {
            iAjax.post('security/map/map.do?action=getPoliceTypeList').then(function(data) {
                if (data.result && data.result.rows) {
                    $.each(data.result.rows, function(i,o) {
                        if(o.cascade != 'Y') {
                            o.type = 'duty';
                            o.actions = [{action: o.id}];
                            $scope.list.push(o);
                        }
                    });
                    $scope.loadStatus = null;
                    if (data.result.params) {
                        $scope.preplanItemList.currentPage = data.result.params.pageNo;
                        $scope.preplanItemList.totalPage = data.result.params.totalPage;
                        $scope.preplanItemList.totalSize = data.result.params.totalSize;
                    } else {
                        $scope.preplanItemList.currentPage = 1;
                        $scope.preplanItemList.totalPage = 1;
                        $scope.preplanItemList.totalSize = 1;
                    }
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        init();
    }]);

    angularAMD.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('system.ycpreplan.mod', {
            url: '/mod',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html',
            controller: 'ycpreplanItemController'
        });
    }]);
});