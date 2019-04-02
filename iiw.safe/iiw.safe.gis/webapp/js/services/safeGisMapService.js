/**
 * GIS地图服务
 * Created by zcl on 2016/12/27.
 */
define([
    'app',
    'safe/gis/lib/supermap/8.1.0/SuperMap-8.1.0-14126'
], function(app) {
    app.service('safeGisMapService', ['$rootScope', '$compile', 'iAjax', function($rootScope, $compile, iAjax) {
        var map,                //地图对象
            layerTiledMap,         //地图图层
            layerDynaicdMap,
            panzoombar,         //缩放控件
            overviewmap,        //鹰眼控件
            scaleline,          //比例尺控件
            lineLayer,          //线矢量图层
            drawLine,           //线要素
            polygonLayer,       //面矢量图层
            drawPolygon,        //面要素
            taskPolygonLayer,
            drawTaskPolygon,    //任务范围图层
            drawPoint,          //点要素
            pointLayer,         //点矢量图层
            vector,             //要素编辑矢量图层
            modifyFeature,      //要素编辑要素
            snapObj,            //捕捉对象
            rectangleLayer,     //框选矢量图层
            drawRectangle,      //框选要素
            drawRadiusPolygon,  //圆形要素
            placeLayer,         //地图查询显示图层
            plotting,
            plottingLayer,
            plottingEdits = [],
            drawGraphicObjects = [],
            stylePanel,
            infowin,
            markersLayer,
            animatorVector,
            personLineVector,
            drawAlarmPoint,    //报警位置点信息
            alarmPointLayer;   //报警位置点图层
        var markLayers = [];
        var bufferFlag = false;
        var showEagleEye = true;
        var mapUrl, plotUrl, restMapUrl, dataUrl = '';
        var style = {
            strokeColor: "red",
            strokeWidth: 2,
            pointerEvents: "visiblePainted",
            fillColor: "rgba(200,30,30,0.5)",
            fillOpacity: 0.8
        };

        var bufferStyle = {
                strokeColor: "#ff0a0a",
                strokeWidth: 5,
                pointerEvents: "visiblePainted",
                fillColor: "#ff0a0a",
                fillOpacity: 0.5,
                pointRadius: 2
        };
        var filePath = $.soa.getWebPath('iiw.safe.gis') + '/';
        var personList = [
            {name: '李X明',x: '116.328888', y: '39.661844'},
            {name: '黄X俊',x: '116.3499123', y: '39.658943'},
            {name: '王X',x: '116.330891', y: '39.629042'},
            {name: '胡X海',x: '116.340112', y: '39.695741'}
        ];

        //人员实时定位跟踪线路样式
        var realTimeLineStyle = {
            strokeColor:"#339933",
            strokeOpacity:1,
            strokeWidth:3,
            pointRadius:6
        };

        var styleCar = {
            fillColor: "red",
            fillOpacity: 0.8,
            strokeOpacity: 0,
            pointRadius: 5
        };

        function init() {
            var url = '/security/infomanager/information.do?action=getSysettingList';
            var params = {
                filter: {
                    type: 'supergraph'
                }
            };
            iAjax.post(url, params).then(function(data) {
                if(data && data.result && data.result.rows) {
                    $.each(data.result.rows, function(i, o) {

                        if(o.type == 'supergraph_maps') {
                            mapUrl = o.url;
                            //mapUrl = 'http://192.168.1.10:8090/iserver/services/map-china400/rest/maps/China_4326';
                        } else if(o.type == 'supergraph_plot') {
                            plotUrl = o.url;
                            //plotUrl = 'http://192.168.1.10:8090/iserver/services/plot-jingyong/rest/plot/';
                        } else if(o.type == 'supergraph_data') {
                            dataUrl = o.url;
                            //dataUrl = 'http://192.168.1.10:8090/iserver/services/data-world/rest/data';
                        } else if(o.type == 'supergraph_dynaic') {
                            //console.log(o.url);
                            restMapUrl = o.url;
                        }
                    });
                }
            });
        }
        init();

        var funObj = this;
        return {
            /**
             * 地图初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-12-16
             */
            init: function(callback, isOV) {
                /********************地图缩放控件***********************/
                    //初始化复杂缩放控件类
                panzoombar = new SuperMap.Control.PanZoomBar();
                // 是否固定缩放级别为[0,16]之间的整数，默认为false
                panzoombar.forceFixedZoomLevel = true;
                //是否显示滑动条，默认值为false
                panzoombar.showSlider = true;
                /*点击箭头移动地图时，所移动的距离占总距离（上下移动的总距离为高度，左右移动的总距离为宽度）
                 的百分比，默认为null。 例如：如果slideRatio 设为0.5, 则垂直上移地图半个地图高度.*/
                panzoombar.slideRatio = 0.5;
                //设置缩放条滑块的高度，默认为120
                panzoombar.sliderBarHeight = 180;
                //设置缩放条滑块的宽度，默认为13
                panzoombar.sliderBarWidth = 17;
                //map.addControl(panzoombar);

                /********************地图鹰眼控件***********************/
                overviewmap = new SuperMap.Control.OverviewMap();
                //属性minRectSize：鹰眼范围矩形边框的最小的宽度和高度。默认为8pixels
                overviewmap.minRectSize = 20;

                /********************比例尺控件***********************/
                //初始化比例尺控件类
                scaleline = new SuperMap.Control.ScaleLine();
                //是否使用依地量算，默认为false。推荐地图投影为EPSG:4326时设置为false；使用EPSG:900913时设置为true。为true时，比例值按照当前视图中心的水平线计算。
                scaleline.geodesic = true;

                /********************线矢量图层***********************/
                //新建线矢量图层
                lineLayer = new SuperMap.Layer.Vector('lineLayer');
                //对线图层应用样式style
                lineLayer.style = style;

                //创建画线控制，图层是lineLayer;这里DrawFeature(图层,类型,属性)；multi:true在将要素放入图层之前是否现将其放入几何图层中
                drawLine = new SuperMap.Control.DrawFeature(lineLayer, SuperMap.Handler.Path, {multi: true});
                //注册featureadded事件,触发drawCompleted()方法
                drawLine.events.on({'featureadded': this.drawCompleted});

                /********************面矢量图层***********************/
                //新建面矢量图层
                polygonLayer = new SuperMap.Layer.Vector('polygonLayer');
                //对面图层应用样式style
                polygonLayer.style = style;
                //创建画面控制，图层是polygonLayer
                drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
                drawPolygon.events.on({'featureadded': this.areaDrawCompleted});

                /********************任务范围矢量图层***********************/
                taskPolygonLayer = new SuperMap.Layer.Vector('taskPolygonLayer');
                //对面图层应用样式style
                taskPolygonLayer.style = style;
                drawTaskPolygon = new SuperMap.Control.DrawFeature(taskPolygonLayer, SuperMap.Handler.Polygon);
                drawTaskPolygon.events.on({'featureadded': this.taskDrawCompleted});

                pointLayer = new SuperMap.Layer.Vector('pointLayer');
                drawPoint = new SuperMap.Control.DrawFeature(pointLayer, SuperMap.Handler.Point, {multi: true});
                drawPoint.events.on({'featureadded': this.markerDrawCompleted});

                alarmPointLayer = new SuperMap.Layer.Vector('alarmPointLayer');
                //drawAlarmPoint = new SuperMap.Control.DrawFeature(alarmPointLayer, SuperMap.Handler.Point, {multi: true});
                //drawAlarmPoint.events.on({'featureadded': this.showAlarmMarkerCompleted});
                //alarmPointLayer = new SuperMap.Layer.Graphic("GraphicLayer");

                //新建矢量图层
                vector = new SuperMap.Layer.Vector("vectorLayer");
                //创建捕捉对象，第一个参数指的是需要进行捕捉的要素图层，后面两个参数分别是点要素和线要素的捕捉容限，第四个参数是附加参数
                snapObj = new SuperMap.Snap([vector], 100, 100, {actived: true});
                //矢量要素编辑控件
                modifyFeature = new SuperMap.Control.ModifyFeature(vector);
                modifyFeature.snap = snapObj;

                //框选
                rectangleLayer = new SuperMap.Layer.Vector('rectangleVectorLayer');
                drawRectangle = new SuperMap.Control.DrawFeature(rectangleLayer, SuperMap.Handler.Box);
                drawRectangle.events.on({'featureadded': this.drawRectangleCompleted});

                drawRadiusPolygon = new SuperMap.Control.DrawFeature(rectangleLayer, SuperMap.Handler.RegularPolygon, {handlerOptions: {sides: 50}});
                drawRadiusPolygon.events.on({'featureadded': this.drawRadiusCompleted});

                //地图查询显示图层
                placeLayer = new SuperMap.Layer.Vector("placeLyer");
                markersLayer = new SuperMap.Layer.Markers('Markers');
                personLineVector = new SuperMap.Layer.Vector("personLineVector", {styleMap: new SuperMap.StyleMap({"default": realTimeLineStyle})});
                var controlss = null;
                if(isOV) {
                    controlss = [
                        //panzoombar,
                        scaleline,
                        overviewmap,
                        //new SuperMap.Control.LayerSwitcher(),
                        new SuperMap.Control.Navigation({
                            dragPanOptions: {
                                enableKinetic: true
                            }
                        }),
                        drawLine,
                        drawPolygon,
                        drawTaskPolygon,
                        drawPoint,
                        modifyFeature,
                        drawRectangle,
                        drawRadiusPolygon
                    ]
                } else {
                    controlss = [
                        //panzoombar,
                        scaleline,
                        //new SuperMap.Control.LayerSwitcher(),
                        new SuperMap.Control.Navigation({
                            dragPanOptions: {
                                enableKinetic: true
                            }
                        }),
                        drawLine,
                        drawPolygon,
                        drawTaskPolygon,
                        drawPoint,
                        modifyFeature,
                        drawRectangle,
                        drawRadiusPolygon
                    ]
                }
                map = new SuperMap.Map("map", {
                    controls: controlss
                });

                //总控类
                plotting = SuperMap.Plotting.getInstance(map, plotUrl);
                plottingLayer = new SuperMap.Layer.PlottingLayer("标绘图层", plotUrl);
                plottingLayer.style = {
                    fillColor: "#66cccc",
                    fillOpacity: 0.4,
                    strokeColor: "#66cccc",
                    strokeOpacity: 1,
                    strokeWidth: 3,
                    pointRadius: 6
                };

                //态势标绘编辑
                var plottingEdit = new SuperMap.Control.PlottingEdit(plottingLayer);
                plottingEdit.events.on({'featuremodified': function(data) { }});
                plottingEdits.push(plottingEdit);

                // 绘制标号;
                var drawGraphicObject = new SuperMap.Control.DrawFeature(plottingLayer, SuperMap.Handler.GraphicObject);
                drawGraphicObject.events.on({'featureadded': this.situtionPlotCompleted});
                drawGraphicObjects.push(drawGraphicObject);
                //添加态势标绘控件
                map.addControls([plottingEdit, drawGraphicObject]);

                //初始化动画矢量图层
                animatorVector = new SuperMap.Layer.AnimatorVector("Cars", {rendererType:"TadpolePoint"},{
                    //设置速度为每帧播放0.05小时的数据
                    speed:0.05,
                    //开始时间为0晨
                    startTime:0,
                    //结束时间设置为最后运行结束的汽车结束时间
                    endTime:55
                });

                animatorVector.events.on({"drawfeaturestart": this.drawFeatureStart});
                animatorVector.animator.events.on({"firstframestart": this.frameStart});

                //获取图层服务地址
                //if(mapUrl) {
                //    layerTiledMap = new SuperMap.Layer.TiledDynamicRESTLayer('World', mapUrl, {
                //        transparent: true,
                //        cacheEnabled: true
                //    }, {maxResolution: 'auto'});
                //    layerTiledMap.events.on({
                //        layerInitialized: function() {
                //            addDynaicLayer(callback);
                //
                //            function addDynaicLayer(callback) {
                //                layerDynaicdMap = new SuperMap.Layer.TiledDynamicRESTLayer('map2', restMapUrl, {
                //                    transparent: true,
                //                    cacheEnabled: true
                //                }, {maxResolution: 'auto'});
                //                layerDynaicdMap.events.on({
                //                    layerInitialized: function() {
                //                        //添加地图图层、控件PanZoomBar到map
                //                        map.addLayers([layerTiledMap, layerDynaicdMap, lineLayer, polygonLayer, vector, rectangleLayer, plottingLayer, placeLayer, markersLayer, taskPolygonLayer, personLineVector, animatorVector, alarmPointLayer]);
                //                        map.setCenter(new SuperMap.LonLat(116.59 , 40.02), 4);
                //                        var symbolLibManager = plotting.getSymbolLibManager();
                //                        if (!symbolLibManager.isInitializeOK()) {
                //                            symbolLibManager.initializeAsync();
                //                        }
                //
                //                        function initPloting() {
                //                            var plotting = SuperMap.Plotting.getInstance(map, plotUrl);
                //                            var symbolLibManager = plotting.getSymbolLibManager();
                //
                //                            if (!symbolLibManager.isInitializeOK()) {
                //                                symbolLibManager.initializeAsync();
                //                            }
                //                        }
                //
                //                        initPloting();
                //                        if (callback) {
                //                            callback();
                //                        }
                //                    }
                //                });
                //            }
                //        }
                //    });
                //} else {
                    layerDynaicdMap = new SuperMap.Layer.TiledDynamicRESTLayer('map2', mapUrl, {
                        transparent: true,
                        cacheEnabled: true
                    }, {maxResolution: 'auto'});
                    layerDynaicdMap.events.on({
                        layerInitialized: function() {
                            //添加地图图层、控件PanZoomBar到map
                            map.addLayers([layerDynaicdMap, lineLayer, polygonLayer, vector, rectangleLayer, plottingLayer, placeLayer, markersLayer, taskPolygonLayer, personLineVector, animatorVector, alarmPointLayer]);
                            map.setCenter(new SuperMap.LonLat(116.59 , 40.02), 4);
                            var symbolLibManager = plotting.getSymbolLibManager();
                            if (!symbolLibManager.isInitializeOK()) {
                                symbolLibManager.initializeAsync();
                            }

                            function initPloting() {
                                var plotting = SuperMap.Plotting.getInstance(map, plotUrl);
                                var symbolLibManager = plotting.getSymbolLibManager();

                                if (!symbolLibManager.isInitializeOK()) {
                                    symbolLibManager.initializeAsync();
                                }
                            }

                            initPloting();
                            if (callback) {
                                callback(map);
                            }
                        }
                    });
                //}
            },

            getPlotData: function() {
                return plotting.getSymbolLibManager();
            },

            //距离量算
            distanceMeasure: function(flag) {
                bufferFlag = flag;
                this.clearFeatures();
                drawLine.activate();
            },

            //清除线图层
            clearFeatures: function() {
                lineLayer.removeAllFeatures();
                polygonLayer.removeAllFeatures();
                pointLayer.removeAllFeatures();
                vector.removeAllFeatures();
                rectangleLayer.removeAllFeatures();
                plottingLayer.removeAllFeatures();
                markersLayer.clearMarkers();
                if(markLayers.length > 0) {
                    $.each(markLayers, function(i, o){
                        o.clearMarkers();
                    });
                }
                this.deactiveAll();
                $(".safe-gis-message-bar-contaier").removeClass('fadeInUp animated').hide().addClass('fadeOutDown animated');
            },

            deactiveAll: function() {
                drawLine.deactivate();
                drawPolygon.deactivate();
                drawPoint.deactivate();
                modifyFeature.deactivate();
                drawRectangle.deactivate();
                drawRadiusPolygon.deactivate();
                for (var i = 0; i < drawGraphicObjects.length; i++) {
                    drawGraphicObjects[i].deactivate();
                }

                for (var i = 0; i < plottingEdits.length; i++) {
                    plottingEdits[i].deactivate();
                }
            },

            //画线完成回调事件
            drawCompleted: function(drawGeometryArgs) {
                //停止画面控制
                drawLine.deactivate();
                if(bufferFlag) {
                    var feature = new SuperMap.Feature.Vector();
                    feature.geometry = drawGeometryArgs.feature.geometry,
                        feature.style = bufferStyle;
                    lineLayer.addFeatures(feature);

                    var getFeatureParameter, getFeatureService;
                    getFeatureParameter = new SuperMap.REST.GetFeaturesByBufferParameters({
                        bufferDistance: 0.001 * 27,
                        returnContent:true,
                        attributeFilter: "name like '%派出所%' or name like '%武警%' or name like '%公安%' or name like '%医院%' or name like '%车站%'",
                        //datasetNames: ["beijing:省市机关单位", "beijing:普通机关单位", "beijing:merge_POI医疗机构", "beijing:注记_merge_T"],
                        //datasetNames: ["beijing:注记_merge_POI", "beijing:北京监狱图点", "beijing:注记_merge_T"],
                        datasetNames: ["beijing:merge_Hamlet", "beijing:merge_POI", "beijing:merge_T"],
                        geometry: drawGeometryArgs.feature.geometry
                    });
                    getFeatureService = new SuperMap.REST.GetFeaturesByBufferService(dataUrl, {
                        eventListeners: {
                            "processCompleted": function(getFeaturesEventArgs){
                                var list = [];
                                var i, len, features, feature, result = getFeaturesEventArgs.result;
                                if (result && result.features) {
                                    features = result.features;
                                    for (i = 0, len = features.length; i < len; i++) {
                                        feature = features[i];
                                        var marker = new SuperMap.Layer.Markers( "Markers" );
                                        map.addLayer(marker);
                                        markLayers.push(marker);
                                        var size = new SuperMap.Size(48,53);
                                        var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                                        var icon = new SuperMap.Icon(filePath + '/image/marker/marker.png', size, offset);

                                        marker.addMarker(new SuperMap.Marker(new SuperMap.LonLat(feature.data.SMX, feature.data.SMY),icon));
                                        var element = document.createElement('div');
                                        element.className = 'safe-gis-place-icon-number';
                                        element.innerHTML = feature.data.NAME;
                                        element.title = feature.data.NAME;
                                        marker.markers[0].icon.imageDiv.appendChild(element);
                                    }
                                }
                            }, "processFailed": this.processFailed}
                    });
                    getFeatureService.processAsync(getFeatureParameter);
                } else {
                    //获得图层几何对象
                    var geometry = drawGeometryArgs.feature.geometry,
                        measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
                        myMeasuerService = new SuperMap.REST.MeasureService(restMapUrl); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
                    myMeasuerService.events.on({'processCompleted': function(measureEventArgs) {
                            var distance = measureEventArgs.result.distance;
                            var unit = measureEventArgs.result.unit;
                            $(".safe-gis-message-info-box").text('量算距离：'+ Math.round(distance) + '（米）');
                            $(".safe-gis-message-bar-contaier").removeClass('fadeOutDown animated').show().addClass('fadeInUp animated');
                        }
                    });

                    //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
                    myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
                    myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
                }
            },

            //面积量算
            areaMeasure: function() {
                this.clearFeatures();
                drawPolygon.activate();
            },

            //画面完成回调事件
            areaDrawCompleted: function(drawGeometryArgs) {
                //停止画面控制
                drawPolygon.deactivate();
                //获得图层几何对象
                var geometry = drawGeometryArgs.feature.geometry,
                    measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
                    myMeasuerService = new SuperMap.REST.MeasureService(restMapUrl); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
                myMeasuerService.events.on({
                    'processCompleted': function(measureEventArgs) {
                        var area = measureEventArgs.result.area;
                        var unit = measureEventArgs.result.unit;
                        $(".safe-gis-message-info-box").text('量算面积：'+ Math.round(area) + '（平方米）');
                        $(".safe-gis-message-bar-contaier").removeClass('fadeOutDown animated').show().addClass('fadeInUp animated');
                    }
                });

                //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
                myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;
                myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
            },

            //距离量算
            drawTaskArea: function() {
                this.clearFeatures();
                drawTaskPolygon.activate();
            },

            taskDrawCompleted: function(drawGeometryArgs) {
                //停止画面控制
                drawTaskPolygon.deactivate();
            },

            drawPoint: function() {
                this.deactiveAll();
                drawPoint.activate();
            },

            markerDrawCompleted : function(drawGeometryArgs){
                var size = new SuperMap.Size(42, 50);
                var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                var icon = new SuperMap.Icon(filePath + '/image/marker/marker.png', size, offset);
                var marker = new SuperMap.Marker(new SuperMap.LonLat(drawGeometryArgs.feature.geometry.components[0].x, drawGeometryArgs.feature.geometry.components[0].y),icon);
                markersLayer.addMarker(marker);
                //marker.markers[0].icon.imageDiv.className = 'faa-bounce animated';
                //注册 click 事件,触发 mouseClickHandler()方法
                marker.events.on({'click': function(event) {
                    console.log(marker);
                    closeInfoWin();
                    //初始化popup类
                    //服务加载后，加载一键通指令($scope.yjtpanel提供了一些界面操作的接口)
                    var $scope = $rootScope.$new(),
                        markerTemplate = $compile('<gis-marker-dialog></gis-marker-dialog>')($scope);
                    console.log($scope);

                    var popup = new SuperMap.Popup(
                        'chicken',
                        marker.getLonLat(),
                        new SuperMap.Size(400,300),
                        markerTemplate[0].outerHTML,
                        true,
                        null
                    );
                    //设置弹窗的边框样式
                    popup.setBorder("solid 2px #6CA6CD");
                    //允许弹出内容的最小尺寸
                    popup.mixSize = 200;

                    infowin = popup;
                    //添加弹窗到map图层
                    map.addPopup(popup);

                    function closeInfoWin(){
                        if(infowin){
                            try{
                                infowin.hide();
                                infowin.destroy();
                            } catch(e){
                                console.log(e);
                            }
                        }
                    }
                }});
            },

            closeInfoWin: function() {
                if(infowin){
                    try{
                        infowin.hide();
                        infowin.destroy();
                    } catch(e){
                        console.log(e);
                    }
                }
            },

            addData: function() {
                vector.setVisibility(true);
                rectangleLayer.setVisibility(false);
                var point_features = [];
                //面数据
                var polygon_data = [[-16, 30], [-16, 0], [50, 0], [50, 30]];
                var points = [];
                for (var i = 0, len = polygon_data.length; i < len; i++) {
                    var point = new SuperMap.Geometry.Point(polygon_data[i][0], polygon_data[i][1]);
                    points.push(point);
                }
                var linearRing = new SuperMap.Geometry.LinearRing(points);
                var polygon = new SuperMap.Geometry.Polygon([linearRing]);
                var polygon_feature = new SuperMap.Feature.Vector(polygon);
                point_features.push(polygon_feature);
                vector.addFeatures(point_features);

                this.deactiveAll();
                modifyFeature.activate();
                snapObj.on();     //开启捕捉

                modifyFeature.events.on({
                    'afterfeaturemodified': function(data) {
                        if (data.modified) {
                            vector.removeAllFeatures();
                            var featureArray = [];
                            var pointsArray = [];
                            var points = data.feature.geometry.components[0].components;
                            $.each(points, function(i, p) {
                                var point = new SuperMap.Geometry.Point(p.x, p.y);
                                pointsArray.push(point);
                            });

                            var linearRing1 = new SuperMap.Geometry.LinearRing(pointsArray);
                            var polygon1 = new SuperMap.Geometry.Polygon([linearRing1]);
                            var polygon_feature1 = new SuperMap.Feature.Vector(polygon1);
                            featureArray.push(polygon_feature1);
                            vector.addFeatures(featureArray);
                        }
                    }
                });
            },

            drawRectangleCompleted: function(drawGeometryArgs) {
                drawRectangle.deactivate();
                var feature = drawGeometryArgs.feature;
                feature.style = style;
                rectangleLayer.addFeatures(feature);
                var bounds = drawGeometryArgs.feature.geometry.bounds;
                $.each(personList, function(i, o){
                    var isContains = bounds.containsLonLat(new SuperMap.LonLat(o.x, o.y), true);
                    if(isContains) {
                        var size = new SuperMap.Size(70, 49);
                        var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                        var icon = new SuperMap.Icon(filePath + '/image/marker/person.jpg', size, offset);
                        var marker = new SuperMap.Marker(new SuperMap.LonLat(o.x, o.y),icon);
                        markersLayer.addMarker(marker);

                        var element = document.createElement('div');
                        element.className = 'safe-gis-place-icon-number';
                        element.innerHTML = o.name;
                        element.title = o.name;
                        marker.icon.imageDiv.appendChild(element);
                    }
                });
            },

            drawRadiusCompleted: function(drawGeometryArgs) {
                var feature = new SuperMap.Feature.Vector();
                feature.geometry = drawGeometryArgs.feature.geometry;
                feature.style = style;
                rectangleLayer.addFeatures(feature);

                var bounds = drawGeometryArgs.feature.geometry.bounds;
                $.each(personList, function(i, o){
                    var isContains = bounds.containsLonLat(new SuperMap.LonLat(o.x, o.y), true);
                    if(isContains) {
                        var size = new SuperMap.Size(45, 45);
                        var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                        var icon = new SuperMap.Icon(filePath + '/image/marker/person.jpg', size, offset);
                        var marker = new SuperMap.Marker(new SuperMap.LonLat(o.x, o.y),icon);
                        markersLayer.addMarker(marker);

                        var element = document.createElement('div');
                        element.className = 'safe-gis-place-icon-number';
                        element.innerHTML = o.name;
                        element.title = o.name;
                        marker.markers[0].icon.imageDiv.appendChild(element);
                    }
                });
            },

            drawRectangle: function() {
                this.deactiveAll();
                rectangleLayer.setVisibility(true);
                vector.setVisibility(false);
                drawRectangle.activate();
            },

            drawRadius: function() {
                this.deactiveAll();
                rectangleLayer.setVisibility(true);
                vector.setVisibility(false);
                drawRadiusPolygon.activate();
            },

            startPloting: function(node) {
                var controls = map.controls;
                for (var i = 0; i < controls.length; i++) {
                    if (controls[i].CLASS_NAME === "SuperMap.Control.PlottingEdit") {
                        controls[i].deactivate();
                    }
                }

                for(var i = 0;i < drawGraphicObjects.length; i++) {
                    if(drawGraphicObjects[i].handler) {
                        drawGraphicObjects[i].handler.libID = node.libID;
                        drawGraphicObjects[i].handler.symbolCode = node.symbolCode;
                        drawGraphicObjects[i].handler.serverUrl = plotUrl;

                        drawGraphicObjects[i].deactivate();
                        drawGraphicObjects[i].activate();
                    }
                }
            },

            situtionPlotCompleted: function(drawGeometryArgs) {
                for (var i = 0; i < drawGraphicObjects.length; i++) {
                    drawGraphicObjects[i].deactivate();
                }

                for (var i = 0; i < plottingEdits.length; i++) {
                    plottingEdits[i].deactivate();
                }

                for (var i = 0; i < plottingEdits.length; i++) {
                    plottingEdits[i].activate();
                }
                //plottingLayer.createSymbolWC(drawGeometryArgs.feature.geometry.libID,drawGeometryArgs.feature.geometry.code,drawGeometryArgs.feature.geometry.controlPoints,null);
            },

            plotEditCompleted: function(drawGeometryArgs) {
                console.log(drawGeometryArgs);
            },

            setMapCenter: function(x, y) {
                map.setCenter(new SuperMap.LonLat(x, y), map.getZoom());
            },

            addPopup: function() {
                /*var contentHTML = '<div style="height:100%;width:100%;position: relative;"><i style="font-size:30px;height:40px;width:40px;color:red;" class="fa fa-warning faa-flash animated"></i></div>';
                 var popwin = new SuperMap.Popup.Anchored("videoPopupPanel",
                 new SuperMap.LonLat(116.3,39.9),
                 new SuperMap.Size(40,40),
                 contentHTML,
                 null,
                 false,
                 null);
                 map.addPopup(popwin);*/
            },

            addMaker: function() {
                /*var marker = new SuperMap.Layer.Markers( "Markers" );
                map.addLayer(marker);

                var size = new SuperMap.Size(21,25);
                var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                var icon = new SuperMap.Icon(filePath + '/image/overview_replacement.gif', size, offset);

                marker.addMarker(new SuperMap.Marker(new SuperMap.LonLat(113.51, 22.89),icon));
                marker.markers[0].icon.imageDiv.className = 'faa-bounce animated';*/
            },

            addMapLayers: function(layerObj) {
                map.addLayers([layerObj]);
            },

            addAlarmPoint: function() {
                /*var contentHTML = '<div style="height:20px;width:20px;position: relative;"></div>';
                 var popwin = new SuperMap.Popup.Anchored("videoPopupPanel2",
                 new SuperMap.LonLat(116.3,39.9),
                 new SuperMap.Size(20,20),
                 contentHTML,
                 null,
                 false,
                 null);
                 map.addPopup(popwin);*/
            },

            getFeaturesBySQL: function(params, callback) {
                placeLayer.removeAllFeatures();
                var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;

                getFeatureParam = new SuperMap.REST.FilterParameter({
                    name: 'beijing',
                    attributeFilter: "name like '%" + (params ? params: 'test' ) + "%' or name_1 like '%" + (params ? params: 'test' ) + "%' or telephone like '%" + (params ? params: 'test' ) + "%'"
                });
                getFeatureBySQLParams = new SuperMap.REST.GetFeaturesBySQLParameters({
                    queryParameter: getFeatureParam,
                    //datasetNames: ["beijing:省市机关单位", "beijing:普通机关单位", "beijing:merge_POI医疗机构", "beijing:注记_merge_T"]
                    //datasetNames: ["beijing:注记_merge_POI", "beijing:北京监狱图点", "beijing:注记_merge_T"]
                    datasetNames: ["beijing:merge_Hamlet", "beijing:merge_POI", "beijing:merge_T"]
                });
                getFeatureBySQLService = new SuperMap.REST.GetFeaturesBySQLService(dataUrl, {
                    eventListeners: {"processCompleted": function(getFeaturesEventArgs){
                        var list = [];
                        var i, len, features, feature, result = getFeaturesEventArgs.result;
                        if (result && result.features && result.features.length > 0) {
                            //markLayers = [];
                            features = result.features;
                            for (i = 0, len = features.length; i < len; i++) {
                                feature = features[i];
                                var marker = new SuperMap.Layer.Markers( "Markers" );
                                map.addLayer(marker);
                                markLayers.push(marker);
                                var size = new SuperMap.Size(48,53);
                                var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                                var icon = new SuperMap.Icon(filePath + '/image/marker/marker.png', size, offset);

                                marker.addMarker(new SuperMap.Marker(new SuperMap.LonLat(feature.data.SMX, feature.data.SMY),icon));
                                var element = document.createElement('div');
                                element.className = 'safe-gis-place-icon-number';
                                /*if(i+ 1 < 10) {
                                    element.className = 'safe-gis-place-icon-number';
                                } else {
                                    element.className = 'safe-gis-place-icon-number2';
                                }*/
                                element.innerHTML = feature.data.NAME;
                                element.title = feature.data.NAME;
                                marker.markers[0].icon.imageDiv.appendChild(element);
                                //marker.markers[0].icon.imageDiv.className = 'faa-bounce animated';

                                var placeStyle = {
                                    pointRadius: 15,
                                    //externalGraphic: filePath + '/image/cluster1.png',
                                    name: 'captial'
                                };

                                feature.style = placeStyle;
                                feature.style.stylegraphicTitle = feature.data.NAME;
                                feature.style.label = feature.data.NAME;
                                feature.style.labelAlign = 'cm';
                                feature.style.labelYOffset = 25;
                                feature.style.fontColor = 'red';
                                feature.markerObj = marker.markers[0].icon.imageDiv;
                                //console.log(feature);
                                //placeLayer.addFeatures(feature);
                                list.push(feature);
                            }
                        }
                        if(callback) callback(list);
                    }, "processFailed": this.processFailed}
                });

                getFeatureBySQLService.processAsync(getFeatureBySQLParams);
            },

            /*processCompleted: function(getFeaturesEventArgs, callback) {

            },*/

            processFailed: function(e) {
                //alert(e.error.errorMsg);
            },

            showTaskArea: function() {
                var points =[];
                var latArray = [];
                latArray.push({x: 106.42205457199, y: 29.33});
                latArray.push({x: 105.22205457199, y: 29.01});
                latArray.push({x: 104.12205457199, y: 29.12});
                latArray.push({x: 103.02205457199, y: 25.857});
                latArray.push({x: 102.92205457199, y: 25.11});
                latArray.push({x: 101.18205457199, y: 25.67});
                for(var i = 0 ;i < latArray.length; i++) {
                    var point = new SuperMap.Geometry.Point(latArray[i].x, latArray[i].y);
                    points.push(point);
                }

                var linearRings = new SuperMap.Geometry.LinearRing(points);
                var region = new SuperMap.Geometry.Polygon([linearRings]);
                var polygonVector = new SuperMap.Feature.Vector(region);
                taskPolygonLayer.addFeatures(polygonVector);
            },

            realTimeTrajectory: function() {
                animatorVector.animator.destroy();
                var points = [];
                var lineFeatures = [];
                var cars = [];
                var latArray = [];
                latArray.push({x: 106.42205457199, y: 29.33});
                latArray.push({x: 105.22205457199, y: 29.01});
                latArray.push({x: 104.12205457199, y: 29.12});
                latArray.push({x: 103.02205457199, y: 25.857});
                latArray.push({x: 102.92205457199, y: 25.11});
                latArray.push({x: 101.18205457199, y: 25.67});
                for(var i = 0 ;i < latArray.length; i++) {
                    var point = new SuperMap.Geometry.Point(latArray[i].x, latArray[i].y);
                    var car = new SuperMap.Feature.Vector(point,
                        {
                            FEATUREID: Math.round(),
                            //根据节点生成时间
                            TIME: i
                        }, styleCar);
                    cars.push(car);
                    points.push(point);
                }
                var multiLineString = new SuperMap.Geometry.LineString(points);
                var lineFeature = new SuperMap.Feature.Vector(multiLineString, null, realTimeLineStyle);
                lineFeatures.push(lineFeature);
                personLineVector.addFeatures(lineFeatures);
                animatorVector.addFeatures(cars);
            },

            startPlay: function() {
                animatorVector.renderer.tail = false;
                animatorVector.animator.start();
            },

            drawFeatureStart: function() {
                console.log(animatorVector.animator.getRunning());
            },

            frameStart: function() {
                console.log("1" + animatorVector.animator.getRunning());
            },

            showAlarmPoint: function(data) {
                /*var point = new SuperMap.Geometry.Point(data.longitude, data.latitude);
                var pointVector = new SuperMap.Feature.Vector(point);
                pointVector.style={
                    fillColor: 'red',
                    strokeColor: 'red',
                    pointRadius: 15
                };

                alarmPointLayer.addFeatures([pointVector]);*/
                var marker = new SuperMap.Layer.Markers( "Markers" );
                map.addLayer(marker);

                var size = new SuperMap.Size(32,32);
                var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                var icon = new SuperMap.Icon(filePath + '/image/marker/alarm.gif', size, offset);

                marker.addMarker(new SuperMap.Marker(new SuperMap.LonLat(data.longitude , data.latitude),icon));
                var element = document.createElement('div');
                element.className = 'safe-gis-place-icon-number';
                element.innerHTML = data.syouname;
                element.title = data.syouname;
                marker.markers[0].icon.imageDiv.appendChild(element);
                map.setCenter(new SuperMap.LonLat(data.longitude, data.latitude), map.getZoom());
                map.zoomToScale(3);
                //marker.markers[0].icon.imageDiv.className = 'faa-bounce animated';
            },

            showEagle: function() {
                showEagleEye = !showEagleEye;
                if(showEagleEye) {
                    $(".smControlOverviewMapMaximizeButton")[0].click();
                } else {
                    $(".smControlOverviewMapMinimizeButton")[0].click();
                }
            },

            zoomIn: function() {
                map.zoomIn();
            },

            zoomOut: function() {
                map.zoomOut();
            },

            removeMap: function() {
                if(map)map.destroy();
            }
        }
    }]);
});
