/**
 * 数据接口。
 *
 * Created by zhs on 2018-03-09.
 */
define([
    'app'
], function(app) {
    app.factory('safeBidData', ['$q', '$interval', 'iAjax', function($q, $interval, iAjax) {
        var _query = {},
            _ouDetail;

        var fn = {
            getTheme: function() {
                var defer = $q.defer();
                iAjax.post('security/nationmap/datatheme.do?action=getBindDataTheme', {
                    // themetype: $scope.layoutService.chart.type,
                    type: _query.themetype,
                    value: _query.themeid
                }).then(function(data) {
                    if(data && data.result) {
                        defer.resolve(data.result);
                    } else {
                        defer.reject(data);
                    }
                }, function(data) {
                    defer.reject(data);
                });
                return defer.promise;
            },
            getOuDetail: function(init, fn) {
                var defer = $q.defer();
                iAjax.post('security/nationmap/map.do?action=getMapOuDetail', {
                    id: _query.ouid,
                    lvltype: _query.lvltype
                }).then(function(data) {
                    if(data && data.result) {
                        defer.resolve(data.result);
                        if(init) _ouDetail = data.result;
                        if(fn) fn();
                    } else {
                        defer.reject(data);
                    }
                }, function(data) {
                    defer.reject(data);
                });
                return defer.promise;
            },
            getParentDetail: function() {
                var result;
                if(_ouDetail) {
                    result = _ouDetail;
                }
                return result;
            },
            setQuery: function(key, value) {
                switch(key) {
                case 'mapid':
                    setMapID(value);
                    break;
                case 'lvltype':
                    _query.lvltype = value;
                    break;
                }
            },
            getQuery: function(key) {
                return _query[key];
            }
        };

        function init() {
            fn.getOuDetail(true, function() {
                _demo._init();
            });
        }

        function setMapID(mapid) {
            _query.mapid = mapid;
            if(mapid) {
                var ou = _.findWhere(_ouDetail.children, {mapid: mapid});
                if(ou) {
                    _query.ouid = ou.id;
                    _query.lvltype = ou.lvltype;

                    switch(ou.bindthemetype) {
                    case 'ou':
                        _query.themeid = ou.id;
                        break;
                    case 'outype':
                        _query.themeid = ou.type;
                        break;
                    case 'ou,type':
                        _query.themeid = ou.id + ',' + ou.type;
                        break;
                    }
                    _query.themetype = ou.bindthemetype;
                } else {
                    _query.ouid = '';
                    _query.themeid = '';
                    _query.themetype = '';
                }
            } else {
                _query.ouid = '';
                _query.themeid = '';
                _query.themetype = '';
            }
        }

        var _demo = Demo(fn);

        init();

        function Demo(service) {
            var data = {};
            var childs = {};
            var orgin = {
                jy: {
                    on: 1565000,
                    in: 478861,
                    out: 519561,
                    child: {
                        '110000': {
                            on: 9800,
                            in: 2100,
                            out: 1800
                        },
                        '120000': {
                            on: 23600,
                            in: 4800,
                            out: 5100
                        },
                        '130000': {
                            on: 53300,
                            in: 11000,
                            out: 12000
                        },
                        '140000': {
                            on: 40700,
                            in: 8000,
                            out: 10000
                        },
                        '150000': {
                            on: 41000,
                            in: 7700,
                            out: 9200
                        },
                        '210000': {
                            on: 60000,
                            in: 10000,
                            out: 11000
                        },
                        '220000': {
                            on: 43000,
                            in: 7800,
                            out: 7900
                        },
                        '230000': {
                            on: 47000,
                            in: 8000,
                            out: 8000
                        },
                        '310000': {
                            on: 30000,
                            in: 7000,
                            out: 7700
                        },
                        '320000': {
                            on: 81000,
                            in: 16900,
                            out: 20000
                        },
                        '330000': {
                            on: 71000,
                            in: 13000,
                            out: 16000
                        },
                        '340000': {
                            on: 61000,
                            in: 10500,
                            out: 12000
                        },
                        '350000': {
                            on: 53000,
                            in: 11000,
                            out: 12000
                        },
                        '360000': {
                            on: 30000,
                            in: 7000,
                            out: 8000
                        },
                        '370000': {
                            on: 60400,
                            in: 10000,
                            out: 10000
                        },
                        '410000': {
                            on: 70000,
                            in: 11000,
                            out: 14000
                        },
                        '420000': {
                            on: 61000,
                            in: 11000,
                            out: 12000
                        },
                        '430000': {
                            on: 50000,
                            in: 10000,
                            out: 11000
                        },
                        '440000': {
                            on: 115000,
                            in: 65000,
                            out: 68000
                        },
                        '450000': {
                            on: 36000,
                            in: 16000,
                            out: 19000
                        },
                        '460000': {
                            on: 13000,
                            in: 5500,
                            out: 5600
                        },
                        '500000': {
                            on: 30000,
                            in: 5000,
                            out: 5500
                        },
                        '510000': {
                            on: 80000,
                            in: 17000,
                            out: 20000
                        },
                        '520000': {
                            on: 42000,
                            in: 17000,
                            out: 20000
                        },
                        '530000': {
                            on: 101000,
                            in: 65000,
                            out: 70000
                        },
                        '540000': {
                            on: 3800,
                            in: 2000,
                            out: 2500
                        },
                        '610000': {
                            on: 33000,
                            in: 10000,
                            out: 11000
                        },
                        '620000': {
                            on: 32000,
                            in: 10000,
                            out: 11000
                        },
                        '630000': {
                            on: 11000,
                            in: 9000,
                            out: 10000
                        },
                        '640000': {
                            on: 8000,
                            in: 3700,
                            out: 4000
                        },
                        '650000': {
                            on: 105000,
                            in: 67000,
                            out: 68000
                        },
                        '650000_1': {
                            on: 51000,
                            in: 27000,
                            out: 28000
                        }
                    }
                },
                jd: {
                    on: 245275,
                    in: 6733,
                    out: 4260,
                    child: {
                        '110000': {
                            on: 1460,
                            in: 130,
                            out: 125
                        },
                        '120000': {
                            on: 1697,
                            in: 150,
                            out: 105
                        },
                        '130000': {
                            on: 2021,
                            in: 210,
                            out: 180
                        },
                        '140000': {
                            on: 10448,
                            in: 360,
                            out: 280
                        },
                        '150000': {
                            on: 3988,
                            in: 230,
                            out: 120
                        },
                        '210000': {
                            on: 3157,
                            in: 132,
                            out: 108
                        },
                        '220000': {
                            on: 2049,
                            in: 160,
                            out: 120
                        },
                        '230000': {
                            on: 3259,
                            in: 218,
                            out: 116
                        },
                        '310000': {
                            on: 6326,
                            in: 234,
                            out: 189
                        },
                        '320000': {
                            on: 8682,
                            in: 162,
                            out: 123
                        },
                        '330000': {
                            on: 8730,
                            in: 283,
                            out: 98
                        },
                        '340000': {
                            on: 4014,
                            in: 115,
                            out: 65
                        },
                        '350000': {
                            on: 4782,
                            in: 162,
                            out: 45
                        },
                        '360000': {
                            on: 5534,
                            in: 192,
                            out: 63
                        },
                        '370000': {
                            on: 3432,
                            in: 126,
                            out: 88
                        },
                        '410000': {
                            on: 5457,
                            in: 200,
                            out: 128
                        },
                        '420000': {
                            on: 9838,
                            in: 217,
                            out: 190
                        },
                        '430000': {
                            on: 11821,
                            in: 264,
                            out: 165
                        },
                        '440000': {
                            on: 35931,
                            in: 515,
                            out: 438
                        },
                        '450000': {
                            on: 6832,
                            in: 158,
                            out: 105
                        },
                        '460000': {
                            on: 8490,
                            in: 285,
                            out: 175
                        },
                        '500000': {
                            on: 9785,
                            in: 169,
                            out: 108
                        },
                        '510000': {
                            on: 14471,
                            in: 425,
                            out: 200
                        },
                        '520000': {
                            on: 13050,
                            in: 312,
                            out: 205
                        },
                        '530000': {
                            on: 35285,
                            in: 498,
                            out: 210
                        },
                        '540000': {
                            on: 22,
                            in: 3,
                            out: 2
                        },
                        '610000': {
                            on: 10739,
                            in: 320,
                            out: 146
                        },
                        '620000': {
                            on: 4392,
                            in: 88,
                            out: 56
                        },
                        '630000': {
                            on: 2165,
                            in: 132,
                            out: 120
                        },
                        '640000': {
                            on: 1681,
                            in: 68,
                            out: 65
                        },
                        '650000': {
                            on: 5447,
                            in: 200,
                            out: 116
                        },
                        '650000_1': {
                            on: 290,
                            in: 15,
                            out: 10
                        }
                    }
                },
                sq: {
                    on: 700000,
                    in: 480000,
                    out: 490000
                },
                lssws: {
                    on: 100,
                    in: 100,
                    out: 100
                },
                sfjdjg: {
                    on: 100,
                    in: 100,
                    out: 100
                },
                zcwyh: {
                    on: 100,
                    in: 100,
                    out: 100
                },
                gzc: {
                    on: 100,
                    in: 100,
                    out: 100
                },
                jcflfws: {
                    on: 100,
                    in: 100,
                    out: 100
                },
                fyjg: {
                    on: 100,
                    in: 100,
                    out: 100
                }
            };

            function init() {
                initData();
            }

            function initData() {
                $.each(orgin, function(type) {
                    setTypeData(type);
                });
            }

            function setTypeData(type) {
                // var o = data[type] = {};
                // var p = service.getParentDetail().children;

                service.setQuery('lvltype', getTypeQuery(type));
                service.getOuDetail().then(function(json) {
                    if(json && json.children && json.children.length) {
                        data[type] = {};
                        if(!orgin[type].child) {
                            setTypeDataChild(json.children, orgin[type], type);
                        } else {
                            var list = [];
                            $.each(orgin[type].child, function(key, object) {
                                list = _.where(json.children, {mapid: key});
                                setTypeDataChild(list, object, type);
                            });
                        }

                        // setTypeDataChild

                        /*var size = json.children.length;
                         var randomStep = 10000;
                         var scale = {};
                         var randomValues;

                         $.each(orgin[type], function(k) {
                         scale[k] = new Array(size);
                         $.each(scale[k], function(i) {
                         scale[k][i] = 0;
                         });
                         for(var i = 0; i < randomStep; i++) {
                         scale[k][Math.floor(Math.random() * size)] += 1;
                         }
                         });

                         $.each(json.children, function(i, row) {
                         randomValues = {};
                         $.each(orgin[type], function(k, v) {
                         if(v) {
                         randomValues[k] = Math.floor(v * scale[k][i] / randomStep * ((80 + Math.random() * 40) / 100));
                         } else {
                         randomValues[k] = Math.floor(Math.random() * 100);
                         }
                         });
                         row._values = randomValues;
                         row._type = type;
                         o[row.id] = row;

                         if(o[row.mapid]) {
                         var values = o[row.mapid]._values;
                         $.each(randomValues, function(key, value) {
                         if(values[key]) {
                         values[key] += value;
                         } else {
                         values[key] = value;
                         }
                         });
                         } else {
                         var mapInfo = _.findWhere(p, {mapid: row.mapid});
                         mapInfo = $.extend(true, {}, mapInfo);
                         mapInfo._type = 'map';
                         mapInfo._values = $.extend(true, {}, randomValues);
                         o[row.mapid] = mapInfo;
                         }
                         });*/
                    }
                });
            }

            function setTypeDataChild(list, orginData, type) {
                var o = data[type];
                var p = service.getParentDetail().children;

                var size = list.length;
                var randomStep = 10000;
                var scale = {};
                var randomValues;

                $.each(orginData, function(k) {
                    scale[k] = new Array(size);
                    $.each(scale[k], function(i) {
                        scale[k][i] = 0;
                    });
                    for(var i = 0; i < randomStep; i++) {
                        scale[k][Math.floor(Math.random() * size)] += 1;
                    }
                });

                $.each(list, function(i, row) {
                    randomValues = {};
                    $.each(orginData, function(k, v) {
                        if(v) {
                            randomValues[k] = Math.floor(v * scale[k][i] / randomStep * ((80 + Math.random() * 40) / 100));
                        } else {
                            randomValues[k] = Math.floor(Math.random() * 100);
                        }
                    });
                    row._values = randomValues;
                    row._type = type;
                    o[row.id] = row;
                    if(o[row.mapid]) {
                        var values = o[row.mapid]._values;
                        $.each(randomValues, function(key, value) {
                            if(values[key]) {
                                values[key] += value;
                            } else {
                                values[key] = value;
                            }
                        });
                    } else {
                        var mapInfo = _.findWhere(p, {mapid: row.mapid});
                        mapInfo = $.extend(true, {}, mapInfo);
                        mapInfo._type = 'map';
                        mapInfo._values = $.extend(true, {}, randomValues);
                        o[row.mapid] = mapInfo;
                    }
                });
            }

            function getTypeQuery(type) {
                var result = '';
                switch(type) {
                case 'jy':
                    result = 'SUOYOUJIANYU';
                    break;
                case 'jd':
                    result = 'SUOYOUJIEDUSUO';
                    break;
                case 'sq':
                    result = 'SUOYOUSIFAJU';
                    break;
                case 'lssws':
                    result = 'SUOYOULVSHISHIWUSUO';
                    break;
                case 'sfjdjg':
                    result = 'SUOYOUSIFAJIANDINGJIGOU';
                    break;
                case 'zcwyh':
                    result = 'SUOYOUZHONGCAIWEIYUANHUI';
                    break;
                case 'gzc':
                    result = 'SUOYOUGONGZHENGCHU';
                    break;
                case 'jcflfws':
                    result = 'SUOYOUJICENGFALVFUWUSUO';
                    break;
                case 'fyjg':
                    result = 'SUOYOUFAYUAN';
                    break;
                }

                return result;
            }

            function getOuCount(type, mapid) {
                mapid = mapid || service.getQuery('mapid');
                if(mapid && mapid != '0') {
                    return _.where(data[type], {_type: type, mapid: mapid}).length;
                } else {
                    return _.where(data[type], {_type: type}).length;
                }
            }

            function getPeopleCount(type, id) {
                return getValueCount(type, 'on', id);
            }

            function getValueCount(type, type2, id) {
                var result = 0;
                id = id || service.getQuery('mapid');
                if(id && id != '0') {
                    var o = data[type][id];
                    if(o && o._values && o._values[type2]) {
                        result = o._values[type2];
                    }
                } else {
                    var maps = _.where(data[type], {_type: 'map'});
                    $.each(maps, function(i, o) {
                        if(o && o._values && o._values[type2]) {
                            result += o._values[type2];
                        }
                    });
                }
                return result;
            }

            function getOuList(type, mapid) {
                mapid = mapid || service.getQuery('mapid');
                if(mapid && mapid != '0') {
                    return _.where(data[type], {_type: type, mapid: mapid});
                } else {
                    return _.where(data[type], {_type: 'map'});
                }
            }

            function getAllOuList(type) {
                return _.where(data[type], {_type: type});
            }

            function randomList(list, count, key) {
                var result = [];
                if(list && list.length) {
                    key = key || 'value';
                    var size = list.length;
                    var scale = new Array(size);
                    var index;
                    for(var i = 0; i < 1000; i++) {
                        index = parseInt(Math.random() * size);
                        if(scale[index]) {
                            scale[index]++;
                        } else {
                            scale[index] = 1;
                        }
                    }

                    $.each(list, function(i, row) {
                        row[key] = parseInt(count * scale[i] / 1000);
                    });

                    result = list;
                }

                return result;
            }

            function randomRatio(count, size) {
                var result = new Array(size),
                    index;
                $.each(result, function(i) {
                    result[i] = 0;
                });
                for(var i = 0; i < count; i++) {
                    index = parseInt(Math.random() * size);
                    result[index]++;
                }
                return result;
            }

            function getChildList(id, type, count) {
                var result = [];

                if(childs[id]) {
                    result = childs[id];
                } else {
                    var typeName = (type == 'jy') ? '监区' : '大队';
                    var names = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五'];
                    var size = Math.floor(Math.random() * 10) + 5;
                    var scale = new Array(size);
                    if(!count) {
                        var ou = _.findWhere(data[type], {id: id});
                        if(ou && ou._values && ou._values.on) {
                            count = ou._values.on;
                        }
                    }

                    for(var i = 0; i < 100; i++) {
                        var index = Math.floor(Math.random() * size);
                        if(scale[index]) {
                            scale[index]++;
                        } else {
                            scale[index] = 1;
                        }
                    }

                    $.each(scale, function(i, s) {
                        result.push({
                            name: names[i] + typeName,
                            value: parseInt(count * s / 100)
                        });
                    });

                    childs[id] = result;
                }

                return result;
            }

            function getObject(type, id) {
                return data[type][id];
            }

            function getData() {
                return $.extend(true, {}, data);
            }

            function num2str(Num) {
                for(var i = Num.length - 1; i >= 0; i--) {
                    Num = Num.replace(',', '');
                    Num = Num.replace(' ', '');
                }
                if(isNaN(Num)) {
                    return '';
                }
                var part = (Num + '').split('.');
                var newchar = '';

                for(var i = part[0].length - 1; i >= 0; i--) {
                    if(part[0].length > 10) {
                        return '';
                    }
                    var tmpnewchar = '';
                    var perchar = part[0].charAt(i);
                    switch(perchar) {
                    case '0':
                        tmpnewchar = '零' + tmpnewchar;
                        break;
                    case '1':
                        tmpnewchar = '一' + tmpnewchar;
                        break;
                    case '2':
                        tmpnewchar = '二' + tmpnewchar;
                        break;
                    case '3':
                        tmpnewchar = '三' + tmpnewchar;
                        break;
                    case '4':
                        tmpnewchar = '四' + tmpnewchar;
                        break;
                    case '5':
                        tmpnewchar = '五' + tmpnewchar;
                        break;
                    case '6':
                        tmpnewchar = '六' + tmpnewchar;
                        break;
                    case '7':
                        tmpnewchar = '七' + tmpnewchar;
                        break;
                    case '8':
                        tmpnewchar = '八' + tmpnewchar;
                        break;
                    case '9':
                        tmpnewchar = '九' + tmpnewchar;
                        break;
                    }
                    switch(part[0].length - i - 1) {
                    case 0:
                        tmpnewchar = tmpnewchar + '';
                        break;
                    case 1:
                        if(perchar != 0) tmpnewchar = tmpnewchar + '十';
                        break;
                    case 2:
                        if(perchar != 0) tmpnewchar = tmpnewchar + '百';
                        break;
                    case 3:
                        if(perchar != 0) tmpnewchar = tmpnewchar + '千';
                        break;
                    case 4:
                        tmpnewchar = tmpnewchar + '万';
                        break;
                    case 5:
                        if(perchar != 0) tmpnewchar = tmpnewchar + '十';
                        break;
                    case 6:
                        if(perchar != 0) tmpnewchar = tmpnewchar + '百';
                        break;
                    case 7:
                        if(perchar != 0) tmpnewchar = tmpnewchar + '千';
                        break;
                    case 8:
                        tmpnewchar = tmpnewchar + '亿';
                        break;
                    case 9:
                        tmpnewchar = tmpnewchar + '十';
                        break;
                    }
                    newchar = tmpnewchar + newchar;
                }
                while(newchar.search('零零') != -1 || newchar.search('零亿') != -1 || newchar.search('亿万') != -1 || newchar.search('零万') != -1) {
                    newchar = newchar.replace('零亿', '亿');
                    newchar = newchar.replace('亿万', '亿');
                    newchar = newchar.replace('零万', '万');
                    newchar = newchar.replace('零零', '零');
                }
                if(newchar.indexOf('一十') == 0) {
                    newchar = newchar.substr(1);
                }
                if(newchar.lastIndexOf('零') == newchar.length - 1) {
                    if(newchar.length != 1)newchar = newchar.substr(0, newchar.length - 1);
                }
                return newchar;
            }

            return {
                _init: init,
                ouCount: getOuCount,
                peopleCount: getPeopleCount,
                valueCount: getValueCount,
                ouList: getOuList,
                allOuList: getAllOuList,
                childList: getChildList,
                randomList: randomList,
                randomRatio: randomRatio,
                getObject: getObject,
                getData: getData,
                num2str: num2str,
                time: {
                    listStep: 15 * 1000,
                    updateInStep: 60 * 1000,
                    updateOutStep: 15 * 1000
                }
            }
        }

        return {
            getTheme: fn.getTheme,
            getOuDetail: fn.getOuDetail,
            getParentDetail: fn.getParentDetail,
            setQuery: fn.setQuery,
            getQuery: fn.getQuery,
            demo: _demo
        }
    }]);
});