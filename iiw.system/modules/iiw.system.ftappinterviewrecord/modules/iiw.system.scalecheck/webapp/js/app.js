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
    app.controller('scaleCheckController', ['$scope', '$state', '$stateParams', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', '$timeout', function ($scope, $state, $stateParams, iAjax, iMessage, iConfirm, mainService, $filter, $timeout) {
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
                url = '/security/wjdc/scale.do?action=getQuestionNaireDetail';
                data = {
                    filter: {
                        id: $scope.record.questionnairefk,
                        recordfk: $scope.record.id
                        // id: 'EB4A88E65A6A4F7BAD5904254A2F3481',
                        // recordfk: 'e6582713c2a14cb3b930d000ace864be'
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        // console.log(data);
                        if (data.result && data.result.rows) {
                            $scope.wjData = data.result.rows[0];
                            console.log($scope.wjData);
                            $scope.answerList = $scope.wjData.question;
                            // console.log($scope.answerList);

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
                            if ($scope.userDetails.interviewercode) $scope.userDetails.interviewercode = $scope.userDetails.interviewercode.split('');
                            if ($scope.userDetails.supervisorcode) $scope.userDetails.supervisorcode = $scope.userDetails.supervisorcode.split('');
                            if ($scope.userDetails.bm) $scope.userDetails.bm = $scope.userDetails.bm.split('');

                            $scope.scalecheck.getScore();
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
                                action: 'scalecheck.confirmSuccess'
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
                        // id: 'e6582713c2a14cb3b930d000ace864be'
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
                $scope.scalecheck.back();
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
                        console.log(data);
                        if (data.status === 1) {
                            $scope.loading.isLoading = false;
                            _remind(1, '审核提交成功');
                            $timeout(function () {
                                $scope.scalecheck.back();
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
                                action: 'scalecheck.confirmSuccess'
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
                        action: 'scalecheck.confirmAgain'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'scalecheck.confirmCancel'
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
                        // console.log(data);
                        if (data.status === 1) {
                            $scope.loading.isLoading = false;
                            _remind(1, '问卷返回重新调查成功');
                            $timeout(function () {
                                $scope.scalecheck.back();
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
                                action: 'scalecheck.confirmSuccess'
                            }]
                        });
                    })
            },

            back: function () {
                $state.go('system.ftappinterviewrecord');
            }
        };

        $scope.$on('scaleCheckControllerOnEvent', function () {
            $scope.scalecheck.getWjData();
        });

        function getToken(callback) {
            iAjax.post('/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
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
