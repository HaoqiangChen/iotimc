/**
 * Created by ZCL on 2016-03-26.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/daily/css/index.css',
    'safe/js/directives/safePicker'
], function(app, angularAMD) {
    var packageName = 'iiw.system.daily';
    app.controller('dailyController', ['$scope', '$state', 'iAjax', 'iTimeNow', 'mainService', 'iMessage', function($scope, $state, iAjax, iTimeNow, mainService, iMessage) {
        mainService.moduleName = '罪犯日常事务';
        $scope.title = '罪犯日常事务';
        $scope.page = {currentPage: 1, totalPage: 1, totalSize: 0, pageSize: 10};
        $scope.selectAll = false;
        $scope.modBtnFlag = true;
        $scope.delBtnFlag = true;
        $scope.confirmMessage = '确认删除已选择的记录吗？';
        $scope.showOneStep = true;
        $scope.filter = {searchText: ''};
        $scope.weekShow = false;

        /**
         * 模块加载完成事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.$on('dailyControllerOnEvent', function() {
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
                    pageNo: $scope.page.currentPage,
                    pageSize: $scope.page.pageSize
                },
                filter: {
                    title: $scope.filter.searchText
                }
            };
            iAjax.post('iotiead/dailyaffair.do?action=getDailyaffairList', data).then(function(data) {
                if (data.result && data.result.rows) {
                    $scope.list = data.result.rows;
                    $scope.page.currentPage = data.result.params.pageNo;
                    $scope.page.totalPage = data.result.params.totalPage;
                    $scope.page.totalSize = data.result.params.totalSize;
                } else {
                    $scope.list = [];
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
         * 添加日常事务
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.add = function() {
            $scope.entityItem = {};
            $state.go('system.daily.add');
        };

        /**
         * 修改日常事务
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.mod = function() {
            var nodes = _.where($scope.list, {checked: true});
            if (nodes.length == 1) {
                $scope.entityItem = nodes[0];
                $state.go('system.daily.add');
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
            $('.modal').modal();
        };

        /**
         * 确认删除
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.confirmDelete = function() {
            var nodes = _.where($scope.list, {checked: true});
            if (nodes.length > 0) {
                var ids = [];
                $.each(nodes, function(i, o) {
                    ids.push({id: o.id});
                });

                var data = {
                    ids: ids
                };
                iAjax.post('iotiead/dailyaffair.do?action=deleteDailyaffair', data).then(function(data) {
                    if (data.status == '1') {
                        var message = {};
                        message.level = 1;
                        message.title = '消息提醒';
                        message.content = '删除成功!';
                        iMessage.show(message, false);
                        init();
                    } else {
                        var message = {};
                        message.level = 4;
                        message.title = '消息提醒';
                        message.content = '删除失败!';
                        iMessage.show(message, false);
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
         * 全选/反选事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-04-01
         */
        $scope.selAll = function() {
            $scope.selectAll = !$scope.selectAll;
            $.each($scope.list, function(i, o) {
                o.checked = $scope.selectAll;
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
            $state.go('system.daily');
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
            if (nodes.length == 1) $scope.modBtnFlag = false;
            else $scope.modBtnFlag = true;

            if (nodes.length > 0) $scope.delBtnFlag = false;
            else $scope.delBtnFlag = true;
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

        $scope.pageChanged = function() {
            $scope.page.currentPage = this.page.currentPage;
            getList();
        };

        $scope.search = function(event) {
            if (event.keyCode == 13) {
                getList();
            }
        };

        $scope.save = function() {
            var url = 'iotiead/dailyaffair.do?action=saveDailyaffair';
            var data = $scope.entityItem;
            iAjax.post(url, data).then(function(data) {
                if (data.status == '1') {
                    var message = {};
                    message.level = 1;
                    message.title = '消息提醒';
                    message.content = '保存成功!';
                    iMessage.show(message, false);
                    init();
                    $scope.cancel();
                } else {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '保存失败!';
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

    angularAMD.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('system.daily.add', {
            url: '/add',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        });
    }]);
});