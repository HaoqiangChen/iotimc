/**
 * 树
 *
 * @author - dwt
 * @date - 2016-05-27
 * @version - 0.1
 */
define(['app'], function(app) {
    app.directive('systemMonitorpatrolTree', [function() {
        return {
            restrict: 'A',
            scope: {
                data: '=data'
            },
            link: function(scope, element) {

                scope.$watch('data.tree.treeNodes', function(treeNodes) {
                    if(treeNodes) {
                        angular.forEach(treeNodes, function(item) {
                            if(item['pId'] && item.type == 'ou') {
                                item['pid'] = item['pId']
                            }else if(item['pId'] && item.type != '') {
                                item['pid'] = item['pId']
                            }else {
                                item['pId'] = '0';
                            }
                        });

                        scope.data.oNode = $.fn.zTree.init(element, scope.data.setting, treeNodes);

                        var nodes = scope.data.oNode.getNodesByFilter(function(n) {
                            return n.level == 0;
                        });

                        if(nodes.length > 0) {
                            scope.data.oNode.expandNode(nodes[0]);
                        }
                    }
                });

            }
        };
    }]);
});