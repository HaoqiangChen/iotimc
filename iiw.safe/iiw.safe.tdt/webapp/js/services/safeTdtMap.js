/**
 * 广西天地图服务
 * Created by chq on 2019/10/10.
 */
define([
    'app',
    'safe/tdt/lib/geoway/geoway.all'
], function (app) {
    app.service('safeTdtMapService', ['$rootScope', '$compile', '$element', 'iAjax', function ($rootScope, $compile, $element, iAjax) {
        var map;                    //地图对象
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
        var zoom = 8;

        var id = $element.attr('id');
        if (!id) {
            id = 'tdmap';
            $element.find('.map-container').attr('id', id);
        }

        function init() {
            var url = '/security/infomanager/information.do?action=getSysettingList';
            var params = {
                filter: {
                    type: 'supergraph'
                }
            };
            iAjax.post(url, params).then(function (data) {
                if (data && data.result && data.result.rows) {
                    $.each(data.result.rows, function (i, o) {

                        if (o.type == 'supergraph_maps') {
                            mapUrl = o.url;
                            //mapUrl = 'http://192.168.1.10:8090/iserver/services/map-china400/rest/maps/China_4326';
                        } else if (o.type == 'supergraph_plot') {
                            plotUrl = o.url;
                            //plotUrl = 'http://192.168.1.10:8090/iserver/services/plot-jingyong/rest/plot/';
                        } else if (o.type == 'supergraph_data') {
                            dataUrl = o.url;
                            //dataUrl = 'http://192.168.1.10:8090/iserver/services/data-world/rest/data';
                        } else if (o.type == 'supergraph_dynaic') {
                            //console.log(o.url);
                            restMapUrl = o.url;
                        }
                    });
                }
            });
        }

        // init();

        return {
            // 地图初始化
            init: function () {
                Geoway.ProxyHost = "/ime-gx/js/geowaySDK/proxy.jsp?";
                map = new Geoway.GwMap("map");
                //加入矢量底图
                Geoway.WMTSUtil.addLayerToMap("baseLayer", "http://www.mapgx.com/ime-server/rest/tdtgx_vec/wmts", true, "tiles", "Vector", map);
                //加入矢量注记
                Geoway.WMTSUtil.addLayerToMap("labelLayer", "http://www.mapgx.com/ime-server/rest/tdtgx_vecanno/wmts", false, "tiles", "Vector", map);
                map.setCenter(new Geoway.LonLat(108.36, 22.82), 10);
            },

            zoomIn: function () {
                map.zoomIn();
            },

            zoomOut: function () {
                map.zoomOut();
            },

            removeMap: function () {
                if (map) map.destroy();
            }
        }
    }]);
});
