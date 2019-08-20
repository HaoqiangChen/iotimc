/**
 * 数据安全管理
 * Created by LLX on 2018-07-04.
 */
define([
    'app',
    'cssloader!system/datasafe/css/index.css'
], function(app) {
    app.controller('dataSafeController', ['$scope', '$state', 'iAjax','iMessage', 'iConfirm', 'mainService', '$filter', function($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '数据安全管理';
        $scope.title = '数据安全管理';
        $scope.dataSafe = {
            list: [
                {module: '业务信息管理', content: '删除警察李X名'},
                {module: '业务信息管理', content: '删除警察李X名'},
                {module: '报修管理', content: '删除201监控损坏'},
                {module: '设备管理', content: '删除IPC监控'},
                {module: '设备管理', content: '修改202监控'},
                {module: '单位管理', content: '删除西藏单位'},
                {module: '系统方言', content: '修改PTN_C'},
                {module: '地址映射', content: '修改mediastream'}
            ],
            backup: function () {

            },
            recovery: function() {
                var aSelect = $filter('filter')($scope.dataSafe.list, {checked: true});
                if(aSelect.length) {
                    iConfirm.show({
                        scope: $scope,
                        title: '数据还原',
                        content: '是否还原选择的记录？',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'confirmSuccess'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'confirmCancel'
                        }]
                    });
                } else {
                    iMessage.show({
                        title: '数据还原',
                        content: '请选择需要还原的记录!',
                        level: '3'
                    });
                }

            },
            select: function(item) {
                item.checked = !item.checked;
            }
        };
        $scope.confirmSuccess = function(id) {
            iMessage.show({
                title: '数据还原',
                content: '数据还原成功!',
                level: '1'
            });
            iConfirm.close(id);
        };

        $scope.confirmCancel = function(id) {
            iConfirm.close(id);
        };
    }]);
});