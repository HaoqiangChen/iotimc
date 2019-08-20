/**
 * 税务厅管理
 *
 * Created by ybw on 2017/12/13.
 */
define([
    'app',
    'cssloader!system/tax/photo/add/css/index.css'
], function(app) {
    app.controller('taxPhotoAddController', [
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
            $scope.path = $.soa.getWebPath('iiw.system.tax.video.add');
            var ip = $.soa.getPath('iiw.safe.taxcenter').substring(0, $.soa.getPath('iiw.safe.taxcenter').lastIndexOf(':'));
            //var ip = 'http://192.168.0.15';
            var port = location.port;
            /**
             * 返回列表
             */
            $scope.cancel = function() {
                $scope.$parent.getList();
                $state.go('system.tax.photo');
            };

            $scope.data = {
                image: {},
                list: [],
                select: 0,
                type: [],
                newTypeName: ''
            };

            /**
             * 删除文件
             * @param index
             */
            $scope.deleteFile = function(index) {
                $scope.data.list.splice(index);
            };

            /**
             * 选择文件
             * @param index
             */
            $scope.selectFile = function(index) {
                $scope.data.select = index;
            };

            $scope.upload = function() {
                $('#taxPhoto').click();
            };

            /**
             *
             */
            $scope.uploading = function(data) {
                if(typeof(FileReader) == 'undefined') {
                    alert('抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！');
                    $('#taxPhoto').setAttribute('disabled', 'disabled');
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
                                $scope.data.list.push({
                                    file: o,
                                    name: o.name,
                                    temp: o.name,
                                    size: size,
                                    photo: this.result,
                                    type: $scope.data.type[0].id,
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
                uploading(0);
            };

            /**
             * 上次文件
             */
            function uploading(index) {
                var o = $scope.data.list[index];

                var formData = {};
                if(!o.id) {
                    formData = new FormData();
                    formData.append("the_file", o.file, o.temp);
                }

                $.ajax({
                    type: 'post',
                    url: ip + ':' + port +"/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{" +
                    (o.id ? "id:'"+ o.id + "'," : "") +
                    "parentid:'" + o.type + "'," +
                    "name:'"+ o.name +"'," +
                    "typename:'image'," +
                    "type:'imageDetail'," +
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
                        index++;
                        if(index < $scope.data.list.length) {
                            uploading(index);
                        } else {
                            showMessage(1, '成功添加图片');
                            $scope.cancel();
                        }
                    }
                });
            }

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
             * 添加类型
             */
            $scope.addType = function() {
                getImageId(function(image) {

                    $.ajax({
                        type: 'post',
                        url: ip + ':' + port +"/taxation/manage.do?action=saveFilePool&ptype=true&data={filter:{parentid:'"+ image[0].id + "',name:'"+ $scope.data.newTypeName +"',type:'imageChild',issave:'save'}}&authorization="+ iToken.get(),
                        async: true,
                        dataType : "json",
                        enctype: 'multipart/form-data',
                        data: {},
                        cache: false,
                        contentType: false,
                        processData: false,
                        success:function(){
                            showMessage(1, '添加类型成功');
                            getType();
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
                        type: 'image'
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
                //if($stateParams.params && $stateParams.params.data) {
                //    $scope.data.type = $stateParams.params.data;
                //    expandType();
                //} else {

                    iAjax.post('taxation/manage.do?action=getFiletype', {
                        filter: {
                            type: 'imageChild'
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows && data.result.rows.length) {
                            $scope.data.type = data.result.rows;
                            expandType();
                        }
                    });
                //}
            }

            /**
             * 初始化
             */
            $scope.$on('taxPhotoAddControllerOnEvent', function() {
                getType();
                if($stateParams && $stateParams.data) {
                    $.each($stateParams.data, function(i, o) {
                        $scope.data.list.push({
                            id: o.id,
                            file: {},
                            name: o.name,
                            temp: o.filetype,
                            size: o.filesize,
                            photo: o.imagePath,
                            type: o.parentid,
                            date: o.cretime
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

