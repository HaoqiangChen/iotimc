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
            _imcsProcessInitStatus = false;

        // 获取对讲设备信息
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
                        "sdkcmd":"start_monitor",
                        "sess_client": "0",
                        "callee_guid": data.target.guid,
                        "ch_idx": "0",
                        "strm": "0",
                        "md_tp": "0",
                        "trans_proto": "TCP"
                    }
                }
                safeImcsPlayer.sendCmd(cmd);
            }else{

            }
        }


        function listen(data) {

        }


        function answer() {

        }

        function hangup(data) {
            if(_imcsProcessInitStatus){
                var cmd = {
                    "cmd":"sdkExec",
                    "sdkid": _object.sdkid,
                    "req":{
                        "sdkcmd":"Sta_stop_task",
                        "sess_client": "0",
                        "tsk_guid": data.source.guid
                    }
                }
                safeImcsPlayer.sendCmd(cmd);
            }
        }


        function broadcast(data){

        }

        var _hardware = {
            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {
                        case 'talk':
                            talk(data);
                            break;
                    case 'mainTalk':
                        talk(data);
                        break;

                    case 'listen':
                        listen(data.source, data.target);
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

            safeHardware.register('fenghuotalk', _hardware);
            if(safeImcsPlayer.isconnect){
                init(function(row) {
                    if(row){
                        _row = row;
                        console.log(_row);
                        var cmd = {
                            "cmd":"sdkCreate",
                            "devkey": "imcsCtrlerDemo",
                            "devtype": "FengHuoAioStaTalk",
                            "autodestroy": "60"
                        }
                        safeImcsPlayer.sendCmd(cmd);
                    }
                });
            }

            _scope.$on('sdkCreateSucessEvent', function(e, data){
                console.log(data);
                _object = data.data;
                if(_object.req_devtype =='FengHuoAioStaTalk' && _object.sdkid){
                /*
                    iMessage.show({
                        level: 2,
                        title: '初始化',
                        timeout: 2000,
                        content: '峰火对讲服务初始化成功！'
                    });
                    */
                }
            });

            _scope.$on('notifySdkMsgEvent', function(e, data){
                if(data.data.event == 'onImcsProcessInit'){
                    _imcsProcessInitStatus = true;
                    Sta_init();
                }
            });

            _scope.$on('sdkExecEvent', function(){

            });
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
                    "svr_ip": _row.ip,
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

        function stopEvent(json) {

        }

        function _unload() {

        }

        return {
            init: _init,
            unload: _unload
        }
    }]);
});