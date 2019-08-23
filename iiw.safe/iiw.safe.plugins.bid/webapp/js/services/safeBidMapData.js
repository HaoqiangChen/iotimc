/**
 * 地图数据管理接口。
 *
 * Created by zhs on 2018-03-0*.
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app, echarts) {
    app.factory('safeBidMapData', ['$q', 'iAjax', 'iMessage', function($q, iAjax, iMessage) {
        var _china,
            _maps = {},
            _areaColor = '8, 176, 254',
            _borderColor = '8, 176, 254';

        function _getMap(mapID) {
            var defer = $q.defer();

            iAjax.post('security/nationmap/map.do?action=getMapFromId', {
                mapid: mapID
            }).then(function(data) {
                var result = data.result;
                if(result && result.map) {
                    defer.resolve(result);
                } else {
                    // TODO ERROR
                    defer.reject(data);

                    iMessage.show({
                        level: 3,
                        title: '警告',
                        content: '获取地图数据失败！'
                    });
                }
            }, function(data) {
                // TODO ERROR
                defer.reject(data);
            });

            return defer.promise;
        }

        function _getChinaMap() {
            var defer = $q.defer();

            if(_china) {
                defer.resolve(_china);
            } else {
                _getMap().then(function(data) {
                    var map = data.map;

                    var center;

                    if(data.centerpointlat && data.centerpointlon) {
                        center = [data.centerpointlat, data.centerpointlon];
                    }

                    _china = {
                        name: data.name,
                        alias: data.alias,
                        originalMap: $.extend(true, {}, map),
                        regions: getChinaRegions(map.features),
                        zoom: data.enlargelvl,
                        mapid: data.mapid
                    };

                    if(center) _china.center = center;

                    _china.originalMap.features = _china.originalMap.features.slice(0, _china.originalMap.features.length - 2);

                    $.each(_china.originalMap.features, function(i, o) {
                        o.type = 3;
                    });

                    echarts.registerMap(data.alias, map);
                    defer.resolve(_china);
                }, function(data) {
                    defer.reject(data);
                });
            }

            return defer.promise;
        }

        function _getChildMap(mapID) {
            var defer = $q.defer();

            if(_maps[mapID]) {
                defer.resolve(_maps[mapID]);
            } else {
                _getMap(mapID).then(function(data) {
                    var map = $.extend(true, {}, _china.originalMap);
                    map.features = map.features.concat(data.map.features);

                    var center;

                    if(data.centerpointlat && data.centerpointlon) {
                        center = [data.centerpointlat, data.centerpointlon];
                    } else {
                        var o = _.findWhere(_china.originalMap.features, {id: mapID});
                        if(o) {
                            center = o.properties.cp;
                        }
                    }

                    _maps[mapID] = {
                        name: data.name,
                        alias: data.alias,
                        regions: getChildRegions(map.features, mapID),
                        zoom: data.enlargelvl,
                        center: center,
                        mapid: data.mapid
                    };
                    echarts.registerMap(data.alias, map);
                    defer.resolve(_maps[mapID]);
                }, function(data) {
                    defer.reject(data);
                });
            }

            return defer.promise;
        }

        function getChinaRegions(features) {
            var regions = [],
                region;

            $.each(features, function(i, o) {
                region = {
                    id: o.id,
                    type: 1,        // 1->省（直辖市、自治区）；2->市
                    name: o.properties.name
                };

                region.itemStyle = {
                    normal: _getRegionStyle(region, 1),
                    emphasis: _getRegionStyle(region, 2)
                };

                region.label = {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    },
                    emphasis: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 1)',
                            fontWeight: 'bold',
                            fontFamily: '微软雅黑'
                        }
                    }
                };

                regions.push(region);
            });

            return regions;
        }

        function getChildRegions(features, mapID) {
            var regions = [],
                region;

            $.each(features, function(i, o) {
                region = {
                    id: o.id,
                    type: o.type || 2,        // 1->省（直辖市、自治区）；2->市
                    name: o.properties.name
                };

                if(o.id == mapID) {
                    region.itemStyle = {
                        normal: _getRegionStyle(region, 1, mapID),
                        emphasis: _getRegionStyle(region, 2, mapID)
                    };
                    region.label = {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    };
                } else if(o.id.indexOf(mapID.substr(0, 2)) == 0) {
                    region.itemStyle = {
                        normal: _getRegionStyle(region, 1, mapID),
                        // emphasis: _getRegionStyle(region, 2, mapID)
                        emphasis: _getRegionStyle(region, 1, mapID)
                    };
                    region.label = {
                        normal: {
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontWeight: 'bold',
                                fontFamily: '微软雅黑'
                            }
                        },
                        emphasis: {
                            // textStyle: {
                            //     color: 'rgba(255, 255, 255, 1)',
                            //     fontWeight: 'bold',
                            //     fontFamily: '微软雅黑'
                            // }
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontWeight: 'bold',
                                fontFamily: '微软雅黑'
                            }
                        }
                    };
                } else {
                    region.itemStyle = {
                        normal: _getRegionStyle(region, 1, mapID),
                        emphasis: _getRegionStyle(region, 2, mapID)
                    };
                    region.label = {
                        normal: {
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontWeight: 'bold',
                                fontFamily: '微软雅黑'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: 'rgba(255, 255, 255, 0.3)',
                                fontWeight: 'bold',
                                fontFamily: '微软雅黑'
                            }
                        }
                    };
                }

                regions.push(region);
            });

            return regions;
        }

        function _getDefaultMapID() {
            var defer = $q.defer();
            iAjax.post('security/nationmap/map.do?action=getMapIdFromUser', null).then(function(data) {
                if(data && data.result) {
                    defer.resolve(data.result);
                } else {
                    // TODO ERROR
                    defer.reject(data);
                }
            }, function(data) {
                // TODO ERROR
                defer.reject(data);
            });
            return defer.promise;
        }

        function _getRegionStyle(region, status, mapID) {
            var result = {};
            if(region.type == 1) {
                if(status == 1) {
                    result = {
                        color: 'rgba(' + _areaColor + ', 0)',
                        borderColor: 'rgba(' + _borderColor + ', 0.75)'
                    };
                } else {
                    result = {
                        color: 'rgba(' + _areaColor + ', 0.25)',
                        borderColor: 'rgba(' + _borderColor + ', 1)',
                        borderWidth: 2,
                        shadowBlur: 25,
                        shadowColor: 'rgba(' + _borderColor + ', 1)'
                    };
                }
            } else {
                if(region.id == mapID) {
                    result = {
                        color: 'rgba(8, 176, 254, 0)',
                        borderColor: 'rgb(' + _borderColor + ')',
                        borderWidth: 2,
                        shadowBlur: 25,
                        shadowColor: 'rgb(' + _borderColor + ')'
                    };
                } else if(region.id.indexOf(mapID.substr(0, 2)) == 0) {
                    if(status == 1) {
                        result = {
                            color: 'rgba(' + _areaColor + ', 0.25)',
                            borderColor: 'rgba(' + _borderColor + ', 1)'
                        };
                    } else {
                        result = {
                            color: 'rgba(' + _areaColor + ', 0.5)',
                            borderColor: 'rgba(' + _borderColor + ', 1)',
                            borderWidth: 2,
                            shadowBlur: 25,
                            shadowColor: 'rgba(' + _borderColor + ', 1)'
                        };
                    }
                } else {
                    result = {
                        color: 'rgba(' + _areaColor + ', 0)',
                        borderColor: 'rgba(' + _borderColor + ', 1)'
                    };
                }
            }

            return result;
        }

        return {
            areaColor: _areaColor,
            borderColor: _borderColor,
            getChinaMap: _getChinaMap,
            getChildMap: _getChildMap,
            getDefaultMapID: _getDefaultMapID,
            getRegionStyle: _getRegionStyle
        }
    }]);
});