/**
 * 电子地图
 *
 * @author - dwt
 * @date - 2016-09-09
 * @version - 0.1
 */
define([
    'app',
    'safe/map/js/directives/safeMap',
    'safe/yjt/js/service/yjtservice',
    'safe/insidemap/js/services/insidemaploadservice',
    'cssloader!safe/insidemap/css/index.css'
], function(app) {

    app.controller('safeInsidemapController', ['$scope', '$compile', '$timeout', 'safeMainTitle', 'insidemapLoadService', function($scope, $compile, $timeout, safeMainTitle, insidemapLoadService) {
        safeMainTitle.title = '电子地图';
        insidemapLoadService.init($scope);
    }]);
});
