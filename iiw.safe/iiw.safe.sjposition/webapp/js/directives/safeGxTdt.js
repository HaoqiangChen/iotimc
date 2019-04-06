/**
 * 广西天地图
 * @author : zhs
 * @version : 1.0
 * @date : 2019-09-17
*/
define([
    'app',
    'cssloader!safe/sjposition/css/tdt',
    'cssloader!safe/sjposition/lib/geoway/theme/default/style'
], function(app) {
    app.directive('safeGxTdt', ['iAjax', 'yjtService', function(iAjax, yjtService) {
        return {
            restrict: 'AE',
            replace: true,
            template: iAjax.getTemplate('iiw.safe.sjposition', '/view/tdt.html'),
            link: function($scope, $element) {
                var modulepath = $.soa.getWebPath('iiw.safe.sjposition');
                var jspath = modulepath + '/lib/geoway/geoway.all.js';

                function dynamicLoadJs(url, callback) {
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = url;
                    if(typeof(callback) =='function') {
                        script.onload = script.onreadystatechange = function() {
                            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete"){
                                callback();
                                script.onload = script.onreadystatechange = null;
                            }
                        };
                    }
                    head.appendChild(script);
                }

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
                }

                // 中心点
                var center = [108.36, 22.82];

                // 缩放级别
                var zoom = 8;

                var id = $element.attr('id');
                if(!id) {
                    id = 'tdmap';
                    $element.find('.map-container').attr('id', id);
                }

                $scope.tdt = {
                    featureManager : null,
                    map: null,
                    maptype : 'Vector',
                    mapCity : null,
                    units : 'degrees',
                    markType: '',
                    markLayer: null,
                    markCtrls: null,
                    initialize : function() {
                        this.initMap();
                        // this.initFeatureManager();
                        // this.initMarkControl();
                    },
                    initMap: function() {
                        if(this.map) {
                            this.map.destroy();
                            this.map = null;
                        }
                        var defalutControls = [
                            // 比例尺
                            new Geoway.Control.ScaleLine(),
                            // 经纬度
                            new Geoway.Control.MousePosition({
                                numDigits: 2,
                                prefix: '经度:',
                                separator: '&nbsp&nbsp&nbsp纬度:'
                            }),
                            // 拖动
                            new Geoway.Control.Navigation({
                                id: 'Navigation',
                                dragPanOptions : {
                                    enableKinetic : true
                                }
                            }),
                            //测距
                            new Geoway.Control.MapMeasure(Geoway.Handler.Path, {
                                id: 'MeasureLength',
                                displayUnits: 'km',
                                handlerOptions: {
                                    persist: true
                                }
                            }),
                            //测面
                            new Geoway.Control.MapMeasure(Geoway.Handler.Polygon, {
                                id: 'MeasureArea',
                                displayUnits: 'km',
                                handlerOptions: {
                                    persist: true
                                }
                            })
                        ];

                        var options = {
                            controls: defalutControls,
                            units: this.unit,
                            tdtMode: true,
                        };

                        Geoway.ProxyHost = serverUrl.proxyHost;

                        this.map = new Geoway.GwMap(id, options);

                        this.toggleMaptype(this.maptype);
                        // 设置中心点
                        this.map.setCenter(new Geoway.LonLat(center[0], center[1]), zoom);
                    },
                    // 要素管理器
                    initFeatureManager: function () {
                        var classifyList;
                        if (this.featureManager) {
                            classifyList = this.featureManager.classifyList;
                        }

                        this.featureManager = new Geoway.FeatureManager({
                            map: this.map
                        });

                        this.featureManager.classifyList = classifyList || [];

                        // 存放工具栏标注的点、线、面
                        this.featureManager.createFeatureSort('marker', {
                            scope: this,
                            onFeatureSelect: function(feature) {
                                $scope.tdt.showMarkPopup(feature, 'marker');
                            },
                            onFeatureUnselect: function(feature) {
                                if(feature.popup) {
                                    $scope.tdt.map.removePopup(feature.popup);
                                }
                            }
                        });

                        // 存放标注点
                        this.featureManager.createFeatureSort('poi',{
                            scope: this,
                            onFeatureSelect: function(feature) {
                                $scope.tdt.showMarkPopup(feature, 'poi');
                            },
                            onFeatureUnselect: function(feature) {

                            }
                        })

                        // 路径
                        this.featureManager.createFeatureSort('route',{
                            scope: this,
                            onFeatureSelect: function(feature) {

                            },
                            onFeatureUnselect: function(feature) {

                            }
                        });
                    },
                    initMarkControl: function() {
                        var that = this;
                        this.markLayer = this.featureManager.vectorLayer;
                        // this.map.addLayer(this.markLayer);

                        this.markCtrls = {
                            point: new Geoway.Control.DrawFeature(
                                that.markLayer,
                                Geoway.Handler.Point,
                                {
                                    featureAdded: $.proxy(that.handlerDrawFeature, that)
                                }),
                            text: new Geoway.Control.DrawFeature(
                                that.markLayer,
                                Geoway.Handler.Point,
                                {
                                    featureAdded: $.proxy(that.handlerDrawFeature, that)
                                }),
                            line: new Geoway.Control.DrawFeature(
                                that.markLayer,
                                Geoway.Handler.Path,
                                {
                                    featureAdded: $.proxy(that.handlerDrawFeature, that)
                                }),
                            polygon: new Geoway.Control.DrawFeature(
                                that.markLayer,
                                Geoway.Handler.Polygon,
                                {
                                    featureAdded: $.proxy(that.handlerDrawFeature, that)
                                })
                        }

                        for(var item in this.markCtrls){
                            this.map.addControls([this.markCtrls[item]]);
                        }
                    },
                    loadVectorMap: function() {
                        //加入广西矢量底图
                        Geoway.WMTSUtil.addLayerToMap('baseLayer', serverUrl.vecmap.baseLayer, true, 'tiles', 'Vector', this.map);
                        //加入广西矢量注记
                        Geoway.WMTSUtil.addLayerToMap('labelLayer', serverUrl.vecmap.labelLayer, false, 'tiles', 'Vector', this.map);
                    },
                    loadImageMap: function() {
                        //加入广西影像底图
                        Geoway.WMTSUtil.addLayerToMap('gximg', serverUrl.imgmap.baseLayer, false, 'tiles', 'Vector', this.map);
                        //加入广西影像注记
                        Geoway.WMTSUtil.addLayerToMap('gximganno', serverUrl.imgmap.labelLayer, false, 'tiles', 'Vector', this.map);
                    },
                    // 绘制控件完成后处理函数
                    handlerDrawFeature: function(feature) {
                        //注销绘制控件
                        this.toggleControl();
                        //清除之前未保存绘制的结果
                        this.clearFeatures('marker');
                        var imgName = modulepath + '/images/marker/marker.png';
                        var sort = 'marker';

                        feature.type = this.markType;

                        // 如果是添加文字备注，只需显示浮云即可
                        if(this.markType != "text"){
                            //添加当前的结果
                            this.markLayer.addFeatures([feature]);

                            var style = {
                                externalGraphic: imgName,
                                graphicWidth: 32,
                                graphicHeight: 32,
                                graphicXOffset: -20,
                                graphicYOffset: 0,
                                graphicOpacity: 1,
                                strokeColor: "#ff6600",
                                strokeWidth: 2,
                                strokeDashstyle: 'solid',
                                strokeOpacity: 1,
                                fillColor: "#ff6600",
                                fillOpacity: 0.5,
                                pointRadius: 3,
                                cursor: "pointer"
                            }
                            feature.style = style;
                            this.featureManager.addFeatures([feature], sort, true);
                            this.featureManager.drawFeaturesToMap([feature]);
                            // 打开浮云框，将要素存入要素选择数组中，避免重复选择
                            this.markLayer.selectedFeatures.push(feature);
                        } else {
                            this.featureManager.addFeatures([feature], sort, true);
                        }

                        this.showPopupHandler(feature);
                    },
                    // 要素绘制完后显示浮云处理函数
                    showPopupHandler: function(feature) {
                        if(feature.popup) {
                            this.map.removePopup(feature.popup);
                        }

                        var geometry = feature.geometry;
                        var latLon = new Geoway.LonLat(geometry.x, geometry.y);
                        var size = new OpenLayers.Size(300, 60);
                        var markerPointPopupTmpl = [
                            '<div class="input-wrap">' +
                                '<div class="input-group">' +
                                    '<input type="text" class="form-control" placeholder="请输入标注内容">' +
                                    '<span class="input-group-btn">' +
                                        '<button class="btn btn-info" type="button"><i class="fa fa-check"></i></button>' +
                                    '</span>' +
                                '</div>' +
                            '</div>'
                        ].join('');
                        var popup = new OpenLayers.GeowayPopup("markerPoint_popup", latLon, size, markerPointPopupTmpl, 10, true);
                        feature.popup = popup;
                        this.map.addPopup(popup);
                    },
                    // 显示标注信息
                    showMarkPopup: function(feature, type, offset) {
                        if(feature.popup) {
                            this.map.removePopup(feature.popup);
                        }

                        var offset = offset || 0;
                        var attributes = feature.attributes;
                        if(attributes.name && attributes.name.length > 16) {
                            attributes.exName = attributes.name.substr(0,16) + '...';
                        }else if(attributes.name && attributes.name.length <= 16){
                            attributes.exName = attributes.name;
                        }else{
                            attributes.exName = "暂无名称";
                        }

                        var popupHtml, size;
                        if(type == 'marker') {
                            popupHtml = '<div class="name-wrap">' + attributes.exName + '</div>';
                            size = new OpenLayers.Size(160, 48);
                        } else {
                            popupHtml = [
                                '<div class="popup-box">' +
                                    '<div class="box-header">' +
                                        '<div class="box-title">' + attributes.xm + '</div>' +
                                        '<div class="box-tool">' +
                                            '<div class="text-info" role="button" onclick="angular.element(this).scope().showYjt('+ attributes.bm + ')">一键通</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="box-body">' +
                                        '<div class="item"><span>罪名：</span>' + attributes.zm + '</div>' +
                                        '<div class="item"><span>报警次数：</span>6</div>' +
                                        '<div class="item"><span>定位时间：</span>' + attributes.time + '</div>' +
                                        '<div class="item"><span>家庭住址：</span>' + attributes.jtzz + '</div>' +
                                    '</div>' +
                                '</div>'
                            ].join('');
                            size = new OpenLayers.Size(300, 200);
                        }

                        var geometry = feature.geometry;
                        if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point"){
                            var latLon = new Geoway.LonLat(geometry.x, geometry.y);
                        }else if(geometry.CLASS_NAME == "OpenLayers.Geometry.LineString"){
                            var latLon = new Geoway.LonLat(geometry.components[0].x, geometry.components[0].y);
                        }else if(geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon"){
                            var latLon = new Geoway.LonLat(geometry.components[0].components[0].x, geometry.components[0].components[0].y);
                        }

                        var popup = new OpenLayers.GeowayPopup(null, latLon, size, popupHtml, offset, true);

                        feature.popup = popup;

                        this.map.addPopup(popup);
                        this.map.panTo(latLon);
                    },
                    // 清除标注
                    clearFeatures: function(type) {
                        var features = this.featureManager.getFeatures(type);
                        for(var i = 0; i < features.length; i++) {
                            var name = features[i].attributes['name'];
                            if(!name) {
                                if(features[i].popup) {
                                    this.map.removePopup(features[i].popup);
                                    features[i].popup = null;
                                }
                                this.featureManager.clearFeatureFromMap(features[i], type);
                            }
                        }
                    },
                    // 切换地图类型
                    toggleMaptype: function(maptype) {
                        this.maptype = maptype;
                        if(this.maptype == 'Vector') {
                            this.loadVectorMap();
                        } else if(this.maptype == 'Image') {
                            this.loadImageMap();
                        }
                    },
                    // 响应标注事件
                    toggleControl: function(name, fn) {
                        for (var key in this.markCtrls) {
                            if (key == name) {
                                this.markType = name;
                                this.markCtrls[key].activate();
                            } else {
                                this.markCtrls[key].deactivate();
                            }
                        }
                    },
                    // 在地图上标点
                    markPoints: function(points, type) {
                        if(points && points.length) {
                            if(points.length == 1) {
                                var item = _.find(this.featureManager.getFeatures(type), function(row) {
                                    return row.attributes.bm == points[0].bm;
                                });

                                if(item) {
                                    this.panToPoint(item);
                                    return;
                                }
                            }

                            this.clearFeatures(type);

                            var features = [];
                            for (var i = 0; i < points.length; i++) {
                                var point = new Geoway.Geometry.Point(points[i].location.lon, points[i].location.lat);

                                var pointStyle = Geoway.Util.extend({}, Geoway.Feature.Vector.style['default']);
                                if (!points[i].graphic) {
                                    pointStyle.externalGraphic = modulepath + '/images/marker/marker.png';
                                    pointStyle.graphicWidth = 32;
                                    pointStyle.graphicHeight = 32;
                                    pointStyle.graphicXOffset = -20;
                                    pointStyle.graphicYOffset = 0;
                                    pointStyle.graphicOpacity = 1;
                                } else {
                                    _.extend(pointStyle, points[i].graphic);
                                }

                                features.push(new Geoway.Feature.Vector(point, points[i], pointStyle));
                            }

                            this.featureManager.addFeatures(features, type, true);
                            this.featureManager.drawFeaturesToMap(features);
                        }
                    },
                    // 在地图上画区域
                    markPolygon: function(points) {
                        var polygon = [];
                        _.each(points, function(point) {
                            var p = new Geoway.Geometry.Point(point[0], point[1])
                            polygon.push(p);
                        });

                        var linearRing = new Geoway.Geometry.LinearRing(polygon);

                        var polygonFeature = new Geoway.Feature.Vector(linearRing);

                        var polygonStyle = Geoway.Util.extend({}, Geoway.Feature.Vector.style['default']);
                        polygonStyle.fillColor = 'rgba(255,114,86,0.3)';
                        polygonStyle.strokeColor = '#f00';
                        polygonStyle.strokeWidth = 2;

                        polygonFeature.style = polygonStyle;

                        this.featureManager.vectorLayer.addFeatures([polygonFeature]);
                    },
                    // 在地图上画线
                    markLine: function(points) {
                        var lines = [];
                        _.each(points, function(point) {
                            var p = new Geoway.Geometry.Point(point[0], point[1])
                            lines.push(p);
                        });

                        var lineString = new Geoway.Geometry.LineString(lines);
                        var lineFeature = new Geoway.Feature.Vector(lineString);

                        var lineStyle = Geoway.Util.extend({}, Geoway.Feature.Vector.style['default']);
                        lineStyle.strokeColor = '#f00';
                        lineStyle.strokeWidth = 2;

                        lineFeature.style = lineStyle;

                        this.featureManager.vectorLayer.addFeatures([lineFeature]);
                    },
                    // 聚焦某个点位
                    panToPoint: function(feature) {
                        var lonlat = new Geoway.LonLat(feature.geometry.x, feature.geometry.y);
                        this.map.panTo(lonlat);
                        this.showMarkPopup(feature, 'poi');
                    },
                    // 获取当前缩放级别
                    getZoomLevel: function() {
                        var level = parseInt(this.map.getZoom() + 1);
                        return level;
                    },
                    // 获取当前可视范围
                    getExtent: function() {
                        var boundary = this.map.getExtent();
                        return boundary;
                    },
                    route: {
                        search: function() {
                            // 起点经纬度位置
                            var origin = 108.31 + "," + 22.83;
                            // 终点经纬度位置
                            var destination = 108.27 + "," + 22.78;
                            // 加入查询参数
                            // format：返回的数据格式，如JSON
                            // origin：起点坐标
                            // destination：终点坐标
                            // mode：查询模式（0-最快线路，1-最短线路，2-少走高速）
                            var url = serverUrl.route + '?format=json' + '&origin=' + encodeURIComponent(origin) + '&destination=' + encodeURIComponent(destination) + '&mode=0';

                            $.ajax({
                                url: url,
                                dataType: 'jsonp',
                                jsonp: 'callback',
                                success: function(res) {
                                    if(res.status == 'ok') {
                                        // 默认显示方案一的路线
                                        $scope.tdt.route.addToMap(res.results[0])
                                    }
                                }
                            });
                        },
                        addToMap: function(datas) {
                            var style = {
                                strokeColor: '#CC0000',
                                strokeWidth: 4,
                                pointRadius: 6,
                                pointerEvents: 'visiblePainted'
                            }

                            var features = [];
                            for (var j = 0, len = datas.steps.length; j < len; j++) {
                                var p = datas.steps[j];
                                // 绘制图形
                                if (p.path && p.path.length > 0) {
                                    var navLineFeature = Geoway.FeatureUtils.parseFeatureFromWKT(p.path);
                                    navLineFeature.style = style;
                                    features.push(navLineFeature);
                                }
                            }

                            $scope.tdt.featureManager.addFeatures(features, 'route', true);
                            // $scope.tdt.markLayer.addFeatures(features);
                            $scope.tdt.map.zoomToExtent($scope.tdt.markLayer.getDataExtent());
                        }
                    },
                    // 工具栏
                    tools: {
                        measureLength: function() {
                            Geoway.MapUtil.deactivateAllControls($scope.tdt.map);
                            $scope.tdt.map.getControl("MeasureLength").activate();
                            Geoway.MapUtil.setMapCursor($scope.tdt.map, "ruler");
                        },
                        measureArea: function() {
                            Geoway.MapUtil.deactivateAllControls($scope.tdt.map);
                            $scope.tdt.map.getControl("MeasureArea").activate();
                            Geoway.MapUtil.setMapCursor($scope.tdt.map, "ruler");
                        },
                        drawPoint: function() {
                            $scope.tdt.toggleControl('point');
                        },
                        drawLine: function() {
                            $scope.tdt.toggleControl('line');
                        },
                        drawPolygon: function() {
                            $scope.tdt.toggleControl('polygon');
                        },
                        clearAll: function() {
                            var mapArea = $scope.tdt.map.getControl("MeasureArea");
                            var mapLength = $scope.tdt.map.getControl("MeasureLength");

                            if (mapArea) {
                                mapArea.clear();
                            }

                            if (mapLength) {
                                mapLength.clear();
                            }

                            $scope.tdt.clearFeatures('marker');
                        }
                    }
                }

                $scope.showYjt = function(code) {
                    yjtService.show('sqjz', code);
                }


                $scope.$on('tdt.markpoint', function(e, data) {
                    if(data && data.points) {
                        var points = data.points;
                        _.each(points, function (point) {
                            point.location = {
                                lon: point.x,
                                lat: point.y
                            }
                        });

                        drawPointsTimer(points);
                    }
                });

                var timer = null;
                function drawPointsTimer(points) {
                    if($scope.tdt.map) {
                        clearInterval(timer);
                        $scope.tdt.markPoints(points, 'poi');
                    } else {
                        timer = setInterval(function() {
                            drawPointsTimer(points);
                        }, 1000);
                    }
                }

                $scope.$on('tdt.markalarm', function(e, data) {
                    _.each(data.alarms, function(alarm) {
                        alarm.graphic = {
                            externalGraphic: modulepath + '/lib/images/alarm.gif',
                            graphicWidth: 150,
                            graphicHeight: 150,
                            graphicXOffset: -75,
                            graphicYOffset: -75,
                            graphicOpacity: 1
                        }
                        alarm.location = {
                            lon: alarm.x,
                            lat: alarm.y
                        }
                    });

                    $scope.tdt.markPoints(data.alarms, 'poi');
                });

                $scope.$on('tdt.markpolygon', function(e, data) {
                    if(data && data.points) {
                        $scope.tdt.markPolygon(data.points);
                    }
                });

                function setBoundary() {
                    var points = [
                        [107.81602,21.65931],
                        [107.60549,21.59690],
                        [107.54299,21.59392],
                        [107.48941,21.60285],
                        [107.47972,21.66387],
                        [107.38075,21.59318],
                        [107.35694,21.60136],
                        [107.29891,21.73976],
                        [107.24980,21.70479],
                        [107.19548,21.71744],
                        [107.18633,21.74516],
                        [107.15368,21.75660],
                        [107.09769,21.79631],
                        [107.09452,21.79836],
                        [107.08839,21.80589],
                        [107.07834,21.80896],
                        [107.05637,21.80896],
                        [107.03751,21.81231],
                        [107.01240,21.82412],
                        [107.00635,21.83296],
                        [107.02207,21.84933],
                        [107.05723,21.89183],
                        [107.05667,21.91955],
                        [107.01788,21.94494],
                        [106.99501,21.94810],
                        [106.96674,21.92020],
                        [106.93251,21.93583],
                        [106.91465,21.97303],
                        [106.86071,21.98754],
                        [106.81383,21.97638],
                        [106.79374,21.98642],
                        [106.78295,22.00838],
                        [106.73384,22.00949],
                        [106.72491,21.98494],
                        [106.69329,21.96410],
                        [106.67692,21.99163],
                        [106.70259,22.02512],
                        [106.70296,22.05748],
                        [106.70408,22.10213],
                        [106.68920,22.14119],
                        [106.70445,22.16091],
                        [106.68325,22.16575],
                        [106.67320,22.17877],
                        [106.67543,22.20779],
                        [106.69887,22.21002],
                        [106.68213,22.28071],
                        [106.67208,22.28182],
                        [106.65460,22.33875],
                        [106.58242,22.33949],
                        [106.55787,22.35214],
                        [106.56345,22.37074],
                        [106.59358,22.38897],
                        [106.56419,22.41018],
                        [106.55675,22.46338],
                        [106.59991,22.59248],
                        [106.61107,22.61257],
                        [106.63116,22.61033],
                        [106.78407,22.77180],
                        [106.50388,22.91355],
                        [106.33721,22.85402],
                        [105.86695,22.93140],
                        [105.56635,23.07129],
                        [105.52764,23.24243],
                        [105.62586,23.40761],
                        [105.87141,23.54899],
                        [106.04403,23.50137],
                        [106.14225,23.73650],
                        [105.99468,24.13086],
                        [105.87861,24.02371],
                        [105.49169,24.01478],
                        [105.20894,24.07728],
                        [105.18215,24.16360],
                        [105.03631,24.43147],
                        [104.70296,24.31539],
                        [104.44402,24.63088],
                        [105.19552,24.99697],
                        [105.45743,24.92553],
                        [105.93067,24.72612],
                        [106.14199,24.97613],
                        [106.92178,25.26483],
                        [107.06167,25.57437],
                        [107.23132,25.16009],
                        [107.65991,25.32734],
                        [108.00813,25.21126],
                        [108.15993,25.44937],
                        [108.33851,25.54758],
                        [108.58256,25.45234],
                        [108.72240,25.64878],
                        [109.10634,25.81843],
                        [109.49029,26.03272],
                        [109.95459,26.21130],
                        [110.61533,26.34524],
                        [110.96356,26.38988],
                        [111.29096,26.27380],
                        [111.33858,25.91367],
                        [111.50525,25.86903],
                        [111.43680,25.76188],
                        [111.32965,25.70830],
                        [111.32965,25.49401],
                        [111.11238,25.21721],
                        [110.96059,25.00292],
                        [111.27608,25.15769],
                        [111.44419,25.11899],
                        [111.71206,24.79755],
                        [112.03350,24.75291],
                        [112.06624,24.36896],
                        [111.90849,23.94633],
                        [111.81027,23.80942],
                        [111.60491,23.63381],
                        [111.42931,23.05343],
                        [111.21501,22.72606],
                        [110.78642,22.28852],
                        [110.38164,21.88969],
                        [109.96198,21.84207],
                        [109.91734,21.64861],
                        [109.73427,21.61439],
                        [109.54671,21.47450],
                        [109.14491,21.40009],
                        [109.03181,21.46259],
                        [109.17242,21.53700],
                        [108.91720,21.61438],
                        [108.73768,21.60694],
                        [108.47743,21.56081],
                        [108.22296,21.50426],
                        [108.12080,21.51877],
                        [107.9599,21.53821]
                    ];
                    $scope.tdt.markLine(points);
                }

                dynamicLoadJs(jspath, function () {
                    $scope.tdt.initialize();
                    // setBoundary();
                });
            }
        }
    }]);
});
