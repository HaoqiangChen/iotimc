define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min',
    'safe/plugins/bid/js/services/safeBidMapData',
    'safe/plugins/bid/js/services/safeBidMapShape'
], function(app, echarts) {
    app.directive('safeBidMap', ['$timeout', 'safeBidMapData', 'safeBidData', function($timeout, safeBidMapData, safeBidData) {
        var _noChild = ['710000', '810000', '820000'];

        var _showLabel = {
            normal: {
                show: true,
                textStyle: {
                    color: 'rgba(255, 255, 255, 1)',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑'
                }
            },
            emphasis: {
                show: true,
                textStyle: {
                    color: 'rgba(255, 255, 255, 1)',
                    fontWeight: 'bold',
                    fontFamily: '微软雅黑'
                }
            }
        };

        var _hideLabel = {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            }
        };

        return {
            restrict: 'E',
            template: '<div class="layout-full" style="position: relative"><div class="layout-full safe-bid-map"></div></div>',
            replace: true,
            scope: true,
            link: function($scope, $element) {
                if(!$scope.dataService) {
                    $scope.dataService = safeBidData.create();
                }

                var _map = null,
                    _option = {},
                    _animation = false;

                /**
                 * 初始化全国地图背景
                 */
                function _init(fn) {
                    $.getJSON($.soa.getWebPath('iiw.safe.plugins.bid') + '/lib/echarts/map/zhongguo.json', function(data) {
                        echarts.registerMap('zhongguo', data);

                        _option.series = [{
                            name: 'mapBackground',
                            type: 'map',
                            map: 'zhongguo',
                            zlevel: 1,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    areaColor: 'rgba(' + safeBidMapData.areaColor + ', 0)',
                                    borderColor: 'rgb(' + safeBidMapData.borderColor + ')',
                                    borderWidth: 2,
                                    shadowBlur: 25,
                                    shadowColor: 'rgb(' + safeBidMapData.borderColor + ')'
                                }
                            },
                            silent: true
                        }];

                        zoomMapBackground();
                        centerMapBackground();

                        _map.setOption(_option);

                        if(fn) fn();
                    });
                }

                /**
                 * 默认显示全国地图
                 */
                function _showChinaMap(fn) {
                    _animation = true;
                    safeBidMapData.getChinaMap().then(function(oMap) {
                        _showMap(oMap.name, oMap.alias, oMap.mapid, oMap.regions, oMap.zoom, oMap.center);
                        _animation = false;

                        if(fn) fn();
                    });
                }

                /**
                 * 显示省（直辖市、自治区）级地图
                 */
                function _showChildMap(code, child) {
                    if(child) {
                        $scope.sendMessage('safe.bid.map.load.start', code);
                    }
                    _animation = true;
                    safeBidMapData.getChildMap(code).then(function(oMap) {
                        _zoomIn(oMap, code, child);
                    }, function() {
                        _animation = false;
                    });
                }


                /**
                 * 放大到省份
                 */
                function _zoomIn(oMap, code, child) {
                    if(oMap) {
                        _option.animationDurationUpdate = 1000;
                        _option.animationEasingUpdate = 'exponentialIn';
                        _option.geo.center = oMap.center;
                        _option.geo.zoom = oMap.zoom;
                        _option.geo.label = _hideLabel;
                        zoomMapBackground();
                        centerMapBackground();
                        hideMapBackground();

                        _map.setOption(_option);

                        $timeout(function() {
                            _showMap(oMap.name, oMap.alias, oMap.mapid, oMap.regions, oMap.zoom, oMap.center);
                            _animation = false;

                            if(child) {
                                $scope.isChild = true;
                                $scope.layoutService.returnMap = true;
                                $scope.sendMessage('safe.bid.map.load.end', code);
                            } else {
                                $scope.sendMessage('safe.bid.map.init.child.load.end');
                            }
                        }, 1000);
                    }
                }


                /**
                 * 缩小到全中国
                 */
                function _zoomOut(callback) {
                    $scope.sendMessage('safe.bid.map.load.start');
                    $scope.isChild = false;
                    $scope.layoutService.returnMap = false;
                    _animation = true;
                    safeBidMapData.getChinaMap().then(function(oMap) {
                        _showMap(oMap.name, oMap.alias, oMap.mapid, oMap.regions, _option.geo.zoom);

                        _option.animationDurationUpdate = 1000;
                        _option.animationEasingUpdate = 'exponentialIn';
                        _option.geo.center = null;
                        _option.geo.zoom = oMap.zoom;
                        // _option.geo.label = _hideLabel;

                        if(oMap.center) _option.geo.center = oMap.center;

                        zoomMapBackground();
                        centerMapBackground();

                        _map.setOption(_option);

                        $timeout(function() {
                            _option.animationDurationUpdate = 0;
                            // _option.geo.label = _showLabel;
                            showMapBackground();
                            _map.setOption(_option);

                            _animation = false;
                            $scope.sendMessage('safe.bid.map.load.end');

                            if(callback) callback();
                        }, 1000);
                    }, function() {
                        _animation = false;
                        if(callback) callback();
                    });
                }

                function _showMap(name, alias, mapid, regions, zoom, center) {
                    _option.geo = {};

                    setMapInfo(name, mapid);

                    if(center) {
                        _option.geo.center = center;
                        _option.geo.defaultCenter = center;
                    }
                    if(regions) _option.geo.regions = regions;

                    _option.animationDurationUpdate = 0;
                    _option.geo.zoom = zoom || 1;
                    _option.geo.map = alias;
                    // _option.geo.roam = true;
                    _option.geo.label = _hideLabel;
                    _option.geo.silent = (mapid == '0') ? false : true;

                    _option.geo.itemStyle = {
                        normal: safeBidMapData.getRegionStyle({type: 1}, 1),
                        emphasis: safeBidMapData.getRegionStyle({type: 1}, 1)
                    };

                    _map.setOption(_option);
                }

                function setMapInfo(name, mapid) {
                    $scope.layoutService.mapName = name;

                    var parentObject = $scope.dataService.getParentDetail();
                    if(parentObject && parentObject.children && parentObject.children.length) {
                        var list = parentObject.children;
                        var index = _.findIndex(list, {mapid: mapid});
                        if(index != -1) {
                            $scope.layoutService.mapIndex = (index + 1) + '';
                        } else {
                            $scope.layoutService.mapIndex = '0';
                        }
                    }
                }

                function showMapBackground() {
                    var mapBackground = _.findWhere(_option.series, {name: 'mapBackground'});
                    if(mapBackground) {
                        mapBackground.itemStyle.normal.opacity = 1;
                    }
                }

                function hideMapBackground() {
                    var mapBackground = _.findWhere(_option.series, {name: 'mapBackground'});
                    if(mapBackground) {
                        mapBackground.itemStyle.normal.opacity = 0;
                    }
                }

                function zoomMapBackground() {
                    var mapBackground = _.findWhere(_option.series, {name: 'mapBackground'});
                    if(mapBackground) {
                        var zoom = _option.geo.zoom;
                        if(zoom) {
                            mapBackground.zoom = zoom;
                        }
                    }
                }

                function centerMapBackground() {
                    var mapBackground = _.findWhere(_option.series, {name: 'mapBackground'});
                    if(mapBackground) {
                        mapBackground.center = null;
                        var center = _option.geo.center;
                        if(center) {
                            mapBackground.center = center;
                        }
                    }
                }

                function _event() {
                    _map.on('click', function(object) {
                        if(!_animation && object && object.region && object.region.id && object.region.type) {
                            if(_noChild.indexOf(object.region.id) == -1) {
                                switch(object.region.type) {
                                case 1:
                                    _showChildMap(object.region.id, true);
                                    break;
                                case 2:
                                    // TODO
                                    // _zoomOut();
                                    break;
                                case 3:
                                    // 放大缩小效果
                                    // _zoomOut(function() {
                                    //     _showChildMap(object.region.id);
                                    // });

                                    // 平移效果
                                    // _showChildMap(object.region.id, true);

                                    // test
                                    // var o = _map.getOption().geo[0];
                                    // console.log(o.center, o.zoom);
                                    break;
                                }
                            }

                            // test
                            // var o = _map.getOption().geo[0];
                            // console.log(o.center, o.zoom, o);
                        }

                        $scope.sendMessage('safe.bid.map.click', object);
                    });

                    _map.on('mouseover', function(object) {
                        $scope.sendMessage('safe.bid.map.mouseover', object);
                    });

                    _map.on('mouseout', function(object) {
                        $scope.sendMessage('safe.bid.map.mouseout', object);
                    });

                    var z = _map.getZr();

                    z.on('click', function(object) {
                        $scope.sendMessage('safe.bid.map.shape.click', object);
                    });
                }

                _map = echarts.init($element.find('.safe-bid-map').get(0));
                $scope.layoutService.map = _map;

                _event();
                _showChinaMap(function() {
                    _init(function() {
                        $scope.sendMessage('safe.bid.loading.value', 20);
                    });
                });

                $scope.showChina = function() {
                    _zoomOut();
                };

                $scope.$on('safe.bid.map.showChina', function() {
                    _zoomOut();
                });

                $scope.$on('safe.bid.map.showChildMap', function(e, data) {
                    if(data && data.id) {
                        _showChildMap(data.id, true);
                    }
                });

                // 如果权限对应的不是全国，那么进入对应的省份地图
                $scope.$on('safe.bid.loading.success', function() {
                    _animation = true;
                    safeBidMapData.getDefaultMapID().then(function(data) {
                        if(data.mapid && data.mapid != '0') {
                            $timeout(function() {
                                _showChildMap(data.mapid);
                            }, 1000);

                            $('.safe-bid-index-map-select').css('opacity', 0).hide();
                        } else {
                            _animation = false;

                            var parentObject = $scope.dataService.getParentDetail();
                            if(parentObject && parentObject.children && parentObject.children.length) {
                                var list = [{
                                    name: '全国',
                                    mapid: '0'
                                }];

                                $.each(parentObject.children, function(i, o) {
                                    list.push({
                                        name: o.alias,
                                        mapid: o.mapid
                                    });
                                });

                                $scope.layoutService.maps = list;
                            }
                        }
                    }, function() {
                        _animation = false;
                    });
                });
            }
        }
    }]);
});