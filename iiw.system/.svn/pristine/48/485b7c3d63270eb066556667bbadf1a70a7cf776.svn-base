/**
 * 税务厅管理-文件管理
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/tax/file/css/index.css',
    'safe/js/directives/safeViewerDirective',
    'system/js/directives/systemRowCheckDirective',
    'system/tax/file/lib/jquery.media'
], function(app) {
    app.controller('taxFileController', [
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
        '$compile',
        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, iConfirm, $http, iToken, $rootScope, $compile) {

            mainService.moduleName = '文件管理';
            $scope.title = '文件管理';
            $scope.selectAll = false;
            $scope.modBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.params = {
                pageNo: 0,
                pageSize: 10
            };
            $scope.data = {
                typeArray: [],
                list: [],
                type: null,
                test: '123',
                filter: {
                    type: 'file',
                    filter: '',
                    typefk: ''
                }
            };

            /**
             * 进入管理类型界面
             */
            $scope.goType = function() {
                goToPlace('system.tax.file.type');
            };

            function goToPlace(place) {
                $state.go(place);
            }


            /**
             * 关闭查看
             */
            $scope.closeLook = function() {
                $('.iiw-system-tax-file-look').css({
                    'display': 'none'
                }).find('close').siblings().html('');
            };


            /**
             * 模块加载完成后初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.$on('taxFileControllerOnEvent', function() {
                $scope.init();
            });

            /**
             * 查看文件
             */
            $scope.lookFile = function(rows) {
                var el = $('.iiw-system-tax-file-look'),
                    elContent = el.find('.content');

                el.css('display', 'block');
                elContent.html('');

                if(rows.filetype == 'txt') {

                    elContent.append('<iframe height="100%" width="100%" src="'+ rows.loadPath +'"></iframe>');

                } else if(rows.filetype == 'pdf') {

                    elContent.append('<a href="'+ rows.loadPath +'"></a>');
                    elContent.find('a').media({
                        width: elContent.width(),
                        height: elContent.height()
                    });

                } else {

                    iAjax.get('taxation/manage.do?action=getDownloadFile', {
                        filter: {
                            url: rows.path
                        }
                    }).then(function(data) {
                        elContent.html($compile(data.result.html)($scope));
                    });

                }
            };

            /**
             * 获取类型
             */
            $scope.getType = function(callback) {
                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'fileChild'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.data.typeArray = data.result.rows;
                    } else {
                        $scope.data.typeArray = [];
                    }

                    if(callback) callback();
                });
            };

            /**
             * 请求列表数据
             */
            $scope.getList = function() {
                iAjax.post('taxation/manage.do?action=getFilepool', {
                    filter: $scope.data.filter,
                    params: $scope.params
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.data.list = data.result.rows;
                        $.each(data.result.rows, function(i, o) {
                            if(o.path) {
                                o.loadPath = iAjax.formatURL('taxation/manage.do?action=getFileDetail') + '&url=' + o.path;
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

            $scope.pageChange = function() {
                $scope.init();
            };

            $scope.add = function() {
                $state.params = {
                    data: null
                };
                $state.go('system.tax.file.add', $state.params);
            };

            $scope.mod = function() {
                var nodes = _.where($scope.data.list, {checked: true});
                $state.params = {
                    data: nodes
                };
                $state.go('system.tax.file.add', $state.params);
            };

            $scope.delete = function(id) {
                $scope.id = id;
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

