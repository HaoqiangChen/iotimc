/**
 * 注入safe主框架，改变布局，显示大数据中心模式。
 *
 * Created by zhs on 2018-03-09.
 */
define([
    'app',
    'safe/js/services/safeMainTitle',
    'safe/plugins/bid/js/directives/layout/safeBidCountup',
    'safe/plugins/bid/js/directives/layout/safeBidUserContent',
    'safe/plugins/bid/js/directives/layout/safeBidLoading',
    'safe/plugins/bid/js/directives/layout/safeBidBackground',
    'safe/plugins/bid/js/directives/layout/safeBidMenu',
    'safe/plugins/bid/js/directives/map/safeBidMap',
    'safe/plugins/bid/js/directives/chart/safeBidChart',
    'css!safe/plugins/bid/css/microtip'
], function(app) {
    app.factory('safeBidLayout', ['iAjax', 'iTimeNow', '$compile', '$rootScope', '$interval', '$timeout', '$state', 'safeMainTitle', 'yjtService', function(iAjax, iTimeNow, $compile, $rootScope, $interval, $timeout, $state, safeMainTitle, yjtService) {

        function _init($scope) {
            var init = false;

            /**
             * progress 加载进度，并行处理
             *
             * 0%       初始化
             * 20%      safeMainControllerOnEvent
             * 40%      defaultStateChangeSuccess
             * 60%      loadingAnimationSucccess
             * 80%      mapLoadingSuccess
             * 100%     chartsLoadingSuccess
             */
            $scope.layoutService = {
                progress: 0,
                time: iTimeNow,
                chart: {
                    type: '',
                    name: ''
                },
                search: {
                    value: '',
                    submit: function(e) {
                        if(e.keyCode == 13) {
                            $rootScope.$broadcast('globalSearchEvent', $scope.layoutService.search.value || '');
                            $scope.layoutService.search.value = '';
                        }
                    }
                },
                mainTitle: safeMainTitle,
                modules: {
                    target: null,
                    animationTime: 500,
                    status: 0,            // 0->关闭；1->打开；2->正在关闭（动画中）
                    open: function(url, params, title, action) {
                        if(url) {
                            try {
                                $.soa.getPath('iiw.' + url);

                                if(this.target) {
                                    $timeout.cancel(this.target);
                                    this.target = null;
                                }

                                if(title) {
                                    $scope.maintitle.title = title;
                                }

                                var animationTime = 0;

                                if(this.status == 0) {
                                    $('.safe-zjsjds-index-body-modlues').removeClass('animationShow animationHide').addClass('animationShow');
                                    animationTime = this.animationTime;
                                }

                                var _this = this;

                                if($state.current.name != url) {
                                    $('.safe-bid-view-loading').show();
                                    $('.safe-bid-view').hide();
                                }

                                this.target = $timeout(function() {
                                    if(!params) {
                                        params = {data: null};
                                    }

                                    if($state.current.name != url) {
                                        $state.params = params;
                                        $state.go(url, params);
                                    }

                                    _this.status = 1;
                                    _this.target = null;

                                }, animationTime);
                            } catch (e) {
                                if(url.indexOf('security=1') == -1) {
                                    $('.safe-main-exterior-window').find('iframe').attr('src', url);
                                } else {
                                    $('.safe-main-exterior-window').find('iframe').attr('src', iAjax.formatFrameURL(url));
                                }
                                $('.safe-main-exterior-window').find('iframe').attr('src', url);
                                $('.safe-main-exterior-window').show('fade');
                            }
                        } else if(action) {
                            $scope.$eval(action);
                        }
                    },
                    close: function() {
                        if(this.target) {
                            $timeout.cancel(this.target);
                            this.target = null;
                        }
                        this.status = 2;
                        $('.safe-bid-index').removeClass('loadingAnimation').addClass('hideAnimation');
                        $('.safe-bid-index-body-modlues').removeClass('animationShow animationHide').addClass('animationHide');

                        var _this = this;
                        this.target = $timeout(function() {
                            $('.safe-bid-index-body').removeClass('animationShow');
                            $('.safe-bid-index-body-modlues').removeClass('animationShow');
                            $state.params = {data: null};
                            $state.go('safe.datavisual.bid', $state.params);

                            _this.status = 1;
                            _this.target = null;
                        }, this.animationTime - 50);

                        $scope.layoutService.supertitle = '';
                        $scope.sendMessage('safe.bid.layout.modules.close');
                    }
                },
                map: null,
                mapName: '',
                visibleMap: false,
                returnMap: false,
                showMap: function() {
                    $scope.layoutService.visibleMap = true;
                },
                hideMap: function() {
                    $scope.layoutService.visibleMap = false;
                },
                goChinaMap: function() {
                    $scope.sendMessage('safe.bid.map.showChina');
                },
                showNavigation: function() {
                    if($state.current.name != 'safe.datavisual.bid') {
						if($scope.menuList) {
							$.each($scope.menuList, function(i, o) {
								if(i == 0) {
									o.isActived = true;
								} else {
									o.isActived = false;
								}
							});
						}
                        $state.go('safe.datavisual.bid');
                        $scope.isHomePage = true;
                    }
                    $scope.sendMessage('safe.bid.show.homePage');
                    $('.safe-bid-index').removeClass('loadingAnimation').addClass('hideAnimation');
                    $('.safe-bid-index-body').removeClass('animationShow').addClass('animationHide');
                    $('.safe-bid-index-body-modlues').removeClass('animationShow').addClass('animationHide');
                    $timeout(function() {
                        $scope.sendMessage('safe.bid.loading.b.success');
                    }, 1000);
                },
                maps: [],
                mapIndex: '0',
                themes: [],
                themeIndex: '0',
                themeID: '',
                switchTheme: function(id) {
                    $scope.layoutService.themeID = id;
                    $scope.sendMessage('safe.bid.theme.select');
                }
            };

            $('.safe-main-box').hide();
            $('.safe-main-box').after(iAjax.getTemplate('iiw.safe.plugins.bid', '/view/index.html'));

            $('.safe-main-menubar').remove();
            $('.safe-main-mask').remove();

            $scope.$on('safe.bid.loading.value', function(e, value) {
                $scope.layoutService.progress += value;
            });

            $scope.$on('safeMainControllerOnEvent', function() {
                $compile($('.safe-bid-box'))($scope);
            });

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
                if(fromState.name.startsWith('safe.bigdata') && toState.name.startsWith('safe.bigdata'))return;
            });

            $scope.$on('$stateChangeSuccess', function() {
                if(init) {
                    $('.safe-bid-view-loading').stop(true).fadeOut(1000);
                    $('.safe-bid-view').stop(true).fadeIn(1000);
                } else {
                    $timeout(function() {
                        $('.safe-bid-view').append($('.safe-view').parent());
                        $('.safe-main-box').html('');

                        if($state.current.name != 'safe.datavisual' && $state.current.name != 'safe.datavisual.bid') {
                            $scope.layoutService.modules.open($state.current.name);
                        }
                        init = true;
                    }, 1000);
                }
            });

            $scope.$on('$stateChangeError', function() {
                console.log('iiw.datavisual.bid: $stateChangeError');
            });

            $scope.$on('safe.bid.chart.setvalue', function(e, data) {
                $scope.layoutService.chart.type = data.type;
                $scope.layoutService.chart.name = data.name;
            });

            $scope.$on('iiw.safe.bid.show.next.theme', function() {
                var currentThemeIndex;
                var currentTheme = _.findWhere($scope.layoutService.themes, {id: $scope.layoutService.themeID});
                var themes = _.filter($scope.layoutService.themes, {themetype: currentTheme.themetype});
                for(var i = 0; i < themes.length; i++) {
                    if(themes[i].id == $scope.layoutService.themeID) {
                        currentThemeIndex = i;
                    }
                }

                if(currentThemeIndex == themes.length - 1) {
                    currentThemeIndex = 0;
                } else {
                    currentThemeIndex++;
                }

                $scope.$emit('iiw.safe.bid.auto.start');
            });

            $scope.isHomePage = true;
            $scope.showCxfzryDetails = false;
            $scope.goToModule = function(row) {
                if(row.url == 'safe.datavisual.bid') {
                    /*$('.safe-bid-index-body').append('<div class="safe-bid-index-body-charts" safe-bid-chart></div>');
                    require(['safe/plugins/bid/js/directives/chart/safeBidChart'], function() {
                        $compile($('.safe-bid-index-body-charts').contents())($scope);
                    }, function() {
                        $compile($('.safe-bid-index-body-charts').contents())($scope);
                    });*/
                    if($state.current.name != row.url) {
                        $scope.sendMessage('safe.bid.chart.show');
                        $scope.isHomePage = true;
                    }
                } else {
                    /*$('.safe-bid-index-body-charts').remove();*/
                    $scope.isHomePage = false;
                    $scope.sendMessage('safe.bid.show.homePage');
                }
                $.each($scope.menuList, function(i, o) {
                    o.isActived = false;
                });
                row.isActived = true;
                $state.go(row.url);
            };

            $scope.closeDetailsPage = function() {
                $('.safe-plugins-bid-cxfzry-detail-container').removeClass('showAnimation').addClass('hideAnimation');
                $scope.showCxfzryDetails = false;
            };

            $scope.$on('safe.bid.province.showDetails', function(e, data) {
                $('.safe-plugins-bid-cxfzry-detail-container').removeClass('hideAnimation').addClass('showAnimation');
                $scope.pageFilter.filter = data.parameter;
                $scope.pageInfo = {
                    pageNo: 1,
                    pageSize: 25,
                    totalPage: 1,
                    totalSize: 0
                };
                $scope.searchText = '';
                getList();
            });

            $scope.pageInfo = {
                pageNo: 1,
                pageSize: 25,
                totalPage: 1,
                totalSize: 0
            };

            $scope.pageFilter = {
                filter: {},
                params: {
                    pageNo: $scope.pageInfo.pageNo,
                    pageSize: $scope.pageInfo.pageSize
                }
            };
            $scope.detailList = [];
            $scope.keyPressEvent = function(event) {
                if(event.keyCode == 13) {
                    getList();
                }
            };

            function getList() {
                $scope.loading = true;
                var url = 'security/recidivism/recidivism.do?action=getGscxfzlTimeDetail';
                var params = $scope.pageFilter;
                params.filter.searchText = $scope.searchText;
                params.filter.type = _.isArray(params.filter.type) ? params.filter.type : [params.filter.type];
                iAjax.post(url, params).then(function(data) {
                    if(data.result && data.result.rows.length > 0) {
                        $scope.detailList = data.result.rows;
                    } else {
                        $scope.detailList = [];
                    }
                    $scope.pageInfo.totalSize = data.result.params.totalSize;
                    $scope.pageInfo.totalPage = data.result.params.totalPage;
                    $scope.pageFilter.pageNo = data.result.params.pageNo;
                    $scope.loading = false;
                }, function() {
                    $scope.loading = false;
                });
            }

            $scope.goPgaeNo = function() {
                $scope.pageFilter.params.pageNo = this.pageInfo.pageNo;
                getList();
            };

            $scope.showCriminalFile = function(row) {
                yjtService.show('criminal', row.sfzh, row.type, row);
            };

            $scope.searchPerson = function() {
                getList();
            };

            $scope.$on('safe.bid.go.homepage', function(e, data) {
                if(data && data.params && data.params.type == 'JIANYU') {
                    $scope.menuList = [
                        {name: '查询统计', icon: 'fa-line-chart', url: 'safe.dataanalysis', isActived: true}
                    ];
                    $scope.goToModule($scope.menuList[0]);
                } else {
                    $scope.menuList = [
                        {name: '综合概况', icon: 'fa-table', url: 'safe.aggregation', isActived: true},
                        {name: '数据比对', icon: 'fa-database', url: 'safe.calculate', isActived: false},
                        {name: '一人一档', icon: 'fa-user', url: 'safe.archives', isActived: false},
                        {name: '查询统计', icon: 'fa-line-chart', url: 'safe.dataanalysis', isActived: false},
                        {name: '分析展示', icon: 'fa-map', url: 'safe.datavisual.bid', isActived: true}
                    ];
                    $scope.goToModule($scope.menuList[0]);
                }
            });

            _getModule.layoutService = $scope.layoutService;
        }

        function _getModule() {
            return _getModule.layoutService;
        }

        return {
            init: _init,
            getModule: _getModule
        }
    }]);
});