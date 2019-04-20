/**
 * 艾威对讲虚拟终端
 *
 * Created by zjq on 2017-05-25.
 */
define([
    'app'
], function(app) {
    app.factory('safeAVN2000Talk', ['$timeout', 'iAjax', 'iMessage', 'safeHardware', 'safeSound', function($timeout, iAjax, iMessage, safeHardware, safeSound) {
        var _type = 'avcntalk',
            _object,
            _scope,
            _serverip,
            _list,
            _conn = false;

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

        function talk(data) {
            if(_object) {
                _object.Exec('TalkInterface', JSON.stringify({
                    mainip: data.source.mainip,
                    subip: data.target.subip,
                    mainid: data.source.mainid,
                    subid: data.target.subid

                }));
                _list = data;
            }
        }

        /*
        function listen(data) {
            if(_object && _conn) {
                _object.Exec('call', JSON.stringify({
                    id: data.target.devid,
                    monitor: 1
                }));

                _list['id_' + data.target.devid] = data.target;
            }
        }


        function answer() {
            if(_object && _conn) {
                _object.Exec('answer');
            }
        }*/

        function hangup() {
            if(_object) {
                _object.Exec('StopMedia');
            }
        }

        function broadcast(data){
            if(_object) {
                _object.Exec('BcastInterface', JSON.stringify({
                    mainip: data.source.mainip,
                    subip: data.target.subip,
                    mainid: data.source.mainid,
                    subid: data.target.subid

                }));

                _list = data;
            }
        }

        var _hardware = {
            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {
                    case 'talk':
                    case 'mainTalk':
                        talk(data);
                        break;
                    /*
                    case 'listen':
                        listen(data.source, data.target);
                        break;
                    case 'reply_talk':
                    case 'reply_alarm':
                    case 'mainReply':
                        answer(data.source, data.target);
                        break;
                    */
                    case 'hangup':
                    case 'mainHangup':
                    case 'stopVoice':
                        hangup(data);
                        break;
                    case 'broadcastVoice':
                        broadcast(data);
                        break;
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
                    var object = requireNW('./lib/avn2000talk/AVN2000Talk'),
                        path = process.execPath + '\\..\\sdk\\AVN2000Talk\\AVN2000Talk_CApi.dll',
                        res;

                    console.log('iiw.safe.hardware: AVN2000Talk sdk Path is ' + path);

                    res = object.InitSdk({
                        dlldir: path,
                        cbfn: receive
                    });

                    if(res == 0) {
                        _object = object;
                    } else {
                        console.error('iiw.safe.hardware: AVN2000Talk sdk init sdk error ' + res);
                        iMessage.show({
                            level: 4,
                            title: '警　告',
                            timeout: '0',
                            content: '艾威控件初始化失败，请检测客户端是否已安装ocx控件！'
                        });
                    }
                });
            }
        }

        function receive(type, json) {
            json = JSON.parse(json);
            if(json.result != 'error'){
                switch(type) {
                    case 1:
                        if(json && json.ret >= 0) {
                            resultEvent(json);
                        }
                        break;
                }
            }else{
                iMessage.show({
                    id: _list.source.id,
                    level: 3,
                    title: '警　告',
                    timeout: '0',
                    content: '设备正在控制中，请先停止！'
                });
            }

        }

        function resultEvent(json) {
            switch(json.cmd){
                case 'TalkInterface':
                    callEvent(json);
                    break;
                case 'BcastInterface':
                    broadEvent(json);
                    break;
                case 'StopMedia':
                    stopEvent(json);
                    break;
            }
        }

        function callEvent(json) {
            var object = _list;
                if(object) {
                    _scope.$broadcast('ws.executeHandle', {
                        id: object.source.id,
                        message: '通话中',
                        type: object.type,
                        actions: [{
                            action: 'mainHangup',
                            deviceid: object.target.id,
                            devicename: object.target.name,
                            name: '挂机',
                            type: object.type
                        }]
                    });

                //    safeSound.playMessage(object.target.name + object.actionname);
                }
        }

        function broadEvent(json) {
            var object = _list;
            if (object) {
                iMessage.remove(object.source.id);
                iMessage.show({
                    id: object.source.id,
                    level: 2,
                    title: '语音广播',
                    timeout: '0',
                    content: '开始语音广播成功！'
                });
            }
        }

        function stopEvent(json) {
            var object = _list;
            if(object) {
                iMessage.remove(object.source.id);
            }
        }

        //function connEvent(json) {
        //    if(json && json.serverip == _serverip) {
        //        if(json.online == 1) {
        //            iMessage.remove(_type);
        //            _conn = true;
        //        } else {
        //            _conn = false;
        //            showErrorMsg(true);
        //        }
        //    }
        //}

        // function originalEvent(json) {
        //     if(json && json.cmd == 'connserver') {
        //         if(json.ret != 0 || json.online != 1) {
        //             showErrorMsg();
        //         }
        //     }
        // }


        function _unload() {
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