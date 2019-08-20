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
    app.controller('taxTianheController', [
        '$scope',
        'iAjax',
        '$timeout',
        'iTimeNow',
        'iMessage',

        function($scope, iAjax, $timeout, iTimeNow, iMessage) {
            var UM = {
                intro: {
                    time: null,
                    area: null,
                    org: null
                },
                mgt: {
                    system: null,
                    profession: null,
                    mechanism: null
                },
                eff: null
            };

            $scope.tianhe = {
                id: '',
                save: function() {
                    var data = {
                        type: 'taxinfo',
                        intro: {
                            time: UM.intro.time.getContent(),
                            area: UM.intro.area.getContent(),
                            org: UM.intro.org.getContent()
                        },
                        mgt: {
                            system: UM.mgt.system.getContent(),
                            profession: UM.mgt.profession.getContent(),
                            mechanism: UM.mgt.mechanism.getContent()
                        },
                        eff: UM.eff.getContent()
                    }

                    if($scope.tianhe.id) {
                        data.id = $scope.tianhe.id
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
                            type: 'taxinfo'
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows && (data.result.rows.length > 0)) {
                            $scope.tianhe.id = data.result.rows[0]["id"];

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

            $scope.$on('taxTianheControllerOnEvent', function() {
                $timeout(function() {
                    $scope.tianhe.init();
                }, 500);
            });

            /**
             * 初始化富文本编辑器
             * @author : zhs
             * @version : 1.0
             * @date : 2018-01-22
            */
            function initUmeditor(data) {
                if($('.iiw-system-tax-tianhe .edui-container').length) {
                    var html = {
                        intro: {
                            time: '',
                            area: '',
                            org: ''
                        },
                        mgt: {
                            system: '',
                            profession: '',
                            mechanism: ''
                        },
                        eff: ''
                    };
                    if(data) {
                        html = data;
                    }

                    // 区局简介
                    UM.intro.time = $('#intro-time').data('iiw-umeditor');
                    UM.intro.time.setContent(html.intro.time);

                    UM.intro.area = $('#intro-area').data('iiw-umeditor');
                    UM.intro.area.setContent(html.intro.area);

                    UM.intro.org = $('#intro-org').data('iiw-umeditor');
                    UM.intro.org.setContent(html.intro.org);

                    // 管理模式
                    UM.mgt.system = $('#mgt-system').data('iiw-umeditor');
                    UM.mgt.system.setContent(html.mgt.system);

                    UM.mgt.profession = $('#mgt-profession').data('iiw-umeditor');
                    UM.mgt.profession.setContent(html.mgt.profession);

                    UM.mgt.mechanism = $('#mgt-mechanism').data('iiw-umeditor');
                    UM.mgt.mechanism.setContent(html.mgt.mechanism);

                    // 组织架构
                    UM.eff = $('#eff-editor').data('iiw-umeditor');
                    UM.eff.setContent(html.eff);
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

