/**
 * 税务厅管理-视频管理-管理类型
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/tax/video/type/css/index.css'
], function(app) {
    app.controller('taxVideoTypeController', [
        '$scope',
        '$state',
        'iAjax',
        'iTimeNow',
        '$compile',
        'iMessage',
        'iConfirm',
        '$http',
        'iToken',
        '$filter',
        '$stateParams',

        function($scope, $state, iAjax, iTimeNow, $compile, iMessage, iConfirm, $http, iToken, $filter, $stateParams) {
            var ip = $.soa.getPath('iiw.safe.taxcenter').substring(0, $.soa.getPath('iiw.safe.taxcenter').lastIndexOf(':'));
            //var ip = 'http://192.168.0.15';
            var port = location.port;
            //var port = 8180;

            /**
             * 返回列表
             */
            $scope.cancel = function() {
                $scope.$parent.getList();
                $state.go('system.tax.video');
            };

            $scope.data = {
                list: []
            };

            /**
             * 添加分类
             */
            $scope.add = function() {
                $scope.data.list.unshift({
                    isMod: true,
                    name: '',
                    isNew: true,
                    cretime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss')
                });
            };

            /**
             * 取消
             */
            $scope.cancelList = function(index) {
                if($scope.data.list[index].id) {
                    $scope.data.list[index].isMod = false;
                } else {
                    $scope.data.list.splice(index, 1);
                }
            };

            /**
             * 删除类型
             */
            $scope.del = function(id) {
                var data = {
                    filter: {
                        ids: [id]
                    }
                };
                iAjax.post('taxation/manage.do?action=delFilePool', data).then(function(data) {
                    if(data.status == '1') {
                        showMessage(1, '删除成功！');
                        $scope.$parent.getType();
                        $scope.getList();
                    }
                });
            };

            /**
             * 修改
             */
            $scope.mod = function(rows) {
                rows.isMod = true;
            };

            /**
             * 提交
             */
            $scope.save = function() {
                var target = null;
                $.each($scope.data.list, function(i, o) {
                    if(o.isMod) {
                        var status = (o.isNew ? 'save' : 'up');
                        sendAdd(o.name, o.id, status);
                    }
                });

                function sendAdd(name, id, status) {
                    $.ajax({
                        type: 'post',
                        url: ip + ':' + port + "/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{" +
                        (id ? "id:'"+ id +"'," : "") +
                        "parentid:'"+ $scope.data.id + "'," +
                        "name:'"+ name +"'," +
                        "type:'videoChild'," +
                        "issave:'"+ status +"'" +
                        "}}&authorization="+ iToken.get(),
                        async: true,
                        dataType: "json",
                        enctype: 'multipart/form-data',
                        data: {},
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(){
                            clearTimeout(target);
                            target = setTimeout(function() {
                                showMessage(1, '保存成功');
                                $scope.$parent.getType();
                                $scope.getList();
                            }, 1000);
                        }
                    });
                }
            };

            /**
             * 获取类型
             */
            $scope.getList = function() {

                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'videoChild'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.data.list = data.result.rows;
                    }
                });
            };

            /**
             * 获取顶级videoID
             */
            function getParentId() {
                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'video'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.data.id = data.result.rows[0].id;
                    }
                });
            }

            /**
             * 初始化
             */
            $scope.$on('taxVideoTypeControllerOnEvent', function() {
                $scope.getList();
                getParentId();
            });

            function showMessage(level, content) {
                var json = {};
                json.id = new Date();
                json.level = level;
                json.title = '消息提醒';
                json.content = content;
                iMessage.show(json);
            }
        }]);
});

