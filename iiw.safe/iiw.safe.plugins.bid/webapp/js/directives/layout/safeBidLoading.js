define([
    'app'
], function(app) {
    app.directive('safeBidLoading', ['$compile', '$timeout', 'iConfig', function($compile, $timeout, iConfig) {
        return {
            restrict: 'E',
            template: '<div class="safe-bid-loading"></div>',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var path = 'safe/plugins/bid/js/directives/layout/safeBidLoading.0';
                require([path], function() {
                    $element.html('<safe-bid-loading.0/>');
                    $compile($element.contents())($scope);
                }, function() {
                    console.error('iiw.safe.bid: layout loading error!');
                });

                $scope.$on('safe.bid.loading.success', function() {
                    $timeout(function() {
                        $scope.$destroy();
                        $('.safe-bid-loading').remove();
                    }, 250);
                });
            }
        }
    }]);
});