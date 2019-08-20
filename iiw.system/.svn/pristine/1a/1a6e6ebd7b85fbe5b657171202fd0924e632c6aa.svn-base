/**
 * 税务厅管理
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/plugins/add/css/index.css'
], function(app) {
    app.controller('pluginsAddController', [
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
            $scope.path = $.soa.getWebPath('iiw.system.plugins.add');

            function r(){

                var e;

                if(window.__IIWHOST){
                    var t=document.createElement("a");
                    t.href=window.__IIWHOST,
                    e=t.host
                } else {
                    e=location.host;
                }
                return e
            }

            /**
             * 返回列表
             */
            $scope.cancel = function() {
                $scope.$parent.getList($scope.$parent.data.type);
                $state.go('system.plugins');
            };

            $scope.data = {
                file: {},
                list: [],
                select: 0,
                type: ''
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
                $('#systemPlugins').click();
            };

            /**
             *
             */
            $scope.uploading = function(data) {
                $.each(data.files, function(i, o) {

                    $scope.data.list.push({
                        file: cutFile(o, 1024 * 1024 * 150),
                        name: o.name,
                        JSON: {
                            mc: o.name,
                            bh: '',
                            bbh: '',
                            sm: ''
                        },
                        byte: o.size,
                        temp: o.name,
                        type: $scope.data.type,
                        font: null
                    });
                });
            };


            //切割大文件
            function cutFile(file,cutSize) {
                var count = file.size / cutSize | 0 ,
                    fileArr = [];
                for (var i= 0; i< count ; i++){
                    fileArr.push({
                        name:file.name + ".part"+(i+1),
                        file:file.slice( cutSize * i , cutSize * ( i + 1 ))
                    });
                }
                fileArr.push({
                    name:file.name+".part"+(count+1),
                    file:file.slice(cutSize*count,file.size)
                });
                return fileArr;
            }


            function cutFile_upload(index, callback){
                var fileArr = $scope.data.list[index];
                fileArr.font = 'fa-refresh fa-spin';
                if(fileArr.file.length > 1) {
                    pluralUpload(1, fileArr.file.length, Math.random() * 10000000000000000);
                } else {
                    oneUpload();
                }

                function oneUpload() {
                    var formData = {};
                    if(!fileArr.id) {
                        formData = new FormData();
                        formData.append('the_file', fileArr.file[0].file, fileArr.name);
                    }

                    $.ajax({
                        type: 'post',
                        url: "http://"+ r() +"/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{" +

                        (fileArr.id ? "id:'"+ fileArr.id + "'," : "") +

                        "parentid:'"+           fileArr.type + "'," +
                        "name:'"+               fileArr.name +"'," +
                        "notes:'"+               fileArr.notes +"'," +
                        "typename:" +           "'file'," +
                        "type:" +               "'fileDetail'," +

                        (fileArr.id ? "" : "size:'"+ fileArr.byte +"',") +
                        "issave:'"+             (fileArr.id ? "up" : "save") +"'" +

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

                function pluralUpload(count, size, key) {
                    var formData = new FormData();

                    formData.append('the_file', fileArr.file[count - 1].file, fileArr.temp);
                    $.ajax({
                        type: 'post',
                        url: "http://"+ r() +"/taxation/manage.do?action=uploadingFile&ptype=true&data={" +
                        "key:'"+ key + "'," +
                        "number:'"+ count +"'," +
                        "max:'"+ size +"'," +
                        "notes:'"+ fileArr.notes +"'," +

                        "size:'"+ fileArr.byte +"'," +
                        "id:'"+ fileArr.type + "'," +
                        "name:'"+ fileArr.name +"'," +
                        "typename:'file'," +
                        "type:'fileDetail'," +
                        "issave:'save'" +

                        "}&authorization=" + iToken.get(),
                        async: true,
                        dataType : "json",
                        enctype: 'multipart/form-data',
                        data: formData,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success:function(){
                            if(size == count) {
                                showMessage(1, '成功添加');
                                fileArr.font = 'fa-check';
                                callback(++index);
                            } else {
                                pluralUpload(++count, size, key);
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
                    o.notes = JSON.stringify(o.JSON);
                });

                cutFile_upload(0, next);
                function next(index) {
                    if(index < $scope.data.list.length) {
                        cutFile_upload(index, next);
                    }
                }
            };

            /**
             * 获取类型
             */
            function getType() {
                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'fileChild'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $.each(data.result.rows, function(i, o) {
                            if(o.name == '北监插件') {
                                $scope.data.type = o.id;
                            }
                        });
                    }
                });
            }

            /**
             * 初始化
             */
            $scope.$on('pluginsAddControllerOnEvent', function() {
                getType();

                //if($stateParams && $stateParams.data) {
                //
                //    $.each($stateParams.data, function(i, o) {
                //        $scope.data.list.push({
                //            id: o.id,
                //            file: [],
                //            name: o.name,
                //            size: o.filesize,
                //            file: o.loadPath,
                //            image: o.imagePath,
                //            byte: o.filesize,
                //            temp: o.filetype,
                //            type: o.parentid,
                //            date: o.cretime,
                //            font: null
                //        });
                //
                //    });
                //}
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

