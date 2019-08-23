define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min',
    'safe/plugins/bid/lib/echarts-gl/1.0.0/echarts-gl.min',
    'safe/plugins/bid/js/services/safeBidEarthData',
    'cssloader!safe/plugins/bid/css/loading/3'
], function(app, echarts) {
    app.directive('safeBidLoading.3', ['iAjax', 'iConfig', '$interval', '$timeout', 'safeBidEarthData', function(iAjax, iConfig, $interval, $timeout, safeBidEarthData) {
        var _template = iAjax.getTemplate('iiw.safe.plugins.bid', '/view/layout/loading-layout-3.html');

        return {
            restrict: 'E',
            template: _template,
            replace: true,
            scope: true,
            link: function($scope, $element) {

                var value = 0,
                    target = null,
                    _chart = echarts.init($element.find('.safe-bid-loading-earth').get(0)),
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
                            autoRotateSpeed: 20,
                            autoRotateAfterStill: 0.01,
                            rotateSensitivity: 0,
                            zoomSensitivity: 0,
                            panSensitivity: 0,
                            distance: 150,
                            animationDurationUpdate: 2000,
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
                    series: []
                };

                _chart.setOption(_option);

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

                $timeout(function() {
                    $('.safe-bid-loading-1-bg').show('fade', 3000);
                    $('.safe-bid-loading-earth').addClass('upAnimation');
                    $('.safe-bid-loading-text').addClass('animation');

                    $scope.sendMessage('safe.bid.loading.value', 20);
                }, 250);

                target = $interval(function() {
                    if(value < 100) {
                        if(value < $scope.layoutService.progress) {
                            $('.safe-bid-loading-1-content').text(++value + '%');
                        }
                    } else {
                        // $('.safe-bid-index').css('top' , '0px');
                        $('.safe-bid-menu').show();

                        $('.loading-animation-text').hide('fade', 1000);

                        _option.globe.viewControl.autoRotate = false;
                        _option.globe.viewControl.distance = 150;
                        _option.globe.viewControl.targetCoord = [108.55, 34.32];

                        _chart.setOption(_option);

                        $('.safe-bid-loading-earth').addClass('zoomAnimation');

                        $timeout(function() {
                            $('.safe-bid-loading').hide('fade', 1000, function() {
                                $('.safe-bid-index-bg').show().addClass('animation');

                                $scope.sendMessage('safe.bid.loading.success');
                            });
                        }, 1500);

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