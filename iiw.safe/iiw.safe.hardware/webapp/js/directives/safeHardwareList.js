/**
 * Created by YJJ on 2016-03-21.
 */
define([
    'app'
], function(app) {
    app.directive('safeHardwareList', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                //$element.on('resize', resize);
                //
                //function resize() {
                //    $element.stop(true).hide();
                //
                //    var h = $element.height(),
                //        thish = (h - 20) / 3;
                //
                //    $element.find('.safe-hardware-listbox').height(thish).css('font-size', thish);
                //
                //    $element.show('fade');
                //}

                $scope.$watch('hardwareList', function(list) {
                    if(list) {
                        $timeout(function() {
                            var h = $element.parent().height(),
                                thish = (h - 20) / 3;

                            $element.find('.safe-hardware-listbox').height(thish).css('font-size', thish);
                            $element.show();
                        },300);
                    }
                });

            }
        }
    }]);
});