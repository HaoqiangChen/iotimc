/**
 * 烽火对讲虚拟终端
 *
 * Created by zjq on 2019-05-25.
 */
define([
    'app'
], function(app) {
    app.factory('safeFengHuoAioStaTalk', ['$timeout', 'iAjax', 'iMessage', 'safeHardware', 'safeSound', 'safeImcsPlayer', function($timeout, iAjax, iMessage, safeHardware, safeSound, safeImcsPlayer) {
        var _type = 'fenghuo',
            _object,
            _row,
            _scope,
            _list,
			_scopeid,
			_tskguid,
            _imcsProcessInitStatus = false;

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
            if(_imcsProcessInitStatus){
                var cmd = {
                    "cmd":"sdkExec",
                    "sdkid": _object.sdkid,
                    "req":{
                        "sdkcmd":"Sta_usr_call_req",
                        "callee_guid": data.target.subid,
                        "ch_idx": 0,
                        "strm": 0,
                        "md_tp": 3,
                        "trans_proto": 1,
						 "wnd": 0
					}
                }
                safeImcsPlayer.sendCmd(cmd);
            }else{

            }
        }
		function maintalk(data) {
            if(_imcsProcessInitStatus){
                var cmd = {
                    "cmd":"sdkExec",
                    "sdkid": _object.sdkid,
                    "req":{
                        "sdkcmd":"Sta_usr_call_req",
                        "callee_guid": data.target.subid,
                        "ch_idx": 0,
                        "strm": 0,
                        "md_tp": 3,
                        "trans_proto": 1,
						 "wnd": 0
					}
                }
                safeImcsPlayer.sendCmd(cmd);
            }else{

            }
        }


        function listen(data) {
			if(_imcsProcessInitStatus){
                var cmd = {
                    "cmd":"sdkExec",
                    "sdkid": _object.sdkid,
                    "req":{
                        "sdkcmd":"start_monitor",
                        "callee_guid": data.target.subid,
                        "ch_idx": 0,
                        "strm": 0,
                        "md_tp": 3,
                        "trans_proto": 1,
						 "wnd": 0
					}
                }
                safeImcsPlayer.sendCmd(cmd);
            }else{

            }
        }


        function answer() {
			if(_imcsProcessInitStatus){
                var cmd = {
                    "cmd":"sdkExec",
                    "sdkid": _object.sdkid,
                    "req":{
                        "sdkcmd":"Sta_usr_call_req_ret",
                        "callee_guid": data.target.subid,
                        "tsk_guid": _tskguid,
                        "ch": 0,
                        "strm": 0,
                        "status": 2,
                        "trans_proto": 1,
						 "wnd": 0
					}
                }
                safeImcsPlayer.sendCmd(cmd);
            }else{

            }
        }

        function hangup(data) {
            if(_imcsProcessInitStatus){
                var cmd = {
                    "cmd":"sdkExec",
                    "sdkid": _object.sdkid,
                    "req":{
                        "sdkcmd":"Sta_stop_task",
                        "tsk_guid": _tskguid
                    }
                }
                safeImcsPlayer.sendCmd(cmd);
            }
        }


        function broadcast(data){
			if(_imcsProcessInitStatus){
                var cmd = {
                    "cmd":"sdkExec",
                    "sdkid": _object.sdkid,
                    "req":{
                        "sdkcmd":"Sta_exec_manual_tsk_speak",
                        "md_tp": 2,
                        "trans_proto": 1,
                        "list_dst_guid": data.target.subid,
                        "vol": 30
                    }
                }
                safeImcsPlayer.sendCmd(cmd);
            }
        }

        var _hardware = {
            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {
                        case 'talk':
                            talk(data);
                            break;
                    case 'mainTalk':
                        maintalk(data);
                        break;

                    case 'listen':
                        listen(data);
                        break;
                    case 'reply_talk':
                    case 'reply_alarm':
                    case 'mainReply':
                        answer(data.source, data.target);
                        break;

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
			_scopeid = 'cache_' + Math.floor(Math.random()*(1-1000) + 1000);

            safeHardware.register(_type,  _hardware);
            if(safeImcsPlayer.isconnect){
                init(function(row) {
                    if(row){
                        _row = row;
                        var cmd = {
                            "cmd":"sdkCreate",
                            "devkey": "imcsCtrlerDemo",
                            "devtype": "FengHuoAioStaTalk",
                            "autodestroy": "60"
                        }
                        safeImcsPlayer.sendCmd(cmd);
						
						$timeout(function(){
							Sta_pre_init();
							Sta_init();
						}, 5000);
						
                    }
                });
            }

            safeImcsPlayer.addListener('sdkCreate', function(data){
                console.log('sdkCreateSucessEvent' + data);
                _object = data;
				//if(_scopeid == _object.userparam){
					if(_object.req_devtype =='FengHuoAioStaTalk' && _object.sdkid){
					/*
						iMessage.show({
							level: 2,
							title: '初始化',
							timeout: 5000,
							content: '峰火对讲服务初始化成功！'
						});
						
					}else{
						iMessage.show({
							level: 4,
							title: '初始化',
							timeout: 0,
							content: '峰火对讲服务初始化失败！'
						});
						*/
					}
				//}
            });

            safeImcsPlayer.addListener('NotifySdkMsg', function(data){
				console.log(data)
			//	if(_scopeid == data.data.userparam){
					if(data.event == 'onImcsProcessInit'){
						_imcsProcessInitStatus = true;
						
					}else if(data.event == 'monitor_tsk_status'){
						_tskguid = data.msg.parser.tsk_guid;
					}else  if(data.event == 'tk_tsk_status'){
						_tskguid = data.msg.parser.tsk_guid;
					}else  if(data.event == 'exec_manual_tsk_ret'){
						_tskguid = data.msg.parser.tsk_guid;
						
						iMessage.remove(data.sdkid);
						iMessage.show({
							id: data.sdkid,
							level: 2,
							title: '语音广播',
							timeout: '0',
							content: '开始语音广播成功！'
						});
						
					}else if(data.event == 'start_av'){
						iMessage.remove(data.sdkid);
						iMessage.show({
							id: data.sdkid,
							level: 2,
							title: '语音广播',
							timeout: '0',
							content: '正在广播中......'
						});
					}else if(data.event == 'stop_av'){
						iMessage.remove(data.sdkid);
					}
					
					
					
			//	}
            });

            safeImcsPlayer.addListener('sdkExec', function(){

            });
        }
		
		/*
        * 初始化
        * */
        function Sta_pre_init(){
            var cmd = {
                "cmd":"sdkExec",
                "sdkid": _object.sdkid,
                "req":{
                    "sdkcmd":"Sta_pre_init",
                    "aud": 0
                }
            }
            safeImcsPlayer.sendCmd(cmd);
        }

        /*
        * 初始化服务器
        * */
        function Sta_init(){
            var cmd = {
                "cmd":"sdkExec",
                "sdkid": _object.sdkid,
                "req":{
                    "sdkcmd":"Sta_init",
                    "svr_ip": _row.serverip,
                    "svr_port": _row.port,
                    "uname": _row.username,
                    "pwd": _row.password
                }
            }
            safeImcsPlayer.sendCmd(cmd);
        }

        function receive(type, json) {

        }

        function resultEvent(json) {

        }

        function callEvent(json) {

        }

        function broadEvent(json) {

        }

        function showMessage(json) {
				iMessage.remove(json.sdkid);
                iMessage.show({
                    id: json.sdkid,
                    level: 2,
                    title: '语音广播',
                    timeout: '0',
                    content: '开始语音广播成功！'
                });
        }
		
		

        function _unload() {

        }

        return {
            init: _init,
            unload: _unload
        }
    }]);
});