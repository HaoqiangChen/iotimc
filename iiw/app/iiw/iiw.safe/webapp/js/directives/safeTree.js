/**
 * @module iiw.safe.directives
 */
define([
    'app',
    'safe/js/directives/safeTreeNode',
    'cssloader!safe/css/tree'
], function(app) {
    /**
     * 简单树形控件。
     * 1. 安防平台框架已载入，无法重复加载。
     * 2. 其它框架框架需加载，请加载'safe/js/directives/safeTree'。
     * 3. 此类为指令，直接在html中使用，restrict: 'EA'。
     * ***
     *     JS:
     *     app.controller('***Controller', ['$scope', function($scope) {
	 *         $scope.data = [{
	 *              id: 1,
	 *              name: '顶级'
	 *         },{
	 *              id: 1-1,
	 *              parentid: 1,
	 *              name: '一级1'
	 *         },{
	 *              id: 1-2,
	 *              parentid: 1,
	 *              name: '一级2'
	 *         },];
	 *
	 *         $scope.clickNode = function(node) {
	 *              console.log('点击了：', node);
	 *         };
	 *
	 *         $scope.load = function() {
	 *              console.log('加载完毕！');
	 *         };
	 *     }]);
     *
     *     HTML:
     *     <safe-tree tv-data="data" tv-click="clickNode" tv-load="load"></safe-tree>
     *
     * @class safeTree
     *
     *
     *
     * @author : yjj
     * @version : 1.0
     * @Date : 2016-08-08
     */

    /**
     * 树形控件数据源，改变后，树形内容会重新加载。
     *
     * @param id {String} （必填）唯一编号。
     * @param parentid {String} （必填）上级编号，顶级节点为不存在该属性，或找不到对应id的节点；。
     * @param name {String} （必填）显示的文字。
     * @param check {Bollean} 是否选中，指令属性tv-checkbox="true"时生效。
     *
     * @example
     *         $scope.data = [{
	 *              id: 1,
	 *              name: '顶级'
	 *         },{
	 *              id: 1-1,
	 *              parentid: 1,
	 *              name: '一级1'
	 *         },{
	 *              id: 1-2,
	 *              parentid: 1,
	 *              name: '一级2'
	 *         },];
     *
     *
     * @property tv-data
     * @type JsonArray
     */

    /**
     * 是否显示复选框。
     *
     * @property tv-checkbox
     * @type Boolean
     */

    /**
     * 树形加载完毕后触发的事件。
     *
     * @property tv-load
     * @type Function
     */

    /**
     * 点击节点触发的事件。
     *
     * @property tv-click
     * @type Function
     */

    app.directive('safeTree', [function() {
        var _data,
            _nodeById = {},
            _nodeByParentId = {};

        return {
            restrict: 'EA',
            replace: true,
            template: '<div class="safe-tree-panel fz-7" i-scroll data-config="{&quot;scrollX&quot;: true, &quot;mouseWheel&quot;: true, &quot;scrollbars&quot;: true, &quot;fadeScrollbars&quot;: true}"><div style="position: absolute"><safe-tree-node ng-repeat="node in treeNodes | orderBy: [\'tree_index\', \'name\']"></safe-tree-node></div></div>',
            scope: {
                data: '=tvData',
                hasCheck: '=tvCheckbox',
                loadCallBack: '=tvLoad',
                clickCallBack: '=tvClick',
                panStartCallBack: '=tvPanStart',
                panMoveCallBack: '=tvPanMove',
                panEndCallBack: '=tvPanEnd'
            },
            link: function($scope) {
                $scope.$watch('data', function(list) {
                    _data = formatNodes(list);
                    $scope.treeNodes = getTopNodes();

                    if($scope.treeNodes.length) {
                        $scope.treeNodes[0].__isopen = true;
                    }

                    if($scope.loadCallBack) {
                        $scope.loadCallBack();
                    }
                });

                $scope.getChildNodes = function(id) {
                    return _nodeByParentId[id];
                };

                $scope.clickNode = function(scope, node, e, type) {
                    if(!node.treeNodes) {
                        node.treeNodes = $scope.getChildNodes(node.id);
                    }

                    if(!node.__islast && !($scope.hasCheck && e && e.target.nodeName == 'INPUT')) {
                        if(!node.__isopen) {
                            node.__isopen = true;
                        } else {
                            node.__isopen = false;
                        }
                    }

                    if(!$scope.hasCheck) {
                        if($scope.clickCallBack) $scope.clickCallBack(node, type);
                    }else {
                        if(e && e.target.nodeName == 'INPUT') {
                            if($scope.clickCallBack) $scope.clickCallBack(node, type);
                        }
                    }
                };

                $scope.panStart = function(e, node) {
                    if($scope.panStartCallBack) $scope.panStartCallBack(e, node);
                };

                $scope.panMove = function(e, node) {
                    if($scope.panMoveCallBack) $scope.panMoveCallBack(e, node);
                };

                $scope.panEnd = function(e, node) {
                    if($scope.panEndCallBack) $scope.panEndCallBack(e, node);
                };

                function formatNodes(list) {
                    _nodeById = {};
                    _nodeByParentId = {};

                    if(list) {
                        $.each(list, function(i, node) {
                            if(node.id) {
                                _nodeById[node.id] = node;
                            }
                            if(node.parentid) {
                                if(_nodeByParentId[node.parentid]) {
                                    _nodeByParentId[node.parentid].push(node);
                                } else {
                                    _nodeByParentId[node.parentid] = [node];
                                }
                            }
                            node.__init = false;
                        });

                        $.each(list, function(i, node) {
                            if(!node.parentid || !_nodeById[node.parentid]) {
                                node.__istop = true;
                            }

                            if(node.id && !_nodeByParentId[node.id]) {
                                node.__islast = true;
                            }
                        });
                    }

                    return list;
                }

                function getTopNodes() {
                    var result = [];
                    $.each(_data, function(i, node) {
                        if(node.__istop) result.push(node);
                    });
                    return result;
                }
            }
        }
    }]);
});