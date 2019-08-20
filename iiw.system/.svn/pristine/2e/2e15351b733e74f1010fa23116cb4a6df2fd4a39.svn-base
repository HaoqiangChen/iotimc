/**
 * 定时任务管理模块
 *
 * Created by llx on 2016-12-30.
 */

define([
    'app',
    'cssloader!system/dispatcher/css/index.css',
    'system/dispatcher/js/filter/filterService',
    'system/dispatcher/js/filter/filterServiceName',
    'system/dispatcher/js/filter/filterTime',
    'system/dispatcher/js/filter/filterYear'

], function(app) {
    app.controller('systemDispatcherController', [
        '$scope',
        '$state',
        'iConfirm',
        'iAjax',
        'iMessage',

        function($scope, $state, iConfirm, iAjax, iMessage) {
            $scope.title = '定时任务管理';
            $scope.dispatcherList = [];
            $scope.selectLength = true;
            $scope.dispatcher = {
                currentPage: 1,
                totalPage: 1,
                totalSize: 0,
                pageSize: 10,
                searchText: '',
                aSelectAll: false,
                select: function(item) {
                    item.checked = !item.checked;
                    var aSelect = _.where($scope.dispatcherList, {checked: true});
                    if (aSelect.length > 1) {
                        $scope.selectLength = true;
                    } else if (aSelect.length == 0) {
                        $scope.selectLength = true;
                    } else {
                        $scope.selectLength = false;
                    }
                },
                selectAll: function() {
                    $.each($scope.dispatcherList, function(i, o) {
                        o.checked = $scope.dispatcher.aSelectAll;
                    })
                },
                addRole: function() {
                    var params = {
                        data: {
                            item: '',
                            type: 'add'
                        }
                    };
                    $state.go('system.dispatcher.item', params);
                },
                modRole: function() {
                    var aSelect = _.where($scope.dispatcherList, {checked: true});
                    var params = {
                        data: {
                            item: aSelect,
                            type: 'mod'
                        }
                    };
                    $state.go('system.dispatcher.item', params);
                },
                delRole: function() {
                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '删除信息后将无法还原，是否确认删除？',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'confirmDel'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'confirmClose'
                        }]
                    })
                },
                change: function() {
                    getList();
                },
                getList: function() {
                    getList();
                }
            };

            $scope.confirmClose = function(id) {
                iConfirm.close(id);
                return true;
            };

            $scope.confirmDel = function(id) {
                iConfirm.close(id);
                var list = [];
                var bSelect = _.where($scope.dispatcherList, {checked: true});
                $.each(bSelect, function(i, item) {
                    list.push(item.id)
                });
                var data = {
                    ids: list
                };
                iAjax
                    .post('sys/web/Sydispatcher.do?action=delSydispatcher', data)
                    .then(function(data) {
                        if (data.status == 1) {
                            showMessage(1, '删除成功!');
                            $scope.init();
                        }
                    })
            };

            $scope.init = function() {
                getList();
            };

            $scope.init();

            function getList() {
                var data = {
                    searchText: $scope.dispatcher.searchText,
                    params: {
                        pageNo: $scope.dispatcher.currentPage,
                        pageSize: $scope.dispatcher.pageSize
                    }
                };
                iAjax
                    .post('sys/web/Sydispatcher.do?action=getSydispatcher', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.dispatcherList = data.result.rows;
                            $.each($scope.dispatcherList, function(i, item) {
                                if (item.year == '*') {
                                    item.year = '每'
                                }
                                if (item.month == '*') {
                                    item.month = '每'
                                }
                                if (item.day == '*' || item.day == 0 || item.day == '?') {
                                    item.day = '每'
                                }
                                if (item.week == '?') {
                                    item.week = '每'
                                }
                                if (item.repeattime == 0 || item.repeattime == '0') {
                                    item.repeattime = '重复'
                                }
                                if (item.second == '*') {
                                    item.second = '每'
                                }
                                if (item.hour == '*') {
                                    item.hour = '每'
                                }
                                if (item.minute == '*') {
                                    item.minute = '每'
                                }
                            })
                        }
                        if (data.result && data.result.params) {
                            $scope.dispatcher.currentPage = data.result.params.pageNo;
                            $scope.dispatcher.totalSize = data.result.params.totalSize;
                            $scope.dispatcher.totalPage = data.result.params.totalPage;
                            $scope.dispatcher.pageSize = data.result.params.pageSize;
                        }
                    })
            }

            function showMessage(level, content) {
                var message = {};
                message.id = new Date();
                message.title = $scope.title;
                message.level = level;
                message.content = content;
                iMessage.show(message)
            }
        }
    ])
});
