/**
 * 对讲资源
 *
 * Created by YBW on 2016-6-14
 */
define([
    'app',
    'angularAMD',
    'safe/js/directives/safePicker',
    'cssloader!system/interphone/css/index.css',
    'system/interphone/js/directives/exportExcel',
    'system/js/directives/systemRowCheckDirective'
], function(app, angularAMD) {
    var packageName = 'iiw.system.interphone';
    app.controller('interphoneController', [
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


            mainService.moduleName = '对讲资源';
            $scope.title = '对讲资源';
            $scope.modBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.selectAll = false;
            $scope.confirmMessage = '是否删除选中项？';
            $scope.entityItem = {};
            $scope.reviseId = null;
            $scope.interphoneObj = {
                filterValue: ''
            };

            //分页导航变量
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.totalSize = 1;
            $scope.totalPage = 1;

            function send(level, content) {
                var message = {
                    id: iTimeNow.getTime(),
                    level: level,
                    title: '消息提醒！',
                    content: content
                };
                iMessage.show(message, false);
            }

            //切换分页
            $scope.pageChanged = function() {
                $scope.currentPage = this.currentPage;
                $scope.getList();
            };

            $scope.keyPressGetLIst = function(event) {
                if(event && event.keyCode == 13) {
                    $scope.getList();
                }
            };

            //初始化资源数据
            $scope.getList = function() {
                var data = {
                    filter: $scope.interphoneObj.filterValue,
                    params: {
                        pageNo: $scope.currentPage,
                        pageSize: $scope.pageSize
                    }
                };
                iAjax.post('security/preplan.do?action=getInterphone', data).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.interphone = data.result.rows;
                    } else {
                        $scope.interphone = [];
                    }
                    if(data.result.params) {
                        $scope.pageSize = data.result.params.pageSize;
                        $scope.currentPage = data.result.params.pageNo;
                        $scope.totalSize = data.result.params.totalSize;
                        $scope.toatlPage = data.result.params.toatlPage;
                    }
                    $scope.chooseRow();
                }, function() {
                    send(4, '网络连接失败！');
                });
            }

            //增加资源数据
            $scope.save = function() {
                var data = {
                    row: {
                        name: $scope.entityItem.name,
                        phone: $scope.entityItem.phone
                    }
                };
                if($scope.reviseId != null) {
                    data.row.id = $scope.reviseId;
                    $scope.reviseId = null;
                }
                iAjax.post('security/preplan.do?action=saveInterphone', data).then(function(data) {
                    if(data.status == 1) {
                        send(1, '保存成功！');
                        $state.go('system.interphone');
                        $scope.entityItem = {};
                        $scope.getList();
                    }
                }, function() {
                    send(4, '网络连接失败！');
                })
            };


            //删除资源数据
            $scope.confirmDelete = function(id) {
                iConfirm.close(id);
                var nodes = _.where($scope.interphone, {checked: true});
                if(nodes.length > 0) {
                    var ids = [];
                    $.each(nodes, function(i, o) {
                        ids.push(o.id)
                    });
                    var data = {
                        id: ids
                    };
                    iAjax.post('security/preplan.do?action=delInterphone', data).then(function() {
                        send(1, '删除成功！');
                        $scope.getList();
                    }, function() {
                        send(4, '网络连接失败！');
                    })
                }
            };

            //跳转页面
            $scope.add = function() {
                $state.go('system.interphone.add')
            };

            $scope.mod = function() {
                $state.go('system.interphone.add');
                var nodes = _.where($scope.interphone, {checked: true});
                $scope.entityItem = nodes[0];
                $scope.reviseId = nodes[0].id;
            };

            $scope.cancel = function() {
                $state.go('system.interphone');
                $scope.entityItem = {};
                $scope.reviseId = null;
            };

            //弹出确定删除框
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
                        action: 'confirmClose'
                    }]
                });
            };


            $scope.selAll = function() {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.interphone, function(i, o) {
                    o.checked = $scope.selectAll;
                });
                $scope.chooseRow();
            };


            $scope.$on('interphoneControllerOnEvent', function() {
                $scope.getList();
            });


            //修改与删除控件判断是否可操作
            $scope.checkBtnFlag = function() {
                var nodes = _.where($scope.interphone, {checked: true});
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
            };

            $scope.chooseRow = function() {
                $scope.checkBtnFlag();
            };

            $scope.uploadExcleFile = function() {
                var form = new FormData();
                form.append('loadExcleFile', $('#uploadFileExcle')[0].files[0], $('#uploadFileExcle')[0].files[0].name);
                $http({
                    method: 'post',
                    url: iAjax.formatURL('security/preplan.do?action=setExcel&ptype=true&type=interphone'),
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
                        send(4, '设备导入失败!');
                    })
            };

            $scope.export = function() {
                var url = iAjax.formatURL('security/preplan.do?action=getExcel&type=interphone');
                $rootScope.$broadcast('downExcel', url);
            };

            $scope.import = function() {
                $('#uploadFileExcle').click();
            };


            $scope.confirmClose = function(id) {
                iConfirm.close(id);
                return true;
            };

        }]);

    //跳转页面配置
    angularAMD.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('system.interphone.add', {
            url: '/mod',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        });
    }])
});