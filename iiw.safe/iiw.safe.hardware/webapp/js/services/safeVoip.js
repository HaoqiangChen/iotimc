/**
 * VOIP虚拟终端，采用linephone库，目前仅支持呼出，不支持来电；
 *
 * Created by YJJ on 2016-10-19.
 */
define([
    'app'
], function(app) {
    app.factory('safeVoip', ['iAjax', 'iMessage', 'safeHardware', function(iAjax, iMessage, safeHardware) {
        var _type = 'voip',
            _object,
            _list = {},
            _scope;

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
            if(_object) {
                _object.Exec('call', JSON.stringify({
                    sip: 'sip:' + target.sip
                }));

                _list['sip:' + target.sip] = target;
            }
        }

        function hangup() {
            if(_object) {
                _object.Exec('terminate');
            }
        }

        var _hardware = {
            execute: function(defer, data) {
                if(data && data.action) {
                    switch(data.action) {
                    case 'talk':
                    case 'mainTalk':
                        talk(data.source, data.target);
                        break;
                    case 'hangup':
                    case 'mainHangup':
                        hangup(data.source, data.target);
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
                    var object = requireNW('./lib/voiplinphone/voiplinphone'),
                        path = process.execPath + '\\..\\sdk\\voip_linphone\\voip_linphone.dll',
                        res;

                    console.log('iiw.safe.hardware: voip linephone sdk Path is ' + path);

                    res = object.InitSdk({
                        dlldir: path,
                        cbfn: receive,
                        localsip: (row.sip) ? ('sip:' + row.sip) : 'sip:99999@127.0.0.1:5090'
                    });

                    if(res == 0) {
                        _object = object;
                        _object.Exec('setlocalsip', JSON.stringify({
                            sip: (row.sip) ? ('sip:' + row.sip) : 'sip:99999@127.0.0.1:5060'
                        }));
                    } else {
                        console.error('iiw.safe.hardware: voip linephone sdk init sdk error ' + res);
                    }
                });
            }
        }

        function receive(type, json) {
            json = JSON.parse(json);
            switch(type) {
            case 32:
                callSuccessEvent(json);
                break;
            case 262144:
                callReleaseEvent(json);
                break;
            }
        }

        function callSuccessEvent(json) {
            var object = _list[json.from];
            if(object) {
                _scope.$broadcast('ws.executeHandle', {
                    id: object.id,
                    message: '通话中',
                    type: object.type,
                    actions: [{
                        action: 'mainHangup',
                        deviceid: object.id,
                        devicename: object.name,
                        name: '挂机',
                        type: object.type
                    }]
                });
            }
        }

        function callReleaseEvent(json) {
            var object = _list[json.from];
            if(object) {
                iMessage.remove(object.id);
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