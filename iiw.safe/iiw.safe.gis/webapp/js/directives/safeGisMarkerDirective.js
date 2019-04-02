/**
 * 标注弹出框指令
 * Created by zcl on 2017/07/14.
 */
define([
    'app'
], function(app) {
    app.directive('gisMarkerDialog', [function() {
        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function(data) {
                result = data;
            });

            return result;
        }

        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: getTemplate($.soa.getWebPath('iiw.safe.gis') + '/view/marker.html'),
            link: function($scope, element) {
                $scope.saveMarker = function() {
                    alert("save");
                };
            }
        }
    }]);
});