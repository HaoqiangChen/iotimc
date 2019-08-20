/**
 * Created by ZJQ on 2016-03-08.
 */
define(['app'], function(app) {
    app.directive('tree', function () {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                //var opts = angular.extend({}, $scope.$eval(attrs.nlUploadify));
                var setting = {
                    data: {
                        key: {title: "t"},
                        simpleData: { enable: true }
                    },
                    callback: {
                        onClick: function (event, treeId, treeNode, clickFlag) {
                            scope.$apply(function (){
                                ngModel.$setViewValue(treeNode);
                                scope.selectEvent(treeNode);
                            });
                        }
                    }
                };
                //var zNodes = [{ id: 1, pId: 0, name: "1", t: "1", open: true }, { id: 11, pId: 1, name: "11", t: "11" }, { id: 12, pId: 1, name: "12", t: "12" }, { id: 13, pId: 1, name: "13", t: "13" }, { id: 2, pId: 0, name: "2", t: "2", open: true }, { id: 21, pId: 2, name: "21", t: "21", click: false }, { id: 22, pId: 2, name: "22", t: "22", click: false }, { id: 23, pId: 2, name: "23", t: "23", click: false }, { id: 3, pId: 0, name: "3", t: "3", open: true, click: false }, { id: 31, pId: 3, name: "31", t: "31" }, { id: 32, pId: 3, name: "32", t: "32" }, { id: 33, pId: 3, name: "33", t: "33" } ];

                $.fn.zTree.init(element, setting, scope.$parent.selectNode.zNodes);


                scope.$on('addTreeNode', function(event, data){
                    var nodeObj = $.fn.zTree.getZTreeObj(element[0].id);
                    var newNode = data.node;
                    var selectNodes = nodeObj.getSelectedNodes();
                    var nodes = selectNodes[0];

                    nodes = nodeObj.addNodes(nodes, newNode);
                });

                scope.$on('editTreeNode', function(event, data){
                    var nodeObj = $.fn.zTree.getZTreeObj(element[0].id);
                    var editNode = data.node;

                    var selectNodes = nodeObj.getSelectedNodes();
                    selectNodes[0].name = data.node.name;
                    selectNodes[0].alias = data.node.alias;
                    selectNodes[0].code = data.node.code;

                    nodeObj.updateNode(selectNodes[0]);
                });

                scope.$on('deleteTreeNode', function(event, data){
                    var nodeObj = $.fn.zTree.getZTreeObj(element[0].id);
                    var selectNode = nodeObj.getSelectedNodes();

                    nodeObj.removeNode(selectNode[0]);
                });
            }
        };
    });
});