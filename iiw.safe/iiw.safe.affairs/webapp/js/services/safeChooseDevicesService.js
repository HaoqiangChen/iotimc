/**
 * 选择设备服务
 *
 * Created by YBW on 2017/4/10.
 */
define([
    'app',
    'cssloader!safe/affairs/css/safeChooseDevices',
    'safe/affairs/js/controllers/safeChooseDevicesController'
], function(app) {
    app.factory('devicesStorage', ['$uibModal', '$rootScope', function($uibModal, $rootScope) {

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

        function _show(address, ids, way) {

            $uibModal.open({
                controller: 'safeChooseDevicesController',
                windowClass: 'iiw-safe-modal-choose-devices',
                size: 'lg',
                template: getTemplate($.soa.getWebPath('iiw.safe.affairs') + '/view/safeChooseDevices.html')
            });

            $rootScope.iiwSafeChooseDevice = (address || '') + (ids ? ',' + ids : '') + (way ? ',' + way : '');
        }

        return {
            show: _show
        }
    }]);
});
