/**
 * 日常事务指令
 *
 * Created by YBW on 2016-11-8.
 */
define(['app'], function(app) {
    app.directive('ouSwitch', [function() {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, $element) {
                $element.on('click', function() {
                    if($('.button-dropdown-list').css('display') == 'none') {
                        $('.button-dropdown-list').show();
                    } else {
                        $('.button-dropdown-list').hide();
                    }
                });
            }
        }
    }]);
});