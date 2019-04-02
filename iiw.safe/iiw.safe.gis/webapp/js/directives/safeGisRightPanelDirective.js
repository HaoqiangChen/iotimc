/**
 * Created by zcl on 2016/12/30.
 */
define(['app'],function(app){
    app.directive('safeGisRightPanel',[function(){
        return {
            restrict: 'A',
            scope: true,
            replace: true,
            link: function($scope, $element) {
                $scope.$on('showRightPanelEvent', function() {
                    $('.safe-gis-right-panel').show().addClass("bounceInRight animated");
                });
            }
        }
    }]);
});