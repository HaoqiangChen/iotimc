/**
 * Created by YJJ on 2016-07-05.
 */
define(['app', 'hammer'], function(app, Hammer) {
    app.directive('safeMainMenuScroll', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            compile: function($element) {
                $timeout(function() {
                    var oScroll = $element.data('i-scroll');
                    if(oScroll) {
                        var max = oScroll.maxScrollX;

                        if(max) {
                            right();

                            oScroll.on('scrollEnd', function() {
                                hide();

                                if(oScroll.x) left();
                                if(oScroll.x != max) right();
                            });

                            var leftHammer = new Hammer($('.safe-main-menu-scroll-left').get(0));
                            leftHammer.on('tap', function() {
                                var value = oScroll.x + $element.width();
                                if(value >= 0) value = 0;
                                oScroll.scrollTo(value, 0, 500);
                            });

                            var rightHammer = new Hammer($('.safe-main-menu-scroll-right').get(0));
                            rightHammer.on('tap', function() {
                                var value = oScroll.x - $element.width();
                                if(value < max) value = max;
                                oScroll.scrollTo(value, 0, 500);
                            });
                        }
                    }
                }, 3000);

                function hide() {
                    $('.safe-main-menu-scroll-left').stop(true).hide('fade');
                    $('.safe-main-menu-scroll-right').stop(true).hide('fade');
                }
                
                function left() {
                    $('.safe-main-menu-scroll-left').stop(true).show('fade');
                }

                function right() {
                    $('.safe-main-menu-scroll-right').stop(true).show('fade');
                }
            }
        }
    }]);
});