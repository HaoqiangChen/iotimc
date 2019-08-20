/**
 * 系统功能菜单点击事件
 * Created by zcl on 2016/2/24.
 */
define(['app'], function(app) {
    app.directive('systemLeftMenuClick', [function() {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele) {
                $(ele).on('click', function(e) {
                    if ($(e.target).hasClass('iiw-system-second-level-menu'))return;
                    $('li.iiw-system-menu-active').each(function(i, o) {
                        if ($(o).hasClass('iiw-system-menu-active')) {
                            $(o).removeClass('iiw-system-menu-active');
                        }
                    });

                    $(ele).addClass('iiw-system-menu-active');

                    if ($(ele).has('ul').length) {
                        if (!$('ul', this).hasClass('opened')) {
                            $('#nav').find('ul:visible').slideToggle('normal');
                            $('#nav').find('ul:visible').removeClass('opened');
                            $('.icon-angle-down').addClass('closing');
                            $('.closing').removeClass('fa fa-angle-down');
                            $('.closing').addClass('fa fa-angle-left');
                            $('.icon-angle-left').removeClass('closing');
                        }

                        $('ul', this).slideToggle('normal');

                        if ($('ul', this).hasClass('opened')) {
                            $('ul', this).removeClass('opened');
                            $('.arrow', this).removeClass('fa fa-angle-down');
                            $('.arrow', this).addClass('fa fa-angle-left');
                        } else {
                            $('ul', this).addClass('opened');
                            $('.arrow', this).removeClass('fa fa-angle-left');
                            $('.arrow', this).addClass('fa fa-angle-down');
                        }
                    }
                });
            }
        }
    }]);
});