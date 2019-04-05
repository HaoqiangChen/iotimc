/**
 * Created by chq on 2019/10/11.
 */
define(['app',
        'safe/tdt/js/services/safeTdtService'
    ],
    function (app) {
    app.directive('safeTdtMap', ['iAjax', 'safeTdtService', function(iAjax, safeTdtService) {
        var packageName = 'iiw.safe.tdt';

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
                callbackMap: '=getMap'
            },
            replace: true,
            template: getTemplate($.soa.getWebPath('iiw.safe.tdt') + '/view/map.html'),
            compile: function() {
                return {
                    post: function($scope, $element) {
                        $scope.filePath = $.soa.getWebPath(packageName) + '/';

                        // console.log(safeTdtService);
                        //加载地图类库
                        // initMap();

                        //初始化地图
                        function initMap() {
                            window.setTimeout(function() {
                                // safeTdtService.init();
                            }, 1000);
                        }

                        $scope.$on('destoryMap', function() {
                            // safeTdtService.removeMap();
                        });
                    }
                };
            }
        }
    }]);
});
