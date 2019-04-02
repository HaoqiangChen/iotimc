/**
 * 社矫人员定位
 *
 * @author - llx
 * @date - 2018-08-13
 * @version - 0.1
 */
define([
    'app',
    'cssloader!safe/sjposition/css/index.css',
    'cssloader!../lib/css/bootstrap-responsive.min.css',
    'cssloader!../lib/css/jquery-sticklr.css',
    '../lib/js/bevInclude',
    '../lib/js/SuperMap.Include',
    '../lib/js/plottingPanel/PlottingPanel.Include',
    'safe/sjposition/js/directives/safeSjAlarmEchart',
    'safe/sjposition/js/directives/safePositionTree',
    'safe/sjposition/js/directives/safeGxTdt'
], function (app) {
    app.controller('sjPositionController', [
        '$scope',
        'safeMainTitle',
        '$filter',
        'iAjax',
        '$interval',
        'yjtService',
        'iConfirm',
        'iMessage',
        function($scope, safeMainTitle, $filter, iAjax, $interval, yjtService, iConfirm, iMessage) {

            safeMainTitle.title = '社矫人员定位';
            var map, plottingLayer, layer;
            var mapUrl = "";
            var dataUrl = "";
            var plotUrl = '';
            var supermapDataUrl = "";
            var vector = '';
            var restMapUrl = '';
            var recentFacilityMarkers = [];
            var filePath = $.soa.getWebPath('iiw.safe.sjposition') + '/';
            var plotting, markersLayer, markerAlarm, popup, marker, points2, linearRings, region, polygonVector,scaleline,          //比例尺控件
                lineLayer,          //线矢量图层
                drawLine,           //线要素
                polygonLayer,       //面矢量图层
                drawPolygon,        //面要素
                drawPolygon1,
                taskPolygonLayer,
                drawTaskPolygon,    //任务范围图层
                drawPoint,          //点要素
                pointLayer,         //点矢量图层
                modifyFeature,      //要素编辑要素
                snapObj,            //捕捉对象
                rectangleLayer,     //框选矢量图层
                drawRectangle,      //框选要素
                drawRadiusPolygon,  //圆形要素
                placeLayer,         //地图查询显示图层
                animatorVector,
                alarmPointLayer,
                bestPathSelect,
                bestPathDrawPoint,
                serviceAreaDrawPoint,
                travelAnalysisDrawPoint,
                recentFacilityDrawPoint,
                plottingEdits = [],
                drawGraphicObjects = [];
            var infowin = null;
            var style = {
                strokeColor: "red",
                strokeWidth: 2,
                pointerEvents: "visiblePainted",
                fillColor: "rgba(200,30,30,0.5)",
                fillOpacity: 0.8
            };
            var bestPathStyle = {
                strokeColor: "#304DBE",
                strokeWidth: 3,
                pointerEvents: "visiblePainted",
                fill: false
            };
            var recentFacilityStyle = {
                strokeColor: "#304DBE",
                strokeWidth: 3,
                pointerEvents: "visiblePainted",
                fill: false
            };
            var travelAnalysisStyle = {
                strokeColor: "#304DBE",
                strokeWidth: 3,
                pointerEvents: "visiblePainted",
                fill: false
            };
            var styleGuideLine = {
                strokeColor: "#25FF25",
                strokeWidth: 6,
                fill: false
            };
            var styleGuidePoint = {
                pointRadius: 10,
                externalGraphic: filePath + '/images/marker/walk.png'
            };
            var personList = [
                {name: '李X明',x: '116.328888', y: '39.661844'},
                {name: '黄X俊',x: '116.3499123', y: '39.658943'},
                {name: '王X',x: '116.330891', y: '39.629042'},
                {name: '胡X海',x: '116.340112', y: '39.695741'}
            ];
            var pathPopup, pathListIndex = 0, routeCompsIndex = 0, nodeArray = [];
            var centersArray = [], weightsArray = [], serviceAreaN = 0;
            var travelAnalysisi = 0, travelAnalysisj = 0, travelAnalysisPathTime, travelAnalysisResult;
            var recentFacilityn = 0, recentFacilityEventPoint;
            /* == Supermap ==
            var facilityPoints = [
                new SuperMap.Geometry.Point(6000, -5500),
                new SuperMap.Geometry.Point(5500, -2500),
                new SuperMap.Geometry.Point(2500, -3500)
            ];
            */
            // var intervalMarker;
            $scope.plotType = [];
            $scope.iconList = [];
            $scope.symbolList = [];
            $scope.showDialogDetail = false;
            $scope.transportationStatus = false;
            $scope.showView = 'sjry';
            $scope.SJGis = {
                list: [],
                dialogInfo: ''
            };
            $scope.searchMapCriminal = '';
            $scope.mapMenu = [
                {name: '布控点设置', type: 'dtbz', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m01.jpg'},
                {name: '框选', type: 'kx', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m06.png'},
                {name: '态势标绘', type: 'tsbh', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m02.jpg'},
                {name: '地图人员查询', type: 'ddcx', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m04.jpg'},
                {name: '测距', type: 'cj', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/toolbar/measure.png'},
                {name: '面积测量', type: 'mjcl', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/toolbar/measure.png'},
                {name: '任务派发', type: 'rwpf', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m05.png'},
                {name: '最佳路径分析', type: 'ljfx', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m07.png', action: false},
                {name: '旅行社分析', type: 'lxsfx', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m07.png', action: false},
                {name: '最近设施分析', type: 'zjss', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m07.png', action: false},
                {name: '服务区分析', type: 'fwqfx', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m07.png', action: false},
                {name: '清除', type: 'qc', icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/menu/m03.jpg'}
            ];

            $scope.criminalRange = [];

            $scope.clickMark = function(criminal) {
                /* == Supermap ==
                markersLayer.clearMarkers();
                var point = new SuperMap.Geometry.Point(criminal.x, criminal.y),
                    size = new SuperMap.Size(44, 40),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon($.soa.getWebPath('iiw.safe.sjposition') + "/lib/images/marker.png", size, offset);
                marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
                markersLayer.addMarker(marker);
                marker.events.on({
                    "click": mouseClickHandler
                });
                var element = document.createElement('div');
                element.className = 'safe-gis-place-icon-number';
                element.innerHTML = criminal.xm;
                marker.icon.imageDiv.appendChild(element);
                $scope.SJGis.dialogInfo = criminal;
                map.addLayers([markersLayer, plottingLayer]);
                map.setCenter(new SuperMap.LonLat(point.x, point.y), 6);
                */

                $scope.$broadcast('tdt.markpoint', {
                    points: [criminal]
                });
            };

            // $scope.clickAlarmMark = function(item) {
            //     $scope.SJGis.dialogInfo = item;
            //     markerAlarm = new SuperMap.Layer.Markers("Markers");
            //     var point = new SuperMap.Geometry.Point(108.43, 23.23),
            //         size = new SuperMap.Size(154, 150),
            //         offset = new SuperMap.Pixel(-(size.w / 2), -(size.h / 2)),
            //         icon = new SuperMap.Icon($.soa.getWebPath('iiw.safe.sjposition') + "/lib/images/alarm.gif", size, offset);
            //     marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
            //     markerAlarm.addMarker(marker);
            //     marker.events.on({
            //         "click": mouseClickAlarmHandler,
            //     });
            //     $scope.SJGis.dialogInfo = item;
            //     map.addLayers([markerAlarm]);
            //     map.setCenter(new SuperMap.LonLat(point.x, point.y), 3);
            // };

            $scope.showYjtServices = function(bm) {
                yjtService.show('sqjz', bm);
            };

            $scope.changeView = function(type) {
                $scope.showView = type;
            };

            $scope.criminal = {
                list: [],
                filter: {
                    text: '',
                    type: 'sqjz'
                },
                pages: {
                    pageNo: 1,
                    pageSize: 10
                },
                getData: function() {
                    iAjax.post('security/information/information.do?action=getSqjzrydwxxInformation', {
                        filter: {
                            searchText: $scope.criminal.filter.text,
                            type: $scope.criminal.filter.type
                        },
                        params: {
                            pageNo: $scope.criminal.pages.pageNo,
                            pageSize: $scope.criminal.pages.pageSize
                        }
                    }).then(function (data) {
                        if(data && data.result.rows) {
                            $.each(data.result.rows, function(i, o) {
                                o.x = parseFloat(o.x);
                                o.y = parseFloat(o.y);
                            });
                            $scope.criminal.list = data.result.rows;

                            drawCriminalMarkers($scope.criminal.list);
                        }
                        if(data && data.result.params) {
                            $scope.criminal.pages.totalPage = data.result.params.totalPage;
                            $scope.criminal.pages.totalSize = data.result.params.totalSize;
                        }
                    });
                },
                search: function(event) {
                    if(event && event.keyCode != 13) {
                        return;
                    }

                    $scope.criminal.pages.pageNo = 1;
                    $scope.criminal.getData();
                }
            }

            /*$scope.mapSearchKeyPressEvent = function(event) {
                if(event.keyCode == 13) {
                    $scope.mapSearch();
                }
            };*/

            $scope.alarm = {
                list: [],
                filter: {
                    type: 'sqjz'
                },
                pages: {
                    pageNo: 1,
                    pageSize: 10
                },
                getData: function() {
                    iAjax.post('security/information/information.do?action=getSqjzrywgxxInformation', {
                        filter: {
                            type: $scope.alarm.filter.type
                        },
                        params: {
                            pageNo: $scope.alarm.pages.pageNo,
                            pageSize: $scope.alarm.pages.pageSize
                        }
                    }).then(function (data) {
                        if(data.result && data.result.rows) {
                            $scope.alarm.list = data.result.rows;

                            if(data.result.params) {
                                $scope.alarm.pages.totalSize = data.result.params.totalSize;
                                $scope.alarm.pages.totalPage = data.result.params.totalPage;
                            }
                        }
                    });
                }
            }

            function drawCriminalMarkers(criminals) {
                /*
                //定位初始位置
                markersLayer = new SuperMap.Layer.Markers("Markers");
                //在地图上创建标点
                $.each($scope.criminal.list, function(i,o) {
                    o.x = parseFloat(o.x) + Math.random();
                    o.y = parseFloat(o.y) + Math.random();
                    var point = new SuperMap.Geometry.Point(o.x, o.y),
                        size = new SuperMap.Size(44, 40),
                        offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                        icon = new SuperMap.Icon($.soa.getWebPath('iiw.safe.gis') + "/images/marker/marker.png", size, offset);
                    marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
                    marker.tempObj = $scope.criminal.list[i];
                    markersLayer.addMarker(marker);
                    marker.events.on({
                        "click": mouseClickHandler
                    });

                    var element = document.createElement('div');
                    element.className = 'safe-gis-place-icon-number';
                    element.innerHTML = o.xm;
                    marker.icon.imageDiv.appendChild(element);
                });
                setTimeout(function() {
                    map.addLayers([markersLayer, plottingLayer]);
                }, 300)
                */

                $scope.$broadcast('tdt.markpoint', {
                    points: criminals
                });
            }

            $scope.menuClick = function(row) {
                $scope.deactiveAll();
                $scope.transportationStatus = false;
                row.action = false;
                switch(row.type) {
                    case 'dtbz':
                        $scope.drawPoint();
                        break;
                    case 'kx':
                        $scope.drawRectangle();
                        break;
                    case 'tsbh':
                        $scope.showPlotInfo();
                        break;
                    case 'ddcx':
                        $scope.showSearchInfo();
                        break;
                    case 'qc':
                        $scope.clearMap();
                        break;
                    case 'cj':
                        $scope.measuring();
                        break;
                    case 'rwpf':
                        $scope.taskDistribution();
                        break;
                    case 'mjcl':
                        $scope.areaMeasure();
                        break;
                    case 'ljfx':
                        row.action = true;
                        $scope.clearElementsPoints();
                        $scope.bestPathSelectPoints();
                        break;
                    case 'lxsfx':
                        row.action = true;
                        $scope.travelAnalysisSelectPoints();
                        break;
                    case 'zjss':
                        row.action = true;
                        $scope.recentFacilitySelectPoint();
                        break;
                    case 'fwqfx':
                        row.action = true;
                        $scope.selectServiceAreaCenters();
                        break;
                    default :
                        break;
                }
            };

            $scope.transportation = function(item, type) {
                item.action = false;
                switch (type) {
                    case 'ljfx':
                        $scope.transportationZjlj();
                        break;
                    case 'lxsfx':
                        $scope.findTSPPaths();
                        break;
                    case 'zjss':
                        $scope.findClosestFacilities();
                        break;
                    case 'fwqfx':
                        $scope.findServiceAreas();
                        break;
                    default:
                        break;
                }
            }

            $scope.clearMap = function() {
                lineLayer.removeAllFeatures();
                polygonLayer.removeAllFeatures();
                pointLayer.removeAllFeatures();
                vector.removeAllFeatures();
                rectangleLayer.removeAllFeatures();
                plottingLayer.removeAllFeatures();
                markersLayer.clearMarkers();
                $scope.deactiveAll();
                $(".safe-gis-message-bar-contaier").removeClass('fadeInUp animated').hide().addClass('fadeOutDown animated');
            };

            $scope.showPlotInfo = function() {
                initPlotInfo();
                $scope.showPlotPanel = true;
                $scope.showSearchPanel = false;
            };

            $scope.showSearchInfo = function () {
                $scope.showPlotPanel = false;
                $scope.showSearchPanel = true;
            };

            /*$scope.mapSearch = function() {
                var data = {
                    filter: {
                        searchText: $scope.searchMapCriminal,
                        type: 'sqjz'
                    },
                    params: {
                        pageNo: 1,
                        pageSize: 10
                    }
                };
                iAjax
                    .post('security/information/information.do?action=getSqjzrydwxxInformation', data)
                    .then(function (data) {
                        if(data && data.result.rows) {
                            $.each(data.result.rows, function(i, o) {
                                o.x = parseFloat(o.x);
                                o.y = parseFloat(o.y);
                            });
                            $scope.clickMark(data.result.rows[0]);
                        }
                    })
            };*/

            $scope.drawPoint = function() {
                $scope.deactiveAll();
                drawPoint.activate();
            };

            $scope.drawRectangle = function () {
                $scope.deactiveAll();
                rectangleLayer.setVisibility(true);
                vector.setVisibility(false);
                drawRectangle.activate();
            };

            $scope.deactiveAll= function() {
                drawLine.deactivate();
                drawPolygon.deactivate();
                drawPolygon1.deactivate();
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
            };

            $scope.hidePlotPanel = function() {
                $scope.showPlotPanel = false;
            };

            $scope.hideSearchPanel = function() {
                $scope.showSearchPanel = false;
            };

            $scope.measuring= function() {
                lineLayer.removeAllFeatures();
                drawLine.activate();
            };

            $scope.areaMeasure = function() {
                clearFeatures();
                drawPolygon1.activate();
            };

            $scope.taskDistribution = function () {
                $scope.showDialogDetail = true;
                $scope.police.search();
            };

            $scope.drawCompleted = function(drawGeometryArgs) {
                var geometry = drawGeometryArgs.feature.geometry,
                    measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
                    myMeasuerService = new SuperMap.REST.MeasureService(mapUrl); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
                myMeasuerService.events.on({ "processCompleted": $scope.measureCompleted });

                //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA
                myMeasuerService.measureMode = SuperMap.REST.MeasureMode.DISTANCE;
                myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
            }

            $scope.measureCompleted = function(measureEventArgs) {
                var distance = measureEventArgs.result.distance;
                //var unit = measureEventArgs.result.unit;
                alert("量算结果:"+distance + "米");
            }

            $scope.measureCompletedMeasuring = function(measureEventArgs) {
                var area = measureEventArgs.result.area;
                //var unit = measureEventArgs.result.unit;
                alert("量算结果:"+ area + "平方米");
            }

            $scope.drawCompletedMeasuring = function(drawGeometryArgs) {
                //停止画面控制
                drawPolygon1.deactivate();
                //获得图层几何对象
                var geometry = drawGeometryArgs.feature.geometry,
                    measureParam = new SuperMap.REST.MeasureParameters(geometry), /* MeasureParameters：量算参数类。 客户端要量算的地物间的距离或某个区域的面积*/
                    myMeasuerService = new SuperMap.REST.MeasureService(mapUrl); //量算服务类，该类负责将量算参数传递到服务端，并获取服务端返回的量算结果
                myMeasuerService.events.on({ "processCompleted": $scope.measureCompletedMeasuring });

                //对MeasureService类型进行判断和赋值，当判断出是LineString时设置MeasureMode.DISTANCE，否则是MeasureMode.AREA

                myMeasuerService.measureMode = SuperMap.REST.MeasureMode.AREA;

                myMeasuerService.processAsync(measureParam); //processAsync负责将客户端的量算参数传递到服务端。
            }


            $scope.drawRectangleCompleted = function(drawGeometryArgs) {
                markersLayer.clearMarkers();
                drawRectangle.deactivate();
                var feature = drawGeometryArgs.feature;
                feature.style = style;
                rectangleLayer.addFeatures(feature);
                var bounds = drawGeometryArgs.feature.geometry.bounds;
                $.each($scope.criminal.list, function(i, o){
                    var isContains = bounds.containsLonLat(new SuperMap.LonLat(o.x, o.y), true);
                    if(isContains) {
                        var size = new SuperMap.Size(44, 40),
                        offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                        icon = new SuperMap.Icon(filePath + '/images/marker/marker.png', size, offset),
                        marker = new SuperMap.Marker(new SuperMap.LonLat(o.x, o.y),icon);
                        markersLayer.addMarker(marker);

                        var element = document.createElement('div');
                        element.className = 'safe-gis-place-icon-number';
                        element.innerHTML = o.xm;
                        element.title = o.xm;
                        marker.icon.imageDiv.appendChild(element);
                    }
                });
            };

            $scope.drawRadiusCompleted = function(drawGeometryArgs) {
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
                        var icon = new SuperMap.Icon(filePath + '/images/marker/person.jpg', size, offset);
                        var marker = new SuperMap.Marker(new SuperMap.LonLat(o.x, o.y),icon);
                        markersLayer.addMarker(marker);

                        var element = document.createElement('div');
                        element.className = 'safe-gis-place-icon-number';
                        element.innerHTML = o.name;
                        element.title = o.name;
                        marker.markers[0].icon.imageDiv.appendChild(element);
                    }
                });
            }

            $scope.typeSwitch = function(item) {
                if ($scope.plotTypeItem != item) {
                    $scope.iconList = _.filter($scope.symbolList, {pid: item.id});
                    $scope.plotTypeItem = item;
                }
            };

            $scope.getPlotData = function() {
                return plotting.getSymbolLibManager();
            };

            $scope.hideDetailBox = function(event) {
                if(event && event.target && event.target.className != 'safe-gis-detailTableCell') {
                    return;
                }
                $scope.showDialogDetail = false;
            };

            $scope.startPloting = function(node) {
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
            };

            $scope.police = {
                list: [],
                filter: {
                    text: ''
                },
                pages: {
                    pageNo: 1,
                    pageSize: 10
                },
                getData: function() {
                    iAjax.post('security/information/information.do?action=getpoliceall', {
                        filter: $scope.police.filter.text,
                        params: {
                            pageNo: $scope.police.pages.pageNo,
                            pageSize: $scope.police.pages.pageSize
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.police.list = data.result.rows;
                        }

                        if(data.result && data.result.params) {
                            $scope.police.pages.totalPage = data.result.params.totalPage;
                            $scope.police.pages.totalSize = data.result.params.totalSize;
                        }
                    });
                },
                search: function(event) {
                    if(event && event.keyCode != 13) {
                        return;
                    }
                    $scope.police.pages.pageNo = 1;
                    $scope.police.getData();
                }
            }

            $scope.release = function() {
                iConfirm.show({
                    scope: $scope,
                    title: '任务内容',
                    templateUrl: $.soa.getWebPath('iiw.safe.sjposition') + '/view/dialog.html',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmSuccess'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });
            };

            $scope.select = function(event, item) {
                if(event && event.target && event.target.tagName == 'INPUT') {
                    return
                }
                item.checked = !item.checked;
            };

            $scope.confirmSuccess = function(id) {
                iConfirm.close(id);
                iMessage.show({
                    title: '任务派发',
                    content: '派发成功!',
                    level: 1
                });
            };


            $scope.history = function() {
                infowin.hide();
                infowin.destroy();
                markersLayer.clearMarkers();
                $scope.criminal.list = [
                    $scope.SJGis.dialogInfo,
                    {
                        xm: $scope.SJGis.dialogInfo.xm,
                        zm: $scope.SJGis.dialogInfo.zm,
                        bm: $scope.SJGis.dialogInfo.bm,
                        num: $scope.SJGis.dialogInfo.num,
                        dwsj: $scope.SJGis.dialogInfo.dwsj,
                        jtzz: $scope.SJGis.dialogInfo.jtzz,
                        temp: '5分钟前位置',
                        x: parseFloat($scope.SJGis.dialogInfo.x) + 0.1,
                        y: parseFloat($scope.SJGis.dialogInfo.y) + 0.1
                    },
                    {
                        xm: $scope.SJGis.dialogInfo.xm,
                        zm: $scope.SJGis.dialogInfo.zm,
                        bm: $scope.SJGis.dialogInfo.bm,
                        num: $scope.SJGis.dialogInfo.num,
                        dwsj: $scope.SJGis.dialogInfo.dwsj,
                        jtzz: $scope.SJGis.dialogInfo.jtzz,
                        temp: '10分钟前位置',
                        x: parseFloat($scope.SJGis.dialogInfo.x) + 0.2,
                        y: parseFloat($scope.SJGis.dialogInfo.y) + 0.2
                    },
                    {
                        xm: $scope.SJGis.dialogInfo.xm,
                        zm: $scope.SJGis.dialogInfo.zm,
                        bm: $scope.SJGis.dialogInfo.bm,
                        num: $scope.SJGis.dialogInfo.num,
                        dwsj: $scope.SJGis.dialogInfo.dwsj,
                        jtzz: $scope.SJGis.dialogInfo.jtzz,
                        temp: '15分钟前位置',
                        x: parseFloat($scope.SJGis.dialogInfo.x) + 0.3,
                        y: parseFloat($scope.SJGis.dialogInfo.y) + 0.3
                    },
                    {
                        xm: $scope.SJGis.dialogInfo.xm,
                        zm: $scope.SJGis.dialogInfo.zm,
                        bm: $scope.SJGis.dialogInfo.bm,
                        num: $scope.SJGis.dialogInfo.num,
                        dwsj: $scope.SJGis.dialogInfo.dwsj,
                        jtzz: $scope.SJGis.dialogInfo.jtzz,
                        temp: '20分钟前位置',
                        x: parseFloat($scope.SJGis.dialogInfo.x) + 0.4,
                        y: parseFloat($scope.SJGis.dialogInfo.y) + 0.4
                    }
                ]
                //定位初始位置
                markersLayer = new SuperMap.Layer.Markers("Markers");
                //在地图上创建标点
                $.each($scope.criminal.list, function(i,o) {
                    var point = new SuperMap.Geometry.Point(o.x, o.y),
                        size = new SuperMap.Size(44, 40),
                        offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                        icon = new SuperMap.Icon($.soa.getWebPath('iiw.safe.gis') + "/images/marker/marker.png", size, offset);
                    marker = new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon);
                    marker.tempObj = $scope.criminal.list[i];
                    markersLayer.addMarker(marker);
                    marker.events.on({
                        "click": mouseClickHandler
                    });

                    var element = document.createElement('div');
                    element.className = 'safe-gis-place-icon-number';
                    if(o.temp) {
                        element.innerHTML = o.temp + ': ' + o.xm;
                    } else {
                        element.innerHTML = o.xm;
                    }
                    marker.icon.imageDiv.appendChild(element);
                });
                map.addLayers([markersLayer, plottingLayer]);
            };

            $scope.confirmClose = function(id) {
                iConfirm.close(id);
            };

            $scope.markerDrawCompleted = function(drawGeometryArgs){
                var size = new SuperMap.Size(44, 40);
                var offset = new SuperMap.Pixel(-(size.w/2), -size.h);
                var icon = new SuperMap.Icon(filePath + '/images/marker/marker.png', size, offset);
                var marker = new SuperMap.Marker(new SuperMap.LonLat(drawGeometryArgs.feature.geometry.components[0].x, drawGeometryArgs.feature.geometry.components[0].y),icon);
                markersLayer.addMarker(marker);
                //marker.markers[0].icon.imageDiv.className = 'faa-bounce animated';
                //注册 click 事件,触发 mouseClickHandler()方法
                marker.events.on({'click': function(event) {
                    //初始化popup类
                    //服务加载后，加载一键通指令($scope.yjtpanel提供了一些界面操作的接口)
                    //var $scope = $rootScope.$new(),
                    //    markerTemplate = '<gis-marker-dialog></gis-marker-dialog>';
                    //console.log($scope);
                    //
                    //var popup = new SuperMap.Popup(
                    //    'chicken',
                    //    marker.getLonLat(),
                    //    new SuperMap.Size(400,300),
                    //    markerTemplate[0].outerHTML,
                    //    true,
                    //    null
                    //);
                    ////设置弹窗的边框样式
                    //popup.setBorder("solid 2px #6CA6CD");
                    ////允许弹出内容的最小尺寸
                    //popup.mixSize = 200;
                    //
                    //infowin = popup;
                    ////添加弹窗到map图层
                    //map.addPopup(popup);
                    //
                    //function closeInfoWin(){
                    //    if(infowin){
                    //        try{
                    //            infowin.hide();
                    //            infowin.destroy();
                    //        } catch(e){
                    //            console.log(e);
                    //        }
                    //    }
                    //}
                }});
            };

            $scope.clearElementsPoints = function() {
                pathListIndex = 0;
                routeCompsIndex = 0;
                nodeArray = [];
                bestPathSelect.deactivate();
                if(vector.selectedFeatures.length > 0) {
                    map.removePopup(vector.selectedFeatures[0].popup);
                }
                vector.removeAllFeatures();
                markersLayer.clearMarkers();
            };

            $scope.bestPathSelectPoints = function () {
                bestPathDrawPoint.activate();
            };

            $scope.travelAnalysisSelectPoints = function() {
                $scope.travelAnalysisClearElements();
                travelAnalysisDrawPoint.activate();
            };

            $scope.recentFacilitySelectPoint = function() {
                $scope.recentFacilityClearElements();
                recentFacilityMarkers = new SuperMap.Layer.Markers("Markers");
                var size = new SuperMap.Size(44, 40),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon1 = new SuperMap.Icon(filePath + '/images/marker/marker-gold.png', size, offset),
                    icon2 = new SuperMap.Icon(filePath + '/images/marker/marker-gold.png', size, offset),
                    icon3 = new SuperMap.Icon(filePath + '/images/marker/marker-gold.png', size, offset);
                recentFacilityMarkers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(110.43, 22.84), icon1));
                recentFacilityMarkers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(108.13, 22.84), icon2));
                recentFacilityMarkers.addMarker(new SuperMap.Marker(new SuperMap.LonLat(107.33, 22.84), icon3));
                map.addLayers([recentFacilityMarkers]);
                recentFacilityDrawPoint.activate();
            };

            $scope.selectServiceAreaCenters = function() {
                $scope.serviceAreaClearElements();
                serviceAreaDrawPoint.activate();
            };

            $scope.serviceAreaClearElements =  function() {
                serviceAreaN = 0;
                centersArray = [];
                weightsArray = [];
                markersLayer.clearMarkers();
                vector.removeAllFeatures();
            };

            $scope.travelAnalysisClearElements = function() {
                nodeArray = [];
                travelAnalysisi = 0;
                travelAnalysisj = 0;
                markersLayer.clearMarkers();
                vector.removeAllFeatures();
            };

            $scope.onFeatureSelect = function(feature) {
                if(feature.attributes.description) {
                    popup = new SuperMap.Popup("chicken",
                        feature.geometry.getBounds().getCenterLonLat(),
                        new SuperMap.Size(200,30),
                        "<div style='font-size:.8em; opacity: 0.8'>" + feature.attributes.description + "</div>",
                        null, false);
                    feature.popup = popup;
                    map.addPopup(popup);
                }
                if(feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point"){
                    feature.style = styleGuideLine;
                    vector.redraw();
                }
            };

            $scope.onFeatureUnselect = function(feature) {
                map.removePopup(feature.popup);
                feature.popup.destroy();
                feature.popup = null;
                if(feature.geometry.CLASS_NAME != "SuperMap.Geometry.Point"){
                    feature.style = style;
                }
                vector.redraw();

            };

            $scope.bestpathDrawCompleted =function(drawGeometryArgs) {
                var point = drawGeometryArgs.feature.geometry,
                    size = new SuperMap.Size(44, 33),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon(filePath + '/images/marker/marker.png', size, offset);
                markersLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
                nodeArray.push(point);
            };

            $scope.travelAnalysisDrawCompleted = function(drawGeometryArgs) {
                var point = drawGeometryArgs.feature.geometry,
                    size = new SuperMap.Size(44, 33),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon(filePath + '/images/marker/marker.png', size, offset);
                markersLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
                nodeArray.push(point);
            };

            $scope.recentFacilityDrawCompleted = function(drawGeometryArgs) {
                var point = drawGeometryArgs.feature.geometry,
                    size = new SuperMap.Size(44, 33),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon(filePath + '/images/marker/marker.png', size, offset);
                markersLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
                recentFacilityEventPoint = point;
                recentFacilityn++;
                if (recentFacilityn >= 1) {
                    recentFacilityDrawPoint.deactivate();
                }
            };

            $scope.serviceAreaDrawCompleted = function(drawGeometryArgs) {
                var point = drawGeometryArgs.feature.geometry,
                    size = new SuperMap.Size(44, 33),
                    offset = new SuperMap.Pixel(-(size.w / 2), -size.h),
                    icon = new SuperMap.Icon(filePath + '/images/marker/marker.png', size, offset);
                serviceAreaN = 0;
                markersLayer.addMarker(new SuperMap.Marker(new SuperMap.LonLat(point.x, point.y), icon));
                centersArray.push(point);
                serviceAreaN++;
                weightsArray.push(400 + serviceAreaN * 100);
            };

            $scope.recentFacilityClearElements = function() {
                recentFacilityEventPoint = null;
                recentFacilityn = 0;
                markersLayer.clearMarkers();
                vector.removeAllFeatures();
            };

            $scope.transportationZjlj = function() {
                bestPathDrawPoint.deactivate();
                var findPathService, parameter, analystParameter, resultSetting;
                resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
                    returnEdgeFeatures: true,
                    returnEdgeGeometry: true,
                    returnEdgeIDs: true,
                    returnNodeFeatures: true,
                    returnNodeGeometry: true,
                    returnNodeIDs: true,
                    returnPathGuides: true,
                    returnRoutes: true
                });
                analystParameter = new SuperMap.REST.TransportationAnalystParameter({
                    resultSetting: resultSetting,
                    weightFieldName: "SmLength"
                });
                parameter = new SuperMap.REST.FindPathParameters({
                    isAnalyzeById: false,
                    nodes: nodeArray,
                    hasLeastEdgeCount: false,
                    parameter: analystParameter
                });
                if (nodeArray.length <= 1) {
                    alert("站点数目有误");
                }
                findPathService = new SuperMap.REST.FindPathService(supermapDataUrl, {
                    eventListeners: { "processCompleted": $scope.bestPathProcessCompleted }
                });
                findPathService.processAsync(parameter);
            };

            $scope.findTSPPaths = function() {
                travelAnalysisDrawPoint.deactivate();
                var findTSPPathsService, parameter, analystParameter, resultSetting;
                resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
                    returnEdgeFeatures: true,
                    returnEdgeGeometry: true,
                    returnEdgeIDs: true,
                    returnNodeFeatures: true,
                    returnNodeGeometry: true,
                    returnNodeIDs: true,
                    returnPathGuides: true,
                    returnRoutes: true
                });
                analystParameter = new SuperMap.REST.TransportationAnalystParameter({
                    resultSetting: resultSetting,
                    weightFieldName: "length"
                });
                parameter = new SuperMap.REST.FindTSPPathsParameters({
                    isAnalyzeById: false,
                    nodes: nodeArray,
                    endNodeAssigned: false,
                    parameter: analystParameter
                });
                if (nodeArray.length <= 1) {
                    alert("站点数目有误");
                }
                findTSPPathsService = new SuperMap.REST.FindTSPPathsService(supermapDataUrl, {
                    eventListeners: { "processCompleted": $scope.travelAnalysisProcessCompleted }
                });
                findTSPPathsService.processAsync(parameter);
            };

            $scope.findClosestFacilities = function() {
                recentFacilityDrawPoint.deactivate();
                if (!recentFacilityEventPoint) {
                    alert("请选择事件点！");
                    return;
                }
                var findClosestFacilitiesService, parameter, analystParameter, resultSetting;
                resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
                    returnEdgeFeatures: true,
                    returnEdgeGeometry: true,
                    returnEdgeIDs: true,
                    returnNodeFeatures: true,
                    returnNodeGeometry: true,
                    returnNodeIDs: true,
                    returnPathGuides: true,
                    returnRoutes: true
                });

                analystParameter = new SuperMap.REST.TransportationAnalystParameter({
                    resultSetting: resultSetting,
                    turnWeightField: null,
                    weightFieldName: 'length'
                });
                parameter = new SuperMap.REST.FindClosestFacilitiesParameters({
                    event: recentFacilityEventPoint,
                    expectFacilityCount: 1,
                    isAnalyzeById: false,
                    facilities: facilityPoints,
                    parameter: analystParameter
                });
                findClosestFacilitiesService = new SuperMap.REST.FindClosestFacilitiesService(supermapDataUrl, {
                    eventListeners: { "processCompleted": $scope.recentFacilityProcessCompleted }
                });
                findClosestFacilitiesService.processAsync(parameter);
            };

            $scope.findServiceAreas = function() {
                vector.removeAllFeatures();
                serviceAreaDrawPoint.deactivate();
                var findServiceAreasService, parameter, analystParameter, resultSetting;
                resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
                    returnEdgeFeatures: true,
                    returnEdgeGeometry: true,
                    returnEdgeIDs: true,
                    returnNodeFeatures: true,
                    returnNodeGeometry: true,
                    returnNodeIDs: true,
                    returnPathGuides: true,
                    returnRoutes: true
                });
                analystParameter = new SuperMap.REST.TransportationAnalystParameter({
                    resultSetting: resultSetting,
                    weightFieldName: "length"
                });
                parameter = new SuperMap.REST.FindServiceAreasParameters({
                    centers: centersArray,
                    isAnalyzeById: false,
                    parameter: analystParameter,
                    weights: weightsArray
                });
                findServiceAreasService = new SuperMap.REST.FindServiceAreasService(supermapDataUrl, {
                    eventListeners: { "processCompleted": $scope.processServiceAreaCompleted }
                });
                findServiceAreasService.processAsync(parameter);
            };

            $scope.bestPathProcessCompleted = function(findPathEventArgs) {
                var result = findPathEventArgs.result;
                allScheme(result);
            };

            $scope.travelAnalysisProcessCompleted = function(findTSPPathsEventArgs) {
                travelAnalysisResult = findTSPPathsEventArgs.result;
                travelAnalysisAllScheme(travelAnalysisResult);
            }

            $scope.recentFacilityProcessCompleted = function(findClosestFacilitiesEventArgs) {
                var result = findClosestFacilitiesEventArgs.result,
                    features = [];
                if (result.facilityPathList) {
                    for (var i = 0, facilityPathList = result.facilityPathList, len = facilityPathList.length; i < len; i++) {
                        var feature = new SuperMap.Feature.Vector();
                        feature.geometry = facilityPathList[i].route;
                        feature.style = recentFacilityStyle;
                        features.push(feature);
                    }
                }
                vector.addFeatures(features);
            };

            $scope.processServiceAreaCompleted = function(findServiceAreasEventArgs) {
                vector.removeAllFeatures();
                var result = findServiceAreasEventArgs.result,
                    features = [];
                if (result.serviceAreaList) {
                    for (var i = 0, serviceAreaList = result.serviceAreaList, len = serviceAreaList.length; i < len; i++) {
                        var feature = new SuperMap.Feature.Vector();
                        feature.geometry = serviceAreaList[i].serviceRegion;
                        feature.style = processServiceStyle;
                        features.push(feature);
                    }
                }
                vector.addFeatures(features);
            };

            function getSysettingList() {
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
                            } else if(o.type == 'supergraph_plot') {
                                plotUrl = o.url;
                            } else if(o.type == 'supergraph_data') {
                                dataUrl = o.url;
                            } else if(o.type == 'supergraph_dynaic') {
                                restMapUrl = o.url;
                            } else if(o.type == 'supergraph_analysis') {
                                supermapDataUrl = o.url;
                            }
                        });
                        // init()
                    }
                });
            }

            function init() {
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
                drawLine.events.on({'featureadded': $scope.drawCompleted});


                /********************面矢量图层***********************/
                    //新建面矢量图层
                polygonLayer = new SuperMap.Layer.Vector('polygonLayer');
                //对面图层应用样式style
                polygonLayer.style = style;
                //创建画面控制，图层是polygonLayer
                drawPolygon = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
                drawPolygon.events.on({'featureadded': $scope.areaDrawCompleted});

                drawPolygon1 = new SuperMap.Control.DrawFeature(polygonLayer, SuperMap.Handler.Polygon);
                drawPolygon1.events.on({"featureadded": $scope.drawCompletedMeasuring});
                /********************任务范围矢量图层***********************/
                taskPolygonLayer = new SuperMap.Layer.Vector('taskPolygonLayer');
                //对面图层应用样式style
                taskPolygonLayer.style = style;
                drawTaskPolygon = new SuperMap.Control.DrawFeature(taskPolygonLayer, SuperMap.Handler.Polygon);
                drawTaskPolygon.events.on({'featureadded': $scope.taskDrawCompleted});

                pointLayer = new SuperMap.Layer.Vector('pointLayer');
                drawPoint = new SuperMap.Control.DrawFeature(pointLayer, SuperMap.Handler.Point, {multi: true});
                drawPoint.events.on({'featureadded': $scope.markerDrawCompleted});

                alarmPointLayer = new SuperMap.Layer.Vector('alarmPointLayer');

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
                drawRectangle.events.on({'featureadded': $scope.drawRectangleCompleted});

                drawRadiusPolygon = new SuperMap.Control.DrawFeature(rectangleLayer, SuperMap.Handler.RegularPolygon, {handlerOptions: {sides: 50}});
                drawRadiusPolygon.events.on({'featureadded': $scope.drawRadiusCompleted});

                //新建矢量图层
                vector = new SuperMap.Layer.Vector("vectorLayer");
                //创建捕捉对象，第一个参数指的是需要进行捕捉的要素图层，后面两个参数分别是点要素和线要素的捕捉容限，第四个参数是附加参数
                snapObj = new SuperMap.Snap([vector], 100, 100, {actived: true});
                //矢量要素编辑控件
                modifyFeature = new SuperMap.Control.ModifyFeature(vector);
                modifyFeature.snap = snapObj;

                /**
                 * 最佳路径分析
                 */
                bestPathDrawPoint = new SuperMap.Control.DrawFeature(vector, SuperMap.Handler.Point);
                bestPathSelect = new SuperMap.Control.SelectFeature(vector, {onSelect: $scope.onFeatureSelect, onUnselect: $scope.onFeatureUnselect});
                bestPathDrawPoint.events.on({ "featureadded": $scope.bestpathDrawCompleted });

                /**
                 * 旅行社分析
                 */
                travelAnalysisDrawPoint = new SuperMap.Control.DrawFeature(vector, SuperMap.Handler.Point);
                travelAnalysisDrawPoint.events.on({ "featureadded": $scope.travelAnalysisDrawCompleted });

                /**
                 * 最近设施分析
                 */

                recentFacilityDrawPoint = new SuperMap.Control.DrawFeature(vector, SuperMap.Handler.Point);
                recentFacilityDrawPoint.events.on({ "featureadded": $scope.recentFacilityDrawCompleted });


                /**
                 * 服务区分析
                 */
                serviceAreaDrawPoint = new SuperMap.Control.DrawFeature(vector, SuperMap.Handler.Point);
                serviceAreaDrawPoint.events.on({ "featureadded": $scope.serviceAreaDrawCompleted });


                map = new SuperMap.Map("map", {
                    controls: [
                        new SuperMap.Control.Navigation({
                            dragPanOptions: {
                                enableKinetic: true
                            }
                        }),
                        scaleline,
                        drawLine,
                        drawPolygon,
                        drawPolygon1,
                        drawTaskPolygon,
                        drawPoint,
                        modifyFeature,
                        drawRectangle,
                        drawRadiusPolygon,
                        bestPathDrawPoint,
                        bestPathSelect,
                        serviceAreaDrawPoint,
                        travelAnalysisDrawPoint,
                        recentFacilityDrawPoint
                    ]
                });
                layer = new SuperMap.Layer.TiledDynamicRESTLayer("World", mapUrl, {
                    transparent: true,
                    cacheEnabled: true
                }, {maxResolution: "auto"});
                layer.events.on({"layerInitialized": addLayer});

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


                //多边形
                vector = new SuperMap.Layer.Vector("vector");
                points2= [
                    new SuperMap.Geometry.Point(107.81602,21.65931),
                    new SuperMap.Geometry.Point(107.60549,21.59690),
                    new SuperMap.Geometry.Point(107.54299,21.59392),
                    new SuperMap.Geometry.Point(107.48941,21.60285),
                    new SuperMap.Geometry.Point(107.47972,21.66387),
                    new SuperMap.Geometry.Point(107.38075,21.59318),
                    new SuperMap.Geometry.Point(107.35694,21.60136),
                    new SuperMap.Geometry.Point(107.29891,21.73976),
                    new SuperMap.Geometry.Point(107.24980,21.70479),
                    new SuperMap.Geometry.Point(107.19548,21.71744),
                    new SuperMap.Geometry.Point(107.18633,21.74516),
                    new SuperMap.Geometry.Point(107.15368,21.75660),
                    new SuperMap.Geometry.Point(107.09769,21.79631),
                    new SuperMap.Geometry.Point(107.09452,21.79836),
                    new SuperMap.Geometry.Point(107.08839,21.80589),
                    new SuperMap.Geometry.Point(107.07834,21.80896),
                    new SuperMap.Geometry.Point(107.05637,21.80896),
                    new SuperMap.Geometry.Point(107.03751,21.81231),
                    new SuperMap.Geometry.Point(107.01240,21.82412),
                    new SuperMap.Geometry.Point(107.00635,21.83296),
                    new SuperMap.Geometry.Point(107.02207,21.84933),
                    new SuperMap.Geometry.Point(107.05723,21.89183),
                    new SuperMap.Geometry.Point(107.05667,21.91955),
                    new SuperMap.Geometry.Point(107.01788,21.94494),
                    new SuperMap.Geometry.Point(106.99501,21.94810),
                    new SuperMap.Geometry.Point(106.96674,21.92020),
                    new SuperMap.Geometry.Point(106.93251,21.93583),
                    new SuperMap.Geometry.Point(106.91465,21.97303),
                    new SuperMap.Geometry.Point(106.86071,21.98754),
                    new SuperMap.Geometry.Point(106.81383,21.97638),
                    new SuperMap.Geometry.Point(106.79374,21.98642),
                    new SuperMap.Geometry.Point(106.78295,22.00838),
                    new SuperMap.Geometry.Point(106.73384,22.00949),
                    new SuperMap.Geometry.Point(106.72491,21.98494),
                    new SuperMap.Geometry.Point(106.69329,21.96410),
                    new SuperMap.Geometry.Point(106.67692,21.99163),
                    new SuperMap.Geometry.Point(106.70259,22.02512),
                    new SuperMap.Geometry.Point(106.70296,22.05748),
                    new SuperMap.Geometry.Point(106.70408,22.10213),
                    new SuperMap.Geometry.Point(106.68920,22.14119),
                    new SuperMap.Geometry.Point(106.70445,22.16091),
                    new SuperMap.Geometry.Point(106.68325,22.16575),
                    new SuperMap.Geometry.Point(106.67320,22.17877),
                    new SuperMap.Geometry.Point(106.67543,22.20779),
                    new SuperMap.Geometry.Point(106.69887,22.21002),
                    new SuperMap.Geometry.Point(106.68213,22.28071),
                    new SuperMap.Geometry.Point(106.67208,22.28182),
                    new SuperMap.Geometry.Point(106.65460,22.33875),
                    new SuperMap.Geometry.Point(106.58242,22.33949),
                    new SuperMap.Geometry.Point(106.55787,22.35214),
                    new SuperMap.Geometry.Point(106.56345,22.37074),
                    new SuperMap.Geometry.Point(106.59358,22.38897),
                    new SuperMap.Geometry.Point(106.56419,22.41018),
                    new SuperMap.Geometry.Point(106.55675,22.46338),
                    new SuperMap.Geometry.Point(106.59991,22.59248),
                    new SuperMap.Geometry.Point(106.61107,22.61257),
                    new SuperMap.Geometry.Point(106.63116,22.61033),
                    new SuperMap.Geometry.Point(106.78407,22.77180),
                    new SuperMap.Geometry.Point(106.50388,22.91355),
                    new SuperMap.Geometry.Point(106.33721,22.85402),
                    new SuperMap.Geometry.Point(105.86695,22.93140),
                    new SuperMap.Geometry.Point(105.56635,23.07129),
                    new SuperMap.Geometry.Point(105.52764,23.24243),
                    new SuperMap.Geometry.Point(105.62586,23.40761),
                    new SuperMap.Geometry.Point(105.87141,23.54899),
                    new SuperMap.Geometry.Point(106.04403,23.50137),
                    new SuperMap.Geometry.Point(106.14225,23.73650),
                    new SuperMap.Geometry.Point(105.99468,24.13086),
                    new SuperMap.Geometry.Point(105.87861,24.02371),
                    new SuperMap.Geometry.Point(105.49169,24.01478),
                    new SuperMap.Geometry.Point(105.20894,24.07728),
                    new SuperMap.Geometry.Point(105.18215,24.16360),
                    new SuperMap.Geometry.Point(105.03631,24.43147),
                    new SuperMap.Geometry.Point(104.70296,24.31539),
                    new SuperMap.Geometry.Point(104.44402,24.63088),
                    new SuperMap.Geometry.Point(105.19552,24.99697),
                    new SuperMap.Geometry.Point(105.45743,24.92553),
                    new SuperMap.Geometry.Point(105.93067,24.72612),
                    new SuperMap.Geometry.Point(106.14199,24.97613),
                    new SuperMap.Geometry.Point(106.92178,25.26483),
                    new SuperMap.Geometry.Point(107.06167,25.57437),
                    new SuperMap.Geometry.Point(107.23132,25.16009),
                    new SuperMap.Geometry.Point(107.65991,25.32734),
                    new SuperMap.Geometry.Point(108.00813,25.21126),
                    new SuperMap.Geometry.Point(108.15993,25.44937),
                    new SuperMap.Geometry.Point(108.33851,25.54758),
                    new SuperMap.Geometry.Point(108.58256,25.45234),
                    new SuperMap.Geometry.Point(108.72240,25.64878),
                    new SuperMap.Geometry.Point(109.10634,25.81843),
                    new SuperMap.Geometry.Point(109.49029,26.03272),
                    new SuperMap.Geometry.Point(109.95459,26.21130),
                    new SuperMap.Geometry.Point(110.61533,26.34524),
                    new SuperMap.Geometry.Point(110.96356,26.38988),
                    new SuperMap.Geometry.Point(111.29096,26.27380),
                    new SuperMap.Geometry.Point(111.33858,25.91367),
                    new SuperMap.Geometry.Point(111.50525,25.86903),
                    new SuperMap.Geometry.Point(111.43680,25.76188),
                    new SuperMap.Geometry.Point(111.32965,25.70830),
                    new SuperMap.Geometry.Point(111.32965,25.49401),
                    new SuperMap.Geometry.Point(111.11238,25.21721),
                    new SuperMap.Geometry.Point(110.96059,25.00292),
                    new SuperMap.Geometry.Point(111.27608,25.15769),
                    new SuperMap.Geometry.Point(111.44419,25.11899),
                    new SuperMap.Geometry.Point(111.71206,24.79755),
                    new SuperMap.Geometry.Point(112.03350,24.75291),
                    new SuperMap.Geometry.Point(112.06624,24.36896),
                    new SuperMap.Geometry.Point(111.90849,23.94633),
                    new SuperMap.Geometry.Point(111.81027,23.80942),
                    new SuperMap.Geometry.Point(111.60491,23.63381),
                    new SuperMap.Geometry.Point(111.42931,23.05343),
                    new SuperMap.Geometry.Point(111.21501,22.72606),
                    new SuperMap.Geometry.Point(110.78642,22.28852),
                    new SuperMap.Geometry.Point(110.38164,21.88969),
                    new SuperMap.Geometry.Point(109.96198,21.84207),
                    new SuperMap.Geometry.Point(109.91734,21.64861),
                    new SuperMap.Geometry.Point(109.73427,21.61439),
                    new SuperMap.Geometry.Point(109.54671,21.47450),
                    new SuperMap.Geometry.Point(109.14491,21.40009),
                    new SuperMap.Geometry.Point(109.03181,21.46259),
                    new SuperMap.Geometry.Point(109.17242,21.53700),
                    new SuperMap.Geometry.Point(108.91720,21.61438),
                    new SuperMap.Geometry.Point(108.73768,21.60694),
                    new SuperMap.Geometry.Point(108.47743,21.56081),
                    new SuperMap.Geometry.Point(108.22296,21.50426),
                    new SuperMap.Geometry.Point(108.12080,21.51877),
                    new SuperMap.Geometry.Point(107.9599,21.53821)
                ];
                linearRings = new SuperMap.Geometry.LinearRing(points2);
                region = new SuperMap.Geometry.Polygon([linearRings]);
                polygonVector = new SuperMap.Feature.Vector(region);
                polygonVector.style={
                    fillColor: "rgba(255,114,86,0.3)",
                    strokeColor: "#ff0000"
                };
                vector.addFeatures([polygonVector]);
            }

            function addLayer() {
                map.addLayers([layer, plottingLayer, vector, lineLayer, polygonLayer, rectangleLayer]);
                map.setCenter(new SuperMap.LonLat(108.33, 22.84), 6);
            }

            function mouseClickHandler(data) {
                if(data && data.object.tempObj) {
                    $scope.SJGis.dialogInfo = data.object.tempObj;
                }
                if (infowin) {
                    try {
                        infowin.hide();
                        infowin.destroy();
                    }
                    catch (e) {
                    }
                }
                popup = new SuperMap.Popup.FramedCloud(
                    "chicken",
                    this.lonlat,
                    null,
                    '<div style="width: 440px;color:#000;padding: 15px;opacity: 0.8;">' +
                    '<div style="width: 125px;height: 110px;position: absolute;background-repeat: no-repeat;background-size: cover;background-image: url('+$.soa.getWebPath('iiw.safe') + '/img/null.jpg'+');"></div>'+
                    '<div class="form-group" style="height: 44px;line-height: 44px;padding-left: 165px;">' +
                        '姓名:'+ $scope.SJGis.dialogInfo.xm +' <button class="btn btn-info pull-right" style="margin-right: 20px;margin-left:10px;" onclick="angular.element(this).scope().showYjtServices('+ $scope.SJGis.dialogInfo.bm +')">一键通</button><button class="btn btn-info pull-right" style="margin: 15px 20px 0 10px;" onclick="angular.element(this).scope().history()">历史轨迹</button>' +
                    '</div>' +
                    '<div class="form-group" style="height: 44px;line-height: 44px;padding-left: 165px;">罪名: '+ $scope.SJGis.dialogInfo.zm +'</div>' +
                    '<div class="form-group" style="word-wrap: break-word;height: 44px;line-height: 44px;">报警次数:'+ $scope.SJGis.dialogInfo.num +'</div>' +
                    '<div class="form-group" style="height: 44px;line-height: 44px;">最后一次定位时间: '+ $scope.SJGis.dialogInfo.dwsj +'</div>' +
                    '<div class="form-group" style="height: 44px;line-height: 44px;">家庭住址: '+ $scope.SJGis.dialogInfo.jtzz +'</div>' +
                    '</div>',
                    null,
                    true,
                    null,
                    true
                );
                infowin = popup;
                //添加弹窗到map图层
                map.addPopup(popup);

                //vector.removeAllFeatures();
                //vector.refresh();
                points2 = $scope.criminalRange;
                linearRings = new SuperMap.Geometry.LinearRing(points2);
                region = new SuperMap.Geometry.Polygon([linearRings]);
                polygonVector = new SuperMap.Feature.Vector(region);
                polygonVector.style={
                    fillColor: "rgba(255,114,86,0.3)",
                    strokeColor: "#ff0000"
                };
                vector.addFeatures([polygonVector]);
            }
            function mouseClickAlarmHandler(data) {
                if(data && data.object.tempObj) {
                    $scope.SJGis.dialogInfo = data.object.tempObj;
                }
                if (infowin) {
                    try {
                        infowin.hide();
                        infowin.destroy();
                    }
                    catch (e) {
                    }
                }
                popup = new SuperMap.Popup.FramedCloud(
                    "chicken",
                    this.lonlat,
                    null,
                    '<div style="width: 440px;color:#000;padding: 15px;opacity: 0.8;">' +
                    '<div style="width: 125px;height: 110px;position: absolute;background-repeat: no-repeat;background-size: cover;background-image: url('+$.soa.getWebPath('iiw.safe') + '/img/null.jpg'+');"></div>'+
                    '<div class="form-group" style="height: 44px;line-height: 44px;padding-left: 165px;">姓名: '+ $scope.SJGis.dialogInfo.xm +'<button class="btn btn-info pull-right" style="margin-right: 20px;" onclick="angular.element(this).scope().showYjtServices('+ $scope.SJGis.dialogInfo.bm +')">一键通</button></div>' +
                    '<div class="form-group" style="height: 44px;line-height: 44px;padding-left: 165px;">罪名: '+ $scope.SJGis.dialogInfo.zm +'</div>' +
                    '<div class="form-group" style="word-wrap: break-word;height: 44px;line-height: 44px;">报警次数: 6</div>' +
                    '<div class="form-group" style="height: 44px;line-height: 44px;">最后一次定位时间: '+ $scope.SJGis.dialogInfo.dwsj +'</div>' +
                    '<div class="form-group" style="height: 44px;line-height: 44px;">家庭住址: '+ $scope.SJGis.dialogInfo.jtzz +'</div>' +
                    '<div class="form-group" style="height: 44px;line-height: 44px;">报警原因: '+ $scope.SJGis.dialogInfo.wglx +'</div>' +
                    '</div>',
                    null,
                    true,
                    null,
                    true
                );
                infowin = popup;
                //添加弹窗到map图层
                map.addPopup(popup);
            }

            function initPlotInfo() {
                if($scope.plotType.length > 0) return false;
                var idIndex = addBasicIconNodes();
                var symbolLibManager = $scope.getPlotData();
                for (var i = 0; i < symbolLibManager.libIDs.length; i++) {
                    var symbolLib = symbolLibManager.getSymbolLibByLibId(symbolLibManager.libIDs[i]);
                    var rootSymbolInfo = symbolLib.getRootSymbolInfo();
                    var rootSymbolIconUrl = symbolLib.getRootSymbolIconUrl();
                    if (rootSymbolInfo.symbolNodeType === 'SYMBOL_GROUP') {
                        var rootNode = new Object();
                        rootNode.id = idIndex + 1;
                        rootNode.pId = 0;
                        rootNode.name = rootSymbolInfo.symbolName;
                        rootNode.fullName = rootSymbolInfo.symbolName + '/';
                        var iconNodes = _.filter(rootSymbolInfo.childNodes, {symbolNodeType: 'SYMBOL_NODE'});
                        if (iconNodes.length > 0)$scope.plotType.push(rootNode);
                        innerAnalysisSymbolTree(rootSymbolInfo.childNodes, rootNode, rootSymbolIconUrl);
                    }
                }
                $scope.typeSwitch($scope.plotType[0]);
            }

            function addBasicIconNodes() {
                var basicIconNode = new Object();
                basicIconNode.id = 1;
                basicIconNode.pId = 0;
                basicIconNode.name = '基本图元';
                basicIconNode.fullName = 'BasicCell' + '/';
                $scope.plotType.push(basicIconNode);

                var symbolCode = [24, 28, 29, 31, 34, 410, 32, 590, 360, 390, 400, 350, 26, 370, 380, 44, 48, 320];
                var symbolName = ['折线', '平行四边形', '圆', '椭圆', '注记', '正多边形', '多边形', '贝赛尔曲线', '闭合贝赛尔曲线', '集结地', '大括号', '梯形', '矩形', '弓形', '扇形', '弧线', '平行线', '注记指示框'];
                var cellId = basicIconNode.id + 1;
                for (var i = 0; i < symbolCode.length; i++) {
                    var drawCellNode = {
                        id: cellId++,
                        pid: 1,
                        icon: $.soa.getWebPath('iiw.safe.sjposition') + '/images/plot/' + symbolCode[i] + '.png',
                        symbolCode: symbolCode[i],
                        libID: 0,
                        symbolName: symbolName[i]
                    };
                    $scope.symbolList.push(drawCellNode);
                }

                return cellId;
            }

            function innerAnalysisSymbolTree(childSymbolInfos, parentNode, rootSymbolIconUrl) {
                var treeNodeId = parentNode.id + 1;
                for (var i = 0; i < childSymbolInfos.length; i++) {
                    if (childSymbolInfos[i].symbolNodeType === 'SYMBOL_GROUP') {
                        var treeNode = new Object();
                        treeNode.id = treeNodeId++;
                        treeNode.pid = parentNode.id;
                        treeNode.name = childSymbolInfos[i].symbolName;
                        treeNode.fullName = parentNode.fullName + childSymbolInfos[i].symbolName + '/';
                        var iconNodes = _.filter(childSymbolInfos[i].childNodes, {symbolNodeType: 'SYMBOL_NODE'});
                        if (iconNodes.length > 0)$scope.plotType.push(treeNode);
                        treeNodeId = innerAnalysisSymbolTree(childSymbolInfos[i].childNodes, treeNode, rootSymbolIconUrl);
                    } else if (childSymbolInfos[i].symbolNodeType === 'SYMBOL_NODE') {
                        var drawNode = new Object();
                        drawNode.id = treeNodeId++;
                        drawNode.pid = parentNode.id;
                        drawNode.icon = rootSymbolIconUrl + parentNode.fullName + childSymbolInfos[i].symbolCode + '.png';
                        drawNode.symbolCode = childSymbolInfos[i].symbolCode;
                        drawNode.libID = childSymbolInfos[i].libID;
                        //drawNode.symbolName = childSymbolInfos[i].symbolName + "_" + childSymbolInfos[i].symbolCode;
                        drawNode.symbolName = childSymbolInfos[i].symbolName;
                        $scope.symbolList.push(drawNode);
                    }
                }
                return treeNodeId;
            }

            function clearFeatures(){
                polygonLayer.removeAllFeatures();
            }

            function allScheme(result) {
                if (pathListIndex < result.pathList.length) {
                    addPath(result);
                } else {
                    pathListIndex = 0;
                    //线绘制完成后会绘制关于路径指引点的信息
                    addPathGuideItems(result);
                }
            }

            //以动画效果显示分析结果
            function addPath(result) {
                if (routeCompsIndex < result.pathList[pathListIndex].route.components.length) {
                    var pathFeature = new SuperMap.Feature.Vector();
                    var points = [];
                    for (var k = 0; k < 2; k++) {
                        if (result.pathList[pathListIndex].route.components[routeCompsIndex + k]) {
                            points.push(new SuperMap.Geometry.Point(result.pathList[pathListIndex].route.components[routeCompsIndex + k].x, result.pathList[pathListIndex].route.components[routeCompsIndex + k].y));
                        }
                    }
                    var curLine = new SuperMap.Geometry.LinearRing(points);
                    pathFeature.geometry = curLine;
                    pathFeature.style = style;
                    vector.addFeatures(pathFeature);
                    //每隔0.001毫秒加载一条弧段
                    var pathTime = setTimeout(function () { addPath(result); }, 0.001);
                    routeCompsIndex++;
                } else {
                    clearTimeout(pathTime);
                    routeCompsIndex = 0;
                    pathListIndex++;
                    allScheme(result);
                }
            };

            function addPathGuideItems(result){
                vector.removeAllFeatures();
                //显示每个pathGuideItem和对应的描述信息
                for(var k = 0; k < result.pathList.length; k++){
                    var pathGuideItems = result.pathList[pathListIndex].pathGuideItems, len = pathGuideItems.length;
                    for(var m = 0; m < len; m++){
                        var guideFeature = new SuperMap.Feature.Vector();
                        guideFeature.geometry = pathGuideItems[m].geometry;
                        guideFeature.attributes = {description: pathGuideItems[m].description};
                        if(guideFeature.geometry.CLASS_NAME === "SuperMap.Geometry.Point"){
                            guideFeature.style = styleGuidePoint;
                        }
                        else{
                            guideFeature.style = bestPathStyle;
                        }
                        vector.addFeatures(guideFeature);
                    }
                }
                bestPathSelect.activate();
            };

            function travelAnalysisAllScheme() {
                if (travelAnalysisi < travelAnalysisResult.tspPathList.length) {
                    travelAnalysisAddPath(travelAnalysisResult);
                } else {
                    travelAnalysisi = 0;
                }
            };

            function travelAnalysisAddPath(data) {
                if (travelAnalysisj < data.tspPathList[travelAnalysisi].route.components[0].components.length) {
                    var pathFeature = new SuperMap.Feature.Vector();
                    var points = [];
                    for (var k = 0; k < 2; k++) {
                        if (data.tspPathList[travelAnalysisi].route.components[0].components[travelAnalysisj + k]) {
                            points.push(new SuperMap.Geometry.Point(data.tspPathList[travelAnalysisi].route.components[0].components[travelAnalysisj + k].x, data.tspPathList[travelAnalysisi].route.components[0].components[travelAnalysisj + k].y));
                        }
                    }
                    var curLine = new SuperMap.Geometry.LinearRing(points);
                    pathFeature.geometry = curLine;
                    pathFeature.style = travelAnalysisStyle;
                    vector.addFeatures(pathFeature);

                    //每隔0.01毫秒加载一条弧段
                    travelAnalysisPathTime = setTimeout(function () { travelAnalysisAddPath(data); }, 0.01);
                    travelAnalysisj++;
                } else {
                    clearTimeout(travelAnalysisPathTime);
                    travelAnalysisj = 0;
                    travelAnalysisi++;
                    travelAnalysisAllScheme(data);
                }
            }

            $scope.$on('sjPositionControllerOnEvent', function() {
                getSysettingList();
                $scope.criminal.search();
                $scope.alarm.getData();
            });

            $scope.$on('sjPositionControllerExitEvent', function() {
                // $interval.cancel(intervalMarker);
            });
        }
    ]);
});