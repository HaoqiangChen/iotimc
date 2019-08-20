/**
 * 自适应查询功能
 * Created by gdj on 2015-11-24.
 */
define(['app'], function(app) {
    var input = '<div class="input-search">' +
        '<div class="input-content">' +
        '<input type="text" class="form-control" ng-model="inputSearch" placeholder="请输入搜索内容" i-dom-select="">' +
        '</div>' +
        '<button class="search-button">' +
        '<i class="fa fa-search"></i>' +
        '</button>' +
        '</div>';

    app.directive('doorSettingSearch', [function() {
        return {
            restrict: 'E',
            template: input,
            scope: false,
            replace: true,
            compile: function($ele) {
                var $searchButton = $ele.find('.search-button'),
                    $searchContent = $ele.find('.form-control');
                return {
                    post: function($scope) {
                        $searchButton.click(function() {
                            $scope.$emit('search-event', $scope.inputSearch);
                        })
                        $searchContent.keypress(function(e) {
                            if (e.keyCode == 13) {
                                $scope.$emit('search-event', $scope.inputSearch);
                            }
                        });
                    }
                }
            }
        }
    }]);
});
