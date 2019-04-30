define([
    'app'
], function (app) {
    app.factory('safeImcsPlayer', ['$rootScope', '$timeout', '$interval', '$filter', 'iAjax', 'iTimeNow', 'iMessage', function ($rootScope, $timeout, $interval, $filter, iAjax, iTimeNow, iMessage) {
        // var player = {};    // 播放器列表
        // var tag = 'scope';  // player播放器的标记开头

        var streamcode = '0';
        var socket = {
            obj: null,
            url: 'ws://127.0.0.1:9004/PageApi?utf8=1',
            pageid: '',
            isconnect: false, // 连接标记
            isAutoWindowChange: true,
            timer: null, // 尝试重连
            events: {},
            init: function () {
                if ('WebSocket' in window) {
                    this.obj = new WebSocket(this.url);
                    this.addEvent();
                } else {
                    console.error('您的浏览器不支持Websocket!');
                }
            },
            addEvent: function () {
                socket.obj.onopen = function () {
                    socket.isconnect = true;
                    socket.clean();
                    showAllWindow();
                    socket.heartbeat.start();
                };

                socket.obj.onclose = function () {
                    hideAllWindow();
                    console.log('Websocket [ ' + socket.url + ' ] Closed');
                    socket.isconnect = false;
                    socket.clean();
                };

                socket.obj.onerror = function (e) {
                    console.error('Websocket 连接异常 : ' + e);
                    socket.isconnect = false;
                    socket.clean();
                    socket.reconnect();
                };

                socket.obj.onmessage = function (e) {
                    var data = JSON.parse(e.data),
                        event = data.cmd;

                    //var message = '收到服务端的ws消息，内容如下\n' + JSON.stringify(data);
                    //console.log(message);
                    socket.message(event, data);
                };
            },
            send: function (msg, callback) {
                if (socket.obj) {
                    if(!socket.isconnect) {
                        socket.clean();
                        socket.reconnect();
                    }

                    if(msg.ws_request_index) {
                        msg.ws_request_index = _.uniqueId();
                    }

                    msg.sendtime = $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss');

                    socket.obj.send(JSON.stringify(msg));
                } else {
                    console.error('Websocket未连接');
                }
            },
            listen: function (key, fn) {
                if (!socket.events[key]) {
                    socket.events[key] = [];
                }
                socket.events[key].push(fn);
            },
            message: function (key, msg) {
                var fns = socket.events[key];
                if (!fns || fns.length == 0) {
                    // console.log('[ ' + key + ' ] 没有注册订阅者');
                    return;
                }

                for (var i = 0, len = fns.length; i < len; i++) {
                    fns[i].call(this, msg);
                }
            },
            remove: function(key, fn) {
                var fns = socket.events[key];
                if(!fns || fns.length == 0) {
                    return false;
                }

                if(!fn) {
                    fns && (fns.length = 0);
                } else {
                    var idx = _.findIndex(fns, function(row) {
                        return row === fn;
                    });
                    if(idx > -1) {
                        fns.splice(idx, 1);
                    }
                }
            },
            close: function () {
                socket.obj.close();
            },
            // 重连
            reconnect: function () {
                if (!socket.timer && socket.obj) {
                    socket.timer = setTimeout(function () {
                        socket.obj = new WebSocket(socket.url);
                        socket.addEvent();
                    }, 1000);
                }
            },
            clean: function () {
                if (socket.timer) {
                    clearTimeout(socket.timer);
                    socket.timer = null;
                }
                socket.heartbeat.stop();
            },
            // 心跳
            heartbeat: {
                timer: null,
                start: function() {
                    socket.heartbeat.timer = $interval(function() {
                        var cmd = {
                            "cmd":"Heartbeat",
                            "pageid": socket.pageid
                        }
                        socket.send(cmd);
                    }, 10 * 1000);
                },
                stop: function() {
                    if(socket.heartbeat.timer) {
                        $interval.cancel(socket.heartbeat.timer);
                        socket.heartbeat.timer = null;
                    }
                }
            }
        };

        // 判断是否全屏
        function isFullscreenForNoScroll() {
            var explorer = window.navigator.userAgent.toLowerCase();
            if (explorer.indexOf('chrome') > 0) {   //webkit
                if (getSizeByRatio(document.body.scrollHeight) === window.screen.height && getSizeByRatio(document.body.scrollWidth) === window.screen.width) {
                    return true;
                } else {
                    return false;
                }
            } else {    //IE 9+  fireFox
                if (window.outerHeight === window.screen.height && window.outerWidth === window.screen.width) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        // 判断浏览器窗口是否最小化
        function isMinStatus() {
            var isMin = false;
            if (window.outerWidth != undefined) {
                isMin = window.outerWidth <= 160 && window.outerHeight <= 27;
            }
            else {
                isMin = window.screenTop < -30000 && window.screenLeft < -30000;
            }
            return isMin;
        }

        // 获取浏览器缩放比例
        function detectZoom() {
            var ratio = 0,
                screen = window.screen,
                agent = navigator.userAgent.toLowerCase();

            if(window.devicePixelRatio !== undefined) {
                ratio = window.devicePixelRatio;
            } else if(~agent.indexOf('msie')) {
                if(screen.deviceXDPI && screen.logicalXDPI) {
                    ratio = scren.deviceXDPI / screen.logicalXDPI;
                }
            } else if(window.outerWidth !== undefinded && window.innerWidth !== undefined) {
                ratio = window.outerWidth / window.innerWidth;
            }

            return ratio;
        }

        // 根据浏览器的缩放比例重新设值
        function getSizeByRatio(osize, type) {
            // 计算间隙
            var space = 0;
            if(type) {
                if(type == 'top' || type == 'left') {
                    space = 1;
                } else {
                    space = -2
                }
            };
            // 获取缩放比
            var zoom = detectZoom();
            switch (type) {
                case 'top':
                    var screenHeight = window.screen.availHeight;
                    var oheight = document.body.clientHeight;

                    if(zoom > 0) {
                        osize = Math.round(osize * zoom);
                        oheight = Math.round(oheight * zoom);
                    }

                    if(!isFullscreenForNoScroll()) {
                        if(screenHeight > oheight) {
                            if(window.screenTop > 0) {
                                osize = 80 + osize + space + (window.screenTop ? window.screenTop : window.screenY);
                            }
                            else {
                                osize = screenHeight - oheight + osize + space;
                            }
                        };
                    }

                    //alert('screenheight：' + screenHeight + '，bodyheight：' + oheight + '，zoom：' + zoom + '，osize：' + osize + '，isfull：' + isFullscreenForNoScroll() + '，isCs：' + window.__IIWHOST);
                    break;
                case 'left':
                    if(zoom > 0) {
                        osize = Math.round(osize * zoom) + space + (window.screenLeft ? window.screenLeft : window.screenX);
                    }
                    break;
                default:
                    if(zoom > 0) {
                        osize = Math.round(osize * zoom) + space;
                    }
                    break;
            }
            return osize;
        }

        // 设置窗口
        function setWindow(info) {
            if(info.window_id) {

                var command = {
                    "cmd": "SetWindow",
                    "window_id": info.window_id,
                    "window_x": info.left,
                    "window_y": info.top,
                    "window_w": info.width,
                    "window_h": info.height,
                    "window_isshow": info.show,
                    "window_playtype": 1,
                    "live_issub": getStreamType(info.streamtype, info.width),
                    "userparam": info.userparam,
                    "window_ismousetrans": info.mousetrans
                };
                // console.log(JSON.stringify(command));
                socket.send(command);
            }
        }

        // 获取码流
        function getStreamType(streamtype, width) {
            //if(!streamtype) {
            //    streamtype = (width > 1280 ? 0 : 1);
            //}
            streamtype = streamcode;
            if(streamtype == '0') {
                streamtype = (width > 1280 ? 0 : 1);
            }

            return streamtype;
        }

        function getSycodeDetail() {

            iAjax.post('security/common/monitor.do?action=getSycodeDetail', {
                filter: {
                    type: 'CAMERASTREAMTYPE'
                }
            }).then(function(data) {
                if(data.result && data.result.rows) {
                    streamcode = data.result.rows;
                }
            });

        }

        // 设置所有监控的位置及大小
        function setAllWindow(player) {
            if (player && player.el && player.el.length) {
                var devWindows = player.el.find('safe-video:visible');
                var videos = player.videos;

                // 关闭超出范围的监控
                _.each(player.el.find('safe-video:gt(' + (devWindows.length - 1) + ')'), function (dom) {
                    var code = angular.element(dom).attr('code');
                    if (code && videos[code]) {
                        player.close(code);
                    }
                });

                _.each(devWindows, function (dom) {
                    var element = angular.element(dom);
                    var code = element.attr('code');
                    if (code && videos[code]) {
                        var info = {
                            window_id: videos[code].window.window_id,
                            left: getSizeByRatio(element.offset().left, 'left'),
                            top: getSizeByRatio(element.offset().top, 'top'),
                            width: getSizeByRatio(element.width(), 'width'),
                            height: getSizeByRatio(element.height(), 'height'),
                            userparam: code
                        };
                        $.extend(info, countSizeAndPosition(element));
                        setWindow(info);
                    }
                });
            }
        }

        // 显示窗口
        function showWindow(winID, code) {
            if(winID) {
                var command = {
                    "cmd": "SetWindow",
                    "window_id": winID,
                    "window_isshow": 1,
                    "userparam": code
                };
                socket.send(command);
            }
        }

        // 隐藏窗口
        function hideWindow(winID, code) {
            if(winID) {
                var command = {
                    "cmd": "SetWindow",
                    "window_id": winID,
                    "window_isshow": 0,
                    "userparam": code
                }
                socket.send(command);
            }
        }

        // 显示所有监控窗口
        function showAllWindow() {
            if(isconnect()) {
                var command = {
                    "cmd": "ShowOrHideAllWindow",
                    "pageid": socket.pageid,
                    "isshow": 1
                }
                socket.send(command);
            }
        }

        // 关闭所有监控窗口
        function hideAllWindow() {
            if(isconnect()) {
                var command = {
                    "cmd": "ShowOrHideAllWindow",
                    "pageid": socket.pageid,
                    "isshow": 0
                }
                socket.send(command);
            }
        }

        /**
         * 关闭某个窗口
         * @author : zhs
         * @version : 1.0
         * @date : 2019-05-13
         */
        function closeWindow(winID) {
            if(isconnect() && winID) {
                var command = {
                    "cmd": "CloseWindow",
                    "window_id": winID
                }
                socket.send(command);
            }
        }

        /**
         * 立即强制退出
         * @author : zhs
         * @version : 1.0
         * @date : 2019-05-09
        */
        function exit() {
            if(isconnect()) {
                var command = {
                    "cmd": "FocusExitAllSdkExe"
                }
                socket.send(command);
            }
        }

        /**
         * 初始化操作
         * 1、判断权限
         * 2、建立webscoket连接
         * 3、监听命令操作
         */
        function init() {
            // 判断是否具有 imcs 模式播放监控的权限。若想让用户具有权限，需在数据库表 SECTY_SCMP_MONITORTHEME 中配置数据。
            iAjax.post('security/device/device.do?action=getMonitorLiveTheme').then(function (data) {
                if (data.result && data.result.rows == '1') {
                    socket.init();

                    socket.listen('NotifyConnSuccess', function (data) {
                        socket.pageid = data.pageid;
                        console.log('websocket 连接 ImcsCsPlayerControler 成功');
						$rootScope.$broadcast('imcsplayerLoadEvent', {imcsFlag: 1});
                    });

                    $rootScope.$broadcast('camera.init.imcsplayer');

                    overrideMessageShow();
                } else {
					$rootScope.$broadcast('imcsplayerLoadEvent', {imcsFlag: 2});
                    console.error('当前 ip 的用户不具有 imcs 方式播放监控的权限;')
                }
            }, function () {
                console.error('imcs 监控权限接口异常!');
            });
        }

        // 设置监控窗口的选中样式
        function setVideoBorder(element) {
            element.find('safe-video-tool').addClass('border-solid');
        }

        /**
         * 计算监控元素位置大小
         */
        function countSizeAndPosition(element, status) {

            var video = {
                width: 0,
                height: 0,
                left: 0,
                top: 0
            };

            if(element) {
                var zoom = detectZoom();

                video.width = element.width() * zoom - 2;
                video.height = element.height() * zoom - 2;

                var browser = 0,
                    screenLeft = 0,
                    screenTop = 0;

                var left = Math.round(element.offset().left * zoom),
                    top = Math.round(element.offset().top * zoom);

                switch (getBrowserStatus()) {
                    case 'full':
                        //full screenLeft = 0; screenTop = 0;
                        break;
                    case 'max':

                        browser = window.outerHeight - Math.round(window.innerHeight * zoom) - 1;
                        screenLeft = window.screenLeft;
                        screenTop = window.screenTop;

                        break;
                    case 'shrink':

                        browser = window.outerHeight - Math.round(window.innerHeight * zoom) - 8;
                        screenLeft = window.screenLeft + 8;
                        screenTop = window.screenTop;

                        break;
                }

                video.left = left + screenLeft + 1;
                video.top = top + screenTop + browser + 1;

                if(status == '2') {
                    video = {
                        window_x: video.left,
                        window_y: video.top,
                        window_w: video.width,
                        window_h: video.height
                    };
                }

                return video;

            }

        }

        /**
         * 创建播放器
         * @param scope $scope作用域
         * @param el 绘制播放器的页面元素
         */
        function create(config) {
            if(config.scope && config.scope.imcsPlayer) {
                config.scope.imcsPlayer.destroy();
            }

            var setting = {
                scope: null,            // $scope作用域
                el: null,               // 注入的element
                ismax: false,          // 记录最大化时的监控
                ispause: false,        // 是否暂停
                isfull: false,          // 是否全屏
                log: false,
                streamtype: 0,          // 全局码流控制：0->自动， 1->全主码流, 2->全副码流；
                errorlog: {},         // 记录错误日志
                cache: {
                    b4max: null,
                    b4pause: {}
                },
                videos: {}              // 所有监控信息
            };

            _.extend(setting, config);

            if (!setting.scope || !setting.el) {
                throw '缺少参数，无法初始化 safeImcsPlayer';
            }

            setting.scope.$on('safeMainMenuShowEvent', function() {
                _pause();
            });

            setting.scope.$on('safeMainMenuHideEvent', function() {
                _restore();
            });

            isconnect() && setVideoBorder(setting.el);
            setting.scope.$on('camera.init.imcsplayer', function() {
                setVideoBorder(setting.el);
            });

            // 添加监听事件
            function addListener() {
                socket.listen('PlayLiveStream', function (data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        if (data.result == 'ok') {
                            // 记录监控信息
                            // setting.videos[key] = data;
                            addVideo(key, 'window', data.window);
                            showTips(data, '正在打开监控');
                        } else {
                            //console.error(data);
                            _close(key);
                            //setting.el.find('safe-video[code=' + key + ']').attr('code', '');
                        }
                    }
                });

                socket.listen('NotifyPushLiveStatus', function (data) {
                    var video = _.find(setting.videos, function(row) {
                        return row.type == 'monitor' && row.window.window_id == data.window_id;
                    });

                    if(video) {
                        if(data.window_playstat == 1) {
                            if(video.timer) {
                                $timeout.cancel(video.timer);
                            }
                            showTips(video, false);
                            // showWindow(video.window.window_id, video.code);
                            if (video.element.is(':visible') && !video.autoClose) {

                                if(setting.ismax) {
                                    var code = $('.safe-video-full-panel .safe-video-max-box').atrr('code');
                                    if(code == video.code) {
                                        showWindow(video.window.window_id, video.code);
                                    }
                                }
                                else {
                                    showWindow(video.window.window_id, video.code);
                                }


                            } else {
                                _close(video.code);
                            }
                        } else {
                            video.timer = $timeout(function() {
                                showTips(video, '视频播放失败，请检查设备是否在线！', 'error');
                            }, 13000);
                        }
                    }
                });

                socket.listen('StopLiveStream', function (data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        if (setting.videos[key] && data.result == 'ok') {
                            // 隐藏消息提示
                            showTips(setting.videos[key], false);
                            // 移除监控信息
                            removeVideo(key);

                            // 置空标签上的code属性
                            //if(!setting.ispause) {
                                //setting.el.find('safe-video[code=' + key + ']').attr('code', '');
                            //}
                        } else {
                            closeWindow(data.window_id || data.req_window_id || data.window.window_id);
                            removeVideo(key);
                        }
                    }

                    logError('StopLiveStream', data);
                });

                socket.listen('SetWindow', function (data) {
                    if(data.userparam) {
                        var key = data.userparam;
                        var scopeid = key.split('-')[0];

                        if(setting.scope.$id == scopeid) {
                            if (setting.videos[key] && data.window) {
                                setting.videos[key].window = data.window;
                            }
                        }
                    }
                });

                // 录像创建
                socket.listen('CreateRecordWindow', function(data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        var video = setting.videos[key];
                        if (data.result == 'ok') {
                            if(video) {
                                video.window.window_id = data.window_id;
                                video.window.window_id2 = data.window_id2;
                                video.devinfo.pb_support = data.pb_support;
                                queryFiles(video);
                                showTips(video, false);
                            }
                        } else {
                            showTips(video, '录像创建失败，请检查设备是否在线', 'error');
                            removeVideo(key);
                            closeWindow(data.window_id);
                            console.error('[ ' + video.id + ' ] 创建窗口失败, [result : ' + data.result + ']');
                        }
                    }
                });

                // 录像查询
                socket.listen('QueryRecord', function(data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        if (data.result == 'ok') {
                            var video = setting.videos[key];
                            if (data.rec_cnt > 0) {
                                if (video) {
                                    video.query.rec_cnt = data.rec_cnt;
                                    video.query.rec = data.rec;
                                    if(video.query.callback) {
                                        video.query.callback(data.rec.map(function(row) {
                                            return {
                                                start: row.tbegin,
                                                end: row.tend
                                            }
                                        }));
                                    }
                                    showTips(video, false);
                                    startFile(video);
                                }
                            } else {
                                showTips(video, '没有录像', 'error');
                                // closeWindow(video.window.window_id);
                            }
                        } else {
                            console.error('[ ' + key.split('-')[1] + ' ] 录像查询失败, [result : ' + data.result + '] , [err : ' + data.query_err + ']');
                        }
                    }
                });

                // 播放录像
                socket.listen('PlaybackRecord', function(data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        var video = setting.videos[key];
                        if (data.result == 'ok') {
                            showTips(video, false);
                            if(video.query.pos && video.query.pos > data.pbstat.tbegin) {
                                _setPos(video, video.query.pos);
                            }
                        } else {
                            // console.log(setting.videos[key]);
                            showTips(video, '录像播放失败', 'error');
                            console.error('[ ' + video.id + ' ] 录像播放失败, [result : ' + data.result + '] , [err : ' + data.pb_err + ']');
                        }
                    }
                });

                // 下载录像
                socket.listen('DownloadRecord', function(data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        var video = setting.videos[key];
                        if (data.result == 'ok') {
                            video.state = 'downloading';
                        } else {
                            _stopDownload(video.id);
                            console.error('[ ' + video.id + ' ] 录像下载失败, [result : ' + data.result + '] , [err : ' + data.dl_err + ']');
                        }
                    }
                });

                // 录像控制
                socket.listen('PlaybackCtrl', function(data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        if (data.result == 'ok') {
                            var video = setting.videos[key];

                            if (video && data.req_ctrl) {
                                switch(data.req_ctrl) {
                                    case 'stop':
                                        if(video.stopCallback) {
                                            video.stopCallback();
                                            video.stopCallback = null;
                                        } else {
                                            removeVideo(video.code);
                                        }
                                        break;
                                    case 'setpos':
                                        break;
                                }
                            }
                        } else {
                            if(data.req_ctrl == 'stop') {
                                removeVideo(key);
                            }
                            console.error(data.req_ctrl + ' 操作失败，' + data.result);
                        }
                    }
                });

                // 停止录像下载
                socket.listen('DownloadRecordStop', function(data) {
                    var key = data.userparam;
                    var scopeid = key.split('-')[0];

                    if(setting.scope.$id == scopeid) {
                        if(setting.stopDownloadCallback) {
                            setting.stopDownloadCallback();
                            setting.stopDownloadCallback = null;
                        }
                    }
                });

                // 录像状态
                socket.listen('NotifyPlaybackStatus', function(data) {
                    var video = _.find(setting.videos, function(row) {
                        return row.type == 'record' && row.window.window_id == data.window_id;
                    });

                    if(video) {
                        // 录像播放完毕
                        if (data.pbstat && data.pbstat.finish == 1 && video.state == 'play') {
                            // 播放下个文件
                            if ((data.pb_support == 1) && (video.query.idx < video.query.rec.length)) {
                                // 先停止再播放
                                _stopRecord(video, function() {
                                    // 根据pos的时间找到合适的录像
                                    var time = data.pbstat.tend > video.query.pos ? video.query.rec[++video.query.idx]['tbegin'] + 1 : video.query.pos;
                                    setFitFile(video, time);
                                    startFile(video);
                                });
                            } else {
                                _stopRecord(video, function() {
                                    closeWindow(video.window.window_id);
                                    removeVideo(video.code);
                                });
                            }
                        }

                        // 录像下载完毕
                        if (data.dlstat && data.dlstat.finish == 1 && video.state == 'downloading') {
                            // 停止下载
                            _stopDownload(video.id, function() {
                                // 下载下个文件
                                if ((data.pb_support == 1) && (video.query.idx < video.query.rec.length)) {
                                    video.query.idx++;

                                    _download(video.id);
                                }
                            });

                            if(setting.downloadCallback) {
                                setting.downloadCallback({
                                    devicefk: video.id,
                                    data: '5,100,1x,' + (data.dlstat.tbegin + data.dlstat.pos) + ',' + (data.pb_support == 1 ? video.query.rec.length : 1)
                                });
                            }
                        }

                        // 录像播放进度
                        if (data.pbstat && data.pbstat.finish != 1 && setting.recordCb) {
                            if (video.query.speed != data.pbstat.speed2) {
                                video.query.speed = data.pbstat.speed2
                            }

                            // 状态 - 速度 - 总时长 - 当前时刻 - 进度
                            var str = video.state + ',' + data.pbstat.speed2 + ',' + (data.pbstat.tend - data.pbstat.tbegin) + ',' + (data.pbstat.tbegin + data.pbstat.pos) + ',' + (data.pbstat.finish * 100);
                            setting.recordCb({
                                devicefk: video.id,
                                data: str
                            });
                        }

                        // 录像下载进度
                        if (data.dlstat && data.dlstat.finish != 1 && setting.downloadCallback) {
                            // 状态 - 进度 - 速度 - 当前时刻 - 下载文件数
                            var str = '3' + ',' + data.dlstat.percent + ',' + '1x' + ',' + (data.dlstat.tbegin + data.dlstat.pos) + ',' + (data.pb_support == 1 ? video.query.rec.length : 1);
                            setting.downloadCallback({
                                devicefk: video.id,
                                data: str
                            });
                        }
                    }
                });

				/*socket.listen('sdkCreate', function(data) {
                    if(data.sdkid){
                        $rootScope.$broadcast('sdkCreateSucessEvent', {data: data});
                    }
                });

                socket.listen('NotifySdkMsg', function(data) {
                    $rootScope.$broadcast('notifySdkMsgEvent', {data: data});
                });

                socket.listen('sdkExec', function(data) {
                    $rootScope.$broadcast('sdkExecEvent', {data: data});
                });*/

            }

            // 设置播放失败的提示信息
            function showTips(video, text, state, isfull) {
                var key = video.code || video.userparam;
                var element = isfull ? $('.safe-video-full-panel').find('safe-video[code=' + key + ']') : setting.el.find('safe-video[code=' + key + ']');
                if(element) {
                    element.find('.video-tips').remove();
                    if(text && element.length) {
                        var name = element.find('video').attr('name');

                        var tips = '<div class="layout-full video-tips ' + state + '">';

                        tips += '<div>' + text + '</div>';

                        if(name) {
                            tips += '<div>[ '+ name + ' ]</div>';
                        }

                        tips += '</div>';

                        element.append(tips);
                    }
                }

                if(!isfull && setting.isfull && video) {
                    showTips(video, text, state, true);
                }
            }

            // 记录错误日志
            function logError(type, data) {
                if(!setting.errorlog[type]) {
                    setting.errorlog[type] = [];
                }

                var idx = _.findIndex(setting.errorlog[type], { code: data.userparam });
                if(data.result != 'ok') {
                    if(idx > -1) {
                        // 错误数累计
                        setting.errorlog[type][idx].count++;
                        if(setting.errorlog[type][idx].count >= 2) {
                            closeWindow(data.window.window_id);
                            console.error(data);
                        } else {
                            _close(data.userparam);
                        }
                    } else {
                        // 新错误信息
                        setting.errorlog[type].push({code: data.userparam, count: 1});
                    }
                } else {
                    if(idx > -1) {
                        // 移除错误记录
                        setting.errorlog[type].slice(idx, 1);
                    }
                }
            }

            // 在控制台输出日志
            function logCmd(cmd, msg, color, istrace) {
                if(setting.log) {
                    var styles = {
                        gray: 'color: #fff; background: #606060;; padding: 2px;',
                        green: 'color: #fff; background: #3CB371; padding: 2px;',
                        red: 'color: #fff; background: #f40; padding: 2px;'
                    }
                    console.log('%c%s%c%s%c [ %s ] ',
                        styles.gray,
                        $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss'),
                        styles[color || 'green'],
                        cmd,
                        'color: #333;',
                        msg,
                        setting.el
                    );

                    if(istrace) {
                        console.trace('logCmd');
                    }
                }
            }

            // 添加监控记录
            function addVideo(code, key, value) {
                var video = setting.videos[code];
                if(!video) {
                    setting.videos[code] = {
                        id: code.split('-')[1],
                        code: code
                    }
                }
                setting.videos[code][key] = value;
            }

            // 移除监控记录
            function removeVideo(code) {
                if(setting.videos[code]) {
                    delete setting.videos[code];
                    setting.el.find('safe-video[code=' + code + ']').attr('code', '');
                }
            }

            function setCode(index, code) {
                var element = setting.el.find('safe-video:eq(' + (index - 1) + ')');
                element.attr('code', code);
            }

            function getCode(index) {
                var element = setting.el.find('safe-video:eq(' + (index - 1) + ')');
                return element.attr('code');
            }

            // 获取当前选中监控
            function getSelect() {
                var index = setting.scope.select;
                var code = getCode(index);
                var video = setting.videos[code];

                if(video) {
                    return video;
                }
                return null;
            }

            // 获取放大的监控
            function getMaxVideo() {
                var element = angular.element('.safe-video-max-panel .safe-video-max-box');
                var code = element.attr('code');
                if(code) {
                    return setting.videos[code];
                } else {
                    return setting.cache.b4max;
                }
            }

            // 发送播放的指令
            function sendPlayCmd(element, id, detail) {
                $timeout(function () {
                    var requestIndex = _.uniqueId();
                    var code = setting.scope.$id + '-' + id + '-' + requestIndex;

                    addVideo(code, 'type', 'monitor');
                    addVideo(code, 'devinfo', {
                        "dev_type": detail.type,
                        "dev_ip": detail.ip,
                        "dev_port": detail.port,
                        "dev_uname": detail.uname,
                        "dev_pwd": detail.pwd,
                        "live_chl": detail.chl || "1",
                        "live_chlcode": detail.code,
                        "live_issub": getStreamType(setting.streamtype, getSizeByRatio(element.width(), 'width')),
                    });

                    addVideo(code, 'window', {
                        "window_playtype": 1,
                        "window_isshow": 0,
                        "window_istitle": 0,
                        "window_opaque": "255",
                        "window_x": detail.left || getSizeByRatio(element.offset().left, 'left'),
                        "window_y": detail.top || getSizeByRatio(element.offset().top, 'top'),
                        "window_w": detail.width || getSizeByRatio(element.width(), 'width'),
                        "window_h": detail.height || getSizeByRatio(element.height(), 'height')
                    });

                    addVideo(code, 'element', element);

                    var command = _.extend({
                        "cmd": "PlayLiveStream",
                        "ws_request_index": requestIndex,
                        "userparam": code
                    }, setting.videos[code]['devinfo'], setting.videos[code]['window'], countSizeAndPosition(element, '2'));
                    socket.send(command);

                    logCmd('PlayLiveStream', 'CODE : '  + code, 'green', true);

                    element.find('.video-loading').hide();
                    element.attr('code', code);
                }, 500);
            }

            /**
             * 播放
             * @param obj 监控对象
             * @param id 监控设备id
             */
            function _play(obj, id, info) {
                if(!setting.ispause && obj.get().length) {
                    var element = angular.element(obj.get());
                    var code = element.attr('code');
                    if (code) {
                        // 关闭当前位置上已有监控
                        _close(code);
                    }
                    setAllWindow(this);

                    if(!info) {
                        setting.scope.getDevParam(id, function(data) {
							if(data && data.detail) {
								sendPlayCmd(element, id, data.detail);
							}
                        });
                    } else {
                        sendPlayCmd(element, id, info);
                    }
                }
            }

            /**
             * 关闭单个监控
             * @param code 监控标识，一般组成结构是 'scopeid-监控id-uniqueId'
             */
            function _close(code) {
                var video;
                if(!code) {
                    video = getSelect();
                } else {
                    video = setting.videos[code]
                }

                if (video && video.type == 'monitor' && video.window && video.window.window_id) {
                    var command = {
                        "cmd": "StopLiveStream",
                        "window_id": video.window.window_id,
                        "userparam": video.code
                    }

                    socket.send(command);

                    logCmd('StopLiveStream', 'CODE : '  + code, 'red');
                } else {
                    addVideo(code, 'autoClose', true);
                }
            }

            /**
             * 关闭所有监控
             */
            function _closeAll() {
                if (_.size(setting.videos) > 0) {
                    var videos = _.filter(setting.videos, {type: 'monitor'});
                    _.each(videos, function (video, code) {
                        _close(code);
                    });
                }
            }

            /**
             * 重设布局
             */
            function _resetLayout() {
                if(!setting.ispause) {
                    var _this = this;
                    $timeout(function () {
                        setAllWindow(_this);
                    }, 300);
                }
            }

            /**
             * 当前监控全屏显示
             */
            function _max(index) {
                var video = index ? setting.videos[getCode(index)] : getSelect();

                // if(!video) {
                //     hideAllWindow();
                // }

                if(video && !setting.ismax && video.type != 'record' && !setting.isfull) {
                    setting.ismax = true;
                    // 记录当前操作的监控信息，以便恢复
                    setting.cache.b4max = {
                        window_id: video.window.window_id,
                        top: video.window.window_y,
                        left: video.window.window_x,
                        width: video.window.window_w,
                        height: video.window.window_h,
                        userparam: video.code
                    }
                    // 重设监控窗口位置和大小
                    var info = {
                        window_id: video.window.window_id,
                        left: getSizeByRatio(50, 'left'),
                        top: getSizeByRatio(103, 'top'),
                        width: getSizeByRatio(document.body.clientWidth - 100, 'width'),
                        height: getSizeByRatio(document.body.clientHeight - 153, 'height'),
                        userparam: video.code
                    }

                    setting.scope.ismax = true;

                    angular.element('.safe-video-max-panel').show('fade');
                    angular.element('.safe-video-max-tools').show('fade');

                    // 新开一个播放窗口
                    //hideWindow(video.window.window_id, video.code);
					$.each(setting.videos, function(n, v) {
						hideWindow(v.window.window_id, v.code);
					});
                    sendPlayCmd(angular.element('.safe-video-max-panel .safe-video-max-box'), video.id, {
                        "type": video['devinfo']['dev_type'],
                        "ip": video['devinfo']['dev_ip'],
                        "port": video['devinfo']['dev_port'],
                        "uname": video['devinfo']['dev_uname'],
                        "pwd": video['devinfo']['dev_pwd'],
                        "chl": video['devinfo']['live_chl'],
                        "code": video['devinfo']['live_chlcode'],
                        "left": info.left,
                        "top": info.top,
                        "width": info.width,
                        "height": info.height
                    });

                    // setWindow(info);

                    setting.scope.$emit('camera.maxEvent');
                    setting.scope.hideSelect();

                    $rootScope.$broadcast('imcs.maxEvent', {
                        camera: this,
                        video: info
                    });
                } else {
                    console.error('当前条件不能进行窗口放大！');
                }
            }

            /**
             * 取消全屏
             */
            function _min() {
                if (setting.ismax) {
                    setting.ismax = false;
                    setting.scope.ismax = false;

                    // 放大的监控
                    var code = angular.element('.safe-video-max-panel .safe-video-max-box').attr('code');
                    if(code) {
                        _close(code);
                        // showAllWindow();
                        //showWindow(setting.cache.b4max.window_id, setting.cache.b4max.userparam);
                    }

					$.each(setting.videos, function(n, v) {
						showWindow(v.window.window_id, v.code);
					});

                    // setWindow(setting.cache.b4max);

                    angular.element('.safe-video-max-tools').hide('fade');
                    angular.element('.safe-video-max-panel').hide('fade');
                    angular.element('.safe-video-max-panel .safe-video-max-box').attr('code', '');

                    setting.scope.$emit('camera.minEvent');

                    setting.cache.b4max = null;
                }
            }

            /**
             * 全屏显示
             */
            function _full() {
                if(!setting.isfull) {
                    $timeout(function() {
                        var fullVideos = angular.element('.safe-video-full-panel').find('safe-video:visible');
                        _.each(fullVideos, function(v) {
                            var element = angular.element(v);
                            var video = setting.videos[element.attr('code')];
                            if(video) {
                                var info = {
                                    window_id: video.window.window_id,
                                    left: getSizeByRatio(element.offset().left, 'left'),
                                    top: getSizeByRatio(element.offset().top, 'top'),
                                    width: getSizeByRatio(element.width(), 'width'),
                                    height: getSizeByRatio(element.height(), 'height'),
                                    userparam: video.code
                                };
                                $.extend(info, countSizeAndPosition(element));
                                setWindow(info);
                            }
                        });

                        setting.isfull = true;
                    }, 500)
                } else {
                    _exitFull.apply(this);
                }
            }

            // 退出全屏
            function _exitFull() {
                if(setting.isfull) {
                    var _this = this;
                    $timeout(function() {
                        setAllWindow(_this);
                        setting.isfull = false;
                    }, 300);
                }
            }

            /**
             * 暂停播放
             */
            function _pause() {
                if(!setting.ispause) {
                    if(_.size(setting.videos) > 0) {
                        // 退出全屏
                        _exitFull.apply(this);
                        // 退出放大
                        _min();
                        // 停止轮巡
                        setting.scope.$emit('camera.maxEvent');
                        // 缓存当前窗口
                        setting.cache.b4pause = _.extend({}, setting.videos);
                        // 关闭所有窗口
                        // _closeAll();
                        _.each(setting.videos, function(video) {
                            hideWindow(video.window.window_id, video.code);
                        });
                    }

                    setting.ispause = true;
                }
            }

            /**
             * 恢复播放
             */
            function _restore() {
                if(setting.ispause) {
                    // 设置当前监控显示
                    /*var elements = setting.el.find('safe-video[code][code != ""]');
                    _.each(elements, function(dom) {
                        var el = angular.element(dom);
                        var code = el.attr('code');
                        var video = setting.cache.b4pause[code];

                        if(video) {
                            getDevParam(el, code.split('-')[1]);
                        }
                    });*/
                    _.each(setting.cache.b4pause, function(video) {
                        showWindow(video.window.window_id, video.code);
                    });
                    setting.cache.b4pause = {};
                    // 启动轮巡
                    setting.scope.$emit('camera.maxEvent');
                    setting.ispause = false;
                }
            }

            /**
             * 云台控制
             * @param ctrl
             * @param speed
             * @param open
             * @param preset
             */
            function _ptzControl(ctrl, speed, open, preset) {
                var video = setting.ismax ? getMaxVideo() : getSelect();
                if(video) {
                    var command = {
                        "cmd":"PtzCtrl",
                        "window_id": video.window ? video.window.window_id : video.window_id,
                        "ctrl": ctrl,
                        "speed": speed || 5,
                        "open": open,
                        "preset": preset
                    }
                    // console.log(video, command);
                    socket.send(command);
                }
            }

            /**
             * 播放声音
             * @param issound 是否播放声音, 0 - 关闭，1 - 开启
             * @param volume 音量
             */
            function _playSound(issound, volumn) {
                var video = setting.ismax ? getMaxVideo() : getSelect();
                if(video) {
                    var command = {
                        "cmd":"PlaySound",
                        "window_id": video.window ? video.window.window_id : video.window_id,
                        "sound": issound,
                        "volumn": volumn || 100,
                    }
                    // console.log(video, command);
                    socket.send(command);
                }
            }

            /**
             * 截图
             */
            function _snapshot(callback) {
                var video = (setting.ismax || setting.scope.ismax) ? getMaxVideo() : getSelect();
                if(video) {
                    var snap = function(data) {
                        var keys = data.userparam.split('-');

                        if(setting.scope.$id == keys[0]) {
                            if (data.result == 'ok' && data.imgdata) {
                                callback.call(null, data.imgdata, keys[1], data.req_window_id);
                            } else {
                                console.error('截图失败', data.result);
                                callback();
                            }
                            socket.remove('Snapshop');
                        }
                    }

                    socket.listen('Snapshop', snap);

                    var command = {
                        "cmd":"Snapshop",
                        "window_id": video.window ? video.window.window_id : video.window_id,
                        "userparam": video.userparam || video.code
                    }
                    // console.log(video, command);
                    socket.send(command);
                }
            }

            /**
             * 获取当前选中的窗口信息
             */
            function _getWindow() {
                var video = getSelect();

                if (video) {
                    var command = {
                        "cmd": "GetWindow",
                        "window_id": video.window.window_id
                    }
                    socket.send(command);
                }
            }

            /**
             * 销毁
             */
            function _destroy() {
                _closeAll();
                _stopAllRecords();
                if (setting.scope.imcsPlayer) {
                    setting.scope.imcsPlayer = null
                }

                if(windowResize) {
                    $(document).unbind('resize', windowResize);
                }
            }

            /**
             * 播放录像
             * 步骤一：创建窗口
             * 步骤二：录像查询
             * 步骤三：开始播放
             */
            function _playRecord(id, index, start, end, now, callback, detail) {
                var element = setting.el.find('safe-video:eq(' + (index - 1) + ')');

                if(element.attr('code')) {
                    // 关闭当前位置上已有录像
                    var _record = setting.videos[element.attr('code')];
                    _stopRecord(_record, function() {
                        closeWindow(_record.window.window_id);
                        removeVideo(_record.code);
                    });
                }

                var requestIndex = _.uniqueId();
                var code = setting.scope.$id + '-' + id + '-' + requestIndex;

				if(detail) {
					playSend(detail);
				}
				else {
					setting.scope.getDevParam(id, function(data) {
						if(data && data.detail) {
							playSend(data.detail);
						}
					});
				}

				function playSend(detail) {
					addVideo(code, 'type', 'record');
                    addVideo(code, 'devinfo', {
                        "id": id,
                        "dev_type": detail.type ,
                        "dev_ip": detail.ip,
                        "dev_port": detail.port,
                        "dev_uname": detail.uname,
                        "dev_pwd": detail.pwd,
                        "pb_chl": detail.chl || 1,
                        "pb_chlcode": detail.code,
                    });

                    addVideo(code, 'window', {
                        "window_playtype": 2,
                        "window_isshow": 0,
                        "window_x": getSizeByRatio(element.offset().left, 'left'),
                        "window_y": getSizeByRatio(element.offset().top, 'top'),
                        "window_w": getSizeByRatio(element.width(), 'width'),
                        "window_h": getSizeByRatio(element.height(), 'height')
                    });

                    addVideo(code, 'query', {
                        "tbegin": start,
                        "tend": end,
                        "pos": now,
                        "callback": callback,
                        "speed": '1x',
                        "idx": 0
                    });

                    setCode(index, code);
                    crateRecordWindow(setting.videos[code]);
                    element.find('.video-loading').hide();
				}
            }

            // 创建录像窗口
            function crateRecordWindow(video) {
                if(video) {
                    var command = _.extend({
                        "cmd": "CreateRecordWindow",
                        "userparam": video.code,
                        "ws_request_index": video.code.split('-')[2]
                    }, video.devinfo);

                    socket.send(command);
                }
            }

            // 查询录像文件
            function queryFiles(video) {
                if(video && video.state != 'play' && video.state != 'downloading') {
                    var command = {
                        "cmd": "QueryRecord",
                        "window_id": video.window.window_id,
                        "tbegin": video.query.tbegin,
                        "tend": video.query.tend,
                        "userparam": video.code
                    }

                    socket.send(command);

                    video.state = 'query';
                }
            }

            // 播放录像文件
            function startFile(video) {
                if(video) {
                    var command = {
                        "cmd": "PlaybackRecord",
                        "window_id": video.window.window_id,
                        "window_isshow": 1,
                        "window_istitle": 0,
                        "window_opaque": "255",
                        "window_x": video.window.window_x,
                        "window_y": video.window.window_y,
                        "window_w": video.window.window_w,
                        "window_h": video.window.window_h,
                        "userparam": video.code
                    }

                    if(video.devinfo.pb_support == 1) {
                        command["rcfile"] = video.query.rec[video.query.idx]['file'];
                    }

                    socket.send(command);

                    video.state = 'play';
                }
            }

            // 定位要播放的录像文件
            function setFitFile(video, time) {
                var file = {};
                if(video.query && video.query.rec) {
                    var index = _.findIndex(video.query.rec, function (row) {
                        return row.tbegin <= time && time <= row.tend;
                    });
                    if(index < 0) {
                        index = 0;
                    }
                    video.query.idx = index;
                    file = video.query.rec[index];
                }
                return file;
            }

            /**
             * 停止播放录像
             * @param data 窗口下标或录像信息
             */
             function _stopRecord(data, callback) {
                var video;
                if(_.isObject(data)) {
                    video = data;
                } else {
                    var code = getCode(data);
                    video = setting.videos[code];
                    setting.el.find('safe-video:eq(' + (data - 1) + ')').find('.video-tips').remove();
                }

                if(video && video.type == 'record' && video.state != 'stop') {
                    if(callback) {
                        video.stopCallback = callback;
                    }

                    var commnad = {
                        "cmd": "PlaybackCtrl",
                        "window_id": video.window.window_id,
                        "ctrl": "stop",
                        "userparam": video.code
                    }
                    socket.send(commnad);

                    // if(video.state == 'downloading') {
                    //     _stopDownload(video.id);
                    // }

                    video.state = 'stop';
                }
            }

            /**
             * 停止所有录像
             */
            function _stopAllRecords() {
                setting.el.find('.video-tips').remove();

                if(_.size(setting.videos) > 0) {
                    var videos = _.filter(setting.videos, {type: 'record'});
                    _.each(videos, function(video) {
                        _stopRecord(video, function() {
                            // closeWindow(video.window.window_id);
                            removeVideo(video.code);
                        });
                    });
                }
            }

            /**
             * 暂停播放录像
             * @param index 窗口下标
             */
            function _pauseRecord(index) {
                var code = getCode(index);
                var video = setting.videos[code];
                if(video) {
                    var commnad = {
                        "cmd": "PlaybackCtrl",
                        "window_id": video.window.window_id,
                        "ctrl": "pause",
                        "userparam": video.code
                    }
                    socket.send(commnad);

                    video.state = 'pause';
                }
            }

            /**
             * 恢复播放录像
             * @param index 窗口下标
             */
            function _resumeRecord(index) {
                var code = getCode(index);
                var video = setting.videos[code];
                if(video) {
                    var commnad = {
                        "cmd": "PlaybackCtrl",
                        "window_id": video.window.window_id,
                        "ctrl": "play",
                        "userparam": video.code
                    }
                    socket.send(commnad);

                    video.state = 'play';
                }
            }

            /**
             * 跳转到指定时间
             * @param data 窗口下标或录像信息
             * @param time 播放时间
             */
            function _setPos(data, time) {
                var video = null;
                if(_.isObject(data)) {
                    video = data;
                } else {
                    var code = getCode(data);
                    video = setting.videos[code];
                }

                if(video) {
                    // console.log('[ ' + video.id + ' ] ' + ' setpos to ' + $filter('date')(time, 'yyyy-MM-dd HH:mm:ss'));

                    video.query.pos = time;

                    var commnad = {
                        "cmd": "PlaybackCtrl",
                        "window_id": video.window.window_id,
                        "ctrl": "setpos",
                        "pos": time,
                        "userparam": video.code
                    }

                    if(video.devinfo.pb_support == 1 && video.query.rec) {
                        if(time < video.query.rec[video.query.idx]['tbegin'] || time > video.query.rec[video.query.idx]['tend']) {
                            setFitFile(video, time);
                            _stopRecord(video, function() {
                                startFile(video);
                            });
                        } else {
                            socket.send(commnad);
                        }
                    } else {
                        socket.send(commnad);
                    }
                }
            }

            /**
             * 单帧播放
             * @param index 窗口下标
             */
            function _oneFrame(index) {
                var code = getCode(index);
                var video = setting.videos[code];
                if(video) {
                    var commnad = {
                        "cmd": "PlaybackCtrl",
                        "window_id": video.window.window_id,
                        "ctrl": "oneframe",
                        "userparam": video.code
                    }
                    socket.send(commnad);
                }
            }

            /**
             * 设置录像播放速度
             * @param index 窗口下标
             * @param speed 速度
             */
            function _setSpeed(index, speed) {
                var code = getCode(index);
                var video = setting.videos[code];
                if(video) {
                    // 判断速度增减，如：'1/2x'和'2x'
                    var newVal = eval(speed.replace('x', ''));
                    var oldVal = eval(video.query.speed.replace('x', ''));
                    if(newVal > oldVal) {
                        fast(video);
                    } else if(newVal < oldVal) {
                        slow(video);
                    }
                    // video.query.speed = speed;
                }
            }

            // 录像慢放
            function slow(video) {
                var commnad = {
                    "cmd": "PlaybackCtrl",
                    "window_id": video.window.window_id,
                    "ctrl": "slow",
                    "userparam": video.code
                }
                socket.send(commnad);
            }

            // 录像快放
            function fast(video) {
                var commnad = {
                    "cmd": "PlaybackCtrl",
                    "window_id": video.window.window_id,
                    "ctrl": "fast",
                    "userparam": video.code
                }
                socket.send(commnad);
            }

            /**
             * 下载录像
             * @param id 设备id
             */
            function _download(id, path, callback) {
                var video = _.find(setting.videos, function(row) {
                    return row.type == 'record' && row.id == id;
                });

                if(video && video.query.rec_cnt > 0) {
                    // 下载路径
                    if(path) {
                        video.query.dlpath = path;
                    }

                    //var filename = video.devinfo.pb_support == 1 ? video.query.rec[video.query.idx]['file'] : $filter('date')(video.query.tbegin, 'yyyyMMddHHmmss') + '-' + $filter('date')(video.query.tend, 'yyyyMMddHHmmss');
                    var filename = $filter('date')(video.query.tbegin, 'yyyyMMddHHmmss') + '-' + $filter('date')(video.query.tend, 'yyyyMMddHHmmss') + '-' + video.query.idx;
                    var downloadPath = video.query.dlpath + filename + '.mp4';

                    var commnad = {
                        "cmd": "DownloadRecord",
                        "window_id": video.window.window_id,
                        "savefile": downloadPath,
                        "userparam": video.code
                    }

                    if(video.devinfo.pb_support == 1) {
                        commnad["rcfile"] = video.query.rec[video.query.idx]['file'];
                    }

                    if(callback) {
                        setting.downloadCallback = callback;
                    }

                    socket.send(commnad);
                }
            }

            /**
             * 停止下载录像
             * @param id 设备id
             */
             function _stopDownload(id, callback) {
                var video = _.find(setting.videos, function(row) {
                    return row.type == 'record' && row.id == id;
                });

                if(video) {
                    var commnad = {
                        "cmd": "DownloadRecordStop",
                        "window_id": video.window.window_id,
                        "userparam": video.code
                    }

                    if(callback) {
                        setting.stopDownloadCallback = callback;
                    }

                    socket.send(commnad);
                }
            }

            /**
             * 设置状态回调函数
             * @param fn 回调函数
             */
            function _setRecordCallback(fn) {
                if(fn) {
                    setting.recordCb = fn;
                }
            }

            addListener();

            /**
             * 浏览器缩放更新监控布局大小
             */
            function windowResize() {
                _resetLayout();
            }

            $(document).resize(windowResize);

            return {
				setAllWindow: setAllWindow,

                el: setting.el,
                videos: setting.videos,
                play: _play,
                close: _close,
                closeAll: _closeAll,
                max: _max,
                min: _min,
                pause: _pause,
                restore: _restore,
                full: _full,
                exitFull: _exitFull,
                resetLayout: _resetLayout,
                ptzControl: _ptzControl,
                playSound: _playSound,
                snapshot: _snapshot,

                record: _playRecord,
                recordPause: _pauseRecord,
                recordResume: _resumeRecord,
                recordStop: _stopRecord,
                recordStopAll: _stopAllRecords,
                playoneFrame: _oneFrame,
                recordSetSpeed: _setSpeed,
                recordSetPos: _setPos,
                recordDownload: _download,
                stopRecordDownload: _stopDownload,
                recordCallback: _setRecordCallback,

                destroy: _destroy,
            }
        }

        /**
         * 消息提示框
         * @author : zhs
         * @version : 1.0
         * @date : 2019-09-02
        */
        function message() {
            // 消息框属性
            var winParam = {
                "window_playtype": 1,
                "window_isshow": 1,
                "window_opaque": "255",
                "window_ismousetrans": 0,
                "window_x": getSizeByRatio($('body').width()) - 600,
                "window_y": getSizeByRatio(0, 'top') + 90,
                "window_w": 600,
                "window_h": 180
            }

            // 字体图标
            var levelIcon = {
                '1': '√',
                '2': '？',
                '3': '！',
                '4': '×'
            }

            // 颜色
            var levelColor = {
                '1': [0,191,0],
                '2': [0,0,191],
                '3': [191,191,0],
                '4': [191,0,0]
            }

            var msg = null;

            function addListener() {
                // 监听消息框创建
                socket.listen('CreateMsgWindow', function (data) {
                    if(data.result == 'ok') {
                        msg = _.extend(msg, data);
                        if(msg.timeout > 0) {
                            $timeout(function () {
                                _hide(msg.window_id);
                            }, msg.timeout);
                        }
                    } else {
                        iMessage.oshow(msg);
                    }
                });

                // 监听点击事件
                socket.listen('NotifyMsgboxClick', function (data) {
                    // TODO 处理事件
                });
            }

            /**
             * 生成消息框内容
             * @param msg 消息对象
             * @return widget
             */
            function getWidget(msg) {
                var widget = [{
                    "font": 160,
                    "type": "txt",
                    "val": "○",
                    "pos": [10,10,160,160],
                    "border": 0
                }, {
                    "font": 100,
                    "type": "txt",
                    "val": levelIcon[msg.level],
                    "pos": (msg.level == '1' || msg.level == '4') ? [40,40,100,100] : [60,40,100,100],
                    "border": 0,
                    "bg": -2
                }, {
                    "font": 36,
                    "type": "txt",
                    "val": msg.title,
                    "pos": [180,10,600,50],
                    "border": 0
                }, {
                    "font": 17,
                    "type": "txt",
                    "val": msg.time,
                    "pos": [180,70,600,25],
                    "border": 0
                }];

                var content = [{
                    "font": 17,
                    "type": "txt",
                    "val": msg.content,
                    "pos": [180,105,600,75],
                    "border": 0
                }];

                var buttons = [{
                    "id": 'btnhandle',
                    "font": 15,
                    "type": "btn",
                    "val": msg.content,
                    "pos": [180,105,100,50],
                    "border": 0,
                    "bg": [254,174,27]
                }];

                if(msg.type && msg.type == 'btn') {
                    widget = widget.concat(buttons);
                } else {
                    widget = widget.concat(content);
                }

                console.log(widget);

                return widget;
            }

            /**
             * 显示消息框
             * @param info 消息对象
             */
            function _show(info) {
                if(msg) {
                    _hide(msg.window_id);
                }

                msg = {
                    level: info.level || '2',
                    time: info.time || $filter('date')(iTimeNow.getTime(), 'yyyy-MM-dd HH:mm:ss'),
                    title: info.title || '消息提醒',
                    type: info.type || 'txt',
                    content: info.content || '',
                    timeout: 5000,
                    callback: info.scope ? function () {
                        var fn = info.scope[info.fn];
                        if(fn) {
                            fn();
                        }
                    } : null
                }

                var command = _.extend({
                    "cmd": "CreateMsgWindow",
                    "msgbox": {
                        "box": {
                            "bg": levelColor[msg.level],
                            "color": [255,255,255],
                            "border": 0
                        },
                        "widget": getWidget(msg)
                    }
                }, winParam);
                socket.send(command);
            }

            /**
             * 隐藏消息框
             * @param winID 窗口ID
             */
            function _hide(winID) {
                closeWindow(winID);
                msg = null;
            }

            addListener();

            return {
                show: _show,
                hide: _hide
            }
        }

        var imcsMessage = message();

        /**
         * 重写iMessage.show方法
         * @author : zhs
         * @version : 1.0
         * @date : 2019-09-27
        */
        function overrideMessageShow() {
            var originShow = iMessage.show;
            iMessage.show = function(json, checkSame, callScope, scope) {
                if(!json.fn) {
                    imcsMessage.show(json);
                } else {
                    originShow(json, checkSame, callScope, scope);
                }
            }
            iMessage.oshow = originShow;
        }

        /**
         * 判断是否建立连接
         * 提供给外部使用，判断是采用旧的监控方式，还是采用imcs的监控方式
         */
        function isconnect() {
            return socket && socket.isconnect;
        }

        function onVisibilityChange(callback) {
            var visible = true;

            if (!callback) {
                throw new Error('no callback given');
            }

            function focused() {
                if (!visible) {
                    callback(visible = true);
                }
            }

            function unfocused() {
                if (visible) {
                    callback(visible = false);
                }
            }

            // Standards:
            if ('hidden' in document) {
                document.addEventListener('visibilitychange', function() {
                    (document.hidden ? unfocused : focused)();
                });
            } else if ('mozHidden' in document) {
                document.addEventListener('mozvisibilitychange', function() {
                        (document.mozHidden ? unfocused : focused)();
                });
            } else if ('webkitHidden' in document) {
                document.addEventListener('webkitvisibilitychange', function() {
                        (document.webkitHidden ? unfocused : focused)();
                });
            } else if ('msHidden' in document) {
                document.addEventListener('msvisibilitychange', function() {
                    (document.msHidden ? unfocused : focused)();
                });
            } else if ('onfocusin' in document) {
                // IE 9 and lower:
                document.onfocusin = focused;
                document.onfocusout = unfocused;
            } else {
                // All others:
                window.onpageshow = window.onfocus = focused;
                window.onpagehide = window.onblur = unfocused;
            }
        }

        function onWindowFocusChange(callback) {
            var visible = true;
            function focused() {
                if (!visible) {
                    callback(visible = true);
                }
            }

            function unfocused() {
                if (visible) {
                    callback(visible = false);
                }
            }

            window.onpageshow = window.onfocus = focused;
            window.onpagehide = window.onblur = unfocused;
        }

        /**
         * 开启关闭，页面失去焦点隐藏显示窗口
         */
        function toggleAutoWindowChange(value) {
            if(typeof value == 'boolean') {
                socket.isAutoWindowChange = value;
            }
        }

        // 切换标签时
        onWindowFocusChange(function(visible) {
            if(socket.isAutoWindowChange) {
                if(visible) {
                    showAllWindow();
                } else {
                    hideAllWindow();
                }
            }
        });

        /**
         * 获取浏览器状态
         */
        function getBrowserStatus() {

            var zoom = detectZoom();

            if(Math.round(window.innerHeight * zoom) + 1 >= screen.height) {
                return 'full';
            }
            else if(Math.round(window.innerWidth * zoom) == outerWidth) {
                return 'max';
            }
            else {
                return 'shrink';
            }
        }



        return {
            init: init,
            create: create,
            isconnect: isconnect,
            showAll: showAllWindow,
            hideAll: hideAllWindow,
            close: closeWindow,
            message: imcsMessage,
			sendCmd: socket.send,
			addListener: socket.listen,
            exit: exit,
            autoToggleWindow: toggleAutoWindowChange            //开启关闭，根据焦点页面隐藏显示窗口
        }
    }]);
});