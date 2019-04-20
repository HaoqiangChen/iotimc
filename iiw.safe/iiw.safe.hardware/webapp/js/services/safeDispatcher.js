/**
 * Created by zcl on 2016/4/19.
 */
define(['app'], function(app) {
    app.service('safeDispatcher', ['iMessage', 'iAjax', '$timeout', 'safeSound', '$interval', '$filter', 'iTimeNow', 'safeHardware', function(iMessage, iAjax, $timeout, safeSound, $interval, $filter, iTimeNow, safeHardware) {
        var dispatcherDevice = null,
            _ipDispatcher = null,
            mode = null,
            init = false,
            oBstrCallId = {},
            callInNumber = null,        //呼入号码
            answerFlag = false,         //接听来电标识
            interphoneList = [],

            bNoDischarge = false,      // 转接请求标识，防止多次转接
            transferCall = false,      // 是否需要转接标识，定时器超时时，将标识置为TRUE
            callID = null,             // 缓存呼入调度台时的CALLID，用于转接放行时判断主被叫是否为“呼入号码”和“转接号码”
            callInTalkID = null,       // 缓存呼入调度台时的TALKID，用于自动转接时，模拟调度台摘机使用
            oTime = null,              // 定时器对象句柄
            bTimeStart = false;        // 转接请求标识，防止多次转接

        //媒体类型
        var MEDIA_TYPE = {
            MEDIA_TYPE_NONE: 0,             //无媒体类型
            MEDIA_TYPE_AUDIO: 1,            //语音类型
            MEDIA_TYPE_VIDEO: 2,            //视频类型
            MEDIA_TYPE_AUDIOVIDEO: 3       //语音视频类型
        };

        //高级会议的成员状态
        var MUTE_MEMBER_MODE = {
            CALLING: -3,
            KICKOUT: -1,
            OUT: -2,
            NOTCOME: 0,
            SAYING: 1,
            LISTENING: 2,
            HANDSUP: 3
        };

        var sFunc = {
            'onPhoneStateEvent': function() {
            },
            'onPhoneLineStateEvent': function(nLine, nState) {
                switch (nState) {
                    case 0:
                        break;
                    case 1:
                        if (answerFlag != true) {
                            var number = _ipDispatcher.GetRemoteNumberjs(nLine);
                            if (number != '00000000') {
                                //呼入号码是否在黑名单中
                                var flag = false;
                                if (number.length > 11) {
                                    number = number.substr(number.length - 11, number.length);
                                }
                                checkNumber(number).then(function(data) {
                                    if (data.status == '1' && data.result.rows.length > 0) {
                                        var params = data.result.rows[0];
                                        params.number = number;
                                        flag = (params.isblack == 1) ? true : false;
                                        //判断该号码是否加入黑名单，如已加入则自动挂断
                                        if (flag) {
                                            var nlineMediaType = _ipDispatcher.GetMediaTypeJS(nLine);
                                            var code = _ipDispatcher.AnswerCall(nLine, nlineMediaType);
                                            if (code == 0) {
                                                $timeout(function() {
                                                    _ipDispatcher.HangupCall(nLine);
                                                }, 1000);
                                            }
                                        } else {
                                            $('.call-panel-btn-hangup').show();
                                            $('.call-panel-btn-answer').show();
                                            params.content = '呼叫调度台';
                                            params.devicefk = dispatcherDevice.id;
                                            saveCallAlarm(params);     //保存报警记录
                                            safeSound.playMessage(number + '呼叫调度台');
                                            callInNumber = number;
                                            $('.safe-alarm-call-panel').show();
                                            var calltime = $filter('date')(iTimeNow.getTime(), 'yyyy-MM-dd HH:mm:ss');
                                            $('.safe-alarm-call-in-time').text(calltime);
                                            //显示设备所属区域及号码类型信息
                                            showNumberAreaInfo(params);
                                            //开始启动定时器，超过系统预设时间未接听，则自动进行转接
                                            $timeout(function() {
                                                //如调度台未接听，如系统配置了转接号码则自动进行呼叫转接
                                                if (!answerFlag && dispatcherDevice.transfernumber) {
                                                    var nlineMediaType = _ipDispatcher.GetMediaTypeJS(nLine);
                                                    var code = _ipDispatcher.AnswerCall(nLine, nlineMediaType);
                                                    if (code == 0) {
                                                        //开始转接
                                                        $timeout(function() {
                                                            $('.safe-alarm-call-number').html('超时未接听，来电已转接至<br>' + dispatcherDevice.transfernumber);
                                                            $('.safe-alarm-call-area').text('');
                                                            _ipDispatcher.BlindTransfer(nLine, dispatcherDevice.transfernumber);
                                                        }, 1000);
                                                    }
                                                }
                                            }, (dispatcherDevice.transfertime ? dispatcherDevice.transfertime : 15) * 1000);
                                        }
                                    }
                                });
                            }
                        }
                        break;
                    case 2 :
                        //线路等待回铃
                        break;
                    case 3 :
                        //线路回铃;
                        break;
                    case 4 :
                        //线路通话;
                        break;
                    case 5 :
                        //线路保持;
                        break;
                    default :
                        break;
                }
            },
            'onSendMessage': function() {
            },
            'onPhoneGroupEvent': function() {
            },
            'onGetWatchNumberEvent': function() {
            },
            'onAdvConfMemberStateUpDateEvent': function(bstrCallId, bstrMember) {
                var aMember = bstrMember.split(';'),
                    aMemberAndStatus, number, status;
                for (var i = 0; i < aMember.length; i++) {
                    aMemberAndStatus = aMember[i].split(',');
                    number = aMemberAndStatus[0];
                    status = aMemberAndStatus[1];
                    if (status == MUTE_MEMBER_MODE.CALLING) {
                        oBstrCallId[number] = bstrCallId;
                    }
                }
            },
            'onSubscriberStatusChangeEvent': function() {
            },
            'onGetPTTGroupList': function() {
            },
            'onPTTGroupChangedEvent': function() {
            },
            'onGisEvent': function() {
            }
        };

        var decCallEventListener = function(type, params) {
            var data = JSON.parse(params);

            var sNum = dispatcherDevice.transfernumber;  // 转接号码
            var scaller = null;           // 主叫号码
            var scallee = null;           // 被叫号码
            var sendData = null;
            var cmpRet, cmpRet2;

            switch (type) {
                case 1:
                    if (data.cmd == 'Start' && data.result != 0) {
                        showMessage(4, '调度机初始化失败!');
                    }

                    if (data.cmd == 'Start' && data.result == 0) {
                        init = true;
                    }
                    break;
                case 8:
                    //console.log(" obj_OnTalkUpdate 事件，　eventtype ：" + data.eventtype + ", talkid : " + data.talkid + ", callid: " + data.callid + ", error: " + data.error);
                    if (data.error == 0) {
                        switch (data.eventtype) {
                            case 0:
                                break;
                            case 1:
                                // 呼叫ACK事件
                                break;
                            case 2:
                                // 呼入事件，开始计时，超时自动转接
                                callInTalkID = data.talkid;
                                callID = data.callid;
                                transferCall = false;
                                //console.log("调度台有呼入电话，启动定时器");
                                //startTime();
                                var number = callID.split(',')[0];
                                //呼入号码是否在黑名单中
                                var flag = false;
                                checkNumber(number).then(function(data) {
                                    if (data.status == '1' && data.result.rows.length > 0) {
                                        var params = data.result.rows[0];
                                        params.number = number;
                                        flag = (params.isblack == 1) ? true : false;
                                        //判断该号码是否加入黑名单，如已加入则自动挂断
                                        if (flag) {
                                            sendData = '{"callid": "' + callID + '"}';
                                            _ipDispatcher.Exec('OnhookSpecific', sendData);
                                        } else {
                                            $('.call-panel-btn-hangup').show();
                                            $('.call-panel-btn-answer').show();
                                            params.content = '呼叫调度台';
                                            params.devicefk = dispatcherDevice.id;
                                            //保存报警记录
                                            saveCallAlarm(params);
                                            safeSound.playMessage(number + '呼叫调度台');
                                            callInNumber = number;
                                            $('.safe-alarm-call-panel').show();
                                            var calltime = $filter('date')(iTimeNow.getTime(), 'yyyy-MM-dd HH:mm:ss');
                                            $('.safe-alarm-call-in-time').text(calltime);
                                            //显示设备所属区域及号码类型信息
                                            showNumberAreaInfo(params);
                                            if (!bTimeStart) {
                                                //开始启动定时器，超过系统预设时间未接听，则自动进行转接
                                                oTime = $timeout(function() {
                                                    //如调度台未接听，如系统配置了转接号码则自动进行呼叫转接
                                                    if (dispatcherDevice.transfernumber) {
                                                        $('.safe-alarm-call-number').html('超时未接听，来电已转接至<br>' + dispatcherDevice.transfernumber);
                                                        $('.safe-alarm-call-area').text('');
                                                        //开始转接
                                                        autoOffhook();
                                                    }
                                                }, (dispatcherDevice.transfertime ? dispatcherDevice.transfertime : 15) * 1000);
                                                //console.log("定时器已经启动");
                                            }
                                        }
                                    }
                                });
                                break;
                            case 3:
                                // 振铃事件
                                // 获取主叫号码和被叫号码
                                sendData = '{"talkid": "' + data.talkid + '", "exec_sync":"1"}';
                                scaller = JSON.parse(_ipDispatcher.Exec('TalkGetCaller', sendData));

                                sendData = '{"talkid": "' + data.talkid + '", "exec_sync":"1"}';
                                scallee = JSON.parse(_ipDispatcher.Exec('TalkGetCallee', sendData));

                                sendData = '{"c1": "' + callID + '", "c2": "' + scaller.result + '", "strict": "1", "exec_sync":"1"}';
                                cmpRet = JSON.parse(_ipDispatcher.Exec('CallIDCmp', sendData));

                                sendData = '{"c1": "' + dispatcherDevice.transfernumber + '", "c2": "' + scallee.result + '", "strict": "1", "exec_sync":"1"}';
                                cmpRet2 = JSON.parse(_ipDispatcher.Exec('CallIDCmp', sendData));

                                //console.log(" 振铃事件 scaller=" + scaller.result + ", scallee=" + scallee.result);
                                //console.log(" 振铃事件 CallIDCmp scaller=" + cmpRet.result + ",  CallIDCmp scallee=" + cmpRet2.result + "NoDischange: " + bNoDischarge);
                                // 这里主要是栏截转接到内的电话，转接外线时没有振铃事件
                                // 判断主被叫是否为“呼入号码”和“转接号码”
                                if (cmpRet.result == 1 && cmpRet2.result == 1 && bNoDischarge) {
                                    _ipDispatcher.Exec('Discharge');    // 呼叫成功，执行转接放行
                                    bNoDischarge = false;               // 设置是否已经转接标识，防止多次转接
                                    //console.log("转接放行");
                                }
                                break;
                            case 4:
                                // 通话事件
                                // 获取主叫号码和被叫号码
                                sendData = '{"talkid": "' + data.talkid + '", "exec_sync":"1"}';
                                scaller = JSON.parse(_ipDispatcher.Exec('TalkGetCaller', sendData));

                                sendData = '{"talkid": "' + data.talkid + '", "exec_sync":"1"}';
                                scallee = JSON.parse(_ipDispatcher.Exec('TalkGetCallee', sendData));

                                sendData = '{"c1": "' + dispatcherDevice.operatorid + '", "c2": "' + scallee.result + '", "strict": "1", "exec_sync":"1"}';
                                cmpRet = JSON.parse(_ipDispatcher.Exec('CallIDCmp', sendData));
                                // 判断被叫是否为调度台
                                if (cmpRet.result == 1) {
                                    //console.log("调度台摘机");
                                    // 调度台摘机时，停止定时器，有可能是调度机主动摘机或是超时未摘机，由程序模拟搞机，通过下面的判断来区分摘机类型
                                    stopTime();
                                    // 如果是自动接机，表明是已经超过设定时间调度没有人接警，则自动转换到上级
                                    if (transferCall) {
                                        decTransfer();
                                    }
                                } else {
                                    //console.log(" 振铃事件 scaller=" + scaller.result + ", scallee=" + scallee.result);

                                    sendData = '{"c1": "' + callID + '", "c2": "' + scaller.result + '", "strict": "1", "exec_sync":"1"}';
                                    cmpRet = JSON.parse(_ipDispatcher.Exec('CallIDCmp', sendData));

                                    sendData = '{"c1": "' + sNum + '", "c2": "' + scallee.result + '", "strict": "1", "exec_sync":"1"}';
                                    cmpRet2 = JSON.parse(_ipDispatcher.Exec('CallIDCmp', sendData));

                                    //console.log("通话事件 scaller=" + cmpRet.result + ", scallee=" + cmpRet2.result);

                                    // 判断主被叫是否为“呼入号码”和“转接号码”
                                    // 放在这里主要是转接的是外线的话，没有振铃事件
                                    if (cmpRet.result == 1 && cmpRet2.result == 1 && bNoDischarge) {
                                        // 呼叫成功，执行转接放行
                                        _ipDispatcher.Exec('Discharge');
                                        // 设置是否已经转接标识，防止多次转接
                                        bNoDischarge = false;
                                        //console.log("转接放行2");
                                    }
                                }
                        }
                    } else {
                        switch (data.eventtype) {
                            case 0:
                                //如果是自动转接模式，则转接失败后主动挂机
                                if (transferCall) {
                                    _ipDispatcher.Exec('Onhook');
                                }
                                break;
                        }
                    }
                    break;
            }
        };

        //启动定时器
        function startTime() {
            // 加此判断是防止多次启动转换定时器
            if (!bTimeStart) {
                oTime = $timeout('autoOffhook()', (dispatcherDevice.transfertime ? dispatcherDevice.transfertime : 15) * 1000); // n秒钟未接则自动接机(即由程序模拟调度台摘机)
                //console.log("定时器已经启动");
            } else {
                //console.log("定时器重复启动");
            }
        }

        //模拟调度台摘机
        function autoOffhook() {
            var data = '{"talkid": "' + callInTalkID + '", "exec_sync":"1"}';
            var ret = JSON.parse(_ipDispatcher.Exec('Offhook', data));
            if (ret.result == 0) {
                transferCall = true;
                showMessage(1, '电话转接成功!');
            } else {
                showMessage(4, '电话转接失败!');
            }
            //console.log("AUTO Offhook : " + ret.result);
        }

        //停止定时器
        function stopTime() {
            if (oTime) {
                bTimeStart = false;
                $timeout.cancel(oTime);
                //console.log("定时器已清除");
            }
        }

        //转接
        function decTransfer() {
            if (dispatcherDevice.transfernumber) {
                bNoDischarge = true;
                var data = '{"number": "' + dispatcherDevice.transfernumber + '", "exec_sync":"1"}';
                var ret = JSON.parse(_ipDispatcher.Exec('TransferCall', data));
                //console.log("TransferCall : " + ret.result);
            }
        }

        var _hardware = {
            execute: function(defer, data, id, type, action, value) {
                switch (action) {
                    case 'call':
                        if (value) {
                            this.startAdvConf([value]);
                        }
                        break;
                    case 'hangup':
                        this.hangUp();
                        break;
                }
            }
        };

        function showMessage(level, content) {
            if (dispatcherDevice) {
                var message = {};
                message.level = level;
                message.title = '消息提醒';
                message.content = content;
                iMessage.show(message, false);
            }
        }

        /**
         * 检测呼入号码是否已加入黑名单
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-08-01
         */
        function checkNumber(number) {
            var url = 'security/blacklistphone.do?action=isBlackPhoneNum';
            var data = {
                filter: {
                    callnumber: number
                }
            };
            return iAjax.post(url, data);
        }

        /**
         * 检测呼入号码归属地及号码类型
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-08-01
         */
        function showNumberAreaInfo(data) {
            var imagePath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=';
            var personInfo = '';

            if (data.syouname) {
                personInfo = data.syouname;
            }

            if (data.personname) {
                if (personInfo != '')personInfo += ' ' + data.personname;
                else personInfo = data.personname;
            }

            if (personInfo == '')personInfo = '未知';
            $('.safe-alarm-call-number').text(personInfo);

            if (data.belongarea == '未知' || data.numbertype == '未知') {
                $('.safe-alarm-call-area').text(data.number);
            } else {
                $('.safe-alarm-call-area').text(data.number + '  ' + data.belongarea + data.numbertype);
            }

            if (data.photo) {
                $('.safe-alarm-call-user-panel').html('<img src="' + imagePath + data.photo.replace('\\', '/') + '"/>');
            } else {
                $('.safe-alarm-call-user-panel').html('<i class="fa fa-user"></i>');
            }
        }

        /**
         * 保存电话报警记录
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-08-02
         */
        function saveCallAlarm(params) {
            var content = '';
            if (params.syouname) {
                content += params.syouname;
            }

            if (params.personname) {
                content += (content != '') ? ' ' + params.personname : params.personname;
            }

            if (params.belongarea && params.belongarea != '未知') {
                if (content != '')content += params.belongarea;
            }

            if (params.numbertype && params.numbertype != '未知') {
                content += params.numbertype;
            }
            var url = 'security/alarm/alarm.do?action=saveCommunicationAlarm';
            var data = {
                filter: {
                    'creuser': content,
                    'phone': params.number,
                    'content': params.content,
                    'devicefk': params.devicefk
                }
            };
            iAjax.post(url, data);
        }

        function getInterphone() {
            iAjax.post('security/preplan.do?action=getInterphone').then(function(data) {
                if (data.result.rows && data.result.rows.length > 0) {
                    interphoneList = data.result.rows;
                }
            });
        }

        return {
            /**
             * 调度机初始化
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-04-19
             */
            init: function() {
                var that = this;
                //系统有调度机设备才加载控件
                this.getDeviceConfig(function() {
                    if (!mode) {
                        if(typeof(requireNW) !== 'undefined') {
                            //IPDispatcher
                            if (dispatcherDevice.content == 'neolink') {
                                _ipDispatcher = requireNW('./lib/younengdec/Ocx2NodejsCommonLoader');
                                _ipDispatcher.InitSdk({
                                    'dlldir': process.execPath + '\\..\\sdk\\YouNengDec\\YouNengDec_CApi.dll',
                                    'cbfn': decCallEventListener
                                });
                                getInterphone();
                            } else if (dispatcherDevice.content == 'iotimcdec') {
                                //DECLink
                                _ipDispatcher = requireNW('./lib/ipdispatcher/ipdispatcher');
                                _ipDispatcher.InitNodeJsSdk(process.execPath + '\\..\\sdk\\ipdispatcher\\');
                                that.setCallBackFun();
                            } else if(dispatcherDevice.content == 'chuyu') {
                                init = true;
                            }
                            mode = 'nw';
                        } else if (window.ActiveXObject || 'ActiveXObject' in window) {
                            var html = [];
                            html.push('<object id="IPDispatcherCtrl" CLASSID="CLSID:A1347CC2-E5A5-4717-A8DA-CD0AA97A68D9" type="application/x-itst-activex" width="1" height="1" ></object>');
                            $('body').append(html.join(''));
                            _ipDispatcher = $('#IPDispatcherCtrl');
                            mode = 'activeXObject';
                            that.setCallBackFunByIE();
                        } else if(dispatcherDevice.content == 'chuyu') {
                            init = true;
                        }

                        safeHardware.register('dispatcher', _hardware);
                    }

                    if (mode && !init) {
                        that.initDispatcher();
                    }
                });
            },

            setCallBackFun: function() {
                //设置消息回调函数
                //此处每一个回调消息等于ocx的事件,其回调函数参数也与ocx事件参数保持一致.
                _ipDispatcher.SetNodeJsCallbackFunc(sFunc);
            },

            setCallBackFunByIE: function() {
                angular.forEach(sFunc, function(fun, funName) {
                    _ipDispatcher.addEventListener(funName, fun);
                });
            },

            /**
             * 获取调度机配置参数信息
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-04-19
             */
            getDeviceConfig: function(callback) {
                iAjax.post('security/device.do?action=getDispatcherDeviceByUser', {
                    row: {
                        type: 'dispatcher'
                    }
                }).then(function(data) {
                    if (data.result.rows && data.result.rows.length > 0) {
                        if (data.result.rows[0].sign == '1') {
                            dispatcherDevice = data.result.rows[0];
                            if (callback) {
                                callback();
                            }
                        }
                    }
                });
            },

            /**
             * 初始化调度机
             *
             * @author : dwt
             * @version : 1.0
             * @Date : 2016-05-12
             */
            initDispatcher: function() {
                var device = dispatcherDevice;
                //IPDispatcher
                if (device.content == 'iotimcdec') {
                    var sInfo = {
                        'ipLocal': device.address,
                        'ipServer': device.ip,
                        'uname': device.username,
                        'pwd': device.password,
                        'license': device.license
                    };

                    _ipDispatcher.strName = sInfo.uname;
                    _ipDispatcher.strPassword = sInfo.pwd;
                    _ipDispatcher.strServer = sInfo.ipServer;
                    _ipDispatcher.strLocal = sInfo.ipLocal;
                    _ipDispatcher.strLicense = sInfo.license;
                    if (mode == 'nw') {
                        _ipDispatcher.SetIPDispatcherInitInfo(sInfo);
                    }

                    var flag;
                    flag = _ipDispatcher.IsLogin();
                    if (flag != 1) {
                        _ipDispatcher.Initialize();
                        flag = _ipDispatcher.IsInitialize();
                        if (flag == 1) {
                            _ipDispatcher.Login(10);
                            $timeout(function() {
                                flag = _ipDispatcher.IsLogin();
                                if (flag == 1) {
                                    init = true;
                                    var nLine = _ipDispatcher.GetPhoneCurrentLine();
                                    _ipDispatcher.HoldCall(nLine);
                                    _ipDispatcher.ResumeCall(0);
                                    _ipDispatcher.SetPhoneCurrentLine(0);
                                } else {
                                    showMessage(3, '调度机登陆失败!');
                                }
                            }, 3000);
                        } else {
                            showMessage(3, '调度机初始化失败!');
                        }
                    } else {
                        showMessage(3, '调度机已在其它客户端登陆!');
                    }
                } else if (device.content == 'neolink') {
                    //DECLink
                    var params = '{"TcpAddress": "","TcpPort": "' + device.tcpport + '","UdpAddress": "' + device.ip + '","UdpPort": "' + device.port + '","UdpLocalPort": "' + device.udplocalport + '"}';
                    _ipDispatcher.Exec('SetLineParam', params);
                    params = '{"mode": "' + device.mode + '","operatornum":"' + device.operatorid + '"}';
                    _ipDispatcher.Exec('Start', params);
                }
            },

            /**
             * 调度机注销操作
             *
             * @author : zcl
             * @version : 1.0
             * @Date : 2016-04-19
             */
            logout: function() {
                if (init) {
                    if (dispatcherDevice.content == 'iotimcdec') {
                        _ipDispatcher.Logout();
                    } else if (dispatcherDevice.content == 'neolink') {
                        _ipDispatcher.Exec('Stop');
                    }
                    init = false;
                    mode = null;
                }
            },

            /**
             * 电话呼叫
             * @param phoneNumber
             */
            makeCall: function(phoneNumber, callback) {
                if (init) {
                    var nLine = _ipDispatcher.GetPhoneCurrentLine();
                    if (phoneNumber) {
                        _ipDispatcher.MakeCall(nLine, phoneNumber, MEDIA_TYPE.MEDIA_TYPE_AUDIO);
                        if (callback) {
                            callback();
                        }
                    }
                } else {
                    showMessage(4, '呼叫失败，调度机未初始化!');
                }
            },

            /**
             * 发起高级会议
             * @param phoneNumbers Array
             */
            startAdvConf: function(phoneNumbers, callback) {
                if (init) {
                    //ipdispatcher
                    if (dispatcherDevice.content == 'iotimcdec') {
                        var nLine = _ipDispatcher.GetPhoneCurrentLine();
                        var state = _ipDispatcher.GetLineState(nLine);
                        if (state == 0) {
                            if (phoneNumbers && phoneNumbers.length > 0) {
                                _ipDispatcher.StartAdvConf(nLine, 0, '1:' + _ipDispatcher.strName + ',');
                                var count = phoneNumbers.length;
                                var i = 0;
                                $interval(function() {
                                    if (phoneNumbers[i]) {
                                        if (phoneNumbers[i].length > 4) {
                                            _ipDispatcher.AdvConfInvite((dispatcherDevice.zonenum != null && dispatcherDevice.zonenum) ? dispatcherDevice.zonenum + phoneNumbers[i] : phoneNumbers[i]);
                                        } else {
                                            _ipDispatcher.AdvConfInvite(phoneNumbers[i]);
                                        }
                                    }
                                    i++;
                                }, 2500, count);

                                if (callback) {
                                    callback();
                                }
                            }
                        } else {
                            //showMessage(4,'开启会议失败，线路正忙!');
                            if (phoneNumbers && phoneNumbers.length > 0) {
                                var count = phoneNumbers.length;
                                var i = 0;
                                $interval(function() {
                                    if (phoneNumbers[i]) {
                                        if (phoneNumbers[i].length > 4) {
                                            _ipDispatcher.AdvConfInvite((dispatcherDevice.zonenum != null && dispatcherDevice.zonenum) ? dispatcherDevice.zonenum + phoneNumbers[i] : phoneNumbers[i]);
                                        } else {
                                            _ipDispatcher.AdvConfInvite(phoneNumbers[i]);
                                        }
                                    }
                                    i++;
                                }, 2500, count);
                            }
                        }
                    } else if (dispatcherDevice.content == 'neolink') {
                        //decLink
                        var sendData = '{"confmode": "1"}';
                        var retData = _ipDispatcher.Exec('SetConferenceMode', sendData);
                        var interphones = [];
                        var outLine = [];
                        var interLine = [];
                        for (var i = 0; i < phoneNumbers.length; i++) {
                            if (phoneNumbers[i]) {
                                if (phoneNumbers[i].length == 4) {
                                    var list = _.filter(interphoneList, {phone: phoneNumbers[i]});
                                    if (list.length > 0) {
                                        interphones.push(phoneNumbers[i]);
                                    } else {
                                        interLine.push(phoneNumbers[i]);
                                    }
                                } else if (phoneNumbers[i].length > 4) {
                                    outLine.push((dispatcherDevice.zonenum != null) ? dispatcherDevice.zonenum + phoneNumbers[i] : phoneNumbers[i]);
                                }
                            }
                        }

                        var numberGroups = [];
                        if (interphones.length > 0)numberGroups.push(interphones.join(";"));
                        if (outLine.length > 0)numberGroups.push(outLine.join(";"));
                        if (interLine.length > 0)numberGroups.push(interLine.join(";"));
                        //呼叫号码排序（对讲号码;外线号码;内线号码）
                        sendData = '{"calleegroup": "' + numberGroups.join(';') + '"}';
                        retData = _ipDispatcher.Exec('ConfCall', sendData);
                        if (callback) {
                            callback();
                        }
                    } else if(dispatcherDevice.content == 'chuyu') {
                        for(var i = 0; i< phoneNumbers.length; i++) {
                            if(phoneNumbers[i].length > 6) {
                                phoneNumbers[i] = dispatcherDevice.outlineNo?dispatcherDevice.outlineNo + phoneNumbers[i]:phoneNumbers[i];
                            }
                        }
                        iAjax.post('/sys/provider.do?action=sendMsg', {
                            content: '收到命令',
                            numbers: phoneNumbers.join(','),
                            calltype: '1',
                            model: '1'
                        }).then(function() {
                            iMessage.show({
                                level: 1,
                                title: '消息提醒！',
                                content: '发起语音通话'
                            }, false);
                        });
                        if (callback) {
                            callback();
                        }
                    }
                } else {
                    showMessage(4, '开启会议失败，调度机未初始化!');
                }
            },

            /**
             * 会议成员邀请
             * @param phoneNumber
             */
            advConfInvite: function(phoneNumber, callback) {
                if (init) {
                    if (dispatcherDevice.content == 'iotimcdec') {
                        $timeout(function() {
                            if (phoneNumber) {
                                if (phoneNumber.length > 4) {
                                    _ipDispatcher.AdvConfInvite((dispatcherDevice.zonenum != null) ? dispatcherDevice.zonenum + phoneNumber : phoneNumber);
                                } else {
                                    _ipDispatcher.AdvConfInvite(phoneNumber);
                                }
                            }
                            if (callback) {
                                callback();
                            }
                        }, 800);
                    } else if (dispatcherDevice.content == 'neolink') {
                        if (phoneNumber.length > 4) {
                            phoneNumber = (dispatcherDevice.zonenum != null) ? dispatcherDevice.zonenum + phoneNumber : phoneNumber;
                        }
                        var sendData = '{"calleegroup": "' + phoneNumber + '"}';
                        var retData = _ipDispatcher.Exec('ConfCall', sendData);
                        if (callback) {
                            callback();
                        }
                    } else if (dispatcherDevice.content == 'chuyu') {
                        for(var i = 0; i< phoneNumber.length; i++) {
                            if(phoneNumber[i].length > 6) {
                                phoneNumber[i] = dispatcherDevice.outlineNo?dispatcherDevice.outlineNo + phoneNumber[i]:phoneNumber[i];
                            }
                        }
                        /*if(phoneNumber.length > 6) {
                            phoneNumber = dispatcherDevice.outlineNo ? dispatcherDevice.outlineNo + phoneNumber : phoneNumber;
                        }*/
                        var params = [];
                        params.push(phoneNumber)
                        iAjax.post('/sys/provider.do?action=sendMsg', {
                            content: '收到命令',
                            numbers: params.join(','),
                            calltype: '1',
                            model: '1'
                        }).then(function() {
                            iMessage.show({
                                level: 1,
                                title: '消息提醒！',
                                content: '发起语音通话'
                            }, false);
                        });
                        if (callback) {
                            callback();
                        }
                    }
                } else {
                    showMessage(4, '会议成员邀请失败，调度机未初始化!');
                }
            },

            /**
             * 会议成员踢出
             * @param phoneNumber
             */
            advConfKick: function(phoneNumber, callback) {
                if (init) {
                    if (dispatcherDevice.content == 'iotimcdec') {
                        $timeout(function() {
                            if (phoneNumber) {
                                phoneNumber = (phoneNumber.length > 4) ? (dispatcherDevice.zonenum != null ? dispatcherDevice.zonenum + phoneNumber : phoneNumber) : phoneNumber;
                                if (oBstrCallId[phoneNumber]) {
                                    _ipDispatcher.AdvConfKick(oBstrCallId[phoneNumber], phoneNumber);
                                    delete oBstrCallId[phoneNumber];
                                    if (callback) {
                                        callback();
                                    }
                                }
                            }
                        }, 800);
                    } else if (dispatcherDevice.content == 'neolink') {
                        phoneNumber = (phoneNumber.length > 4) ? (dispatcherDevice.zonenum != null ? dispatcherDevice.zonenum + phoneNumber + ',,' : phoneNumber + ',,') : phoneNumber + ',,';
                        var sendData = '{"callid": "' + phoneNumber + '"}';
                        _ipDispatcher.Exec('OnhookSpecific', sendData);
                    } else if (dispatcherDevice.content == 'chuyu') {
                        for(var i = 0; i< phoneNumber.length; i++) {
                            if(phoneNumber[i].length > 6) {
                                phoneNumber[i] = dispatcherDevice.outlineNo?dispatcherDevice.outlineNo + phoneNumber[i]:phoneNumber[i];
                            }
                        }
                        var params = [];
                        params.push(phoneNumber)
                        iAjax.post('/sys/provider.do?action=sendMsg', {
                            content: '收到命令',
                            numbers: params.join(','),
                            calltype: '3',
                            model: '2'
                        }).then(function() {
                            iMessage.show({
                                level: 1,
                                title: '消息提醒！',
                                content: '会议成员踢出成功!'
                            }, false);
                        });
                        if (callback) {
                            callback();
                        }
                    }
                } else {
                    showMessage(4, '会议成员踢出失败，调度机未初始化!');
                }
            },

            hangUp: function(callback) {
                if (init) {
                    if (dispatcherDevice.content == 'iotimcdec') {
                        var nLine = _ipDispatcher.GetPhoneCurrentLine();
                        var status = _ipDispatcher.GetLineState(nLine);

                        if (status != 4 && status != 5) {
                            var nlineMediaType = _ipDispatcher.GetMediaTypeJS(nLine);
                            var code = _ipDispatcher.AnswerCall(nLine, nlineMediaType);
                            if (code == 0) {
                                $timeout(function() {
                                    _ipDispatcher.HangupCall(nLine);
                                }, 1000);
                            }
                        } else {
                            var code = _ipDispatcher.HangupCall(nLine);
                        }

                        if (callback) {
                            callback();
                        }

                        showMessage(1, '挂断成功!');
                    } else if (dispatcherDevice.content == 'neolink') {
                        var sendData = '{"exec_sync":"1"}';
                        var retData = JSON.parse(_ipDispatcher.Exec('Onhook', sendData));
                        stopTime();
                        if (retData.result == 0) {
                            showMessage(1, '挂断成功!');
                        } else {
                            showMessage(4, '挂断失败!');
                        }
                    } else if (dispatcherDevice.content == 'chuyu') {
                        iAjax.post('/sys/provider.do?action=sendMsg', {
                            content: '收到命令',
                            numbers: '',
                            calltype: '1',
                            model: '2'
                        }).then(function() {
                            iMessage.show({
                                level: 1,
                                title: '消息提醒！',
                                content: '结束电话会议成功!'
                            }, false);
                        });
                    }
                } else {
                    showMessage(4, '挂断失败，调度机未初始化!');
                }
            },

            getCallInNumber: function() {
                return callInNumber;
            },

            setCallInNumber: function(number) {
                callInNumber = number;
            },

            getLine: function() {
                if (init) {
                    var nLine = _ipDispatcher.GetPhoneCurrentLine();
                    return nLine;
                } else {
                    showMessage(4, '挂断失败，调度机未初始化!');
                    return null;
                }
            },

            /*
             * 0	线路空闲
             * 1	线路振铃
             * 2	线路等待回铃
             * 3	线路回铃
             * 4	线路通话
             * 5	线路保持
             * */
            answerCall: function(nLine) {
                this.setAnswerFlag(true);
                if (dispatcherDevice.content == 'iotimcdec') {
                    var status = _ipDispatcher.GetLineState(nLine);
                    if (status != 4 && status != 5) {
                        var nlineMediaType = _ipDispatcher.GetMediaTypeJS(nLine);
                        var code = _ipDispatcher.AnswerCall(nLine, nlineMediaType);
                        if (code == 0) {
                            showMessage(1, '接听成功!');
                        } else {
                            showMessage(4, '接听失败，线路空闲!');
                        }
                    } else {
                        if (status == 4) {
                            showMessage(4, '接听失败，线路正在通话中!');
                        } else if (status == 5) {
                            showMessage(4, '接听失败，线路保持中!');
                        }
                    }
                } else if (dispatcherDevice.content == 'neolink') {
                    //console.log("当前通话talkid为：" + callInTalkID);
                    var sendData = '{"talkid": "' + callInTalkID + '", "exec_sync":"1"}';
                    var res = JSON.parse(_ipDispatcher.Exec('Offhook', sendData));
                    //console.log("接听来电res：" + res.result);
                }
            },

            //设置来电提醒是否已接听标识
            setAnswerFlag: function(flag) {
                answerFlag = flag;
            },

            //获取来电提醒是否已接听标识
            getAnswerFlag: function() {
                return answerFlag;
            },

            //挂断呼入来电
            hangUpReceiveCall: function() {
                this.setCallInNumber(null);
                this.setAnswerFlag(false);
                this.hangUp();
            },

            getAdvConfCallingList: function() {
                return oBstrCallId;
            },

            getDispatcher: function() {
                return dispatcherDevice;
            },

            getTalkId: function() {
                return callInTalkID;
            },

            receiveMessage: function(textinfo) {
                var flag = false;
                checkNumber(textinfo.phonenum).then(function(data) {
                    if (data.status == '1' && data.result.rows.length > 0) {
                        var params = data.result.rows[0];
                        params.number = textinfo.phonenum;
                        flag = (params.isblack == 1) ? true : false;
                        //判断该号码是否加入黑名单，如已加入则自动挂断
                        if (!flag) {
                            $('.call-panel-btn-hangup').hide();
                            $('.call-panel-btn-answer').hide();
                            params.content = textinfo.message;
                            params.creuser = textinfo;
                            params.devicefk = dispatcherDevice.id;
                            $('.safe-alarm-call-panel').show();
                            var calltime = $filter('date')(textinfo.recevicetime, 'yyyy-MM-dd HH:mm:ss');
                            $('.safe-alarm-call-in-time').text(calltime);
                            var textTitle = textinfo.personname ? textinfo.personname + '【' + textinfo.phonenum + '】' : textinfo.phonenum;
                            $('.safe-alarm-call-number').text(textTitle);
                            //显示设备所属区域及号码类型信息
                            $('.safe-alarm-call-area').text(textinfo.message);
                            $('.safe-alarm-call-user-panel').html('<i class="fa fa-user"></i>');
                        }
                    }
                });
            }
        };
    }]);
});