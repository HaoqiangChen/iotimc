/**
 * 世邦虚拟终端
 *
 * Created by YJJ on 2016-11-14.
 */
define([
    'app'
], function(app) {
    app.factory('safeIpnbsvtd', ['$timeout', 'iAjax', 'iMessage', 'safeHardware', 'safeSound', function($timeout, iAjax, iMessage, safeHardware, safeSound) {
        var _type = 'sponipnbs',
            _object,
            _scope,
            _serverip,
			_status,
			_source,
			_target,
            _path,
			_res,
            _list = {},
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

        function talk(source, target) {
            if(_object && _conn) {				
                _object.Exec('call', JSON.stringify({
                    id: target.devid
                }));

                _list['id_' + target.devid] = target;
			}			
        }

        function listen(source, target) {
            if(_object && _conn) {
                _object.Exec('call', JSON.stringify({
                    id: target.devid,
                    monitor: 1
                }));

                _list['id_' + target.devid] = target;
            }
        }

        function answer() {
            if(_object && _conn) {
                _object.Exec('answer');
            }
        }

        function hangup() {
            if(_object && _conn) {
                _object.Exec('terminate');
            }
        }

        //默认是终端广播
        function broadcast(source, target){
            console.log('broadcase');
            if(_object) {
                _object.Exec('broadcase', JSON.stringify({
                    id: target.devid,
                    term: 1
                }));

                _list['id_' + target.devid] = target;
            }
        }

        //默认是终端语音广播
        function playVoice(source, target){

            console.log('音频广播文件播放playVoice：');
            if(_object) {
                _object.Exec('BroadcastFile', JSON.stringify({
                    id: target.devid,
                    term: 1,
                    file: target.absolutepath,
                    isloop:0
                }));

                _list['id_' + target.devid] = target;
            }
        }

        function stopVoice(source, target){
            console.log('停止音频广播播放stopVoice：');
            if(_object) {
                _object.Exec('BroadcastFileCtrl', JSON.stringify({
                    ctrl: stop
                }));

                _list['id_' + target.devid] = target;
            }
        }

        var _hardware = {
            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {
                    case 'talk':
                    case 'mainTalk':
                        initObject(data.source.devid, data.target.clserverip, '', function(){
							var intime = setInterval(function(){
								if(_conn == true){
									talk(data.source, data.target);
									clearInterval(intime);
								}
							},50);
							
						});
                        break;
                    case 'listen':
                        initObject(data.source.devid, data.target.clserverip, '', function(){
							var intime = setInterval(function(){
								if(_conn == true){
									listen(data.source, data.target);
									clearInterval(intime);
								}
							},50);
							
						});
                        break;
                    case 'reply_talk':
                    case 'reply_alarm':
                    case 'mainReply':
                        answer(data.source, data.target);
                        break;
                    case 'hangup':
                    case 'mainHangup':
                        hangup(data.source, data.target);
                        break;
                    case 'broadcastVoice':
                        broadcast(data.source, data.target);
                        break;
                    case 'playVoice':
                        playVoice(data.source, data.target);
                        break;
                    case 'stopVoice':
                        stopVoice(data.source, data.target);
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
                    var object = requireNW('./lib/ipnbsvtd/ipnbsvtd'),
                        path = process.execPath + '\\..\\sdk\\ipnbsvtd\\IPNBSVTD_CApi.dll'

                    console.log('iiw.safe.hardware: ipnbsvtd sdk Path is ' + path);

                    _object = object;
                    _path = path;
					
					if(_object){
						_object.UnInitSdk();
					}
					_res = _object.InitSdk({
						dlldir: _path,
						cbfn: receive
					});
					
                    initObject(row.devid, row.clserverip, row.serverip);
                });
            }
        }

        function initObject(devid, clserverip, serverip, callback){
            if(clserverip != _serverip){
                _conn = false;
				
                if(_res == 0) {
                    _serverip = (clserverip) ? clserverip || '' : serverip || '';
                    _object.Exec('connserver', JSON.stringify({
                        id: devid,
                        serverip: _serverip
                    }));
                    showErrorMsg();
                } else {
                    console.error('iiw.safe.hardware: ipnbsvtd sdk init sdk error ' + _res);
                }
            }
			if(callback){
				callback();
			}
        }

        function receive(type, json) {
            json = JSON.parse(json);
            switch(type) {
            case 1:
                if(json.task && json.task.taskstat && json.task.terminal && json.task.terminal.length) {
                    resultEvent(json);
                }
                break;
            case 256:
                connEvent(json);
                break;
            case 4194304:
                // originalEvent(json);
            }
        }

        function resultEvent(json) {
            switch(json.task.taskstat) {
            case '3,Calling':
                callEvent(json);
                break;
                // case '1,Stop':
                //     stopEvent(json);
                //     break;
            }
        }

        function callEvent(json) {
            var o,
                action;

            $.each(json.task.terminal, function(i, t) {
                o = _list['id_' + t.id];
                if(o) {
                    if(json.task.tasktype == '6,TaskByTalk') {
                        // 来电
                        action = ['', '应答', '来电'];
                        if(o.type == 'talk') {
                            action[0] = 'reply_talk';
                        } else {
                            action[0] = 'mainReply';
                        }
                    } else {
                        // 呼叫
                        action = ['', '挂机', '呼叫中'];
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
            });
        }

        // function stopEvent(json) {
        //     var o;
        //     $.each(json.task.terminal, function(i, t) {
        //         o = _list['id_' + t.id];
        //         if(o) {
        //             iMessage.remove(o.id);
        //         }
        //     });
        // }

        function connEvent(json) {
            if(json && json.serverip == _serverip) {
                if(json.online == 1) {
                    iMessage.remove(_type);
                    _conn = true;
					
                } else {
                    _conn = false;
                    showErrorMsg(true);
                }
            }
        }

        // function originalEvent(json) {
        //     if(json && json.cmd == 'connserver') {
        //         if(json.ret != 0 || json.online != 1) {
        //             showErrorMsg();
        //         }
        //     }
        // }

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
                        content: '世邦虚拟终端初始化失败，请尝试重新登陆系统或检查对讲服务器[' + _serverip + ']！'
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
            unload: _unload
        }
    }]);
});