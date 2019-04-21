
/**
 * 电子地图模块加载服务
 *
 * @author - dwt
 * @date - 2016-09-09
 * @version - 0.1
 */
define([
    'app'
], function(app) {
    app.service('insidemapLoadService', [
        '$rootScope',
        '$compile',
        '$timeout',

        function($rootScope, $compile, $timeout) {

            var init = false,
                insideMapMenu = null;

            function _init(scope) {
                if(!init) {
                    init = true;

                    var menus = $.soa.getInfo();
                    // 找到iiw.safe.insidemap下的所有项目
                    var insideMapMenus = _.filter(menus, function(menu) {
                        return (menu.name.indexOf('iiw.safe.insidemap.') != -1 && menu.name.indexOf('iiw.safe.insidemap.base') == -1);
                    });

                    // 找到iiw.safe.insidemap.base基础版电子地图项目
                    var baseMenu = _.filter(menus, function(menu) {
                        return (menu.name.indexOf('iiw.safe.insidemap.base') != -1);
                    });

                    // 优先使用iiw.safe.insidemap.base
                    if(baseMenu.length) {
                        insideMapMenu = baseMenu[0];
                    }else {
                        insideMapMenu = insideMapMenus[0];
                    }

                    require([insideMapMenu.route.requirename + '/js/directives/insidemappanel'], function() {
                        $timeout(function() {
                            $compile($('.iiw-safe-insidemap-container').contents())(scope);
                        });
                    }, function() {
                        $timeout(function() {
                            $compile($('.iiw-safe-insidemap-container').contents())(scope);
                        });
                    });
                }
            }

            return {
                init: _init,
                getMenu: function() {
                    return insideMapMenu;
                }
            }
        }
    ]);
});