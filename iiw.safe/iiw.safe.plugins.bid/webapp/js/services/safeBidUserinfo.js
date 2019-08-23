/**
 * 登录用户信息。
 *
 */
define([
    'app'
], function(app) {
    app.factory('safeBidUserinfo', ['iAjax', function(iAjax) {
        var _info = {};

        function _init() {
            iAjax.postSync('sys/web/syuser.do?action=getSyuser', {
                id: ''
            }).then(function(data) {
                if(data && data.result && data.result.rows && data.result.rows.length) {
                    _info = data.result.rows[0];
                }
            });
        }

        _init();

        return {
            getInfo: function() {
                return _info;
            }
        }
    }]);
});