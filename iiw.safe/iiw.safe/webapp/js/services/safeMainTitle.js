/**
 * 模块标题管理。
 *
 * Created by YJJ on 2015-10-27.
 */
define([
    'app'
], function(app) {
    app.factory('safeMainTitle', [function() {
        var _title = '';

        return {
            title: _title
        }
    }]);
});