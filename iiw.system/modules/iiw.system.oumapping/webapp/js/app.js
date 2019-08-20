/**
 * 单位映射
 * @author : zhs
 * @version : 1.0
 * @date : 2018-07-23
*/
define([
    'app',
    'angularAMD',
    'system/js/directives/systemTreeViewDirective',
    'cssloader!system/oumapping/css/index.css'

], function(app, angularAMD) {
    var packageName = 'iiw.system.oumapping';

    app.controller('oumappingController', [
        '$scope',
        '$state',
        'iAjax',
        'iMessage',
        'iConfirm',
        'iTimeNow',

        function($scope, $state, iAjax, iMessage, iConfirm, iTimeNow) {
            $scope.title = '单位映射';

            /**
             * 分页信息
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
            */
            $scope.pages = {
                pageNo: 1,
                pageSize: 10,
                totalPage: 1,
                totalSize: 0
            }

            /**
             * 过滤条件
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-24
            */
            $scope.filter = {
                type: '',
                text: ''
            }

            $scope.oumappingList = [];

            $scope.$on('$stateChangeSuccess', function() {
                init()
            });

            $scope.oumapping = {
                selectAll: false,   // 全选框
                select: function(item, event) {
                    if(event && (event.target.tagName == 'INPUT' || event.target.tagName == 'BUTTON' )) {
                        return;
                    } else {
                        item.checked = !item.checked;
                    }
                },
                selAll: function() {
                    $.each($scope.oumappingList, function(i, o) {
                        o.checked = $scope.oumapping.selectAll;
                    });
                },
                add: function() {
                    $state.go('system.oumapping.add');
                },
                mod: function() {
                    var aSelect = _.where($scope.oumappingList, {checked: true});
                    if(aSelect.length) {
                        if(aSelect.length > 1) {
                            showMessage(3, '不能同时修改多条信息，请重新选择!');
                        } else {
                            var params = {
                                data: aSelect[0]
                            }
                            $state.params = params;
                            $state.go('system.oumapping.add', params);
                        }
                    } else{
                        showMessage(3, '请选择一条数据进行修改!');
                    }
                },
                del: function() {
                    var aSelect = _.where($scope.oumappingList, {checked: true});
                    if (aSelect.length) {
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '共选择' + aSelect.length + '条数据',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'oumapping.delConfirm'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'oumapping.confirmClose'
                            }]
                        });
                    } else {
                        showMessage(3, '请选择一条以上的数据进行删除!')
                    }
                },
                delConfirm: function(id) {
                    iConfirm.close(id);
                    var aSelect = _.filter($scope.oumappingList, {checked: true});

                    var url = '/sys/web/syou.do?action=delOuMap',
                        data = {
                            row: {
                                id: []
                            }
                        };

                    if (aSelect.length > 0) {
                        $.each(aSelect, function(i, o) {
                            data.row.id.push(o.id);
                        });
                        iAjax.post(url, data).then(function(data) {
                            if(data.status == 1) {
                                showMessage(1, '删除成功!');
                            }
                            getOumappingList();
                        });
                    }
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                }
            };

            /**
             * 初始化操作
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
            */
            function init() {
                $scope.search();
            }

            /**
             * 页码改变
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
            */
            $scope.pageChanged = function() {
                getOumappingList();
            }

            $scope.search = function(event) {
                if((event && event.keyCode == 13) || !event) {
                    $scope.pages.pageNo = 1;
                    getOumappingList();
                }
            }

            /**
             * 获取已有同步单位数据
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
            */
            function getOumappingList() {
                var url = '/sys/web/syou.do?action=getOuMap',
                    data = {
                        params: {
                            pageNo: $scope.pages.pageNo,
                            pageSize: $scope.pages.pageSize
                        },
                        filter: {}
                    };

                if($scope.filter.type) {
                    data.filter.type = $scope.filter.type;
                }

                if($scope.filter.text) {
                    data.filter.searchText = $scope.filter.text;
                }

                iAjax.post(url, data).then(function(data) {
                    if(data.result.rows) {
                        $scope.oumappingList = data.result.rows;
                    }

                    if(data.result.params) {
                        $scope.pages.totalPage = data.result.params.totalPage;
                        $scope.pages.totalSize = data.result.params.totalSize;
                    }
                }, function() {
                    showMessage(4, '网络连接失败!');
                });
            }

            /**
             * 统一的消息提示
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
             */
            function showMessage(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title:( title || '消息提醒！'),
                    level: level,
                    content: ( content || '')
                };
                iMessage.show(message, false);
            }
        }
    ]);

    app.controller('oumappingAddController', [
        '$scope',
        '$state',
        '$stateParams',
        'iAjax',
        'iMessage',
        'iTimeNow',

        function($scope, $state, $stateParams, iAjax, iMessage, iTimeNow) {

            $scope.types = [{
                name: '罪犯', tag: 'criminal'
            }, {
                name: '干警', tag: 'police'
            }];

            $scope.$on('$stateChangeSuccess', function() {
                if($stateParams.data) {
                    $scope.mapping.obj = $stateParams.data;
                } else {
                    $scope.mapping.obj = {};
                }
            });

            /**
             * 单位明细
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
            */
            $scope.mapping = {
                obj: {},
                modal: {
                    show: function() {
                        $('#ouTreeModal').modal();
                    },
                    close: function() {
                        $('#ouTreeModal').modal('hide');
                    }
                },
                selectOu: function() {
                    $scope.mapping.obj.syoufk = $scope.ou.id;
                },
                save: function() {
                    var url = '';

                    if($scope.mapping.obj.id) {
                        url = '/sys/web/syou.do?action=modOuMap';
                    } else {
                        url = '/sys/web/syou.do?action=addOuMap';
                    }

                    iAjax.post(url, {
                        row: $scope.mapping.obj
                    }).then(function(data) {
                         if(data.status == 1) {
                             showMessage(1, data.message);
                             $scope.back();
                         }
                    }, function(error) {
                        showMessage(4, '网络连接出错！');
                    });
                }
            }

            /**
             * 树节点点击事件
             * @author : zhs
             * @version : 1.0
             * @Date : 2018-07-23
             */
            $scope.selectEvent = function(treeNode) {
                $scope.mapping.obj.name = treeNode.name;
            }

            /**
             * 获取所有单位
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
            */
            function getOuList() {
                iAjax.post('sys/web/syou.do?action=getSyouAll').then(function (data) {
                    if (data.result && data.result.rows) {
                        $scope.treeNodes = {
                            zNodes: data.result.rows
                        }

                        $scope.$broadcast('initTree', $scope.treeNodes);
                    }
                });
            }
            getOuList();

            /**
             * 返回上一级页面
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
            */
            $scope.back = function() {
                $state.go('system.oumapping');
            }

            /**
             * 统一的消息提示
             * @author : zhs
             * @version : 1.0
             * @date : 2018-07-23
             */
            function showMessage(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title:( title || '消息提醒！'),
                    level: level,
                    content: ( content || '')
                };
                iMessage.show(message, false);
            }
        }
    ]);

    angularAMD.config(function($stateProvider) {
        $stateProvider
            .state('system.oumapping.add', {
                url: '/add',
                controller: 'oumappingAddController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
            });
    });
});
