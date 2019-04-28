/**
 * Created by YBW on 2020/3/9.
 *
 * 楚瑜2.0
 */
define([
    'app'
], function(app) {
    app.service('safeCommunicationChuyunew', ['safeImcsPlayer', 'showMessage', function(safeImcsPlayer, showMessage){

        //楚榆调度机数据
        var chuyunew = {
            ip: '',
            username: '',
            password: '',
            dataport: '',        //数据端口
            comport: '',        //业务端口
            sdkid: null,        //SDK唯一id
            sdkData: null,      //创建成功数据
            instance: null,     //实例
            event: {},          //socket指令回调信息
            eventSDK: {},       //SDK回调信息
            lines: {},          //通道信息
            videoCall: [],    //视频呼叫对象
            videoMeeting: []    //视频会议对象
        };

        /**
         * 楚榆2.0初始化
         */
        function initCYN(callback) {
            var dispatcher = showMessage(null, null, {getDispatcher: true});
            if(dispatcher.ip && dispatcher.port && dispatcher.businessPort && dispatcher.userName && dispatcher.userPassword) {
                chuyunew.ip = dispatcher.ip;
                chuyunew.dataport = dispatcher.port;
                chuyunew.comport = dispatcher.businessPort;
                chuyunew.username = dispatcher.userName;
                chuyunew.password = dispatcher.userPassword;
            } else {
                showMessage(3, '调度机初始化失败!');
                return false;
            }

            //监听成功建立socket
            safeImcsPlayer.addListener('NotifyConnSuccess', function () {

                //创建楚榆SDK
                safeImcsPlayer.sendCmd({
                    "cmd": "sdkCreate",
                    "devtype": "ChuyuSoftPhone"
                });

            });

            //监听成功创建SDK
            safeImcsPlayer.addListener('sdkCreate', function(data) {
                chuyunew.sdkid = data.sdkid;
                chuyunew.sdkData = data;
            });

            //初始化监听SKD响应事件
            initSDKMonitorCYN();
            //初始化监听socket执行结果
            initExecuteResultCYN();
            //监听SDK初始化完成事件
            addSDKMonitorCYN('onImcsProcessInit', function() {

                //创建实例
                sendEventCYN({
                    "sdkcmd": "chuyu_CreateInstance"
                });

                //监听实例
                addListenerCYN('chuyu_CreateInstance', function(status, data) {
                    if(status == 'success') {
                        chuyunew.instance = data;
                    }
                }, true);

                //登录
                sendEventCYN({
                    "sdkcmd": "chuyu_Login",
                    "server_ip": chuyunew.ip,
                    "sip_port": chuyunew.comport,
                    "uname": chuyunew.username,
                    "pwd": chuyunew.password
                });

                addSDKMonitorCYN('Login', function(data) {
                    if(data.msg.nError != '0') {
                        showMessage(3, '调度机初始化失败!');
                    }

                    callback && callback();
                }, true);
            }, true);

            //监听创建窗口事件
            listenerCreateWindow();


            //监听手机操作
            addSDKMonitorCYN('PhoneLineState', function(data) {
                if(data && data.msg && data.msg.nError == 0) {
                    if(data.msg.lineState && data.msg.lineState.line != null) {
                        answerCall(data);
                    }
                }

            });

        }

        /**
         * 通过socket发送指令到楚榆
         */
        function sendEventCYN(data, tag) {
            safeImcsPlayer.sendCmd({
                cmd: "sdkExec",
                sdkid: String(chuyunew.sdkid),
                req: data,
                userparam: String(tag)
            });
        }

        /**
         * 监听执行结果 and 广播事件
         */
        function initExecuteResultCYN(){
            safeImcsPlayer.addListener('sdkExec', function(data) {
                var funs,
                    name;
                if(data && data.req && data.req.sdkcmd && chuyunew.event[data.req.sdkcmd]) {
                    funs = chuyunew.event[data.req.sdkcmd];
                    name = data.req.sdkcmd;
                }
                else if(data && data.resp && data.resp.sdkcmd && chuyunew.event[data.resp.sdkcmd]) {
                    funs = chuyunew.event[data.resp.sdkcmd];
                    name = data.resp.sdkcmd;
                }

                if(funs) {

                    funs.map(function(o) {
                        if(o) {
                            var result = 'success';
                            if(data.result != 'ok') {
                                result = 'error';
                            }
                            o(result, data);

                            if(o.isOneOff && name) {
                                clearListenerCYN(name, o);
                            }
                        }
                    });

                }
            });
        }

        /**
         * 添加监听事件
         */
        function addListenerCYN(name, callback, isOneOff) {

            if(name && callback) {
                callback.isOneOff = isOneOff;
                if(chuyunew.event[name]) {
                    chuyunew.event[name].push(callback);
                }
                else {
                    chuyunew.event[name] = [callback];
                }
            }
        }

        /**
         * 清除监听事件
         */
        function clearListenerCYN(name, callback) {
            if(name && callback) {

                var num = [];
                chuyunew.event[name].map(function(o, i) {
                    if(callback === o) {
                        num.push(i);
                    }
                });

                num.map(function(o) {
                    chuyunew.event[name].splice(o, 1);
                });
            }
        }

        /**
         * 初始化监听SDK
         */
        function initSDKMonitorCYN() {
            safeImcsPlayer.addListener('NotifySdkMsg', function(data) {
                if(data && data.event) {

                    var funs;

                    if(data && data.event && chuyunew.eventSDK[data.event]) {
                        funs = chuyunew.eventSDK[data.event];
                    }

                    if(funs) {
                        funs.map(function(o) {
                            if(o) {
                                o(data);
                            }

                            if(o.isOneOff && data.event) {
                                clearSDKMonitorCYN(data.event, o);
                            }
                        });
                    }
                }
            });
        }

        /**
         * 添加监听SDK事件
         */
        function addSDKMonitorCYN(name, callback, isOneOff) {
            if(name && callback) {
                callback.isOneOff = isOneOff;
                if(chuyunew.eventSDK[name]) {
                    chuyunew.eventSDK[name].push(callback);
                }
                else {
                    chuyunew.eventSDK[name] = [callback];
                }
            }
        }

        /**
         * 清除SDK监听事件
         */
        function clearSDKMonitorCYN(name, callback) {
            if(name && callback) {

                var num = [];
                chuyunew.eventSDK[name].map(function(o, i) {
                    if(callback === o) {
                        num.push(i);
                    }
                });

                num.map(function(o) {
                    chuyunew.eventSDK[name].splice(o, 1);
                });
            }
        }


        /**
         * 接口请求
         */
        function sendRequest(url,callback) {

            $.ajax({
                type: 'post',
                url: 'http://'+ window.location.host +'/sys/provider.do?action=sendRequest',
                dataType: 'jsonp',
                jsonp: 'callback',
                async: true,
                jsonpCallback: 'success',
                data: {
                    url: url,
                    callback: 'jsonp'
                },
                success:function(result){
                    if(callback){
                        callback(result);
                    }
                }
            });

        }

        /**
         * 分析应答呼叫
         */
        function answerCall(data) {

            //视频通话
            if(data.msg.lineState.szStat == 'CC_LINE_STATE_IDLE' && data.msg.lineState.media_type == '3' && data.msg.tag == '32') {
                chuyunew.videoCall.map(function(o) {
                    var video = _.find(o.videos, {line: data.msg.lineState.line});
                    if(video) {
                        o.kickMeeting(video.phoneNumber);
                    }
                });
            }

            //视频会议
            else if(data.msg.lineState.szStat == 'CC_LINE_STATE_RINGING' && data.msg.lineState.media_type == '3' && data.msg.tag == '0') {

                answerVideoCall(data);

            }

            //音频呼叫
            else {

                //接通
                sendEventCYN({
                    "sdkcmd": "chuyu_AnswerCall",
                    "line": data.msg.lineState.line
                });
            }
        }

        /**
         * 应答视频呼叫
         */
        function answerVideoCall(data) {

            if(data && data.msg && data.msg.lineState && data.msg.lineState.remote_number) {

                var videoMeeting = _.find(chuyunew.videoMeeting, {roomid: data.msg.lineState.remote_number});
                if(videoMeeting) {

                    var windowId = [];

                    videoMeeting.videos.map(function(o) {
                        if(o.windowId) {
                            windowId.push(o.windowId);
                        }
                    });

                    setTimeout(function() {
                        if(windowId.length >= 1) {

                            sendEventCYN({
                                "sdkcmd": "chuyu_AnswerCall",
                                "line": data.msg.lineState.line,
                                "nMediaType": "3",
                                "hwndLocal": "0",
                                "hwndRemote": windowId[0],
                                "SendVideo": "1"
                            });

                        } else {
                            answerVideoCall(data);
                        }
                    }, 300);

                }

            }

        }


        /**
         *********************************************              视频呼叫               *********************************************
         */

        /**
         * 视频呼叫对象
         */
        function VideoCall(phoneNumbers, element, callback) {

            this.id = randomId();
            this.element = element;
            this.phoneNumbers = phoneNumbers;
            this.layout = countLayout(this.phoneNumbers.length);
            this.rows = this.layout.length;
            this.cols = this.layout[0].length;
            this.videos = initVideoData(this.phoneNumbers, this.layout);
            var that = this;

            countLocationSize(this.videos, this.element, {
                rows: this.rows,
                cols: this.cols
            });

            this.videos.map(function(o) {

                createWindow(o, function(data) {
                    o.window = data;
                    if(data && data.window_id) {
                        o.windowId = data.window_id;
                        startSendMeeting();
                    }
                });

            });

            element.attr('ChuyunewVidoeMeetingId', this.id);

            function startSendMeeting() {

                var isGetWindow = true;
                that.videos.map(function(o) {
                    if(!o.windowId) {
                        isGetWindow = false;
                    }
                });

                if(isGetWindow) {
                    that.sendVideoCall(that.videos, callback);
                }
            }


        }

        /**
         * 更新布局
         */
        VideoCall.prototype.updateLayout = function() {

            countLocationSize(this.videos, this.element, {rows: this.rows, cols: this.cols});

            this.videos.map(function(o, i) {

                if(o.windowId) {
                    safeImcsPlayer.sendCmd({
                        cmd: "SetWindow",
                        window_id: o.windowId,
                        window_x: o.x,
                        window_y: o.y,
                        window_w: o.width,
                        window_h: o.height,
                        window_isshow: "1",
                        window_opaque: o.opacity,
                        window_ismousetrans: "1",
                        window_istop: "1"
                    });
                }

            });

        };

        /**
         * 通过socket发出视频邀请
         */
        VideoCall.prototype.sendVideoCall = function(videos, callback) {

            var isGetWindow = true;
            var local = _.find(this.videos, {phoneNumber: 'local'});
            var that = this;

            videos.map(function(o) {
                if(!o.windowId) {
                    isGetWindow = false;
                }
            });

            if(isGetWindow) {

                var num = -1;
                start();

                function start() {

                    num++;

                    if(num >= videos.length) {
                        callback && callback();
                        return false;
                    }

                    var video = videos[num];


                    if(video && video.phoneNumber != 'local') {

                        //获取线路
                        sendEventCYN({
                            "sdkcmd": "chuyu_GetIdleLine"
                        }, video.phoneNumber);

                        //监听获取线路结果
                        addListenerCYN('chuyu_GetIdleLine', function(status, data) {
                            if (status == 'success') {
                                if (data.resp && data.resp.result >= 0 && data.userparam == video.phoneNumber) {

                                    video.line = data.resp.result;

                                    //发起语音呼叫
                                    sendEventCYN({
                                        "sdkcmd": "chuyu_MakeCall",
                                        //"instance": String(chuyunew.instance.resp.instance),
                                        "number": String(video.phoneNumber),
                                        "line": String(video.line),
                                        "hwndLocal": String(local.windowId),
                                        "hwndRemote": String(video.windowId),
                                        "nMediaType": "3",
                                        "SendVideo": "1"
                                    }, video.phoneNumber);

                                    addListenerCYN('chuyu_MakeCall', function(status, data) {
                                        if(status == 'success' && data && data.userparam == video.phoneNumber) {
                                            setTimeout(function() {
                                                start();
                                            }, 300);
                                        }
                                    }, true);

                                }
                            }
                        }, true);

                    }
                    else {
                        start();
                    }

                }

            }
        };

        /**
         * 邀请新视频成员
         */
        VideoCall.prototype.addVideo = function(phoneNumber, callback) {

            this.phoneNumbers.push(phoneNumber);
            this.layout = countLayout(this.phoneNumbers.length);
            this.rows = this.layout.length;
            this.cols = this.layout[0].length;
            this.videos = initVideoData(this.phoneNumbers, this.layout, this.videos);
            var video = _.find(this.videos, {phoneNumber: phoneNumber});

            countLocationSize(this.videos, this.element, {
                rows: this.rows,
                cols: this.cols
            });

            var that = this;

            createWindow(video, function(data) {
                video.window = data;
                if(data && data.window_id) {
                    video.windowId = data.window_id;
                    that.updateLayout();
                    that.sendVideoCall([video], callback);
                }
            });
        };

        /**
         * 挂断视频呼叫
         */
        VideoCall.prototype.kickMeeting = function(phoneNumber, callback) {

            var index = _.findIndex(this.videos, {phoneNumber: phoneNumber});

            if(index == -1) {
                return false;
            } else if(this.phoneNumbers.length <= 2) {
                this.meetingEnd(callback);
            }

            var PHT = [];
            this.phoneNumbers.map(function(o) {
                if(o != phoneNumber) {
                    PHT.push(o);
                }
            });
            this.phoneNumbers = PHT;
            this.layout = countLayout(this.phoneNumbers.length);
            this.rows = this.layout.length;
            this.cols = this.layout[0].length;
            var video = this.videos.splice(index, 1)[0];
            initVideoData(this.phoneNumbers, this.layout, this.videos);
            countLocationSize(this.videos, this.element, {
                rows: this.rows,
                cols: this.cols
            });

            //关闭监控
            closeWindow(video.windowId);

            //更新布局
            this.updateLayout();

            //获取线路
            sendEventCYN({
                "sdkcmd": "chuyu_HangUpCall",
                line: video.line
            }, video.phoneNumber);

            addListenerCYN('chuyu_HangUpCall', function(status, data) {
                if(status == 'success' && data && data.userparam == video.phoneNumber) {
                    callback && callback(data);
                }
            }, true);


        };

        /**
         * 结束视频通话
         */
        VideoCall.prototype.meetingEnd = function(callback) {

            var id = this.id;

            this.videos.map(function(o) {
                //关闭窗口
                closeWindow(o.windowId);
            });

            //结束会议
            sendEventCYN({
                "sdkcmd": "chuyu_HangUpAllLine"
            }, id);

            //监听结果
            addListenerCYN('chuyu_HangUpAllLine', function(status, data) {
                if(status == 'success' && data && data.userparam == id) {
                    var index = _.find(chuyunew.videoCall, {id: id});
                    chuyunew.videoCall.splice(index, 1);
                    callback && callback(data);
                }
            }, true);
        };


        /**
         *********************************************              视频会议               *********************************************
         */

        /**
         * 视频会议对象
         */
        function VideoMeeting(phoneNumbers, element, callback) {

            if(!phoneNumbers || !phoneNumbers.length || !element) {
                console.info('初始化视频会议失败，缺少必要参数。');
            }

            this.id = randomId();
            this.roomid = '9000';
            this.phoneNumbers = phoneNumbers;
            this.element = element;
            this.intervalUpdateLayou = null;
            this.updateData();
            var that = this;

            element.attr('ChuyunewVidoeMeetingId', this.id);

            createWindow(that.videos[0], function(data) {
                that.videos[0].window = data;
                if(data && data.window_id) {
                    that.videos[0].windowId = data.window_id;
                }
            });

            that.phoneNumbers.map(function(o, i) {
                setTimeout(function() {
                    var url = 'http://'+ chuyunew.ip +':'+ chuyunew.dataport +'/api/client/invite2videoconf.php?roomid='+ that.roomid +'&callee=' + o;
                    sendRequest(url, function(data) {

                        if(data && data.result && data.result.st == '0' && callback) {
                            if(callback) {
                                callback(data);
                                callback = null;
                            }
                        }

                    }, 300 * i);
                });
            });


        }

        /**
         * 更新数据
         */
        VideoMeeting.prototype.updateData = function() {

            this.width = this.element.width();
            this.height = this.element.height();
            this.layout = countLayout(1);
            this.rows = this.layout.length;
            this.cols = this.layout[0].length;
            this.videos = initVideoData(this.phoneNumbers.slice(0, 1), this.layout, this.videos);
            countLocationSize(this.videos, this.element, {
                rows: this.rows,
                cols: this.cols
            });

        };

        /**
         * 更新窗口布局
         */
        VideoMeeting.prototype.updateLayout = function() {

            countLocationSize(this.videos, this.element, {rows: this.rows, cols: this.cols});

            this.videos.map(function(o, i) {

                if(o.windowId) {
                    safeImcsPlayer.sendCmd({
                        cmd: "SetWindow",
                        window_id: o.windowId,
                        window_x: o.x,
                        window_y: o.y,
                        window_w: o.width,
                        window_h: o.height,
                        window_isshow: "1",
                        window_opaque: o.opacity,
                        window_ismousetrans: "1",
                        window_istop: "1"
                    });
                }

            });

        };

        /**
         * 加入视频会议
         */
        VideoMeeting.prototype.meetingJoin = function(phoneNumber, callback) {
            this.phoneNumbers.push(phoneNumber);

            var url = 'http://'+ chuyunew.ip +':'+ chuyunew.dataport +'/api/client/invite2videoconf.php?roomid='+ this.roomid +'&callee=' + phoneNumber;
            sendRequest(url, function(data) {
                if(data && data.result && data.result.st == '0' && callback) {
                    callback(data);
                    callback = null;
                }
            });
        };

        /**
         * 结束会议
         */
        VideoMeeting.prototype.meetingEnd = function(callback) {

            var index = _.findIndex(chuyunew.videoMeeting, {id: this.id});
            chuyunew.videoMeeting.splice(index, 1);

            var time = new Date().getTime();
            var sign = chuyunew.username + time + chuyunew.password;

            var url = 'http://'+ chuyunew.ip +':'+ chuyunew.dataport +'/api/client/end_videoconf.php?roomid=' + this.roomid + '&usernumber=' + chuyunew.username + '&timestamp=' + time + '&sign=' + hex_md5(sign);
            sendRequest(url, function(data) {
                if(data && data.result && data.result.code == '0' && callback) {
                    callback(data);
                    callback = null;
                }
            });

            if(this.videos[0] && this.videos[0].windowId) {
                closeWindow(this.videos[0].windowId);
            }

            clearInterval(this.intervalUpdateLayou);
        };

        /**
         * 创建窗口
         */
        function createWindow(params, callback) {

            safeImcsPlayer.sendCmd({
                cmd: "SdkCreateWindow",
                window_w: params.width || 100,
                window_h: params.height || 100,
                window_x: params.x || 0,
                window_y: params.y || 0,
                window_isshow: 1,
                window_istop: 1,
                window_ismousetrans: 1,
                window_opaque: params.opacity || 100,
                sdkid: chuyunew.sdkid,
                userparam: String(params.phoneNumber)
            });

            addListenerCYN(params.phoneNumber, callback, true);

        }

        /**
         * 监听创建窗口成功事件
         */
        function listenerCreateWindow() {

            //监听创建窗口事件
            safeImcsPlayer.addListener('SdkCreateWindow', function(data) {
                if(data && data.window_id) {

                    if(data.userparam && chuyunew.event[data.userparam]) {
                        chuyunew.event[data.userparam].map(function(o) {
                            o && o(data);

                            if(o.isOneOff && data.userparam) {
                                clearListenerCYN(data.userparam, o);
                            }
                        });
                    }
                }
            });
        }

        /**
         * 关闭窗口
         */
        function closeWindow(id) {

            safeImcsPlayer.sendCmd({
                cmd: "CloseWindow",
                window_id: id,
                userparam: "cache_5"
            });
        }

        /**
         * 计算布局
         */
        function countLayout(num) {
            var result = [];
            var x = 0;
            var y = 0;
            var location = 0;
            var direction = 'x';

            for(var i = 1; i <= num; i++) {

                switch (direction) {
                    case 'x':

                        if(!result[x]) {
                            result[x] = [];
                        }

                        result[x][location] = i;
                        location++;

                        if(location > y) {
                            direction = 'y';
                            location = 0;
                            y++;
                        }

                        break;
                    case 'y':

                        result[location][y] = i;
                        location++;

                        if(location > x) {
                            direction = 'x';
                            location = 0;
                            x++;
                        }

                        break;
                }

            }


            var length = result[0].length;
            var cols = 0;
            var rows = 0;

            for(var j = 1; j <= num; j++) {
                result[rows][cols] = j;
                cols++;

                if(cols >= length) {
                    cols = 0;
                    rows++;
                }

            }

            return result;
        }

        /**
         * 计算位置大小
         */
        function countLocationSize(videos, element, params) {

            var width = element.width() / params.cols,
                height = element.height() / params.rows;
            var left = element.offset().left,
                top = element.offset().top,
                browser = 0,
                screenLeft = 0,
                screenTop = 0;

            if(!isFull()) {
                browser = window.outerHeight - window.innerHeight;
                screenLeft = window.screenLeft;
                screenTop = window.screenTop;
            }

            if(!isBrowserMax()) {
                browser -= 8;
                screenLeft += 8;
            }

            videos.map(function(o) {
                o.width = Math.floor(width);
                o.height = Math.floor(height);
                o.x = Math.ceil(o.cols * width + left + screenLeft);
                o.y = Math.ceil(o.rows * height + top + screenTop + browser);
            });

        }

        /**
         * 初始化Video数据
         */
        function initVideoData(phoneNumbers, layout, videos) {

            var result = videos || [];

            layout.map(function(o, y) {
                o.map(function(k, x) {

                    if(result[k - 1]) {
                        var obj = result[k - 1];

                        obj.phoneNumber = phoneNumbers[k - 1];
                        obj.rows = y;
                        obj.cols = x;
                        obj.index = k;
                        obj.opacity = 255;

                    }
                    else {

                        var video = {
                            phoneNumber: phoneNumbers[k - 1],
                            width: 0,
                            height: 0,
                            rows: y,
                            cols: x,
                            index: k,
                            opacity: 255,
                            x: 0,
                            y: 0,
                            windowId: null,
                            line: null
                        };
                        result.push(video);

                    }



                });
            });

            return result;

        }

        /**
         * 判断是否全屏
         */
        function isFull() {
            return (window.innerHeight + 1 >= screen.height);
        }

        /**
         * 判断浏览器是否最大
         */
        function isBrowserMax() {
            if(isFull()) {
                return true;
            }
            else {
                return (innerWidth == outerWidth);
            }
        }

        /**
         * 随机id
         */
        function randomId() {

            var id = '';
            var values = [
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
                'K', 'L', 'N', 'M', 'O', 'P', 'Q', 'R', 'S', 'T',
                'U', 'V', 'W', 'X', 'Y', 'Z'
            ];
            for(var i = 0; i < 32; i++) {
                id += values[Math.floor(Math.random() * 36)]
            }

            return id;
        }


        return {
            /**
             * 初始化
             */
            init: initCYN,

            /**
             * 开启电话会议
             */
            startAdvConf: function(phoneNumbers, callback) {
                var num = 1;

                if(phoneNumbers.length >= num) {
                    GetIdleLine();
                }

                function GetIdleLine() {
                    var phone = String(phoneNumbers[num - 1]);

                    //获取线路
                    sendEventCYN({
                        "sdkcmd": "chuyu_GetIdleLine"
                    }, phone);

                    //监听获取线路结果
                    addListenerCYN('chuyu_GetIdleLine', function(status, data) {
                        if(status == 'success') {
                            if(data.resp && data.resp.result >= 0 && data.userparam == phone) {

                                if(typeof phone == 'string') {

                                    chuyunew.lines[phone] = data.resp.result;

                                    //发起语音呼叫
                                    sendEventCYN({
                                        "sdkcmd": "chuyu_MakeCall",
                                        "number": phone,
                                        line: data.resp.result,
                                        nMediaType: 1,
                                        SendVideo: 0
                                    });

                                    if(phoneNumbers.length > num) {
                                        num++;
                                        setTimeout(function() {
                                            GetIdleLine();
                                        }, 300);
                                    }

                                }


                            }

                        }

                    }, true);

                }



                //监听呼叫结果
                addListenerCYN('chuyu_MakeCall', function(status, data) {
                    if(status == 'success') {
                        callback && callback();
                    }
                }, true);

            },

            /**
             * 会议成员邀请
             */
            advConfInvite: function(phoneNumber, callback) {

                //获取线路
                sendEventCYN({
                    "sdkcmd": "chuyu_GetIdleLine"
                }, phoneNumber);

                //监听获取线路结果
                addListenerCYN('chuyu_GetIdleLine', function(status, data) {
                    if(status == 'success') {
                        if(data.resp && data.resp.result >= 0 && data.userparam == phoneNumber) {

                            var phone = String(phoneNumber);
                            if(typeof phone  == 'string') {

                                chuyunew.lines[phone] = data.resp.result;

                                //发起语音呼叫
                                sendEventCYN({
                                    "sdkcmd": "chuyu_MakeCall",
                                    "number": phone,
                                    "line": data.resp.result
                                });

                                addListenerCYN('chuyu_MakeCall', function(status) {
                                    if(status == 'success') {
                                        callback && callback();
                                    }
                                }, true);
                            }

                        }

                    }

                }, true);

            },

            /**
             * 会议成员踢出
             */
            advConfKick: function(phoneNumber, callback) {

                if(phoneNumber && chuyunew.lines[phoneNumber] != null) {

                    var line = chuyunew.lines[phoneNumber];
                    delete chuyunew.lines[phoneNumber];

                    //获取线路
                    sendEventCYN({
                        "sdkcmd": "chuyu_HangUpCall",
                        line: line
                    });

                    addListenerCYN('chuyu_HangUpCall', function(status, data) {
                        if(status == 'success') {
                            callback && callback();
                        }
                    }, true);
                }
            },

            /**
             * 结束会议
             */
            hangUp: function(callback) {

                //结束会议
                sendEventCYN({
                    "sdkcmd": "chuyu_HangUpAllLine"
                });

                //监听结果
                addListenerCYN('chuyu_HangUpAllLine', function(status, data) {
                    if(status == 'success') {
                        callback && callback();
                    }
                }, true);

                chuyunew.lines = {};

            },

            /**
             * 开启视频会议
             * @phoneNumbers 号码
             * @element 显示会议element
             * @callback 回调函数
             * @isAutoUpdateLayout 是否开启自动调整布局位置
             */
            videoMeeting: function(phoneNumbers, element, callback, isAutoUpdateLayout) {

                var el = $(element);
                if(el.length) {

                    phoneNumbers.unshift(chuyunew.username);
                    phoneNumbers.map(function(o, i) {
                        phoneNumbers[i] = String(o);
                    });
                    var video = new VideoMeeting(phoneNumbers, el, callback);
                    chuyunew.videoMeeting.push(video);

                    if(isAutoUpdateLayout) {
                        video.intervalUpdateLayou = setInterval(function() {
                            video.updateLayout();
                        }, 1000);
                    }

                }
                else {
                    console.info('开启视频会议失败，element元素无法使用！');
                    return false;
                }

                return video;
            },

            /**
             * 邀请视频会议
             * @phoneNumber 号码
             * @id 会议对象id
             * @callback 回调函数
             */
            videoJoin: function(phoneNumber, id, callback) {

                var video = _.find(chuyunew.videoMeeting, {id: id});
                if(video) {
                    video.meetingJoin(String(phoneNumber), callback);
                }

            },

            /**
             * 结束视频会议
             * @id 会议对象id
             * @callback 回调函数
             */
            videoMeetingEnd: function(id, callback) {

                var video = _.find(chuyunew.videoMeeting, {id: id});
                if(video) {
                    video.meetingEnd(callback);
                }

            },

            /**
             * 一对一视频呼叫
             * @phoneNumber 号码
             * @element 显示会议element
             * @callback 回调函数
             */
            videoCall: function(phoneNumber, element, callback) {

                var el = $(element);
                if(el.length) {
                    var video = new VideoCall(['local', String(phoneNumber)], el, callback);
                }
                else {
                    console.info('开启视频会议失败，element元素无法使用！');
                    return false;
                }

                chuyunew.videoCall.push(video);

                return video;

            },

            /**
             * 结束视频呼叫
             * @id 会议对象id
             * @callback 回调函数
             */
            videoCallEnd: function(id, callback) {

                var video = _.find(chuyunew.videoCall, {id: id});
                if(video) {
                    video.meetingEnd(callback);
                }

            }


        };  // return end



    }]);
});
