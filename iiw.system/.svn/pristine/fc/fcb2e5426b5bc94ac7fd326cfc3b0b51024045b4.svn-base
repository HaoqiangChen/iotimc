/**
 * 税务厅管理-3D图片管理-添加
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/tax/3dphoto/add/css/index.css'
], function(app) {
    app.controller('tax3dphotoAddController', [
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
            var ip = $.soa.getPath('iiw.safe.taxcenter').substring(0, $.soa.getPath('iiw.safe.taxcenter').lastIndexOf(':'));
            //var ip = 'http://192.168.0.15';
            var port = location.port;
            //var port = 8180;
            /**
             * 返回列表
             */
            $scope.cancel = function() {
                $scope.$parent.getType();
                $state.go('system.tax.3dphoto');
            };

            $scope.data = {
                image: {},
                list: [],
                select: 0,
                type: [],
                newTypeName: '',
                nowType: null,
                saveObject: {
                    name: '',
                    id: null,
                    list: []
                },
                deletes: []
            };

            /**
             * 删除文件
             * @param index
             */
            $scope.deleteImg = function(index) {

                //隐藏图片
                var del = $scope.data.saveObject.list.splice(index, 1)[0];

                //如果是修改状态下修改，保存图片id，保存时调用接口删除图片文件
                if(del.id) {
                    $scope.data.deletes.push(del.id);
                }
            };

            /**
             * 选择文件
             * @param index
             */
            $scope.selectFile = function(index) {
                $scope.data.select = index;
            };

            $scope.upload = function() {
                $('#tax3dPhoto').click();
            };

            /**
             *
             */
            $scope.uploading = function(data) {
                if(typeof(FileReader) == 'undefined') {
                    alert('抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！');
                    $('#tax3dPhoto').setAttribute('disabled', 'disabled');
                } else {
                    $.each(data.files, function(i, o) {
                        if(/image\/\w+/.test(o.type)) {
                            var size = '';
                            if(o.size > 10240 && o.size < 1048576) {
                                size = Math.floor(o.size / 1024) + 'KB';
                            } else if(o.size > 1048576 && o.size < 1073741824) {
                                size = Math.floor(o.size / 1024 / 1024) + 'MB';
                            }

                            var reader = new FileReader();
                            reader.readAsDataURL(o);
                            reader.onload = function() {

                                if($scope.data.saveObject.list.length > 11) {
                                    showMessage(3, '3D图片必须是十二张');
                                    return false;
                                }

                                $scope.data.saveObject.list.push({
                                    file: o,
                                    name: o.name,
                                    temp: o.name,
                                    size: size,
                                    photo: this.result,
                                    date: $filter('date')(new Date().getTime(), 'yyyy-MM-dd MM:HH:ss')
                                });
                            };
                        } else {
                            showMessage(3, '【'+ o.name +'】不是图片文件');
                        }
                    });
                }
            };

            /**
             * 保存
             */
            $scope.save = function() {
                if($scope.data.saveObject.list.length != 12) {
                    showMessage(3, '3D图片必须是十二张');
                    return false;
                }
                $scope.addType(function() {
                    var type = _.where($scope.data.type, {name: $scope.data.saveObject.name});

                    if(type.length) {
                        $scope.data.nowType = type[0];
                    }

                    if($scope.data.nowType) {
                        uploading(0);
                    }

                    $scope.deleteFile();

                });
            };

            /**
             * 删除图片文件
             */
            $scope.deleteFile = function() {
                if($scope.data.deletes.length) {
                    var data = {
                        filter: {
                            ids: $scope.data.deletes
                        }
                    };
                    iAjax.post('taxation/manage.do?action=delFilePool', data);
                }
            };

            /**
             * 上传文件
             */
            function uploading(index) {
                var o = $scope.data.saveObject.list[index];

                if(o.id) {
                    next();
                    return false;
                }

                var formData = {};
                if(!o.id) {
                    formData = new FormData();
                    formData.append("the_file", o.file, o.temp);
                }

                $.ajax({
                    type: 'post',
                    url: ip + ':' + port +"/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{" +
                    (o.id ? "id:'"+ o.id + "'," : "") +
                    "parentid:'" + $scope.data.nowType.id + "'," +
                    "name:'"+ o.name +"'," +
                    "typename:'image3D'," +
                    "type:'image3DDetail'," +
                    "issave:'"+ (o.id ? "up" : "save") +"'" +
                    "}}&authorization="+ iToken.get(),
                    async: true,
                    dataType : "json",
                    enctype: 'multipart/form-data',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success:function(){
                        next();
                    }
                });

                function next() {

                    index++;
                    if(index < $scope.data.saveObject.list.length) {
                        uploading(index);
                    } else {
                        showMessage(1, '成功添加图片');
                        $scope.cancel();
                    }

                }
            }

            /**
             * 删除类型
             */
            //$scope.delType = function(id) {
            //    var data = {
            //        filter: {
            //            ids: [id]
            //        }
            //    };
            //    iAjax.post('taxation/manage.do?action=delFilePool', data).then(function(data) {
            //        if(data.status == '1') {
            //            showMessage(1, '删除成功！');
            //            getType();
            //            $scope.$parent.getType();
            //        }
            //    });
            //};


            /**
             * 添加类型
             */
            $scope.addType = function(callback) {

                if(!$scope.data.saveObject.id && _.where($scope.data.type, {name: $scope.data.saveObject.name}).length != 0) {
                    showMessage(3, '已经存在“' + $scope.data.saveObject.name + '”');
                    return false;
                }

                getImageId(function(image) {

                    $.ajax({
                        type: 'post',
                        url: ip + ':' + port +"/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{" +
                        ($scope.data.saveObject.id ? "id: '"+ $scope.data.saveObject.id +"'," : "") +
                        "parentid:'"+ image[0].id + "'," +
                        "name:'"+ $scope.data.saveObject.name +"'," +
                        "type:'image3DChild'," +
                        "issave:'"+ ($scope.data.saveObject.id ? 'up' : 'save') +"'" +
                        "}}&authorization="+ iToken.get(),
                        async: true,
                        dataType : "json",
                        enctype: 'multipart/form-data',
                        data: {},
                        cache: false,
                        contentType: false,
                        processData: false,
                        success:function() {
                            showMessage(1, '添加类型成功');
                            if($scope.data.saveObject.id) {
                                callback();
                            } else {
                                getType(callback);
                            }
                        }
                    });
                });
            };

            /**
             * 获取顶级imageID
             */
            function getImageId(callback) {
                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'image3D'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        callback(data.result.rows);
                    }
                });
            }

            /**
             * 获取类型
             */
            function getType(callback) {

                iAjax.post('taxation/manage.do?action=getFiletype', {
                    filter: {
                        type: 'image3DChild'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length) {
                        $scope.data.type = data.result.rows;
                        if(callback) {
                            callback();
                        }
                    }
                });
            }

            /**
             * 初始化
             */
            $scope.$on('tax3dphotoAddControllerOnEvent', function() {
                getType();
                if($stateParams && $stateParams.data) {

                    $.each($stateParams.data, function(i, o) {
                        $scope.data.nowType = $stateParams.data.type;
                        var list = [];

                        $.each($stateParams.data.list, function(i, o) {
                            list.push({
                                id: o.id,
                                name: o.name,
                                photo: o.loadPath
                            });
                        });

                        $scope.data.saveObject = {
                            name: $stateParams.data.type.name,
                            list: list,
                            id: $stateParams.data.type.id
                        };

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

