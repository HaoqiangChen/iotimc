/**
 * 访谈APP问卷设计
 * Created by chq on 2019-10-16.
 */
define([
    'app',
    'cssloader!system/ftappquestionnaire/css/index.css'
], function (app) {
    app.controller('ftappQuestionnaireController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '问卷设计';

        $scope.getList = function () {
        };

        // 模块加载完成后初始化事件
        $scope.$on('ftappQuestionnaireControllerOnEvent', function () {
            $scope.getList();
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
