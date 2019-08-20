/**
 * Created by dwt on 2016-03-14.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/syrole/css/index.css'

], function(app) {

    app.controller('syroleController', [
        '$scope',
        '$state',
        '$window',
        '$location',
        'iAjax',
        'iMessage',
        'mainService',
        'iConfirm',

        function($scope, $state, $window, $location, iAjax, iMessage, mainService, iConfirm) {

            mainService.moduleName = '系统基础设置';
            $scope.title = '权限管理-列表';

            $scope.role = {
                list: [],
                statusList: {'P': '启用', 'C': '禁用', 'L': '系统预设'},

                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10,
                filterValue: '',

                bSelectAll: false,
                selectAll: function() {
                    _.each($scope.role.list, function(item) {
                        item.checked = $scope.role.bSelectAll;
                    });
                },
                select: function(item, event) {
                    if(event && event.target.tagName == 'INPUT') {
                        return;
                    }
                    item.checked = !item.checked;
                },
                getSelect: function() {
                    return _.filter($scope.role.list, {checked: true});
                },
                getAvailableSelect: function() {
                    return _.filter($scope.role.list, function(item) {
                        return item.checked && item.status != 'L';
                    });
                },
                addRole: function() {
                    this.gotoItem({}, 'add');
                },
                modRole: function() {
                    var aSelect = $scope.role.getSelect();

                    if(aSelect.length == 1) {
                        this.gotoItem(aSelect[0], 'mod');
                    } else {
                        var message = {};
                        message.level = 3;
                        message.title = $scope.title;
                        message.content = '请选择单条数据进行修改！';
                        iMessage.show(message, false);
                    }

                },
                delRole: function() {
                    var aSelect = $scope.role.getAvailableSelect(),
                        aName = [];

                    if(aSelect.length > 0) {

                        aName = aSelect.map(function(select, i) {
                            return ( i + 1 + '、' + select.name);
                        });

                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '共选择' + aSelect.length + '条数据，分别为：<br>' + aName.join('<br>'),
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'role.confirmDelRole'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'role.confirmClose'
                            }]
                        });

                    } else {
                        var message = {};
                        message.level = 3;
                        message.title = $scope.title;
                        message.content = '请选择一条或以上状态不为【系统锁定】的数据进行删除！';
                        iMessage.show(message, false);
                    }

                },
                confirmDelRole: function(id) {
                    iConfirm.close(id);

                    var aSelect = $scope.role.getAvailableSelect();
                    if(aSelect.length > 0) {
                        var aId = _.map(aSelect, function(select) {
                            return select.id;
                        });

                        delRole(aId, function() {
                            var message = {};
                            message.level = 1;
                            message.title = $scope.title;
                            message.content = '删除成功！';
                            iMessage.show(message, false);

                            if($scope.role.list.length == aId.length && $scope.role.currentPage > 1) {
                                $scope.role.currentPage -= 1;
                            }

                            $scope.role.getList();
                        });
                    }
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                },
                gotoItem: function(role, type) {
                    var params = {
                        data: {
                            item: role,
                            type: type
                        }
                    };
                    $state.params = params;
                    $state.go('system.syrole.item', params);
                },

                change: function() {
                    $scope.role.bSelectAll = false;
                    $scope.role.currentPage = this.currentPage;
                    $scope.role.getList();
                },
                getListByKeybroad: function(event) {
                    if(event.keyCode == 13) {
                        $scope.role.getList();
                    }
                },
                getList: function() {
                    var that = this,
                        pageNo = this.currentPage,
                        pageSize = this.pageSize,
                        searchText = this.filterValue;

                    this.list = [];
                    getList(pageNo, pageSize, searchText, function(list, params) {
                        that.list = list;

                        that.totalSize = params.totalSize;
                        that.pageSize = params.pageSize;
                        that.totalPage = params.totalPage;
                        that.currentPage = params.pageNo;
                    });
                }
            };

            function getList(pageNo, pageSize, searchText, cb) {
                iAjax
                    .post('sys/web/role.do?action=getSyroleAll', {
                        params: {
                            pageNo: pageNo,
                            pageSize: pageSize
                        },
                        filter: {
                            searchText: searchText
                        }
                    })
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            if(cb && typeof(cb) === 'function') {
                                cb(data.result.rows, data.result.params);
                            }
                        }
                    });
            }

            function delRole(ids, cb) {
                iAjax
                    .post('sys/web/role.do?action=delSyrole', {
                        id: ids
                    })
                    .then(function(data) {
                        if(data && data.status == '1') {
                            if(cb && typeof(cb) === 'function') {
                                cb();
                            }
                        }
                    });
            }

            $scope.init = function() {
                $scope.role.getList();
            };
            $scope.init();

        }
    ]);

});