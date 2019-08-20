/**
 * 配置地图指令
 *
 * @author - dwt
 * @date - 2016-01-28
 * @version - 0.1
 */
define([
    'app',
    'safe/map/js/services/iZmap',
    'system/insidemapsetting/js/directive/insidemapsettingtag'
], function(app) {
    app.directive('insidemapSettingMap', [
        '$compile',
        '$timeout',
        '$filter',
        'iZmap',
        'mapSettingData',

        function($compile, $timeout, $filter, iZmap, mapSettingData) {
            return {
                restrict: 'A',
                scope: {
                    data: '=data',
                    layer: '=layer',
                    shape: '=shape',
                    runningShape: '=runningShape'
                },
                compile: function() {
                    return {
                        post: function($scope, element) {

                            $scope.oTypeTag = {
                                'monitor': [],
                                'device': [],
                                'coordinate': []
                            };

                            var eMap = $compile('<div class="layout-full insidemapsetting-mapbox-map-box"></div>')($scope),
                                eTagBox = $compile('<div class="insidemapsetting-mapbox-tag-box"></div>')($scope),
                                oTypeTagBox = {
                                    'monitor': $compile('<div class="insidemapsetting-mapbox-tag insidemapsetting-mapbox-monitor-box"><div insidemapsetting-tag ng-repeat="item in oTypeTag.monitor"></div></div>')($scope),
                                    'device': $compile('<div class="insidemapsetting-mapbox-tag insidemapsetting-mapbox-device-box"><div insidemapsetting-tag ng-repeat="item in oTypeTag.device"></div></div>')($scope),
                                    'coordinate': $compile('<div class="insidemapsetting-mapbox-tag insidemapsetting-mapbox-coordinate-box"><div insidemapsetting-tag ng-repeat="item in oTypeTag.coordinate"></div></div>')($scope)
                                };

                            element.append(eMap);
                            element.append(eTagBox);
                            eTagBox.append(oTypeTagBox['monitor']);
                            eTagBox.append(oTypeTagBox['device']);
                            eTagBox.append(oTypeTagBox['coordinate']);

                            var zMap = null,
                                oMap = null,
                                config = require('zrender/config'),
                                redraw = false,
                                mode = '',
                                mouseDown = {x: -1, y: -1};

                            /**
                             * 隐藏地图图形组
                             * @param id
                             */
                            function hideMapGroup(id) {
                                if(zMap && zMap.getZrender()) {
                                    zMap.hideGroup(id);
                                }
                            }

                            /**
                             * 显示地图图形组
                             * @param id
                             * @param showText 是否显示图形上的文字
                             */
                            function showMapGroup(id, showText) {
                                if(zMap && zMap.getZrender()) {
                                    var group = zMap.getGroup(id);
                                    if(group) {
                                        if(showText) {
                                            group.eachChild(function(shape) {
                                                if(shape.style.name) {
                                                    shape.style.text = shape.style.name;
                                                }
                                            });
                                        } else {
                                            group.eachChild(function(shape) {
                                                if(!shape.style.name) {
                                                    shape.style.name = shape.style.text;
                                                }
                                                shape.style.text = '';
                                            });
                                        }
                                        zMap.showGroup(id);
                                    }
                                }
                            }

                            /**
                             * 加载地图
                             * @param mapImg
                             * @param mapDtl
                             * @param callback
                             */
                            function loadZMap(mapImg, mapDtl, callback) {
                                destroyMap();

                                zMap = iZmap.getInstance(eMap.get(0));
                                eMap.find('div').eq(0).css('cursor', 'default');

                                var oShapes = {
                                    area: [],
                                    room: [],
                                    aisle: [],
                                    inclosure: [],
                                    lift: [],
                                    initarea: [],
                                    dutypolice: [],
                                    tag: [],
                                    guides: []
                                };
                                zMap.addGroup('area');
                                zMap.addGroup('room');
                                zMap.addGroup('aisle');
                                zMap.addGroup('inclosure');
                                zMap.addGroup('lift');
                                zMap.addGroup('initarea');
                                zMap.addGroup('dutypolice');
                                zMap.addGroup('tag');

                                // 轨迹辅助线
                                zMap.addGroup('guides');

                                zMap.showGroup('lift');
                                zMap.showGroup('area');

                                //用于区域编辑
                                zMap.addGroup('coordinate');

                                zMap.loadMapImg(mapImg, function() {

                                    angular.forEach(mapDtl, function(v) {
                                        var temp = iZmap.formatShapeObject(v.params, v.id);
                                        temp.originParams = JSON.parse(v.params);
                                        temp.devices = v.devices;
                                        temp.criminalNum = v.criminalNum;
                                        temp.highlightStyle = {opacity: 0};
                                        temp.idx = v['idx'];

                                        //将图形分配到不同的图层里面
                                        temp.style['name'] = temp.style['text'];
                                        if(temp.type) {
                                            oShapes[temp.type].push(temp);
                                        }

                                    });

                                    angular.forEach(oShapes, function(o, t) {
                                        zMap.addShapes(o, t);
                                    });

                                    var tags = zMap.getRunningShapes(null, 'tag');
                                    angular.forEach(tags, function(tag) {
                                        tag.reLocateNum = 0;
                                        if(tag['tagtype'] == 'monitor') {
                                            $scope.oTypeTag['monitor'].push(tag);
                                        } else if(tag['tagtype'] == 'device') {
                                            $scope.oTypeTag['device'].push(tag);
                                        }
                                    });

                                    zMap.listenOn('zMap.mousewheelstart', _hideAllTags);
                                    zMap.listenOn('zMap.mousewheelend', _showAllTags);
                                    zMap.listenOn('zMap.panstart', _hideAllTags);
                                    zMap.listenOn('zMap.panend', _showAllTags);
                                    zMap.listenOn('zMap.pinchstart', _hideAllTags);
                                    zMap.listenOn('zMap.pinchend', _showAllTags);
                                    zMap.listenOn('zMap.blowupstart', _hideAllTags);
                                    zMap.listenOn('zMap.resizestart', _hideAllTags);
                                    zMap.listenOn('zMap.resizeend', _showAllTags);
                                    zMap.listenOn('zMap.resetMapSizestart', _hideAllTags);

                                    if(callback) {
                                        callback();
                                    }

                                }, 1);
                            }

                            /**
                             * 显示所有标签
                             * @private
                             */
                            function _showAllTags() {
                                _reLocaleAllTags();
                                $timeout(function() {
                                    eTagBox.finish().animate({
                                        opacity: 1
                                    });
                                });
                            }

                            /**
                             * 隐藏所有标签
                             * @private
                             */
                            function _hideAllTags() {
                                eTagBox.finish().animate({
                                    opacity: 0
                                });
                            }

                            /**
                             * 重新计算所有标签位置
                             * @private
                             */
                            function _reLocaleAllTags() {
                                angular.forEach($scope.oTypeTag, function(typeTag) {
                                    angular.forEach(typeTag, function(tag) {
                                        tag.reLocateNum++;
                                    });
                                });
                            }

                            var mousedown = false;
                            var dragtarget = null;
                            var dragedit = false;

                            /**
                             * 绑定画板事件
                             */
                            function bindZmapEvent() {
                                zMap.getZrender().on(
                                    config.EVENT.MOUSEUP,
                                    function(mouseEvent) {
                                        // 松开鼠标后的操作
                                        if(mousedown) {
                                            mousedown = false;

                                            if(mode == 'selectShape') {
                                                // 当前模式为，选择所属区域（视频标签）
                                                if(mouseEvent.target) {
                                                    $scope.$parent.map.formData.belongArea.selectDone(mouseEvent.target.id);
                                                }
                                            } else {
                                                if(dragtarget && dragedit) {
                                                    // 若当前已选中图形，并且图形被拖动，则保存最新的图形坐标
                                                    var p = dragtarget.position;
                                                    var temp = [];
                                                    angular.forEach(dragtarget.style.pointList, function(point) {
                                                        temp.push(zMap.getCalculateCoordinate(point[0] + p[0], point[1] + p[1]));
                                                    });
                                                    dragedit = false;
                                                    dragtarget = null;
                                                    zMap.setFrameEvent(false);
                                                    drawEditShape(temp);
                                                } else {
                                                    if(redraw) {
                                                        // 当前模式为新增的时候，往当前图形添加坐标点
                                                        var x = parseFloat(mouseEvent.event.offsetX).toFixed(2);
                                                        var y = parseFloat(mouseEvent.event.offsetY).toFixed(2);
                                                        var point = zMap.getCalculateCoordinate(x, y);

                                                        if(!$scope.runningShape['tagtype']) {
                                                            $scope.runningShape.style.pointList.push(point);
                                                            drawEditShape($scope.runningShape.style.pointList);
                                                        } else {
                                                            $scope.runningShape.originParams.style.x = parseFloat(point[0]).toFixed(2);
                                                            $scope.runningShape.originParams.style.y = parseFloat(point[1]).toFixed(2);
                                                            drawEditTagShape(point);
                                                            $scope.$parent.map.formData.coordinate.doclick();
                                                        }
                                                    } else {
                                                        // 在地图上点击一个目标图形时
                                                        if(mouseEvent.target) {
                                                            var originShape = zMap.getShapes([mouseEvent.target.originID || mouseEvent.target.id]);
                                                            $scope.$parent.map.selectItem(originShape[0]);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if(redraw) {
                                            eMap.find('div').eq(0).css('cursor', 'crosshair');
                                        } else {
                                            eMap.find('div').eq(0).css('cursor', 'default');
                                        }
                                    }
                                );
                                zMap.getZrender().on(
                                    config.EVENT.MOUSEMOVE,
                                    function(mouseEvent) {
                                        var x = mouseEvent.event.offsetX;
                                        var y = mouseEvent.event.offsetY;
                                        $('.insidemapsetting-mapbox-location').html('x:' + x + ',y:' + y);

                                        if(mousedown && (mouseEvent.event.buttons == 1 || mouseEvent.event['which'] == 1) && !(mouseDown.x == x && mouseDown.y == y)) {
                                            eMap.find('div').eq(0).css('cursor', 'move');

                                            // 当拖动地图时，没有选中图形的时候，将mousedown标记为false
                                            if(!dragtarget) {
                                                mousedown = false;
                                            }

                                            // 当拖动地图时，选中图形的时候，将dragedit标记为true（这样拖动图形后才能进行保存最新的坐标）
                                            if(dragtarget) {
                                                dragedit = true;
                                            }
                                        }
                                    }
                                );
                                zMap.getZrender().on(
                                    config.EVENT.MOUSEDOWN,
                                    function(mouseEvent) {
                                        mouseDown.x = mouseEvent.event.offsetX;
                                        mouseDown.y = mouseEvent.event.offsetY;

                                        // 记录鼠标点击
                                        mousedown = true;

                                        if(mouseEvent.target && $scope.runningShape && mouseEvent.target.id == $scope.runningShape.id) {
                                            // 若鼠标上有目标，则屏蔽地图的所有拖拉等事件，记录并高亮当前选择的图形
                                            zMap.setFrameEvent(true);
                                            dragtarget = mouseEvent.target;
                                            dragedit = false;
                                            mouseEvent.target.draggable = true;
                                            mouseEvent.target.hoverable = false;
                                            mouseEvent.target.highlightStyle = {
                                                opacity: 1,
                                                strokeColor: 'red',
                                                lineWidth: 1
                                            };
                                        }else {
                                            // 若鼠标上没有目标，则恢复地图的所有拖拉等事件，并将dragtarget清除
                                            dragtarget = null;
                                            zMap.setFrameEvent(false);
                                        }
                                    }
                                );
                            }

                            /**
                             * 根据坐标点，重新绘制标签
                             * @param point
                             */
                            function drawEditTagShape(point) {
                                if(point && $scope.runningShape) {
                                    zMap.delShapes(null, 'coordinate');
                                    $scope.oTypeTag['coordinate'] = [];

                                    $scope.runningShape.style.x = point[0];
                                    $scope.runningShape.style.y = point[1];
                                    $scope.runningShape.reLocateNum = 0;

                                    zMap.addShapes([angular.copy($scope.runningShape)], 'coordinate');
                                    $scope.runningShape = zMap.getRunningShapes([$scope.runningShape.id])[0];
                                    $scope.oTypeTag['coordinate'].push($scope.runningShape);
                                }
                            }

                            /**
                             * 根据坐标数组，重新绘制图形，并修改原始图形属性
                             * @param pointList
                             */
                            function drawEditShape(pointList) {
                                if(pointList && $scope.runningShape) {
                                    zMap.delShapes(null, 'coordinate');
                                    $scope.runningShape.style.pointList = angular.copy(pointList);
                                    $scope.runningShape.originParams.style.pointList = angular.copy(pointList);
                                    zMap.addShapes([angular.copy($scope.runningShape)], 'coordinate');
                                }
                            }

                            function destroyMap() {
                                if(zMap) {
                                    $scope.oTypeTag['monitor'] = [];
                                    $scope.oTypeTag['device'] = [];
                                    $scope.oTypeTag['coordinate'] = [];

                                    zMap.dispose();
                                    zMap = null;
                                }
                            }

                            /**
                             * 在地图上选择标签时
                             * @param shape
                             */
                            $scope.selectTag = function(shape) {
                                if(!$scope.runningShape || $scope.runningShape.id != shape.id) {
                                    var originShape = zMap.getShapes([shape.id]);
                                    $scope.$parent.map.selectItem(originShape[0]);
                                }
                            };

                            $scope.$on('$destroy', function() {
                                destroyMap();
                            });

                            /**
                             * 还原图形的颜色
                             */
                            $scope.$on('removeUniqueColor', function() {
                                if(zMap && zMap.getZrender()) {
                                    var shapes = zMap.getShapes([$scope.runningShape.id]);
                                    if(shapes.length > 0) {
                                        shapes[0].style.color = 'rgba(0,0,0,0.3)';
                                        zMap.changeColor(shapes[0].id, 'rgba(0,0,0,0.3)');
                                    }
                                    if($scope.runningShape.originParams) {
                                        $scope.runningShape.originParams.style.color = 'rgba(0,0,0,0.3)';
                                        delete $scope.runningShape.originParams.style.uniqueColor;
                                    }
                                }
                            });

                            /**
                             * 改变图形颜色，改变后，图形的安全颜色（绿色）将被替代
                             */
                            $scope.$on('changeShapeColor', function(e, color) {
                                if(zMap && zMap.getZrender() && color) {
                                    var shapes = zMap.getShapes([$scope.runningShape.id]);
                                    if(shapes.length > 0) {
                                        shapes[0].style.color = color;
                                        zMap.changeColor(shapes[0].id, color);
                                    }
                                    if($scope.runningShape.originParams) {
                                        $scope.runningShape.originParams.style.color = color;
                                        $scope.runningShape.originParams.style.uniqueColor = color;
                                    }
                                }
                            });

                            /**
                             * 计算图形文字大小并渲染
                             */
                            $scope.$on('calculateShapeTextSize', function(e, textSize) {
                                if(zMap && zMap.getZrender() && textSize) {
                                    var shapes = zMap.getShapes([$scope.runningShape.id]);
                                    if(shapes.length > 0) {
                                        shapes[0].style.textSize = textSize;
                                        zMap.calculate(shapes[0]);
                                    }
                                }
                            });

                            /**
                             * 根据图形的放大倍数，显示图形放大缩小效果
                             */
                            $scope.$on('blowUpShape', function(e, blowScale) {
                                if(zMap && zMap.getZrender() && blowScale) {
                                    var shapes = zMap.getRunningShapes([$scope.runningShape.id]);
                                    if(shapes.length > 0) {
                                        zMap.hideShapes();
                                        zMap.blowUp(shapes[0], 1000, blowScale, function() {
                                            _showAllTags();
                                            zMap.showShapes();
                                            zMap.hideShapes([shapes[0].originID || shapes[0].id]);
                                            zMap.unlock();
                                        });
                                    }
                                }
                            });

                            /**
                             * 根据图形的宽高，将图形填满整个画板
                             */
                            $scope.$on('blowUpShapeItSelf', function() {
                                if(zMap && zMap.getZrender()) {
                                    var shapes = zMap.getRunningShapes([$scope.runningShape.id]);
                                    if(shapes.length > 0) {
                                        zMap.hideShapes();
                                        zMap.blowUpByShape(shapes[0], 1000, function() {
                                            _showAllTags();
                                            zMap.showShapes();
                                            zMap.hideShapes([shapes[0].originID || shapes[0].id]);
                                            zMap.unlock();
                                        });
                                    }
                                }
                            });

                            $scope.$watch('data', function(data) {
                                if(data && data != oMap) {
                                    oMap = data;

                                    $timeout(function() {
                                        loadZMap(data.savepath, data.mapDtl, function() {
                                            bindZmapEvent();
                                        });
                                    });
                                }
                            });

                            /**
                             * 复制图形的坐标点
                             */
                            $scope.$on('copyShape', function() {
                                var pointList = [],
                                    coordinateShape = zMap.getGroup('coordinate').childAt(0);
                                angular.forEach(coordinateShape.style.pointList, function(point) {
                                    pointList.push(zMap.getCalculateCoordinate(point[0], point[1]));
                                });
                                $scope.$parent.map.formData.coordinate.copyPointList = pointList;
                                mapSettingData.saveCopyPointList(pointList);
                            });

                            /**
                             * 黏贴图形坐标点
                             */
                            $scope.$on('parseShape', function(e, data) {
                                drawEditShape(data.pointList || []);
                            });

                            /**
                             * 重新绘制图形
                             */
                            $scope.$on('reDrawShape', function(e, data) {
                                eMap.find('div').eq(0).css('cursor', 'crosshair');
                                redraw = true;

                                if(!$scope.runningShape['tagtype']) {
                                    drawEditShape(data.pointList || []);
                                } else {
                                    $scope.oTypeTag['coordinate'] = [];
                                }
                            });

                            /**
                             * 结束绘制图形
                             */
                            $scope.$on('reDrawShapeDone', function() {
                                eMap.find('div').eq(0).css('cursor', 'default');
                                redraw = false;
                            });

                            /**
                             * 新增图形或标签
                             */
                            $scope.$on('addMapDtl', function(e, data) {
                                if(data.oParams && zMap.getZrender()) {
                                    var shape = iZmap.formatShapeObject(data.oParams, data.id);

                                    zMap.delShapes([data.id], data.oParams.type);

                                    shape.idx = data.idx;
                                    shape.devices = data.shapeDevices;
                                    shape.originParams = angular.copy(data.oParams);
                                    if(shape['tagtype']) {
                                        shape.reLocateNum = 0;
                                    }
                                    shape.highlightStyle = {opacity: 0};
                                    zMap.addShapes([angular.copy(shape)], shape.type);
                                    shape = zMap.getRunningShapes([shape.id])[0];

                                    if(shape['tagtype']) {
                                        var aFind = $filter('filter')($scope.oTypeTag[shape['tagtype']], {id: shape.id});
                                        if(aFind.length == 1) {
                                            oTypeTagBox['coordinate'].hide();
                                            var index = $scope.oTypeTag[shape['tagtype']].indexOf(aFind[0]);
                                            if(index > -1) {
                                                $scope.oTypeTag[shape['tagtype']].splice(index, 1, shape);
                                            }
                                        } else {
                                            $scope.oTypeTag[shape['tagtype']].push(shape);
                                        }
                                    }
                                }
                            });

                            /**
                             * 从地图删除图形
                             */
                            $scope.$on('delMapDtl', function(e, obj) {
                                if(obj && zMap.getZrender()) {
                                    zMap.delShapes([obj.id], obj.type);

                                    if(obj['tagtype']) {
                                        var aFind = $filter('filter')($scope.oTypeTag[obj['tagtype']], {id: obj.id});
                                        if(aFind.length == 1) {
                                            var index = $scope.oTypeTag[obj['tagtype']].indexOf(aFind[0]);
                                            if(index > -1) {
                                                $scope.oTypeTag[obj['tagtype']].splice(index, 1);
                                            }
                                        }
                                    }
                                }
                            });

                            /**
                             * 还原修改图形
                             */
                            $scope.$on('resetEditShape', function(e, list) {
                                drawEditShape(list);
                            });

                            /**
                             * 改变标签点的监控设备图形类别
                             */
                            $scope.$on('changeMonitorType', function(e, type) {
                                if($scope.oTypeTag['coordinate'].length) {
                                    $scope.oTypeTag['coordinate'][0]['monitortype'] = type;
                                }
                            });

                            /**
                             * 改变标签方向
                             */
                            $scope.$on('changeTagdir', function(e, dir) {
                                $scope.runningShape.originParams['tagdir'] = dir;
                                $scope.runningShape['tagdir'] = dir;
                                //$scope.runningShape.reLocateNum++;
                            });

                            /**
                             * 修改设备点的已选设备
                             */
                            $scope.$on('changeDevice', function(e, device) {
                                if($scope.oTypeTag['coordinate'].length) {
                                    $scope.oTypeTag['coordinate'][0]['devicename'] = device.name;
                                    $scope.oTypeTag['coordinate'][0]['devicefk'] = device.id;
                                    $scope.oTypeTag['coordinate'][0]['devicetype'] = device.type;
                                }
                            });

                            /**
                             * 视频标签，选择所属区域后
                             */
                            $scope.$on('selectShapeDone', function() {
                                mode = '';
                                if(zMap && zMap.getZrender()) {
                                    showMapGroup('area', true);
                                    showMapGroup('lift', true);
                                    showMapGroup('coordinate', true);
                                    oTypeTagBox['coordinate'].show();
                                }
                            });

                            /**
                             * 视频标签，选择所属区域时
                             */
                            $scope.$on('selectShape', function() {
                                mode = 'selectShape';
                                if(zMap && zMap.getZrender()) {
                                    hideMapGroup('area');
                                    hideMapGroup('lift');
                                    hideMapGroup('coordinate');
                                    oTypeTagBox['coordinate'].hide();
                                }
                            });

                            //新增或修改图形都会被监视，并在coordinate层生成一个独立的编辑图形
                            $scope.$watch('shape', function(data, oldData) {
                                var aFind;

                                if(data) {

                                    // 处理之前已选中的图形
                                    if(oldData) {
                                        zMap.showShapes([oldData.originID || oldData.id]);
                                        if(oldData.type == 'tag') {
                                            if(oldData.originID || oldData.id) {
                                                //显示原来隐藏了的被修改的标签
                                                aFind = $filter('filter')($scope.oTypeTag[oldData.tagtype], {id: oldData.originID || oldData.id});
                                                if(aFind.length == 1) {
                                                    aFind[0].bHide = false;
                                                }
                                            }
                                            hideMapGroup('coordinate');
                                            oTypeTagBox['coordinate'].hide();
                                            $scope.oTypeTag['coordinate'] = [];
                                        }
                                    }

                                    redraw = false;
                                    // 更换runningShape
                                    $scope.runningShape = angular.copy($scope.shape);
                                    if(!$scope.runningShape.originParams) {
                                        $scope.runningShape.originParams = angular.copy($scope.runningShape);
                                    }
                                    $scope.runningShape.originID = $scope.runningShape.id;
                                    $scope.runningShape.id = $scope.runningShape.id + '_coordinate';

                                    // 添加新的编辑图形
                                    zMap.delShapes(null, 'coordinate');
                                    $scope.runningShape = iZmap.formatShapeObject($scope.runningShape, $scope.runningShape.id);
                                    $scope.runningShape.style.brushType = 'both';
                                    $scope.runningShape.highlightStyle = {opacity: 0};
                                    $scope.runningShape.style.lineWidth = 1;
                                    $scope.runningShape.style.strokeColor = 'red';
                                    zMap.addShapes([angular.copy($scope.runningShape)], 'coordinate');

                                    if($scope.runningShape['tagtype']) {
                                        $scope.runningShape = zMap.getGroup('coordinate').childAt(0);
                                        $scope.runningShape.reLocateNum = 0;
                                        $scope.oTypeTag['coordinate'].push($scope.runningShape);
                                    }

                                    // 隐藏被选择的图形或标签
                                    if(data.id) {
                                        zMap.hideShapes([data.originID || data.id]);
                                    }

                                    if(data.type == 'tag' && (data.originID || data.id)) {
                                        //隐藏被修改的标签
                                        aFind = $filter('filter')($scope.oTypeTag[data.tagtype], {id: data.originID || data.id});
                                        if(aFind.length == 1) {
                                            aFind[0].bHide = true;
                                        }
                                    }
                                    showMapGroup('coordinate', true);
                                    oTypeTagBox['coordinate'].show();

                                } else {
                                    // 将编辑图形删除
                                    mode = '';
                                    $scope.oTypeTag['coordinate'] = [];

                                    hideMapGroup('coordinate');
                                    oTypeTagBox['coordinate'].hide();

                                    if(oldData) {
                                        zMap.showShapes([oldData.originID || oldData.id]);
                                        if(oldData.type == 'tag' && (oldData.originID || oldData.id)) {
                                            aFind = $filter('filter')($scope.oTypeTag[oldData.tagtype], {id: oldData.originID || oldData.id});
                                            if(aFind.length == 1) {
                                                aFind[0].bHide = false;
                                            }
                                        }
                                    }
                                }
                            });

                            /**
                             * 根据图层显示相应的图形
                             */
                            $scope.$watch('layer.object', function(data, oldData) {
                                $timeout(function() {
                                    if(data && zMap && zMap.getZrender()) {
                                        if(oldData) {
                                            if(oldData['shapeGroups']) {
                                                angular.forEach(oldData['shapeGroups'], function(o) {
                                                    hideMapGroup(o.type, o['showText']);
                                                });
                                            }
                                            if(oTypeTagBox[oldData['type']]) {
                                                oTypeTagBox[oldData['type']].hide();
                                            }
                                            if(oldData['type'] == 'safe') {
                                                oTypeTagBox['monitor'].hide();
                                            }
                                        }

                                        if(data['shapeGroups']) {
                                            angular.forEach(data['shapeGroups'], function(o) {
                                                showMapGroup(o.type, o['showText']);
                                            });
                                        }
                                        if(oTypeTagBox[data['type']]) {
                                            oTypeTagBox[data['type']].show();
                                        }
                                        if(data['type'] == 'safe') {
                                            if(data['type'] == 'safe') {
                                                oTypeTagBox['monitor'].show();
                                            }
                                            showMapGroup('area', true);
                                            showMapGroup('lift', true);
                                        } else {
                                            hideMapGroup('area', true);
                                            hideMapGroup('lift', true);
                                        }
                                    }
                                });
                            });
                        }
                    }
                }
            }
        }
    ]);
});