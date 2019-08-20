/**
 * 预警管理模块
 *
 * Created by llx on 2015-10-27.
 */
define([
    'app',
    'system/monitorpatrol/item/js/directives/monitorpatroltree',
    'cssloader!system/announcement/css/index.css'
], function(app) {

    app.controller('announcementController', [
        '$scope',
        '$state',
        'mainService',
        'iAjax',
        'iMessage',
        'iConfirm',

        function($scope, $state, mainService, iAjax, iMessage, iConfirm) {
            mainService.moduleName = '预警信息';

            $scope.title = '预警信息管理';
            $scope.announcement = {
                list: [],
                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10,
                filterValue: '',
                bSelectAll: false,
                selectAll: function() {
                    _.each($scope.announcement.list, function(item) {
                        item.checked = $scope.announcement.bSelectAll;
                    });
                },
                select: function(item, event) {
                    if (event && event.target.tagName == 'INPUT') {
                        return;
                    }
                    item.checked = !item.checked;
                },
                getSelect: function() {
                    return _.filter($scope.announcement.list, {checked: true});
                },
                pageChange: function() {
                    $scope.announcement.bSelectAll = false;
                    $scope.announcement.currentPage = this.currentPage;
                    getList();
                },

                getListByKeybroad: function(event) {
                    if (event.keyCode == 13) {
                        getList();
                    }
                },

                gotoItem: function(item, type) {
                    var params = {
                        data: {
                            item: item,
                            type: type
                        }
                    };
                    $state.params = params;
                    $state.go('system.announcement.item', params);
                },
                addAnnouncement: function() {
                    this.gotoItem({}, 'add');
                },
                modAnnouncement: function() {
                    var aSelect = $scope.announcement.getSelect();
                    if (aSelect.length > 1) {
                        showMessage(3, '用户查看不能同时查看两条预警信息！');
                    } else if (aSelect.length == 1) {
                        this.gotoItem(aSelect[0], 'mod');
                    } else {
                        showMessage(3, '请选择一条查询的预警信息！');
                    }
                },
                delAnnouncement: function() {
                    var aSelect = $scope.announcement.getSelect(),
                        aName = [];

                    if (aSelect.length > 0) {
                        aName = aSelect.map(function(select, i) {
                            return ( i + 1 + '、' + select.title);
                        });

                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '共选择' + aSelect.length + '条数据，分别为：<br>' + aName.join('<br>'),
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'announcement.confirmDelRole'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'announcement.confirmClose'
                            }]
                        });

                    } else {
                        showMessage(3, '请选择一条或以上的数据进行删除！');
                    }
                },
                confirmDelRole: function(id) {
                    iConfirm.close(id);

                    var aSelect = $scope.announcement.getSelect();
                    if (aSelect.length > 0) {
                        var aId = _.map(aSelect, function(select) {
                            return select.id;
                        });

                        delAnnouncement(aId, function() {
                            showMessage(1, '删除成功！');
                            if ($scope.announcement.list.length == aId.length && $scope.announcement.currentPage > 1) {
                                $scope.announcement.currentPage -= 1;
                            }

                            getList();
                        });
                    }
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                }
            };

            $scope.init = function() {
                getList();
            };

            $scope.init();

            function getList() {
                var data = {
                    filter: {
                        searchText: $scope.announcement.filterValue
                    },
                    params: {
                        pageNo: $scope.announcement.currentPage,
                        pageSize: $scope.announcement.pageSize
                    }
                };
                iAjax
                    .post('/information/report/report.do?action=getNoticeInfo', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.announcement.list = data.result.rows;
                        } else {
                            $scope.announcement.list = [];
                        }
                        if (data.result.params) {
                            var params = data.result.params;
                            $scope.announcement.totalSize = params.totalSize;
                            $scope.announcement.pageSize = params.pageSize;
                            $scope.announcement.totalPage = params.totalPage;
                            $scope.announcement.currentPage = params.pageNo;
                        }
                    })
            }

            function delAnnouncement(ids, cb) {
                iAjax
                    .post('information/report/report.do?action=delNoticeInfo', {
                        ids: ids
                    })
                    .then(function(data) {
                        if (data && data.status == '1') {
                            if (cb && typeof(cb) === 'function') {
                                cb();
                            }
                        }
                    });
            }

            function showMessage(level, content) {
                var message = {};
                message.level = level;
                message.content = content;
                message.title = $scope.title;
                iMessage.show(message, false);
            }
        }
    ]);
});