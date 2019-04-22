/**
 * 选择轮巡组服务
 *
 * Created by HJ on 2018/6/12.
 */
define([
    'app',
    'cssloader!safe/affairs/manage/css/affairsLocalpolling',
    'safe/affairs/manage/js/controllers/affairsLocalpollingController'
], function(app) {
    app.factory('affairsLocalpollingStorage', ['$uibModal', '$rootScope', function($uibModal, $rootScope) {

        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function(data) {
                result = data;
            });

            return result;
        }

        function _show(data) {

            $uibModal.open({
                controller: 'affairsLocalpollingController',
                windowClass: 'iiw-safe-modal-localpolling',
                size: 'lg',
                template: getTemplate($.soa.getWebPath('iiw.safe.affairs.manage') + '/view/affairsLocalpolling.html')
            });

            $rootScope.iiwSafeLocalpolling = data || [];
        }

        return {
            show: _show
        }
    }]);
});
