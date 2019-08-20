/**
 * 信息牌管理
 *
 * @author - dwt
 * @date - 2016-09-14
 * @version - 0.1
 */
define([
    'app',
    'system/infocard/js/directives/infocardTemplate',
    'system/infocard/js/services/infocardData',
    'system/infocard/relation/js/directives/infocardTree',
    'cssloader!system/infocard/relation/css/index.css',
    'cssloader!safe/insidemap/css/infocard.css',
    'cssloader!system/infocard/css/infocard.css'
], function(app) {

    app.controller('infocardRelationController', [
        '$scope',
        '$state',
        '$location',
        '$anchorScroll',
        'mainService',
        'iMessage',
        'infocardData',

        function($scope, $state, $location, $anchorScroll, mainService, iMessage, infocardData) {

            mainService.moduleName = '信息牌关联';

            $scope.back = function() {
                var params = {'data': null};
                $state.params = params;
                $state.go('system.infocard', params);
            };

            $scope.template = {};
            $scope.template.typeList = [{name: '罪犯', type: 'criminal'}, {name: '警察', type: 'police'}];
            $scope.template.typeItem = $scope.template.typeList[0];
            $scope.template.list = {
                items: [],
                filterValue: '',
                getList: function() {

                    $scope.template.list.items = [];

                    infocardData.getInfocardList($scope.template.typeItem.type, function(list) {
                        $scope.template.list.items = list;

                        $scope.template.relation.getInfocardRelationByOu($scope.template.relation.related.id, $scope.template.typeItem.type);
                    });

                }
            };

            $scope.template.relation = {
                list: [],
                related: {},
                data: {
                    setting: {
                        data: {
                            key: {
                                title: 't'
                            },
                            simpleData: {
                                enable: true
                            }
                        },
                        callback: {
                            onClick: function(event, treeId, treeNode) {
                                var hasRelateds = _.filter($scope.template.list.items, {related: true});
                                if(hasRelateds.length) {
                                    _.each(hasRelateds, function(o) {
                                        o.related = false;
                                    });
                                }

                                $scope.template.relation.related = treeNode;
                                $scope.template.relation.getInfocardRelationByOu(treeNode.id, $scope.template.typeItem.type);
                            }
                        }
                    },
                    tree: {
                        treeNodes: []
                    }
                },
                select: function(item) {
                    //删掉当前单位或地图已关联的信息牌信息（不包含当前选择的信息牌）
                    //若当前信息牌未关联
                    //删掉以前关联过的信息牌，再对当前信息牌进行关联
                    //若当前信息牌已关联
                    //删掉所有已关联的信息牌

                    var hasRelatedTemplate = _.filter($scope.template.list.items, function(row) {
                        return (row.relationid && row.related && row.id != item.id);
                    });

                    _.each(hasRelatedTemplate, function(t) {
                        infocardData.delInfocardRelation(t.relationid, function() {
                            t.related = false;
                            t.relationid = null;
                        });
                    });

                    //信息牌未关联则进行添加
                    if(item.related) {
                        infocardData.addInfocardRelation($scope.template.relation.related.id, item.id, function(relationid) {
                            item.relationid = relationid;
                        }, function() {
                            item.related = false;
                        });
                    }else {
                        infocardData.delInfocardRelation(item.relationid, function() {

                            iMessage.show({
                                level: '1',
                                title: '信息牌',
                                content: '解绑成功'
                            });

                            item.related = false;
                            item.relationid = null;
                        });
                    }

                },
                getOuList: function() {
                    infocardData.getMapOuList(function(list) {
                        $scope.template.relation.data.tree.treeNodes = list;

                        //找到树的根节点
                        var rows = _.filter(list, function(row) {
                            return (row.type == 'ou' && !row.parentid)
                        });

                        //默认查找根节点的关联信息牌
                        if(rows.length) {
                            $scope.template.relation.related = rows[0];
                            $scope.template.relation.getInfocardRelationByOu(rows[0].id, $scope.template.typeItem.type);
                        }
                    })
                },
                getInfocardRelationByOu: function(id, type) {
                    if(!id || !type) return;

                    infocardData.getInfocardRelation(id, type, function(list) {
                        var find;
                        _.each(list, function(row) {
                            find = _.find($scope.template.list.items, {id: row.infocardfk});
                            if(find) {
                                find.related = true;
                                find.relationid = row.id;
                                // $location.hash('template' + row.infocardfk);
                                // $anchorScroll();

                                /**
                                 * 兼容CS客户端1.1版本，
                                 * $location.hash设置url地址，$anchorScroll()自动锚点跳转，CS 1.1客户端不兼容，改为JQ锚点跳转；
                                 * @author - hj
                                 * @date - 2018-04-11
                                  */
                                var top = $('#template'+row.infocardfk).parent().get(0).getBoundingClientRect().top;
                                $('.system-infocard-content').animate({scrollTop: $('#template' + row.infocardfk).offset().top - top - 20}, 500);
                            }
                        });
                    })
                }
            };

            $scope.template.list.getList();
            $scope.template.relation.getOuList();

        }
    ]);

});