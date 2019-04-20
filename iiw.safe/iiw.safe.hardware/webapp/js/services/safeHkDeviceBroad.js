/**
 * 海康设备对讲广播；
 *
 * Created by ZJQ on 2018-04-02.
 */
define([
    'app'
], function(app) {
    app.factory('safeHkDeviceBroad', ['$timeout','iAjax', 'iMessage', 'safeHardware', function($timeout, iAjax, iMessage, safeHardware) {
        var _type = 'hkdevicebroad',
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

            if(_object) {
                _object.Exec('HkDev_StartTalk', JSON.stringify({
                    ip: target.ip,
                    port: target.port,
                    uname: target.uname,
                    pwd: target.pwd,
                    chl: target.chl
                }));

                _list['id_' + target.devid] = target;
            }
        }

        function stopvoice(source, target){
            if(_object) {
                _object.Exec('HkDev_StopTalk', JSON.stringify({
                    ip: target.ip,
                    chl:target.chl
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
                        path = process.execPath + '\\..\\sdk\\HkDeviceTalkCApi\\HkDeviceTalkCApi.dll';

                    console.log('iiw.safe.hardware: HkDeviceTalkCApi sdk Path is ' + path);

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

                _object.Exec('HkDev_Init', JSON.stringify({

                }));
            } else {
                showErrorMsg();
                console.error('iiw.safe.hardware: HkDeviceTalkCApi sdk init sdk error ' + res);
            }
        }

        function receive(type, json){
            json = JSON.parse(json);
            if(json.result > 0) {
                switch(json.cmd){
                    case 'HkDev_StartTalk':
                        callEvent(json);
                        break;
                    case 'HkDev_StopTalk':
                        stopEvent(json);
                        break;
                }
            }else{
                failEvent(json);
            }
        }

        function failEvent(json){
            switch (json.result){
                case -1:
                    iMessage.remove(_type);

                    iMessage.show({
                        level: 4,
                        title: '设备登录失败',
                        timeout: '0',
                        content: '设备信息：[' + json.deviceinfo + ']！'
                    });
                    break;
                case -2:
                    iMessage.remove(_type);

                    iMessage.show({
                        level: 4,
                        title: '设备登录失败',
                        timeout: '0',
                        content: '错误信息：[' + json.err + ']！'
                    });
                    break;
                case -3:
                    iMessage.remove(_type);

                    iMessage.show({
                        level: 3,
                        title: '设备登录成功',
                        timeout: '0',
                        content: '错误信息：[未配置对讲通道chl属性]！'
                    });
                    break;
                case -4:
                    iMessage.remove(_type);
                    iMessage.show({
                        level: 3,
                        title: '设备登录成功',
                        timeout: '0',
                        content: '错误信息：[' + json.err + ']！'
                    });
                    break;
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
                iMessage.remove(_type);
                iMessage.show({
                    id: _type,
                    level: 4,
                    title: '警　告',
                    timeout: '0',
                    content: '海康设备SDK初始化失败，请检测客户端SDK资料是否正确！！'
                });

            }
        }


        function _unload(){
            if(_object) {
                //    _object.UnInitSdk();
                _object.exec('HkDev_Destroy', JSON.stringify({}));
                _object = null;
            }
        }


        return {
            init: _init,
            unload: _unload
        }

    }]);
});