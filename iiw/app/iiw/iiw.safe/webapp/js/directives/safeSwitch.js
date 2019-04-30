/**
 * Bootstrap开关控件
 *
 * Created by YJJ on 2015-12-11.
 */
define([
    'app',
    'safe/lib/bootstrap-switch/bootstrap-switch.min',
    'cssloader!safe/lib/bootstrap-switch/bootstrap-switch.min'
], function(app) {
    app.directive('safeSwitch', [function() {
        return {
            restrict: 'A',
            link: function($scope, $element, attrs) {
                $element.bootstrapSwitch();
                $element.on('switchChange.bootstrapSwitch', function(e, s) {
                    if($element.attr('bootstrapSwitchState') != (s+'')) {
                        $scope.$eval(attrs.ngModel + ' = ' + s);
                        $scope.$eval(attrs.ngChange);
                        $element.attr('bootstrapSwitchState', (s+''));
                    }
                });
            }
        }
    }]);
});