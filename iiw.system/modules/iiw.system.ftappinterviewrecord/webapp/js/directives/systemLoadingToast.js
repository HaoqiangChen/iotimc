/**
 * loading效果
 * @author : chq
 * @version : 1.0
 * @date : 2019/8/18
*/
define([
    'app',
    'cssloader!system/ftappinterviewrecord/css/loading'
], function(app) {
    var html = '';
    html += '<div class="system-loading-toast" ng-class="loading.className">';
    html += '    <div class="loading-toast">';
    html += '    <i class="loading-icon fa fa-spinner fa-pulse fa-5x fa-fw"></i>';
    html += '    <p class="loading-content">{{loading.content}}...</p>';
    html += '</div>';
    html += '</div>';


    app.directive('systemLoadingToast', [
        function() {

            return {
                restrict: 'E',
                // template: iAjax.getTemplate('iiw.safe.ftappinterviewrecord', '/view/loading.html'),
                template: html,
                replace: true,
                link: function($scope, $element) {
                    // $element.hide();
                    $scope.loading = {
                        className: '',
                        content: '数据加载中',
                        hide: function () {
                            $element.hide();
                        }
                    }
                }
            }
        }
    ]);
});
