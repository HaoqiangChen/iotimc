/**
 * Created by zcl on 2017/4/24.
 * 获取系统公用配置信息，包括一键通访问地址、智能终端接口访问地址等
 */
define([
    'app'
], function(app) {
    app.factory('safeConfigService', ['iAjax', 'safeDesService', function(iAjax, safeDesService) {

        var yjtParams = null;
        var terminalServerURL = null;

        function _getKey(params) {
            var keyval4 = safeDesService.randomChar(5);
            var keyval5 = safeDesService.randomChar(5);
            var keyval6 = safeDesService.randomChar(5);
            var code = safeDesService.strEnc(params.username, keyval4, keyval5, keyval6) + '';
            code = keyval4 + keyval5 + keyval6 + code;

            var keyval1 = safeDesService.randomChar(5);
            var keyval2 = safeDesService.randomChar(5);
            var keyval3 = safeDesService.randomChar(5);
            var key = safeDesService.strEnc(params.password, keyval1, keyval2, keyval3) + '';
            key = keyval1 + keyval2 + keyval3 + key;

            var loginKey = '&key=' + code + '|' + key;
            return loginKey;
        }

        /*
         *
         *   获取一键通配置信息
         */
        function _getYjtConfig(callback) {
            iAjax.post('sys/web/sycode.do?action=getSysettingList').then(function(data) {
                if (data.result.rows && data.result.rows.length > 0) {
                    var row = {};
                    $.each(data.result.rows, function(i, o){
                        if(!row.username) row.username = o.username;
                        if(!row.password) row.password = o.password;
                        if(!row.params) row.params = o.params;
                        if(o.type == 'Onekeypolice') {
                            row.policeYjtUrl = o.url;
                            if (row.username && row.password) {
                                var loginKey = _getKey(row);
                                row.loginKey = loginKey;
                            }
                        } else if(o.type == 'Onekeycriminal') {
                            row.criminalYjtUrl = o.url;
                        }

                    });
                    _setYjtParams(row);
                    if(callback) callback();
                }
            });
        }

        function _setYjtParams(data) {
            yjtParams = data;
        }

        function _getYjtParams() {
            return yjtParams;
        }

        function _getTerminalConfig(callback) {
            var filter = {
                row: {
                    type: 'TerminalServerIP'
                }
            };
            iAjax.post('sys/web/sycode.do?action=getSysettingList', filter).then(function(data) {
                if (data.result.rows && data.result.rows.length > 0) {
                    terminalServerURL = data.result.rows[0].url ? data.result.rows[0].url : '';
                    _setTerminalServerUrl(terminalServerURL);
                }
                if(callback) callback(terminalServerURL);
            });
        }

        function _setTerminalServerUrl(data) {
            terminalServerURL = data;
        }

        function _getTerminalServerUrl(data) {
            return terminalServerURL;
        }

        function init() {
            _getYjtConfig();
            _getTerminalConfig();
        }

        init();

        return {
            getYjtConfig: _getYjtConfig,
            setYjtParams: _setYjtParams,
            getYjtParams: _getYjtParams,
            getTerminalConfig: _getTerminalConfig,
            setTerminalServerUrl: _setTerminalServerUrl,
            getTerminalServerUrl: _getTerminalServerUrl
        };
    }]);
});