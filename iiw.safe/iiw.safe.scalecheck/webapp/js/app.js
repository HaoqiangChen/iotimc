/**
 * 量表查看
 * Created by chq on 2019-08-19.
 */
define([
    'app',
    'cssloader!safe/questionnairecheck/css/index',
    'cssloader!safe/questionnairecheck/css/loading',
    'cssloader!safe/questionnairecheck/css/userinfo'
], function (app) {
    app.controller('questionnairecheckController', ['$scope', '$state', '$stateParams', 'iMessage', 'iConfirm', 'yjtService', 'iAjax', '$compile', '$filter', '$timeout', function ($scope, $state, $stateParams, iMessage, iConfirm, yjtService, iAjax, $compile, $filter, $timeout) {
        $scope.record = {};
        $scope.wjData = {};
        $scope.userDetails = {};
        $scope.answerList = [];
        $scope.score = {};

        if ($stateParams.data) {
            $scope.record = $stateParams.data;
        }

        $scope.questionnairecheck = {

            getWjData: function () {
                $scope.loading = {
                    isLoading: true,
                    content: '量表数据加载中'
                };

                var url, data;
                url = '/security/wjdc/scale.do?action=getQuestionNaireDetail';
                data = {
                    filter: {
                        id: $scope.record.questionnairefk,
                        recordfk: $scope.record.id
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        // console.log(data);
                        if (data.result && data.result.rows) {
                            $scope.wjData = data.result.rows[0];
                            $scope.answerList = $scope.wjData.question;

                            if (!$scope.answerList.length) {
                                iConfirm.show({
                                    scope: $scope,
                                    title: '',
                                    content: '抱歉，该量表无数据! 点击确认返回。',
                                    buttons: [{
                                        text: '确认',
                                        style: 'button-primary',
                                        action: 'questionnairecheck.confirmSuccess'
                                    }]
                                });
                            }

                            $scope.userDetails = $scope.wjData.userdetail;
                            if ($scope.userDetails.interviewercode) $scope.userDetails.interviewercode = $scope.userDetails.interviewercode.split('');
                            if ($scope.userDetails.supervisorcode) $scope.userDetails.supervisorcode = $scope.userDetails.supervisorcode.split('');
                            if ($scope.userDetails.bm) $scope.userDetails.bm = $scope.userDetails.bm.split('');

                            $scope.questionnairecheck.getScore();
                            $scope.loading.isLoading = false;

                        }
                    }, function (err) {
                        iConfirm.show({
                            scope: $scope,
                            title: '请求失败',
                            content: '请求失败! 点击确认返回。',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'questionnairecheck.confirmSuccess'
                            }]
                        });
                    })
            },

            getScore: function () {
                var url, data;
                url = '/security/wjdc/scale.do?action=getQuestionNaireScore';
                data = {
                    filter: {
                        id: $scope.record.id
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        // console.log(data);
                        if (data.result && data.result.rows) {
                            $scope.score = data.result.rows[0];

                            $scope.score.weidu.map(_a => {
                                _a.alone = [];
                                _a.rows.map(_b => {
                                    if (_b.alone === 'Y') {
                                        _a.alone.push(_b)
                                    }
                                });
                                _a.rows = _a.rows.filter(v => v.alone !== 'Y')
                            });

                            // console.log($scope.score);
                        }
                    })
            },

            confirmSuccess: function (id) {
                $scope.questionnairecheck.back();
                iConfirm.close(id);
            },

            confirmCancel: function (id) {
                iConfirm.close(id);
            },

            audit: function () {
                $scope.loading = {
                    isLoading: true,
                    content: '提交审核中'
                };

                var url, data;
                url = '/security/wjdc/scale.do?action=modTalkRecord';
                data = {
                    filter: {
                        id: $scope.record.id,
                        fileUrl: $scope.record.fileurl
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.status === 1) {
                            $scope.loading.isLoading = false;
                            _remind(1, '审核提交成功');
                            $timeout(function () {
                                $scope.questionnairecheck.back();
                            }, 300)
                        } else {
                            _remind(4, '审核失败，请重新提交');
                        }
                    }, function (err) {
                        iConfirm.show({
                            scope: $scope,
                            title: '请求失败',
                            content: '请求失败! 点击确认返回。',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'questionnairecheck.confirmSuccess'
                            }]
                        });
                    })
            },
            reinvestigation: function () {
                iConfirm.show({
                    scope: $scope,
                    title: '是否确定重新调查？',
                    content: '重新调查会将问卷打回重新访问，请问是否确定？',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'questionnairecheck.confirmAgain'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'questionnairecheck.confirmCancel'
                    }]
                });
            },
            confirmAgain: function (id) {
                iConfirm.close(id);

                $scope.loading = {
                    isLoading: true,
                    content: '提交重新调查'
                };

                var url, data;
                url = '/security/wjdc/scale.do?action=modTalkRecord';
                data = {
                    filter: {
                        id: $scope.record.id,
                        fileUrl: $scope.record.fileurl,
                        status: 'N'
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.status === 1) {
                            $scope.loading.isLoading = false;
                            _remind(1, '问卷返回重新调查成功');
                            $timeout(function () {
                                $scope.questionnairecheck.back();
                            }, 300)
                        } else {
                            _remind(4, '提交失败，请重新提交');
                        }
                    }, function (err) {
                        iConfirm.show({
                            scope: $scope,
                            title: '请求失败',
                            content: '请求失败! 点击确认返回。',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'questionnairecheck.confirmSuccess'
                            }]
                        });
                    })
            },

            back: function () {
                $state.go('safe.questionnaire');
            }
        };

        $scope.$on('questionnairecheckControllerOnEvent', function () {
            $scope.questionnairecheck.getWjData();
        });

        function getToken(callback) {
            iAjax.post('/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            }, function (err) {
                _remind(4, '请求失败，请查看网络状态!');
                $scope.loading.content = '请求失败，请查看网络状态';
            });
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
