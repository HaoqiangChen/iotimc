/**
 * 通过数据库获取版权信息
 *
 * Created by YJJ on 2016-06-01.
 */
define([
    'app'
], function(app) {
    app.directive('loginCopyright', ['iConfig', function(iConfig) {
        return {
            restrict: 'A',
            compile: function($element) {
                if(iConfig.get('copyright')) {
                    $element.find('.content').html(iConfig.get('copyright').content);
                }
            }
        }
    }]);
});