/**
 * 天地图
 * @author : chq
 * @date : 2019-10-14
 */
define([
    'app',
    'cssloader!safe/tdt/css/map.css'
], function (app) {
    app.directive('safeTdtMap', ['iAjax', function (iAjax) {
        var packageName = 'iiw.safe.tdt';

        return {
            restrict: 'AE',
            replace: true,
            template: iAjax.getTemplate('iiw.safe.tdt', '/view/map.html'),
            link: function ($scope, $element) {
                var modulepath = $.soa.getWebPath('iiw.safe.tdt');
                var tdtKey = 'ee9d89530880ac069afd790996356574';
                // var jspath = modulepath + '/lib/geowaysdk/geoway.all.js';
                var jspath = 'http://api.tianditu.gov.cn/api?v=4.0&tk=' + tdtKey;

                function _dynamicLoadJs(url, callback) {
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    if (typeof (callback) == 'function') {
                        script.onload = script.onreadystatechange = function () {
                            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                                callback();
                                script.onload = script.onreadystatechange = null;
                            }
                        };
                    }
                    head.appendChild(script);
                }

                var map;
                var serverUrl = {
                    proxyHost: '/ime-jn/js/geowaySDK/proxy.jsp?',
                    // 二维矢量地图
                    vecmap: {
                        baseLayer: 'http://www.mapgx.com/ime-server/rest/tdtgx_vec/wmts',
                        labelLayer: 'http://www.mapgx.com/ime-server/rest/tdtgx_vecanno/wmts'
                    },
                    // 二维影像地图
                    imgmap: {
                        baseLayer: 'http://www.mapgx.com/ime-server/rest/tdtgx_img/wmts',
                        labelLayer: 'http://www.mapgx.com/ime-server/rest/tdtgx_imganno/wmtss'
                    },
                    // 路径查询
                    route: 'http://www.mapgx.com/ime-cloud/rest/route/plan',
                    //
                    poi: {}
                };

                // 中心点
                var center = [108.36, 22.82];

                // 缩放级别
                var zoom = 12;

                var id = $element.attr('id');
                if (!id) {
                    id = 'tdtmap';
                    $element.find('.map-container').attr('id', id);
                }

                $scope.tdt = {
                    init: function () {
                        this.initMap();
                    },
                    // 天地图初始化
                    initMap: function () {
                        if (map) {
                            map.destroy();
                            map = null;
                        }

                        // 初始化地图对象
                        map = new T.Map(id);
                        // 设置显示地图的中心点和级别
                        map.centerAndZoom(new T.LngLat(center[0], center[1]), zoom);

                    },
                    // 切换地图类型
                    toggleMaptype: function (maptype) {
                        this.maptype = maptype;
                        if (this.maptype == 'Vector') {
                            this.loadVectorMap();
                        } else if (this.maptype == 'Image') {
                            this.loadImageMap();
                        }
                    },
                };

                _dynamicLoadJs(jspath, function () {
                    $scope.tdt.init();
                });

            }
        }
    }]);
});
