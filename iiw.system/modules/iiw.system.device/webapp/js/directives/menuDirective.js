/**
 * Created by ZJQ on 2016-03-10.
 */
define([
    'app',
    'angularAMD',
    'cssloader!infotrans/menu/css/index'
], function (app) {
    function formateData(data, n) {
        var len = data.length,
            rData = [];

        if (len <= n) {
            rData.push(data);
        }
        else {
            var mod = len % n,
                rowsLen = Math.floor(len / n);
            for (var i = 0; i < rowsLen; i++) {
                var row = data.slice(i * n, ((i + 1) * n));
                rData.push(row);
            }
            if (mod > 0) {
                rData.push(data.slice(rowsLen * n, len));
            }
        }

        return rData;
    }

    function createMenu() {
        console.log('<div class="iiw-infotrans-menu">' +
        '<div class="menu">' +
        '<div class="main-buttons">' +
        '<div class="button-line" ng-repeat="rows in rowGroup">' +
        '<div class="button-menu" ng-repeat="row in rows" ng-click="goModule(row)">' +
        '<div class="button-side" ng-class="{\'on\':showMenuDialog}">' +
        '<div class="button-content fa {{row.icon}}">' +
        '</div>' +
        '</div>' +
        '<div class="button-description">{{row.name}}' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
        return '<div class="iiw-infotrans-menu">' +
            '<div class="menu">' +
            '<div class="main-buttons">' +
            '<div class="button-line" ng-repeat="rows in rowGroup">' +
            '<div class="button-menu" ng-repeat="row in rows" ng-click="goModule(row)">' +
            '<div class="button-side" ng-class="{\'on\':showMenuDialog}">' +
            '<div class="button-content fa {{row.icon}}">' +
            '</div>' +
            '</div>' +
            '<div class="button-description">{{row.name}}' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    app.directive('menuBar', ["iAjax", "$rootScope", function (iAjax, $rootScope) {
        function getMenuData(type, scope) {
            iAjax.post("iotiead/common.do?action=getMenuList", {filter: {type: type}}).then(function (data) {
                scope.rowGroup = formateData(data.result.rows, 4);
            });
        }

        return {
            restrict: 'E',
            template: createMenu(),
            replace: true,
            transclude: true,
            link: function (scope, $element, attr) {
                getMenuData(attr.type, scope);
                $element.delegate(".button-menu", "mouseover", function () {
                    var self = $(this);
                    self.addClass("on")
                }).delegate(".button-menu", "mouseleave", function () {
                    var self = $(this);
                    self.removeClass("on");
                });
            }
        }
    }]);
});