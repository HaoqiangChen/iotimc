/**
 * Created by zhs on 2018-09-25.
 *
 * 临时投标演示
 *
 * 1、
 * 2、
 *
 */
define([
    'app',
    'safe/plugins/bid/js/services/safeBidLayout',
    'safe/plugins/bid/js/services/safeBidData',
    'safe/plugins/bid/js/services/safeBidUserinfo',
    'safe/plugins/bid/lib/gsap/utils/SplitText.min',
    'safe/plugins/bid/lib/gsap/TweenMax.min',
    'safe/plugins/bid/lib/gsap/TweenLite.min',
    'safe/plugins/bid/lib/gsap/plugins/ScrambleTextPlugin.min',
    'safe/plugins/bid/lib/gsap/plugins/PixiPlugin.min',
    'cssloader!safe/plugins/bid/lib/font-awesome/4.7.0/css/font-awesome.min',
    'cssloader!safe/plugins/bid/css/index',
    'cssloader!safe/plugins/bid/css/details'
], function(app) {
    app.controller('safeBidPluginsController', ['$scope', 'iAjax', 'safeBidLayout', 'safeBidData', 'safeBidUserinfo', function($scope, iAjax, safeBidLayout, safeBidData, safeBidUserinfo) {
        // 同步处理
        iAjax.postSync('sys/web/syrole.do?action=getHomePage', {}).then(function(data) {
            if(data.result && data.result.url == 'safe.datavisual.bid') {
                $scope.dataService = safeBidData;
                $scope.userInfo = safeBidUserinfo.getInfo();

                safeBidLayout.init($scope);

                console.log('iiw.safe.plugins.bid: init!');
            }
        });

        $scope.sendMessage = function(name, data) {
            $scope.$broadcast(name, data);
        };
    }]);

    return 'safeBidPluginsController';
});