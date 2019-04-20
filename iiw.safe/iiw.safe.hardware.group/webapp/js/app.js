/**
 * 设备分组管理
 * @author : zhs
 * @version : 1.0
 * @date : 2018-06-22
*/
define([
    'app',
    'safe/js/directives/safeZTree',
    'cssloader!safe/hardware/group/css/index'
], function(app) {
    app.controller('hardwareGroupController', [
        '$scope',
        '$state',
        '$stateParams',
        'safeMainTitle',
        'iAjax',
        'iMessage',
        'iConfirm',
        'iTimeNow',

        function($scope, $state, $stateParams, safeMainTitle, iAjax, iMessage, iConfirm, iTimeNow) {
            safeMainTitle.title = '设备分组管理';

            $scope.$on('hardwareGroupControllerOnEvent', function() {
                if($stateParams.data) {
                    $scope.groups.devicetype = $stateParams.data.type;
                    $scope.ous.current = $stateParams.data.ou;

                    if($stateParams.data.devices && $stateParams.data.devices.length > 0) {
                        $scope.devices.selectList = $stateParams.data.devices;
                        $scope.groups.control.add();
                    }

                    $scope.ous.getDatas();
                    $scope.groups.getDatas();
                }

                $scope.devices.getTypes();
            });

            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
                $scope.backUrl = fromState.name;
            });

            $scope.buttonStyle = ['primary', 'info', 'success', 'warning', 'default', 'danger'];

            /**
             * 返回上一级
             * @author : zhs
             * @version : 1.0
             * @date : 2018-06-20
             */
            $scope.goback = function() {
                if($scope.backUrl) {
                    $state.go($scope.backUrl);
                } else {
                    $state.go('safe.hardware.list');
                }
            }

            /**
             * 设备分组
             * @author : zhs
             * @version : 1.0
             * @date : 2018-06-22
            */
            $scope.groups = {
                devicetype: '',
                list: [],
                pages: {
                    pageNo: 1,
                    pageSize: 6
,               },
                filter: {
                    text: ''
                },
                control: {
                    mode: '',
                    obj: null,
                    add: function() {
                        this.mode = 'add';
                        $scope.groups.modal.show();
                    },
                    edit: function(item) {
                        this.mode = 'edit';
                        $scope.groups.control.obj = angular.copy(item);
                        $scope.devices.selectList = item.devices.map(function(device) {
                            return {
                                name: device.name,
                                id: device.devicefk,
                                selected: true
                            }
                        });
                        $scope.groups.modal.show();
                    },
                    del: {
                        tips: function(item) {
                            $scope.groups.control.obj = item;
                            iConfirm.show({
                                scope: $scope,
                                title: '确认删除？',
                                content: '删除信息后将无法还原，是否确认删除？',
                                buttons: [{
                                    text: '确认',
                                    style: 'button-primary',
                                    action: 'groups.control.del.confirm'
                                }, {
                                    text: '取消',
                                    style: 'button-caution',
                                    action: 'groups.control.del.close'
                                }]
                            });
                        },
                        confirm: function(id) {
                            iAjax.post('security/device.do?action=delDeviceGroup', {
                                // remoteip: '192.168.1.4',
                                filter: {
                                    id: $scope.groups.control.obj.id
                                }
                            }).then(function(data) {
                                remind(1, '分组删除成功！');

                                iConfirm.close(id);

                                $scope.groups.getDatas();
                            });
                        },
                        close: function(id) {
                            iConfirm.close(id);
                            return true;
                        }
                    },
                    excute: function(groupid, actionstr) {
                        iAjax.post('security/device/device.do?action=executeDeviceGroup', {
                            // remoteip: '192.168.1.4',
                            filter: {
                                id: groupid,
                                action: actionstr
                            }
                        }).then(function(data) {
                            if(data.result.rows == 'success') {
                                remind(1, '设备组执行动作成功！');
                            }
                        }, function() {
                            remind(4, '网络连接出错，分组设备动作执行失败！')
                        });
                    }
                },
                // 新增/修改分组窗口
                modal: {
                    show: function() {
                        $scope.devices.company.getList();
                        $scope.devices.search();
                        $('#groupModal').modal({
                            backdrop: false
                        });
                    },
                    close: function() {
                        $('#groupModal').modal('hide');
                        $scope.groups.control.obj = null;

                        $scope.devices.company.id = '';
                        $scope.devices.selectList = [];

                        $scope.ous.reset();
                    }
                },
                // 获取设备分组列表
                getDatas: function() {
                    iAjax.post('security/device.do?action=getDeviceGroup', {
                        // remoteip: '192.168.1.4',
                        params: {
                            pageNo: $scope.groups.pages.pageNo,
                            pageSize: $scope.groups.pages.pageSize
                        },
                        filter: {
                            type: $scope.groups.devicetype
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.groups.list = data.result.rows[0];

                            if(data.result.params) {
                                $scope.groups.pages.totalSize = data.result.params.totalSize;
                                $scope.groups.pages.totalPage = data.result.params.totalPage;
                            }
                        }
                    }, function() {
                        remind(4, '网络连接出错，设备分组数据查询失败！')
                    });
                },
                // 新增或修改
                save: function() {
                    var url = '';

                    if($scope.groups.control.mode == 'add') {
                        url = 'security/device.do?action=saveDeviceGroup';
                    } else if($scope.groups.control.mode == 'edit') {
                        url = 'security/device.do?action=modDeviceGroup';
                    }

                    iAjax.post(url, {
                        // remoteip: '192.168.1.4',
                        filter: {
                            id: $scope.groups.control.obj.id,
                            name: $scope.groups.control.obj.name,
                            type: $scope.groups.devicetype,
                            devices: $scope.devices.selectList.map(function(device) {
                                return {
                                    name: device.name,
                                    devicefk: device.id
                                }
                            })
                        }
                    }).then(function(data) {
                        if(data.status == '1') {
                            remind(1, $scope.groups.control.obj.name, '设备分组成功');

                            $scope.groups.modal.close();

                            $scope.groups.getDatas();
                        } else {
                            remind(4, '设备分组失败！');
                        }
                    }, function () {
                        remind(4, '网络连接出错，设备分组失败');
                    });
                },
                search: function(event) {
                    if((event && event.keyCode == 13) || !event) {
                        this.pages.pageNo = 1;
                        this.getDatas();
                    }
                },
                // 选择设备类型
                selectDeviceType: function() {
                    this.search();

                    $scope.ous.getDatas();
                }
            }

            /**
             * 设备数据
             * @author : zhs
             * @version : 1.0
             * @date : 2018-06-22
            */
            $scope.devices = {
                loading: false,
                types: [],       // 设备类型
                list: [],        // 所有设备
                selectList: [], // 已选中设备
                pages: {         // 分页
                    pageNo: 1,
                    pageSize: 20
                },
                // 设备厂家
                company: {
                    id: '',
                    list: [],
                    getList: function() {
                        iAjax.post('security/deviceCode.do?action=getDevicecodeType').then(function(data) {
                            if(data.result && data.result.rows) {
                                var devicetype = _.find(data.result.rows, {content: $scope.groups.devicetype});
                                if(devicetype) {
                                    $scope.devices.company.list = devicetype.child;
                                }
                            }
                        });
                    }
                },
                // 获取设备类型
                getTypes: function() {
                    iAjax.post('security/device/device.do?action=getDeviceTypes').then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.devices.types = data.result.rows;

                            if(!$scope.groups.devicetype) {
                                $scope.groups.devicetype = data.result.rows[0].type;
                                $scope.groups.getDatas();
                                $scope.ous.getDatas();
                            }
                        }
                    });
                },
                getList: function() {
                    this.loading = true;
                    iAjax.post('security/device/device.do?action=getDeviceActionOuList', {
                        params: {
                            pageNo: $scope.devices.pages.pageNo,
                            pageSize: $scope.devices.pages.pageSize
                        },
                        filter: {
                            cascade: 'Y',
                            mapfk: $scope.ous.current.id,
                            queryType: $scope.ous.current.type,
                            searchFilter: '',
                            searchText: $scope.devices.company.id,
                            syoufk: $scope.ous.current.syoufk,
                            type: $scope.groups.devicetype
                        }
                    }).then(function(data) {
                        $scope.devices.loading = false;

                        if(data.result && data.result.rows) {
                            // 判断是否已经选中
                            _.each(data.result.rows, function(item) {
                                var idx = _.findIndex($scope.devices.selectList, {id: item.id});
                                if(idx > -1) {
                                    item.selected = true;
                                }
                            });

                            if($scope.devices.pages.pageNo > 1) {
                                $scope.devices.list = _.union($scope.devices.list, data.result.rows);
                            } else {
                                $scope.devices.list = data.result.rows;
                            }
                        }

                        if(data.result.params) {
                            $scope.devices.pages.totalSize = data.result.params.totalSize;
                            $scope.devices.pages.totalPage = data.result.params.totalPage;
                        }
                    });
                },
                loadMore: function() {
                    if(this.pages.pageNo + 1 <= this.pages.totalPage) {
                        this.pages.pageNo++;
                        this.getList();
                    }
                },
                // 选择某个设备
                select: function(item) {
                    var idx = _.findIndex(this.selectList, {id: item.id});
                    if(idx < 0) {
                        item.selected = true;
                        this.selectList.push(item);
                    } else {
                        item.selected = false;
                        this.selectList.splice(idx, 1);
                    }
                },
                // 设备查询
                search: function(event) {
                    if((event && event.keyCode == 13) || !event) {
                        this.pages.pageNo = 1;
                        this.list = [];
                        this.getList();
                    }
                }
            }

            /**
             * 单位列表
             * @author : zhs
             * @version : 1.0
             * @date : 2018-06-25
            */
            $scope.ous = {
                current: null,
                list: [],
                getDatas: function() {
                    iAjax.post('security/device/device.do?action=getMapOuActionList', {
                        filter: {
                            type: $scope.groups.devicetype,
                            cascade: 'Y'
                        }
                    }).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.ous.list = data.result.rows;

                            if(!$scope.ous.current) {
                                $scope.ous.current = _.find(data.result.rows, function (row) {
                                    return !row.parentid;
                                });
                            }
                        }
                    }, function() {
                        remind(4, '网络连接出错，单位列表查询失败！');
                    });
                },
                show: function() {
                    $('.tree-panel').toggle();
                },
                select: function(node) {
                    $scope.ous.current = node;

                    $('.tree-panel').hide();

                    $scope.devices.search();
                },
                reset: function() {
                    $scope.ous.current = _.find($scope.ous.list, function(row) {
                        return !row.parentid;
                    });
                }
            }

            /**
             * 消息提醒
             * @author : zhs
             * @version : 1.0
             * @date : 2018-06-22
             */
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒'),
                    content: (content || '网络出错'),
                    level: level
                };

                iMessage.show(message, false);
            }
        }
    ]);
});