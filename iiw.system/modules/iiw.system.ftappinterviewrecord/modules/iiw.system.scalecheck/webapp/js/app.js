/**
 * 访谈APP量表查看
 * Created by chq on 2019-08-19.
 */
define([
    'app',
    'cssloader!system/ftappinterviewrecord/css/loading',
    'cssloader!system/scalecheck/css/index.css',
    'cssloader!system/scalecheck/css/userinfo.css'
], function (app) {
    app.controller('scaleCheckController', ['$scope', '$state', '$stateParams', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, $stateParams, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '量表查看';
        $scope.record = {};
        $scope.wjData = {};
        $scope.userDetails = {};
        $scope.answerList = [];
        $scope.score = {};

        if ($stateParams.data) {
            $scope.record = $stateParams.data;
        }

        $scope.scalecheck = {

            getWjData: function () {
                $scope.loading = {
                    isLoading: true,
                    content: '量表数据加载中'
                };

                var url, data;
                url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=getQuestionNaireDetail';
                data = {
                    filter: {
                        id: $scope.record.questionnairefk,
                        recordfk: $scope.record.id
                    }
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            // console.log(data);
                            if (data.result && data.result.rows) {
                                $scope.wjData = data.result.rows[0];
                                console.log($scope.wjData);
                                $scope.answerList = $scope.wjData.question;

                                if (!$scope.answerList.length) {
                                    iConfirm.show({
                                        scope: $scope,
                                        title: '',
                                        content: '抱歉，该量表无数据! 点击确认返回。',
                                        buttons: [{
                                            text: '确认',
                                            style: 'button-primary',
                                            action: 'scalecheck.confirmSuccess'
                                        }]
                                    });
                                }

                                $scope.userDetails = $scope.wjData.userdetail;

                                $scope.scalecheck.getScore();
                                $scope.loading.isLoading = false;

                            }
                        })
                })
            },

            getScore: function () {
                var url, data;
                url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=getQuestionNaireScore';
                data = {
                    filter: {
                        id: $scope.record.id
                    }
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            console.log(data);
                            if (data.result && data.result.rows) {
                                $scope.score = data.result.rows[0];

                                $scope.score.weidu.map(_a => {
                                    _a.alone = []
                                    _a.rows.map(_b => {
                                        if (_b.alone === 'Y') {
                                            _a.alone.push(_b)
                                        }
                                    })
                                    _a.rows = _a.rows.filter(v => v.alone !== 'Y')
                                })
                            }
                        })
                })
            },

            confirmSuccess: function (id) {
                $scope.scalecheck.back();
                iConfirm.close(id);
            },

            audit: function () {
                console.log('审核通过')
            },
            reinvestigation: function () {
                console.log('重新调查')
            },
            back: function () {
                $state.go('system.ftappinterviewrecord');
            }
        };

        $scope.$on('scaleCheckControllerOnEvent', function () {
            $scope.scalecheck.getWjData();
        });

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            })
        }

        function getUrlParam(param) {
            return decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line
        }

        function _remind(level, content, title) {
            var message = {
                id: new Date(),
                level: level,
                title: (title || '消息提醒'),
                content: content
            };

            iMessage.show(message, false);
        }
    }]);
});
