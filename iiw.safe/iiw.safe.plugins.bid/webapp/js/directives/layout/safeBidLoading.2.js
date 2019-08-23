define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min',
    'safe/plugins/bid/lib/echarts-gl/1.0.0/echarts-gl',
    'safe/plugins/bid/js/services/safeBidEarthData',
    'cssloader!safe/plugins/bid/css/loading/2'
], function(app, echarts) {
    app.directive('safeBidLoading.2', ['iAjax', '$interval', '$timeout', 'safeBidEarthData', function(iAjax, $interval, $timeout, safeBidEarthData) {
        var _template = iAjax.getTemplate('iiw.safe.plugins.bid', '/view/layout/loading-layout-2.html');

        return {
            restrict: 'E',
            template: _template,
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var value = 0,
                    target = null,
                    _chart = echarts.init($element.find('.safe-bid-loading-2-earth').get(0)),
                    _option;

                _option = {
                    globe: {
                        baseTexture: safeBidEarthData.baseImage,
                        heightTexture: safeBidEarthData.heightImage,
                        displacementScale: 0.01,
                        shading: 'lambert',
                        light: {
                            ambient: {
                                intensity: 0.1
                            },
                            main: {
                                intensity: 1.5
                            }
                        },
                        viewControl: {
                            autoRotateSpeed: 10,
                            autoRotateAfterStill: 0.01,
                            rotateSensitivity: 0,
                            zoomSensitivity: 0,
                            panSensitivity: 0,
                            distance: 400,
                            animationDurationUpdate: 3000,
                            animationEasingUpdate: 'linear'
                        },
                        layers: [{
                            type: 'blend',
                            blendTo: 'emission',
                            texture: safeBidEarthData.lightImage
                        }, {
                            type: 'overlay',
                            texture: safeBidEarthData.cloudImage,
                            shading: 'lambert',
                            distance: 5
                        }]
                    },
                    serise: []
                };

                _chart.setOption(_option);

                $scope.sendMessage('safe.bid.loading.value', 20);

                target = $interval(function() {
                    if(value < 100) {
                        if(value < $scope.layoutService.progress) {
                            $('.safe-bid-loading-1-content').text(++value + '%');
                        }
                    } else {
                        $('.safe-bid-loading-1').css('top' , '-100%');
                        $('.safe-bid-loading-2').css('top' , '0%');
                        // $('.safe-bid-index').css('top' , '0px');
                        $('.safe-bid-menu').show();

                        $timeout(function() {
                            $('.safe-bid-loading-2-bg').addClass('show-in');
                        }, 2000);

                        $timeout(function() {
                            _option.globe.viewControl.autoRotate = false;
                            _option.globe.viewControl.distance = 40;
                            _option.globe.viewControl.targetCoord = [108.55, 34.32];

                            _chart.setOption(_option);
                        }, 500);

                        $timeout(function() {
                            $('.safe-bid-loading').hide('fade', 1000, function() {
                                $('.safe-bid-index-bg').show().addClass('animation');

                                $scope.sendMessage('safe.bid.loading.success');
                            });
                        }, 3000);

                        $interval.cancel(target);
                    }
                }, 15);

                $scope.$on('$destroy', function() {
                    if(_chart) {
                        _chart.dispose();
                        _chart = null;
                    }
                });
            }
        }
    }]);
});