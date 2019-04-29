/**
 * @authors chq
 * @date    2019/8/26 14:28
 * input框字数限制
 */

define(['app'], function (app) {
    app.directive("inputLimit", function () {
        return {
            restrict: 'A',
            scope: {
                model: '=ngModel'
            },
            link: function (scope, elm, attrs) {
                scope.$watch('model', function (newValue, oldValue) {
                    if (newValue == undefined) {
                        scope.model = '';
                    } else {
                        if (scope.model.length > Number(attrs.inputLimit)) {
                            scope.model = oldValue;
                            return false;
                        }
                    }
                });
            }
        }
    });
});
