
/**
 * 修改用户密码
 *
 * @author - dwt
 * @date - 2016-04-29
 * @version - 0.1
 */
define([
    'app',
    'cssloader!safe/css/safeuserpassword'
], function(app) {

    app.directive('safeUserPassword', ['$compile', 'iAjax', 'iMessage', function($compile, iAjax, iMessage) {
        return {
            restrict: 'A',
            scope: true,
            compile: function() {
                return {
                    post: function($scope, $element) {
                        $scope.user = {
                            disabled: false,
                            view: false,
                            nowPassword: '',
                            newPassword: '',
                            newPasswordVerify: '',
                            hideView: function() {
                                hide();
                                $scope.user.tips = '';
                                $scope.user.nowPassword = '';
                                $scope.user.newPassword = '';
                                $scope.user.newPasswordVerify = '';
                            },
                            changePassword: function() {
                                $scope.user.tips = '';
                                $scope.user.disabled = true;
                                iAjax.post('security/common/monitor.do?action=updatePersonInformation', {
                                    filter: {
                                        oldpassword: $scope.user.nowPassword,
                                        newpassword: $scope.user.newPassword
                                    }
                                }).then(function(data) {
                                    $scope.user.disabled = false;
                                    if(data && data.result) {
                                        if(data.result.rows == '1') {
                                            var message = {};
                                            message.title = '密码';
                                            message.level = 1;
                                            message.content = '修改成功！';
                                            $scope.user.hideView();
                                            iMessage.show(message, false);
                                        }else {
                                            $scope.user.tips = '当前密码验证失败';
                                        }
                                    }
                                });
                            }
                        };

                        $element.on('click', function() {
                            if(!$('.safe-main-mask-high').size()) {
                                var html = [];

                                html.push('<div class="safe-main-mask-high layout-full">');
                                html.push('<div class="layout-full">');
                                html.push('<div class="layout-full safe-main-user-password">');
                                html.push('<div class="layout-full">');
                                html.push('<form name="passwordForm" method="post">');
                                html.push('<fieldset>');
                                html.push('<legend class="section">修改密码<b class="text-danger" ng-show="user.tips">【{{user.tips}}】</b></legend>');
                                html.push('<div class="form-group">');
                                html.push('<label>当前密码</label>');
                                html.push('<input name="passwordNow" type="password" class="form-control" ng-model="user.nowPassword" required/>');
                                html.push('<div>');
                                html.push('<label class="control-label text-danger">{{!user.nowPassword ? \'当前密码不能为空\' : \' \'}}</label>');
                                html.push('</div>');
                                html.push('</div>');
                                html.push('<div class="form-group">');
                                html.push('<label>新密码</label>');
                                html.push('<input name="passwordNew" type="password" class="form-control" ng-model="user.newPassword" required/>');
                                html.push('<div>');
                                html.push('<label class="control-label text-danger">{{!user.newPassword ? \'新密码不能为空\' : \' \'}}</label>');
                                html.push('</div>');
                                html.push('</div>');
                                html.push('<div class="form-group">');
                                html.push('<label>验证新密码</label>');
                                html.push('<input name="passwordNewVerify" type="password" class="form-control" ng-model="user.newPasswordVerify" required/>');
                                html.push('<div>');
                                html.push('<label class="control-label text-danger">{{user.newPassword != user.newPasswordVerify ? \'新密码与验证不一致\' : \' \'}}</label>');
                                html.push('</div>');
                                html.push('</div>');
                                html.push('</fieldset>');
                                html.push('<div class="form-actions">');
                                html.push('<div class="text-right">');
                                html.push('<button class="btn btn-success" type="button" hm-tap="user.changePassword()" ng-disabled="passwordForm.$invalid || user.disabled || user.newPassword != user.newPasswordVerify">提交</button>');
                                html.push('<button class="btn btn-danger" type="button" hm-tap="user.hideView()">取消</button>');
                                html.push('</div>');
                                html.push('</div>');
                                html.push('</form>');
                                html.push('</div>');
                                html.push('</div>');
                                html.push('<div class="layout-full safe-main-user-password-mask" hm-tap="user.hideView()"></div>');
                                html.push('</div>');
                                html.push('</div>');

                                var el = $compile(html.join(''))($scope);

                                $('body').append(el);
                            }

                            show();
                        });

                        function show() {
                            $('.safe-main-mask-high').show('fade');
                        }

                        function hide() {
                            $('.safe-main-mask-high').hide('fade');
                        }

                    }
                };
            }
        }
    }]);
});