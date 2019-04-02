/**
 * Created by LLX on 2015-11-24.
 */
define([
    'app',
    'safe/sjposition/lib/ztree-3.5.22/jquery.ztree.all',
    'cssloader!safe/sjposition/lib/ztree-3.5.22/zTreeStyle.css'
], function(app) {
    app.directive('safePositionTree', ['iAjax', '$filter',
        function (iAjax, $filter) {
            return {
                restrict: 'AE',
                scope: {
                    treeData: '=treeData',
                    treeList: '=treeList',
                },
                link: function ($scope, $element) {
                    var zTreeObj;
                    var setting = {
                        data: {
                            simpleData: {
                                enable: true,
                                idKey: "id",
                                pIdKey: "pid"
                            }
                        },
                        callback: {
                            onExpand: function(event, treeId, treeNode) {
                                getCrminalList(treeNode);
                            }
                        }
                    };
                    var zNodes = [];
                    var clickNum = 0;
                    function getOuTree() {
                        var data = {
                            filter: {
                                syoufk: '',
                                type: 'sqjz'
                            }
                        };
                        iAjax
                            .post('security/information/information.do?action=getCriminalNUmberSJ', data)
                            .then(function (data) {
                                if(data && data.result.rows) {
                                    $.each(data.result.rows, function(i, o) {
                                        o.name = o.name + '(总人数: '+ o.num +')';
                                        o.type = 'ou'
                                    });
                                    zNodes = data.result.rows;
                                    setting.callback.onClick = function(event, treeId, treeNode) {
                                        if(clickNum > 1) {
                                            setTimeout(function() {
                                                clickNum = 0;
                                            }, 300)
                                        } else {
                                            clickNum += 1;
                                            getCrminalList(treeNode, clickNum);
                                        }
                                    };
                                    zTreeObj = $.fn.zTree.init($element, setting, zNodes);
                                }
                            })
                    }

                    function getCrminalList(node, index) {
                        var userNode = $filter('filter')(node.children, {type: 'user'});
                        if(node && userNode && !userNode.length) {
                            var data = {
                                filter: {
                                    syoufk: node.id,
                                    type: 'sqjz'
                                }
                            };
                            iAjax
                                .post('security/information/information.do?action=getCriminalNUmberSJ', data)
                                .then(function (data) {
                                    if(data && data.result.rows && data.result.rows.length) {
                                        var list = [];
                                        $.each(data.result.rows, function(i, o) {
                                            o.pid = node.id;
                                            o.name = o.xm;
                                            o.type = 'user';
                                        });
                                        /*$.each(data.result.rows, function (index, item) {
                                            if($scope.$parent.SJGis.list[index] && $scope.$parent.SJGis.list[index].x) {
                                                item.x = $scope.$parent.SJGis.list[index].x;
                                                item.y = $scope.$parent.SJGis.list[index].y;
                                            }
                                        });*/
                                        var aSelect = $filter('filter')(node.children, {type: 'user'});
                                        list = aSelect.concat(data.result.rows);
                                        var nodes = zTreeObj.getSelectedNodes();
                                        zTreeObj.addNodes(nodes[0] ? nodes[0] : node, _.unique(list));
                                    }
                                })
                        } else {
                            if(node.type == 'user') {
                                $scope.$parent.clickMark(node)
                            } else if(!node.children && index && index == 1){
                                var data = {
                                    filter: {
                                        syoufk: node.id,
                                        type: 'sqjz'
                                    }
                                };
                                iAjax
                                    .post('security/information/information.do?action=getCriminalNUmberSJ', data)
                                    .then(function (data) {
                                        if(data && data.result.rows && data.result.rows.length) {
                                            var list = [];
                                            $.each(data.result.rows, function(i, o) {
                                                o.pid = node.id;
                                                o.name = o.xm;
                                                o.type = 'user';
                                            });
                                            /*$.each(data.result.rows, function (index, item) {
                                                if($scope.$parent.SJGis.list[index] && $scope.$parent.SJGis.list[index].x) {
                                                    item.x = $scope.$parent.SJGis.list[index].x;
                                                    item.y = $scope.$parent.SJGis.list[index].y;
                                                }
                                            });*/
                                            var aSelect = $filter('filter')(node.children, {type: 'user'});
                                            if(!aSelect) {
                                                aSelect = [];
                                            }
                                            list = aSelect.concat(data.result.rows);
                                            var nodes = zTreeObj.getSelectedNodes();
                                            zTreeObj.addNodes(nodes[0] ? nodes[0] : node, _.unique(list));
                                        }
                                    })
                            }
                        }
                    }

                    getOuTree();

                }
            };
        }
    ]);
});