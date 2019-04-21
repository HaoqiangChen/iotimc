/**
 * 信息牌模板
 *
 * @author - dwt
 * @date - 2016-09-18
 * @version - 0.1
 */
define([
    'app',
    'cssloader!safe/insidemap/css/infocard.css'
], function (app) {
    app.directive('safeInfocardTemplate', [
        '$compile',
        'iAjax',
        '$timeout',

        function ($compile, iAjax, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    templateUrl: '=templateUrl',
                    templateHtml: '=templateHtml',
                    dsClick: '=dsClick',
                    time: '=time'
                },
                compile: function () {
                    return {
                        post: function (scope, element, attrs) {
                            var url = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=';
                            var mouseTimer = null;
                            var carInfoCardList = [];
                            scope.currentPage = 1;
                            scope.pageSize = 10;
                            scope.totalSize = 0;
                            scope.totalPage = 0;
                            scope.infocardClick = 0;
                            scope.$watch('templateUrl', function (templateUrl) {
                                if (templateUrl) {
                                    var tUrl = templateUrl.indexOf('http') == -1 ? (url + templateUrl) : templateUrl;
                                    $.ajax({
                                        url: tUrl,
                                        async: false,
                                        cache: false,
                                        dataType: 'text'
                                    }).success(function (data) {

                                        getSycodeInfocardMapClick();
                                        loadTemplateHtml(data);

                                    });
                                }
                            });

                            scope.$watch('templateHtml', function (data) {
                                if (data) {
                                    loadTemplateHtml(data);
                                }
                            });

                            scope.showPolice = function (item) {
                                scope.$emit('safeInfoCardPoliceEvent', item);
                            };

                            scope.mouseover = function (e) {
                                if (mouseTimer) {
                                    $timeout.cancel(mouseTimer);
                                    scope.$emit('safeInfoCardPoliceMouseover', e.target.getAttribute('coding'));
                                }
                            };

                            scope.mouseleave = function () {
                                mouseTimer = $timeout(function () {
                                    scope.$emit('safeInfoCardPoliceMouseleave');
                                }, 24);
                            };

                            scope.showCriminal = function (item) {
                                if (item.check == '1' && item.bm) {
                                    scope.$emit('map.showCriminalYJT', item.bm);
                                }
                            };

                            // 显示实到或未到的信息
                            scope.showPosition = function (type) {
                                if (type == '1') {
                                    scope.$parent.area.positionType = '1';
                                } else {
                                    scope.$parent.area.positionType = '0';
                                }
                                scope.$parent.area.cInfocard.state = 'AP';
                            };

                            scope.nextPage = function() {
                                if(!scope.startPost &&  (scope.totalSize / (scope.currentPage * scope.pageSize)) > 1) {
                                    scope.currentPage ++;
                                    iAjax
                                        .post('security/map/map.do?action=getCarInList', {params: {pageNo: scope.currentPage, pageSize: scope.pageSize}})
                                        .then(function(data) {
                                            if(data.result && data.result.rows) {
                                                if(data.result.rows.length) {
                                                    carInfoCardList = data.result.rows;
                                                    scope.currentPage = data.result.params.pageNo;
                                                    scope.pageSize = data.result.params.pageSize;
                                                    scope.totalSize = data.result.params.totalSize;
                                                    scope.totalPage = data.result.params.totalPage;
                                                    $.each(data.result.rows, function(i, o) {
                                                        $(element).find('.carTemplate').append('<div class="info-row"><div class="info-left" style="width:105px;">'+ o.operatorname + '</div><div class="info-left" style="width:130px;">'+ o.carnumber + '</div><div class="info-left">'+ o.logtime + '</div></div></div>');
                                                    });
                                                }
                                            }
                                        })
                                }
                            };

                            //人员进出区域事件
                            scope.$on('ws.positionHandle', function () {
                                //若指令属性含有 loadds属性 则加载数据源
                                if (element.attr('loadds') !== undefined) {
                                    loadDataSource();
                                }
                                event.stopPropagation();
                            });

                            //车辆离开停车场事件
                            scope.$on('ws.CarInoutHandle', function() {
                                scope.getCarInfoCardListInfo();
                            });

                            scope.getCarInfoCardListInfo = function() {
                                iAjax
                                    .post('security/map/map.do?action=getCarInList', {params: {pageNo: scope.currentPage, pageSize: scope.pageSize}})
                                    .then(function(data) {
                                        if(data.result && data.result.rows) {
                                            if(data.result.rows.length) {
                                                carInfoCardList = data.result.rows;
                                                scope.currentPage = data.result.params.pageNo;
                                                scope.pageSize = data.result.params.pageSize;
                                                scope.totalSize = data.result.params.totalSize;
                                                scope.totalPage = data.result.params.totalPage;
                                                $(element).find('[datasourcecartype]').html('<div class="layout-full" style="width: 100%;height:300px;" i-scroll2 data-load-event="nextPage()"><div class="carTemplate"></div></div>');
                                                $.each(data.result.rows, function(i, o) {
                                                    $(element).find('.carTemplate').append('<div class="info-row"><div class="info-left" style="width:105px;">'+ o.operatorname + '</div><div class="info-left" style="width:130px;">'+ o.carnumber + '</div><div class="info-left">'+ o.logtime + '</div></div></div>');
                                                });
                                                $compile($(element).find('[datasourcecartype]'))(scope);
                                            }
                                        }
                                    })
                            };

                            function loadTemplateHtml(data) {
                                if (attrs['scrolltoggle'] == 'NO') {
                                    data = data.replace(/i-scroll=""/, '');
                                }

                                var el = $compile(data)(scope);
                                element.html(el);

                                if (attrs['edittype'] == 'edit') {
                                    var aEditable = $(element).find('[editable]');
                                    _.each(aEditable, function (edit) {
                                        $(edit).html('<input type="text" style="font-size:' + ($(edit).outerHeight() / 2) + 'px;height:' + ($(edit).outerHeight()) + 'px;line-height:' + ($(edit).outerHeight()) + 'px;width:100%;" value="' + $(edit).html() + '" />');
                                    });

                                    var aDatasource = $(element).find('[datasource]');
                                    _.each(aDatasource, function (source) {
                                        source = $(source);

                                        // 为每个数据项添加配置提示
                                        source.addClass('datasource');
                                        source.on('click', function (e) {
                                            if (scope.dsClick) {
                                                scope.dsClick(e, this);
                                            }
                                        });
                                    });
                                }

                                if (data.indexOf('datasourcetype') >= 0) {
                                    getInfocardSpcail();
                                } else if(data.indexOf('datasourcecartype') >= 0){
                                    scope.getCarInfoCardListInfo();
                                } else {
                                    loadDataSource();
                                }

                                //若指令属性含有 loadds属性 则加载数据源
                                /*if(element.attr('loadds') !== undefined) {
                                 loadDataSource();
                                 }*/
                            }

                            function getInfocardSpcail() {
                                iAjax
                                    .post('/security/infocard.do?action=getInfocardSpecailDataList')
                                    .then(function (data) {
                                        if (data.result && data.result.rows) {

                                            var sourceEl;
                                            _.each(data.result.rows, function (item) {
                                                sourceEl = element.find('[ds-item-id=database_' + item.id + '在押]');
                                                if (item.count) {
                                                    _.each(sourceEl, function (el) {
                                                        el = $(el);
                                                        el.text(item.count);
                                                    });
                                                }
                                            });
                                            $compile(element.contents())(scope)

                                        }
                                    })
                            }

                            function loadDataSource() {
                                var str = element.find('[ds-ou]').text();
                                var aSelect = element.find('[ds-item-id]');
                                var list = [];
                                if(aSelect.length) {
                                    _.each(aSelect, function(item) {
                                        list.push(item.getAttribute('ds-item-id'));
                                    });
                                }
                                if (str.length) {
                                    var syoufks = str.split('|'),
                                        time = scope.time ? scope.time.split(' ')[0] : '';

                                    _getInfocardDataList(syoufks, list, time, function (list) {
                                        _fillData(list);
                                    });
                                }
                            }

                            function _fillData(list) {
                                var sourceEl;
                                _.each(list, function (item) {
                                    sourceEl = element.find('[ds-item-id=' + item.sid + ']');
                                    if (item.value) {

                                        _.each(sourceEl, function (el) {
                                            el = $(el);

                                            if (typeof(item.value) == 'string') {
                                                if (item.type) {
                                                    if (item.type == 'position') {
                                                        if (item.name == '实到' && item.syrole == '1') {
                                                            el.attr('ng-click', 'showPosition(\'1\')');
                                                        } else if (item.name == '未到' && item.syrole == '1') {
                                                            el.attr('ng-click', 'showPosition(\'0\')');
                                                        }
                                                        el.text(item.value);
                                                    } else { // 当信息牌信息返回数据为字符串时，能够正确显示，于2017-7-5修改，by hj
                                                        el.text(item.value);
                                                    }
                                                } else {
                                                    el.text(item.value);
                                                }
                                            } else {
                                                el.html('');
                                                //item.value = _.sortBy(item.value, 'coding');
                                                _.each(item.value, function (v) {
                                                    if (v.type == 'police') {
                                                        if(scope.infocardClick == '1') {
                                                            el.append('<button class="info-items" title="' + (v.name) + '">' + (v.name) + '</button>');
                                                        } else {
                                                            el.append('<button class="info-items" ng-click="showPolice({coding:\'' + (v.coding) + '\'})"  coding="' + (v.coding) + '" title="' + (v.name) + '" ng-mouseover="mouseover($event);" ng-mouseout="mouseleave()" ng-class="{\'value-completion\':' + v.name.length + '==\'2\'}" >' + (v.name) + '</button>');
                                                        }
                                                    } else if (v.type == 'criminal') {
                                                        el.append('<button class="info-items" ng-click="showCriminal({bm:\'' + (v.bm) + '\', check:\'' + (v.check) + '\'})" title="' + (v.name) + '">' + (v.name) + '</button>');
                                                    } else {
                                                        el.append('<button class="info-items" title="' + (v.name) + '">' + (v.name) + '</button>');
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                                $compile(element.contents())(scope)
                            }

                            function _getInfocardDataList(syoufks, list, cretime, callback) {
                                var url = 'security/infocard.do?action=getImproveInfocardDataList',
                                    data = {
                                        filter: {
                                            syoufk: syoufks,
                                            sid: list,
                                            cretime: cretime
                                        }
                                    };

                                iAjax
                                    .post(url, data)
                                    .then(function (data) {
                                        if (data && data.result && data.result.rows && callback) {
                                            callback(data.result.rows);
                                        }
                                    });
                            }


                            function getSycodeInfocardMapClick() {
                                var data = {
                                    filter: {
                                        type: 'infocardmapclick'
                                    }
                                };
                                iAjax
                                    .post('security/common/monitor.do?action=getSycodeDetail', data)
                                    .then(function(data) {
                                        if(data.result && data.result.rows) {
                                            scope.infocardClick = data.result.rows;
                                        }
                                    })

                            }
                        }
                    }
                }
            }
        }
    ]);
});