/**
 * 天地图服务
 * Created by chq on 2019/10/11.
 */
define([
    'app',
    'safe/tdt/lib/geoway/geoway.all'
], function (app) {
    app.service('safeTdtService', ['$rootScope', '$compile', '$element', 'iAjax', function ($rootScope, $compile, $element, iAjax) {
        var map;                    //地图对象

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
