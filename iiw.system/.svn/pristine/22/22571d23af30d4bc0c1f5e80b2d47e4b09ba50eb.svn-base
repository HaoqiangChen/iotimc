/**
 * 系统管理背景图片选择指令
 * Created by zcl on 2016/2/24.
 */
define(['app'], function(app) {
    app.directive('systemSwitcherChoose', [function() {
        return {
            restrict: 'A',
            replace: true,
            link: function(scope, ele) {
                $(ele).click(function() {
                    var backgroundImgUrl = $(ele).find('img')[0].src;
                    $('body').css('background-image', 'url(' + backgroundImgUrl + ')');
                });
            }
        }
    }]);
});