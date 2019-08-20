/**
 * Created by GDJ on 2015-10-21.
 */
define([
    'app',
    'cssloader!system/rolesetting/css/index',
    'cssloader!system/rolesetting/css/search-input',
    'cssloader!system/rolesetting/css/ds-input',
    'system/rolesetting/js/directives/searchInput',
    'system/rolesetting/js/directives/ouTree'
], function(app) {
    app.controller('roleSettingController', [
        '$scope',
        '$rootScope',
        '$location',
        '$window',
        '$state',
        '$uibModal',
        'iAjax',
        'iMessage',
        'mainService',

        function($scope, $rootScope, $location, $window, $state, $uibModal, iAjax, iMessage, mainService) {
            $scope.title = '门禁权限设置';
            mainService.moduleName = '门禁权限设置';
            $scope.userTree = '';
            $scope.roleList = [];
            $scope.roleArrayList = [];
            $scope.doorList = [];
            $scope.doorArrayList = [];
            /**
             * 模块加载完成后事件
             *
             */
            $scope.$on('roleSettingControllerOnEvent', function() {
                initTreeView();
                initEvent();
            });

            function initEvent() {
                $scope.$on('user-search-event', function(e, val) {
                    if ($scope.userTree) {
                        var node = $scope.userTree.getNodesByFilter(function(node) {
                            return node.name.indexOf(val) != -1 || (node.code && node.code.indexOf(val) != -1);
                        }, true);
                        if (node) {
                            $scope.userTree.selectNode(node);
                            getUserRoleList(node.id);
                        }
                    }
                });

                $scope.$on('door-search-event', function(e, val) {
                    initDoorView({
                        filter: {
                            name: val || ''
                        }
                    }).then(function() {
                        var node = $scope.userTree.getSelectedNodes()[0];
                        getUserRoleList(node.id);
                    });
                });
            }

            function getUserRoleList(userId, name) {
                clearDoorRoleSelect(); //清除以前选中的门禁

                var filter = {
                    filter: {
                        policefk: userId
                    }
                };
                if (name) filter.name = name;
                iAjax.post('door/doorrole.do?action=getPoliceDoorRole', filter).then(function(data) {
                    if (data.status == 1) {
                        if (data.result.rows.length > 0) {
                            $scope.roleList = data.result.rows;
                            $.each($scope.roleList, function(i, ous) {
                                if (ous.devices && ous.devices.length > 0) {
                                    $.each(ous.devices, function(i, device) {
                                        $scope.doorArrayList[device.id].select = true;
                                        $scope.roleArrayList[device.id] = device;
                                    });
                                }
                            });
                        }
                    }
                });
            }

            function initDoorArrayList() {
                clearDoorRoleSelect(function(device) {
                    $scope.doorArrayList[device.id] = device;
                });
            }

            function clearDoorRoleSelect(fn) {
                $.each($scope.doorList, function(i, ous) {
                    if (ous.devices && ous.devices.length > 0) {
                        $.each(ous.devices, function(j, device) {
                            device.select = false;
                            if (fn) fn.call($scope.doorList, device);
                        });
                    }
                });
            }

            /**
             * 初始化门禁结构
             * @returns {*} ajax permiss
             */
            function initDoorView(data) {
                var data = data || {};
                var ret = iAjax.post('door/doorset.do?action=getAreaDevice', data).then(function(data) {
                    if (data.status == 1) {
                        if (data.result.rows.length > 0) {
                            $scope.doorList = data.result.rows;
                            initDoorArrayList();
                        }
                    }
                });

                return ret;
            }

            /**
             * 初始化警察树结构
             */
            function initTreeView() {
                iAjax.post('door/doorrole.do?action=getSyouPolice').then(function(data) {
                    var rData = data.result.rows;
                    $scope.$broadcast('userTree-initTree', {
                        defPid: '00000000000000000000000000000000',
                        check: {
                            enable: true,
                            chkboxType: {'Y': 'ps', 'N': 'ps'}
                        },
                        callback: {
                            onClick: function(event, treeid, treeNode) {
                                getUserRoleList(treeNode.id);
                            }
                        }
                    }, rData, function() {
                        var self = this;
                        var node = self.userTree.getNodesByFilter(function(node) {
                            return (!node.children);
                        }, true);

                        self.userTree.expandNode(node.getParentNode(), true, false);
                        initDoorView().then(function() {
                            self.userTree.selectNode(node, false, true);
                            getUserRoleList(node.id);
                        });
                    });
                });
            }

            /**
             * 选中门禁权限
             * @param e 点击事件
             * @param id 选中门禁ID
             */
            $scope.setDoorRoleSelect = function(e, id) {
                $scope.doorArrayList[id].select = $scope.doorArrayList[id].select == true ? false : true;
            }

            /**
             * 清除当前权限
             */
            $scope.clearDoorRole = function() {
                clearDoorRoleSelect();
            }

            /**
             * 保存权限
             */
            $scope.saveDoorRole = function() {
                //单个选中
                var doorModal = $uibModal.open({
                    templateUrl: 'roleModalContent',
                    //appendTo: $('.page-content').eq(0),
                    scope: $scope,
                    controller: ['$scope', function($scope) {
                        var data = [],
                            deviceids = [];
                        var nodes = $scope.userTree.getNodesByFilter(function(node) {
                            return (!node.isParent && node.checked);
                        }, false);
                        //.getCheckedNodes(true);
                        if (nodes.length == 0) {
                            nodes = $scope.userTree.getSelectedNodes();
                            if (nodes[0].isParent) {
                                nodes = $scope.userTree.getNodesByFilter(function(node) {
                                    return node;
                                }, false, nodes[0]);
                            }
                        }

                        for (var key in $scope.doorArrayList) {
                            var device = $scope.doorArrayList[key];

                            if (device.select == true) {
                                deviceids.push({devicefk: device.id});
                            }
                        }
                        var names = [];
                        $.each(nodes, function(i, node) {
                            names.push(node.name);
                            data.push({
                                policefk: node.id,
                                devices: deviceids
                            });
                        });

                        $scope.names = '(' + names.join(',') + ')的权限?';

                        $scope.roleSave = function() {
                            iAjax.post('door/doorrole.do?action=saveDoorRole', {
                                save: data
                            }).then(function() {
                                iMessage.show({ //提示保存情况
                                    id: 'role_save_success',
                                    level: 1,
                                    title: '提示',
                                    timeout: 1,
                                    content: '保存成功'
                                });
                                doorModal.close();
                            }, function() {
                                iMessage.show({ //提示保存情况
                                    id: 'role_save_error',
                                    level: 3,
                                    title: '提示',
                                    timeout: 3,
                                    content: '保存失败,请检查网络'
                                });
                            });
                        };

                        $scope.roleCancel = function() {
                            doorModal.close();
                        }
                    }],
                    size: 'sm'
                });
            }
        }
    ]);
});