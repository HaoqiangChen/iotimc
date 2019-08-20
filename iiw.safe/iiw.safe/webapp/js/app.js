/**
 * Created by YJJ on 2015-10-21.
 */
define([
    'app',
    'moment',
    'safe/lib/zrender/2.1.0/zrender',
    'safe/lib/echarts/2.2.7/echarts-all',
    'safe/lib/datetimepicker/jquery.datetimepicker.full',
    'safe/lib/jquery-ripple/1.7.1/jquery.ripple',
    'safe/lib/jquery-viewer/0.5.0/viewer.min',
    'safe/js/directives/safeMainMenuTouch',
    'safe/js/directives/safeMainMenuToggle',
    'safe/js/directives/safeMainMenuScroll',
    'safe/js/directives/safeMainSearch',
    'safe/js/directives/safeMainNews',
    'safe/js/directives/safeMainTips',
    'safe/js/directives/safeMainCheckReport',
    'safe/js/directives/safePicker',
    'safe/js/directives/safeSwitch',
    'safe/js/directives/safeUserPassword',
    'safe/js/directives/safeDoorControl',
    'safe/js/directives/safeTree',
    'safe/js/directives/safeNoticePanel',
    'safe/js/directives/safeReplyTimeFile',
    'safe/js/directives/safeOpenIe',
    'safe/js/directives/safeViewerDirective',
    'safe/js/services/safeVideoPlugin',
    'safe/js/services/safeSocket',
    'safe/js/services/safeMainTitle',
    'safe/js/services/safeCamera',
    'safe/js/services/safeMapSelect',
    'safe/js/services/safeSound',
    'safe/js/services/safeAlarmmask',
    'safe/js/services/safeGlobalSearch',
    'safe/js/services/safeHardware',
    'safe/js/services/safePlugins',
    'safe/js/services/safeConfigService',
    'safe/js/services/safeDesService',
	'safe/js/services/safeImcsPlayer',
    //'safe/js/services/safeDatacenterData',
    'safe/js/filters/safeMainSafeFormat',
    'safe/js/filters/safeTimeSecondFormat',
    'cssloader!safe/lib/datetimepicker/jquery.datetimepicker',
    'cssloader!safe/css/bootstrap.superhero.min',
    'cssloader!safe/lib/font-awesome-animation/0.0.7/font-awesome-animation.min',
    'cssloader!safe/lib/jquery-ripple/1.7.1/jquery.ripple',
    'cssloader!safe/lib/jquery-viewer/0.5.0/viewer.min',
    'cssloader!safe/css/font/safeIcon/safeIcon',
    'cssloader!safe/css/input',
    'cssloader!safe/css/index',
    'cssloader!safe/css/camera',
    'cssloader!safe/css/mapselect'
], function(app) {
    app.controller('safeMainController', ['$compile', '$controller', '$scope', '$rootScope', '$state', '$filter', '$timeout', 'iTimeNow', 'iGetLang', 'iAjax', 'iMessage', 'safeMainTitle', 'safeSocket', 'safeSound', 'safeAlarmmask', 'safeGlobalSearch', 'safePlugins', function($compile, $controller, $scope, $rootScope, $state, $filter, $timeout, iTimeNow, iGetLang, iAjax, iMessage, safeMainTitle, safeSocket, safeSound, safeAlarmmask, safeGlobalSearch, safePlugins) {
        $.datetimepicker.setLocale('zh');
        //document.title = '物联网安全管控指挥平台';

        iAjax.post('sys/web/config.do?action=getConfig', {}).then(function(data) {
            if(data && data.result && data.result.rows) {
                var titleObject = _.findWhere(data.result.rows, { 'key': 'title' });
                var subTitleObject = _.findWhere(data.result.rows, { 'key': 'subtitle' });
                var title = '';
                if(titleObject && titleObject.content) {
                    title = titleObject.content;
                }

                if(subTitleObject && subTitleObject.content) {
                    title += subTitleObject.content;
                }

                document.title = title;
            }
        });

        safeSocket.init();
        safePlugins.init($scope);

        $scope.time = iTimeNow;
        $scope.maintitle = safeMainTitle;

        $scope.globalSearch = {
            value: ''
        };
        safeGlobalSearch.set($scope.globalSearch);

        $scope.globalSearchHistoryList = [];
        //$scope.dataService = safeDatacenterData.create($scope);

        $scope.safe = {
            child: [],
            getData: function(id) {
                this.score = 0;
                this.childid = id;
                var that = this;
                iAjax.post('sys/common/starget.do?action=statistics', {
                    id: id
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        that.ouname = data.result.ouname;
                        that.child = data.result.rows;

                        that.score = $filter('safeMainSafeFormat')(that, 'value');
                        that.type = $filter('safeMainSafeFormat')(that, 'type');

                        $scope.$broadcast('safeMainUpdateReportEvent');
                    }
                });
            },
            goMainReport: function(e) {
                $scope.safe.getData();
                e.cancelBubble = true;
                e.stopPropagation();
            },
            animationScore: function() {
                var mchar = $('.safe-main-check-report-mark').data('char'),
                    lchar = $('.safe-main-check-report-line').data('char');

                if(mchar && lchar && this.child.length) {
                    if(this.target) $timeout.cancel(this.target);

                    var child = this.child,
                        moption = mchar._option,
                        loption = lchar._option,
                        scores = [],
                        min = 100,
                        max = 0;

                    $.each(this.child, function() {
                        scores.push(0);
                    });
                    loption.yAxis[0].max = 100;
                    loption.yAxis[0].min = 0;
                    loption.series[0].data = scores;
                    loption.animationDurationUpdate = 500;
                    lchar.setOption(loption, true);

                    moption.series[0].data[0].value = 0;
                    moption.animationDurationUpdate = 500;
                    mchar.setOption(moption, true);

                    var index = 0,
                        value = 0,
                        step,
                        that = this;

                    this.target = $timeout(animationRun, 500);
                    function animationRun() {
                        try {
                            if(index < child.length) {
                                var item = child[index];
                                step = 1000 * 100 / 100 / item.score;
                                if(item.score && value <= item.score) {
                                    $scope.safe.checking = '正在检查：' + item.name + '情况' + getPoint();
                                    $scope.safe.checktype = 'C';

                                    scores[index] = value++;

                                    loption.animationDurationUpdate = step;
                                    loption.series[0].data = scores;
                                    lchar.setOption(loption, true);

                                    moption.series[0].data[0].value = parseInt(_.reduce(scores, function(a, b) {
                                            return a + b;
                                        }, 0) / scores.length);
                                    moption.animationDurationUpdate = step;
                                    mchar.setOption(moption, true);

                                    that.target = $timeout(animationRun, step);
                                } else {
                                    value = 0;
                                    index++;

                                    that.target = $timeout(animationRun, step);
                                }
                            } else {
                                max = _.max(scores);
                                min = _.min(scores);
                                if(min > 60) {
                                    min = 60;
                                } else if(min > 1) {
                                    min--;
                                }
                                loption.yAxis[0].max = max;
                                loption.yAxis[0].min = min;
                                loption.animationDurationUpdate = 1000;
                                lchar.setOption(loption, true);

                                $scope.safe.checking = '安全指标检查完成！';
                                $scope.safe.checktype = '';
                            }
                        } catch(e) {
                            $scope.safe.checking = '';
                        }
                    }

                    var pointindex = 0,
                        pointstep = 4;

                    function getPoint() {
                        var result = '';
                        if(--pointstep == 0) {
                            if(++pointindex > 15) pointindex = 1;
                            pointstep = 4;
                        }
                        for(var i = 0; i < pointindex; i++) {
                            result += '.';
                        }
                        return result;
                    }
                }
            }
        };
        $scope.safe.getData();

        $scope.tips = {
            alarm: 0,
            message: 0,
            getData: function() {
                this.getAlarm();
                this.getMessage();
            },
            getAlarm: function() {
                iAjax.post('sys/common/alert.do?action=getAlertCount', {}).then(function(data) {
                    $scope.tips.alarm = data.result.count;
                });
            },
            getMessage: function() {
                iAjax.post('sys/common/todo.do?action=getTodoCount', {}).then(function(data) {
                    $scope.tips.message = data.result.count;
                });
            }
        };
        $scope.tips.getData();

        $scope.daywork = {
            now: {},
            list: [],
            getData: function() {
                var that = this;
                iAjax.post('sys/common/timeline.do?action=getDateTimeLine', {}).then(function(data) {
                    if(data.result && data.result.rows) {
                        that.list = data.result.rows;
                        that.now = _.findWhere(that.list, {exemode: '1'});
                        if(that.now) {
                            $scope.news = '日常事务执行：' + that.now.content;
                        }
                    }
                });
            },
            doWork: function(item) {
                // if(item.status == 'D') {
                //     iAjax.post('sys/common/timeline.do?action=executeTimeLine', {
                //         id: item.id
                //     });
                // }

                // yjj 2016-07-21 修改为无论什么状态下都可以重复执行。
                iAjax.post('sys/common/timeline.do?action=executeTimeLine', {
                    id: item.id
                });
            }
        };
        $scope.daywork.getData();

        // yjj于2016-07-05 迁移到safe.hardware的init中。
        // $scope.talk.init();

        $scope.menulist = [];
        $scope.menuWidth = {};
        iAjax.post('sys/web/symenu.do?action=getUserMenu', {type: 'fun'}).then(function(data) {
            $scope.menulist = data.result.rows;
            $scope.menuWidth = {
                width: $scope.menulist.length * 200 + 'px'
            };
        });

        $scope.goModule = function(menu) {
            if(menu && menu.active) {
                if(menu.url) {
                    try {
                        $.soa.getPath('iiw.' + menu.url);

                        var params = {data: null};
                        $state.params = params;
                        $state.go(menu.url, params);

                        $('.safe-main-menubar').animate({
                            top: -$('.safe-main-menubar').height()
                        }, 300, function() {
                            $scope.$broadcast('safeMainMenuHideEvent');
                        });
                        $('.safe-main-mask').css('opacity', 1).fadeOut(300);
                    } catch(e) {
                        if(menu.url.indexOf('security=1') == -1) {
                            $('.safe-main-exterior-window').find('iframe').attr('src', menu.url);
                        } else {
                            $('.safe-main-exterior-window').find('iframe').attr('src', iAjax.formatFrameURL(menu.url));
                        }

                        $('.safe-main-exterior-window').show('fade');
                    }
                } else if(menu.action) {
                    $scope.$eval(menu.action);
                }
            }
        };

        $scope.goAlarm = function(data) {
            var params = {data: data || null};
            $state.params = params;

            // var backlogrole = _.where($scope.menulist,{url: 'safe.backlog'});
            // if(backlogrole.length>0){
            //     $state.go('safe.backlog', params);
            // }else{
            //     $state.go('safe.alarm', params);
            // }
            iAjax.post('sys/web/sycode.do?action=getSycode', {filter: {filter:'TODONUM'}}).then(function(data) {
                if(data && data.result.rows) {
                    if(data.result.rows.length == 0 || (data.result.rows.length > 0 && data.result.rows[0].content == '0')){
                        $state.go('safe.alarm', params);
                    }else{
                        $state.go('safe.backlog', params);
                    }
                }
            });
        };

        $scope.getAffairsTipsType = function(){
            var defer = $.Deferred();
            var postData = {
                filter: {
                    type: "TIMELINESET"      //类型
                }
            };
            iAjax.post('security/infomanager/counter.do?action=getSycodeContent', postData)
                .then(function (data) {
                    defer.resolve(data);
                });

            return defer;
        };

        $scope.goDeviceStat = function() {
            if($state.current.url == '/report') {
                $state.params = {data: {type: 'operation'}};
                $state.go("safe.report.operation", $state.params);
            } else if($state.current.url == '/operation') {
                $state.params = {data: {type: 'operation'}};
                $state.go("safe.report", $state.params, {location: true, reload: true});
            } else {
                $state.params = {data: {type: 'operation'}};
                $state.go("safe.report", $state.params);
            }
        };

        $scope.goDoorApply = function(data) {
            var params = {data: data || null};
            $state.params = params;
            $state.go('safe.door', params);
        };

        $scope.hideExteriorWindow = function() {

            $('.safe-main-exterior-window').hide('fade');
            $scope.$broadcast('closeFrameWindow');
            if($scope.hideExteriorWindow && $scope.hideExteriorWindow.menu && $scope.hideExteriorWindow.menu == 'menu') {
                $scope.hideExteriorWindow.menu = null;
                $('.safe-datacenter-index-content .b-main-menu').click();
            }
        };

        $scope.$on('safe.datacenter.plugins.b.goZGFW', function(e, data) {
            $scope.hideExteriorWindow.menu = data;
        });

        $scope.refresh = function() {
            location.reload(true);
        };

        $scope.home = function() {
            if($scope.homePath) {
                checkCurrentUrl();
            } else {
                iAjax.post('sys/web/syrole.do?action=getHomePage', {}).then(function(data) {
                    if(data.result && data.result.url) {
                        $scope.homePath = data.result.url;
                        checkCurrentUrl();
                    }
                })
            }

            // 检查当前路径
            function checkCurrentUrl() {
                if($state.current.name === 'safe.insidemap'){
                    location.reload(true);
                }else {
                    $state.go($scope.homePath,{data: null});
                }
            }
        };

        // yjj于2016-06-17 迁移到safe.alarm的init中。
        // $scope.$on('ws.alarmHandle', function(e, data) { });

        // yjj于2016-08-10屏蔽，由zcl迁移到safe.door的init中。
        // $scope.$on('ws.openDoorApp', function(e, data) { });

        $scope.$on('ws.updateToDo', function() {
            $scope.tips.getMessage();
        });

        $scope.$on('ws.exeTimelineBefore', function(e, data) {
            $scope.news = data.content;

            safeSound.playMessage(data.content);
        });

        $scope.$on('ws.exeTimeline', function(e, data) {
            var defer = $.Deferred();
            $scope.news = data.content;
            $scope.getAffairsTipsType()
                .then(function (AffairsData) {
                    if(AffairsData.result.rows[0].content == '1'){
                        safeSound.playMessage(data.content);
                    }
                })

            $scope.daywork.getData();
            return defer;
        });

        $scope.$on('ws.exeDeviceTrigger', function(e, data) {
            safeSound.playMessage(data.content);
        });

        $scope.$on('ws.stargetUpdate', function() {
            $scope.safe.getData();
            $scope.tips.getData();
        });

        $scope.$on('ws.inandout', function (e, data) {
            console.log('进出监websocket监听');
            console.log(data);
            safeSound.playMessage(data.content);
            iMessage.show({
                level: 2,
                title: '进出监登记',
                content: data.content
            });
        });

        $scope.$on('safeMainMenuShowEvent', function() {
            var $e = $('.safe-main-workline-panel'),
                o = $e.data('i-scroll');

            if(o && $e.find('.type-r').size()) {
                o.scrollTo(0, -$e.find('.type-r').position().top, 1000);
            }
        });

        // 监听退出按钮事件，需在exit.js上广播事件，窗口显示(show = ture)，窗口隐藏(show = false)
        $scope.$on('exitEvent', function(e, data) {
            if(data,hasOwnProperty('show')) {
                if (data.show) {
                    $scope.$broadcast('safeMainMenuShowEvent');
                } else {
                    $scope.$broadcast('safeMainMenuHideEvent');
                }
            }
        });

        //iAjax.post('sys/web/syrole.do?action=getHomePage', {}).then(function(data) {
        //    if(data.result) {
        //        console.log('defURL' , data.result.url);
        //        if(data.result.url && data.result.url.indexOf('http://') == -1) {
        //            $state.go(data.result.url);
        //        } else {
        //            location = data.result.url;
        //        }
        //    }
        //});

        $scope.test = function() {
            // safeSound.playAlarm('2 0 1监舍紧急按钮报警！');
            // safeSound.playAlarm2($.soa.getWebPath('iiw.safe') + '/music/alarm_2.mp3', 750, '2 0 1监舍紧急按钮报警！');
            // safeSound.playAlarm2($.soa.getWebPath('iiw.safe') + '/music/alarm_3.mp3', 500, '2 0 1监舍紧急按钮报警！');
        };

        $scope.getAffairsTipsType();
        $('body').keydown(function(e) {
            //shift + t
            if(e.shiftKey && e.keyCode == '84') {
                iAjax.post('sys/common/timeline.do?action=createTimeLine').then(function() {
                    safeSound.playText('事务时间轴已刷新');
                    $scope.daywork.getData();
                });
            }

            if(e.keyCode == '32') {
                $scope.$broadcast('safeMainKeydownSpaceEvent');
            }
        });

        $('body').keyup(function(e) {
            if(e.keyCode == '32') {
                $scope.$broadcast('safeMainKeyupSpaceEvent');
            }
        });
    }]);
});
