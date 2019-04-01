/**
 * 数据编辑
 * @author : Zjs
 * @version : 1.0
 * @date : 2019-08-16
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/syedit/css/index.css',
], function (app, angularAMD) {
    var packageName = 'iiw.system.syedit';
    app.controller('syeditController', ['$scope', '$state', 'iAjax', 'mainService', 'iMessage', 'iConfirm', 'iTimeNow', function ($scope, $state, iAjax, mainService, iMessage, iConfirm, iTimeNow) {


        //模块加载完成后
        $scope.$on('$stateChangeSuccess', function () {
            $scope.syedit.getList()
        });
        $scope.sysetList = [];
        $scope.sorter = {
            totalSize: 0,
            currentPage: 1,
            pageSize: 10
        };
        //页数
        $scope.pageChanged = function () {
            $scope.sorter.currentPage = this.sorter.currentPage;
            $scope.syedit.getList()
        };
        $scope.syedit = {
            switchCode: '选择',
            paramsC: true,
            searchText: '',
            selectAll: false,   // 全选框
            select: function (item, event) {
                if (event && (event.target.tagName == 'INPUT' || event.target.tagName == 'BUTTON' )) {
                    return;
                } else {
                    item.checked = !item.checked;
                }
            },
            selAll: function () {
                $.each($scope.sysetList, function (i, o) {
                    o.checked = $scope.syedit.selectAll;
                });
            },

            add: function () {
                var params = {
                    data: ''
                };
                $state.params = params;
                $state.go('system.syedit.add', params);
            },

            mod: function () {
                var aSelect = _.where($scope.sysetList, {checked: true});
                if (aSelect.length) {
                    if (aSelect.length > 1) {
                        showMessage(3, '不能同时修改多条信息，请重新选择!');
                    } else {
                        var params = {
                            data: aSelect[0]
                        };
                        $state.params = params;
                        $state.go('system.syedit.add', params);
                    }
                } else {
                    showMessage(3, '请选择一条数据进行修改!');
                }
            },

            del: function () {
                var aSelect = _.where($scope.sysetList, {checked: true});
                if (aSelect.length) {
                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '共选择' + aSelect.length + '条数据',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'syedit.delConfirm'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'syedit.confirmClose'
                        }]
                    });
                } else {
                    showMessage(3, '请选择一条以上的数据进行删除!')
                }
            },

            delConfirm: function (id) {
                iConfirm.close(id);
                var aSelect = _.filter($scope.sysetList, {checked: true});
                //删除请求
                var url = '/sys/web/CommonController.do?action=dealSysetting',
                    data = {
                        filter: {
                            dealtype: 'del',
                            ids: []
                        }
                    };

                if (aSelect.length > 0) {
                    $.each(aSelect, function (i, o) {
                        data.filter.ids.push(o.id);
                    });
                    // console.log(data)
                    iAjax.post(url, data).then(function (data) {
                        if (data.status == 1) {
                            showMessage(1, '删除成功!');
                        }
                        $scope.syedit.getList();
                    }, function (data) {
                        showMessage(4, '删除失败!');
                    });
                }
            },

            confirmClose: function (id) {
                iConfirm.close(id);
                return true;
            },
            //列表请求
            getList: function () {
                iAjax.post('/sys/web/CommonController.do?action=getSysettinglist', {
                    filter: $scope.syedit.searchText,
                    params:{
                        pageNo: $scope.sorter.currentPage,
                        pageSize:$scope.sorter.pageSize
                    }
                }).then(function (data) {
                    $scope.sysetList = data.result.rows;
                    $scope.sorter.currentPage = data.result.params.pageNo;//当前页
                    $scope.sorter.pageSize = data.result.params.pageSize;//每页总数
                    $scope.sorter.totalPage = data.result.params.totalPage;//总页数
                    $scope.sorter.totalSize = data.result.params.totalSize;//总条数
                }, function (data) {
                   // console.log(data)
                })
            },


        };

        function showMessage(level, content, title) {
            var message = {
                id: iTimeNow.getTime(),
                title: ( title || '消息提醒！'),
                level: level,
                content: ( content || '')
            };
            iMessage.show(message, false);
        }

    }]);
    //添加模块
    app.controller('syeditAddController', [
        '$scope',
        '$state',
        'iAjax',
        'iMessage',
        'iTimeNow',
        function ($scope, $state, iAjax, iMessage, iTimeNow) {

            $scope.editItem = {};
            //参数接收
            $scope.$on('$stateChangeSuccess', function () {
                if ($state.params) {
                    $scope.editItem = $state.params.data;
                } else {
                    $scope.editItem = {};
                }

            });
            $scope.save = function () {
                // console.log($scope.editItem);
                // console.log($scope.oldItemList);
                if($scope.oldItemList){
                    $scope.editItem.params=[];
                    _.each($scope.oldItemList,function (z) {
                        $scope.editItem.params.push(z.id);
                    })
                }
                if($scope.initParams){
                    $scope.editItem.params.push($scope.initParams)
                }
                // console.log($scope.editItem.params);
                var url = '/sys/web/CommonController.do?action=dealSysetting';
                if ($scope.editItem.id) {
                    var data = {
                        dealtype: "mod",
                        type: $scope.editItem.type,
                        name: $scope.editItem.name,
                        url: $scope.editItem.url,
                        username: $scope.editItem.username ? $scope.editItem.username : '',
                        password: $scope.editItem.password ? $scope.editItem.password : '',
                        params: $scope.editItem.params?$scope.editItem.params:'',
                        id: $scope.editItem.id,
                    }
                } else {
                    var data = {
                        dealtype: "add",
                        type: $scope.editItem.type,
                        name: $scope.editItem.name,
                        url: $scope.editItem.url,
                        username: $scope.editItem.username ? $scope.editItem.username : '',
                        password: $scope.editItem.password ? $scope.editItem.password : '',
                        params: $scope.editItem.params?$scope.editItem.params:'',
                    }
                }
                if ($scope.editItem.username) {

                    if ($scope.editItem.password) {
                        iAjax.post(url, {
                            filter: data
                        }).then(function (data) {
                            if (data.status) {
                                showMessage(1, '操作成功')
                            }
                            $state.go('system.syedit')
                        }, function (data) {
                            // console.log(data)
                        })
                    } else {
                        showMessage(4, '请输入密码')
                    }

                }else {
                    data.password = '';
                    iAjax.post(url, {
                        filter: data
                    }).then(function (data) {
                        if (data.status) {
                            showMessage(1, '操作成功')
                        }
                        $state.go('system.syedit')
                    }, function (data) {
                        // console.log(data)
                    })
                }

            };

            $scope.syParams = {
                selectAll: false,   // 全选框
                select: function (item, event) {
                    if (event && (event.target.tagName == 'INPUT' || event.target.tagName == 'BUTTON' )) {
                        return;
                    } else {
                        item.checked = !item.checked;
                        _.each($scope.newItemList, function (o) {
                            if (!item.checked) {
                                if (o.id == item.id) {
                                    o.checked = item.checked
                                }
                            }
                        })
                        if ($scope.newItemList.indexOf(item) > -1) {
                        } else {
                            $scope.newItemList.push(item)
                        }
                    }
                },
                selAll: function () {
                    $.each($scope.paramAllList.itemList, function (i, o) {
                        o.checked = $scope.syParams.selectAll;
                    });
                },
            };
            $scope.initParams = '';
            $scope.paramAllList = {
                searchText: '',
                pageNo: 1,
                pageSize: 10,
                totalPage: 1,
                totalSize: 10,
                itemList: {} //渲染列表
            };

            $scope.newItemList = []; //已勾选选项
            $scope.oldItemList = [];
            $scope.getListType = '';
            $scope.getUserList = function (type) {
                // console.log(type)
                if (type == 'getSyouAll') {
                    var url = 'sys/web/syou.do?action=getSyouAll';
                    $scope.getListType = 'getSyouAll'
                } else {
                    var url = 'sys/web/syuser.do?action=getSyuserAll';
                    $scope.getListType = 'getSyuserAll'
                }
                var params = {
                    pageNO: $scope.paramAllList.pageNo,
                    pageSize: $scope.paramAllList.pageSize
                }
                iAjax.post(url, {
                    filter: {
                        searchText: $scope.paramAllList.searchText
                    },
                    params: params
                }).then(function (data) {
                    $scope.paramAllList.pageNo = data.result.params.pageNo;//当前页
                    $scope.paramAllList.pageSize = data.result.params.pageSize;//每页总数
                    $scope.paramAllList.totalPage = data.result.params.totalPage;//总页数
                    $scope.paramAllList.totalSize = data.result.params.totalSize;//总条数
                    _.each(data.result.rows, function (o) {
                        _.each($scope.oldItemList, function (z) {
                            if (o.id === z.id) {
                                o.checked = z.checked;
                            }
                        })
                    })
                    $scope.paramAllList.itemList = data.result.rows;

                })
            }
            $scope.getUserList('getSyuserAll')
            $scope.pageChanged = function () {
                if ($scope.getListType == 'getSyuserAll') {
                    $scope.getUserList('getSyuserAll');
                } else {
                    $scope.getUserList('getSyouAll');
                }
                $scope.oldItemList = _.filter($scope.newItemList, {checked: true});

            }
            $scope.searchList = function () {
                if ($scope.getListType == 'getSyuserAll') {
                    $scope.getUserList('getSyuserAll');
                } else {
                    $scope.getUserList('getSyouAll');
                }
            }
            /**
             * 返回上一级
             * @author : zjs
             * @version : 1.0
             * @date : 2019-08-20
             */
            $scope.back = function () {
                $state.go('system.syedit');
            };

            $scope.paramAllList = {

                switchOver: function () {
                    $scope.syedit.paramsC = !$scope.syedit.paramsC;
                    if (!$scope.syedit.paramsC) {
                        $scope.syedit.switchCode = '返回';
                    } else {
                        $scope.syedit.switchCode = '选择';

                    }

                    $scope.oldItemList = _.filter($scope.newItemList, {checked: true});
                },
                removeParams: function (item, idx) {

                    $scope.oldItemList[idx].checked = false;
                    $scope.oldItemList.splice(idx, 1);
                    $scope.getUserList('getSyuserAll');
                    $scope.getUserList('getSyouAll')
                }

            };

            /**
             * 统一的信息提示
             * @author : zjs
             * @version : 1.0
             * @date : 2019-08-20
             */
            function showMessage(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: ( title || '消息提醒！'),
                    level: level,
                    content: ( content || '')
                };
                iMessage.show(message, false);
            }
        }

    ]);

    angularAMD.config(function ($stateProvider) {
        $stateProvider
            .state('system.syedit.add', {
                url: '/add',
                controller: 'syeditAddController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
            });
    });
});