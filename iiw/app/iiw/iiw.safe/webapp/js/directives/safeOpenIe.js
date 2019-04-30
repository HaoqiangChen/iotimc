define([
    'app',
    'login/lib/des'
], function(app) {

    app.directive('safeOpenIe', [
        '$location',
        'iMessage',
        'iToken',

        function($location, iMessage, iToken) {
            return {
                restrict: 'A',
                scope: {
                    datas: '='
                },
                replace: false,
                template: '<i class="fa {{ datas.icon }}"></i><p>{{ datas.name }}</p>',
                link: function ($scope, $element) {
                    var username,
                        password;

                    if(window.localStorage) {
                        username = window.localStorage.getItem('IMC_SAFE_LOGIN_USERNAME');
                        password = window.localStorage.getItem('IMC_SAFE_LOGIN_KEY');

                        encryption();
                    } else {
                        iMessage.show({
                            level: 4,
                            title: '无法获取当前用户信息'
                        });
                    }

                    /**
                     * 密码加密
                    */
                    function encryption() {
                        var k1, k2, k3, key;
                        k1 = $.des.randomChar(5);
                        k2 = $.des.randomChar(5);
                        k3 = $.des.randomChar(5);

                        key = $.des.strEnc(password, k1, k2, k3) + '';
                        password = k1 + k2 + k3 + key;
                    }

                    $element.click(function() {
                        var path = '';
                        if($scope.datas.url.indexOf('http') > -1) {
                            path = $scope.datas.url;
                        } else {
                            path = $.soa.getWebPath('iiw.'+$scope.datas.url) + '/view/index.html?token=' + iToken.get();
                        }
                        path = path.replace('&', 'separator');
                        console.log(path);
                        window.open('openIE:' + path, '_self');
                    });
                }
            }
        }
    ]);
});