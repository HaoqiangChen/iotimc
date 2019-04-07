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
                // 天地图开发密钥key
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

                var map, // 地图图层
                    maptype, // 地图类型
                    baseServiceUrl = 'http://t0.tianditu.gov.cn/', // 服务地址域名
                    projection = 'EPSG:900913', // 指定地图的投影方式，目前支持的地图投影方式有：EPSG:900913(墨卡托投影)，EPSG:4326(大地平面投影)
                    minZoom = 1, // 地图允许展示的最小级别
                    maxZoom = 18, // 地图允许展示的最大级别
                    center = [108.36, 22.82], // 地图的初始化中心点
                    zoom = 12, // 缩放级别
                    _jfjalgaksj;

                var id = $element.attr('id');
                if (!id) {
                    id = 'tdtmap';
                    $element.find('.map-container').attr('id', id);
                }

                $scope.mapType = [
                    {name: '矢量', type: 'Vector', layer: 'vec'},
                    {name: '地形', type: 'Terrain', layer: 'ter'},
                    {name: '影像', type: 'Image', layer: 'img'}
                ];

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
                    toggleMaptype: function (type) {
                        // 底图类型
                        maptype = type;
                        // 标注类型
                        let labeltype = 'c' + maptype[0] + 'a';
                        // 投影方式
                        let TILEMATRIXSET = projection === 'EPSG:900913' ? 'w' : 'c';
                        // 图层服务地址
                        let imageURL = baseServiceUrl + maptype + '_' + TILEMATRIXSET + '/wmts?' + 'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + maptype + '&STYLE=default&TILEMATRIXSET=' + TILEMATRIXSET + '&FORMAT=tiles' + '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + tdtKey;
                        // 标注服务地址
                        let labelURL = baseServiceUrl + labeltype + '_' + TILEMATRIXSET + '/wmts?' + 'SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=' + labeltype + '&STYLE=default&TILEMATRIXSET=' + TILEMATRIXSET + '&FORMAT=tiles' + '&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=' + tdtKey;
                        // 创建自定义图层对象（底图）
                        let lay1 = new T.TileLayer(imageURL, {minZoom: minZoom, maxZoom: maxZoom});
                        // 将图层增加到地图上
                        map.addLayer(lay1);
                        // 创建自定义图层对象（标注）
                        let lay2 = new T.TileLayer(labelURL, {minZoom: minZoom, maxZoom: maxZoom});
                        map.addLayer(lay2);
                    }
                };

                _dynamicLoadJs(jspath, function () {
                    $scope.tdt.init();
                });

            }
        }
    }]);
});
