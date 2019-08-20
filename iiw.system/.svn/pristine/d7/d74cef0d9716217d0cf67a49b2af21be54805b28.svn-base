/**
 * 运维管理——故障类型管理
 *
 * Created by YBW on 2017/5/25.
 */
define([
    'app',
    'cssloader!system/stoppagetype/css/index'
], function(app) {
    app.controller('stoppagetypeController', [
        '$scope',
        'mainService',
        'iAjax',
        'iMessage',
        'iConfirm',
        function($scope, mainService, iAjax, iMessage, iConfirm) {

            mainService.moduleName = '故障类型管理';
            $scope.stoppageType = {
                title: '故障类型管理-设置',
                filterValue: '',
                devicePhoto: '',
                deviceType: '',
                deviceName: '',
                list: [],
                deviceList: [],
                click: function(event, item) {
                    if (event && event.target.tagName == 'INPUT') {
                        return
                    }
                    if (!item.checked) {
                        item.checked = true
                    } else {
                        item.checked = !item.checked;
                    }
                },
                add: function() {
                    if (!$scope.stoppageType.list) {
                        $scope.stoppageType.list = [];
                    }
                    $scope.stoppageType.list.unshift({
                        notes: '',
                        status: 'add',
                        name: ''
                    })
                },
                mod: function() {
                    var aSelect = _.where($scope.stoppageType.list, {checked: true});
                    if (aSelect.length) {
                        $.each(aSelect, function(i, o) {
                            o.status = 'mod';
                            o._name = o.name;
                            o._notes = o.notes;
                        })
                    } else {
                        showMessage(3, '请选择一条以上的故障信息进行修改!')
                    }
                },
                del: function() {
                    var aSelect = _.where($scope.stoppageType.list, {checked: true});
                    if (!aSelect.length) {
                        showMessage(3, '请选择一条以上的故障类型进行删除!')
                    } else {
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '删除信息后将无法还原，是否确认删除？',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'stoppageType.confirmSuccess'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'stoppageType.confirmClose'
                            }]
                        });
                    }
                },
                save: function() {
                    var data = {
                        remoteip: '192.168.0.15',
                        row: {
                            devicetype: $scope.stoppageType.deviceType,
                            photo: $scope.stoppageType.devicePhoto,
                            fault: []
                        }
                    };
                    iAjax
                        .post('oms/devicemaintain.do?action=updatefaultdevice', data)
                        .then(function(data) {

                        })
                },
                showDetail: function(item) {
                    $scope.stoppageType.deviceName = item.name;
                    $scope.stoppageType.deviceType = item.content;
                    $scope.stoppageType.getFaultDeviceList(item.content);
                },
                cancle: function() {
                    $scope.stoppageType.getFaultDeviceList($scope.stoppageType.deviceType);
                },
                upLoadDevice: function() {
                    $('#upLoadDevicePhoto').click();
                },
                changeDevicePhoto: function() {
                    var reader = new FileReader();
                    reader.onload = function(result) {
                        $scope.stoppageType.devicePhoto = result.target.result;
                    };
                    reader.readAsDataURL($('#upLoadDevicePhoto')[0].files[0]);
                },
                getDeviceList: function() {
                    iAjax
                        .post('security/deviceCode.do?action=getDevicecodeType')
                        .then(function(data) {
                            if (data.result && data.result.rows) {
                                $scope.stoppageType.deviceList = data.result.rows;
                                $scope.stoppageType.deviceName = data.result.rows[0].name;
                                $scope.stoppageType.deviceType = data.result.rows[0].content;
                                $scope.stoppageType.getFaultDeviceList(data.result.rows[0].content);
                            }
                        })
                },
                getFaultDeviceList: function(type) {
                    var data = {
                        remoteip: '192.168.0.15',
                        filter: {
                            type: type
                        }
                    };
                    iAjax
                        .post('oms/devicemaintain.do?action=getfaultdevice', data)
                        .then(function(data) {
                            if (data.result && data.result.row) {
                                $scope.stoppageType.list = data.result.row.types;
                            }
                        })
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                }
            };

            $scope.$on('stoppagetypeControllerOnEvent', function() {
                $scope.stoppageType.getDeviceList();
            });

            function showMessage(level, content) {
                var json = {
                    title: $scope.stoppageType.title,
                    level: level,
                    content: content
                };
                iMessage.show(json);
            }


        }]);
});
