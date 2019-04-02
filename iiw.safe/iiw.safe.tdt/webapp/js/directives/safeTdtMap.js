/**
 * Created by chq on 2019/10/10.
 */
define(['app',
        'cssloader!safe/tdt/css/index.css',
        'safe/tdt/js/services/safeTdtMap'
    ],
    function (app) {
    app.directive('safeTdtMap', ['safeTdtMapService', '$interval', function(safeTdtMapService, $interval) {
        var packageName = 'iiw.safe.tdt';

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
            restrict: 'AE',
            scope: {
                toggle: '=toggle',
                callbackMap: '=getMap'
            },
            replace: true,
            template: getTemplate($.soa.getWebPath('iiw.safe.tdt') + '/view/map.html'),
            compile: function() {
                return {
                    post: function($scope, $element) {
                        $scope.filePath = $.soa.getWebPath(packageName) + '/';
                        $scope.symbolList = [];
                        $scope.plotType = [];
                        $scope.iconList = [];
                        $scope.showPlotPanel = false;
                        $scope.showSearchPanel = false;
                        $scope.search = {name: ''};
                        $scope.mapMenu = [
                            {name: '布控点设置', type: 'dtbz', icon: '/image/menu/m01.jpg'},
                            {name: '框选', type: 'kx', icon: '/image/menu/m06.png'},
                            {name: '态势标绘', type: 'tsbh', icon: '/image/menu/m02.jpg'},
                            {name: '缓冲区分析', type: 'hcqfx', icon: '/image/menu/m05.png'},
                            {name: '地点查询', type: 'ddcx', icon: '/image/menu/m04.jpg'},
                            {name: '清除', type: 'qc', icon: '/image/menu/m03.jpg'}
                        ];

                        $scope.toolList = [
                            {title: '放大', icon: '/image/toolbar/zoom_in.png', type: 'zoomin'},
                            {title: '缩小', icon: '/image/toolbar/zoom_out.png', type: 'zoomout'},
                            {title: '鹰眼', icon: '/image/toolbar/eagle_eye.png', type: 'eagle'},
                            {title: '测距', icon: '/image/toolbar/distance.png', type: 'distance'},
                            {title: '面积量算', icon: '/image/toolbar/measure.png', type: 'measure'}
                        ];
                        //缓冲区分析
                        $scope.showBuffer = false;
                        $scope.alarmPointData = null;
                        $scope.mapLoaded = false;
                        $scope.intervalFlag = null;



                        //存放显示对象
                        if($scope.toggle) {
                            if(!$scope.toggle.isMapMenu && $scope.toggle.isMapMenu !== false) {
                                $scope.toggle.isMapMenu = true;
                            }
                            if(!$scope.toggle.isToolbar && $scope.toggle.isToolbar !== false) {
                                $scope.toggle.isToolbar = true;
                            }
                            if(!$scope.toggle.isOverviewMap && $scope.toggle.isOverviewMap !== false) {
                                $scope.toggle.isOverviewMap = true;
                            }
                        } else {
                            $scope.toggle = {
                                isMapMenu: true,
                                isToolbar: true,
                                isOverviewMap: true
                            }
                        }


                        //加载地图类库
                        // initMap();

                        //初始化地图
                        function initMap() {
                            window.setTimeout(function() {
                                // safeTdtMapService.init(mapLoadComplete, $scope.toggle.isOverviewMap);
                                safeTdtMapService.init();
                            }, 1000);
                        }

                        //地图加载完成回调函数
                        function mapLoadComplete(map) {

                            if($scope.callbackMap) {
                                $scope.callbackMap(map);
                            }

                            $scope.mapLoaded = true;
                            console.log("mapLoaded");
                        }

                        $scope.menuClick = function(row) {
                            switch(row.type) {
                                case 'dtbz':
                                    safeTdtMapService.drawPoint();
                                    break;
                                case 'kx':
                                    safeTdtMapService.drawRectangle();
                                    break;
                                case 'tsbh':
                                    $scope.showPlotInfo();
                                    break;
                                case 'ddcx':
                                    $scope.showSearchInfo();
                                    break;
                                case 'hcqfx':
                                    safeTdtMapService.distanceMeasure(true);
                                    break;
                                case 'qc':
                                    $scope.clearMap();
                                    break;
                                case '':
                                    break;
                                default :
                                    break;
                            }
                        };

                        $scope.barClick = function(bar) {
                            switch(bar.type) {
                                case 'zoomin':
                                    safeTdtMapService.zoomIn();
                                    break;
                                case 'zoomout':
                                    safeTdtMapService.zoomOut();
                                    break;
                                case 'eagle':
                                    safeTdtMapService.showEagle();
                                    break;
                                case 'distance':
                                    safeTdtMapService.distanceMeasure(false);
                                    break;
                                case 'measure':
                                    safeTdtMapService.areaMeasure();
                                    break;
                                default:
                                    break;
                            }
                        };

                        //清除
                        $scope.clearFeatures = function() {
                            safeTdtMapService.clearFeatures();
                        };

                        //编辑要素
                        $scope.editFeatures = function() {
                            safeTdtMapService.addData();
                        };

                        //矩形框选
                        $scope.drawRectangle = function() {
                            safeTdtMapService.drawRectangle();
                        };

                        //圆框选
                        $scope.drawRadius = function() {
                            safeTdtMapService.drawRadius();
                        };

                        $scope.showPlotInfo = function() {
                            initPlotInfo();
                            $scope.showPlotPanel = true;
                            $scope.showSearchPanel = false;
                        };

                        function initPlotInfo() {
                            if($scope.plotType.length > 0) return false;
                            var idIndex = addBasicIconNodes();
                            var symbolLibManager = safeTdtMapService.getPlotData();
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
                                    icon: $scope.filePath + '/image/plot/' + symbolCode[i] + '.png',
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

                        $scope.startPloting = function(item) {
                            safeTdtMapService.startPloting(item);
                        };

                        $scope.typeSwitch = function(item) {
                            if ($scope.plotTypeItem != item) {
                                $scope.iconList = _.filter($scope.symbolList, {pid: item.id});
                                $scope.plotTypeItem = item;
                            }
                        };

                        $scope.clearMap = function() {
                            safeTdtMapService.clearFeatures();
                        };

                        $scope.hidePlotPanel = function() {
                            $scope.showPlotPanel = false;
                        };

                        $scope.showSearchInfo = function () {
                            $scope.showPlotPanel = false;
                            $scope.showSearchPanel = true;
                        };

                        $scope.hideSearchPanel = function() {
                            $scope.showSearchPanel = false;
                        };

                        $scope.saveMarker = function() {
                            alert("save marker");
                        };

                        $scope.drawTaskArea = function() {
                            safeTdtMapService.drawTaskArea();
                            //safeTdtMapService.showTaskArea();
                        };

                        $scope.showLocation = function() {
                            safeTdtMapService.realTimeTrajectory();
                        };

                        $scope.start = function() {
                            safeTdtMapService.startPlay();
                        };

                        $scope.keyPressEvent = function(evt) {
                            if(evt.keyCode == 13) {
                                $scope.mapSearch();
                            }
                        };

                        $scope.mapSearch = function() {
                            $scope.placeList = [];
                            safeTdtMapService.getFeaturesBySQL($scope.search.name, showPlaceList);
                        };

                        function showPlaceList(data) {
                            $scope.placeList = data;
                        }

                        $scope.moveToThisPlace = function(row) {
                            $(".faa-bounce").each(function(i, o){
                                $(o).removeClass("faa-bounce animated");
                            });
                            //row.markerObj.className = 'faa-bounce animated';
                            safeTdtMapService.setMapCenter(row.data.SMX, row.data.SMY);
                        };

                        $scope.$on("showAlarmPoint", function(e, data) {
                            if($scope.alarmPointData && $scope.alarmPointData.id == data.id) {
                                return;
                            } else {
                                $scope.alarmPointData = data;
                                $scope.intervalFlag = $interval(function() {
                                    if($scope.mapLoaded) {
                                        $interval.cancel($scope.intervalFlag);
                                        $scope.intervalFlag = null;
                                        if(data.longitude && data.latitude) {
                                            safeTdtMapService.showAlarmPoint(data);
                                        } else {
                                            var params = {
                                                longitude: 0,
                                                latitude: 0
                                            };
                                            safeTdtMapService.showAlarmPoint(params);
                                        }
                                    }
                                }, 1000);
                            }
                        });

                        $scope.$on('destoryMap', function() {
                            safeTdtMapService.removeMap();
                        });
                    }
                };
            }
        }
    }]);
});
