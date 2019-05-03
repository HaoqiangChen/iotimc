define([
    'app',
    'cssloader!safe/test/css/index',
    // 'safe/js/services/safeImcsPlayer',
], function (app) {
    app.controller('testController', ['$scope', function ($scope) {
        safeMainTitle.title = '模块开发测试';

        $scope.modules = [
            {status: true, name: '社矫人员定位', href: 'sjposition', icon: 'fa-map-marker'},
            {status: true, name: 'GIS地图', href: 'gis', icon: 'fa-compass'},
            {status: true, name: '天地图', href: 'tdt', icon: 'fa-map'},
            {status: true, name: '广西天地图', href: 'tdtgx', icon: 'fa-arrows'}
        ];
        $scope.windowZoom = 100;

        // 模块跳转
        $scope.jumpModule = function (router) {
            window.location = '#/safe/' + router;
        };

        //获取当前页面的缩放值
        $scope.detectZoom = function () {
            var ratio = 0,
                screen = window.screen,
                ua = navigator.userAgent.toLowerCase();

            if (window.devicePixelRatio !== undefined) {
                ratio = window.devicePixelRatio;
            } else if (~ua.indexOf('msie')) {
                if (screen.deviceXDPI && screen.logicalXDPI) {
                    ratio = screen.deviceXDPI / screen.logicalXDPI;
                }
            } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
                ratio = window.outerWidth / window.innerWidth;
            }

            if (ratio) {
                ratio = Math.round(ratio * 100);
            }
            console.log(ratio)
            if (ratio != 100) {
                // _remind(3, '你当前页面缩放比例不正确，请手动调整', '缩放比例不正确')
                iMessage.show({
                    level: 3,
                    title: '缩放比例不正确',
                    content: '你当前页面缩放比例不正确，请手动调整',
                    timeout: '0'
                })
            }
        };

        $scope.$on('testControllerOnEvent', function () {
            $scope.detectZoom()
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
