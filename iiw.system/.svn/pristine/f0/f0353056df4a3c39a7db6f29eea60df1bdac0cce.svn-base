/**
 * 固话资源指令
 *
 * Created by YBW on 2016-6-14
 */
define(['app'], function(app) {
    app.directive('exportExcel', ['iAjax',
        function() {
            return {
                restrict: 'E',
                template: '<iframe id="exportExcelFrame" style="display:none">'
                + '<html>'
                + '<head><meta http-equiv="content-type" content="text/html;chartset=utf-8" /></head>'
                + '<body>模板下载</body>'
                + '</html>'
                + '</iframe>',

                replace: true,
                compile: function() {
                    return {
                        post: function(scope, ele) {
                            scope.$on('downExcel', function(event, url) {
                                if(url) {
                                    ele.attr('src', url);
                                }
                            });
                        }
                    }
                }
            }
        }
    ]);
});