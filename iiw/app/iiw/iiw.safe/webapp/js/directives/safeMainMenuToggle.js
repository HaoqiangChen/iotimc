/**
 * 顶部菜单打开/隐藏指令。
 *
 * Created by YJJ on 2015-11-06.
 */
define(['app'], function(app) {
    app.directive('safeMainMenuToggle', [function() {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($scope, $element, attr) {
                        $element.on('click', function() {
                            if(attr.type == 'show') {
                                $('.safe-main-menubar').animate({
                                    top: 0
                                }, 300, function() {
                                    $scope.$broadcast('safeMainMenuShowEvent');
                                });
                                $('.safe-main-mask').css('opacity', 1).fadeIn(300);
                            } else {
                                $('.safe-main-menubar').animate({
                                    top: -$('.safe-main-menubar').height()
                                }, 300, function() {
                                    $scope.$broadcast('safeMainMenuHideEvent');
                                });
                                $('.safe-main-mask').css('opacity', 1).fadeOut(300);
                            }
                        });
                    }
                }
            }
        }
    }]);
});