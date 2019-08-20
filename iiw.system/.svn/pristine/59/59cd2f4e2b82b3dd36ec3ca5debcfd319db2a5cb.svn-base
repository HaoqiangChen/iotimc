/**
 * 税务厅区域概况
 * @author : zhs
 * @version : 1.0
 * @date : 2017-12-27
*/
define([
    'app',
    'system/tax/tianhe/js/directives/systemTaxTianheUmeditor'
], function(app) {
    app.controller('taxInfoController', [
        '$scope',
        'iAjax',
        '$timeout',
        'iTimeNow',
        'iMessage',
        'iToken',

        function($scope, iAjax, $timeout, iTimeNow, iMessage, iToken) {
            var UM = null,
                ip = $.soa.getPath('iiw.system.tax').substring(0, $.soa.getPath('iiw.system.tax').lastIndexOf(':')),
                port = 8080;

            $scope.infotype = '';

            $scope.taxinfo = {
                id: '',
                address: '',
                phone: '',
                image: '',
                save: function() {
                    $scope.taximg.save(function(filepath) {
                        var data = {
                            type: $scope.infotype,
                            address: $scope.taxinfo.address,
                            phone: $scope.taxinfo.phone,
                            content: UM.getContent(),
                            image: filepath
                        }

                        if ($scope.taxinfo.id) {
                            data.id = $scope.taxinfo.id
                        }

                        iAjax.post('taxation/manage.do?action=updateHtmlRecord', {
                            //remoteip: '192.168.0.15',
                            filter: data
                        }).then(function (data) {
                            if (data.status == 1) {
                                remind(1);
                            }
                        });
                    });
                },
                uploadClick: function () {
                    $('#upTaxInfoPhoto').val('');
                    $('#upTaxInfoPhoto').click();
                },
                changeImg: function () {
                    if(!/image\/\w+/.test($('#upTaxInfoPhoto')[0].files[0].type)) {//判断类型
                        remind(3, '请确保选择的文件为图片类型!');
                        return false;
                    }
                    var reader = new FileReader();
                    reader.onload = function() {
                        $scope.taxinfo.image = reader.result;
                        $scope.taxinfo.shotphoto = reader.result;
                    };
                    reader.readAsDataURL($('#upTaxInfoPhoto')[0].files[0]);
                }
            }

            $scope.taximg = {
                save: function(callback) {
                    if($scope.taxinfo.shotphoto) {
                        var blob = this.dataURItoBlob($scope.taxinfo.shotphoto);
                        var formData = new FormData(document.forms[0]);
                        formData.append("the_file", blob, 'image.png');

                        $.ajax({
                            type: 'post',
                            url: ip + ':' + port + '/taxation/manage.do?action=uploadingOneFile&ptype=true&typename=httpimage&authorization=' + iToken.get(),
                            async: true,
                            dataType: "json",
                            enctype: 'multipart/form-data',
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                if (data.result && data.result.filepath) {
                                    console.log($scope.infotype + '：实拍图上传成功');
                                    if (callback) {
                                        callback(data.result.filepath);
                                    }
                                }
                            }
                        });
                    } else {
                        if (callback) {
                            callback();
                        }
                    }
                },
                deleted: function() {

                },
                dataURItoBlob: function(base64Data) {
                    var byteString;
                    if (base64Data.split(',')[0].indexOf('base64') >= 0) {
                        byteString = atob(base64Data.split(',')[1]);
                    } else {
                        byteString = unescape(base64Data.split(',')[1]);
                    }

                    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
                    var ia = new Uint8Array(byteString.length);

                    for (var i = 0; i < byteString.length; i++) {
                        ia[i] = byteString.charCodeAt(i);
                    }
                    return new Blob([ia], {type:mimeString});
                }
            }

            $scope.$on('taxInfoControllerOnEvent', function() {
                getSyou();
            });

            /**
             * 查询数据库获取已存储的数据
             * @author : zhs
             * @version : 1.0
             * @date : 2017-12-27
            */
            function getTaxInfo(infotype) {
                iAjax.post('taxation/manage.do?action=getHtmlRecord', {
                    //remoteip: '192.168.0.15',
                    filter: {
                        type: infotype
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows && (data.result.rows.length > 0)) {
                        $scope.taxinfo.id = data.result.rows[0]['id'];
                        $scope.taxinfo.address = data.result.rows[0]['address'] || '';
                        $scope.taxinfo.phone = data.result.rows[0]['phone'] || '';
                        if(data.result.rows[0]['image']) {
                            $scope.taxinfo.image = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + data.result.rows[0]['image'];
                        } else {
                            $scope.taxinfo.image = '';
                        }
                        initUmeditor(data.result.rows[0]['content']);
                    } else {
                        $scope.taxinfo.id = '';
                        $scope.taxinfo.address = '';
                        $scope.taxinfo.phone = '';
                        $scope.taxinfo.image = '';
                        initUmeditor();
                    }
                });
            }

            /**
             * 初始化富文本编辑器
             * @author : zhs
             * @version : 1.0
             * @date : 2017-12-27
            */
            function initUmeditor(content) {
                if($('.iiw-system-tax-info .edui-container').length) {
                    var html = '';
                    if(content) {
                        html = content;
                    }

                    UM = $('.iiw-system-tax-info .edui-container *[system-tax-tianhe-umeditor]').data('iiw-umeditor');
                    UM.setContent(html);
                }
            }

            /**
             * 单位树型结构初始化
             * @author : zhs
             * @version : 1.0
             * @date : 2018-01-09
             */
            function getSyou() {
                var url, data;
                url = '/sys/web/syou.do?action=getSyouAll';
                data = {};

                iAjax
                    .postSync(url, data)
                    .then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.treeNodes = {
                                zNodes: data.result.rows
                            };
                        } else {
                            $scope.treeNodes = {
                                zNodes: []
                            };
                        }
                        $scope.$broadcast('initTree', $scope.treeNodes);

                    }, function () {
                        remind(4, '数据查询失败，请检查是否有权限!');
                    });
            }

            /**
             * 树节点点击事件
             * @author : zhs
             * @version : 1.0
             * @date : 2018-01-09
             */
            $scope.selectEvent = function (treeNode) {
                //console.log(treeNode);
                $scope.infotype = treeNode.name;
                getTaxInfo(treeNode.name);
            };

            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒！'),
                    level: level,
                    content: (content || '提交成功！')
                };

                iMessage.show(message, false);
            }
        }]);
});

