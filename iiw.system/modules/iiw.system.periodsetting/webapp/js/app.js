/**
 * Created by GDJ on 2015-10-21.
 */
define([
    'app',
    'cssloader!system/periodsetting/css/index',
    'cssloader!system/periodsetting/css/search-input',
    'cssloader!system/periodsetting/css/time-picker',
    'system/periodsetting/js/directives/searchInput',
    'system/periodsetting/js/directives/iTimePicker',
    'system/periodsetting/js/directives/userTree',
    'system/periodsetting/js/filter/weekFilter'
], function(app) {
    app.controller('periodSettingController', [
        '$scope',
        '$rootScope',
        '$location',
        '$window',
        '$state',
        '$uibModal',
        'iAjax',
        'iMessage',
        'mainService',

        function($scope, $rootScope, $location, $window, $state, $uibModal, iAjax, iMessage, mainService) {
            $scope.title = '管控时间设置';
            mainService.moduleName = '管控时间设置';
            $scope.doorTree = '';
            $scope.weekList = [];
            $scope.weekSelectList = [];
            $scope.timeList = [];
            $scope.timeSelectList = [];

            /**
             * 模块加载完成后事件
             *
             */
            $scope.$on('periodSettingControllerOnEvent', function() {
                initTreeView();
                initEvent();
            });

            function initEvent() {
                $scope.$on('time-change-event', function(e, data, $ele) {
                    var id = data.id,
                        val = data.val,
                        type = data.type,
                        pId = $scope.weekList[$ele.closest('.week-container').index()].id;

                    if (type == 'starttime') {
                        updateTime(pId, {id: id, 'starttime': val});
                    }
                    else {
                        updateTime(pId, {id: id, 'endtime': val});
                    }
                });

                $scope.$on('device-search-event', function(e, val) {
                    if ($scope.doorTree) {
                        var node = $scope.doorTree.getNodesByFilter(function(node) {
                            return node.name.indexOf(val) != -1 || (node.ip && node.ip.indexOf(val) != -1);
                        }, true);
                        if (node) {
                            $scope.doorTree.selectNode(node);
                            clearTimeSelect();
                            getPeriodSelectList(node.id);
                        }
                    }
                });
            }

            /**
             * 初始化警察树结构
             */
            function initTreeView() {
                iAjax.post('door/period.do?action=getAreaDeviceTree').then(function(data) {
                    var rData = data.result.rows;
                    $.each(rData, function(i, row) {
                        if (row.type == 'area') {
                            row.isParent = true;
                        }
                        else if (row.type == 'device') {
                            row.isParent = false;
                        }
                    });
                    $scope.$broadcast('doorTree-initTree', {
                        defPid: '00000000000000000000000000000000',
                        check: {
                            enable: true,
                            chkboxType: {'Y': 'ps', 'N': 'ps'}
                        },
                        callback: {
                            onClick: function(event, treeid, treeNode) {
                                clearTimeSelect();
                                getPeriodSelectList(treeNode.id);
                            }
                        }
                    }, rData, function() {
                        var self = this;
                        var node = this.doorTree.getNodesByFilter(function(node) {
                            return (!node.children);
                        }, true);

                        this.doorTree.expandNode(node.getParentNode(), true, false);

                        initPeriodView().then(function() {
                            self.doorTree.selectNode(node, false, true);
                            clearTimeSelect();
                            getPeriodSelectList(node.id)
                        });
                    });

                });
            }

            function initPeriodView() {
                var promise = iAjax.post('door/period.do?action=getPeriod').then(function(data) {
                    if (data && data.status == 1) {
                        $scope.weekList = data.result.rows;
                        initTimeList();
                    }
                });

                return promise;
            }

            function initTimeList() {
                clearTimeSelect(function(row) {
                    $scope.timeSelectList[row.id] = row;
                });
            }

            function clearTimeSelect(fn) {
                $.each($scope.weekList, function(i, date) {
                    $scope.weekSelectList[date.id] = date;
                    if (date.times && date.times.length > 0) {
                        $.each(date.times, function(k, time) {
                            time.select = false;
                            if (fn) fn.call($scope.weekList, time);
                        });
                    }
                });
            }

            function getPeriodSelectList(id) { //选中的日期
                iAjax.post('door/period.do?action=getDevicePeriod', {
                    filter: {
                        deviceid: id
                    }
                }).then(function(data) {
                    if (data.status == 1) {
                        var rows = data.result.rows;
                        $.each(rows, function(i, row) {
                            $scope.timeSelectList[row.id].select = true;
                        });
                    }
                });
            }

            $scope.addTimes = function($event, pId) {
                saveTime(pId);
            }

            $scope.delTimes = function($event, pId, id) {
                deleteTime(pId, id);
            }

            function deleteTime(pId, id) {
                var promise = iAjax.post('door/period.do?action=savePeriod', {
                    save: [{
                        id: pId,
                        times: [{
                            id: id
                        }]
                    }]
                }).then(function() {
                    var times = $scope.weekSelectList[pId].times;
                    $.each(times, function(i, time) {
                        if (time.id == id) {
                            $scope.weekSelectList[pId].times.splice(i, 1); //移除数据
                        }
                    });
                    $scope.timeSelectList[id] = null; //设置数据为空
                });

                return promise;
            }

            function updateTime(pId, obj) {
                var promise = iAjax.post('door/period.do?action=savePeriod', {
                    save: [{
                        id: pId,
                        times: [obj]
                    }]
                });

                return promise;
            }

            function saveTime(pId) {
                var saveObj = {
                    starttime: '00:00',
                    endtime: '00:00'
                }
                var promise = iAjax.post('door/period.do?action=savePeriod', {
                    save: [{
                        id: pId,
                        times: [saveObj]
                    }]
                }).then(function(data) {
                    if (data.status == 1) {
                        var id = data.result.rows[0].id,
                            obj = {
                                id: id,
                                starttime: saveObj.starttime,
                                endtime: saveObj.endtime
                            }
                        if (!$scope.weekSelectList[pId].times) $scope.weekSelectList[pId].times = [];
                        $scope.weekSelectList[pId].times.push(obj);
                        $scope.timeSelectList[id] = obj;
                    }
                });
                return promise;
            }

            $scope.selectTime = function($event, id) {
                $scope.timeSelectList[id].select ? $scope.timeSelectList[id].select = false : $scope.timeSelectList[id].select = true;
            }

            $scope.saveTimeSelect = function() {
                //单个选中
                var timeModal = $uibModal.open({
                    templateUrl: 'timeModalContent',
                    scope: $scope,
                    controller: ['$scope', function($scope) {
                        var data = [],
                            times = [];
                        var nodes = $scope.doorTree.getNodesByFilter(function(node) {
                            return (!node.isParent && node.checked);
                        }, false);
                        //.getCheckedNodes(true);
                        if (nodes.length == 0) {
                            nodes = $scope.doorTree.getSelectedNodes();
                            if (nodes[0].isParent) {
                                nodes = $scope.doorTree.getNodesByFilter(function(node) {
                                    return node;
                                }, false, nodes[0]);
                            }
                        }

                        for (var key in $scope.timeSelectList) {
                            var time = $scope.timeSelectList[key];

                            if (time.select == true) {
                                times.push({id: time.id});
                            }
                        }
                        var names = [];
                        $.each(nodes, function(i, node) {
                            names.push(node.name);
                            data.push({
                                'deviceid': node.id,
                                'ids': times
                            });
                        });

                        $scope.names = '(' + names.join(',') + ')的管控时间?';

                        $scope.timeSave = function() {
                            iAjax.post('door/period.do?action=saveDevicePeriod', {
                                save: data
                            }).then(function() {
                                iMessage.show({ //提示保存情况
                                    id: 'time_save_success',
                                    level: 1,
                                    title: '提示',
                                    content: '保存成功'
                                });
                                timeModal.close();
                            }, function() {
                                iMessage.show({ //提示保存情况
                                    id: 'time_save_error',
                                    level: 3,
                                    title: '提示',
                                    content: '保存失败,请检查网络'
                                });
                            });
                        }
                        $scope.timeCancel = function() {
                            timeModal.close();
                        }
                    }],
                    size: 'sm'
                });
            };
        }
    ]);

});
