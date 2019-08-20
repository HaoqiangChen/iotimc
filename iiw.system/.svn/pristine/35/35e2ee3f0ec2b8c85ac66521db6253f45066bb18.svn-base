/**
 * 基础编码管理
 * Created by ZCL on 2016-03-26.
 */
define([
    'app',
    'cssloader!system/sycode/css/index.css',
    'system/js/directives/systemTreeViewDirective'
], function(app) {
    app.controller('sycodeController', ['$scope', '$state', 'iAjax', 'mainService', 'iMessage', 'iConfirm', function($scope, $state, iAjax, mainService, iMessage, iConfirm) {
        mainService.moduleName = '系统基础设置';
        $scope.title = '系统字典';
        var currentNode;
        $scope.m_sCode = null;
        $scope.m_sMode = 'view';

        $scope.$on('sycodeControllerOnEvent', function() {
            init();
        });

        function init() {
            $scope.reset();
            iAjax.post('sys/web/sycode.do?action=getSycode').then(function(data) {
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
                $scope.entityItem.code = currentNode.code + '000' +(currentNode.children.length + 1);
                $scope.entityItem.type = currentNode.content;
                $scope.entityItem.content = '';
                $scope.entityItem.status = 'P';
            } else {
                $scope.entityItem.parentname = '设备编码';
                $scope.entityItem.parentcode = '00';
                $scope.entityItem.parentid = null;
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
                    content: '字典编号:' + $scope.entityItem.code + '已存在,请确认后在进行保存!'
                });
            } else {
                var url;
                if ($scope.m_sCode) {
                    url = 'sys/web/sycode.do?action=upSycode';
                } else {
                    url = 'sys/web/sycode.do?action=addSycode';
                }

                var data = {
                    row: $scope.entityItem
                };

                iAjax.post(url, data).then(function() {
                    var message = {};
                    message.level = 1;
                    message.title = '消息提醒';
                    message.content = '提交成功!';
                    iMessage.show(message, false);
                    init();
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
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
                $scope.entityItem.type = currentNode.type;
                $scope.entityItem.status = currentNode.status;
                $scope.entityItem.content = currentNode.content;
                $scope.entityItem.code = currentNode.code;
                $scope.entityItem.name = currentNode.name;
                $scope.entityItem.id = currentNode.id;
                $scope.entityItem.notes = currentNode.notes;
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
            var content = '';
            if ($scope.entityItem.children) {
                content = '当前编码【' + $scope.entityItem.name + '】下存在子节点，确认后将一并删除！';
            } else {
                content = '当前选择的编码名称：【' + $scope.entityItem.name + '】';
            }

            iConfirm.show({
                scope: $scope,
                title: '确认删除？',
                content: content,
                buttons: [{
                    text: '确认',
                    style: 'button-primary',
                    action: 'confirmDelSycode'
                }, {
                    text: '取消',
                    style: 'button-caution',
                    action: 'confirmClose'
                }]
            });
        };

        $scope.confirmDelSycode = function(id) {
            iConfirm.close(id);
            deleteRecord($scope.entityItem.id);
        };

        $scope.confirmClose = function(id) {
            iConfirm.close(id);
        };

        $scope.reset = function() {
            currentNode = null;
            $scope.m_sCode = null;
            $scope.entityItem = null;
        };

        function deleteRecord(sycodefk) {
            var url = 'sys/web/sycode.do?action=delSycode',
                data = {
                    id: [sycodefk]
                };

            iAjax.post(url, data).then(function() {
                iMessage.show({
                    level: 1,
                    title: '消息提醒',
                    content: '删除成功！'
                });
                init();
            }, function() {
                iMessage.show({
                    level: 4,
                    title: '消息提醒',
                    content: '删除失败！'
                });
            });
        }

        $scope.cancel = function() {
            $scope.m_sMode = 'view';
        };
    }]);
});