/**
 * 门禁严管设置
 *
 * Created by YBW on 2016-12-27
 */
define([
    'app',
    'cssloader!system/severemanage/css/index',
    'cssloader!system/severemanage/css/search-input',
    'cssloader!system/severemanage/css/ds-input',
    'system/severemanage/js/directives/searchInput',
    'system/severemanage/js/directives/ouTree'
], function(app) {
    app.controller('severeManageController', [
        '$scope',
        'iAjax',
        'iMessage',
        'mainService',

        function($scope, iAjax, iMessage, mainService) {
            mainService.moduleName = '门禁严管设置';
            $scope.title = '门禁严管设置';
            $scope.severe = {
                list: [],
                ouList: [],
                data: [],
                operation: true,
                pageNo: 0,
                pageSize: 12,
                totalSize: 0,
                filter: '',
                status: '',
                chooseNum: 0,
                treeNode: {},

                /**
                 * 添加门禁设备严管
                 */
                save: function() {
                    var ids = [];
                    $.each(this.list, function(i, o) {
                        ids.push(o.deviceid);
                    });

                    iAjax.post('security/devicedoor.do?action=lockDoor', {
                        filter: {ids: ids}
                    }).then(function() {
                        $scope.severe.getDeviceList();
                        remind(1, '成功保存！');
                        $scope.severe.operation = true;
                    }, function() {
                        remind(4, '网络连接失败！');
                    });
                },

                /**
                 * 获取已经保存的用户
                 */
                getDeviceList: function() {
                    iAjax.post('security/devicedoor.do?action=getDoorOuList', {
                        filter: {
                            ids: [],
                            name: ''
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.severe.list = data.result.rows;
                            $scope.severe.synchronization();
                        }
                    }, function() {
                        remind(4, '网络连接失败！');
                    })
                },

                /**
                 * 同步单位树与列表数据
                 */
                synchronization: function() {
                    var severe = $scope.severe;
                    if(severe.ouList.length && severe.list.length && severe.treeNode != {}) {
                        $.each(severe.list, function(i, o) {
                            var treeNodeChild = severe.treeNode.getNodeByParam('id', o.deviceid);
                            severe.treeNode.checkNode(treeNodeChild, true, true, false);
                        });
                    }
                },

                /**
                 * 删除门禁设备
                 */
                delete: function(id, index) {
                    this.list.splice(index, 1);
                    this.operation = false;
                    var treeNodeChild = this.treeNode.getNodeByParam('id', id);
                    this.treeNode.checkNode(treeNodeChild, false, true, false);
                },

                /**
                 * 清空门禁设备列表
                 */
                empty: function() {
                    var severe = $scope.severe;
                    $.each(severe.list, function(i, o) {
                        var treeNodeChild = severe.treeNode.getNodeByParam('id', o.deviceid);
                        severe.treeNode.checkNode(treeNodeChild, false, true, false);
                    });
                    severe.list = [];
                    severe.operation = false;
                },

                /**
                 * 取消操作
                 */
                cancel: function() {
                    $scope.severe.getDeviceList();
                    $scope.init();
                    $scope.severe.operation = true;
                }
            };
            $scope.severe.getDeviceList();

            /**
             * 单位树checked单击事件，选择或取消门禁设备
             */
            $scope.selectEvent = function(event, treeld, treeNode) {

                var severe = $scope.severe;
                if(treeNode.type == 'device') {

                    if(treeNode.checked) {
                        severe.list.push({
                            deviceid: treeNode.id,
                            devicename: treeNode.name,
                            syouname: treeNode.syouname,
                            status: treeNode.status
                        });
                        severe.operation = false;
                    } else {
                        operation(treeNode.id);
                    }
                } else if(treeNode.type == 'syou') {
                    recursion(treeNode.children);
                }

                function recursion(array) {

                    $.each(array, function(i, o) {
                        if(o.type == 'device') {
                            if(treeNode.checked) {
                                severe.list.push({
                                    deviceid: o.id,
                                    devicename: o.name,
                                    syouname: o.syouname,
                                    status: o.status
                                });
                                severe.operation = false;
                            } else {
                                operation(o.id);
                            }
                        } else if(o.type == 'syou') {
                            recursion(o.children);
                        }
                    })
                }

                function operation(id) {
                    $.each(severe.list, function(i, o) {
                        if(o.deviceid == id) {
                            severe.list.splice(i, 1);
                            severe.operation = false;
                            return false;
                        }
                    });
                }

            };


            /**
             * 初始化单位树
             */
            $scope.init = function(event) {
                if(!event || event.keyCode == 13) {
                    iAjax.post('security/devicedoor.do?action=getOuDoorList', {
                        filter: {
                            name: $scope.severe.filter
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.severe.ouList = data.result.rows;
                            $.each($scope.severe.ouList, function(i, o) {
                                if(o.type == 'device') {
                                    o.checked = false;
                                } else {
                                    o.checked = 0;
                                }
                            });
                            $scope.$broadcast('severe-tree');
                        }
                    }, function() {
                        remind(4, '网络连接失败');
                    });
                }
            };
            $scope.init();

            /**
             * 消息提醒函数
             */
            function remind(level, content, title) {
                var message = {
                    level: level,
                    content: content,
                    title: (title || '消息提醒')
                };

                iMessage.show(message, false);
            }

        }
    ]);
});