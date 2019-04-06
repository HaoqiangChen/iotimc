define([
    'app',
    'cssloader!safe/tdt/css/index.css',
    'safe/tdt/js/directives/safeTdtMap'
], function(app) {
    var packageName = 'iiw.safe.tdt';
    app.controller('tdtController', ['$scope', function($scope) {
        $scope.$on('tdtControllerOnEvent', function() {

        });

        // $scope.$on('tdtControllerExitEvent', function() {
        //     $scope.$broadcast("destoryMap");
        // });
    }]);
});
