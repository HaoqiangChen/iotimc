define([
    'app',
    'safe/lib/ztree-3.5.22/jquery.ztree.all',
    'cssloader!safe/lib/ztree-3.5.22/zTreeStyle'
], function(app) {
    app.directive('safeZTree', [function() {
        return {
            restrict: 'EA',
            scope: {
                idKey: '@idKey', // 数据唯一标志
                pIdKey: '@pIdKey', // 父节点的id
                data: '=ztData',    // 各节点数据
                clickCallBack: '=ztClick',  // 点击事件
            },
            replace: true,
            link: function($scope, $element) {
                var setting = {
                    view: {
                        dblClickExpand: false
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: $scope.idKey || 'id',
                            pIdKey:$scope.pIdKey || 'parentid',
                        }
                    },
                    callback: {
                        onClick: onClick
                    }
                };

                function onClick(e, treeId, treeNode) {
                    $scope.clickCallBack(treeNode);
                }

                var id = 'ztree';
                if($element.attr('id')) {
                    id = $element.attr('id');
                }

                $element.addClass('ztree');

                $scope.$watch('data', function(data) {
                    if(data && data.length > 0) {
                        $.fn.zTree.init($("#" + id), setting, $scope.data);
                    }
                });
            }
        }
    }]);
});