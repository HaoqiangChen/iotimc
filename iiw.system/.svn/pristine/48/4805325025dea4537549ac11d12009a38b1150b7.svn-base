/**
 * Created by zhs on 2017/04/01.
 */

define([
    'app',
    'angularAMD',
    'cssloader!system/mapping/css/index.css'

], function(app, angularAMD) {
    var packageName = 'iiw.system.mapping';

    app.controller('mappingController', [
        '$scope',
        '$state',
        '$uibModal',
        'iAjax',
        'iMessage',
        'iConfirm',

        function($scope, $state, $uibModal, iAjax, iMessage, iConfirm) {
            $scope.title = '地址映射';

            $scope.modBtn = false;
            $scope.showAddBtn = false;
            $scope.showModBtn = false;
            $scope.showDelBtn = false;

            $scope.showiConfirm = false;

            $scope.pages = {
                pageNo: 1,
                pageSize: 10,
                totalPage: 1,
                totalSize: 0
            }

            $scope.types = [{
                name: 'iiw'
            }, {
                name: 'mediastream'
            }]

            $scope.list = [];

            $scope.mappingList = [];

            $scope.$on('mappingControllerOnEvent', function() {
                init();
            });

            $scope.$on('getMappingList', function() {
                getMappingList();
            });

            $scope.mapping = {
                selectAll: false,
                select: function(item, event) {
                    if (event && (event.target.tagName == 'INPUT' || event.target.tagName == 'BUTTON' )) {
                        return;
                    } else {
                        item.checked = !item.checked;
                    }
                },
                selAll: function() {
                    $.each($scope.mappingList, function(i, o) {
                        o.checked = $scope.mapping.selectAll;
                    })
                },
                add: function() {
                    $state.go('system.mapping.add');
                },
                mod: function() {
                    var aSelect = _.where($scope.mappingList, {checked: true});
                    if (aSelect.length) {
                        $.each(aSelect, function(i, o) {
                            o.status = 'mod';
                            o._srcaddress = o.srcaddress;
                            o._mappingadd = o.mappingadd;
                            o._reqaddress = o.reqaddress;
                            o._type = o.type;
                        });
                        $scope.modBtn = true;
                        $scope.showAddBtn = true;
                        $scope.showDelBtn = true;
                    } else {
                        showMessage(3, '请选择一条以上的数据进行修改!');
                        $scope.modBtn = false;
                    }

                },
                del: function() {
                    var aSelect = _.where($scope.mappingList, {checked: true});
                    if (aSelect.length) {
                        var list = aSelect.map(function(o, i) {
                            return (i + 1 + '、源地址：' + o.srcaddress + '，映射地址：' + o.mappingadd);
                        });
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '共选择' + aSelect.length + '条数据，分别为：<br>' + list.join('<br>'),
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'mapping.delConfirm'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'mapping.confirmClose'
                            }]
                        });
                    } else {
                        showMessage(3, '请选择一条以上的数据进行删除!')
                    }

                },
                delConfirm: function(id) {
                    iConfirm.close(id);
                    var aSelect = _.filter($scope.mappingList, {checked: true});

                    var url = '/sys/web/CommonController.do?action=delsyaddressmapping',
                        data = {
                            row: {
                                filter: []
                            }
                        };

                    if (aSelect.length > 0) {
                        $.each(aSelect, function(i, o) {
                            data.row.filter.push(o.id);
                        });
                        iAjax.post(url, data).then(function(data) {
                            if (data.status == 1) {
                                showMessage(1, '删除成功!');
                            }
                            getMappingList();
                        });
                    }
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                }
            };

            $scope.save = function() {
                $scope.list = [];
                var aSelect = _.where($scope.mappingList, {mappingadd: ''});
                $.each($scope.mappingList, function(i, o) {
                    if(o.status == 'mod') {
                        $scope.list.push({
                            id: o.id,
                            srcaddress: o._srcaddress,
                            mappingadd: o._mappingadd,
                            reqaddress: o._reqaddress,
                            type: o._type,
                            idx: o.idx
                        });
                    }
                });
                if (aSelect.length) {
                    iConfirm.show({
                        scope: $scope,
                        title: '提示',
                        content: '还有关键字未输入内容是否提交?',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'updateMapping'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'mapping.confirmClose'
                        }]
                    });
                } else {
                    $scope.updateMapping();
                }
            };

            $scope.updateMapping = function(id) {
                iConfirm.close(id);

                var url = '/sys/web/CommonController.do?action=updatesyaddressmapping',
                    data = {
                        rows: $scope.list
                    };

                iAjax.post(url, data).then(function(result) {
                    if(result.status == 1) {
                        showMessage(1, '修改成功!');

                        $scope.modBtn = false;
                        $scope.showAddBtn = false;
                        $scope.showDelBtn = false;

                        getMappingList();
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
                });
            };

            $scope.cancleMod = function(item) {
                item.status = 'normal';
                var aSelect = _.where($scope.mappingList, {status: 'mod'});
                if (!aSelect.length) {
                    $scope.modBtn = false;
                    $scope.showModBtn = false;
                    $scope.showAddBtn = false;
                    $scope.showDelBtn = false;
                }
            };

            $scope.cancle = function() {
                $scope.modBtn = false;
                $scope.showModBtn = false;
                $scope.showAddBtn = false;
                $scope.showDelBtn = false;
                getMappingList();
            };

            function init() {
                getMappingList();
            }

            $scope.pageChanged = function() {
                $scope.currentPage = this.currentPage;
                getMappingList();
            };

            function showMessage(level, content) {
                var message = {};
                message.id = new Date();
                message.level = level;
                message.content = content;
                message.title = $scope.title;
                iMessage.show(message);
            }

            function getMappingList() {
                var url = '/sys/web/CommonController.do?action=getsyaddressmapping',
                    data = {
                        params: {
                            pageNo: $scope.pages.pageNo,
                            pageSize: $scope.pages.pageSize
                        }
                    };

                iAjax.post(url, data).then(function(data) {
                    if(data.result.rows) {
                        $scope.mappingList = data.result.rows;
                    }

                    if(data.result.params) {
                        $scope.pages.totalPage = data.result.params.totalPage;
                        $scope.pages.totalSize = data.result.params.totalSize;
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
                });
            }
        }
    ]);

    app.controller('mappingAddController', [
        '$scope',
        '$state',
        'iAjax',
        'iMessage',

        function($scope, $state, iAjax, iMessage) {
            $scope.mappingItem = {};

            $scope.types = [{
                name: 'iiw'
            }, {
                name: 'mediastream'
            }]
            $scope.mappingItem.type = $scope.types[0].name;

            $scope.save = function() {
                var url = '/sys/web/CommonController.do?action=updatesyaddressmapping',
                    data = {
                        rows: [{
                            srcaddress: $scope.mappingItem.srcaddress,
                            mappingadd: $scope.mappingItem.mappingadd,
                            reqaddress: $scope.mappingItem.reqaddress,
                            type: $scope.mappingItem.type,
                            idx: ''
                        }]
                    }

                iAjax.post(url, data).then(function(data) {
                    if(data.status == 1) {
                        var message = {};
                        message.level = 1;
                        message.title = '消息提醒';
                        message.content = '成功新增数据!';
                        iMessage.show(message);

                        $scope.$root.$broadcast('getMappingList');

                        $scope.back();
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
                });
            }

            // 返回上一级页面
            $scope.back = function() {
                $state.go('system.mapping');
            }
        }
    ]);

    angularAMD.config(function($stateProvider) {
        $stateProvider
            .state('system.mapping.add', {
                url: '/add',
                controller: 'mappingAddController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
            });
    });
});
