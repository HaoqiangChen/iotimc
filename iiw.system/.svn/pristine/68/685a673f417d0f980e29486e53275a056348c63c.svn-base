/**
 *
 * Created by llx on 2015-10-27.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/material/css/index.css',
    'system/material/js/directives/exportExcel',
    'system/js/directives/systemRowCheckDirective'
], function(app, angularAMD) {
    var packageName = 'iiw.system.material';
    app.controller('materialController', [
        '$scope',
        '$state',
        'iAjax',
        'iTimeNow',
        'mainService',
        'iMessage',
        'iGetLang',
        'iConfirm',
        '$http',
        'iToken',
        '$rootScope',

        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, iGetLang, iConfirm, $http, iToken, $rootScope) {

            $scope.title = '物资管理';
            $scope.confirmMessage = '确定删除选定项！';
            $scope.expertList = [];
            $scope.modBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.entityItem = {};
            $scope.amendId = null;
            $scope.tim = {
                selectAll: false
            };
            $scope.material = {
                filterValue: ''
            };

            $scope.nav = {};
            $scope.nav.pageSize = 10;
            $scope.nav.currentPage = 1;
            $scope.nav.totalPage = 1;
            $scope.nav.totalSize = null;


            $scope.selAll = function() {
                $scope.tim.selectAll = this.tim.selectAll;
                $.each($scope.expertList, function(i, o) {
                    o.checked = $scope.tim.selectAll;
                })
                $scope.chooseRow();
            }

            function send(level, content) {
                var message = {
                    id: iTimeNow.getTime(),
                    level: level,
                    title: '消息提醒',
                    content: content
                }
                iMessage.show(message, false);
            }


            $scope.confirmDelete = function(id) {
                iConfirm.close(id);
                var nodes = _.where($scope.expertList, {checked: true});
                var ids = [];
                $.each(nodes, function(i, o) {
                    ids.push(o.id);
                })
                var data = {
                    id: ids
                }
                iAjax.post('security/preplan.do?action=delMaterial', data).then(function() {
                    send(1, '删除成功！');
                    $scope.getList();

                }, function() {
                    send(4, '网络连接失败！');
                })
            }


            //获取单位
            $scope.getSyouList = function() {
                iAjax.post('sys/web/syou.do?action=getSyouAll', {}).then(function(data) {
                    $scope.syouList = data.result.rows;
                }, function() {
                    send(4, '网络连接失败！');
                })
            }

            //添加物资管理
            $scope.save = function() {
                var data = {
                    row: {
                        name: $scope.entityItem.name,
                        notes: $scope.entityItem.notes,
                        syoufk: $scope.entityItem.syoufk,
                        syuserfk: $scope.entityItem.syuserfk,
                        unit: $scope.entityItem.unit,
                        numbers: $scope.entityItem.numbers
                    }
                };
                if($scope.amendId != null) {
                    data.row.id = $scope.amendId;
                }
                iAjax.post('security/preplan.do?action=saveMaterial', data).then(function(data) {
                    if(data.status == '1') {
                        send(1, '保存成功！');
                        $scope.getList();
                        $state.go('system.material');
                        $scope.entityItem = {};
                    }
                }, function() {
                    send(4, '网络连接失败！');
                })
            };

            $scope.cancel = function() {
                $state.go('system.material');
                $scope.getList();
                $scope.entityItem = {};
            }

            $scope.add = function() {
                $scope.entityItem = {};
                $scope.amendId = null;
                $state.go('system.material.add');
            }

            $scope.mod = function() {
                $scope.entityItem = {};
                var nodes = _.where($scope.expertList, {checked: true});
                if(nodes.length > 1) {
                    send(4, '不能同时修改多条记录!');
                } else if(nodes.length == 1) {
                    $state.go('system.material.mod');
                    $scope.amendId = nodes[0].id;
                    $scope.entityItem = nodes[0];
                }
            }


            $scope.chooseRow = function() {
                var nodes = _.where($scope.expertList, {checked: true});
                if(nodes.length == 1) {
                    $scope.modBtnFlag = false;
                } else {
                    $scope.modBtnFlag = true;
                }

                if(nodes.length > 0) {
                    $scope.delBtnFlag = false;
                } else {
                    $scope.delBtnFlag = true;
                }
            }


            $scope.pageChanged = function() {
                $scope.nav.currentPage = this.nav.currentPage;
                $scope.getList();
            }

            $scope.keyPressGetLIst = function(event) {
                if(event && event.keyCode == 13) {
                    $scope.getList();
                }
            };

            //获取物资管理
            $scope.getList = function() {
                var data = {
                    filter: $scope.material.filterValue,
                    params: {
                        pageNo: $scope.nav.currentPage,
                        pageSize: $scope.nav.pageSize
                    }
                }
                iAjax.post('security/preplan.do?action=getMaterial', data).then(function(data) {
                    if(data.result.rows && data.result) {
                        $scope.expertList = data.result.rows;
                        $scope.nav.currentPage = data.result.params.pageNo;
                        $scope.nav.pageSize = data.result.params.pageSize;
                        $scope.nav.totalSize = data.result.params.totalSize;
                        $scope.nav.totalPage = data.result.params.totalPage;
                        $scope.chooseRow();
                    } else {
                        $scope.expertList = [];
                    }
                }, function() {
                    send(4, '网络连接失败！');
                });
            }

            $scope.$on('materialControllerOnEvent', function() {
                $scope.getList();
                $scope.getSyouList();
            })

            $scope.delete = function() {
                iConfirm.show({
                    scope: $scope,
                    title: '删除',
                    content: '确定要删除选中的内容吗?',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmDelete'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmCancel'
                    }]
                });
            }


            $scope.import = function() {
                $('#uploadFileExcle').click();
            };

            $scope.uploadExcleFile = function() {
                var form = new FormData();
                form.append('loadExcleFile', $('#uploadFileExcle')[0].files[0], $('#uploadFileExcle')[0].files[0].name);
                $http({
                    method: 'post',
                    url: iAjax.formatURL('security/preplan.do?action=setExcel&ptype=true&type=material'),
                    data: form,
                    enctype: 'multipart/form-data',
                    headers: {
                        'Content-Type': undefined
                    }
                })
                    .success(function(data) {
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
                        send(4, '导入失败!');
                    })
            };

            $scope.export = function() {
                var url = iAjax.formatURL('security/preplan.do?action=getExcel&type=material');
                $rootScope.$broadcast('downExcel', url);
            };

            $scope.confirmCancel = function(id) {
                iConfirm.close(id);
                return true;
            };

        }]);


    angularAMD.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('system.material.add', {
            url: '/add',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        })
    }])

    angularAMD.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('system.material.mod', {
            url: '/mod',
            templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
        })
    }])
});