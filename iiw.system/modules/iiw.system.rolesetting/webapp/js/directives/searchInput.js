/**
 * 自适应查询功能
 * Created by GDJ on 2016/3/24.
 */
define(['app'], function(app) {
    var input = '<div class="input-search">' +
        '<div class="input-content">' +
        '<input type="text" class="form-control" placeholder="请输入搜索内容" i-dom-select="">' +
        '</div>' +
        '<button class="search-button">' +
        '<i class="fa fa-search"></i>' +
        '</button>' +
        '</div>';

    app.directive('searchInput', [function() {
        return {
            restrict: 'E',
            template: input,
            scope: false,
            replace: true,
            compile: function($ele, attr) {
                var $searchButton = $ele.find('.search-button'),
                    $searchContent = $ele.find('.form-control'),
                    id = attr.id ? attr.id + '-' : '';
                return {
                    post: function($scope) {
                        if (attr.placeholder) {
                            $searchContent.attr('placeholder', attr.placeholder);
                        }
                        $searchButton.click(function() {
                            $scope.$emit(id + 'search-event', $searchContent.val());
                        })
                        $searchContent.keypress(function(e) {
                            if (e.keyCode == 13) {
                                $scope.$emit(id + 'search-event', $searchContent.val());
                            }
                        });
                    }
                }
            }
        }
    }]);
});
