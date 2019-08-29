/**
 * 问卷查看
 * Created by chq on 2019-08-19.
 */
define([
    'app',
    'safe/questionnairecheck/lib/BenzAMRRecorder',
    'cssloader!safe/questionnairecheck/css/index',
    'cssloader!safe/questionnairecheck/css/loading',
    'cssloader!safe/questionnairecheck/css/userinfo',
    'cssloader!safe/questionnairecheck/css/answerlist',
], function (app, BenzAMRRecorder) {
    app.controller('questionnairecheckController', ['$scope', '$state', '$element', '$stateParams', '$location', '$anchorScroll', 'iMessage', 'iConfirm', 'yjtService', 'iAjax', '$compile', '$filter', '$timeout', function ($scope, $state, $element, $stateParams, $location, $anchorScroll, iMessage, iConfirm, yjtService, iAjax, $compile, $filter, $timeout) {
        $scope.record = {};
        $scope.wjData = {};
        $scope.userDetails = {};
        $scope.answerList = [];
        $scope.songReady = false;
        $scope.hasAudio = false;
        $scope.playText = '播放';

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
                        id: $scope.record.questionnairefk,
                        recordfk: $scope.record.id
                    }
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            console.log(data);
                            if (data.result && data.result.rows) {

                                $scope.answerList = data.result.rows;

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

                                if ($scope.userDetails.fileurl) {
                                    $scope.hasAudio = true;
                                }

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
                            $scope.loading.isLoading = false;
                        })
                });

            },

            confirmSuccess: function (id) {
                $scope.questionnairecheck.back();
                iConfirm.close(id);
            },

            confirmCancel: function (id) {
                iConfirm.close(id);
            },

            togglePlaying: function () {
                let amr = new BenzAMRRecorder();
                $scope.loading = {
                    isLoading: true,
                    content: 'amr录音文件加载转码中'
                };
                var fileUrl = `http://iotimc8888.goho.co:17783/security/deviceComm.do?action=getFileDetail&authorization=${token}&url=${$scope.userDetails.fileurl}`;
                console.log(fileUrl);
                amr.initWithUrl(fileUrl).then(function () {
                    $scope.loading.isLoading = false;
                    if (amr.isPlaying()) {
                        amr.stop()
                    } else {
                        amr.play();
                        $scope.playText = '停止';
                    }
                }).catch(function () {
                    _remind(4, 'amr录音文件加载转码失败，请查看网络问题')
                });
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
                });

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
                });

            },

            scrollTo: function (el) {
                var iscroll = $element.find('.questionnaire-container').data('i-scroll');
                iscroll.scrollToElement(`#${el}`, 1000);
                // $location.hash(el);
                // $anchorScroll();
            },

            tempS: '',
            mouseOver: function () {
                this.tempS = $timeout(function () {
                    $('.safe-questionnairecheck-shortcut').find('li.link').each(function (i) {
                        var tA = $(this);
                        $timeout(function () {
                            tA.animate({right: '-230'}, 300);
                        }, 50 * i);
                    });
                }, 200);
            },
            mouseLeave: function () {
                if (this.tempS) {
                    $timeout.cancel(this.tempS);
                }
                $('.safe-questionnairecheck-shortcut').find('li.link').each(function (i) {
                    var tA = $(this);
                    $timeout(function () {
                        tA.animate({right: '0'}, 300, function () {
                        });
                    }, 50 * i);
                });
            },

            back: function () {
                $state.go('safe.questionnaire');
            }
        };

        $scope.$on('questionnairecheckControllerOnEvent', function () {
            $scope.questionnairecheck.getWjData();
        });

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
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
