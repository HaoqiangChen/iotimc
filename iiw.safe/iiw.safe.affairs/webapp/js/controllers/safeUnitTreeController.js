/**
 * 选择单位
 *
 * Created by YBW on 2017-04-06
 */
define(['app'], function(app) {
    app.controller('safeUnitTreeController', ['iAjax', '$scope', '$uibModalInstance', '$rootScope', function(iAjax, $scope, $uibModalInstance, $rootScope) {

        var obj = {};
        $scope.tree = {
            data: [],

            //多选状态下单击叠加选择或者删除
            clickNode: function(data) {

                if(data.check) {

                    if(obj[data.id]) {
                        delete obj[data.id];
                    }

                } else {

                    obj[data.id] = data;

                }

            },

            //加载执行，切换单位头logo
            load: function() {

                var tops = _.where($scope.tree.data, {__istop: true});
                $.each(tops, function(i, top) {
                    top.icon = 'fa-home text-warning';
                });
            },

            //单选状态下，单击确定选择
            manyClick: function(data) {
                if(!data.treeNodes) {
                    var address = $rootScope.initTreeReturnAddress;
                    $rootScope[address](data);
                    $uibModalInstance.close();
                }
            }
        };

        //请求单位树
        iAjax.post('sys/web/syou.do?action=getSyouAll').then(function(data) {

            if(data.result && data.result.rows) {
                $.each(data.result.rows, function(i, o) {
                    o.parentid = o.pId;
                });
                $scope.tree.data = data.result.rows;
            }

        });

        //关闭弹框
        $scope.close = function(data) {

            var address = $rootScope.initTreeReturnAddress;
            if(address && data) {
                $rootScope[address](obj);
            }

                $uibModalInstance.close();

        };
    }]);
});
