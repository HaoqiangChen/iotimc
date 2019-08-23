/**
 * 使用3.8.5版本echarts
 *
 */
define([
    'app',
    'safe/plugins/bid/lib/echarts/3.8.5/echarts.min'
], function(app,echarts) {
    app.factory('safeNewEcharts', [function() {
        return {
            init: function() {
                return echarts;
            }
        }
    }]);
});