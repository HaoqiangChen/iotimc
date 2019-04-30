/**
 * 自动聚焦
 *
 * Created by YJJ on 2015-12-15.
 */
define([
    'app'
], function(app) {
    app.directive('loginFocus', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            compile: function($element) {
                $timeout(function() {
                    $element.focus().select();
                }, 1000);
            }
        }
    }]);
});