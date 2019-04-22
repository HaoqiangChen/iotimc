/**
 * ITC虚拟终端；
 *
 * Created by YJJ on 2017-08-22.
 */
define([
    'app'
], function(app) {
    app.factory('safeItcipcast', ['iAjax', 'iMessage', 'safeHardware', function(iAjax, iMessage, safeHardware) {
        var _type = 'itc6703old',
            _object,
            _path,
            _scope,
            _list = {},
            _serverip;


        var _hardware = {

            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {

                        case 'stopVoice':
                            stopvoice(data.source, data.target);
                            break;
                        case 'broadcastVoice':
                            broadcast(data.source, data.target);
                            break;
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

        function broadcast(source, target){

            stopvoice(source, target);

            if(_object) {
                _object.Exec('IPCAST_RealPlayStart', JSON.stringify({
                    uMxId: 0,
                    iItem: 0,
                    pTList: target.devid,
                    Grade: 999,
                    bakFile: ''
                }));

                _list['id_' + target.devid] = target;
            }
        }

        function stopvoice(source, target){
            if(_object) {
                _object.Exec('IPCAST_RealPlayStop', JSON.stringify({
                    uMxId: 0
                }));

                _list['id_' + target.devid] = target;
            }
        }

        function _init(scope){
            _scope = scope;

            safeHardware.register(_type, _hardware);

            if(window.__IIWHOST) {
                init(function(row) {
                    var object = requireNW('./lib/itcipcast/ItcIPCastCApi'),
                        path = process.execPath + '\\..\\sdk\\ItcIPCastCApi\\ItcIPCastCApi.dll';

                    console.log('iiw.safe.hardware: itcipcast sdk Path is ' + path);

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

                _object.Exec('IPCAST_Connect', JSON.stringify({
                    ipAddr: row.serverip,
                    user: row.username,
                    pass: row.password
                }));
            } else {
                showErrorMsg();
                console.error('iiw.safe.hardware: itcipcast sdk init sdk error ' + res);
            }
        }

        function receive(type, json){
            json = JSON.parse(json);
            switch(type) {
                case 1:
                    if(json.result) {
                        resultEvent(json);
                    }
                    break;
            }
        }

        function resultEvent(json){
            switch(json.cmd) {
                case 'IPCAST_Connect':
                    connEvent(json);
                    break;
                case 'IPCAST_RealPlayStart':
                    callEvent(json);
                    break;
                case 'IPCAST_RealPlayStop':
                    stopEvent(json);
                    break;
            }
        }

        function connEvent(json){
            if(json.result == 1) {
                iMessage.remove(_type);
                _conn = true;
            } else {
                _conn = false;
                showErrorMsg(true);
            }
        }

        function callEvent(json){
            var object = _list;
            if (object) {
                iMessage.remove(_type);
                iMessage.show({
                    id: _type,
                    level: 2,
                    title: '语音广播',
                    timeout: '0',
                    content: '开始语音广播成功！'
                });
            }
        }

        function stopEvent(json){
            var object = _list;
            if(object) {
                iMessage.remove(_type);
            }
        }

        function showErrorMsg(now){
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
                        content: 'ITC广播服务器初始化失败，请尝试重新登陆系统或检查广播服务器[' + _serverip + ']！'
                    });
                }
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