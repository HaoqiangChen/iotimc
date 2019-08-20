/**
 * 税务厅管理
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/tax/file/add/css/index.css'
], function(app) {
    app.controller('taxFileAddController', [
        '$scope',
        '$state',
        'iAjax',
        'iTimeNow',
        'mainService',
        'iMessage',
        'iConfirm',
        '$http',
        'iToken',
        '$filter',
        '$stateParams',

        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, iConfirm, $http, iToken, $filter, $stateParams) {
            $scope.path = $.soa.getWebPath('iiw.system.tax.file.add');
            var ip = $.soa.getPath('iiw.safe.taxcenter').substring(0, $.soa.getPath('iiw.safe.taxcenter').lastIndexOf(':'));
            //var ip = 'http://192.168.0.15';
            var port = location.port;
            //var port = 8180;
            /**
             * 返回列表
             */
            $scope.cancel = function() {
                $scope.$parent.getList($scope.$parent.data.type);
                $state.go('system.tax.file');
            };

            $scope.data = {
                file: {},
                list: [],
                select: 0,
                type: [],
                newTypeName: ''
            };

            /**
             * 删除类型
             */
            $scope.delType = function(id) {
                var data = {
                    filter: {
                        ids: [id]
                    }
                };
                iAjax.post('taxation/manage.do?action=delFilePool', data).then(function(data) {
                    if(data.status == '1') {
                        showMessage(1, '删除成功！');
                        getType();
                        $scope.$parent.getType();
                    }
                });
            };

            /**
             * 删除文件
             * @param index
             */
            $scope.deleteFile = function(index) {
                $scope.data.list.splice(index, 1);
            };

            /**
             * 选择文件
             * @param index
             */
            $scope.selectFile = function(index) {
                $scope.data.select = index;
            };

            $scope.upload = function() {
                $('#taxFile').click();
            };

            /**
             *
             */
            $scope.uploading = function(data) {
                $.each(data.files, function(i, o) {
                    //if(/file\/\w+/.test(o.type)) {
                        var size = '';
                        if(o.size > 10240 && o.size < 1048576) {
                            size = Math.floor(o.size / 1024) + 'KB';
                        } else if(o.size > 1048576 && o.size < 1073741824) {
                            size = Math.floor(o.size / 1024 / 1024) + 'MB';
                        }

                        $scope.data.list.push({
                            file: o,
                            name: o.name,
                            size: size,
                            image: '',
                            temp: o.name,
                            type: $scope.data.type[0].id,
                            date: $filter('date')(new Date().getTime(), 'yyyy-MM-dd MM:HH:ss'),
                            font: null
                        });

                    //} else {
                    //    showMessage(3, '【'+ o.name +'】不是视频文件');
                    //}
                });
            };


            function cutFile_upload(index, callback){
                var fileArr = $scope.data.list[index];
                fileArr.font = 'fa-refresh fa-spin';
                oneUpload();

                function oneUpload() {
                    var formData = {};
                    if(!fileArr.id) {
                        formData = new FormData();
                        formData.append('the_file', fileArr.file, fileArr.name);
                    }

                    $.ajax({
                        type: 'post',
                        url: ip + ':' + port +"/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{" +
                        (fileArr.id ? "id:'"+ fileArr.id + "'," : "") +
                        "parentid:'"+ fileArr.type + "'," +
                        "name:'"+ fileArr.name +"'," +
                        "typename:'file'," +
                        "type:'fileDetail'," +
                        "issave:'"+ (fileArr.id ? "up" : "save") +"'" +
                        "}}&authorization=" + iToken.get(),
                        async: true,
                        dataType : "json",
                        enctype: 'multipart/form-data',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success:function(){
                            showMessage(1, '成功添加');
                            if(callback) {
                                fileArr.font = 'fa-check';
                                callback(++index);
                            }
                        }
                    });
                }
            }


            /**
             * 保存
             */
            $scope.save = function() {
                $.each($scope.data.list, function(i, o) {
                    o.font = 'fa-clock-o';
                });
                cutFile_upload(0, next);
                function next(index) {
                    if(index < $scope.data.list.length) {
                        cutFile_upload(index, next);
                    }
                }
            };


            /**
             * 添加类型
             */
            $scope.addType = function() {
                getFileId(function(file) {

                    $.ajax({
                        type: 'post',
                        url: ip + ':' + port + "/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{parentid:'"+ file[0].id + "',name:'"+ $scope.data.newTypeName +"',type:'fileChild',issave:'save'}}&authorization="+ iToken.get(),
                        async: true,
                        dataType: "json",
                        enctype: 'multipart/form-data',
                        data: {},
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(){
                            showMessage(1, '添加类型成功');
                            getType();
                        }
                    });
                });
            };

            /**
             * 获取顶级fileID
             */
            function getFileId(callback) {
                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'file'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        callback(data.result.rows);
                    }
                });
            }

            /**
             * 添加扩展类型
             */
            function expandType() {

                //$scope.data.type.push({
                //    name: '其他',
                //    id: 'add'
                //});

                if($scope.data.newTypeName) {
                    $scope.data.list[$scope.data.select].type = _.where($scope.data.type, {name: $scope.data.newTypeName})[0].id;
                    $scope.data.newTypeName = '';
                }
            }

            /**
             * 获取类型
             */
            function getType() {
                if($stateParams.params && $stateParams.params.data) {
                    $scope.data.type = $stateParams.params.data;
                    expandType();
                } else {

                    iAjax.post('taxation/manage.do?action=getFiletype', {
                        filter: {
                            type: 'fileChild'
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows && data.result.rows.length) {
                            $scope.data.type = data.result.rows;
                            expandType();
                        }
                    });
                }
            }

            /**
             * 初始化
             */
            $scope.$on('taxFileAddControllerOnEvent', function() {
                getType();

                if($stateParams && $stateParams.data) {

                    $.each($stateParams.data, function(i, o) {
                        $scope.data.list.push({
                            id: o.id,
                            file: {},
                            name: o.name,
                            size: o.filesize,
                            image: o.imagePath,
                            byte: o.filesize,
                            temp: o.filetype,
                            type: o.parentid,
                            date: o.cretime,
                            font: null
                        });

                    });
                }
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

