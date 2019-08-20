/**
 * 预警管理模块-添加
 *
 * Created by llx on 2015-10-27.
 */
define([
    'app',
    'cssloader!system/announcement/item/css/index.css'
], function(app) {
    app.controller('announcementItemController', [
        '$scope',
        '$state',
        '$stateParams',
        '$uibModal',
        'iAjax',
        'iMessage',
        'iTimeNow',

        function($scope, $state, $stateParams, $uibModal, iAjax, iMessage, iTimeNow) {
            var cacheUserTreeList = [];

            var item, type;
            $scope.item = {};
            if($stateParams.data) {
                item = $stateParams.data.item;
                type = $stateParams.data.type;

                $scope.item = item;
            }

            $scope.syusername = '';
            $scope.syuser = [];
            $scope.type = type;
            if(type == 'add') {
                $scope.title = '预警信息管理-添加';
            } else {
                $scope.title = '预警信息管理-查看';
                $scope.syuser = item.syuser.map(function(o) {
                    return o.syuserfk;
                });
                $scope.syusername = item.syuser.map(function(o) {
                    return o.name;
                }).join('、');
            }

            $scope.announcementItem = {
                list: [],
                save: function() {
                    var data = {
                        title: $scope.item.title,
                        content: $scope.item.content,
                        syuser: $scope.syuser.map(function(o) {
                            return o.id;
                        })
                    };
                    iAjax
                        .post('/information/report/report.do?action=updateNoticeInfo', data)
                        .then(function(data) {
                            if(data.status == '1') {
                                var message = {};
                                message.id = iTimeNow.getTime();
                                message.level = 1;
                                message.title = $scope.title;
                                message.content = '发布成功!';
                                iMessage.show(message, false);
                                $state.go('system.announcement');
                                getList();
                            }
                        })
                },
                userTree: {
                    show: function() {
                        getSyuserTree(function(list) {
                            var modalInstance = $uibModal.open({
                                templateUrl: 'userTreeDialog.html',
                                controller: 'userTreeController',
                                size: '',
                                resolve: {
                                    items: function() {
                                        return list
                                    },
                                    initItems: function() {
                                        return ($scope.syuser.map(function(o) {
                                            return o.id;
                                        }) || []);
                                    }
                                }
                            });
                            modalInstance.result.then(function(list) {
                                if(list.length) {
                                    $scope.syuser = list;
                                    $scope.syusername = list.map(function(o) {
                                        return o.name;
                                    }).join('、');
                                }
                            });
                        })
                    }
                }
            };

            $scope.back = function() {
                $state.go('system.announcement')
            };

            function getList() {
                var data = {
                    params: {
                        pageNo: $scope.announcement.currentPage,
                        pageSize: $scope.announcement.pageSize
                    }
                };
                iAjax
                    .post('/information/report/report.do?action=getNoticeInfo', data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.announcement.list = data.result.rows;
                        } else {
                            $scope.announcement.list = [];
                        }
                        if(data.result.params) {
                            var params = data.result.params;
                            $scope.announcement.totalSize = params.totalSize;
                            $scope.announcement.pageSize = params.pageSize;
                            $scope.announcement.totalPage = params.totalPage;
                            $scope.announcement.currentPage = params.pageNo;
                        }
                    })
            }

            function getData(url, data, cb) {
                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            if(cb && typeof(cb) === 'function') {
                                cb(data.result.rows);
                            }
                        }
                    });
            }

            function getSyuserTree(cb) {
                if(cacheUserTreeList.length > 0) {
                    if(cb && typeof(cb) === 'function') {
                        cb(cacheUserTreeList);
                    }
                } else {
                    getData('sys/web/syou.do?action=getSyouAll', {}, function(ouList) {
                        getData('sys/web/syuser.do?action=getSyuserAll', {}, function(userList) {

                            $.each(userList, function(i, o) {
                                o['isUser'] = true;
                                o['iconSkin'] = 'userIcon';
                            });

                            $.each(ouList, function(i, o) {
                                o['isOu'] = true;
                                o['iconSkin'] = 'ouIcon';
                                cacheUserTreeList.push(o);
                                cacheUserTreeList = cacheUserTreeList.concat(_.filter(userList, {syoufk: o.id}));
                            });

                            if(cb && typeof(cb) === 'function') {
                                cb(cacheUserTreeList);
                            }
                        });
                    });
                }
            }
        }
    ]);
    app.controller('userTreeController', [
        '$scope',
        '$uibModalInstance',
        'items',
        'initItems',

        function($scope, $uibModalInstance, items, initItems) {
            if(items && items.length > 0) {
                var index;
                $.each(items, function(i, o) {
                    if(o.checked) {
                        o.checked = false;
                    }
                });
                $.each(initItems, function(i, id) {
                    index = _.findIndex(items, {id: id});
                    if(index > -1) {
                        items[index].checked = true;
                    }
                });
            }
            $scope.userTree = {
                setting: {
                    check: {
                        enable: true
                    },
                    data: {
                        key: {
                            title: 't'
                        },
                        simpleData: {
                            enable: true
                        }
                    }
                },
                tree: {
                    treeNodes: items
                }
            };

            $scope.ok = function() {
                var list = [];
                var nodes = $scope.userTree.oNode.getCheckedNodes();
                $.each(nodes, function(i, o) {
                    if(o.checked && o['isUser']) {
                        list.push({
                            id: o.id,
                            name: o.name
                        });
                    }
                });

                $uibModalInstance.close(list);
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);
});