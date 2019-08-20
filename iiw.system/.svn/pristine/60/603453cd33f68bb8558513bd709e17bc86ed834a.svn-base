/**
 * 诊断计划管理-添加
 *
 * Created by llx on 2015-10-27.
 */

define([
    'app',
    'cssloader!system/diagnosisplan/item/css/index.css'

], function(app) {
    app.controller('systemDiagnosisplanItemController', [
        '$scope',
        'iAjax',
        'iConfirm',
        'iMessage',
        '$state',
        '$stateParams',
        '$filter',

        function($scope, iAjax, iConfirm, iMessage, $state, $stateParams, $filter) {
            $scope.title = '诊断计划管理-添加';
            $scope.selAll = false;
            $scope.clearAll = false;
            $scope.listSize = 50;
            $scope.titleName = '';
            $scope.startTime = '';
            $scope.endTime = '';
            $scope.indexPlan = '';
            $scope.repeatTime = 0;
            $scope.minute = 0;
            $scope.hour = 1;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.totalSize = 5;
            $scope.totalPage = 1;
            $scope.selectTimeType = '';
            $scope.filterValue = '';
            $scope.deviceType = '';
            $scope.companyId = '';
            $scope.planLevelList = '';
            $scope.planStatus = 'P';
            $scope.indexService = '';
            $scope.serviceList = '';
            $scope.activeType = 'cron';
            $scope.activeStatus = false;
            $scope.timeTypeList = [];
            $scope.deviceTypeList = [];
            $scope.deviceList = [];
            $scope.list = [];

            if ($stateParams.data) {
                if ($stateParams.data.type == 'mod') {
                    $scope.title = '诊断计划管理-修改';
                    $scope.titleName = $stateParams.data.item[0].title;
                    $scope.activeType = $stateParams.data.item[0].tktype;
                    $scope.planStatus = $stateParams.data.item[0].status;
                    $.each($stateParams.data.device, function(i, o) {
                        o.id = o.devicefk
                    });
                    $scope.list = $stateParams.data.device;
                    if ($stateParams.data.item[0].tktype == 'simple') {
                        $scope.activeStatus = true;
                        $scope.hour = $stateParams.data.item[0].hour;
                        $scope.minute = $stateParams.data.item[0].minute;
                        $scope.repeatTime = $stateParams.data.item[0].repeattime;
                        $scope.endTime = $filter('date')($stateParams.data.item[0].endtime, 'yyyy-MM-dd HH:mm:ss');
                        $scope.startTime = $filter('date')($stateParams.data.item[0].starttime, 'yyyy-MM-dd HH:mm:ss');
                    } else {
                        $scope.activeStatus = false;
                        $scope.selectTimeType = $stateParams.data.item[0].syrulefk;
                    }
                }
            }

            $scope.save = function() {
                var url;
                var data = {
                    title: $scope.titleName,
                    tktype: $scope.activeType,
                    dtype: 'D',
                    status: $scope.planStatus,
                    level: $scope.indexPlan,
                    servicename: $scope.indexService,
                    child: []
                };
                if ($scope.activeType == 'cron') {
                    data.syrulefk = $scope.selectTimeType;
                } else {
                    data.starttime = $scope.startTime;
                    data.endtime = $scope.endTime;
                    data.repeattime = $scope.repeatTime;
                    data.minute = $scope.minute;
                    data.hour = $scope.hour;
                }
                $.each($scope.list, function(i, o) {
                    data.child.push({devicefk: o.id});
                });
                if ($stateParams.data && $stateParams.data.type == 'mod') {
                    data.id = $stateParams.data.item[0].id;
                    url = 'oms/plan.do?action=mod';
                    var checkedMod = {
                        remoteip: '192.168.0.14',
                        filter: {
                            id: ''
                        }
                    };
                    iAjax
                        .post('oms/plan.do?action=getCurrentPlanStatus', checkedMod)
                        .then(function(data) {
                            if (data.result.rows && data.result.rows != '0') {
                                iConfirm.show({
                                    scope: $scope,
                                    title: '诊断计划',
                                    content: '当前计划正在执行，是否要修改当前计划?',
                                    buttons: [{
                                        text: '确认',
                                        style: 'button-primary',
                                        action: 'confirmSuccess'
                                    }, {
                                        text: '取消',
                                        style: 'button-caution',
                                        action: 'confirmCancel'
                                    }]
                                });
                            } else {
                                iAjax
                                    .post(url, data)
                                    .then(function(data) {
                                        if (data.status == 1) {
                                            showMessage(1, '修改成功!');
                                            $state.go('system.diagnosisplan');
                                            $scope.$parent.getList();
                                        }
                                    });
                            }
                        });

                } else {
                    url = 'oms/plan.do?action=add';
                    iAjax
                        .post(url, data)
                        .then(function(data) {
                            if (data.status == 1) {
                                showMessage(1, '添加成功!');
                                $state.go('system.diagnosisplan');
                                $scope.$parent.getList();
                            }
                        });
                }
            };

            $scope.confirmSuccess = function(id) {
                iConfirm.close(id);
            };

            $scope.confirmCancel = function(id) {
                iConfirm.close(id);
            };

            $scope.selectAll = function() {
                $.each($scope.deviceList, function(i, o) {
                    o.checked = $scope.selAll;
                });
                if ($scope.selAll == true) {
                    var aFind = _.where($scope.deviceList, {checked: true});
                    $.each(aFind, function(index, item) {
                        $.each($scope.list, function(o, p) {
                            if (p && item.id == p.id) {
                                $scope.list.splice(o, 1);
                            }
                        })
                    });
                    $scope.list = $scope.list.concat(_.where($scope.deviceList, {checked: true}));
                } else {
                    $scope.list = _.where($scope.list, {checked: true});
                    $.each($scope.deviceList, function(y, p) {
                        $.each($scope.list, function(v, item) {
                            if (p.id == item.id) {
                                $scope.list.splice(v, $scope.deviceList.length)
                            }
                        })
                    })
                }
            };

            $scope.clearList = function() {
                $.each($scope.deviceList, function(i, o) {
                    o.checked = false;
                });
                $scope.list = [];
            };

            $scope.selectA = function(item) {
                item.checked = !item.checked;
                var aSelect = _.filter($scope.deviceList, {checked: true});
                if (item.checked == false) {
                    $.each($scope.deviceList, function(i, o) {
                        if (o && item.id == o.id) {
                            o.checked = false;
                        }
                    });
                    $.each($scope.list, function(y, u) {
                        if (u && item.id == u.id) {
                            $scope.list.splice(y, 1);
                        }
                    })
                }
                if (aSelect.length == $scope.deviceList.length) {
                    $scope.selAll = true;
                } else {
                    $scope.selAll = false;
                }
            };

            $scope.select = function(item) {
                item.checked = !item.checked;
                var aFind = _.where($scope.list, {id: item.id, checked: true});
                var aSelect = _.filter($scope.deviceList, {checked: true});
                if (item.checked == true && !aFind.length) {
                    $scope.list.push(item)
                } else if (item.checked == false) {
                    $.each($scope.list, function(i, o) {
                        if (o && o.id == item.id) {
                            $scope.list.splice(i, 1);
                        }
                    });
                }
                if (aSelect.length == $scope.deviceList.length) {
                    $scope.selAll = true;
                } else {
                    $scope.selAll = false;
                }
            };

            $scope.selectAllDevice = function() {
                var data = {
                    filter: {
                        type: $scope.deviceType
                    }
                };
                iAjax
                    .post('/security/device.do?action=getDevice', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $.each(data.result.rows, function(i, o) {
                                o.checked = true;
                                var aSelect = _.where($scope.list, {id: o.id});
                                if (!aSelect.length) {
                                    $scope.list.push(o);
                                }
                                $.each($scope.deviceList, function(y, u) {
                                    if (o.id == u.id) {
                                        u.checked = true;
                                    }
                                })
                            });
                        }
                    })
            };

            $scope.nextPage = function() {
                $scope.listSize += 50;
                if ($scope.listSize > $scope.list.length) {
                    $scope.listSize = $scope.list.length;
                }
            };

            $scope.change = function() {
                $scope.selAll = false;
                getDeviceInfo();
            };

            $scope.changeDevice = function() {
                getDeviceInfo();
            };

            $scope.changActive = function() {
                $scope.activeStatus = !$scope.activeStatus;
                if ($scope.activeStatus == false) {
                    $scope.activeType = 'cron';
                } else {
                    $scope.activeType = 'simple';
                }
            };

            $scope.init = function() {
                //getListType();
                getPlanLevelList();
                getServiceList();
                getTimeTypeList();
                getDeviceType();
                getDeviceInfo();
            };

            $scope.init();

            $scope.back = function() {
                $state.go('system.diagnosisplan');
                $scope.$parent.getList();
            };

            function getDeviceType() {
                iAjax
                    .post('/security/deviceCode.do?action=getDevicecodeType')
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.deviceTypeList = data.result.rows;
                        }
                    })
            }

            function getDeviceInfo() {
                var data = {
                    filter: {
                        searchText: $scope.filterValue,
                        company: $scope.companyId,
                        type: $scope.deviceType
                    },
                    params: {
                        pageNo: $scope.currentPage,
                        pageSize: $scope.pageSize
                    }
                };
                iAjax
                    .post('/security/device.do?action=getDevice', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.deviceList = data.result.rows;
                            $scope.currentPage = data.result.params.pageNo;
                            $scope.pageSize = data.result.params.pageSize;
                            $scope.totalPage = data.result.params.totalPage;
                            $scope.totalSize = data.result.params.totalSize;
                            $.each($scope.list, function(i, o) {
                                $.each($scope.deviceList, function(y, u) {
                                    if (o.id == u.id) {
                                        u.checked = true;
                                    }
                                })
                            });
                            var index = _.where($scope.deviceList, {checked: true});
                            if (index.length == $scope.deviceList.length) {
                                $scope.selAll = true
                            } else {
                                $scope.selAll = false;
                            }
                        }
                    })
            }

            function getServiceList() {
                var data = {
                    keytype: 'service'
                };
                iAjax
                    .post('sys/web/sycode.do?action=listbytype', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.serviceList = data.result.rows;
                            if ($stateParams.data && $stateParams.data.type == 'mod') {
                                $scope.indexService = $stateParams.data.item[0].servicefk;
                            } else {
                                $scope.indexService = $scope.serviceList[0].id;
                            }
                        }
                    })
            }

            function getTimeTypeList() {
                var data = {
                    keytype: 'cron'
                };
                iAjax
                    .post('sys/web/sycode.do?action=listbytype', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.timeTypeList = data.result.rows;
                            if ($stateParams.data && $stateParams.data.type == 'mod') {
                                $scope.selectTimeType = $stateParams.data.item[0].syrulefk;
                            } else {
                                $scope.selectTimeType = $scope.timeTypeList[0].id;
                            }
                        }
                    })
            }

            function getPlanLevelList() {
                var data = {
                    keytype: 'repairlevel'
                };
                iAjax
                    .post('sys/web/sycode.do?action=listbytype', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.planLevelList = data.result.rows;
                            if ($stateParams.data && $stateParams.data.type == 'mod') {
                                $scope.indexPlan = $stateParams.data.item[0].level;
                            } else {
                                $scope.indexPlan = $scope.planLevelList[0].id;
                            }
                        }
                    })
            }

            function showMessage(level, content) {
                var json = {};
                json.id = new Date();
                json.title = $scope.title;
                json.content = content;
                json.level = level;
                iMessage.show(json)
            }
        }
    ])
})
;