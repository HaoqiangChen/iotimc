/**
 * 访谈APP问卷查看
 * Created by chq on 2019-07-10.
 */
define([
    'app',
    'cssloader!system/ftappinterviewrecord/css/loading',
    'cssloader!system/questionnairecheck/css/index.css',
    'cssloader!system/scalecheck/css/userinfo.css'
], function (app) {
    app.controller('questionnaireCheckController', ['$scope', '$state', '$stateParams', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', '$timeout', function ($scope, $state, $stateParams, iAjax, iMessage, iConfirm, mainService, $filter, $timeout) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '问卷查看';
        $scope.record = {};
        $scope.wjData = {};
        $scope.userDetails = {};
        $scope.answerList = [];

        if ($stateParams.data) {
            $scope.record = $stateParams.data;
        }

        $scope.questionnairecheck = {

            getWjData: function () {
                $scope.loading = {
                    isLoading: true,
                    content: '问卷数据加载中'
                };

                var url, data;
                url = 'http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=getQuestionsResult';
                data = {
                    filter: {
                        // id: $scope.record.questionnairefk,
                        // recordfk: $scope.record.id
                        id: 'B701AB0474BE475B8CF22E6152B9FC01',
                        recordfk: '96bed42c135d4a8385b80a63f0b69e9f'
                    }
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            if (data.result && data.result.rows) {
                                console.log(data.result);

                                $scope.answerList = data.result.rows;
                                console.log($scope.answerList);

                                if (!$scope.answerList.length) {
                                    iConfirm.show({
                                        scope: $scope,
                                        title: '',
                                        content: '抱歉，该问卷无数据! 点击确认返回。',
                                        buttons: [{
                                            text: '确认',
                                            style: 'button-primary',
                                            action: 'questionnairecheck.confirmSuccess'
                                        }]
                                    });
                                }

                                $scope.wjData = data.result.detail;

                                $scope.userDetails = data.result.userdetail;
                                if ($scope.userDetails.interviewercode) $scope.userDetails.interviewercode = $scope.userDetails.interviewercode.split('');
                                if ($scope.userDetails.supervisorcode) $scope.userDetails.supervisorcode = $scope.userDetails.supervisorcode.split('');
                                if ($scope.userDetails.bm) $scope.userDetails.bm = $scope.userDetails.bm.split('');

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
                url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=modTalkRecord';
                data = {
                    filter: {
                        id: $scope.record.id,
                        fileUrl: $scope.record.fileurl
                    }
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            console.log(data);
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
                })
            },
            reinvestigation: function () {
                console.log('重新调查');
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
                url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=modTalkRecord';
                data = {
                    filter: {
                        id: $scope.record.id,
                        fileUrl: $scope.record.fileurl,
                        status: 'N'
                    }
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            console.log(data);
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
                })
            },

            back: function () {
                $state.go('system.ftappinterviewrecord');
            }
        };

        $scope.$on('questionnaireCheckControllerOnEvent', function () {
            $scope.questionnairecheck.getWjData();
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
