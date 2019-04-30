define("app",["angular",'angular-route'], function(a, r) {
    var app = angular.module('app', ['ngRoute'])
        .controller("IndexCtrl",["$scope", function($scope) {
            $scope.name = "王五";
        }])
        .component('app', {
            templateUrl: "pages/app.html"
        })
        .config(["$routeProvider",
            function($routeProvider) {
                $routeProvider.when("/home", {
                    templateUrl: "pages/home.html",
                    resolve: {
                        $routeChangeSuccess: function ($rootScope) {
                            $rootScope.appName = '这里是appName';
                        }
                    }
                }).when("/index", {
                    templateUrl: "pages/index.html",
                    controller: "IndexCtrl"
                })
            }]);
    return app;
});
