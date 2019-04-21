/**
 * 计算控制按钮的大小
 *
 * Created by YJJ on 2015-12-24.
 */
define([
    'app'
], function(app) {
    app.directive('safeInsidemapControlbox', [function() {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($scope, $element) {
                        $element.find('button').ripple();

                        var colors = [
                            '#27ae60',
                            '#2980b9',
                            '#f39c12',
                            '#d35400',
                            '#c0392b',
                            '#1abc9c',
                            '#8e44ad',
                            '#7f8c8d'
                        ];
                        var parent = $('.safe-insidemap-area'),
                            box_h = parent.height() - 100,
                            size = $scope.$parent.area.clist.length;

                        if(size > 3) size = 3;

                        $element.height((box_h - size * 5) / size);

                        for(var i = colors.length; i > 0; i--) {
                            if(($scope.$index + 1) % i == 0) {
                                $element.find('button').css('background-color', colors[i - 1]);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }]);
});