/**
 * 日常事务指令
 *
 * Created by YBW on 2016-11-8.
 */
define(['app'], function(app) {
    app.directive('timeMask', [function() {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, $element) {
                $element.on('keydown', function(event) {
                    if((event.keyCode < 48 && event.keyCode != 8) || event.keyCode > 57) {
                        return false;
                    }
                });
            }
        }
    }]);
});