/**
 * 门禁严管设置 - 单位树指令
 *
 * Created by YBW on 2016-12-27
 */
define(['app'], function(app) {
    app.directive('severeOuTree', [function() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="ztree"></div>',
            scope: false,
            link: function(scope, $element) {
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: 'id',
                            pIdKey: 'pid'
                        },
                        keep: {
                            leaf: false,
                            parent: true
                        }
                    },
                    callback: {
                        onCheck: scope.selectEvent
                    },
                    check: {
                        enable: true
                    }
                };

                scope.$on('severe-tree', function() {

                    var severe = scope.severe;

                    var treeNode = $.fn.zTree.init($element, setting, severe.ouList);

                    treeNode.getNodesByFilter(function(n) {
                        if(!n.level) {
                            treeNode.expandNode(n);
                        }
                    });

                    severe.treeNode = treeNode;
                    severe.synchronization();
                });

            }
        }
    }]);
});