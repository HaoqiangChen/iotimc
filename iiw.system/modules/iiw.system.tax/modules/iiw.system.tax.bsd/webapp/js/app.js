/**
 * 天河区局概况
 * @author : zhs
 * @version : 1.0
 * @date : 2018-01-22
*/
define([
    'app',
    'system/tax/tianhe/js/directives/systemTaxTianheUmeditor'
], function(app) {
    app.controller('taxBsdController', [
        '$scope',
        'iAjax',
        '$timeout',
        'iTimeNow',
        'iMessage',

        function($scope, iAjax, $timeout, iTimeNow, iMessage) {
            var UM = {
                device: null,
                org: null,
                business: null
            };

            $scope.bsd = {
                id: '',
                save: function() {
                    var data = {
                        type: 'offinfo',
                        device: UM.device.getContent(),
                        org: UM.org.getContent(),
                        business: UM.business.getContent()
                    }

                    if($scope.bsd.id) {
                        data.id = $scope.bsd.id
                    }

                    iAjax.post('taxation/manage.do?action=updateHtmlRecord', {
                        //remoteip: '192.168.0.20',
                        filter: data
                    }).then(function (data) {
                        if (data.status == 1) {
                            remind(1);
                        }
                    });
                },
                getInfoData: function() {
                    iAjax.post('taxation/manage.do?action=getHtmlRecord', {
                        //remoteip: '192.168.0.20',
                        filter: {
                            type: 'offinfo'
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows && (data.result.rows.length > 0)) {
                            $scope.bsd.id = data.result.rows[0]['id'];

                            initUmeditor(data.result.rows[0]);
                        } else {
                            initUmeditor();
                        }
                    });
                },
                init: function () {
                    this.getInfoData();
                }
            }

            $scope.$on('taxBsdControllerOnEvent', function() {
                $timeout(function() {
                    $scope.bsd.init();
                }, 500);
            });

            /**
             * 初始化富文本编辑器
             * @author : zhs
             * @version : 1.0
             * @date : 2018-01-22
            */
            function initUmeditor(data) {
                if($('.iiw-system-tax-bsd .edui-container').length) {
                    var html = {
                        device: '',
                        org: '',
                        business: ''
                    };
                    if(data) {
                        html = data;
                    }

                    // UM = $('.iiw-system-tax-bsd .edui-container *[system-tax-tianhe-umeditor]').data('iiw-umeditor');
                    // UM.setContent(html);

                    UM.device = $('#bsd-device').data('iiw-umeditor');
                    UM.device.setContent(html.device);

                    UM.org = $('#bsd-org').data('iiw-umeditor');
                    UM.org.setContent(html.org);

                    UM.business = $('#bsd-business').data('iiw-umeditor');
                    UM.business.setContent(html.business);
                }
            }

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

