define([
    'app',
    'safe/plugins/bid/lib/countup/countUp.min',
    ''
], function(app, CountUp) {
    app.directive('safeBidCountup', [function() {
        return {
            restrict: 'A',
            scope: {
                value: '=ngValue'
            },
            link: function($scope, $element) {
                var count;
                $scope.$watch('value', function(value) {
                    if(count) {
                        count.update(value);
                    } else {
                        count = new CountUp($element.get(0), 0, value || 0, 0, 2, {
                            useEasing: true,
                            useGrouping: true,
                            separator: ',',
                            decimal: '.'
                        });
                        count.start();
                    }
                });

                $scope.$on('$destroy', function() {
                    count = null;
                });
            }
        }
    }]);
});