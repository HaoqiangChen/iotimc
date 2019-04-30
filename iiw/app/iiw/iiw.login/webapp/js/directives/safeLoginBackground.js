/**
 * 登录界面背景
 *
 * Created by YJJ on 2015-12-15.
 */
define([
    'app'
], function(app) {
    app.directive('safeLoginBackground', [function() {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($scope, $element) {
                        $element.html('<video src="' + $.soa.getWebPath('iiw.login') + '/img/bg.mp4' + '" autoplay loop></video>');
                    }
                }
            }
        }
    }]);
});
