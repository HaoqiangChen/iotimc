define([
    'app',
    'safe/plugins/bid/js/directives/layout/safeBidLoadingBottom',
    'cssloader!safe/plugins/bid/css/loading/1'
], function(app) {
    app.directive('safeBidLoading.1', ['iAjax', 'iConfig', '$interval', '$timeout', function(iAjax, iConfig, $interval, $timeout) {
        var _template = iAjax.getTemplate('iiw.safe.plugins.bid', '/view/layout/loading-layout-1.html');

        return {
            restrict: 'E',
            template: _template,
            replace: true,
            scope: true,
            link: function($scope) {
                var value = 0,
                    target = null;

                $scope.titles = {
                    title: '',
                    subtitle: ''
                };

                if(iConfig.get('title')) {
                    $scope.titles.title = iConfig.get('title').content;
                    document.title = $scope.titles.title || '';
                }

                if(iConfig.get('subtitle')) {
                    $scope.titles.subtitle = iConfig.get('subtitle').content;
                    document.title += ' - ' + ($scope.titles.subtitle || '');
                }

                $scope.sendMessage('safe.bid.loading.value', 20);

                target = $interval(function() {
                    if(value < 100) {
                        if(value < $scope.layoutService.progress) {
                            $('.safe-bid-loading-1-content').text(++value + '%');
                        }
                    } else {
                        $('.safe-bid-loading-1').fadeOut(500, function() {
                            $('.safe-bid-loading-2').fadeIn(500, function() {
                                $('.safe-bid-loading-2 h1, .safe-bid-loading-2 h3, .safe-bid-loading-2-logo').show();
                                $('.safe-bid-loading-2').addClass('animation');

                                $scope.$broadcast('safe.bid.loading.2');

                                $timeout(function() {
                                    // $('.safe-bid-loading, .safe-bid-index').addClass('loadingAnimation');
                                    $('.safe-bid-menu').show();

                                    $timeout(function() {
                                        // $('.safe-bid-menu').show();

                                        // $('.safe-bid-index').css('top', '0');

                                        // $('.safe-bid-index-bg').show().addClass('animation');

                                        $scope.sendMessage('safe.bid.loading.success');
                                    }, 1000);
                                }, 1000 * 3);
                            });
                        });
                        $interval.cancel(target);
                    }
                }, 15);
            }
        }
    }]);
});