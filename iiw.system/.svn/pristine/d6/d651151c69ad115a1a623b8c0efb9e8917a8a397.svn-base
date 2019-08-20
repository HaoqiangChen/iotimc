/**
 * 电子地图管理控制器
 *
 * @author - dwt
 * @date - 2016-01-26
 * @version - 0.1
 */
define([
    'app',
    'angularAMD',
    'system/insidemapsetting/js/controller/list',
    'system/insidemapsetting/js/controller/map',
    'cssloader!system/insidemapsetting/css/index.css'
], function(app, angularAMD) {

    var packageName = 'iiw.system.insidemapsetting';

    angularAMD.config(function($stateProvider) {
        $stateProvider
            .state('system.insidemapsetting.list', {
                url: '/list',
                controller: 'insidemapSettingListController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/list.html',
                params: {
                    'data': null
                }
            })
            .state('system.insidemapsetting.map', {
                url: '/map',
                controller: 'insidemapSettingMapController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/map.html',
                params: {
                    'data': null
                }
            });
    });

    app.controller('insidemapSettingController', [
        '$scope',
        '$state',
        'mainService',

        function($scope, $state, mainService) {
            mainService.moduleName = '电子地图管理';
            $scope.title = '电子地图管理';
            $scope.titleState = '';

            $scope.$on('$viewContentLoaded', function() {
                $state.go('system.insidemapsetting.list');
            });

            $scope.goto = function() {
                if($scope.titleState) {
                    var params = {data: null};
                    $state.params = params;
                    $state.go($scope.titleState, params);
                }
            };

        }
    ]);

});