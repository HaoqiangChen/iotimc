/**
 * 设备授权管理
 *
 * Created by llx on 2015-10-27.
 */

define([
    'app',
    'cssloader!system/devicewarrant/css/index.css',
    'system/devicewarrant/js/directives/monitorpatroltree'

], function(app) {
    app.controller('devicewarrantController', [
        '$scope',
        'iAjax',
        '$filter',
        'iMessage',
        'iConfirm',

        function($scope, iAjax, $filter, iMessage, iConfirm) {

            var cacheMonitorTreeList = [];
            var type = '';
            var _list = [];

            $scope.title = '设备授权管理';
            $scope.indexDevicewarrant = '';
            $scope.searchTreeText = '';
            $scope.searchText = '';
            $scope.getListStatus = 'syuser';
            $scope.searchText = '';
            $scope.sign = '';
            $scope.addList = '';
            $scope.selectListStatus = false;
            $scope.changeListStatus = false;

            $scope.list = [];
            $scope.arrList = [];
            $scope.selectList = [];
            $scope.userList = [];
            $scope.unitList = [];
            $scope.roleList = [];
            $scope.deviceTypeList = [];
            $scope.devicewarrantList = {
                list: [
                    {value: 'syuser', name: '用户'},
                    {value: 'syou', name: '单位'},
                    {value: 'syrole', name: '权限'}
                ],
                sign: [
                    {value: '0', name: '查看用户所属单位下设备及授权设备'},
                    {value: '1', name: '查看用户授权设备'},
                    {value: '2', name: '只查看用户本类型已授权设备及用户单位下其它类型设备'}
                ],
                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10,
                listId: '',
                listSign: '',

                change: function() {
                    getList();
                },
                click: function(data) {
                    type = data.devicetype;
                    $scope.indexDeviceID = type;
                    getDeviceTree(function(list) {
                        $scope.monitorTree.tree.treeNodes.splice(0, $scope.monitorTree.tree.treeNodes.length);
                        $scope.monitorTree.tree.treeNodes = $scope.monitorTree.tree.treeNodes.concat(list);
                        angular.forEach($scope.monitorTree.tree.treeNodes, function(row) {
                            if(row.sign == '1') {
                                row.checked = true;
                            }
                        })
                    });
                    $scope.changeListStatus = true;
                },
                back: function() {
                    var list = [];
                    _list = [];
                    var nodes = $scope.monitorTree.oNode.getCheckedNodes();
                    $.each(nodes, function(i, node) {
                        if(node.type != '' && node.type != 'ou' && node.type != 'map') {
                            list.push(node)
                        }
                    });
                    angular.forEach($scope.addList, function(row) {
                        if(row.type == type) {
                            _list.push(row)
                        }
                    });
                    if(list.length != _list.length) {
                        iConfirm.show({
                            scope: $scope,
                            title: '返回列表页!',
                            content: '返回列表页当前修改的设备授权数据将不保存！',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'confirmSuccess'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'confirmClose'
                            }]
                        });
                    } else {
                        $scope.changeListStatus = false;
                    }
                }
            };

            $scope.confirmSuccess = function(id) {
                $scope.changeListStatus = false;
                iConfirm.close(id);
            };

            $scope.confirmClose = function(id) {
                $scope.backStatus = false;
                iConfirm.close(id);
                return true;
            };

            $scope.monitorTree = {
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
                    treeNodes: []
                }
            };

            $scope.showList = function() {
                $scope.changeListStatus = false;
            };

            $scope.init = function() {
                $scope.indexDevicewarrant = $scope.devicewarrantList.list[0].value;
                $scope.sign = $scope.devicewarrantList.sign[0].value;
                getUserInfo();
            };

            $scope.init();

            $scope.changeList = function(data) {
                $scope.listtype = data;
                if(data == 'syou') {
                    $scope.getListStatus = 'syou';
                    $scope.changeListStatus = false;
                    getUnitInfo();
                    getList();
                } else if(data == 'syrole') {
                    $scope.getListStatus = 'syrole';
                    $scope.changeListStatus = false;
                    getRoleInfo();
                    getList();
                } else {
                    $scope.getListStatus = 'syuser';
                    $scope.changeListStatus = false;
                    getUserInfo();
                    getList();
                }
            };

            $scope.selectSign = function(sign) {
                $scope.sign = sign;
                var list = [];
                if($scope.addList.length) {
                    $.each($scope.addList, function(i, o) {
                        list.push(o.id)
                    })
                }
                var data = {
                    row: {
                        id: list,
                        relationid: $scope.devicewarrantList.listId,
                        type: $scope.indexDevicewarrant,
                        sign: $scope.sign
                    }
                };
                iAjax
                    .post('security/device.do?action=addHardwarefind', data)
                    .then(function(data) {
                        if(data.status == 1) {
                            showMessage('保存成功!', 1);
                            getDeviceType();
                            getList();

                            $scope.changeListStatus = false;
                        }
                    })
            };

            $scope.getDeviceList = function() {
                getDeviceType();
            };

            $scope.getDeviceTreeList = function() {
                var index = $scope.monitorTree.oNode.getNodesByFilter(function(node){
                    return node.name.indexOf($scope.searchTreeText)!= -1 && (node.type != 'ou' && node.type != 'map');
                });
                $scope.monitorTree.oNode.selectNode(index[0]);
            };

            $scope.keyupgetDeviceList = function(event) {
                if(event.keyCode == 13) {
                    getDeviceType();
                }
            };

            $scope.selectdevice = function(item) {
                type = item;
                var list = [];
                _list = [];
                var nodes = $scope.monitorTree.oNode.getCheckedNodes();
                $.each(nodes, function(i, node) {
                    if(node.type != '' && node.type != 'ou') {
                        list.push(node)
                    }
                });
                angular.forEach($scope.addList, function(row) {
                    if(row.type == type) {
                        _list.push(row);
                    }
                });
                getDeviceTree(function(list) {
                    $scope.monitorTree.tree.treeNodes.splice(0, $scope.monitorTree.tree.treeNodes.length);
                    $scope.monitorTree.tree.treeNodes = $scope.monitorTree.tree.treeNodes.concat(list);
                    angular.forEach($scope.monitorTree.tree.treeNodes, function(row) {
                        if(row.sign == '1') {
                            row.checked = true;
                        }
                    })
                });
            };

            $scope.selectItem = function(data) {
                if($scope.listtype == 'syrole') {
                    $.each($scope.roleList, function(i, item) {
                        item.item = false;
                    });
                    $scope.devicewarrantList.listId = data.id;
                    $scope.changeListStatus = false;
                    getList();
                    getDeviceType();
                } else if($scope.listtype == 'syou') {
                    $.each($scope.unitList, function(i, item) {
                        item.item = false;
                    });
                    $scope.devicewarrantList.listId = data.id;
                    $scope.changeListStatus = false;
                    getList();
                    getDeviceType();
                } else {
                    $.each($scope.userList, function(i, item) {
                        item.item = false;
                    });
                    $scope.devicewarrantList.listId = data.id;
                    $scope.changeListStatus = false;
                    getList();
                    getDeviceType();
                }
                $scope.selectList = [];
                data.item = !data.item;
                $scope.changeListStatus = false;
            };

            $scope.save = function() {
                var list = [];
                var nodes = $scope.monitorTree.oNode.getCheckedNodes();
                if(nodes != '') {
                    angular.forEach(nodes, function(node) {
                        if(node.type != '' && node.type != 'ou' && node.type != 'map') {
                            list.push(node);
                            angular.forEach($scope.addList, function(row, i) {
                                if(row.type == type) {
                                    delete $scope.addList[i];
                                }
                            });
                        }
                    });
                } else {
                    angular.forEach($scope.addList, function(row, i) {
                        if(row.type == type) {
                            delete $scope.addList[i];
                        }
                    });
                }
                $scope.addList = $scope.addList.concat(list);
                angular.forEach($scope.addList, function(item) {
                    $scope.selectList.push(item.id);
                });
                var data = {
                    row: {
                        id: $scope.selectList,
                        relationid: $scope.devicewarrantList.listId,
                        type: $scope.indexDevicewarrant,
                        sign: $scope.sign
                    }
                };
                iAjax
                    .post('security/device.do?action=addHardwarefind', data)
                    .then(function(data) {
                        if(data.status == 1) {
                            showMessage('保存成功!', 1);
                            getDeviceType();
                            getList();

                            $scope.changeListStatus = false;
                        }
                    })
            };

            function getDeviceTree(cb) {
                var url, data;
                url = 'security/device.do?action=getHardwarefindList';
                data = {
                    filter: {
                        id: $scope.devicewarrantList.listId,
                        type: $scope.indexDevicewarrant,
                        devicetype: type,
                        sign: $scope.devicewarrantList.listSign,
                        searchText: $scope.searchTreeText
                    }
                };
                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data.result.rows && data.result.rows.length > 0) {
                            var arr = data.result.rows;

                            _.each(arr, function(o) {
                                if(o.type == 'ou') {
                                    o['isOu'] = true;
                                    o['iconSkin'] = 'ouIcon';
                                } else if(o.type == 'map') {
                                    o['isMap'] = true;
                                    o['iconSkin'] = 'mapIcon';
                                } else {
                                    o['isMonitor'] = true;
                                    o['iconSkin'] = 'cameraIcon';
                                }
                            });

                            cacheMonitorTreeList = arr;
                            if(cb && typeof(cb) === 'function') {
                                cb(cacheMonitorTreeList);
                            }
                        }
                    });
            }

            function showMessage(content, level) {
                var message = {};
                message.title = $scope.title;
                message.content = content;
                message.date = new Date();
                message.level = level;
                iMessage.show(message, false)
            }

            function getDeviceType() {
                var data = {
                    filter: {
                        id: $scope.devicewarrantList.listId,
                        type: $scope.indexDevicewarrant,
                        devicetype: type,
                        sign: $scope.devicewarrantList.listSign,
                        searchText: $scope.searchText

                    }
                };
                iAjax
                    .post('security/device.do?action=getHardwarefindListDeviceNumber', data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.deviceTypeList = data.result.rows;
                            if($scope.deviceTypeList[0].sign == '2'){
                                $scope.sign = '2';
                            }else if($scope.deviceTypeList[0].sign == '1'){
                                $scope.sign = '1';
                            }else{
                                $scope.sign = '0';
                            }
                        }
                    })
            }

            function getUserInfo() {
                iAjax
                    .post('sys/web/syuser.do?action=getSyuserAll')
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.userList = data.result.rows;
                            $scope.devicewarrantList.listId = $scope.userList[0].id;
                            $scope.userList[0].item = true;
                            getDeviceType();
                            getList();
                        }
                    })
            }

            function getRoleInfo() {
                var data = {
                    params: {
                        pageNo: $scope.devicewarrantList.currentPage,
                        pageSize: $scope.devicewarrantList.pageSize
                    }
                };
                iAjax
                    .post('sys/web/role.do?action=getSyroleAll', data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.roleList = data.result.rows;
                            $scope.devicewarrantList.listId = $scope.roleList[0].id;
                            $scope.roleList[0].item = true;
                            getDeviceType();
                        }
                    })
            }

            function getUnitInfo() {
                iAjax
                    .post('sys/web/syou.do?action=getSyouAll', {})
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.unitList = data.result.rows;
                            $scope.devicewarrantList.listId = $scope.unitList[0].id;
                            $scope.unitList[0].item = true;
                            getDeviceType();
                        }
                    })
            }

            function getList(type) {
                var data = {
                    filter: {
                        id: $scope.devicewarrantList.listId,
                        type: $scope.indexDevicewarrant,
                        typename: type,
                        sign: $scope.devicewarrantList.listSign,
                        searchText: $scope.searchTreeText

                    }
                };
                iAjax
                    .post('security/device.do?action=getHardwarefindList', data)
                    .then(function(data) {
                        $scope.addList = $filter('filter')(data.result.rows, {sign: '1'});
                    })
            }
        }
    ])
});