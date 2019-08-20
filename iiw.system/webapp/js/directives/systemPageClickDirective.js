/**
 * 页面点击指令
 * Created by zcl on 2016/3/26.
 */
define(['app'], function(app) {
    app.directive('systemPageClick', [function() {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele) {
                $(ele).on('click', function(event) {
                    if ($(event.target.parentNode).hasClass('iiw-system-header-dropdown-toggle') || $(event.target).hasClass('iiw-system-header-dropdown-toggle')) {
                        scope.showDropdownMenu = !scope.showDropdownMenu;
                        if (scope.showDropdownMenu) {
                            $('.iiw-system-header-dropdown-menu').css('display', 'inline');
                        } else {
                            $('.iiw-system-header-dropdown-menu').css('display', 'none');
                        }
                    } else {
                        scope.showDropdownMenu = false;
                        $('.iiw-system-header-dropdown-menu').css('display', 'none');
                    }
                });
            }
        }
    }]);
});