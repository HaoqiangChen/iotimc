/**
 * Created by ZJQ on 2015-11-24.
 */
define(['app'], function(app) {
    app.directive('exportExcel', ['iAjax',
        function(iAjax) {
            return {
                restrict: 'E',

                 template: '<iframe id="exportExcelFrame" style="display:none">'
                 +'<html>'
                 +'<head><meta http-equiv="content-type" content="text/html;chartset=utf-8" /></head>'
                 +'<body>模板下载</body>'
                 +'</html>'
                 +'</iframe>',

                replace: true,
                compile: function () {
                    return {
                        post: function (scope, ele) {
                            /**
                             *
                             *

                            scope.exportModel.exportflag = '';

                            scope.$watch('exportModel.exportflag', function(event, val) {
                                if(val) {
                                    alert(val);
                                }
                            });
                             */

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