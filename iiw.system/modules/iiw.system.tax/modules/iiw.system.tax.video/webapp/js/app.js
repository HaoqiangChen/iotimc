/**
 * 税务厅管理
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/tax/video/css/index.css',
    'safe/js/services/safeVideoPlugin',
    'system/js/directives/systemRowCheckDirective'
], function(app) {
    app.controller('taxVideoController', [
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
        'safeVideoPlugin',

        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, iConfirm, $http, iToken, $rootScope, safeVideoPlugin) {

            mainService.moduleName = '视频管理';
            $scope.title = '视频管理';
            $scope.selectAll = false;
            $scope.modBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.params = {
                pageNo: 1,
                pageSize: 10,
                totalSize: 0,
                totalPage: 1
            };
            $scope.data = {
                typeArray: [],
                list: [],
                type: '',
                filter: {
                    type: 'video',
                    filter: '',
                    typefk: null
                }
            };

            /**
             * 进入管理类型界面
             */
            $scope.goType = function() {
                goToPlace('system.tax.video.type');
            };

            function goToPlace(place) {
                $state.go(place);
            }


            /**
             * 模块加载完成后初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.$on('taxVideoControllerOnEvent', function() {
                $scope.init();
                safeVideoPlugin.init($scope);
            });

            $scope.getType = function(callback) {

                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'videoChild'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.data.typeArray = data.result.rows;
                        //$scope.data.type = data.result.rows[0].id;
                    } else {
                        $scope.data.typeArray = [];
                    }

                    if(callback) callback();
                }, function() {
                    showMessage(4, '网络连接失败！');
                });
            };


            /**
             * 获取列表
             */
            $scope.getList = function() {

                iAjax.post('taxation/manage.do?action=getFilepool', {
                    filter: $scope.data.filter,
                    params: $scope.params
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.data.list = data.result.rows;

                        $.each(data.result.rows, function(i, o) {
                            if(o.path2) {
                                o.imagePath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.path2;
                            }

                            if(o.path) {
                                o.loadPath = iAjax.formatURL('/security/common/monitor.do?action=getFileDetail') + '&url=' + o.path;
                            }
                        });

                        if(data.result.params) {
                            $scope.params = data.result.params;
                        }
                    }
                });
            };

            /**
             * 查询当天巡更登记次数
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.init = function() {
                $scope.getType(function() {
                    $scope.getList();
                });
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
                        $scope.init();
                    }
                }).error(function() {
                    showMessage(4, '导入失败!');
                });
            };

            $scope.add = function() {
                $state.params = {
                    data: null
                };
                $state.go('system.tax.video.add', $state.params);
            };

            $scope.mod = function() {
                var nodes = _.where($scope.data.list, {checked: true});
                $state.params = {
                    data: nodes
                };
                $state.go('system.tax.video.add', $state.params);
            };

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

            $scope.confirmClose = function(id) {
                iConfirm.close(id);
                return true;
            };

            $scope.confirmDelete = function(id) {
                iConfirm.close(id);
                var nodes = _.where($scope.data.list, {checked: true});
                if(nodes.length > 0) {
                    var ids = [];
                    $.each(nodes, function(i, o) {
                        ids.push(o.id);
                    });

                    var data = {
                        filter: {
                            ids: ids
                        }
                    };
                    iAjax.post('taxation/manage.do?action=delFilePool', data).then(function(data) {
                        if(data.status == '1') {
                            showMessage(1, '删除成功！');
                            $scope.getList();
                        }
                    });
                }
            };

            $scope.selAll = function() {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.data.list, function(i, o) {
                    o.checked = $scope.selectAll;
                });
                $scope.checkBtnFlag();
            };

            $scope.checkBtnFlag = function() {
                var nodes = _.where($scope.data.list, {checked: true});

                if(nodes.length > 0) {
                    $scope.delBtnFlag = false;
                    $scope.modBtnFlag = false;
                } else {
                    $scope.delBtnFlag = true;
                    $scope.modBtnFlag = true;
                }
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
});

