/**
 * 短信发送模块
 * Created by ZCL on 2016-11-21.
 */
define([
    'app',
    'cssloader!safe/gis/css/index.css',
    'safe/gis/js/directives/safeGisMapDirective'
], function(app) {
    var packageName = 'iiw.safe.gis';
    app.controller('gisController', ['$scope', function($scope) {
        $scope.$on('gisControllerOnEvent', function() {
            // console.log('gis');
        });

        $scope.$on('gisControllerExitEvent', function() {
            $scope.$broadcast("destoryMap");
        });
    }]);
});
