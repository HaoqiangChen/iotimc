/**
 * 监控视频底层控件类，web采用video标签，c/s采用本地类库，封装统一接口，对上层应用调用透明化。
 *
 * Created by YJJ on 2016-03-04.
 */
define([
    'app'
], function(app) {
    app.factory('safeVideoObject', ['$interval', '$timeout', '$filter', '$compile', function($interval, $timeout, $filter, $compile) {
        var _type = 1;  // 1->web；2->c/s；
        var _imcs;
        var _videoPath = (window.localStorage ? window.localStorage.getItem('safeLocalRecordDownloadPath') || 'D:/IOTIMC/download/' : 'D:/IOTIMC/download/');

        if(window.__IIWHOST) {
            _type = 2;

            var object = requireNW('./lib/imcs/imcs'),
                path = process.execPath + '\\..\\sdk\\',
                res;

            console.log('iiw.safe: sdk Path is ' + path);

            res = object.InitSdk(path);

            if(res == 0) {
                _imcs = object;
            } else {
                console.error('iiw.safe: sdk init sdk error ' + res);
            }
        }

        function _create($scope, $element) {
            if(_type == 1) {
                return createWebObject($scope, $element);
            } else if(_type == 2) {
                return createLocalObject($scope, $element);
            }
        }

        function _getImcs() {
            return _imcs;
        }

        function createWebObject($scope, $element) {
            var html = [];
            html.push('<div class="layout-full video-loading"><div class="layout-full video-loading-table"><div class="video-loading-cell fz-4"><i class="fa fa-spinner fa-pulse"></i><span>加载中……</span></div></div></div>');
            html.push('<video class="layout-full" style="object-fit: fill; display: none;" autoplay="true" muted="true" crossorigin="anonymous"></video>');
            html.push('<canvas class="layout-full"></canvas>');
            $element.append(html.join(''));

            var video = $element.find('video').get(0),
                canvas = $element.find('canvas').get(0),
                loading = $element.find('.video-loading'),
                timeTarget;

            $element.data('data-video', video);

            // 快速回放对象
            video.replyObj = {
                replyPanel: null,
                timeline: null,
                timelineText: null,
                mouseline: null,
                mouselineText: null,

                scope: $scope.$new(),
                now: null,              // 快速回放结束时间对象（moment）
                second: 0,              // 快速回放的时间间隔
                showPanel: function() {
                    if(!$scope.ismax) {
                        video.replyObjreplyPanel.show();
                    } else {
                        $('.safe-video-max-panel .safe-video-max-box').find('.video-object-reply').show();
                    }
                },
                setTimeline: function(percentage) {
                    var w = video.replyObjtimelinePanel.width();

                    if(percentage * w < (w - 100)) {
                        video.replyObjtimelineText.css('left', 10);
                    } else {
                        video.replyObjtimelineText.css('left', -90);
                    }

                    video.replyObjtimeline.css('left', (percentage * 100) + '%');
                },
                setTime: function(time) {
                    video.replyObjtimelineText.text(time);
                },
                hidePanel: function() {
                    if(!$scope.ismax) {
                        video.replyObjreplyPanel.hide();
                    } else {
                        $('.safe-video-max-panel .safe-video-max-box').find('.video-object-reply').hide();
                    }
                    this.setTimeline(0);
                },
                statusCb: function(e, time, start) {
                    if(e && e.data) {
                        var s = e.data.split(',');
                        var now = parseInt(s[3]);
                        this.setTimeline(((now - start) / time));
                        this.setTime($filter('date')(now, 'HH:mm:ss'));
                    }
                }
            };
            video.replyObj.scope.files = [];
            video.replyObj.scope.mouseover = function() {
                video.replyObjtimelinePanel.addClass('focus');
                video.replyObjmouseline.show();
                video.replyObjtimelineText.hide();
            };
            video.replyObj.scope.mouseout = function() {
                video.replyObjtimelinePanel.removeClass('focus');
                video.replyObjmouseline.hide();
                video.replyObjtimelineText.show();
            };
            video.replyObj.scope.mousemove = function(e) {
                var w = video.replyObjtimelinePanel.width(),
                    l = e.offsetX;

                if(l < (w - 100)) {
                    video.replyObjmouselineText.css('left', 10);
                } else {
                    video.replyObjmouselineText.css('left', -90);
                }

                video.replyObjmouseline.css('left', l);
                video.replyObjmouselineText.text($filter('date')(this.starttime + l / w * (this.endtime - this.starttime), 'HH:mm:ss'));
            };
            video.replyObjreplyPanel = $element.find('.video-object-reply');
            video.replyObjtimelinePanel = $element.find('.video-object-reply-timeline');
            video.replyObjtimeline = $element.find('.video-object-reply-timeline-step');
            video.replyObjtimelineText = $element.find('.video-object-reply-timeline-step b');
            video.replyObjmouseline = $element.find('.video-object-reply-timeline-mouseline');
            video.replyObjmouselineText = $element.find('.video-object-reply-timeline-mouseline b');

            video.replyObj.scope.$on('safeVideoPanel.resize', function() {
                var arr = video.replyObj.scope.files.slice(0);
                video.replyObj.scope.files = [];
                $timeout(function() {
                    video.replyObj.scope.files = arr;
                });
            });

            video.replyObjtimelinePanel.append('<div class="video-object-reply-timeline-graduate"><div><div class="safe-reply-time-file" ng-repeat="file in files" safe-reply-time-file></div></div></div>');
            $compile(video.replyObjreplyPanel)(video.replyObj.scope);

            $(video).on('play', function() {
                play();
            });

            $(video).on('abort', function() {
                stop();
            });

            $(video).on('error', function() {
                if($(this).attr('src')) {
                    $timeout(function() {
                        reconn();
                    }, 5000);
                }
            });

            $scope.$watch('isPauseMode', function(value) {
                if(!$scope.setting.viewmode) {
                    if(value) {
                        $(canvas).attr('width', $(canvas).width()).attr('height', $(canvas).height());
                        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, $(canvas).width(), $(canvas).height());

                        $(video).attr('liveSrc', $(video).attr('src'));
                        $(video).attr('src', '');
                    } else {
                        $(video).attr('src', $(video).attr('liveSrc'));
                        $(video).attr('liveSrc', '');
                    }
                }
            });

            $scope.$on('$destroy', function() {
                stop();
            });

            function play() {
                //if(!$scope.setting.keeplast || ($scope.setting.keeplast && $element.find('canvas:hidden').size())) {
                //    $(canvas).stop(true).show('fade');
                //}

                $(canvas).stop(true).hide();
                $(video).stop(true).show();
                video.style.display = 'block';

                timeTarget = $interval(function() {
                    if($(video).attr('type') == 'live') {
                        reconn();
                    }
                }, 5 * 60 * 1000);

                loading.stop(true).hide('fade');
                $element.data('data-play', true);

                $scope.showHideToolBar();
            }

            function stop() {
                $(video).stop(true).hide();
                $(canvas).stop(true).show();

                if(timeTarget) $interval.cancel(timeTarget);
                $element.data('data-play', false);
                $scope.showHideToolBar();
            }

            function reconn() {
                $(video).attr('src', $(video).attr('src'));
            }
        }

        /*
         function createWebCanvasObject($scope, $element) {
         $element.html(createCanvasHTML());

         $scope.setting.el.find('.safe-videos').append('<video autoplay="true" muted="true" class="layout-full"></video>');

         var video = $scope.setting.el.find('.safe-videos video:last').get(0),
         canvas = $element.find('canvas').get(0),
         ctx = canvas.getContext('2d'),
         loading = $element.find('.video-loading'),
         timeTarget,
         timeTarget2;

         $element.data('data-video', video);

         $(video).on('play', function() {
         play();
         });

         $(video).on('abort', function() {
         stop();
         });

         $(video).on('error', function() {
         if($(this).attr('src')) {
         $timeout(function() {
         reconn();
         }, 1000);
         }
         });

         $scope.$on('$destroy', function() {
         stop();
         });

         function play() {
         if(!$scope.setting.keeplast || ($scope.setting.keeplast && $element.find('canvas:hidden').size())) {
         $(canvas).stop(true).show('fade');
         }
         timeTarget = $interval(function() {
         var p = canvas.parentElement,
         w = $(p).width(),
         h = $(p).height();
         $(canvas).attr('width', w).attr('height', h);
         ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, w, h);
         }, 1000 / 30);

         timeTarget2 = $interval(function() {
         reconn();
         }, 5 * 60 * 1000);

         loading.stop(true).hide('fade');
         $element.data('data-play', true);
         $scope.showHideToolBar();
         }

         function stop() {
         if(timeTarget) $interval.cancel(timeTarget);
         if(timeTarget2) $interval.cancel(timeTarget2);
         $element.data('data-play', false);
         $scope.showHideToolBar();
         }

         function reconn() {
         $(video).attr('src', $(video).attr('src'));
         }
         }
         */

        function createLocalObject($scope, $element) {
            $element.append(createCanvasHTML());

            var $newscope = $scope.$new();
            $newscope.video = {
                src: null,
                liveSrc: null,
                muted: true,
                videotaped: false,
                videoreplyed: false,
                setAttribute: function(name, value) {
                    this.watch(name, value, this[name]);
                    this[name] = value;
                },
                getAttribute: function(name) {
                    return this[name];
                },
                watch: function(name, newvalue, oldvalue) {
                    if(newvalue != oldvalue) {
                        switch(name) {
                        case 'src':
                            watchSrc(newvalue);
                            break;
                        case 'muted':
                            watchMuted((newvalue == 'true') ? true : false);
                            break;
                        case 'videotaped':
                            watchVideotaped((newvalue == 'true') ? true : false);
                            break;
                        case 'videoreplyed':
                            watchVideoreplyed((newvalue == 'true') ? true : false);
                            break;
                        }
                    }
                }
            };

            function watchSrc(value) {
                stop();
                if(value) {
                    play(value);
                }
            }

            function watchMuted(value) {
                if(playid) {
                    var res;
                    if(value) {
                        res = _imcs.PlayStreamSound(playid, 0);
                    } else {
                        res = _imcs.PlayStreamSound(playid, 1);
                    }
                    console.log('iiw.safe: ' + ((value) ? 'close' : 'open') + ' sound result code: ' + res);
                }
            }

            function watchVideotaped(value) {
                if(playid) {
                    var res;
                    if(!value) {
                        res = _imcs.StopLocalRecord(playid);

                        hideVideotap();

                        console.log('停止本地录像，回调结果：' + res);
                    } else {
                        var name = video.name,
                            start = new Date().getTime(),
                            sdate = $filter('date')(start, 'yyyyMMdd'),
                            stime = $filter('date')(start, 'HHmmss'),
                            fileName = name + '_' + sdate + stime + '.mp4',
                            pathName = _videoPath + sdate + '/' + fileName;

                        res = _imcs.StartLocalRecord(playid, pathName, 1, 0, null, 1);

                        //手动停止本地录像时，会用作提示
                        video.videotapedPath = fileName;

                        showVideotap();

                        console.log('开始本地录像，回调结果：' + res, '；录像保存地址：' + pathName);
                    }
                }
            }

            function watchVideoreplyed(value) {
                if(!value) {
                    video.replyObj.hidePanel();
                } else {
                    video.replyObj.showPanel();
                }
            }

            $scope.$watch('isPauseMode', function(value) {
                if(!$scope.setting.viewmode) {
                    if(value) {
                        $($newscope.video).attr('liveSrc', $($newscope.video).attr('src'));
                        $($newscope.video).attr('src', '');
                    } else {
                        $($newscope.video).attr('src', $($newscope.video).attr('liveSrc'));
                        $($newscope.video).attr('liveSrc', '');
                    }
                }
            });

            var video = $newscope.video,
                canvas = $element.find('canvas').get(0),
                ctx = canvas.getContext('2d'),
                loading = $element.find('.video-loading'),
                timeTarget = null,
                playid = null,
                init = false,
                playtype = 0,
                lastImage = null,
                videotapedTime = 0,
                videotapedTimer = null;

            video.videotapObj = {
                videotapePanel: $element.find('.video-object-videotape'),
                videotapeText: $element.find('.video-object-videotape > div')
            };

            // 快速回放对象
            video.replyObj = {
                replyPanel: null,
                timeline: null,
                timelineText: null,
                mouseline: null,
                mouselineText: null,

                scope: $scope.$new(),
                now: null,              // 快速回放结束时间对象（moment）
                second: 0,              // 快速回放的时间间隔
                showPanel: function() {
                    video.replyObjreplyPanel.show();
                },
                setTimeline: function(percentage) {
                    var w = video.replyObjtimelinePanel.width();

                    if(percentage * w < (w - 100)) {
                        video.replyObjtimelineText.css('left', 10);
                    } else {
                        video.replyObjtimelineText.css('left', -90);
                    }

                    video.replyObjtimeline.css('left', (percentage * 100) + '%');
                },
                setTime: function(time) {
                    video.replyObjtimelineText.text(time);
                },
                hidePanel: function() {
                    video.replyObjreplyPanel.hide();
                    this.setTimeline(0);
                },
                statusCb: function(e, time, start) {
                    if(e && e.data) {
                        var s = e.data.split(',');
                        var now = parseInt(s[3]);
                        this.setTimeline(((now - start) / time));
                        this.setTime($filter('date')(now, 'HH:mm:ss'));
                    }
                }
            };
            video.replyObj.scope.files = [];
            video.replyObj.scope.mouseover = function() {
                video.replyObjtimelinePanel.addClass('focus');
                video.replyObjmouseline.show();
                video.replyObjtimelineText.hide();
            };
            video.replyObj.scope.mouseout = function() {
                video.replyObjtimelinePanel.removeClass('focus');
                video.replyObjmouseline.hide();
                video.replyObjtimelineText.show();
            };
            video.replyObj.scope.mousemove = function(e) {
                var w = video.replyObjtimelinePanel.width(),
                    l = e.offsetX;

                if(l < (w - 100)) {
                    video.replyObjmouselineText.css('left', 10);
                } else {
                    video.replyObjmouselineText.css('left', -90);
                }

                video.replyObjmouseline.css('left', l);
                video.replyObjmouselineText.text($filter('date')(this.starttime + l / w * (this.endtime - this.starttime), 'HH:mm:ss'));
            };
            video.replyObjreplyPanel = $element.find('.video-object-reply');
            video.replyObjtimelinePanel = $element.find('.video-object-reply-timeline');
            video.replyObjtimeline = $element.find('.video-object-reply-timeline-step');
            video.replyObjtimelineText = $element.find('.video-object-reply-timeline-step b');
            video.replyObjmouseline = $element.find('.video-object-reply-timeline-mouseline');
            video.replyObjmouselineText = $element.find('.video-object-reply-timeline-mouseline b');

            video.replyObj.scope.$on('safeVideoPanel.resize', function() {
                var arr = video.replyObj.scope.files.slice(0);
                video.replyObj.scope.files = [];
                $timeout(function() {
                    video.replyObj.scope.files = arr;
                });
            });

            video.replyObjtimelinePanel.append('<div class="video-object-reply-timeline-graduate"><div><div class="safe-reply-time-file" ng-repeat="file in files" safe-reply-time-file></div></div></div>');
            $compile(video.replyObjreplyPanel)(video.replyObj.scope);

            $element.data('data-video', video);


            $scope.$on('$destroy', function() {
                stop();
            });

            function play(url) {
                //cs中，如果检测到直播流，先使用子码流播放，判断分辨率大于1280时，再自动切换主码流播放。
                if($scope.setting.streamtype == 0 || $scope.setting.streamtype == 2) {
                    if(url.indexOf('/live/') > -1) {
                        var temp = url.split('?');
                        temp[0] += '/sub';
                        url = temp.join('?');
                        playtype = 1;
                    }
                }


                playid = _imcs.OpenUrl(url);
                init = false;
                lastImage = null;
                timeTarget = $interval(draw, 1000 / 30);
            }

            var image;
            function draw() {
                if(playid) {
                    var data = _imcs.GetLastVideoFrame(playid);
                    if(data[0] != 0) {
                        if(!init) initMethod();

                        var p = canvas.parentElement,
                            w = $(p).width(),
                            h = $(p).height();
                        $(canvas).attr('width', w).attr('height', h);

                        if(w == data[3] && h == data[4]) {
                            if(!image) {
                                image = ctx.createImageData(w, h);
                            }
                            image.data.set(data[5]);
                            ctx.putImageData(image, 0, 0);

                            lastImage = image;
                        } else {
                            image = ctx.createImageData(w, h);
                            _imcs.ChgResolution(playid, w, h);
                        }

                        if($scope.setting.streamtype == 0) {
                            if(w >= 1280) {
                                if(playtype != 0) {
                                    _imcs.SwitchLiveStreamType(playid, 0);
                                    playtype = 0;

                                    console.log('切主码流');
                                }
                            } else {
                                if(playtype != 1) {
                                    _imcs.SwitchLiveStreamType(playid, 1);
                                    playtype = 1;

                                    console.log('切子码流');
                                }
                            }
                        }
                        
                        _imcs.FreeVideoFrame(data[6]);
                    } else {
                        if(lastImage) ctx.putImageData(lastImage, 0, 0);
                    }
                }
            }

            function initMethod() {
                init = true;

                if(!$scope.setting.keeplast || ($scope.setting.keeplast && $element.find('canvas:hidden').size())) {
                    $(canvas).stop(true).show('fade');
                }

                loading.stop(true).hide('fade');
                $element.data('data-play', true);

                $scope.showHideToolBar();
            }

            function stop() {
                if(playid) {
                    _imcs.CloseUrl(playid);

                    if(videotapedTimer) {
                        video.setAttribute('videotaped', 'false');
                        $scope.$parent.isVideotaped = false;
                    }

                    playid = null;
                    lastImage = null;
                    init = false;
                }

                if(timeTarget) $interval.cancel(timeTarget);
                $element.data('data-play', false);
                $scope.showHideToolBar();
            }

            function showVideotap() {
                if(videotapedTimer) $interval.cancel(videotapedTimer);

                videotapedTime = 0;
                var text = $filter('safeTimeSecondFormat')(videotapedTime);

                if(!$scope.ismax) {
                    video.videotapObj.videotapeText.text(text);
                } else {
                    $('.safe-video-max-panel .safe-video-max-box').find('.video-object-videotape > div').text(text);
                }

                videotapedTimer = $interval(function() {
                    videotapedTime++;
                    var text = $filter('safeTimeSecondFormat')(videotapedTime);

                    if(!$scope.ismax) {
                        video.videotapObj.videotapeText.text(text);
                    } else {
                        $('.safe-video-max-panel .safe-video-max-box').find('.video-object-videotape > div').text(text);
                    }
                }, 1000);

                if(!$scope.ismax) {
                    video.videotapObj.videotapePanel.show();
                } else {
                    $('.safe-video-max-panel .safe-video-max-box').find('.video-object-videotape').show();
                }
            }

            function hideVideotap() {
                if(!$scope.ismax) {
                    video.videotapObj.videotapePanel.hide();
                } else {
                    $('.safe-video-max-panel .safe-video-max-box').find('.video-object-videotape').hide();
                }

                if(videotapedTimer) {
                    $interval.cancel(videotapedTimer);
                    videotapedTimer = null;
                }
            }
        }

        function createCanvasHTML() {
            var html = [];
            html.push('<div class="layout-full video-loading"><div class="layout-full video-loading-table"><div class="video-loading-cell fz-4"><i class="fa fa-spinner fa-pulse"></i><span>加载中……</span></div></div></div>');
            html.push('<canvas class="layout-full"></canvas>');
            return html.join('');
        }

        return {
            create: _create,
            getImcs: _getImcs
        };
    }]);
});