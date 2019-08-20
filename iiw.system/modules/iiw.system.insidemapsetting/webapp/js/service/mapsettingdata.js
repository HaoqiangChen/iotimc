
/**
 * 地图配置数据服务
 *
 * @author - dwt
 * @date - 2016-03-10
 * @version - 0.1
 */
define(['app'], function(app) {
    app.service('mapSettingData', [
        '$filter',
        'iAjax',

        function($filter, iAjax) {

            var cacheMapData = null,
                navigatePath = null,
                copyPointList = null;

            function getMapList(callback) {
                _getMaps(function() {
                    if(callback) {
                        callback(cacheMapData);
                    }
                });
            }

            function getMap(mapfk, callback) {
                _getMaps(function() {
                    var mapData = $filter('filter')(cacheMapData, function(row) {
                        return (row.type == 'map' && row['id'] == mapfk);
                    });
                    var map = mapData[0];

                    var ouData = $filter('filter')(cacheMapData, function(row) {
                        return (row['id'] == map['parentid']);
                    });

                    var ouMaps = $filter('filter')(cacheMapData, function(row) {
                        return (row.type == 'map' && row['parentid'] == map['parentid']);
                    });

                    var parentMap = $filter('filter')(cacheMapData, function(row) {
                        return (row.type == 'map' && row['parentid'] == ouData[0]['parentid']);
                    });

                    if(map) {
                        _getMapShapes(map.id, function(shapes) {
                            map.mapDtl = shapes;
                            callback(map, ouData[0], ouMaps, parentMap[0]);
                        });
                    }
                });
            }

            function getMapData(targetID, callback) {
                _getMaps(function() {
                    var targetData = $filter('filter')(cacheMapData, function(row) {
                        return row['id'] == targetID;
                    });

                    var targetMapData = $filter('filter')(cacheMapData, function(row) {
                        return (row.type == 'map' && row['parentid'] == targetData[0].id);
                    });
                    var firstMap = targetMapData[0];

                    _getMapShapes(firstMap.id, function(shapes) {
                        firstMap.mapDtl = shapes;
                        callback(targetData[0], firstMap, targetMapData);
                    });
                });
            }

            function getUserMap(callback) {
                _getMaps(function() {
                    var userOuData = $filter('filter')(cacheMapData, function(row) {
                        return (row.type == 'ou' && !row['parentid']);
                    });

                    callback(cacheMapData, userOuData[0]);
                }, true);
            }

            function saveNavigate(path) {
                navigatePath = path;
            }

            function getNavigate() {
                return (navigatePath || null);
            }

            function saveCopyPointList(pointList) {
                copyPointList = pointList;
            }

            function getCopyPointList() {
                return (copyPointList || null);
            }

            function _getMaps(callback, cleanCache) {
                if(cacheMapData && !cleanCache) {
                    callback();
                }else {
                    var data = {},
                        url = 'security/common/monitor.do?action=getMapOuList';

                    data.filter = {};
                    data.filter.cascade = 'Y';

                    iAjax
                        .post(url, data)
                        .then(function(data) {
                            cacheMapData = data.result.rows;

                            callback();
                        });
                }
            }

            function _getMapShapes(mapfk, callback) {
                iAjax
                    .post('security/common/monitor.do?action=getDeviceMapdtlList', {
                        filter: { mapfk: mapfk, dtype: '%'}
                    })
                    .then(function(data) {
                        if(callback) {
                            callback(data.result.rows);
                        }
                    });
            }

            function _getSycode(type, callback) {
                var url = 'security/common/monitor.do?action=getSycodeList',
                    data = {
                        filter: {
                            type: type
                        }
                    };

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data.result && data.result.rows && callback) {
                            callback(data.result.rows);
                        }
                    });
            }

            return {
                getMapList: getMapList,
                getMap: getMap,
                getMapData: getMapData,
                getUserMap: getUserMap,
                getMapShapes: _getMapShapes,
                saveNavigate: saveNavigate,
                getNavigate: getNavigate,
                saveCopyPointList: saveCopyPointList,
                getCopyPointList: getCopyPointList,
                getSycode: _getSycode
            }
        }
    ]);
});