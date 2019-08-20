/**
 * 视频巡更计划管理
 *
 * @author - dwt
 * @date - 2016-05-25
 * @version - 0.1
 */
define([
    'app',
    'system/monitorpatrol/js/filter/filterWeek',
    'cssloader!system/monitorpatrol/css/index.css'
], function(app) {
    app.controller('monitorpatrolController', [
        '$scope',
        '$state',
        'mainService',
        'iAjax',
        'iMessage',

        function($scope, $state, mainService, iAjax, iMessage) {
            mainService.moduleName = '定时计划';

            $scope.title = '视频巡更计划管理';

            $scope.plan = {
                list: [],

                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10,
                filterValue: '',

                //跳转到视频巡更计划子页
                addPlan: function() {
                    this.gotoItem({}, 'add');
                },
                modPlan: function(item) {
                    this.gotoItem(item, 'mod');
                },
                delPlan: function(item) {
                    delPlan([item.id], function() {
                        $scope.plan.getList();
                    });
                },
                gotoItem: function(plan, type) {
                    var params = {
                        data: {
                            item: plan,
                            type: type
                        }
                    };
                    $state.params = params;
                    $state.go('system.monitorpatrol.item', params);
                },

                change: function() {
                    $scope.plan.currentPage = this.currentPage;
                    $scope.plan.getList();
                },
                getListByKeybroad: function(event) {
                    if(event.keyCode == 13) {
                        $scope.plan.getList();
                    }
                },
                getList: function() {
                    var that = this,
                        pageNo = this.currentPage,
                        pageSize = this.pageSize,
                        searchText = this.filterValue;

                    this.list = [];
                    getList(pageNo, pageSize, searchText, function(list, params) {
                        that.list = list;

                        that.totalSize = params.totalSize;
                        that.pageSize = params.pageSize;
                        that.totalPage = params.totalPage;
                        that.currentPage = params.pageNo;
                    });
                },
                createPlan: function() {
                    var b = window.confirm('确定要生成今天的计划？请确保生成前数据库没有今天的计划');
                    if(b) {
                        createPlan(function() {
                            iMessage.show({
                                title: '视频巡更',
                                content: ('今天的计划已生成')
                            }, false);
                        });
                    }
                }
            };

            $scope.init = function() {
                $scope.plan.getList();
            };
            $scope.init();

            //获取视频巡更管理计划列表
            function getList(pageNo, pageSize, searchText, cb) {
                iAjax
                    .post('security/VideoWatchPlan.do?action=getPlanRule', {
                        params: {
                            pageNo: pageNo,
                            pageSize: pageSize
                        },
                        filter: {
                            searchText: searchText
                        }
                    })
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            if(cb && typeof(cb) === 'function') {
                                cb(data.result.rows, data.result.params);
                            }
                        }
                    });
            }

            function delPlan(ids, cb) {
                iAjax
                    .post('security/VideoWatchPlan.do?action=delPlanRule', {
                        ids: ids
                    })
                    .then(function(data) {
                        if(data && data.status == '1') {
                            if(cb && typeof(cb) === 'function') {
                                cb();
                            }
                        }
                    });
            }

            function createPlan(cb) {
                iAjax
                    .post('security/VideoWatchPlan.do?action=createPlan')
                    .then(function(data) {
                        if(data && data.status == '1') {
                            if(cb && typeof(cb) === 'function') {
                                cb();
                            }
                        }
                    });
            }

        }
    ]);
});