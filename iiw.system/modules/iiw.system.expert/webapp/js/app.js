/**
 * Created by llx on 2016-03-26.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/expert/css/index.css',
    'system/expert/js/directives/exportExcel',
    'system/js/directives/systemRowCheckDirective'

], function(app, angularAMD) {
    var packageName = 'iiw.system.expert';
    app.controller('expertController', [
        '$scope',
        '$state',
        'iAjax',
        'iTimeNow',
        'mainService',
        'iMessage',
        'iConfirm',
        '$http',
        'iToken',
        '$rootScope',

        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, iConfirm, $http, iToken, $rootScope) {

            mainService.moduleName = '应急资源';
            $scope.title = '专家资源';
            $scope.selectAll = false;

            $scope.modBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.filterValue = '';
            $scope.expert = {
                filterValue: '',
                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10
            };
            $scope.entityItem = {};


            /**
             * 模块加载完成后初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.$on('expertControllerOnEvent', function() {
                $scope.getList();
            });

            $scope.keyPressGetLIst = function(event) {
                if(event && event.keyCode == 13) {
                    $scope.getList();
                }
            };


            /**
             * 查询当天巡更登记次数
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.getList = function() {
                var data = {
                    filter: $scope.expert.filterValue,
                    params: {
                        pageNo: $scope.expert.currentPage,
                        pageSize: $scope.expert.pageSize
                    }
                };
                iAjax.post('security/preplan.do?action=getExpert', data).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.expertList = data.result.rows;
                        $scope.expert.currentPage = data.result.params.pageNo;
                        $scope.expert.totalPage = data.result.params.totalPage;
                        $scope.expert.totalSize = data.result.params.totalSize;
                        $scope.expert.pageSize = data.result.params.pageSize;
                    } else {
                        $scope.expertList = [];
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
                    url: iAjax.formatURL('security/preplan.do?action=setExcel&ptype=true&type=expert'),
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
                $state.go('system.expert.add');
            };

            $scope.mod = function() {
                $scope.entityItem = {};
                var nodes = _.where($scope.expertList, {checked: true});
                if(nodes.length > 1) {
                    showMessage(4, '不能同时修改多条记录!');
                } else if(nodes.length == 1) {
                    $scope.m_sCode = nodes[0].id;
                    $state.go('system.expert.mod');
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
                var url = iAjax.formatURL('security/preplan.do?action=getExcel&type=expert');
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
                var nodes = _.where($scope.expertList, {checked: true});
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
                            $state.go('system.expert');
                            $scope.getList();
                        }
                    }, function() {
                        showMessage(4, '网络连接失败！')
                    });
                }
            };

            $scope.selAll = function() {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.expertList, function(i, o) {
                    o.checked = $scope.selectAll;
                });
                $scope.chooseRow();
            };

            $scope.cancel = function() {
                $state.go('system.expert');
            };

            $scope.checkBtnFlag = function() {
                var nodes = _.where($scope.expertList, {checked: true});
                if(nodes.length == 1)$scope.modBtnFlag = false;
                else $scope.modBtnFlag = true;

                if(nodes.length > 0)$scope.delBtnFlag = false;
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
                        $state.go('system.expert');
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

        }]);

    angularAMD.config(function($stateProvider) {
        $stateProvider
            .state('system.expert.add', {
                url: '/add',
                templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
            })
    });
    angularAMD.config(function($stateProvider) {
        $stateProvider
            .state('system.expert.mod', {
                url: '/mod',
                templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
            })
    });
});