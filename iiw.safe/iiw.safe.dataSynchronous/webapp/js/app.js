define([
    'app',
    'cssloader!safe/dataSynchronous/css/index.css'
], function(app) {
    app.controller('dataSynchronousController', ['$rootScope', '$scope', '$state', 'iAjax', 'iMessage', '$filter', 'iToken', 'safeConfigService', 'safeMainTitle',
        function($rootScope, $scope, $state, iAjax, iMessage, $filter, iToken, safeConfigService, safeMainTitle) {

            var terminalServerURL = null;
            safeMainTitle.title = '数据同步管理';

            $scope.modulesRows = {
                third: {
                    role: false,
                    name: 'third',
                    modouleName: '第三方数据中心业务',
                    modouleIcon: 'fa-database'
                },
                monitor: {
                    role: false,
                    name: 'monitor',
                    modouleName: '监控平台的监控通道',
                    modouleIcon: 'fa-sitemap'
                },
            };

            /**
             * 跳转到指定模块；
             * @param page
             */
            $scope.jumpToPageDetail = function(page) {
                switch (page) {
                    case 'ceshi':
                        window.location = '#/safe/ceshi';
                        break;
                    default:
                        $scope.detailShow = true;
                        $state.go('safe.dataSynchronous.' + page);
                        break;
                }
            };

        }
    ]);
});
