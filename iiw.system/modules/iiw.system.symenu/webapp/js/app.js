/**
 * Created by ZCL on 2016-03-26.
 */
define([
    'app',
    'cssloader!system/symenu/css/index.css',
    'system/js/directives/systemTreeViewDirective'
], function(app) {
    app.controller('symenuController', ['$scope', '$state', 'iAjax', 'mainService', 'iMessage', '$filter', function($scope, $state, iAjax, mainService, iMessage, $filter) {
        mainService.moduleName = '系统基础设置';
        $scope.title = '菜单管理';
        var currentNode;
        $scope.m_sCode = null;
        $scope.m_sMode = 'view';

        $scope.$on('symenuControllerOnEvent', function() {
            init();
        });

        function init() {
            $scope.reset();
            iAjax.post('sys/web/menu.do?action=getmenu').then(function(data) {
                if (data.result.rows && data.result.rows.length > 0) {
                    $scope.treeNodes = {
                        zNodes: data.result.rows
                    };
                } else {
                    $scope.treeNodes = {
                        zNodes: []
                    };
                }
                $scope.$broadcast('initTree', $scope.treeNodes);
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '网络连接失败!';
                iMessage.show(message, false);
            });
        }

        /**
         * 树节点点击事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-15
         */
        $scope.selectEvent = function(treeNode) {
            $scope.entityItem = treeNode;
            $scope.entityItem.url = treeNode.menuUrl;
            $scope.entityItem.icon = treeNode.menuIcon;
            currentNode = treeNode;
            var parentNode = treeNode.getParentNode();
            if (parentNode) {
                $scope.entityItem.parentcode = parentNode.code ? parentNode.code : '0';
                $scope.entityItem.parentname = parentNode.name ? parentNode.name : '设备编码';
                parentNode = null;
            } else {
                $scope.entityItem.parentcode = '0';
                $scope.entityItem.parentname = '设备编码';
            }
        };

        /**
         * 添加设备编码
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-15
         */
        $scope.add = function() {
            $scope.m_sMode = 'add';
            $scope.m_sCode = '';
            $scope.entityItem = {};
            $scope.entityItem.primaryid = '1';
            if (currentNode) {
                $scope.entityItem.parentname = currentNode.name;
                $scope.entityItem.parentid = currentNode.id;
                $scope.entityItem.parentcode = currentNode.code;
                $scope.entityItem.code = currentNode.code + (currentNode.children.length + 1);
                $scope.entityItem.type = currentNode.content;
                $scope.entityItem.content = '';
                $scope.entityItem.status = 'P';
                $scope.entityItem.levels = (parseInt(currentNode.levels) + 1).toString();
                $scope.entityItem.type = currentNode.type;
            } else {
                $scope.entityItem.parentname = '设备编码';
                $scope.entityItem.parentcode = '00';
                $scope.entityItem.parentid = null;
                $scope.entityItem.code = '9999999';
                $scope.entityItem.status = 'P';
            }
        };

        /**
         * 保存设备编码
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-15
         */
        $scope.save = function() {
            var aSelect = [];
            $.each($scope.treeNodes.zNodes, function (i, item) {
                if(item.code == $scope.entityItem.code) {
                    aSelect.push(item)
                }
            });
            if(aSelect.length && !$scope.m_sCode) {
                iMessage.show({
                    level: 4,
                    title: '菜单管理',
                    content: '菜单编号:' + $scope.entityItem.code + '已存在,请确认后在进行保存!'
                });
            } else {
                var url;
                if ($scope.m_sCode) {
                    url = 'sys/web/menu.do?action=upSymenu';
                } else {
                    url = 'sys/web/menu.do?action=addSymenu';
                }

                var data = {
                    row: $scope.entityItem
                };

                iAjax.post(url, data).then(function() {
                    iMessage.show({
                        level: 1,
                        title: '菜单' + ($scope.m_sCode ? '修改' : '新增'),
                        content: '成功'
                    });
                    init();
                }, function() {
                    iMessage.show({
                        level: 1,
                        title: '菜单' + ($scope.m_sCode ? '修改' : '新增'),
                        content: '失败'
                    });
                });
            }
        };

        /**
         * 修改设备编码
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-15
         */
        $scope.mod = function() {
            $scope.m_sMode = 'mod';
            $scope.m_sCode = currentNode.id;
            $scope.entityItem = {};
            $scope.entityItem.primaryid = currentNode.id;
            var parentNode = currentNode.getParentNode();
            if (currentNode) {
                $scope.entityItem.parentname = parentNode ? parentNode.name : '设备编码';
                $scope.entityItem.parentid = parentNode ? parentNode.id : '';
                $scope.entityItem.parentcode = parentNode ? parentNode.code : '0';
                $scope.entityItem.code = currentNode.code;
                $scope.entityItem.type = currentNode.type;
                $scope.entityItem.status = currentNode.status;
                $scope.entityItem.content = currentNode.content;
                $scope.entityItem.name = currentNode.name;
                $scope.entityItem.icon = currentNode.menuIcon;
                $scope.entityItem.url = currentNode.menuUrl;
                $scope.entityItem.levels = currentNode.levels;
                $scope.entityItem.id = currentNode.id;
            }
        };

        /**
         * 删除设备编码
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-15
         */
        $scope.delete = function() {
            if ($scope.entityItem.children) {
                $scope.confirmMessage = '是否删除该记录以及该记录下所有的子节点？';
                $('.modal').modal();
            } else {
                // var data = {
                //     id: [$scope.entityItem.id]
                // };
                // deleteRecord(data);
                $scope.confirmMessage = '是否删除该菜单？';
                $('.modal').modal();
            }
        };

        $scope.reset = function() {
            $scope.m_sMode = 'view';
            currentNode = null;
            $scope.m_sCode = null;
            $scope.entityItem = null;
        };

        function deleteRecord(data) {
            iAjax.post('sys/web/menu.do?action=delSymenu', data).then(function() {
                var message = {};
                message.level = 1;
                message.title = '消息提醒';
                message.content = '删除菜单成功!';
                iMessage.show(message, false);
                init();
            }, function() {
                var message = {};
                message.level = 4;
                message.title = '消息提醒';
                message.content = '删除菜单失败!';
                iMessage.show(message, false);
            });
        }

        $scope.confirm = function() {
            var data = {
                id: [$scope.entityItem.id]
            };
            deleteRecord(data);
        };

        $scope.cancel = function() {
            $scope.m_sMode = 'view';
        };
    }]);
});