/**
 * 登录界面背景
 *
 * Created by YJJ on 2015-12-15.
 */
define([
    'app',
    'login/lib/flux.min'
], function(app, flux) {
    app.directive('safeLoginBackground', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($scope, $element) {
                        var slider;

                        $('body').hide();
                        $timeout(function() {
                            slider = new flux.slider($element, {
                                pagination: false,
                                transitions: ['explode', 'tiles3d', 'bars3d', 'cube', 'turn'],
                                delay: 10 * 1000
                            });
                            $('body').fadeIn(500);
                        }, 500);

                        $scope.$on('$destroy', function() {
                            if(slider) {
                                slider.stop();
                                slider = null;
                            }
                        });
                    }
                }

            }
        }
    }]);
});