/**
 * Created by llx on 2016/10/25.
 */
define(['app', function(app) {
    app.directive('addServer', [
        '$compile',

        function($compile) {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    element.on('click', function() {
                        var html = [];
                        scope.$parent.count++;
                        html.push($('#addServerInput').html());
                        html.push(
                            '<label>*服务名称</label>' +
                            '<input id=="text" class="form-control" ng-model="dispatcherFormEventName ' + scope.$parent.count + '" required/>' +
                            '<label>*执行的服务名</label>' +
                            '<input id="dispatcherFormEvent" type="text" class="form-control" ng-model="dispatcherFormEvent ' + scope.$parent.count + '" required/>');
                        var object = $compile(html.join(''))($('#addServerInput').scope());
                        $('#addressInput').html(object);
                    })
                }
            }
        }
    ])
}]);