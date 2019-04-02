/**
 * Created by zcl on 2016/12/30.
 */
define(['app'],function(app){
    app.directive('safeGisLeftPanel',[function(){
        return {
            restrict: 'A',
            scope: true,
            replace: true,
            link: function($scope, $element) {
                $scope.$on('showLeftPanelEvent', function() {
                    $('.safe-gis-left-panel').show().addClass("bounceInLeft animated");
                });
            }
        }
    }]);
});