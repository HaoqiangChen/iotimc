/**
 * 监控单个画面指令，提供每一个监控画面的相关操作功能和联动功能
 *
 * Created by YJJ on 2015-11-10.
 */
define([
    'app',
    'hammer',
    'safe/js/services/safeVideoObject'
], function(app, Hammer) {
    app.directive('safeVideo', ['$interval', '$timeout', 'safeVideoObject', function($interval, $timeout, safeVideoObject) {

        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function(data) {
                result = data;
            });

            return result;
        }

        var _template = getTemplate($.soa.getWebPath('iiw.safe') + '/view/videoobject.html');

        return {
            restrict: 'E',
            template: _template,
            compile: function() {
                return {
                    post: function($scope, $element) {
                        safeVideoObject.create($scope, $element);

                        var elementTouchHammer = new Hammer($element.get(0)),
                            isTouchCloseEvent = false,
                            isTouchMaxEvent = false;

                        $scope.$on('$destroy', function() {
                            if(elementTouchHammer) {
                                elementTouchHammer.destroy();
                                elementTouchHammer = null;
                            }
                        });

                        var timer = null;

                        $element.dblclick(function() {
                            clearTimeout(timer);
                            $scope.max(parseInt($element.attr('index')));
                        });

                        $element.click(function() {
                            clearTimeout(timer);
                            timer = setTimeout(function() {
                                $scope.selectByIndex(parseInt($element.attr('index')));
                            }, 300);
                        });

                        elementTouchHammer.get('pinch').set({enable: true});

                        elementTouchHammer.on('pinchstart', function() {
                            $scope.select = parseInt($element.attr('index'));
                            isTouchMaxEvent = false;
                        });

                        elementTouchHammer.on('pinchout', function(e) {
                            if(e.distance > 10) {
                                isTouchMaxEvent = true;
                            }
                        });

                        elementTouchHammer.on('pinchend', function() {
                            if(isTouchMaxEvent) {
                                $scope.max();
                            }
                        });

                        elementTouchHammer.on('panstart', function() {
                            $scope.select = parseInt($element.attr('index'));
                            $scope.hideSelect();
                            isTouchCloseEvent = false;
                        });

                        elementTouchHammer.on('panup', function(e) {
                            if(e.distance > 200) {
                                isTouchCloseEvent = true;
                            }
                        });

                        elementTouchHammer.on('panend', function(e) {
                            if(isTouchCloseEvent) {
                                if(touchClose(e)) return;
                            }

                            if(touchMove(e)) return;
                        });

                        function touchClose(e) {
                            var p = e.center;
                            var target = document.elementFromPoint(p.x, p.y);
                            if(target.localName == 'canvas') {
                                target = target.parentElement;
                            }
                            if(target && target.localName != 'safe-video') {
                                $scope.close($scope.select);
                                $scope.hideSelect();
                                return true;
                            }
                        }

                        function touchMove(e) {
                            var p = e.center;
                            var target = document.elementFromPoint(p.x, p.y);
                            if(target.localName == 'canvas') {
                                target = target.parentElement;
                            }
                            if($element.get(0) === target) return false;
                            if(target && target.localName == 'safe-video') {
                                var $src = $element,
                                    $srcVideo = $($src.data('data-video')),
                                    ssrc = $srcVideo.attr('src') || '',
                                    $target = $(target),
                                    $targetVideo = $($target.data('data-video')),
                                    tsrc = $targetVideo.attr('src') || '';

                                if(tsrc) {
                                    $src.find('canvas').hide();
                                    $srcVideo.attr('src', tsrc);
                                    $src.find('.video-loading').show();
                                }else {
                                    $scope.close($scope.select);
                                }

                                if(ssrc) {
                                    $target.find('canvas').hide();
                                    $targetVideo.attr('src', ssrc);
                                    $target.find('.video-loading').show();
                                }else {
                                    $scope.close(parseInt($target.attr('index')));
                                }
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }]);
});