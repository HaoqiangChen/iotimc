/**
 * 系统管理页面背景弹出框指令
 * Created by zcl on 2016/2/24.
 */
define(['app'], function(app) {

    app.directive('systemSwitcherDialog', [function() {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele) {
                $(ele).on('click', function() {
                    if ($('.iiw-system-switcher-changer').hasClass('active')) {
                        $('.iiw-system-switcher-changer').animate({'right': '-145px'}, function() {
                            $('.iiw-system-switcher-changer').toggleClass('active');
                        });
                    } else {
                        $('.iiw-system-switcher-changer').animate({'right': '0px'}, function() {
                            $('.iiw-system-switcher-changer').toggleClass('active');
                        });
                    }
                });
            }
        }
    }]);
});