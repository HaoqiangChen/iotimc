/**
 * 税务厅管理
 *
 * Created by ybw on 2018/07/07.
 */
define([
    'app',
    'cssloader!system/tax/video/css/index.css',
    'system/js/directives/systemRowCheckDirective'
], function(app) {
    app.controller('pluginsController', [
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

            mainService.moduleName = '插件管理';
            $scope.title = '插件管理';
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
                list: [],
                type: '',
                filter: {
                    type: 'file',
                    filter: '',
                    typefk: null
                }
            };


            /**
             * 模块加载完成后初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.$on('pluginsControllerOnEvent', function() {
                $scope.init();
            });

            $scope.getType = function(callback) {

                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'fileChild'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $.each(data.result.rows, function(i, o) {
                            if(o.name == '北监插件') {
                                $scope.data.filter.typefk = o.id;
                            }
                        });
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
                        var list = [];

                        $.each(data.result.rows, function(i, o) {

                            if(o.path) {
                                o.download = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.path    ;
                            }

                            try{

                                o.JSON = JSON.parse(o.notes);
                                list.push(o);

                            } catch (e){

                                console.info(o.name + 'not JSON');

                            }
                        });
                        $scope.data.list = list;

                        if(data.result.params) {
                            $scope.params = data.result.params;
                        }
                    }
                });
            };


            $scope.init = function() {
                $scope.getType(function() {
                    $scope.getList();
                });
            };

            /**
             * 下载插件
             */
            $scope.download = function(path) {
                var el = document.getElementById('systemPluginsDownload');
                $(el).attr('href', path);
                el.click();
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
                $state.go('system.plugins.add', $state.params);
            };

            $scope.mod = function() {
                var nodes = _.where($scope.data.list, {checked: true});
                $state.params = {
                    data: nodes
                };
                $state.go('system.plugins.add', $state.params);
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

