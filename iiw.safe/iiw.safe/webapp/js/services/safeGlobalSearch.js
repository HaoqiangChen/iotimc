/**
 * 全局搜索服务，用于提供实时的全局所搜设置和变化监听。
 *
 * Created by YJJ on 2016-04-20.
 */
define([
    'app'
], function(app) {
    app.factory('safeGlobalSearch', [function() {
        var object = {
            value: ''
        };

        return {
            set: function(value) {
                object = value;
            },
            get: function() {
                return object;
            },
            clean: function() {
                object.value = '';
            }
        }
    }]);
});