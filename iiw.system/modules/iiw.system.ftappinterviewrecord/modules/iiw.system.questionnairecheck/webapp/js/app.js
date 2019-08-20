/**
 * 访谈APP问卷查看
 * Created by chq on 2019-07-10.
 */
define([
    'app',
    'cssloader!system/ftappinterviewrecord/css/loading',
    'cssloader!system/questionnairecheck/css/index.css'
], function (app) {
    app.controller('questionnaireCheckController', ['$scope', '$state', '$stateParams', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, $stateParams, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '问卷查看';
        $scope.userDetails = {};
        $scope.wjData = {};

        if ($stateParams.data) {
            $scope.userDetails = $stateParams.data;
        }

        $scope.questionnairecheck = {

            getWjData: function () {
                $scope.loading = {
                    isLoading: true,
                    content: '问卷数据加载中'
                };

                var url, data;
                url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=getQuestionNaireDetail';
                data = {
                    filter: {
                        id: $scope.userDetails.questionnairefk,
                        recordfk: $scope.userDetails.id
                    }
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            console.log(data);
                            // if (data.result && data.result.rows) {
                            //     $scope.record.list = data.result.rows;
                            // } else {
                            //     $scope.record.list = [];
                            // }
                        })
                })
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
