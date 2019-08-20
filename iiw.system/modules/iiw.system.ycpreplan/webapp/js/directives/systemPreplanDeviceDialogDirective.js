/**
 * 预案资源配置弹出框指令
 * Created by ZCL on 2016-06-14.
 */
define([
    'app'
], function(app) {
    app.directive('systemPreplanDeviceDialog', [function() {
        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function(data) {
                result = data;
            });

            return result;
        }

        return {
            restrict: 'E',
            scope: true,
            template: getTemplate($.soa.getWebPath('iiw.system.ycpreplan') + '/view/dialog.html'),
            replace: true
        }
    }]);
});