/**
 * 信息牌管理
 *
 * @author - dwt
 * @date - 2016-09-14
 * @version - 0.1
 */
define([
    'app',
    'cssloader!system/infocard/css/index.css'
], function(app) {

    app.controller('infocardController', [
        '$scope',
        '$state',
        '$uibModal',
        'mainService',

        function($scope, $state, $uibModal, mainService) {

            mainService.moduleName = '信息牌管理';

            $scope.goto = function(url) {
                var params = {'data': null};
                $state.params = params;
                $state.go('system.infocard.' + url, params);
            };

        }
    ]);

});