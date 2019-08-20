/**
 * 选取颜色
 *
 * Created by YBW on 2017/5/25.
 */
define(['app'], function(app) {
    app.directive('systemBigColor', function() {
        return {
            compile: function() {
                return {
                    post: function(scope, element) {
                        element.bigColorpicker(null, 'L', 10, function(color, element) {
                            var obj = $(element);
                            obj.css('backgroundColor', color);
                            scope.$parent.level.list[obj.attr('index')].type = color;
                        });
                    }
                }
            }
        }
    });
});
