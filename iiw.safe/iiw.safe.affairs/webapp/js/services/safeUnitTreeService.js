/**
 * 弹框选择单位
 *
 * Created by YBW on 2017-04-6
 */
define([
    'app',
    'safe/affairs/js/controllers/safeUnitTreeController'
], function(app) {
    app.factory('unitTree', ['$uibModal', '$rootScope', function($uibModal, $rootScope) {

        function _show(address, way) {
            var safeTree = '<safe-tree tv-data="tree.data" tv-click="tree.manyClick" tv-load="tree.load"></safe-tree>',
                button = '';

            //查看是否为多选
            if(way == 'single') {
                safeTree = '<safe-tree tv-data="tree.data" tv-click="tree.clickNode" tv-checkbox="true" tv-load="tree.load"></safe-tree>';
                button = '<button class="btn btn-success" ng-click="close(true)">选择</button>';
            }

            var unitTreeHtml = '<div class="modal-header"><h3>选择单位</h3></div>' +
                '<div class="modal-body" i-scroll>' +
                safeTree +
                '</div>' +
                '<div class="modal-footer text-right">' +
                button +
                '<button class="btn btn-danger" ng-click="close()">关闭</button>' +
                '</div>';

            //加载单位树
            $uibModal.open({
                template: unitTreeHtml,
                controller: 'safeUnitTreeController',
                size: 'md',
                windowClass: 'iiw-safe-modal-choose-unit'
            });

            $rootScope.initTreeReturnAddress = address;

        }

        return {
            show: _show
        }
    }]);
});