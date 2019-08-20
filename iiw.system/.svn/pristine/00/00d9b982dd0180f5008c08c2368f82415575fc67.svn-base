/**
 * 视频巡更计划管理-配置页
 *
 * @author - dwt
 * @date - 2016-05-26
 * @version - 0.1
 */
define([
    'app',
    'moment',
    'safe/js/directives/safePicker',
    'system/monitorpatrol/item/js/directives/monitorpatroltree',
    'cssloader!system/monitorpatrol/item/css/index.css'
], function(app) {
    app.controller('monitorpatrolItemController', [
        '$scope',
        '$state',
        '$stateParams',
        '$uibModal',
        'iAjax',
        'iMessage',
        '$filter',

        function($scope, $state, $stateParams, $uibModal, iAjax, iMessage, $filter) {
            $scope.title = '';
            $scope.showContent = '';
            var plan, type;

            if ($stateParams.data) {
                plan = $stateParams.data.item;
                type = $stateParams.data.type;

                $scope.item = plan;
            }

            if (type == 'add') {
                $scope.title = '视频巡更计划-添加';
            } else {
                $scope.title = '视频巡更计划-修改';
            }

            $scope.back = function() {
                $scope.$parent.init();

                var params = {data: null};
                $state.params = params;
                $state.go('system.monitorpatrol', params);
            };

            $scope.plan = {
                object: null,

                save: function() {
                    var data = this.object;
                    data.plandate = this.form.getPlanData();
                    savePlan(data, function() {
                        if (type == 'add') {
                            $scope.showContent = '视频巡更计划：' + $scope.plan.object.name + '添加成功！';
                        } else {
                            $scope.showContent = '视频巡更计划：' + $scope.plan.object.name + '修改成功！'
                        }
                        iMessage.show({
                            title: '视频巡更计划管理',
                            level: 1,
                            content: $scope.showContent
                        });
                        $scope.back();
                    });
                },

                form: {
                    sunday: true,
                    monday: true,
                    tuesday: true,
                    wednesday: true,
                    thursday: true,
                    friday: true,
                    saturday: true,

                    setPlanData: function(planData) {
                        var arr = planData.split(',');

                        this.sunday = arr[0] == 1;
                        this.monday = arr[1] == 1;
                        this.tuesday = arr[2] == 1;
                        this.wednesday = arr[3] == 1;
                        this.thursday = arr[4] == 1;
                        this.friday = arr[5] == 1;
                        this.saturday = arr[6] == 1;
                    },

                    getPlanData: function() {
                        var planData = [];
                        planData.push((this.sunday ? 1 : 0));
                        planData.push((this.monday ? 1 : 0));
                        planData.push((this.tuesday ? 1 : 0));
                        planData.push((this.wednesday ? 1 : 0));
                        planData.push((this.thursday ? 1 : 0));
                        planData.push((this.friday ? 1 : 0));
                        planData.push((this.saturday ? 1 : 0));
                        return planData.join(',');
                    },

                    statusList: [{value: 'P', name: '启用'}, {value: 'C', name: '禁用'}],

                    userTree: {
                        show: function() {
                            getSyuserTree(function(list) {
                                var modalInstance = $uibModal.open({
                                    templateUrl: 'userTreeDialog.html',
                                    controller: 'userTreeController',
                                    size: '',
                                    resolve: {
                                        items: function() {
                                            return list
                                        },
                                        initItems: function() {
                                            return ($scope.plan.object.syusers || [])
                                        }
                                    }
                                });

                                //modalInstance.result.then(function(oUser) {
                                //    $scope.plan.object.syusername = oUser.name;
                                //    $scope.plan.object.syuserfk = oUser.id;
                                //});
                                modalInstance.result.then(function(userList) {
                                    $scope.plan.object.syusers = userList;
                                });

                            });
                        }
                    },

                    monitorTree: {
                        show: function() {
                            getMonitorTree(function(list) {
                                var modalInstance = $uibModal.open({
                                    templateUrl: 'monitorTreeDialog.html',
                                    controller: 'monitorTreeController',
                                    size: '',
                                    resolve: {
                                        items: function() {
                                            return list
                                        },
                                        initItems: function() {
                                            return ($scope.plan.object.monitors || [])
                                        }
                                    }
                                });

                                modalInstance.result.then(function(list) {
                                    $scope.plan.object.monitors = list;
                                });
                            });
                        }
                    }
                }
            };

            //保存视频巡更管理计划
            function savePlan(data, cb) {
                iAjax
                    .post('security/VideoWatchPlan.do?action=updatePlanRule', data)
                    .then(function(data) {
                        if (data && data.status == 1) {
                            if (cb && typeof(cb) === 'function') {
                                cb();
                            }
                        }
                    });
            }

            //获取用户树
            var cacheUserTreeList = [];

            function getSyuserTree(cb) {
                if (cacheUserTreeList.length > 0) {
                    if (cb && typeof(cb) === 'function') {
                        cb(cacheUserTreeList);
                    }
                } else {
                    getData('sys/web/syou.do?action=getSyouAll', {params:{pageNo: 1, pageSize: 2000}}, function(ouList) {
                        getData('sys/web/syuser.do?action=getSyuserAll', {}, function(userList) {

                            $.each(userList, function(i, o) {
                                o['isUser'] = true;
                                o['iconSkin'] = 'userIcon';
                            });

                            $.each(ouList, function(i, o) {
                                o['isOu'] = true;
                                o['iconSkin'] = 'ouIcon';
                                cacheUserTreeList.push(o);
                                cacheUserTreeList = cacheUserTreeList.concat(_.filter(userList, {syoufk: o.id}));
                            });
                            if (cb && typeof(cb) === 'function') {
                                cb(cacheUserTreeList);
                            }
                        });
                    });
                }
            }

            //获取监控树
            var cacheMonitorTreeList = [];

            function getMonitorTree(cb) {
                if (cacheMonitorTreeList.length > 0) {
                    if (cb && typeof(cb) === 'function') {
                        cb(cacheMonitorTreeList);
                    }
                } else {
                    var url, data;
                    url = 'security/device.do?action=getDeviceMapOuList';
                    data = {};

                    iAjax
                        .post(url, data)
                        .then(function(data) {
                            if (data.result.rows && data.result.rows.length > 0) {
                                var arr = data.result.rows;

                                _.each(arr, function(o) {
                                    if (o.type == 'ou') {
                                        o['isOu'] = true;
                                        o['iconSkin'] = 'ouIcon';
                                    } else if (o.type == 'map') {
                                        o['isMap'] = true;
                                        o['iconSkin'] = 'mapIcon';
                                    } else {
                                        o['isMonitor'] = true;
                                        o['iconSkin'] = 'cameraIcon';
                                    }
                                });

                                cacheMonitorTreeList = arr;
                                if (cb && typeof(cb) === 'function') {
                                    cb(cacheMonitorTreeList);
                                }
                            }
                        });
                    //getData('sys/web/syou.do?action=getSyouAll', {}, function(ouList) {
                    //    getData('security/device.do?action=getDevice', {
                    //        filter: {
                    //            type : 'monitor'
                    //        }
                    //    }, function(monitorList) {
                    //
                    //        $.each(monitorList, function(i, o) {
                    //            o['isMonitor'] = true;
                    //            o['iconSkin'] = 'cameraIcon';
                    //        });
                    //
                    //        $.each(ouList, function(i, o) {
                    //            o['isOu'] = true;
                    //            o['iconSkin'] = 'ouIcon';
                    //            cacheMonitorTreeList.push(o);
                    //            cacheMonitorTreeList = cacheMonitorTreeList.concat(_.filter(monitorList, {syoufk:o.id}));
                    //        });
                    //
                    //        if(cb && typeof(cb) === 'function') {
                    //            cb(cacheMonitorTreeList);
                    //        }
                    //    });
                    //});
                }
            }

            function getData(url, data, cb) {
                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if (data && data.result && data.result.rows) {
                            if (cb && typeof(cb) === 'function') {
                                cb(data.result.rows);
                            }
                        }
                    });
            }

            if (!plan) {
                $scope.back();
            } else {
                $scope.plan.object = angular.copy(plan);

                if (!$scope.plan.object.starttime) {
                    $scope.plan.object.starttime = '09:00:00';
                }

                if (!$scope.plan.object.endtime) {
                    $scope.plan.object.endtime = '10:00:00';
                }

                if ($scope.plan.object.plandate) {
                    $scope.plan.form.setPlanData($scope.plan.object.plandate);
                }

                if (!$scope.plan.object.monitornumber) {
                    $scope.plan.object.monitors = [];
                } else {
                    getData('security/VideoWatchPlan.do?action=getPlanRuleMonitorAndSyuser', {id: $scope.plan.object.id}, function(list) {
                        $scope.plan.object.monitors = list.monitor;
                        $scope.plan.object.syusers = list.syuser;
                    });
                }

                if (!$scope.plan.object.status) {
                    $scope.plan.object.status = 'P';
                }
            }

        }
    ]);

    app.controller('userTreeController', [
        '$scope',
        '$uibModalInstance',
        'items',
        'initItems',

        function($scope, $uibModalInstance, items, initItems) {

            if (items && items.length > 0) {
                var index;
                $.each(items, function(i, o) {
                    if (o.checked) {
                        o.checked = false;
                    }
                });
                $.each(initItems, function(i, id) {
                    index = _.findIndex(items, {id: id});
                    if (index > -1) {
                        items[index].checked = true;
                    }
                });
            }

            $scope.userTree = {
                setting: {
                    check: {
                        enable: true
                    },
                    data: {
                        key: {
                            title: 't'
                        },
                        simpleData: {
                            enable: true
                        }
                    }
                    //callback: {
                    //    onClick: function(event, treeId, treeNode) {
                    //        if(treeNode['isUser']) {
                    //            $uibModalInstance.close(treeNode);
                    //        }
                    //    }
                    //}
                },
                tree: {
                    treeNodes: items
                }
            };

            $scope.clickUser = function() {
                var list = [],
                    nodes = $scope.userTree.oNode.getCheckedNodes();

                $.each(nodes, function(i, o) {
                    if (o.checked && o['isUser']) {
                        list.push(o.id);
                    }
                });
                $uibModalInstance.close(_.uniq(list));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

    app.controller('monitorTreeController', [
        '$scope',
        '$uibModalInstance',
        'items',
        'initItems',

        function($scope, $uibModalInstance, items, initItems) {

            if (items && items.length > 0) {
                var index;
                $.each(items, function(i, o) {
                    if (o.checked) {
                        o.checked = false;
                    }
                });
                $.each(initItems, function(i, id) {
                    index = _.findIndex(items, {id: id});
                    if (index > -1) {
                        items[index].checked = true;
                    }
                });
            }

            $scope.monitorTree = {
                setting: {
                    check: {
                        enable: true
                    },
                    data: {
                        key: {
                            title: 't'
                        },
                        simpleData: {
                            enable: true
                        }
                    }
                },
                tree: {
                    treeNodes: items
                }
            };

            $scope.ok = function() {
                var list = [],
                    nodes = $scope.monitorTree.oNode.getCheckedNodes();

                $.each(nodes, function(i, o) {
                    if (o.checked && o['isMonitor']) {
                        list.push(o.id);
                    }
                });
                $uibModalInstance.close(_.uniq(list));
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ]);

});