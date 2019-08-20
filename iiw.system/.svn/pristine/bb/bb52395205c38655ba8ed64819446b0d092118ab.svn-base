define([
    'app',
    'cssloader!system/sylogin/css/index'
], function(app) {

    app.controller('syloginController', [
        '$scope',
        '$http',
        'mainService',
        'iAjax',
        'iMessage',
        'iTimeNow',

        function ($scope, $http, mainService, iAjax, iMessage, iTimeNow) {
            mainService.moduleName = '系统基础设置';
            $scope.title = '登陆背景设置';

            $scope.imgPath = iAjax.formatURL('/security/common/monitor.do?action=getFileDetail') + '&url=';

            $scope.$on('syloginControllerOnEvent', function() {
                $scope.datas.getDatas();
            });

            $scope.datas = {
                list: [],
                image: {
                    obj: null,
                    select: function(event) {
                        if(event) {
                            event.stopPropagation();
                        } else {
                            $scope.datas.image.obj = null;
                            _.each($scope.datas.list, function (row) {
                                row.mode = '';
                            });
                        }

                        $('#uploadImg').val('');
                        $('#uploadImg').click();
                    },
                    edit: function(item) {
                        if(item.mode == 'edit') {
                            $scope.datas.image.obj = null;
                            item.mode = '';
                        } else {
                            $scope.datas.image.obj = item;
                            _.each($scope.datas.list, function (row) {
                                row.mode = '';
                            });
                            item.mode = 'edit';
                        }
                    },
                    del: function(item) {
                        var url = iAjax.formatURL('/security/homepage.do?action=upDelFile&type=del&ptype=true') + '&path=' + item.path;

                        var formData = new FormData();
                        formData.append('imageFile', item.name);

                        $http({
                            method: 'post',
                            url: url,
                            data: formData,
                            headers: {
                                'Content-Type': undefined
                            }
                        }).success(function(data) {
                            if(data.status == '1') {
                                remind(1, '删除成功');
                                $scope.datas.getDatas();
                            }
                        });
                    },
                    upload: function() {
                        // 判断文件类型
                        if(!/image\/\w+/.test($('#uploadImg')[0].files[0].type)) {
                            remind(3, '请确保选择的文件为图片类型!');
                            return false;
                        }

                        var formData = new FormData();
                        formData.append('imageFile', $('#uploadImg')[0].files[0], $('#uploadImg')[0].files[0].name);

                        var url = iAjax.formatURL('/security/common/monitor.do?action=uploadPhoto&ptype=true&module=login');

                        if($scope.datas.image.obj) {
                            url = iAjax.formatURL('/security/homepage.do?action=upDelFile&type=up&ptype=true') + '&path=' + $scope.datas.image.obj.path;
                            $scope.datas.image.obj.loading = true;
                        }

                        $http({
                            method: 'post',
                            url: url,
                            data: formData,
                            headers: {
                                'Content-Type': undefined
                            }
                        }).success(function(data) {
                            if(data.status == '1') {
                                if(!$scope.datas.image.obj) {
                                    $scope.datas.list.push({
                                        id: data.result.rows.imageid,
                                        name: data.result.rows.imageid,
                                        path: data.result.rows.savepath
                                    });
                                } else {
                                    var reader = new FileReader();
                                    reader.onload = function (e) {
                                        var idx = _.findIndex($scope.datas.list, {mode: 'edit'});
                                        $('.system-login-img-list li').eq(idx + 1).find('img').attr('src', e.target.result);
                                        $scope.datas.image.obj.loading = false;
                                    };
                                    reader.readAsDataURL($('#uploadImg')[0].files[0]);
                                }

                                remind(1, '图片上传成功');
                            }
                        });
                    }
                },
                getDatas: function() {
                    iAjax.post('security/homepage.do?action=getPathFiles', {
                        // remoteip: '192.168.1.5',
                        filter: {
                            filename: "login",
                            type: "fileall"
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.datas.list = data.result.rows;
                        }
                    }, function() {
                        remind(4, '网络连接出错，图片查询失败！');
                    });
                }
            }

            /**
             * 消息提醒
             * @author : zhs
             * @version : 1.0
             * @date : 2018-06-23
            */
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒'),
                    content: (content || '网络出错'),
                    level: level
                };

                iMessage.show(message, false);
            }
        }
    ]);
});