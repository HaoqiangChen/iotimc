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
                list: [],
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
                        $scope.dataimport.getList();
                    }
                },
                getList: function() {
                    $scope.dataimport.list = [];

                    var data = {
                            filter: {
                                syoufk: ''  //单位id
                            },
                            params: {
                                pageNo: $scope.dataimport.pagination.currentPage,
                                pageSize: $scope.dataimport.pagination.pageSize
                            }
                        },
                        url = '/security/information/information.do?action=getTemplateData';

                    iAjax.post(url, data).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.dataimport.list = data.result.rows;
                            $scope.dataimport.pagination.currentPage = data.result.params.pageNo;
                            $scope.dataimport.pagination.totalPage = data.result.params.totalPage;
                            $scope.dataimport.pagination.totalSize = data.result.params.totalSize;
                            $scope.dataimport.pagination.pageSize = data.result.params.pageSize;
                        } else {
                            $scope.dataimport.list = [];
                        }
                    }, function() {
                        showMessage(4, '网络连接失败！');
                    });
                },
                pageChange: function() {
                    $scope.dataimport.getList();
                },
                add: function() {
                    $scope.dataimport.entityItem = {};
                    $scope.dataimport.m_sCode = null;
                    $state.params = {
                        data: null
                    };
                    $state.go('system.dataimport.add', $state.params);
                },
                mod: function() {
                    $scope.dataimport.entityItem = {};
                    var nodes = _.where($scope.dataimport.list, {checked: true});
                    if(nodes.length > 1) {
                        showMessage(4, '不能同时修改多条记录!');
                    } else if(nodes.length == 1) {
                        $scope.dataimport.m_sCode = nodes[0].id;
                        $state.go('system.dataimport.mod');
                        $scope.dataimport.entityItem = nodes[0];
                    }
                },
                dtl: function(item) {
                    $scope.dataimport.entityItem = {};
                    $scope.dataimport.m_sCode = item.id;
                    $scope.dataimport.entityItem = item;

                    var currentPage = 1,
                        pageSize = 20,
                        data = {
                            filter: {
                                syoufk: item.syoufk  //单位id
                            },
                            params: {
                                pageNo: currentPage,
                                pageSize: pageSize
                            }
                        },
                        url = '/security/information/information.do?action=getTemplatefieldvalue';

                    iAjax.post(url, data).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.dataimport.entityItem.details = data.result.rows;
                            _.each($scope.dataimport.entityItem.details, function(detail) {
                                if(detail.values.length > 0) {
                                    detail.itemname = _.pluck(detail.values[0], 'name');
                                    if(!detail.itemlist) {
                                        detail.itemlist = [];
                                    }
                                    _.each(detail.values, function(value) {
                                        detail.itemlist.push(_.pluck(value, 'value'));
                                    });
                                }
                            });

                            $state.go('system.dataimport.dtl');
                        } else {
                            $scope.dataimport.entityItem.details = [];
                        }
                    }, function() {
                        showMessage(4, '网络连接失败！');
                    });
                },
                delete: function() {
                    var aSelect = _.where($scope.dataimport.list, {checked: true});

                    if(aSelect.length) {
                        iConfirm.show({
                            scope: $scope,
                            title: '共选择' + aSelect.length + '条记录删除!',
                            content: '请谨慎操作!',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'dataimport.confirmDelete'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'dataimport.confirmClose'
                            }]
                        });
                    } else {
                        showMessage(iMessage, 3, '请选择一条以上记录进行删除!');
                    }
                },
                export: function() {
                    var url = iAjax.formatURL('/security/information/information.do?action=getReportExcel');
                    $rootScope.$broadcast('downExcel', url);
                },
                import: function() {
                    $scope.dataimport.entityItem = {};
                    $scope.dataimport.m_sCode = null;
                    $state.params = {
                        data: null
                    };
                    $state.go('system.dataimport.import', $state.params);
                },
                importSubmit: function() {
                    var form = new FormData();
                    form.append('loadExcleFile', $('#importExcelFile')[0].files[0], $('#importExcelFile')[0].files[0].name);
                    $http({
                        method: 'post',
                        url: iAjax.formatURL('/security/information/information.do?action=setReportExcel&ptype=true&syoufk=' + $scope.dataimport.entityItem.syoufk),
                        data: form,
                        enctype: 'multipart/form-data',
                        headers: {
                            'Content-Type': undefined
                        }
                    }).success(function(data) {
                        if(data.result && data.result.rows) {
                            var message = {
                                id: new Date(),
                                level: 1,
                                timeout: 500,
                                title: $scope.title,
                                content: '导入成功!' + '成功数量：' + data.result.rows.addSize + '空值数量：' + data.result.rows.errorSize
                            };

                            iMessage.show(message);
                            $('#importExcelFile')[0].value = '';
                            $scope.dataimport.entityItem.syouname = '';

                            $timeout(function() {
                                $scope.dataimport.cancel();
                            }, 500);
                        }
                    }).error(function() {
                        showMessage(4, '导入失败!');
                    })
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                },
                confirmDelete: function(id) {
                    iConfirm.close(id);
                    var nodes = _.where($scope.dataimport.list, {checked: true});
                    if(nodes.length > 0) {
                        var ids = [];
                        $.each(nodes, function(i, o) {
                            ids.push(o.syoufk);
                        });

                        var data = {
                            filter: {
                                ids: ids
                            }
                        };
                        var url = iAjax.formatURL('/security/information/information.do?action=delTemplateData');
                        iAjax.post(url, data).then(function(data) {
                            if(data.status == '1') {
                                showMessage(1, '删除成功！');
                                $state.go('system.dataimport');
                                $scope.dataimport.getList();
                                $scope.dataimport.selectAll = false;
                            }
                        }, function() {
                            showMessage(4, '网络连接失败！')
                        });
                    }
                },
                selAll: function() {
                    $.each($scope.dataimport.list, function(i, o) {
                        o.checked = $scope.dataimport.selectAll;
                    });
                    $scope.dataimport.chooseRow();
                },
                cancel: function() {
                    $state.params = {
                        data: null
                    };
                    $state.go('system.dataimport', $state.params);
                    $scope.dataimport.getList();
                },
                checkBtnFlag: function() {
                    var nodes = _.where($scope.dataimport.list, {checked: true});
                    if(nodes.length == 1) $scope.dataimport.modBtnFlag = false;
                    else $scope.dataimport.modBtnFlag = true;

                    if(nodes.length > 0) $scope.dataimport.delBtnFlag = false;
                    else $scope.dataimport.delBtnFlag = true;
                },
                chooseRow: function() {
                    $scope.dataimport.checkBtnFlag();
                },
                save: function() {
                    var data = {
                        row: {
                            // syoufk: $scope.dataimport.entityItem.syoufk,
                        }
                    };
                    if($scope.dataimport.m_sCode != null) {
                        data.row.id = $scope.dataimport.m_sCode;
                    }
                    var url = '/security/information/information.do?action=setReportExcel&ptype=true&syoufk=' + $scope.dataimport.entityItem.syouname;
                    iAjax.post(url).then(function(data) {
                        if(data.status == '1') {
                            if($scope.dataimport.m_sCode != null) {
                                showMessage(1, '修改成功！');
                            } else {
                                showMessage(1, '添加成功！');
                            }
                            $scope.dataimport.cancel();
                        }
                    }, function() {
                        showMessage(4, '网络连接失败！')
                    });
                }
            };

            /**
             * 单位树形节点
             *
             * @author : hj
             * @version : 1.0
             * @Date : 2019-05-09
             */

            // 弹出单位框
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
                iAjax.post(url, data).then(function(data) {
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
                });
            };

            // 树节点点击事件
            $scope.selectEvent = function(treeNode) {
                $scope.dataimport.entityItem.syouname = treeNode.name;
                $scope.dataimport.entityItem.syoufk = treeNode.id;
            };

            $scope.selectOu = function() {
                if(!$scope.fieldItem) {
                    if($scope.dataimport.entityItem.syouname == "") {
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
                    $('#syouTreeModel').hide();
                }, 1000);
            };

            $scope.selectCancel = function(type) {
                if(type == 'monitor') {
                    $('#monitorChannelModel').removeClass('in');
                    $timeout(function() {
                        $('#monitorChannelModel').hide();
                    }, 1000);
                    $scope.$broadcast('getDeviceInfoReList');
                    $location.path('/system/device');
                } else if(type == 'tree') {
                    $('#syouTreeModel').removeClass('in');
                    $timeout(function() {
                        $('#syouTreeModel').hide();
                    }, 1000);
                } else if(type == 'sync') {
                    $('#singleSyncModel').removeClass('in');
                    $timeout(function() {
                        $('#singleSyncModel').hide();
                    }, 1000);
                }
            };

            /**
             * 公共方法
             *
             * @author : hj
             * @version : 1.0
             * @Date : 2019-05-09
             */
            function showMessage(level, content) {
                var json = {};
                json.id = new Date();
                json.level = level;
                json.title = $scope.title;
                json.content = content;
                iMessage.show(json);
            }

            /**
             * 模块加载完成后初始化
             *
             * @author : hj
             * @version : 1.0
             * @Date : 2019-05-06
             */
            $scope.$on('dataimportControllerOnEvent', function() {
                $scope.dataimport.getList();
            });

        }]);

    /**
     * 模块内部路由管理
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
            .state('system.dataimport.dtl', {
                url: '/dtl',
                templateUrl: $.soa.getWebPath(packageName) + '/view/dtl.html'
            })
            .state('system.dataimport.import', {
                url: '/import',
                templateUrl: $.soa.getWebPath(packageName) + '/view/import.html'
            })
    });
});