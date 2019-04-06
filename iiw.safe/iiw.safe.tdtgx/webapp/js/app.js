define([
    'app',
    'safe/tdtgx/lib/geowaysdk/geoway.all.debug'
], function(app) {
    var packageName = 'iiw.safe.tdtgx';
    app.controller('tdtgxController', ['$scope', function($scope) {
        $scope.$on('tdtgxControllerOnEvent', function() {
            Geoway.ProxyHost = "/ime-gx/js/geowaySDK/proxy.jsp?";
            var map = new Geoway.GwMap("map");
            //加入广西矢量底图
            Geoway.WMTSUtil.addLayerToMap("gxvec", "http://www.mapgx.com/ime-server/rest/tdtgx_vec/wmts", true, "tiles", "Vector", map);
            //加入广西矢量注记
            Geoway.WMTSUtil.addLayerToMap("gxvecanno", "http://www.mapgx.com/ime-server/rest/tdtgx_vecanno/wmts", false, "tiles", "Vector", map);
            map.setCenter(new Geoway.LonLat(108.36, 22.82), 10);
        });
    }]);
});
