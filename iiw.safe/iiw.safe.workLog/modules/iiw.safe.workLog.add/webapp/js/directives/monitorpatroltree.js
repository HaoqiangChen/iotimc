/**
 * 树
 *
 * @author - dwt
 * @date - 2016-05-27
 * @version - 0.1
 */
define(['app'], function (app) {
  app.directive('monitorpatrolTree', [function () {
    return {
      restrict: 'A',
      scope: {
        data: '=data'
      },
      link: function (scope, element) {

        scope.$watch('data.tree.treeNodes', function (treeNodes) {
          if (treeNodes) {

            angular.forEach(treeNodes, function (item) {
              if (!item['pId']) {
                if (item['parentid']) {
                  item['pId'] = item['parentid'];
                } else if (item['syoufk']) {
                  item['pId'] = item['syoufk'];
                } else {
                  item['pId'] = '0';
                }
              }
            });

            scope.data.oNode = $.fn.zTree.init(element, scope.data.setting, treeNodes);
          }
        });

      }
    };
  }]);
});