/**
 * 顶层菜单触摸操作指令
 *
 * Created by YJJ on 2015-11-05.
 */
define(['app', 'hammer'], function(app, Hammer) {
    app.directive('safeMainMenuTouch', function() {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($scope, $element, attr) {
                        var isMove = false,
                            oMenu = $('.safe-main-menubar'),
                            oMask = $('.safe-main-mask'),
                            defY = parseFloat(oMenu.css('top')),
                            startY = 0,
                            elementTouchHammer = new Hammer($element.get(0));

                        elementTouchHammer.get('pan').set({
                            direction: Hammer.DIRECTION_VERTICAL
                        });

                        elementTouchHammer.on('panstart', function(e) {
                            isMove = false;
                            $('.safe-main-mask').css('opacity', ((attr.touch == 'down')?0:1)).show();
                            startY = e.distance;
                        });

                        elementTouchHammer.on('panup pandown', function(e) {
                            isMove = true;
                            var y;
                            if(attr.touch == 'down') {
                                y = defY + e.distance - startY;
                            } else {
                                y = startY - e.distance;
                            }
                            if(y < 0 && y > defY) {
                                oMask.css('opacity', 1 - y / defY);
                                oMenu.css('top', y);
                            }
                        });

                        elementTouchHammer.on('panend', function(e) {
                            if(isMove) {
                                var y = oMenu.css('top'),
                                    then = (attr.touch == 'down')? (e.distance - startY) : (startY - e.distance);
                                if((then > 50) && y != 0) {
                                    oMenu.animate({
                                        top: 0
                                    }, 100);
                                    oMask.fadeIn(300, function() {
                                        $scope.$broadcast('safeMainMenuShowEvent');
                                        oMask.css('opacity', 1)
                                    });
                                } else {
                                    oMenu.animate({
                                        top: defY
                                    }, 100);
                                    oMask.fadeOut(300, function() {
                                        $scope.$broadcast('safeMainMenuHideEvent');
                                        oMask.css('opacity', 1)
                                    });
                                }
                            } else {
                                $('.safe-main-mask').hide();
                            }
                        });
                    }
                }
            }
        }
    });
});