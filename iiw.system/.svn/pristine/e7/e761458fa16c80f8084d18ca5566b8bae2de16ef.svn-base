/**
 * 主题管理-datax主题关联
 * Created by hj in 2019-07-15..
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/dataxrelate/css/index.css',
    'system/dataxrelate/js/directives/systemDataxIconDirective'
], function(app, angularAMD) {
    var packageName = 'iiw.system.dataxrelate';

    app.controller('dataxrelateController', ['$scope', '$state', 'iAjax', 'iMessage', 'mainService', 'iTimeNow', '$location',
        function($scope, $state, iAjax, iMessage, mainService, iTimeNow, $location) {
            mainService.moduleName = '主题管理';

            $scope.dataxrelate = {
                title: 'datax主题关联',
                listFilter: {
                    searchText: '',
                    status: '' // 状态
                },
                mainFilter: {
                    searchText: '',
                    status: '', // 状态
                    selectMainAll: false
                },
                relatedFilter: {
                    searchText: '',
                    status: '', // 状态
                    selectRelateAll: false
                },
                list: [],
                currentPage: 1,
                totalPage: 1,
                pageSize: 14,
                countInfo: {
                    totalSize: 0,
                    yes: 0,
                    no: 0
                },
                mainCurrentPage: 1,
                mainTotalPage: 1,
                mainPageSize: 5,
                relateCurrentPage: 1,
                relateTotalPage: 1,
                relatePageSize: 5,
                // 点击分页页码后页面跳转事件
                pageChanged: function() {
                    $scope.dataxrelate.currentPage = this.currentPage;
                    getDataxrelate();
                },
                // 根据图表主题类型查询图表主题信息
                filterDatax: function() {
                    getDataxrelate();
                },
                // 搜索图表主题
                search: function() {
                    getDataxrelate();
                },
                // 图表主题选中事件
                chooseRow: function(row) {
                    var matchRows = _.where($scope.dataxrelate.list, {checked: true});
                    if(matchRows.length > 0) {
                        $.each(matchRows, function(i, o) {
                            o.checked = false;
                        });
                    }
                    row.checked = true;
                    $scope.dataxrelate.mainDatax = [row];
                    getrelateDatax(row);
                },
                // 配置图表主题关联
                config: function() {
                    reset();
                    $state.go('system.dataxrelate.config');
                },
                // 根据联动图表主题信息
                filtermainDatax: function() {
                    var url, data;
                    url = 'datax/datatheme.do?action=getDatathemeFilter';
                    data = {
                        filter: $scope.dataxrelate.mainFilter,
                        params: {
                            pageNo: $scope.dataxrelate.mainCurrentPage,
                            pageSize: $scope.dataxrelate.mainPageSize
                        }
                    };

                    iAjax.post(url, data).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.dataxrelate.mainDataxList = data.result.rows.datathemes;

                            if($scope.dataxrelate.mainDatax && $scope.dataxrelate.mainDatax.length > 0) {
                                _.each($scope.dataxrelate.mainDatax, function(val) {
                                    _.each($scope.dataxrelate.mainDataxList, function(v) {
                                        if(v.id == val.id) {
                                            v.checked = val.checked;
                                        }
                                    })
                                });
                            }
                        } else {
                            $scope.dataxrelate.mainDataxList = [];
                        }

                        if(data.result.params) {
                            var params = data.result.params;
                            $scope.dataxrelate.mainTotalSize = params.totalSize;
                            $scope.dataxrelate.mainPageSize = params.pageSize;
                            $scope.dataxrelate.mainTotalPage = params.totalPage;
                            $scope.dataxrelate.mainCurrentPage = params.pageNo;
                        }
                    }, function() {
                        var message = {};
                        message.level = 4;
                        message.title = '消息提醒';
                        message.content = '网络连接失败!';
                        iMessage.show(message, false);
                    });
                },
                // 查询关联图表主题信息
                filterrelateDatax: function() {
                    var url, data;
                    url = '/datax/datatheme.do?action=getDatathemeall';

                    data = {
                        params: {
                            pageNo: $scope.dataxrelate.relateCurrentPage,
                            pageSize: $scope.dataxrelate.relatePageSize
                        },
                        filter: $scope.dataxrelate.relatedFilter
                    };

                    iAjax.post(url, data).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.dataxrelate.relateDataxList = data.result.rows.datathemes;
                            var tempArr = $scope.dataxrelate.relateDatax;
                            _.each(tempArr, function(temp) {
                                _.each($scope.dataxrelate.relateDataxList, function(list) {
                                    if(temp.id == list.id) {
                                        list.checked = true;
                                    }
                                });
                            });
                        } else {
                            $scope.dataxrelate.relateDataxList = [];
                        }

                        if(data.result.params) {
                            var params = data.result.params;
                            $scope.dataxrelate.relateTotalSize = params.totalSize;
                            $scope.dataxrelate.relatePageSize = params.pageSize;
                            $scope.dataxrelate.relateTotalPage = params.totalPage;
                            $scope.dataxrelate.relateCurrentPage = params.pageNo;
                        }
                    }, function() {
                        var message = {};
                        message.level = 4;
                        message.title = '消息提醒';
                        message.content = '网络连接失败!';
                        iMessage.show(message, false);
                    });
                },
                // 搜索图表主题信息
                searchDatax: function(flag) {
                    $scope.dataxrelate.mainFilter.selectMainAll = false;
                    $scope.dataxrelate.relatedFilter.selectRelateAll = false;
                    if(flag == 'main') {
                        $scope.dataxrelate.filtermainDatax();
                    } else if(flag == 'relate') {
                        $scope.dataxrelate.filterrelateDatax();
                    }
                },
                // 图表主题分页跳转事件
                pageOnChanged: function(flag) {
                    if(flag == 'main') {
                        $scope.dataxrelate.mainCurrentPage = this.mainCurrentPage;
                        $scope.dataxrelate.filtermainDatax();
                    } else if(flag == 'relate') {
                        $scope.dataxrelate.relateCurrentPage = this.relateCurrentPage;
                        $scope.dataxrelate.filterrelateDatax();
                    }
                },
                // 添加联动图表主题
                addDatax: function(row, flag) {
                    if(row.checked) {
                        var nodes = _.where($scope.dataxrelate.mainDatax, {id: row.id});
                        if(nodes.length > 0) {
                            var message = {};
                            message.level = 3;
                            message.title = '消息提醒';
                            message.content = '该图表主题已添加至关联图表主题中，不能重复添加!';
                            iMessage.show(message, false);
                            return;
                        }

                        var relateNodes = _.where($scope.dataxrelate.relateDatax, {id: row.id});
                        if(relateNodes.length > 0) {
                            var message = {};
                            message.level = 3;
                            message.title = '消息提醒';
                            message.content = '该图表主题已添加至联动图表主题中，不能重复添加!';
                            iMessage.show(message, false);
                            return;
                        }

                        if(flag == 'main') {
                            $scope.dataxrelate.mainDatax = [];
                            $scope.dataxrelate.mainDatax.push(row);
                            var tempArr = $scope.dataxrelate.mainDataxList;
                            tempArr = _.without(tempArr, row);
                            _.each(tempArr, function(temp) {
                                temp.checked = false;
                            });
                            getrelateDatax(row);
                        } else {
                            $scope.dataxrelate.relateDatax.push(row);
                        }

                    } else {
                        if(flag == 'main') {
                            $scope.dataxrelate.mainDatax = _.without($scope.dataxrelate.mainDatax, row);
                            getrelateDatax(row);
                        } else {
                            $scope.dataxrelate.relateDatax = _.reject($scope.dataxrelate.relateDatax, {id: row.id});
                        }
                    }
                },
                // 移除关联图表主题
                removemainDatax: function(row) {
                    row.checked = false;
                    getrelateDatax(row);
                    $scope.dataxrelate.mainDatax = _.without($scope.dataxrelate.mainDatax, row);
                },
                // 移除联动图表主题
                removerelateDatax: function(row) {
                    row.checked = false;
                    $scope.dataxrelate.filterrelateDatax();
                    $scope.dataxrelate.relateDatax = _.without($scope.dataxrelate.relateDatax, row);
                },
                // 清除联动图表主题
                cleanmainDatax: function() {
                    $.each($scope.dataxrelate.mainDatax, function(i, o) {
                        o.checked = false;
                        getrelateDatax(o);
                    });
                    $scope.dataxrelate.mainDatax = [];
                },
                // 清除联动图表主题
                cleanrelateDatax: function() {
                    $scope.dataxrelate.relateDatax = [];
                },
                // 返回
                back: function() {
                    reset();
                    $scope.dataxrelate.cleanmainDatax();
                    $scope.dataxrelate.cleanrelateDatax();
                    getDataxrelate();
                    $location.path('/system/dataxrelate');
                },
                // 全选关联图表主题
                selAllMainService: function() {
                    $.each($scope.dataxrelate.mainDataxList, function(i, o) {
                        var mainNodes = _.where($scope.dataxrelate.mainDatax, {id: o.id});
                        if($scope.dataxrelate.mainFilter.selectMainAll) {
                            if(mainNodes.length == 0) {
                                getrelateDatax(o);
                                $scope.dataxrelate.mainDatax.push(o);
                            }
                        } else {
                            mainNodes = _.where($scope.dataxrelate.mainDatax, {id: o.id});
                            if(mainNodes.length > 0) {
                                getrelateDatax(o);
                                $scope.dataxrelate.mainDatax = _.without($scope.dataxrelate.mainDatax, o);
                            }
                        }
                        o.checked = $scope.dataxrelate.mainFilter.selectMainAll;
                    });
                },
                // 全选联动图表主题
                selAllRelateService: function() {
                    $.each($scope.dataxrelate.relateDataxList, function(i, o) {
                        var relateNodes = _.where($scope.dataxrelate.relateDatax, {id: o.id});
                        if($scope.dataxrelate.relatedFilter.selectRelateAll) {
                            if(relateNodes.length == 0) {
                                $scope.dataxrelate.relateDatax.push(o);
                            }
                        } else {
                            if(relateNodes.length > 0) {
                                $scope.dataxrelate.relateDatax = _.without($scope.dataxrelate.relateDatax, o);
                            }
                        }
                        o.checked = $scope.dataxrelate.relatedFilter.selectRelateAll;
                    });
                },
                // 保存图表主题联动信息
                save: function() {
                    var mainIDs = [];
                    $.each($scope.dataxrelate.mainDatax, function(i, o) {
                        mainIDs.push(o.id);
                    });
                    var mainID = mainIDs[0];

                    var relateIDs = [];
                    $.each($scope.dataxrelate.relateDatax, function(i, o) {
                        relateIDs.push(o.id);
                    });

                    var url, data;
                    url = '/datax/datatheme.do?action=updateDatathemeBind';
                    data = {
                        rows: {
                            datathemes: relateIDs, // 主题id
                            id: mainID  //datax-id
                        }
                    };

                    iAjax.post(url, data).then(function(data) {
                        if(data.status && data.status == '1') {
                            var message = {};
                            message.level = 1;
                            message.title = '消息提醒';
                            message.content = '提交成功!';
                            iMessage.show(message, false);

                            reset();
                            $scope.dataxrelate.mainDatax = [];
                            $scope.dataxrelate.relateDatax = [];
                        } else {
                            var message = {};
                            message.level = 4;
                            message.title = '消息提醒';
                            message.content = '保存记录失败!';
                            iMessage.show(message, false);
                        }
                    }, function() {
                        var message = {};
                        message.level = 4;
                        message.title = '消息提醒';
                        message.content = '网络连接失败!';
                        iMessage.show(message, false);
                    });
                }
            };


            /**
             * 查询图表主题信息
             *
             */
            function getDataxrelate() {
                var url, data;
                url = 'datax/datatheme.do?action=getDatathemeFilter';
                data = {
                    filter: $scope.dataxrelate.listFilter,
                    params: {
                        pageNo: $scope.dataxrelate.currentPage,
                        pageSize: $scope.dataxrelate.pageSize
                    }
                };

                iAjax.post(url, data).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.dataxrelate.list = data.result.rows.datathemes;
                        $scope.dataxrelate.countInfo.yes = data.result.rows.Y;
                        $scope.dataxrelate.countInfo.no = data.result.rows.N;
                        if(data.result.params) {
                            $scope.dataxrelate.countInfo.totalSize = data.result.params.totalSize;
                        }
                    } else {
                        $scope.dataxrelate.list = [];
                        $scope.dataxrelate.countInfo = {totalSize: 0, yes: 0, no: 0};
                    }
                    if(data.result.params) {
                        var params = data.result.params;
                        $scope.dataxrelate.totalSize = params.totalSize;
                        $scope.dataxrelate.pageSize = params.pageSize;
                        $scope.dataxrelate.totalPage = params.totalPage;
                        $scope.dataxrelate.currentPage = params.pageNo;
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
                });
            }

            function getrelateDatax(row) {
                var checkRow = row;
                var url, data;
                url = '/datax/datatheme.do?action=getDatathemeBind';
                data = {
                    filter: {
                        searchText: checkRow.id
                    }
                };

                iAjax.post(url, data).then(function(data) {
                    if(data.result && data.result.rows && data.result.rows.length > 0) {
                        var result = data.result.rows[0].datathemes;
                        $scope.dataxrelate.relateDatax = [];
                        _.each($scope.dataxrelate.relateDataxList, function(list) {
                            list.checked = false;
                        });
                        $.each(result, function(i, o) {
                            if(checkRow.checked) {
                                var nodes = _.where($scope.dataxrelate.relateDatax, {id: o.id});
                                if(nodes.length == 0) {
                                    $scope.dataxrelate.relateDatax.push(o);
                                }
                            } else {
                                $scope.dataxrelate.relateDatax = _.filter($scope.dataxrelate.relateDatax, function(obj) {
                                    return obj.id != o.id;
                                });
                            }
                        });
                    } else {
                        $scope.dataxrelate.relateDatax = [];
                        _.each($scope.dataxrelate.relateDataxList, function(list) {
                            list.checked = false;
                        });
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, false);
                });
            }


            /**
             * 重置相关参数信息
             *
             * @author : hj
             * @version : 1.0
             * @Date : 2019-07-15
             */
            function reset() {
                $scope.dataxrelate.mainCurrentPage = 1;
                $scope.dataxrelate.mainTotalPage = 1;
                $scope.dataxrelate.relateCurrentPage = 1;
                $scope.dataxrelate.relateTotalPage = 1;
                $scope.dataxrelate.filtermainDatax();
                $scope.dataxrelate.filterrelateDatax();
            }

            /**
             * 模块加载完成后事件
             *
             */
            $scope.$on('dataxrelateControllerOnEvent', function() {
                $scope.dataxrelate.mainDatax = [];
                $scope.dataxrelate.relateDatax = [];
                getDataxrelate();
                $scope.dataxrelate.filtermainDatax();
                $scope.dataxrelate.filterrelateDatax();
            });
        }]);

    // 模块内部路由
    angularAMD.config(function($stateProvider) {
        $stateProvider.state('system.dataxrelate.config', {
            url: '/config',
            templateUrl: $.soa.getWebPath(packageName) + '/view/config.html'
        });
    });
});