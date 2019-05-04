/**
 * 记录监控异常信息
 * 功能描述：在监控窗口中点击记录异常按钮进行登记
 *
 * @author - dwt
 * @date - 2016-04-29
 * @version - 0.1
 */
define([
    'app',
    'safe/js/directives/safeZTree',
    'cssloader!safe/css/safevideorecordunusual'
], function(app) {

    app.directive('safeVideoRecordUnusual', ['$compile', 'iAjax', 'iMessage', '$rootScope', '$http', 'iGetLang', 'safeImcsPlayer', function ($compile, iAjax, iMessage, $rootScope, $http, iGetLang, safeImcsPlayer) {

        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function(data) {
                result = data;
            });

            return result;
        }

        var _template = getTemplate($.soa.getWebPath('iiw.safe') + '/view/safevideorecordunusual.html');

        return {
            restrict: 'A',
            scope: {
                getCameraid: '=getCameraid',
                getSnapData: '=getSnapData'
            },
            compile: function() {
                return {
                    post: function($scope, $element) {

                        $scope.$on('$destroy', function() {
                            if($('.safe-main-video-record-unusual').size()) {
                                $('.safe-main-video-record-unusual').remove();
                            }
                        });


                        $scope.dialect = {
                            OUN_MC: iGetLang.get('OUN_MC')
                        };

                        $scope.record = {
                            maxCode: Infinity,
                            alarm: true,
                            grade: true,
                            diy: '',  //自定义异常类型                        
                            diytype: '',  //自定义等级
                            cameraid: '',
                            cameraname: '',
                            type: '',
                            content: '',
                            imageUrl: '',
                            typelist: [],
                            level: [], //是否有配置等级
                            css: {},
                            hideView: function () {
                                hide();
                            },
                            inputFly: function () {
                                this.alarm = !this.alarm;
                            },
                            levelFly: function () {
                                this.grade = !this.grade;
                            },
                            // 获取异常类型列表
                            getTypes: function () {
                                iAjax.post('security/information/information.do?action=getSycodeList', {
                                    filter: {
                                        type: 'MONITOREXCEPTIONTYPE'
                                    }
                                }).then(function (data) {
                                    if (data.result && data.result.rows) {
                                        $scope.record.typelist = data.result.rows;

                                        if ($scope.record.typelist.length > 0) {
                                            $scope.record.type = $scope.record.typelist[0].id;
                                        }
                                    }
                                });
                            },
                            // 检查能否通知下级单位
                            checkIssued: function () {
                                iAjax.post('security/check/check.do?action=getSpecialrole', { filter: { url: ['supervision_up_role'] } }).then(function (data) {
                                    if (data.result && data.result.rows && (data.result.rows['supervision_up_role'] == '1')) {
                                        $scope.ous.getDatas();
                                    }
                                });
                            },
                            getLevel: function () { //获取异常严重等级配置
                                iAjax.post('security/information/information.do?action=getSycodeList', {
                                    filter: {
                                        type: 'MEXCEPTIONGRADE'
                                    }
                                }).then(function (data) {
                                    if (data.result && data.result.rows) {
                                        $scope.record.level = data.result.rows;

                                        if ($scope.record.level.length > 0) {
                                            $scope.record.type2 = $scope.record.level[0].id;
                                        }
                                    }
                                });
                            },
                            // 获取当前设备的单位
                            getDeviceOu: function () {
                                iAjax.post('/security/information/information.do?action=getDeviceMapSyou', {
                                    filter: {
                                        devicefk: $scope.record.cameraid
                                    }
                                }).then(function (data) {
                                    if (data.result && data.result.length) {
                                        $scope.ous.current = data.result[0];
                                    } else {
                                        $scope.ous.current = _.find($scope.ous.list, function (row) {
                                            return !row.parentid;
                                        });
                                    }
                                });
                            },
                            saveVideoUnusual: function () {
                                if (this.diy != '') {
                                    var data = {
                                        filter: {
                                            name: this.diy,
                                            type:"MONITOREXCEPTIONTYPE"
                                        }
                                    }
                                    iAjax.post('sys/web/sycode.do?action=addSycodeType', data).then(function (data) {
                                        if(data.status == 1){
                                            $scope.record.diyId = data.result.rows
                                        }   
                                    });
                                }
                                
                                if (this.diytype != '') {
                                    var data2 = {
                                        filter: {
                                            name: this.diytype,
                                            type:"MEXCEPTIONGRADE"
                                        }
                                    }
                                    iAjax.post('sys/web/sycode.do?action=addSycodeType', data2).then(function (data) {
                                        if(data.status == 1){
                                            $scope.record.diytypeId = data.result.rows
                                        }   
                                    });
                                }
                                

                                function updata() {
                                    var imageData = $scope.record.imageUrl.replace(/^data:image\/\w+;base64,/, '');
                                    var fileBlob = b64toBlob(imageData, 'image/jpeg');
                                    var url = iAjax.formatURL('security/common/monitor.do?action=uploadPhoto&ptype=true&module=recordunusual');
                                    var formData = new FormData();
                                    formData.append('imageFile', fileBlob);

                                    $http({
                                        method: 'post',
                                        url: url,
                                        data: formData,
                                        headers: {
                                            'Content-Type': undefined
                                        }
                                    }).success(function (data) {
                                        if (data && data.result && data.result.rows) {
                                            var dealUrl = '',
                                                msgTitle = '',
                                                msgContent = '';

                                            var rdata = {
                                                devicefk: $scope.record.cameraid,
                                                notes: $scope.record.content,
                                                photo: data.result.rows.savepath,
                                            }
                                            if($scope.record.diyId != null){
                                                rdata.typefk = $scope.record.diyId;
                                            }else {
                                                if ($scope.record.type && $scope.record.type != '') {
                                                    rdata.typefk = $scope.record.type;
                                                }  
                                            }
                                            if($scope.record.diytypeId != null){
                                                rdata.typefk2 = $scope.record.diytypeId;
                                            }else {
                                                if ($scope.record.type2 && $scope.record.type2 != '') {
                                                    rdata.typefk2 = $scope.record.type2;
                                                }
                                            }
                                            if ($scope.ous.current) {
                                                rdata.creou = $scope.ous.current.id;
                                            }

                                            getUserMenu('videopatrol.a', function (aRole) {
                                                if (aRole) {
                                                    dealUrl = 'security/infolinkage.do?action=dealMonitorException';
                                                    msgTitle = '视频执法巡查登记';
                                                    msgContent = '视频执法巡查登记成功，视频执法巡查登记信息可在视频执法巡查模块中查看！';
                                                } else {
                                                    dealUrl = 'security/common/monitor.do?action=dealMonitorException';
                                                    msgTitle = '监控异常登记';
                                                    msgContent = '监控异常登记成功，监控异常登记信息可在统计分析中查看！';
                                                }

                                                iAjax.post(dealUrl, {
                                                    filter: rdata
                                                }).then(function (data) {
                                                    if (data && data.status == 1) {
                                                        iMessage.show({
                                                            level: 1,
                                                            title: msgTitle,
                                                            content: msgContent
                                                        });
                                                        hide();
                                                    }
                                                });
                                            });

                                            /**
                                             * 查询用户业务权限
                                             *
                                             * @author : hj
                                             * @version : 1.0
                                             * @Date : 2018-09-22
                                             */
                                            function getUserMenu(type, callback) {
                                                var role;
                                                var url = '/security/common/monitor.do?action=getUserRole';
                                                var requestData = {
                                                    filter: {
                                                        url: type
                                                    }
                                                };

                                                iAjax.post(url, requestData).then(function (data) {
                                                    if (data.status == '1') {
                                                        if (data.result && data.result.status) {
                                                            if (data.result.status == '1') {
                                                                role = true;
                                                            } else if (data.result.status == '0') {
                                                                role = false;
                                                            }

                                                            if (callback) {
                                                                callback(role);
                                                            }
                                                        }
                                                    }
                                                }, function () {
                                                    role = false;

                                                    if (callback) {
                                                        callback(role);
                                                    }
                                                });
                                            }

                                        }
                                    });
                                }
                                updata();
                            },
                            del: function (event) {
                                if (event.keyCode == '8') {
                                    if ($scope.record.content.length > 0) {
                                        $scope.record.content = $scope.record.content.substr(0, $scope.record.content.length - 1);
                                    }
                                }
                            }
                        };

                        $element.on('click', function () {
                            init();
                        });

                        $scope.$on('safeMonitorSpaceEvent', function () {
                            init();
                        });

                        function init() {
                            iAjax.post('sys/web/sycode.do?action=getSycode').then(function (data) {
                                _.each(data.result.rows, function (row) {
                                    if (row.type == 'MONITOREXCEPTIONTYPE') {
                                        console.log(row.name)
                                        var code = parseInt(row.code);
                                        if (code < $scope.record.maxCode) {
                                            $scope.record.maxCode = code;

                                        }
                                    }
                                })
                            });


                            if ($('.safe-main-video-record-unusual').size()) {
                                $('.safe-main-video-record-unusual').remove();
                            }

                            var el = $compile(_template)($scope);

                            $('body').append(el);

                            $scope.record.imageUrl = '';
                            var img = $scope.getSnapData();
                            if (_.isString(img)) {
                                $scope.record.imageUrl = img;
                            } else {
                                img.then(function (data) {
                                    $scope.record.imageUrl = data;
                                }, function () {
                                    $scope.record.imageUrl = '';
                                });
                            }
                            
                            // 全局广播事件，如监控中心收到后，会先停止当前轮巡的轮巡组
                            $rootScope.$broadcast('plugin.showVideoRecordUnusual');

                            $scope.record.content = '';
                            $scope.record.cameraid = $scope.getCameraid();
                            $scope.getName($scope.record.cameraid, function (name) {
                                $scope.record.cameraname = name;
                            });

                            $scope.record.getTypes();
                            $scope.record.checkIssued();
                            $scope.record.getLevel();

                            show();

                        }

                        function show() {
                            safeImcsPlayer.hideAll();
                            $('.safe-main-video-record-unusual').show('fade');
                        }

                        function hide() {
                            // 全局广播事件，如监控中心收到后，会恢复之前暂停的轮巡组
                            $rootScope.$broadcast('plugin.hideVideoRecordUnusual');
                            safeImcsPlayer.showAll();
                            $('.safe-main-video-record-unusual').hide('fade');
                        }

                        $scope.$on('videoKeyDownEscEvent', function (e, data) {
                            //弹窗弹出时按esq建关闭弹窗
                            if ($('.safe-main-video-record-unusual').size() && $('.safe-main-video-record-unusual').css('display') == 'block') {
                                hide();
                            }
                        });

                        function b64toBlob(b64Data, contentType, sliceSize) {
                            contentType = contentType || '';
                            sliceSize = sliceSize || 512;

                            var byteCharacters = atob(b64Data);
                            var byteArrays = [];

                            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                var slice = byteCharacters.slice(offset, offset + sliceSize);

                                var byteNumbers = new Array(slice.length);
                                for (var i = 0; i < slice.length; i++) {
                                    byteNumbers[i] = slice.charCodeAt(i);
                                }

                                var byteArray = new Uint8Array(byteNumbers);

                                byteArrays.push(byteArray);
                            }

                            var blob = new Blob(byteArrays, { type: contentType });
                            return blob;
                        }

                        $scope.getName = function (id, cb) {
                            iAjax.postSync('security/common/monitor.do?action=getDeviceDetail', {
                                filter: { id: id }
                            }).then(function (data) {
                                if (data && data.result && data.result.rows) {
                                    if (cb && typeof (cb) == 'function') {
                                        cb(data.result.rows);
                                    }
                                }
                            });
                        }

                        /**
                         * 单位列表
                         * @author : zhs
                         * @version : 1.0
                         * @date : 2018-11-06
                         */
                        $scope.ous = {
                            current: null,
                            list: [],
                            getDatas: function () {
                                iAjax.post('/security/common/monitor.do?action=getMapOuList', {
                                    filter: {
                                        cascade: 'Y'
                                    }
                                }).then(function (data) {
                                    if (data.result && data.result.rows) {
                                        $scope.ous.list = _.filter(data.result.rows, { type: 'ou' });

                                        $scope.record.getDeviceOu();
                                    }
                                });
                            },
                            show: function () {
                                $('.safe-video-record-unusual-text .tree-panel').toggle();
                            },
                            select: function (node) {
                                $scope.ous.current = node;

                                $('.safe-video-record-unusual-text .tree-panel').hide();
                            },
                            reset: function () {
                                $scope.ous.current = _.find($scope.ous.list, function (row) {
                                    return !row.parentid;
                                });
                            }
                        }
                    }
                };
            }
        }
    }]);
});