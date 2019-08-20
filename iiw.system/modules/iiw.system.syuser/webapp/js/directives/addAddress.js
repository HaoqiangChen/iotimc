/**
 * Created by ZJQ on 2015-11-24.
 */
define(['app'], function(app) {
    app.directive('addAddress',[
        '$compile',

        function ($compile) {
            return {
                restrict: 'A',
                link: function (scope, $element, attr) {

                    $($element).on('click', function(object){
                        var html = [];
                        scope.$parent.count++;
                        html.push($('#addressInput').html());
                        html.push('<input type="text" ng-model="syuser.isaddress'+ scope.$parent.count +'" placeholder="输入绑定IP11" class="form-control input-transparent" id="syuser_address'+ scope.$parent.count +'" />');

                        var object = $compile(html.join(''))($('#addressInput').scope());

                        $('#addressInput').html(object);
                    });

                }
            };
        }
    ]);
});