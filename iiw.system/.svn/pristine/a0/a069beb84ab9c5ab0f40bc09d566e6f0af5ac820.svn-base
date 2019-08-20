/**
 * 税务厅管理-3D图片管理
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/tax/3dphoto/css/index.css',
    'safe/js/directives/safeViewerDirective',
    'system/js/directives/systemRowCheckDirective'
], function(app) {
    app.controller('tax3dphotoController', [
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

            mainService.moduleName = '3D图片管理';
            $scope.title = '3D图片管理';
            $scope.selectAll = false;
            $scope.modBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.params = {
                pageNo: 0,
                pageSize: 12
            };
            $scope.entityItem = {};
            $scope.data = {
                typeArray: [],
                list: [],
                type: null,
                searchText: '',
                filter: {
                    type: 'image3D',
                    typefk: ''
                }
            };

            /**
             * 查看图片
             */
            $scope.lookImg = function(index) {
                $('.iiw-system-tax-photo-image3D .image-container').eq(index).find('img').click();
            };


            /**
             * 模块加载完成后初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-02-26
             */
            $scope.$on('tax3dphotoControllerOnEvent', function() {
                $scope.init();
            });

            $scope.getType = function() {
                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'image3DChild'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.data.typeArray = data.result.rows;
                    } else {
                        $scope.data.typeArray = [];
                    }
                    $scope.getList();
                });
            };

            /**
             * 进入管理类型界面
             */
            $scope.goType = function() {
                goToPlace('system.tax.3dphoto.type');
            };

            function goToPlace(place) {
                $state.go(place);
            }

            /**
             * 请求列表数据
             */
            $scope.getList = function() {
                iAjax.post('taxation/manage.do?action=getFilepool', {
                    filter: $scope.data.filter
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        var images = {};
                        $.each(data.result.rows, function(i, o) {
                            if(o.path2) {
                                o.imagePath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + o.path2;
                            }

                            if(o.path) {
                                o.loadPath = iAjax.formatURL('/security/common/monitor.do?action=getFileDetail') + '&url=' + o.path;
                            }
                        });

                        if($scope.data.typeArray.length) {
                            $.each(data.result.rows, function(i, o) {
                                if(!images[o.parentid]) {
                                    images[o.parentid] = [];
                                }
                                images[o.parentid].push(o);
                                o['deg'] = images[o.parentid].length == 0 ? 0 : [-5, -2, 2, 5][Math.floor(Math.random() * 4)];
                            });
                        }
                        $scope.data.list = images;

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
                $scope.getType();
            };

            $scope.pageChange = function() {
                $scope.init();
            };

            $scope.add = function() {
                $state.params = {
                    data: null
                };
                $state.go('system.tax.3dphoto.add', $state.params);
            };

            $scope.mod = function() {
                var nodes = _.where($scope.data.typeArray, {checked: true});
                $state.params = {
                    data: {
                        type: nodes[0],
                        list: $scope.data.list[nodes[0].id]
                    }
                };
                $state.go('system.tax.3dphoto.add', $state.params);
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
                var nodes = _.where($scope.data.typeArray, {checked: true});
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
                            $scope.getType();
                        }
                    });
                }
            };

            //$scope.selAll = function() {
            //    $scope.selectAll = !$scope.selectAll;
            //    $.each($scope.data.typeArray, function(i, o) {
            //        o.checked = $scope.selectAll;
            //    });
            //    $scope.checkBtnFlag();
            //};

            $scope.cancel = function() {
                $state.go('system.expert');
            };

            $scope.checkBtnFlag = function() {
                var nodes = _.where($scope.data.typeArray, {checked: true});

                if(nodes.length > 0) {
                    $scope.delBtnFlag = false;
                } else {
                    $scope.delBtnFlag = true;
                }

                if(nodes.length == 1) {
                    $scope.modBtnFlag = false;
                } else {
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

