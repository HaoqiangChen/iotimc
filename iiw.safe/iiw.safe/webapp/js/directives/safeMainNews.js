/**
 * 最新消息提醒指令
 *
 * Created by YJJ on 2015-11-06.
 */
define(['app'], function(app) {
    app.directive('safeMainNews', [function() {
        return {
            restrict: 'E',
            compile: function($element) {
                return {
                    post: function(scope) {
                        scope.$watch('news', function(newvalue) {
                            $element.stop(true).animate({
                                top: -30,
                                opacity: 0
                            }, 500, function() {
                                $element.text(newvalue).stop(true).css('top', 30).animate({
                                    top: 0,
                                    opacity: 1
                                }, 500);
                            });
                            $element.attr('title', newvalue);
                        });
                    }
                }
            }
        }
    }]);
});