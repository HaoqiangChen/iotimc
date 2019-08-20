/**
 * 统一硬件控制接口。
 *
 * Created by YJJ on 2016-10-19.
 */
define([
    'app'
], function(app) {
    app.factory('safeHardware', ['$q', 'iAjax', function($q, iAjax) {

        var _plugins = {};

        function _register(id, scope) {
            _plugins[id] = scope;
        }

        function _execute(id, type, action, value) {
            var defer = $q.defer();

            iAjax.post('security/device/device.do?action=executeDeviceAction', {
                filter: {
                    id: id,
                    type: type,
                    action: action,
                    value: value
                }
            }).then(function(data) {
                if(data && data.result && data.result.rows && data.result.rows.execute) {
                    // Web Plugins Execute
                    $.each(data.result.rows.execute, function(key, object) {
                        _plugins[key]['execute'](defer, object, id, type, action, value);
                    });
                } else {
                    // default result
                    defer.resolve(data);
                }
            }, function(data) {
                defer.reject(data);
            });

            return defer.promise;
        }

        return {
            register: _register,
            execute: _execute
        }
    }]);
});