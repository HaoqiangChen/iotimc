/**
 * 诊断计划管理
 *
 * Created by llx on 2015-10-27.
 */

define([
    'app',
    'cssloader!system/diagnosisplan/css/index.css'

], function(app) {
    app.controller('diagnosisplanController', [
        '$scope',
        'iAjax',
        'iConfirm',
        'iMessage',
        '$state',
        '$filter',

        function($scope, iAjax, iConfirm, iMessage, $state, $filter) {
            var list = [];
            $scope.title = '诊断计划管理';
            $scope.linkDeviceList = [];
            $scope.list = [];
            $scope.deviceType = '';
            $scope.totalSize = 10;
            $scope.pageSize = 15;
            $scope.currentPage = 1;
            $scope.totalPage = 1;
            $scope.diagnosisplan = {
                searchValue: '',
                list: [],
                totalSize: 10,
                pageSize: 10,
                currentPage: 1,
                totalPage: 1,
                aSelectAll: false,
                filterValue: '',
                click: function(item, event) {
                    if (event && event.target.tagName == 'BUTTON') {
                        return;
                    }
                    item.checked = !item.checked;
                    //$scope.diagnosisplan.list = _.where($scope.diagnosisplan.list, {checked: true});
                },
                add: function() {
                    var params = {
                        data: {
                            type: 'add'
                        }
                    };
                    $state.go('system.diagnosisplan.item', params);
                },
                mod: function() {
                    var aSelect, callback;
                    aSelect = _.where($scope.diagnosisplan.list, {checked: true});
                    callback = aSelect;
                    if (aSelect.length == 1) {
                        $scope.goMod(aSelect[0], callback);
                    } else {
                        showMessage(3, '请选择一条数据进行修改!')
                    }

                },
                del: function() {
                    list = [];
                    var aSelect = [], index = 0;
                    $.each($scope.diagnosisplan.list, function(i, o) {
                        if (o.checked == true) {
                            list.push(o.id);
                            index++;
                            aSelect.push(index + '、' + o.title)
                        }
                    });
                    if (list.length >= 1) {
                        iConfirm.show({
                            scope: $scope,
                            title: '诊断计划删除:',
                            content: '共选择' + list.length + '数据，分别为： <br>' + aSelect.join('<br>'),
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'confirmDelSuccess'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'confirmClose'
                            }]
                        });
                    } else {
                        showMessage(3, '请选择一条以上的数据进行删除！')
                    }
                },
                showTable: function(item) {
                    $scope.getLinkDevice(item);
                    $scope.list = item;
                    iConfirm.show({
                        scope: $scope,
                        title: '',
                        templateUrl: $.soa.getWebPath('iiw.system.diagnosisplan') + '/view/showDevice.html'
                    });
                },
                change: function() {
                    $scope.getList();
                },
                pageChanged: function(index) {
                    $scope.currentPage = index;
                    $scope.getLinkDevice($scope.list);
                }
            };

            $scope.goMod = function(item, callback) {
                var data = {
                    id: item.id,
                    dtype: item.dtype
                };
                iAjax
                    .post('oms/plan.do?action=getitem', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $.each(data.result.rows.child, function(i, o) {
                                o.checked = true;
                            });
                            if (callback) {
                                var params = {
                                    data: {
                                        item: callback,
                                        type: 'mod',
                                        device: data.result.rows.child
                                    }
                                };
                                $state.go('system.diagnosisplan.item', params)
                            }

                        }
                    });
            };

            $scope.changeType = function(content) {
                $scope.deviceType = content;
                $scope.getLinkDevice($scope.list);
            };

            $scope.getDeviceType = function() {
                iAjax
                    .post('security/deviceCode.do?action=getDevicecodeType')
                    .then(function(data) {
                        $scope.typeList = data.result.rows;
                    })
            };

            $scope.getLinkDevice = function(item) {
                if(item == null){
                    item = $scope.list;
                }
                var data = {
                    id: item.id,
                    dtype: item.dtype,
                    name: $scope.diagnosisplan.searchValue,
                    type: $scope.deviceType,
                    params: {
                        pageNo: $scope.currentPage,
                        pageSize: $scope.pageSize
                    }
                };
                iAjax
                    .post('oms/plan.do?action=getitem', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $.each(data.result.rows.child, function(i, o) {
                                o.checked = true;
                            });
                            $scope.linkDeviceList = data.result.rows;
                            $scope.currentPage = data.result.params.pageNo;
                            $scope.pageSize = data.result.params.pageSize;
                            $scope.totalPage = data.result.params.totalPage;
                            $scope.totalSize = data.result.params.totalSize;
                            //if (callback) {
                            //    var params = {
                            //        data: {
                            //            item: callback,
                            //            type: 'mod',
                            //            device: $scope.linkDeviceList.child
                            //        }
                            //    };
                            //    $state.go('system.diagnosisplan.item', params)
                            //}

                        }
                    });
            };

            $scope.selectAll = function() {
                $.each($scope.diagnosisplan.list, function(i, item) {
                    item.checked = $scope.diagnosisplan.aSelectAll
                })
            };

            $scope.confirmDelSuccess = function(id) {
                iConfirm.close(id);
                var data = {
                    rows: list
                };
                iAjax
                    .post('oms/plan.do?action=del', data)
                    .then(function(data) {
                        if (data.status == 1) {
                            $scope.getList();
                            $scope.diagnosisplan.aSelectAll = false;
                            showMessage(1, '删除成功!')
                        }
                    })
            };

            $scope.confirmClose = function(id) {
                iConfirm.close(id);
                return true;
            };

            $scope.getList = function() {
                var data = {
                    params: {
                        pageNo: $scope.diagnosisplan.currentPage,
                        pageSize: $scope.diagnosisplan.pageSize
                    },
                    filter: {
                        title: $scope.diagnosisplan.filterValue
                    }
                };
                iAjax
                    .post('/oms/plan.do?action=list', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.diagnosisplan.currentPage = data.result.params.pageNo;
                            $scope.diagnosisplan.pageSize = data.result.params.pageSize;
                            $scope.diagnosisplan.totalPage = data.result.params.totalPage;
                            $scope.diagnosisplan.totalSize = data.result.params.totalSize;
                            $scope.diagnosisplan.list = data.result.rows;
                            $.each($scope.diagnosisplan.list, function(i, o) {
                                if (o.tktype == 'cron') {
                                    o.time = o.syrulename;
                                } else {
                                    if (o.repeattime == 0) {
                                        o.repeat = '不限次数';
                                    } else {
                                        o.repeat = o.repeattime;
                                    }
                                    o.time = $filter('date')(o.starttime, 'yyyy-MM-dd HH:mm') + ' ~ ' + $filter('date')(o.endtime, 'yyyy-MM-dd HH:mm') + '每隔' + o.hour + '时' + o.minute + '分执行' + '' + o.repeat;
                                }
                            })
                        }
                    })
            };

            $scope.getDeviceType();
            $scope.getList();

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
});