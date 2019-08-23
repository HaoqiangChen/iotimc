define([
    'app',
    'cssloader!safe/plugins/bid/css/chart'
], function(app) {
    app.directive('safeBidChart', ['$compile', '$timeout', 'safeBidData', 'safeGlobalSearch', function($compile, $timeout, safeBidData, safeGlobalSearch) {
        var _defaultPadding = [90, 0, 0, 0];

        var _html = [];
        _html.push('<div class="safe-bid-index-body-charts">');
        _html.push('<div class="safe-bid-index-body-charts-panel"></div>');
        _html.push('</div>');

        return {
            restrict: 'A',
            template: _html.join(''),
            replace: true,
            scope: true,
            link: function($scope, $element) {
                var _padding = _defaultPadding;

                var _element = $element.find('.safe-bid-index-body-charts-panel'),
                    child_scope,
                    lastThemeID,
                    switchTarget;

                function init() {
                    $scope.dataService.getTheme().then(function(data) {
                        if(data.rows && data.rows.length) {
                            formatThemeParams(data.rows);
                            $scope.layoutService.themes = data.rows;
                        }
                        success();
                    }, success);

                    function success() {
                        $scope.sendMessage('safe.bid.loading.value', 20);
                    }
                }

                function switchOu(mapID) {
                    $scope.dataService.setQuery('mapid', mapID);
                    $scope.dataService.getTheme().then(function(data) {
                        if(data.rows && data.rows.length) {
                            formatThemeParams(data.rows);
                            $scope.layoutService.themes = data.rows;
                            if(lastThemeID) {
                                var theme = _.findWhere($scope.layoutService.themes, {id: lastThemeID});
                                if(theme) {
                                    show(theme.id);
                                } else {
                                    show(getThemeFirstID());
                                }
                            } else {
                                show(getThemeFirstID());
                            }
                        }
                    });
                }

                $scope.switchTheme = function() {
                    close();
                    if(switchTarget) {
                        $timeout.cancel(switchTarget);
                    }
                    switchTarget = $timeout(function() {
                        show($scope.layoutService.themeID);
                    }, 1000);
                };

                function show(id) {
                    if(id) {
                        $scope.layoutService.themeID = id;
                    }
                    var params = _.findWhere($scope.layoutService.themes, {id: id});

                    $.each($scope.layoutService.themes, function(i, row) {
                        row.show = false;
                    });
                    params.show = true;

                    if(child_scope) {
                        child_scope.$destroy();
                    }
                    _element.html('');

                    if(params.background && params.background == 'map') {
                        $scope.layoutService.showMap();
                    } else {
                        $scope.layoutService.hideMap();
                    }

                    //if(params.background && params.background == 'smap') {
                    //    $scope.layoutService.showSuperMap();
                    //} else {
                    //    $scope.layoutService.hideSuperMap();
                    //}

                    child_scope = $scope.$new();

                    var boxW = $(window).width() - _padding[1] - _padding[3],
                        boxH = $(window).height() - _padding[0] - _padding[2],
                        sizeW = Math.ceil(boxW / params.layoutx),
                        sizeH = Math.ceil(boxH / params.layouty);

                    var html = [],
                        jss = [],
                        styles = [],
                        width = 0,
                        left = 0,
                        arrow;
                    $.each(params.graph, function(i, chart) {
                        width = sizeW * chart.vwidth;
                        left = sizeW * chart.cx + _padding[3];

                        styles = [];
                        styles.push('width:' + width + 'px');
                        styles.push('height:' + sizeH * chart.vheight + 'px');
                        styles.push('top:' + (sizeH * chart.cy + _padding[0]) + 'px');
                        styles.push('left:' + left + 'px');

                        if(chart.vwidth == 0 && chart.vheight == 0) {
                            styles.push('display:none');
                        }

                        if(left < 100) {
                            arrow = 'a-left';
                        } else if(left > boxW - width - 100) {
                            arrow = 'a-right';
                        } else {
                            arrow = 'a-center';
                        }

                        jss.push('plugins/igreport/downfile.do?code=' + chart.code + '&action=main.js');

                        // safe-datacenter-chart. 不能一键替换成对应主题的名称简写，否则会导致出现图表不加载问题；
                        html.push('<div class="chart-box ' + arrow + '" style="' + styles.join(';') + '"><' + 'safe-datacenter-chart.' + chart.code + '/></div>');
                    });

                    require(jss, function() {
                        success();
                    }, function() {
                        $timeout(success, 250);
                    });

                    function success() {
                        _element.html(html.join(''));
                        $compile(_element.contents())(child_scope);
                        lastThemeID = params.id;
                        $timeout(function() {
                            _element.find('.chart-box').addClass('show-in');
                            $scope.sendMessage('safe.bid.layout.select.init');
                        }, 250);
                    }
                }

                function close() {
                    _element.find('.chart-box').removeClass('show-in');
                    if(child_scope) {
                        child_scope.$destroy();
                        child_scope = null;
                    }
                }
                
                function formatThemeParams(rows) {
                    $.each(rows, function(i, row) {
                        if(row.expandval) {
                            try {
                                var json = JSON.parse(row.expandval);
                                $.each(json, function(key, object) {
                                    row[key] = object;
                                });
                            } catch(e) {
                                // NOT TO DO
                            }
                        }
                    });
                }

                init();

                $scope.$on('safe.bid.loading.success', function(e, data) {
                    if($scope.layoutService.themes.length) {
                        show((data && data.theme && data.theme.id) ?  data.theme.id : getThemeFirstID());
                    }

                    $scope.sendMessage('safe.bid.layout.select.init');
                });

                $scope.$on('safe.bid.map.load.start', function() {
                    $timeout(close, 150);
                });

                $scope.$on('safe.bid.map.load.end', function(e, mapID) {
                    switchOu(mapID);
                });

                $scope.$on('safe.bid.theme.select', function() {
                    $scope.switchTheme();
                });

                $scope.$on('safe.bid.theme.reload', function(e, data) {
                    $scope.layoutService.themeID = (data && data.theme && data.theme.id) ?  data.theme.id : getThemeFirstID();
                    $scope.switchTheme();
                    safeGlobalSearch.clean();
                });
                
                function getThemeFirstID() {
                    var result = '';

                    if($scope.layoutService.themes.length) {
                        if($scope.layoutService.chart.type) {
                            var rows = _.where($scope.layoutService.themes, { themetype: $scope.layoutService.chart.type });
                            if(rows.length) {
                                result = rows[0].id;
                            }
                        } else {
                            result = $scope.layoutService.themes[0].id;
                        }
                    }

                    return result;
                }

                $scope.goPage = function(row) {
                    $scope.sendMessage('safe.datacollection.page.change', {params: row});
                };
            }
        }
    }]);
});