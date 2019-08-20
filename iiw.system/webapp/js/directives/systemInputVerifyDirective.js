/**
 * 输入框检测指令
 * Created by zcl on 2016/4/19.
 */
define(['app'], function(app) {
    app.directive('systemInputVerify', [function() {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, element) {
                scope.$watch('m_sMode', function(n) {
                    if (n == 'view') {
                        $(element).attr('disabled', 'true');
                    } else {
                        $(element).removeAttr('disabled');
                    }
                });
            }
        }
    }]);
});