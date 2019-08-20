
/**
 * 地图树
 *
 * @author - dwt
 * @date - 2016-03-23
 * @version - 0.1
 */
define(['app'], function(app) {
    app.directive('mapsettingTree', [function() {
        return {
            restrict: 'A',
            scope: {
                data: '=data'
            },
            link: function(scope, element) {

                scope.$watch('data.tree.treeNodes', function(treeNodes) {
                    if(treeNodes) {

                        treeNodes = angular.copy(treeNodes);

                        angular.forEach(treeNodes, function(item) {
                            if(item['parentid']) {
                                item['pId'] = item['parentid'];
                            }else {
                                item['pId'] = '0';
                            }
                            if(item['children']) {
                                delete item['children'];
                            }
                        });

                        var oTree = $.fn.zTree.init(element, scope.data.setting, treeNodes);

                        var nodes = oTree.getNodesByFilter(function(n) {
                            return n.level == 0;
                        });

                        if(nodes.length > 0) {
                            oTree.expandNode(nodes[0]);
                        }
                    }
                });

            }
        };
    }]);
});