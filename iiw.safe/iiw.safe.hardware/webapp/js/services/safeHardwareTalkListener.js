/**
 * Created by YJJ on 2016-07-05.
 */
define([
    'app'
], function(app) {
    app.factory('safeHardwareTalkListener', ['iAjax', 'iMessage', 'safeSound', 'safeHardware', function(iAjax, iMessage, safeSound, safeHardware) {

        var _scope,
            _newscopes = {},
            _talking = {};

        function showMessage(id, title, content, time, action) {
            removeMessage(id);

            var scope = _scope.$new();

            scope.json = {
                id: id,
                action: action,
                title: title,
                time: time,
                timeout: '0',
                content: content || '<button class="button button-highlight button-rounded button-glow" style="height: 55px;" ng-click="action(this)">点击' + action.name + '</button>',
                drag: true,
                opacity: 0.5,
                fn: 'clickMessagePanel'
            };

            iMessage.show(scope.json, false, scope, scope);

            _newscopes[id] = scope;
        }

        function removeMessage(id) {
            if(_newscopes[id]) {
                _newscopes[id].$destroy();
                _newscopes[id] = null;
            }
            if(_talking[id]) {
                _talking[id] = null;
            }
            iMessage.remove(id);
        }

        function _init($scope) {
            _scope = $scope.$new();

            _scope.clickMessagePanel = function() {};

            _scope.action = function(scope) {
                if(scope && scope.json && scope.json.action) {
                    var oAction = scope.json.action;
                    if (oAction) {
                        iMessage.remove(scope.json.id);
                        safeHardware.execute(scope.json.id, oAction.type, oAction.action, oAction.value || '');
                        // iAjax.post('security/device/device.do?action=executeDeviceAction', {
                        //     filter: {
                        //         id: scope.json.id,
                        //         type: oAction.type,
                        //         action: oAction.action,
                        //         value: oAction.value || ''
                        //     }
                        // });
                    }
                }
            };

            _scope.$on('ws.talkHandle', function(e, data) {
                if(data && data.actions && data.actions.length) {
                    var oAction = data.actions[0];
                    if(oAction) {
                        showMessage(data.deviceid, data.content, data.time, null, oAction);

                        _talking[data.deviceid] = data;

                        if(data.content.indexOf('报警') == -1) {
                            safeSound.playMessage(data.content);
                        }
                    }
                } else {
                    if(data.content) {
                        iMessage.show({
                            title: data.content,
                            time: data.time,
                            timeout: 15*1000,
                            content: '呼叫提醒'
                        }, true);
                    }
                }
            });

            _scope.$on('ws.executeHandle', function(e, data) {
                if(data.type == 'talk' || data.type == 'talkmain') {
                    removeMessage(data.id);
                    var oTalk = _talking[data.id];
                    if(data.actions && data.actions.length) {
                        var oAction = data.actions[0];
                        showMessage(data.id, ((oTalk) ? oTalk.devicename : oAction.devicename) + data.message, data.time, null, oAction);
                    }
                }
            });
        }

        return {
            init: _init
        }
    }]);
});