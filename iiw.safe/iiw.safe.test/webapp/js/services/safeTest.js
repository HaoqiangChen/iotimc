define([
    'app',
], function (app) {
    app.service('safeTestService', ['$rootScope', '$compile', '$element', 'iAjax', function ($rootScope, $compile, $element, iAjax) {

        return {
            init: function () {
                console.log('初始化');
            },
        }
    }]);
});
