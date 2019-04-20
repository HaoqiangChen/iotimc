/**
 * Created by YJJ on 2016-03-22.
 */
define([
    'app',
    'safe/hardware/list/lib/icheck/icheck.min',
    'cssloader!safe/hardware/list/lib/icheck/blue'
], function(app) {
    app.directive('safeHardwareListCheck', [function() {
        return {
            restrict: 'A',
            scope: {
                value: '=ngModel'
            },
            link: function($scope, $element, attr) {
                $element.iCheck({
                    checkboxClass: 'icheckbox_square-blue'
                });

                $scope.$watch('value', function(value) {
                    if(typeof value == 'boolean') {
                        if(value) {
                            $element.iCheck('uncheck');
                            $element.iCheck('check');
                        } else {
                            $element.iCheck('check');
                            $element.iCheck('uncheck');
                        }
                    }
                });

                $element.on('ifChecked', function() {
                    if(attr.checkevent) {
                        $scope.$parent.$eval(attr.checkevent + '(true)');
                    }
                });

                $element.on('ifUnchecked', function() {
                    if(attr.checkevent) {
                        $scope.$parent.$eval(attr.checkevent + '(false)');
                    }
                });
            }
        }
    }]);
});