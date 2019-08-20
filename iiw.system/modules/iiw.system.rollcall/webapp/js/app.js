/**
 * 在线点名计划管理
 * Created by ZCL on 2016-03-26.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/rollcall/css/index.css',
    'safe/js/directives/safePicker',
    'safe/js/services/safeDesService',
    'safe/js/services/safeConfigService'
], function(app, angularAMD) {
    var packageName = 'iiw.system.rollcall';
    app.controller('rollcallController', [
        '$scope',
        '$state',
        'iAjax',
        'mainService',
        'iMessage',
        'safeConfigService',
        'iToken',
    function($scope, $state, iAjax, mainService, iMessage, safeConfigService, iToken) {
        mainService.moduleName = '定时计划';
        $scope.title = '在线点名';
        $scope.currentPage = 4;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.totalSize = 0;
        $scope.selectAll = false;
        $scope.modBtnFlag = true;
        $scope.delBtnFlag = true;
        $scope.confirmMessage = '确认删除已选择的记录吗？';
        $scope.showOneStep = true;
        $scope.deviceList = [];
        $scope.selectAllDevice = false;
        var configTerminalUrl = null;
        getConfigService();
        /**
         * 查询终端V2.0配置信息
         *
         * @author : ybw
         * @version : 1.0
         * @Date : 2017-05-12
         */
        function getConfigService() {
            safeConfigService.getTerminalConfig(function(data) {
                configTerminalUrl = data;
            })
        }

        /**
         * 模块加载完成事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.$on('rollcallControllerOnEvent', function() {
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
            getDispatcher();
            getSyouDeviceList();
        }

        /**
         * 添加在线点名计划
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.add = function() {
            $scope.showOneStep = true;
            $scope.deviceList = [];
            $scope.entityItem = {};
            $scope.entityItem.device = [];
            $state.go('system.rollcall.add');
        };

        /**
         * 修改在线点名计划
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.mod = function() {
            var nodes = _.where($scope.taskList, {checked: true});
            if (nodes.length > 1) {
                var message = {};
                message.level = 3;
                message.title = '消息提醒';
                message.content = '不能同时修改多条记录!';
                iMessage.show(message, false);
            } else if (nodes.length == 1) {
                $scope.entityItem = nodes[0];
                getSyouDeviceList();
                $state.go('system.rollcall.add');
            }
        };

        /**
         * 弹出删除计划提示框
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.delete = function() {
            $('.modal').modal();
        };

        /**
         * 确认删除计划
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.confirmDelete = function() {
            var nodes = _.where($scope.taskList, {checked: true});
            if (nodes.length > 0) {
                var ids = [];
                $.each(nodes, function(i, o) {
                    ids.push(o.id);
                });

                var data = {
                    id: ids
                };
                var url = '';

                if(configTerminalUrl) {
                    url = configTerminalUrl + 'terminal/system.do?action=deleteRollcallPlan&authorization=' + iToken.get();
                } else {
                    url = 'sys/web/Sydispatcher.do?action=delTask';
                }

                iAjax.post(url, data).then(function(data) {
                    if (data.status == '1') {
                        var message = {};
                        message.level = 1;
                        message.title = '消息提醒';
                        message.content = '删除成功!';
                        iMessage.show(message, false);
                        $state.go('system.rollcall');
                        init();
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
                });
            }
        }

        /**
         * 全选计划
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.selAll = function() {
            $scope.selectAll = !$scope.selectAll;
            $.each($scope.taskList, function(i, o) {
                o.checked = $scope.selectAll;
            });
            $scope.chooseRow();
        };

        /**
         * 取消修改或添加
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.cancel = function() {
            $state.go('system.rollcall');
        };

        /**
         * 修改按钮可用状态
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.checkBtnFlag = function() {
            var nodes = _.where($scope.taskList, {checked: true});
            if (nodes.length == 1) $scope.modBtnFlag = false;
            else $scope.modBtnFlag = true;

            if (nodes.length > 0) $scope.delBtnFlag = false;
            else $scope.delBtnFlag = true;
        };

        /**
         * 选择计划事件
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

        /**
         * 上一步
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.prevStep = function() {
            $scope.showOneStep = true;
        };

        /**
         * 下一步
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.nextStep = function() {
            $scope.showOneStep = false;
        };

        /**
         * 查询单位下的设备列表
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        function getSyouDeviceList() {

            if(!($scope.entityItem && $scope.entityItem.syoufk)) {
                return false;
            }

            var params = {
                filter: {
                    syoufk: $scope.entityItem.syoufk,
                    types: ['facediscern', 'fingerprint'],
                    cascade: 'Y'
                }
            },
            url = '';

            if(configTerminalUrl) {
                url = configTerminalUrl + 'terminal/system.do?action=getRollcallDeviceList&authorization=' + iToken.get();
            } else {
                url = 'security/common/monitor.do?action=getDeviceOuList'
            }

            iAjax.post(url, params).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.deviceList = data.result.rows;
                } else {
                    $scope.deviceList = [];
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
         * 切换单位后重新查询单位所属的设备信息
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.reloadDevice = function() {
            getSyouDeviceList();
        };

        /**
         *  设备全选/反选操作
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.selAllDevice = function() {
            $scope.selectAllDevice = !$scope.selectAllDevice;
            $.each($scope.deviceList, function(i, o) {
                o.checked = $scope.selectAllDevice;
                if (o.checked) $scope.entityItem.device = _.union($scope.entityItem.device, [o]);
                else $scope.entityItem.device = _.without($scope.entityItem.device, o);
            });
        };

        /**
         * 清除已选设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.removeAllSelect = function() {
            $scope.entityItem.device = [];
        };

        /**
         * 清除单个设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.removeSelect = function(row) {
            $scope.entityItem.device = _.without($scope.entityItem.device, row);
        };

        /**
         * 选择设备
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.chooseDevice = function(row) {
            if (row.checked) $scope.entityItem.device = _.union($scope.entityItem.device, [row]);
            else $scope.entityItem.device = _.without($scope.entityItem.device, row);
        };

        /**
         * 保存计划
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.save = function() {
            $scope.showOneStep = true;
            $scope.entityItem.etype = 'ROLLCALL';
            $scope.entityItem.type = 'cron';
            var url = '';
            if(configTerminalUrl) {
                url = configTerminalUrl + 'terminal/system.do?action=saveRollcallPlan&authorization=' + iToken.get();
            } else {
                url = 'sys/web/Sydispatcher.do?action=addTask';
            }

            var data = {
                row: $scope.entityItem
            };

            iAjax.post(url, data).then(function(data) {
                if (data.status == '1') {
                    var message = {};
                    message.level = 1;
                    message.title = '消息提醒';
                    message.content = '保存成功!';
                    iMessage.show(message, false);
                    $state.go('system.rollcall');
                    init();
                } else {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '保存失败!';
                    iMessage.show(message, false);
                }
            })
        };

        function getDispatcher() {
            var url = '';
            if(configTerminalUrl) {
                url = configTerminalUrl + 'terminal/system.do?action=getRollcallPlanList&authorization=' + iToken.get();
            } else {
                url = 'sys/web/Sydispatcher.do?action=getTask';
            }
            var data = {
                params: {
                    pageNo: $scope.currentPage,
                    pageSize: $scope.pageSize
                }
            };
            iAjax.post(url, data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.taskList = data.result.rows;
                    $scope.currentPage = data.result.params.pageNo;
                    $scope.totalPage = data.result.params.totalPage;
                    $scope.totalSize = data.result.params.totalSize;
                } else {
                    $scope.taskList = [];
                }
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        $scope.pageChanged = function() {
            $scope.currentPage = this.currentPage;
            getDispatcher();
        }
    }]);

    angularAMD.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('system.rollcall.add', {
            url: '/add',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        });
    }]);
});