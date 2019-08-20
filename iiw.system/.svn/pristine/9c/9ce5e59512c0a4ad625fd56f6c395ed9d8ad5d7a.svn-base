/**
 * 系统配置模块-添加
 *
 * Created by llx on 2015-10-27.
 */
define([
    'app',
    'cssloader!system/syconfig/item/css/index.css'
], function(app) {
    app.controller('syconfigItemController', [
        '$scope',
        'iAjax',
        '$state',
        'iTimeNow',

        function($scope, iAjax, $state, iTimeNow) {
            $scope.title = '';
            $scope.itemNumber = '';
            $scope.itemName = '';
            $scope.itemKey = '';
            $scope.itemContent = '';
            $scope.itemRemark = '';
            $scope.syconfigItem = {
                save: function() {
                    var data = {
                        rows: [
                            {
                                name: $scope.itemName,
                                key: $scope.itemKey,
                                content: $scope.itemContent
                            }
                        ]
                    };
                    iAjax
                        .post('sys/web/config.do?action=setConfig', data)
                        .then(function(data) {
                            if(data.status == '1') {
                                var message = {};
                                message.id = iTimeNow.getTime();
                                message.level = 1;
                                message.title = $scope.title;
                                message.content = '保存成功';
                            }
                        })
                },
                back: function() {
                    $state.go('system.syconfig')
                }
            }
        }
    ])
});
