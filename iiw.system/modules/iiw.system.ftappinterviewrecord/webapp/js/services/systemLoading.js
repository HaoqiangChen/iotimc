/**
 * 数据加载loading效果
 * @author : chq
 * @version : 1.0
 * @date : 2019/8/18
 */
define([
    'app'
], function(app) {
    app.factory('systemLoading', [function() {

        var loading = {
            className: '',
            content: '数据加载中',
            hide: function () {

            }
        };

        return {
            loading: loading
        }
    }]);
});
