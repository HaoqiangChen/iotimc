/**
 * 奥智利对讲系统；
 *
 * Created by ZJQ on 2018-04-25.
 */
define([
    'app'
], function(app) {
    app.factory('safePrisonTalkOcx', ['$timeout','iAjax', 'iMessage', 'safeHardware', function($timeout, iAjax, iMessage, safeHardware) {
        var _type = 'azlvoip',
            _object,
            _path,
            _scope,
            _list = {},
            _serverip;


        var _hardware = {

            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {
                        case 'mainTalk':
                            mainTalk(data.source, data.target);
                            break;
                        case 'talk':
                            talk(data.source, data.target);
                            break;
                        case 'reply_talk':
                        case 'reply_alarm':
                        case 'mainReply':
                            answer(data.source, data.target);
                            break;
                        case 'hangup':
                            hangup(data.source, data.target);
                            break;
                        case 'mainHangup':
                            mainHangup(data.source, data.target);
                            break;
                        case 'broadcastVoice':
                            broadcast(data.source, data.target);
                    }
                }
                defer.resolve(data);
            }

        }

        function init(callback){

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

        function mainTalk(source, target){

            if(_object) {
                _object.Exec('CallOutDev', JSON.stringify({
                    ipStr: target.ip
                }));

                _list['id_' + target.devid] = target;
            }
        }

        function talk(source, target){

            if(_object) {
                _object.Exec('StartMonitor', JSON.stringify({
                    ipStr: target.ip
                }));

                _list['id_' + target.devid] = target;
            }
        }

        function mainHangup(source, target){
            if(_object) {
                _object.Exec('TalkHangUp', JSON.stringify({

                }));

                _list['id_' + target.devid] = target;
            }
        }

        function hangup(source, target){
            if(_object) {
                _object.Exec('StopMonitor', JSON.stringify({

                }));

                _list['id_' + target.devid] = target;
            }
        }

        function _init(scope){
            _scope = scope;

            safeHardware.register(_type, _hardware);

            if(window.__IIWHOST) {
                init(function(row) {
                    var object = requireNW('./lib/avn2000talk/AVN2000Talk'),
                        path = process.execPath + '\\..\\sdk\\PrisonTalkOcxCApi\\PrisonTalkOcxCApi.dll';

                    console.log('iiw.safe.hardware: PrisonTalkOcxCApi sdk Path is ' + path);

                    _object = object;
                    _path = path;
                    initObject(row);
                });
            }

        }

        function initObject(row){

            var res = _object.InitSdk({
                dlldir: _path,
                cbfn: receive
            });
            if(res == 0) {
                // _serverip = (clserverip) ? clserverip || '' : serverip || '';
                _serverip = row.serverip;

                _object.Exec('setSysServerIp', JSON.stringify({
                    ipStr: _serverip
                }));
            } else {
                showErrorMsg();
                console.error('iiw.safe.hardware: PrisonTalkOcxCApi sdk init sdk error ' + res);
            }
        }

        function receive(type, json){
            console.log('type:' + type + ', json: ' + json);

            json = JSON.parse(json);
            switch(json.cmd){
                case 'CallOutDev':
                case 'StartMonitor':
                    callEvent(json);
                    break;
                case 'TalkHangUp':
                case 'StopMonitor':
                    hangupEvent(json);
                    break;
            }
        }


        function callEvent(json){
            iMessage.show({
                id: _type,
                level: 2,
                title: '对讲',
                timeout: '0',
                content: '呼叫成功！'
            });
        }

        function hangupEvent(json){
            iMessage.remove(_type);
        }

        function showErrorMsg(now){
            if(now) {
                showErrorMsgDtl();
            } else {
                $timeout(showErrorMsgDtl, 10 * 1000);
            }

            function showErrorMsgDtl() {
                iMessage.remove(_type);
                iMessage.show({
                    id: _type,
                    level: 4,
                    title: '警　告',
                    timeout: '0',
                    content: '奥智利对讲初始化失败，请检查ocx是否已注册！'
                });

            }
        }


        function _unload(){
            if(_object) {
                _object.UnInitSdk();
                _object = null;
            }
        }


        return {
            init: _init,
            unload: _unload
        }

    }]);
});