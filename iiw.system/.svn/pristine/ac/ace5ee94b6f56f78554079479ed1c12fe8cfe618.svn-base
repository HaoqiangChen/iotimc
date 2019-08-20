/**
 * 税务厅管理
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'safe/js/services/safeVideoPlugin',
    'cssloader!system/tax/video/add/css/index.css'
], function(app) {
    app.controller('taxVideoAddController', [
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
        'safeVideoPlugin',

        function($scope, $state, iAjax, iTimeNow, mainService, iMessage, iConfirm, $http, iToken, $filter, $stateParams, safeVideoPlugin) {
            $scope.path = $.soa.getWebPath('iiw.system.tax.video.add');
            var ip = $.soa.getPath('iiw.safe.taxcenter').substring(0, $.soa.getPath('iiw.safe.taxcenter').lastIndexOf(':'));
            //var ip = 'http://192.168.0.15';
            var port = location.port;
            /**
             * 返回列表
             */
            $scope.cancel = function() {
                $scope.$parent.getList($scope.$parent.data.type);
                $state.go('system.tax.video');
            };

            $scope.data = {
                video: {},
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
                $('#taxVideo').click();
            };

            /**
             *
             */
            $scope.uploading = function(data) {
                $.each(data.files, function(i, o) {
                    if(/video\/\w+/.test(o.type)) {
                        var size = '';
                        if(o.size > 10240 && o.size < 1048576) {
                            size = Math.floor(o.size / 1024) + 'KB';
                        } else if(o.size > 1048576 && o.size < 1073741824) {
                            size = Math.floor(o.size / 1024 / 1024) + 'MB';
                        }

                        var videoPlace = URL.createObjectURL(o);
                        $scope.data.list.push({
                            file: cutFile(o, 1024 * 1024 * 150),
                            name: o.name,
                            size: size,
                            video: videoPlace,
                            image: '',
                            byte: o.size,
                            temp: o.name,
                            type: $scope.data.type[0].id,
                            date: $filter('date')(new Date().getTime(), 'yyyy-MM-dd MM:HH:ss'),
                            font: null
                        });

                    } else {
                        showMessage(3, '【'+ o.name +'】不是视频文件');
                    }
                });

                getVideoImage(0, $scope.data.list.length);
            };

            /**
             * 获取视频截图
             */
            function getVideoImage(index, size) {
                var el = $('#tax_video');
                var video = el.find('video');
                video.attr('src', $scope.data.list[index].video);
                setTimeout(function() {

                    var canvas = document.createElement('canvas');
                    canvas.width = el.width();
                    canvas.height = el.height();
                    canvas.getContext('2d').drawImage(video.get(0), 0, 0, canvas.width, canvas.height);
                    $scope.data.list[index].image = canvas.toDataURL();
                    if(index != size - 1) {
                        getVideoImage(++index, size);
                    }
                }, 200);
            }


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
                        url: ip + ':' + port +"/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{" +
                        (fileArr.id ? "id:'"+ fileArr.id + "'," : "") +
                        "parentid:'"+ fileArr.type + "'," +
                        "name:'"+ fileArr.name +"'," +
                        "typename:'video'," +
                        "type:'videoDetail'," +
                        (fileArr.id ? "" : "size:'"+ fileArr.byte +"',") +
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

                function pluralUpload(count, size, key) {
                    var formData = new FormData();

                    formData.append('the_file', fileArr.file[count - 1].file, fileArr.temp);
                    $.ajax({
                        type: 'post',
                        url: ip + ':' + port +"/taxation/manage.do?action=uploadingFile&ptype=true&data={" +
                        "key:'"+ key + "'," +
                        "number:'"+ count +"'," +
                        "max:'"+ size +"'," +

                        "size:'"+ fileArr.byte +"'," +
                        "id:'"+ fileArr.type + "'," +
                        "name:'"+ fileArr.name +"'," +
                        "typename:'video'," +
                        "type:'videoDetail'," +
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
                getVideoId(function(video) {

                    $.ajax({
                        type: 'post',
                        url: ip + ':' + port + "/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{parentid:'"+ video[0].id + "',name:'"+ $scope.data.newTypeName +"',type:'videoChild',issave:'save'}}&authorization="+ iToken.get(),
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
             * 获取顶级videoID
             */
            function getVideoId(callback) {
                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'video'
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
                            type: 'videoChild'
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
            $scope.$on('taxVideoAddControllerOnEvent', function() {
                getType();
                safeVideoPlugin.init($scope, '#tax_video');

                if($stateParams && $stateParams.data) {

                    $.each($stateParams.data, function(i, o) {
                        $scope.data.list.push({
                            id: o.id,
                            file: [],
                            name: o.name,
                            size: o.filesize,
                            video: o.loadPath,
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

