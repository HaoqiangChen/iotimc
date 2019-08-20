/**
 * 信息牌关联左侧的单位地图树
 *
 * @author - dwt
 * @date - 2016-05-27
 * @version - 0.1
 */
define(['app'], function(app) {
    app.directive('infocardTree', [function() {
        return {
            restrict: 'A',
            scope: {
                data: '=data'
            },
            link: function(scope, element) {

                scope.$watch('data.tree.treeNodes', function(treeNodes) {
                    if(treeNodes) {

                        angular.forEach(treeNodes, function(item) {
                            if(!item['pId']) {
                                if(item['parentid']) {
                                    item['pId'] = item['parentid'];
                                }else if(item['syoufk']) {
                                    item['pId'] = item['syoufk'];
                                }else {
                                    item['pId'] = '0';
                                }
                            }
                        });

                        scope.data.oNode = $.fn.zTree.init(element, scope.data.setting, treeNodes);

                        var nodes = scope.data.oNode.getNodesByFilter(function(n) {
                            return n.level == 0;
                        });

                        if(nodes.length > 0) {
                            scope.data.oNode.expandNode(nodes[0]);
                            scope.data.oNode.selectNode(nodes[0]);
                        }

                    }
                });

            }
        };
    }]);
});