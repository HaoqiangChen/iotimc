/**
 * Created by hj on 2019-05-06.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/dataimport/css/index.css',
    'system/dataimport/js/directives/exportExcel',
    'system/js/directives/systemRowCheckDirective'
], function(app, angularAMD) {
    var packageName = 'iiw.system.dataimport';
    app.controller('dataimportController', [
        '$scope', '$state', 'iAjax', 'iTimeNow', 'mainService', 'iMessage', 'iConfirm', '$http', 'iToken', '$rootScope', '$timeout',
        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, iConfirm, $http, iToken, $rootScope, $timeout) {
            mainService.moduleName = '数据管理';

            $scope.dataimport = {
                title: '数据集导入',
                selectAll: false,
                modBtnFlag: true,
                delBtnFlag: true,
                filterValue: '',
                pagination: {
                    totalSize: 0,
                    currentPage: 1,
                    totalPage: 1,
                    pageSize: 10
                },
                entityItem: {},
                keyPressGetLIst: function(event) {
                    if(event && event.keyCode == 13) {
                        $scope.getList();
                    }
                },
                getList: function() {
                    var data = {
                        filter: $scope.dataimport.filterValue,
                        params: {
                            pageNo: $scope.dataimport.currentPage,
                            pageSize: $scope.dataimport.pageSize
                        }
                    };
                    iAjax.post('security/preplan.do?action=getExpert', data).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.dataimportList = data.result.rows;
                            $scope.dataimport.currentPage = data.result.params.pageNo;
                            $scope.dataimport.totalPage = data.result.params.totalPage;
                            $scope.dataimport.totalSize = data.result.params.totalSize;
                            $scope.dataimport.pageSize = data.result.params.pageSize;
                        } else {
                            $scope.dataimportList = [];
                        }
                    }, function() {
                        showMessage(4, '网络连接失败！')
                    });
                },
                pageChange: function() {
                    $scope.getList();
                },
                selectFileExcle: function() {
                    var form = new FormData();
                    form.append('loadExcleFile', $('#uploadFileExcle')[0].files[0], $('#uploadFileExcle')[0].files[0].name);
                    $http({
                        method: 'post',
                        url: iAjax.formatURL('security/preplan.do?action=setExcel&ptype=true&type=dataimport'),
                        data: form,
                        enctype: 'multipart/form-data',
                        headers: {
                            'Content-Type': undefined
                        }
                    }).success(function(data) {
                        if(data.result && data.result.rows) {
                            var message = {};
                            message.id = new Date();
                            message.level = 1;
                            message.title = $scope.title;
                            message.content = '导入成功!';
                            message.content = message.content + '成功数：' + data.result.rows.addSize + '失败数：' + data.result.rows.errorSize;
                            iMessage.show(message);
                            $('#uploadFileExcle')[0].value = '';
                            $scope.getList();
                        }
                    })
                        .error(function() {
                            showMessage(4, '导入失败!');
                        })
                },
                add: function() {
                    $scope.entityItem = {};
                    $scope.m_sCode = null;
                    $state.go('system.dataimport.add');
                },
                mod: function() {
                    $scope.entityItem = {};
                    var nodes = _.where($scope.dataimportList, {checked: true});
                    if(nodes.length > 1) {
                        showMessage(4, '不能同时修改多条记录!');
                    } else if(nodes.length == 1) {
                        $scope.m_sCode = nodes[0].id;
                        $state.go('system.dataimport.mod');
                        $scope.entityItem = nodes[0];
                    }
                },
                delete: function() {
                    iConfirm.show({
                        scope: $scope,
                        title: '删除',
                        content: '确定要删除选中的内容?',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'confirmDelete'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'confirmClose'
                        }]
                    });
                },
                export: function() {
                    var url = iAjax.formatURL('security/preplan.do?action=getExcel&type=dataimport');
                    $rootScope.$broadcast('downExcel', url);
                },
                import: function() {
                    $('#uploadFileExcle').click();
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                },
                confirmDelete: function(id) {
                    iConfirm.close(id);
                    var nodes = _.where($scope.dataimportList, {checked: true});
                    if(nodes.length > 0) {
                        var ids = [];
                        $.each(nodes, function(i, o) {
                            ids.push(o.id);
                        });

                        var data = {
                            id: ids
                        };
                        iAjax.post('/security/preplan.do?action=delExpert', data).then(function(data) {
                            if(data.status == '1') {
                                showMessage(1, '删除成功！');
                                $state.go('system.dataimport');
                                $scope.getList();
                            }
                        }, function() {
                            showMessage(4, '网络连接失败！')
                        });
                    }
                },
                selAll: function() {
                    $scope.selectAll = !$scope.selectAll;
                    $.each($scope.dataimportList, function(i, o) {
                        o.checked = $scope.selectAll;
                    });
                    $scope.chooseRow();
                },
                cancel: function() {
                    $state.go('system.dataimport');
                },
                checkBtnFlag: function() {
                    var nodes = _.where($scope.dataimportList, {checked: true});
                    if(nodes.length == 1) $scope.modBtnFlag = false;
                    else $scope.modBtnFlag = true;

                    if(nodes.length > 0) $scope.delBtnFlag = false;
                    else $scope.delBtnFlag = true;
                },
                chooseRow: function() {
                    $scope.checkBtnFlag();
                },
                save: function() {
                    var data = {
                        row: {
                            name: $scope.entityItem.name,
                            sex: $scope.entityItem.sex,
                            syoufk: $scope.entityItem.syoufk,
                            contact: $scope.entityItem.contact,
                            post: $scope.entityItem.post,
                            specialty: $scope.entityItem.specialty
                        }
                    };
                    if($scope.m_sCode != null) {
                        data.row.id = $scope.m_sCode;
                    }
                    iAjax.post('/security/preplan.do?action=saveExpert', data).then(function(data) {
                        if(data.status == '1') {
                            if($scope.m_sCode != null) {
                                showMessage(1, '修改成功！');
                            } else {
                                showMessage(1, '添加成功！');
                            }
                            $state.go('system.dataimport');
                            $scope.getList();
                        }
                    }, function() {
                        showMessage(4, '网络连接失败！')
                    });
                }
            };

            // $scope.title = '数据集导入';
            // $scope.selectAll = false;
            // $scope.modBtnFlag = true;
            // $scope.delBtnFlag = true;
            // $scope.filterValue = '';
            // $scope.dataimport = {
            //     filterValue: '',
            //     totalSize: 0,
            //     currentPage: 1,
            //     totalPage: 1,
            //     pageSize: 10
            // };
            // $scope.entityItem = {};


            /**
             * 模块加载完成后初始化
             *
             * @author : hj
             * @version : 1.0
             * @Date : 2019-05-06
             */
            $scope.$on('dataimportControllerOnEvent', function() {
                $scope.getList();
            });

            $scope.keyPressGetLIst = function(event) {
                if(event && event.keyCode == 13) {
                    $scope.getList();
                }
            };

            $scope.getList = function() {
                var data = {
                    filter: $scope.dataimport.filterValue,
                    params: {
                        pageNo: $scope.dataimport.currentPage,
                        pageSize: $scope.dataimport.pageSize
                    }
                };
                iAjax.post('security/preplan.do?action=getExpert', data).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.dataimportList = data.result.rows;
                        $scope.dataimport.currentPage = data.result.params.pageNo;
                        $scope.dataimport.totalPage = data.result.params.totalPage;
                        $scope.dataimport.totalSize = data.result.params.totalSize;
                        $scope.dataimport.pageSize = data.result.params.pageSize;
                    } else {
                        $scope.dataimportList = [];
                    }
                }, function() {
                    showMessage(4, '网络连接失败！')
                });
            };

            $scope.pageChange = function() {
                $scope.getList();
            };

            $scope.selectFileExcle = function() {
                var form = new FormData();
                form.append('loadExcleFile', $('#uploadFileExcle')[0].files[0], $('#uploadFileExcle')[0].files[0].name);
                $http({
                    method: 'post',
                    url: iAjax.formatURL('security/preplan.do?action=setExcel&ptype=true&type=dataimport'),
                    data: form,
                    enctype: 'multipart/form-data',
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function(data) {
                    if(data.result && data.result.rows) {
                        var message = {};
                        message.id = new Date();
                        message.level = 1;
                        message.title = $scope.title;
                        message.content = '导入成功!';
                        message.content = message.content + '成功数：' + data.result.rows.addSize + '失败数：' + data.result.rows.errorSize;
                        iMessage.show(message);
                        $('#uploadFileExcle')[0].value = '';
                        $scope.getList();
                    }
                })
                    .error(function() {
                        showMessage(4, '导入失败!');
                    })
            };

            $scope.add = function() {
                $scope.entityItem = {};
                $scope.m_sCode = null;
                $state.go('system.dataimport.add');
            };

            $scope.mod = function() {
                $scope.entityItem = {};
                var nodes = _.where($scope.dataimportList, {checked: true});
                if(nodes.length > 1) {
                    showMessage(4, '不能同时修改多条记录!');
                } else if(nodes.length == 1) {
                    $scope.m_sCode = nodes[0].id;
                    $state.go('system.dataimport.mod');
                    $scope.entityItem = nodes[0];
                }
            }

            $scope.delete = function() {
                iConfirm.show({
                    scope: $scope,
                    title: '删除',
                    content: '确定要删除选中的内容?',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmDelete'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });
            };

            $scope.export = function() {
                var url = iAjax.formatURL('security/preplan.do?action=getExcel&type=dataimport');
                $rootScope.$broadcast('downExcel', url);
            };

            $scope.import = function() {
                $('#uploadFileExcle').click();
            };

            $scope.confirmClose = function(id) {
                iConfirm.close(id);
                return true;
            };

            $scope.confirmDelete = function(id) {
                iConfirm.close(id);
                var nodes = _.where($scope.dataimportList, {checked: true});
                if(nodes.length > 0) {
                    var ids = [];
                    $.each(nodes, function(i, o) {
                        ids.push(o.id);
                    });

                    var data = {
                        id: ids
                    };
                    iAjax.post('/security/preplan.do?action=delExpert', data).then(function(data) {
                        if(data.status == '1') {
                            showMessage(1, '删除成功！');
                            $state.go('system.dataimport');
                            $scope.getList();
                        }
                    }, function() {
                        showMessage(4, '网络连接失败！')
                    });
                }
            };

            $scope.selAll = function() {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.dataimportList, function(i, o) {
                    o.checked = $scope.selectAll;
                });
                $scope.chooseRow();
            };

            $scope.cancel = function() {
                $state.go('system.dataimport');
            };

            $scope.checkBtnFlag = function() {
                var nodes = _.where($scope.dataimportList, {checked: true});
                if(nodes.length == 1) $scope.modBtnFlag = false;
                else $scope.modBtnFlag = true;

                if(nodes.length > 0) $scope.delBtnFlag = false;
                else $scope.delBtnFlag = true;
            };

            $scope.chooseRow = function() {
                $scope.checkBtnFlag();
            };

            $scope.save = function() {
                var data = {
                    row: {
                        name: $scope.entityItem.name,
                        sex: $scope.entityItem.sex,
                        syoufk: $scope.entityItem.syoufk,
                        contact: $scope.entityItem.contact,
                        post: $scope.entityItem.post,
                        specialty: $scope.entityItem.specialty
                    }
                };
                if($scope.m_sCode != null) {
                    data.row.id = $scope.m_sCode;
                }
                iAjax.post('/security/preplan.do?action=saveExpert', data).then(function(data) {
                    if(data.status == '1') {
                        if($scope.m_sCode != null) {
                            showMessage(1, '修改成功！');
                        } else {
                            showMessage(1, '添加成功！');
                        }
                        $state.go('system.dataimport');
                        $scope.getList();
                    }
                }, function() {
                    showMessage(4, '网络连接失败！')
                });
            };

            function showMessage(level, content) {
                var json = {};
                json.id = new Date();
                json.level = level;
                json.title = $scope.title;
                json.content = content;
                iMessage.show(json);
            }

            /**
             * 单位树形节点
             *
             * @author : hj
             * @version : 1.0
             * @Date : 2019-05-09
             */

            $scope.ouTree = {
                showOuTree: function(item) { // 弹出单位框
                    $scope.$parent.ouArray = [];
                    if(item) {
                        $scope.$parent.fieldItem = item;
                    } else {
                        $scope.$parent.fieldItem = null;
                    }
                    $('#syouTreeModel').show();
                    $('#syouTreeModel').addClass('in');

                    var url, data;
                    url = '/sys/web/syou.do?action=getSyouAll';
                    data = {};
                    iAjax
                        .post(url, data)
                        .then(function(data) {
                                if(data.result.rows && data.result.rows.length > 0) {
                                    $scope.treeNodes = {
                                        zNodes: data.result.rows,
                                        checkFlag: $scope.$parent.fieldItem ? true : false
                                    };

                                    if($scope.$parent.fieldItem && $scope.$parent.fieldItem.keyvalue) {
                                        var ids = $scope.$parent.fieldItem.keyvalue.split(',');
                                        for(var i = 0; i < ids.length; i++) {
                                            var nodes = _.filter($scope.treeNodes.zNodes, {id: ids[i]});
                                            if(nodes.length > 0) {
                                                nodes[0].checked = true;
                                                $scope.$parent.ouArray.push({id: nodes[0].id, name: nodes[0].name});
                                            }
                                        }
                                    }
                                } else {
                                    $scope.treeNodes = {
                                        zNodes: []
                                    };
                                }

                                $scope.treeNodes.chkboxType = {
                                    'Y': '',
                                    'N': ''
                                };

                                $rootScope.$broadcast('initTree', $scope.treeNodes);
                            },
                            function(data) {
                            })

                },
                selectEvent: function(treeNode) { // 树节点点击事件
                    $scope.entityItem.syouname = treeNode.name;
                    $scope.entityItem.syoufk = treeNode.id;
                },
                selectOu: function() {
                    if(!$scope.fieldItem) {
                        if($scope.entityItem.syouname == "") {
                            var message = {};
                            message.level = 3;
                            message.title = "单位选择";
                            message.content = "请选择一个单位信息!";
                            iMessage.show(message, false, $scope);
                        } else {

                        }
                    } else {
                        var items = _.filter($scope.$$childTail.entityPropertiesItem, {sign: '1'});
                        if(items.length > 0) {
                            items[0].ounames = [];
                            items[0].keyvalue = [];
                            var names = [];
                            var ids = [];
                            $.each($scope.$$childTail.ouArray, function(i, o) {
                                names.push(o.name);
                                ids.push(o.id);
                            });
                            items[0].ounames = names.join(',');
                            items[0].keyvalue = ids.join(',');
                        }
                    }

                    $('#syouTreeModel').removeClass('in');
                    $timeout(function() {
                        $('#syouTreeModel').hide()
                    }, 1000);
                },
                selectCancel: function(type) {
                    if(type == 'monitor') {
                        $('#monitorChannelModel').removeClass('in');
                        $timeout(function() {
                            $('#monitorChannelModel').hide()
                        }, 1000);

                        $scope.$broadcast('getDeviceInfoReList');
                        $location.path('/system/device');

                    } else if(type == 'tree') {
                        $('#syouTreeModel').removeClass('in');
                        $timeout(function() {
                            $('#syouTreeModel').hide()
                        }, 1000);
                    } else if(type == 'sync') {
                        $('#singleSyncModel').removeClass('in');
                        $timeout(function() {
                            $('#singleSyncModel').hide()
                        }, 1000);
                    }
                }
            };

            /**
             * 弹出单位框
             *
             * @author : hj
             * @version : 1.0
             * @Date : 2019-05-06
             */
            $scope.showOuTree = function(item) {
                $scope.$parent.ouArray = [];
                if(item) {
                    $scope.$parent.fieldItem = item;
                } else {
                    $scope.$parent.fieldItem = null;
                }
                $('#syouTreeModel').show();
                $('#syouTreeModel').addClass('in');

                var url, data;
                url = '/sys/web/syou.do?action=getSyouAll';
                data = {};
                iAjax
                    .post(url, data)
                    .then(function(data) {
                            if(data.result.rows && data.result.rows.length > 0) {
                                $scope.treeNodes = {
                                    zNodes: data.result.rows,
                                    checkFlag: $scope.$parent.fieldItem ? true : false
                                };

                                if($scope.$parent.fieldItem && $scope.$parent.fieldItem.keyvalue) {
                                    var ids = $scope.$parent.fieldItem.keyvalue.split(',');
                                    for(var i = 0; i < ids.length; i++) {
                                        var nodes = _.filter($scope.treeNodes.zNodes, {id: ids[i]});
                                        if(nodes.length > 0) {
                                            nodes[0].checked = true;
                                            $scope.$parent.ouArray.push({id: nodes[0].id, name: nodes[0].name});
                                        }
                                    }
                                }
                            } else {
                                $scope.treeNodes = {
                                    zNodes: []
                                };
                            }

                            $scope.treeNodes.chkboxType = {
                                'Y': '',
                                'N': ''
                            };

                            $rootScope.$broadcast('initTree', $scope.treeNodes);
                        },
                        function(data) {
                        })

            };

            /**
             * 树节点点击事件
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.selectEvent = function(treeNode) {
                $scope.entityItem.syouname = treeNode.name;
                $scope.entityItem.syoufk = treeNode.id;
            };

            $scope.selectOu = function() {
                if(!$scope.fieldItem) {
                    if($scope.entityItem.syouname == "") {
                        var message = {};
                        message.level = 3;
                        message.title = "单位选择";
                        message.content = "请选择一个单位信息!";
                        iMessage.show(message, false, $scope);
                    } else {

                    }
                } else {
                    var items = _.filter($scope.$$childTail.entityPropertiesItem, {sign: '1'});
                    if(items.length > 0) {
                        items[0].ounames = [];
                        items[0].keyvalue = [];
                        var names = [];
                        var ids = [];
                        $.each($scope.$$childTail.ouArray, function(i, o) {
                            names.push(o.name);
                            ids.push(o.id);
                        });
                        items[0].ounames = names.join(',');
                        items[0].keyvalue = ids.join(',');
                    }
                }

                $('#syouTreeModel').removeClass('in');
                $timeout(function() {
                    $('#syouTreeModel').hide()
                }, 1000);
            };

            $scope.selectCancel = function(type) {
                if(type == 'monitor') {
                    $('#monitorChannelModel').removeClass('in');
                    $timeout(function() {
                        $('#monitorChannelModel').hide()
                    }, 1000);

                    $scope.$broadcast('getDeviceInfoReList');
                    $location.path('/system/device');

                } else if(type == 'tree') {
                    $('#syouTreeModel').removeClass('in');
                    $timeout(function() {
                        $('#syouTreeModel').hide()
                    }, 1000);
                } else if(type == 'sync') {
                    $('#singleSyncModel').removeClass('in');
                    $timeout(function() {
                        $('#singleSyncModel').hide()
                    }, 1000);
                }
            };

        }]);

    /**
     * 模块内部路由
     */
    angularAMD.config(function($stateProvider) {
        $stateProvider
            .state('system.dataimport.add', {
                url: '/add',
                templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
            })
            .state('system.dataimport.mod', {
                url: '/mod',
                templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
            })
            .state('system.dataimport.import', {
                url: '/import',
                templateUrl: $.soa.getWebPath(packageName) + '/view/import.html'
            })
    });
});