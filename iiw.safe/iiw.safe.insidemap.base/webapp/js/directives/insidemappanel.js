/**
 * 基础电子地图模板
 *
 * @author - dwt
 * @date - 2016-09-09
 * @version - 0.1
 */
define([
    'app',
    'safe/insidemap/base/js/app',
    'cssloader!safe/insidemap/css/index.css'
], function(app) {
    app.directive('insidemapPanel', [

        function() {

            /**
             * 获取模板
             *
             * @param url 模板绝对路径
             * @returns {string}
             */
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
                template: getTemplate($.soa.getWebPath('iiw.safe.insidemap.base') + '/view/panel.html'),
                replace: true,
                controller: 'safeInsidemapBaseController',
                compile: function() {
                    return {
                        post: function() {

                        }
                    }
                }
            }
        }
    ]);
});