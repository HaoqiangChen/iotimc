/**
 * 模块开发测试
 * Created by chq on 2019/10/10.
 */
define([
    'app',
    'cssloader!safe/test/css/index'
], function (app) {
    app.controller('testController', ['$scope', '$state', '$uibModal', 'safeMainTitle', 'iAjax', 'safeDispatcher', '$rootScope', 'iTimeNow', 'iMessage', '$timeout', function ($scope, $state, $uibModal, safeMainTitle, iAjax, safeDispatcher, $rootScope, iTimeNow, iMessage, $timeout) {
        safeMainTitle.title = '模块开发测试';

        $scope.modules = [
            {status: true, name: '社矫人员定位', href: 'sjposition', icon: 'fa-map-marker'},
            {status: true, name: 'GIS地图', href: 'gis', icon: 'fa-compass'},
            {status: true, name: '天地图', href: 'tdt', icon: 'fa-map'},
            {status: true, name: '广西天地图', href: 'tdtgx', icon: 'fa-arrows'}
        ];


        // 模块跳转
        $scope.jumpModule = function (router) {
            window.location = '#/safe/' + router;
        };

        $scope.$on('testControllerOnEvent', function () {
            // $state.go('safe.sjposition');
        });


        // 全局的消息提醒服务
        function _remind(level, content, title) {
            var message = {
                id: iTimeNow.getTime(),
                title: (title || '消息提醒！'),
                level: level,
                content: (content || '')
            };
            iMessage.show(message, false);
        }

        // 获取URL参数
        function getUrlParam(param) {
            return decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null;
        }

    }]);
});
