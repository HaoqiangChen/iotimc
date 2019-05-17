/**
 * 树形列表指令
 * Created by chq on 2019-12-30.
 */
define(['app'], function (app) {
  app.directive('syouTreeView', [function () {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, ngModel) {
        scope.$on('initTree', function (event, data) {
          var setting = {
            data: {
              key: {
                title: 't'
              },
              simpleData: {
                enable: true
              }
            },
            callback: {
              onClick: function (event, treeId, treeNode, clickFlag) {
                scope.$apply(function () {
                  ngModel.$setViewValue(treeNode);
                  scope.selectEvent(treeNode);
                });
              },
              onCheck: scope.checkEvent
            },
            showCode: data.showCode,
            check: {
              enable: data.checkFlag ? true : false
            }
          };

          if (data.chkboxType) {
            setting.check.chkboxType = data.chkboxType;
          }

          var oTree = $.fn.zTree.init(element, setting, data.zNodes);

          var nodes = oTree.getNodesByFilter(function (n) {
            return n.level == 0;
          });

          if (nodes.length > 0) {
            oTree.expandNode(nodes[0]);
          }
        });


        //添加节点
        scope.$on('addTreeNode', function (event, data) {
          var nodeObj = $.fn.zTree.getZTreeObj(element[0].id);
          var newNode = data.node;
          var selectNodes = nodeObj.getSelectedNodes();
          var nodes = selectNodes[0];

          nodes = nodeObj.addNodes(nodes, newNode);
        });

        //修改节点
        scope.$on('editTreeNode', function (event, data) {
          var nodeObj = $.fn.zTree.getZTreeObj(element[0].id);
          var editNode = data.node;

          var selectNodes = nodeObj.getSelectedNodes();
          selectNodes[0].name = data.node.name;
          selectNodes[0].alias = data.node.alias;
          selectNodes[0].code = data.node.code;

          nodeObj.updateNode(selectNodes[0]);
        });

        //删除节点
        scope.$on('deleteTreeNode', function (event, data) {
          var nodeObj = $.fn.zTree.getZTreeObj(element[0].id);
          var selectNode = nodeObj.getSelectedNodes();

          nodeObj.removeNode(selectNode[0]);
        });
      }
    };
  }]);
});