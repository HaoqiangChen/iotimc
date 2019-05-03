/**
 * Created by yjj on 2015-10-27.
 */
define([
    'app',
    'login/js/directives/safeLoginBackground',
    'login/js/directives/loginFocus',
    'login/js/directives/loginCopyright',
    'login/lib/des',
    'cssloader!login/css/bootstrap.superhero.min',
    'cssloader!login/css/index',
    'cssloader!login/css/safe'
], function (app) {
    app.controller('loginController', ['$scope', '$state', 'iAjax', 'iSocket', 'iMessage', function($scope, $state, iAjax, iSocket, iMessage) {
        if(window.localStorage) {
            var username = window.localStorage.getItem('IMC_SAFE_LOGIN_USERNAME');
            var key = window.localStorage.getItem('IMC_SAFE_LOGIN_KEY');
            $scope.form = {
                'username': username,
                'password': key
            }
        }

        // iAjax.post('sys/web/config.do?action=getConfig', {}).then(function(data) {
        //     if(data && data.result && data.result.rows) {
        //         var titleObject = _.findWhere(data.result.rows, { 'key': 'title' });
        //         if(titleObject && titleObject.content) {
        //             document.title = titleObject.content;
        //         }
        //     }
        // });

        if($.soa.contextInfo && $.soa.contextInfo.baseContext && $.soa.contextInfo.baseContext.version) {
            $scope.version = $.soa.contextInfo.baseContext.version
        }

        $scope.submitError = {
            'username': false,
            'password': false
        };

        $scope.login = function() {
            var username, password;

            username = $scope.form.username;
            if(!username) {
                $('#username').focus();
                return true;
            }

            password = $scope.form.password;
            if(!password) {
                $('#password').focus();
                return true;
            }

            var k1, k2, k3, key;
            k1 = $.des.randomChar(5);
            k2 = $.des.randomChar(5);
            k3 = $.des.randomChar(5);

            password = $.des.strEnc(password, k1, k2, k3) + '';
            key = k1 + k2 + k3 + password;

            loginSubmit(username, $scope.form.password, key);

            return false;
        };

        function loginSubmit(username, password, key) {
            $scope.form.login = true;
            $('.login-button i').addClass('fa-pulse');

            iAjax.cleanToken();
            iAjax.get('sys/web/login.do?action=login', {
                'username': username,
                'password': key
            }).then(function() {
                iAjax.post('sys/web/syrole.do?action=getHomePage', {}).then(function(data) {
                    if(data.result) {
                        console.log('iiw.login: default state is ' , data.result.url);
                        if(data.result.url && data.result.url.indexOf('http://') == -1) {
                            $state.go(data.result.url);
                        } else {
                            location = data.result.url;
                        }
                    }
                }, function(data) {
                    $('.login-button i').removeClass('fa-pulse');
                    $scope.form.login = false;

                    iMessage.show({
                        level: 4,
                        title: '系统连接错误[' + data.status + ']',
                        content: '接口：[syrole.do?action=getHomePage]<br>帮助：请检查网络或服务器是否正常！'
                    });
                });

                if(window.localStorage) {
                    window.localStorage.setItem('IMC_SAFE_LOGIN_USERNAME', username);
                    window.localStorage.setItem('IMC_SAFE_LOGIN_KEY', password);
                }
            }, function(data) {
                $('.login-button i').removeClass('fa-pulse');
                $scope.form.login = false;
                if(data.exnum == 1400) {
                    $scope.submitError['username'] = true;
                    $('#username').select();
                } else if(data.exnum == 1402) {
                    $scope.submitError['password'] = true;
                    $('#password').select();
                } else {
                    iMessage.show({
                        level: 4,
                        title: '错误[' + data.status + ']',
                        content: '接口：[login.do?action=login]<br>帮助：请检查网络或服务器是否正常！'
                    });
                }
            });
        }

        $scope.reset = function() {
            $scope.submitError = {
                'username': false,
                'password': false
            };
        };

        $scope.list = [
            $.soa.getWebPath('iiw.login') + '/img/safe/1.jpg',
            $.soa.getWebPath('iiw.login') + '/img/safe/2.jpg',
            $.soa.getWebPath('iiw.login') + '/img/safe/2.png'
        ];
    }]);
});
