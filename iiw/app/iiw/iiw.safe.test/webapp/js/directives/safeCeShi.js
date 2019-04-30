define(['app',
    'safe/test/js/services/safeTest'
    ], function (app) {
    app.directive('safeCeShi', ['iAjax', 'safeTestService', function(iAjax, safeTestService) {
        var packageName = 'iiw.safe.test';

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
            scope: {
                toggle: '=toggle',
                callbackMap: '=getHtml'
            },
            replace: true,
            template: getTemplate($.soa.getWebPath('iiw.safe.test') + '/view/ceshi.html'),
            compile: function() {
                return {
                    post: function($scope, $element) {
                        $scope.filePath = $.soa.getWebPath(packageName) + '/';

                        console.log(safeTestService);

                        init();

                        function init() {
                            window.setTimeout(function() {
                                safeTestService.init();
                            }, 1000);
                        }
                    }
                };
            }
        }
    }]);
});
