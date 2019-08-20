/**
 * 最新提醒指令
 *
 * Created by YJJ on 2015-11-06.
 */
define(['app'], function(app) {
    app.directive('safeMainTips', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            compile: function($element, attr) {
                $element.addClass('animated');
                return {
                    post: function(scope) {
                        scope.$watch(attr.watch, function() {
                            $element.removeClass('wobble');

                            $timeout(function() {
                                $element.addClass('wobble')
                            }, 100);
                        });
                    }
                }
            }
        }
    }]);
});