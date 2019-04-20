/**
 * 来邦虚拟终端；
 *
 * Created by zjq on 2017-08-22.
 */
define([
    'app'
], function(app) {
    app.factory('safeLbipintercom', ['$timeout', 'iAjax', 'iMessage', 'safeHardware', 'safeSound', function($timeout, iAjax, iMessage, safeHardware, safeSound) {
        var _type = 'lonbon',
            _object,
            _serverip,
            _scope,
            _list = {},
            _conn = false,
            _talkingObject = false;

        function init(callback) {
            iAjax.post('sys/web/role.do?action=getVmInitInfo', {
                filter: {
                    company: _type
                }
            }).then(function(data) {
                if(data && data.result) {
                    callback(data.result);
                }
            });
        }

        function talk(source, target){
            hangup(source, target);
            if(_object) {
                _object.Exec('lb_fun_call_ext', JSON.stringify({
                    displayNum: target.devnum,
                    areaId: target.areaid,
                    devRegType: 0
                }));

                _list['id_' + parseInt(target.devnum)] = target;
            }
        }

        function hangup(source, target){
            if(_object) {
                _object.Exec('lb_fun_hungup_ext', JSON.stringify({
                    displayNum: target.devnum,
                    areaId: target.areaid,
                    devRegType: 0
               }));

                _list['id_' + parseInt(target.devnum)] = target;
            }
        }

        function _starttalking(){
            if(_object && !_talkingObject) {
                _object.Exec('lb_fun_pushToTalk', JSON.stringify({

                }));
            //    talkingObject = true;
                console.log('lb_fun_pushToTalk');
            }
        }

        function _stoptalked(){
            if(_object && _talkingObject) {
                _object.Exec('lb_fun_releaseToListen', JSON.stringify({

                }));
                _talkingObject = false;
                console.log('lb_fun_releaseToListen');
            }
        }


        var _hardware = {
            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {
                        case 'talk':
                        case 'mainTalk':
                        case 'listen':
                            talk(data.source, data.target);
                            break;

                        case 'reply_talk':
                        case 'reply_alarm':
                        case 'mainReply':
                            break;
                        case 'hangup':
                        case 'mainHangup':
                            hangup(data.source, data.target);
                            break;
                        case 'broadcastVoice':
                            broadcast(data.source, data.target);
                    }
                }
                defer.resolve(data);
            }
        };

        function _init(scope) {
            _scope = scope;

            safeHardware.register(_type, _hardware);

            if(window.__IIWHOST) {
                init(function(row) {
                    //    var object = requireNW('./lib/lbipintercom/lonbonIPIntercomCApi'),
                    var object = requireNW('./lib/avn2000talk/AVN2000Talk'),
                        path = process.execPath + '\\..\\sdk\\lbIPIntercom\\lonbonIPIntercomCApi.dll',
                        res;

                    console.log('iiw.safe.hardware: lbipintercom sdk Path is ' + path);

                    res = object.InitSdk({
                        dlldir: path,
                        cbfn: receive
                    });

                    if(res == 0) {
                        _object = object;

                        _serverip = row.serverip;

                        //设置系统目录
                        _object.Exec('lb_ipIntercom_workDirectory_set', JSON.stringify({
                            path: 'D:\\IOTIMC\\Security\\sdk\\lbIPIntercom\\ipIntercom'
                        }));


                        _object.Exec('lb_ipIntercom_start2_withUdpPort', JSON.stringify({
                            runLvl: parseInt(row.runlvl),
                            sn: row.sn,
                            sipacc: row.sipacc,
                            sippwd: row.sippwd,
                            udpport: parseInt(row.serverport)

                        }));

                        //设置IP地址盒
                        _object.Exec('lb_setting_set', JSON.stringify({
                            key: 1,
                            data: _serverip
                        }));

                        //设置主机号
                        _object.Exec('lb_setting_set', JSON.stringify({
                            key: 0,
                            data: row.devnum
                        }));

                        showErrorMsg();
                    } else {
                        console.error('iiw.safe.hardware: lbipintercom sdk init sdk error ' + res);
                    }
                });
            }
        }


        function receive(type, json) {
            json = JSON.parse(json);
            switch (type){
                case 4:
                    if(json){
                        resultEvent(json);
                    }
                    break;
            }

        }

        function resultEvent(json){
            switch (json.UA2UIEvent_desc){
                case 'LB_UA2UI_CALL_PROCESSING':                                //呼出处理中
                    callRrocessingEvent(json);
                    break;
                case 'LB_UA2UI_CALL_TALK_CONNECT':                              //对讲接通
                case 'LB_UA2UI_CALL_LSTN_CONNECT':                              //监听接通
                    callTalkLstnConnectEvent(json);
                    break;
                case 'LB_UA2UI_CALL_DISCONNECT':                                //挂机
                    callDisconnectEvent(json);
                    break;
                case 'LB_UA2UI_CALL_CALLIN':                                    //普通呼入
                    callInEvent(json);
                    break;
                case 'LB_UA2UI_CALL_EMERGENCYCALL':                             //紧急报警
                case 'LB_UA2UI_CALL_NSALARM':
                    callAlarmEvent(json);
                    break;
                case 'LB_UA2UI_ADDRLOG_SUCCESS':
                    addrManagerSvrEvent(json);
                    break;

            }
        }

        function callRrocessingEvent(json){
            var title = '正在呼叫中,请稍后！';
            var content = json.title;
            showMessage(title, content, 2);
        }

        function callTalkLstnConnectEvent(json){
            iMessage.remove(_type);
            var o,
                action;
            if(json.param1 > 0){
                o = _list['id_' + json.param1];
                if(o){
                    if(json.UA2UIEvent_desc == 'LB_UA2UI_CALL_TALK_CONNECT'){
                        // 呼叫
                        action = ['', '挂机', '对讲中'];
                        if(o.type == 'talk') {
                            action[0] = 'hangup';
                        } else {
                            action[0] = 'mainHangup';
                        }
                        console.log('开始说话');
                        _talkingObject = true;
                    }else{
                        //监听
                        action = ['', '挂机', '监听中'];
                        if(o.type == 'talk') {
                            action[0] = 'hangup';
                        } else {
                            action[0] = 'mainHangup';
                        }
                    }

                    _scope.$broadcast('ws.executeHandle', {
                        id: o.id,
                        message: action[2],
                        type: o.type,
                        actions: [{
                            action: action[0],
                            deviceid: o.id,
                            devicename: o.name,
                            name: action[1],
                            type: o.type
                        }]
                    });

                    safeSound.playMessage(o.name + action[2]);

                }
            }
        }

        function callDisconnectEvent(json){
            iMessage.remove(_type);
            if(json.param1 > 0){
                var o = _list['id_' + json.param1];
                if(o){
                    iMessage.remove(o.id);
                }
            }
        }

        function callInEvent(json){
            var action;

            $.each(json, function(i, t) {
                o = _list['id_' + t.id];
                if (o) {
                    action = ['', '应答', '来电'];
                    if(o.type == 'talk') {
                        action[0] = 'reply_talk';
                    } else {
                        action[0] = 'mainReply';
                    }

                    _scope.$broadcast('ws.executeHandle', {
                        id: o.id,
                        message: action[2],
                        type: o.type,
                        actions: [{
                            action: action[0],
                            deviceid: o.id,
                            devicename: o.name,
                            name: action[1],
                            type: o.type
                        }]
                    });

                    safeSound.playMessage(o.name + action[2]);

                }
            });
        }

        function addrManagerSvrEvent(json){
            _conn = true;
        }

        function showMessage(title, content, level){
            iMessage.remove(_type);
            iMessage.show({
                id: _type,
                level: level ?level : 2,
                title: title,
                timeout: '0',
                content: content
            });
        }

        function showErrorMsg(now) {
            if(now) {
                showErrorMsgDtl();
            } else {
                $timeout(showErrorMsgDtl, 10 * 1000);
            }

            function showErrorMsgDtl() {
                if(!_conn) {
                    iMessage.remove(_type);
                    iMessage.show({
                        id: _type,
                        level: 4,
                        title: '警　告',
                        timeout: '0',
                        content: '来邦虚拟终端初始化失败，请尝试重新登陆系统或检查对讲服务器[' + _serverip + ']！'
                    });
                }
            }
        }

        function _unload() {
            if(_object) {
                _object.UnInitSdk();
                _object = null;
            }
        }


        return {
            init: _init,
            unload: _unload,
            starttalking: _starttalking,
            stoptalked: _stoptalked
        }
    }]);
});