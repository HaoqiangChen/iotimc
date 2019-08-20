/**
 * 电子地图管理-地图设置控制器
 *
 * @author - dwt
 * @date - 2016-01-26
 * @version - 0.1
 */
define([
    'app',
    'system/insidemapsetting/lib/colorpicker/colorpicker',
    'system/insidemapsetting/js/directive/insidemapsettingtree',
    'system/insidemapsetting/js/directive/insidemapsettingmap',
    'system/insidemapsetting/js/directive/colorpicker/colorpicker',
    'cssloader!system/insidemapsetting/lib/colorpicker/colorpicker.css',
    'cssloader!system/insidemapsetting/css/map.css'
], function(app) {

    app.controller('insidemapSettingMapController', [
        '$scope',
        '$stateParams',
        '$filter',
        '$timeout',
        '$state',
        'iAjax',
        'mapSettingData',
        'iConfirm',
        'iMessage',
        'iGetLang',
        function($scope, $stateParams, $filter, $timeout, $state, iAjax, mapSettingData, iConfirm, iMessage, iGetLang) {

            $scope.$on('$viewContentLoaded', function(ngEvent) {
                ngEvent.stopPropagation();
            });

            $scope.$parent.subTitle = '地图配置【' + $stateParams.data.prevItem.name + ' / ' + $stateParams.data.map.name + '】';

            //获取方言
            $scope.dialect = {
                'PTN_C': iGetLang.get('PTN_C')
            };

            $scope.map = {
                // 地图对象
                object: $stateParams.data.map,

                // 地图的上一级（单位、目录）
                preItem: $stateParams.data.prevItem,

                // 当前单位或目录的地图列表
                maps: $stateParams.data.maps,
                changeMap: function(item) {
                    if(!item.bak_savepath) {
                        item.bak_savepath = item.savepath;
                    }
                    item.savepath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + (item.bak_savepath || item.savepath);
                    mapSettingData.getMapShapes(item.id, function(list) {
                        item.mapDtl = list;
                        $scope.map.object = item;
                        $scope.$parent.subTitle = '地图配置【' + $scope.map.preItem.name + ' / ' + item.name + '】';
                        $scope.map.init();
                    });
                },

                // 列表资源
                resources: {

                    // 给跳转点的地图树用的基本地图列表数据
                    map: {
                        list: [],
                        find: function(id) {
                            return $filter('filter')(this.list, {id: id})[0];
                        },
                        findDtl: function(id) {
                            return $filter('filter')($scope.map.object.mapDtl, {id: id})[0];
                        },
                        init: function() {
                            mapSettingData.getMapList(function(list) {
                                $scope.map.resources.map.list = list;
                            });
                        }
                    },
                    // 给设备点用的基本设备列表数据
                    device: {
                        list: [],
                        find: function(id, type) {
                            // return $filter('filter')(this.list, {id: id})[0];
                            iAjax.post('security/device.do?action=getDeviceDetail', {
                                row: {
                                    id: id
                                }
                            }).then(function(data) {
                                if(data.result.rows && data.result.rows.length) {
                                    $scope.map.formData[type]['item'] = data.result.rows[0];
                                } else {
                                    $scope.map.formData[type]['item'] = null;
                                }
                            })
                        },
                        init: function() {
                            /*iAjax
                                .post('/security/device.do?action=getDevice', {
                                    filter: {}
                                })
                                .then(function(data) {
                                    $scope.map.resources.device.list = data.result.rows;

                                    //获取固定电话资源
                                    iAjax.post('security/preplan.do?action=getTelephone', {
                                        params: {
                                            pageNo: 1,
                                            pageSize: 1000
                                        }
                                    }).then(function(data) {
                                        if(data && data.result && data.result.rows) {
                                            _.each(data.result.rows, function(row) {
                                                row.type = 'telephone';
                                                row.typename = '固定电话';
                                            });
                                            $scope.map.resources.device.list = $scope.map.resources.device.list.concat(data.result.rows);
                                        }
                                    });
                                });*/
                        }
                    },
                    // 跳转点的地图树
                    pageMap: {
                        onView: false,
                        show: function() {
                            this.onView = true;
                            $scope.map.resources.pageMap.getList();
                        },
                        hide: function() {
                            this.onView = false;
                        },

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
                                        if(treeNode.type != 'map' && $scope.map.control.runningObject.type == 'lift') {
                                            return;
                                        }

                                        $scope.map.formData.jump.item = treeNode;
                                        $scope.map.resources.pageMap.hide();
                                    }
                                }
                            },
                            tree: {
                                treeNodes: []
                            }
                        },

                        getList: function() {
                            mapSettingData.getMapList(function(list) {
                                var aList = angular.copy(list);
                                //if($scope.map.control.runningObject.type == 'area') {
                                //    aList = $filter('filter')(aList, function(v) {
                                //        return (v.type != 'map');
                                //    });
                                //}
                                $scope.map.resources.pageMap.data.tree.treeNodes = aList;
                            });
                        },

                        tempUrl: '',
                        tempUrlName: '',
                        showEnterUrl: function() {
                            if($scope.map.formData.jump.item && $scope.map.formData.jump.item.type == 'url') {
                                this.tempUrl = $scope.map.formData.jump.item.id;
                                this.tempUrlName = $scope.map.formData.jump.item.name;
                            }else {
                                this.tempUrl = '';
                                this.tempUrlName = '';
                            }

                            iConfirm.show({
                                scope: $scope,
                                title: '外部链接地址',
                                templateUrl: $.soa.getWebPath('iiw.system.insidemapsetting') + '/view/outsideurl.html',
                                buttons: [{
                                    text: '确认',
                                    style: 'button-primary',
                                    action: 'map.resources.pageMap.confirmEnter'
                                }, {
                                    text: '取消',
                                    style: 'button-caution',
                                    action: 'map.resources.pageMap.confirmClose'
                                }]
                            });
                        },
                        confirmEnter: function(id) {
                            $scope.map.formData.jump.item = {
                                id: $scope.map.resources.pageMap.tempUrl,
                                type: 'url',
                                name: $scope.map.resources.pageMap.tempUrlName
                            };
                            iConfirm.close(id);
                            $scope.map.resources.pageMap.hide();
                        },
                        confirmClose: function(id) {
                            iConfirm.close(id);
                        }
                    },
                    // 视频标签用的监控设备列表
                    pageMonitor: {
                        onView: false,
                        show: function() {
                            this.onView = true;
                            $scope.map.resources.pageMonitor.getList();
                        },
                        hide: function() {
                            this.onView = false;
                        },

                        list: [],
                        totalSize: 0,
                        currentPage: 1,
                        totalPage: 1,
                        pageSize: 10,
                        searchText: '',

                        getList: function() {
                            iAjax
                                .post('/security/device.do?action=getDevice', {
                                    params: {
                                        pageNo: $scope.map.resources.pageMonitor.currentPage,
                                        pageSize: $scope.map.resources.pageMonitor.pageSize
                                    },
                                    filter: {
                                        searchText: $scope.map.resources.pageMonitor.searchText,
                                        type: 'monitor'
                                    }
                                })
                                .then(function(data) {
                                    $scope.map.resources.pageMonitor.list = data.result.rows;
                                    if(data.result.params) {
                                        var params = data.result.params;
                                        $scope.map.resources.pageMonitor.totalSize = params.totalSize;
                                        $scope.map.resources.pageMonitor.pageSize = params.pageSize;
                                        $scope.map.resources.pageMonitor.totalPage = params.totalPage;
                                        $scope.map.resources.pageMonitor.currentPage = params.pageNo;
                                    }
                                });
                        },
                        change: function() {
                            $scope.map.resources.pageMonitor.currentPage = this.currentPage;
                            $scope.map.resources.pageMonitor.getList();
                        },
                        getListByKeybroad: function(event) {
                            if(event.keyCode == 13) {
                                $scope.map.resources.pageMonitor.getList();
                            }
                        },
                        click: function(item) {
                            $scope.map.formData.monitor.item = item;
                            $scope.map.resources.pageMonitor.hide();
                        }
                    },
                    // 区域关联设备用的设备列表
                    pageDevice: {
                        onView: false,
                        show: function() {
                            this.onView = true;
                            $scope.map.resources.pageDevice.typeList[0].count = $scope.map.resources.pageDevice.deviceList.length;
                            $scope.map.resources.pageDevice.getList();
                        },
                        hide: function() {
                            this.onView = false;
                            $scope.map.control.object.devices = angular.copy($scope.map.resources.pageDevice.deviceList);
                        },

                        deviceList: [],
                        list: [],
                        selectAll: false,
                        totalSize: 0,
                        currentPage: 1,
                        totalPage: 1,
                        pageSize: 10,
                        searchText: '',

                        typeItem: null,
                        typeList: [],

                        companyItem: '',

                        sortableOptions: {
                            cursor: 'move',
                            axis: 'y',
                            disabled: false
                        },

                        initDeviceList: function(list) {
                            var deviceList = angular.copy(list);
                            angular.forEach(deviceList, function(device) {
                                device.checked = true;
                            });
                            this.deviceList = deviceList;
                        },
                        init: function() {
                            iAjax
                                .post('/security/device.do?action=getDeviceTypeList', {})
                                .then(function(data) {

                                    var allCount = 0;
                                    angular.forEach(data.result.rows, function(v) {
                                        allCount += v.count;
                                    });
                                    data.result.rows.unshift({
                                        count: allCount,
                                        name: '所有类型',
                                        type: ''
                                    });
                                    data.result.rows.unshift({
                                        count: 0,
                                        name: '已选择',
                                        type: 'selected'
                                    });
                                    $scope.map.resources.pageDevice.typeList = data.result.rows;
                                    $scope.map.resources.pageDevice.typeItem = $scope.map.resources.pageDevice.typeList[0];

                                    $scope.map.resources.pageDevice.getCompanies();
                                });
                        },
                        getCompanies: function() {
                            iAjax.post('security/deviceCode.do?action=getDevicecodeType').then(function(data) {
                                if(data.result && data.result.rows) {
                                    _.each(data.result.rows, function(row) {
                                         var idx = _.findIndex($scope.map.resources.pageDevice.typeList, {type: row.content});
                                         if(idx > -1) {
                                             $scope.map.resources.pageDevice.typeList[idx].child = row.child;
                                         }
                                    });
                                }
                            });
                        },
                        typeChange: function() {
                            if(this.typeItem.type == 'selected') {
                                $scope.map.resources.pageDevice.sortableOptions.disabled = false;
                            }else {
                                $scope.map.resources.pageDevice.sortableOptions.disabled = true;
                            }

                            this.getList();
                        },
                        change: function() {
                            $scope.map.resources.pageDevice.currentPage = this.currentPage;
                            $scope.map.resources.pageDevice.getList();
                        },
                        selAll: function() {
                            var that = this;

                            var list = $scope.map.resources.pageDevice.list.slice();
                            if(!this.selectAll) {
                                angular.forEach(list, function(item) {
                                    if(!item.checked) {
                                        that.click(item);
                                    }
                                });
                            }else {
                                angular.forEach(list, function(item) {
                                    if(item.checked) {
                                        that.click(item);
                                    }
                                });
                            }

                            this.selectAll = !this.selectAll;
                        },
                        getListByKeybroad: function(event) {
                            if(event.keyCode == 13) {
                                $scope.map.resources.pageDevice.getList();
                            }
                        },
                        click: function(item) {
                            var aFind = $filter('filter')($scope.map.resources.pageDevice.deviceList, {id: item.id});
                            var index = -1;
                            if(aFind.length) {
                                index = $scope.map.resources.pageDevice.deviceList.indexOf(aFind[0]);
                            }

                            if($scope.map.resources.pageDevice.typeItem.type != 'selected') {
                                if(item.checked) {
                                    item.checked = false;
                                    if(index > -1) {
                                        $scope.map.resources.pageDevice.deviceList.splice(index, 1);
                                    }
                                }else {
                                    item.checked = true;
                                    $scope.map.resources.pageDevice.deviceList.push(item);
                                }
                            }else {
                                if(index > -1) {
                                    $scope.map.resources.pageDevice.deviceList.splice(index, 1);
                                }
                            }
                            $scope.map.resources.pageDevice.typeList[0].count = $scope.map.resources.pageDevice.deviceList.length;
                        },
                        removeDevice: function(item, i) {
                            $scope.map.control.object.devices.splice(i, 1);

                            var aFind = $filter('filter')($scope.map.resources.pageDevice.deviceList, {id: item.id});
                            var index = -1;
                            if(aFind.length) {
                                index = $scope.map.resources.pageDevice.deviceList.indexOf(aFind[0]);
                                if(index > -1) {
                                    $scope.map.resources.pageDevice.deviceList.splice(index, 1);
                                }
                            }
                            $scope.map.resources.pageDevice.typeList[0].count = $scope.map.resources.pageDevice.deviceList.length;
                        },
                        getList: function() {
                            this.selectAll = false;
                            if($scope.map.resources.pageDevice.typeItem && $scope.map.resources.pageDevice.typeItem.type != 'selected') {
                                iAjax
                                    .post('/security/device.do?action=getDevice', {
                                        params: {
                                            pageNo: $scope.map.resources.pageDevice.currentPage,
                                            pageSize: $scope.map.resources.pageDevice.pageSize
                                        },
                                        filter: {
                                            company: $scope.map.resources.pageDevice.companyItem,
                                            searchText: $scope.map.resources.pageDevice.searchText,
                                            type: $scope.map.resources.pageDevice.typeItem.type
                                        }
                                    })
                                    .then(function(data) {

                                        var aFind;
                                        angular.forEach(data.result.rows, function(row) {
                                            aFind = $filter('filter')($scope.map.resources.pageDevice.deviceList, {id: row.id});
                                            if(aFind.length) {
                                                row.checked = true;
                                            }
                                        });

                                        $scope.map.resources.pageDevice.list = data.result.rows;
                                        if(data.result.params) {
                                            var params = data.result.params;
                                            $scope.map.resources.pageDevice.totalSize = params.totalSize;
                                            $scope.map.resources.pageDevice.pageSize = params.pageSize;
                                            $scope.map.resources.pageDevice.totalPage = params.totalPage;
                                            $scope.map.resources.pageDevice.currentPage = params.pageNo;
                                        }
                                    });
                            }else {
                                $scope.map.resources.pageDevice.list = $scope.map.resources.pageDevice.deviceList;
                                $scope.map.resources.pageDevice.totalSize = 10;
                                $scope.map.resources.pageDevice.pageSize = 10;
                                $scope.map.resources.pageDevice.totalPage = 1;
                                $scope.map.resources.pageDevice.currentPage = 1;
                            }
                        }
                    },
                    // 设备点的可选择设备列表
                    pageSingleDevice: {
                        onView: false,
                        show: function() {
                            this.onView = true;
                            $scope.map.resources.pageSingleDevice.getList();
                        },
                        hide: function() {
                            this.onView = false;
                        },

                        list: [],
                        totalSize: 0,
                        currentPage: 1,
                        totalPage: 1,
                        pageSize: 10,
                        searchText: '',

                        typeItem: null,
                        typeList: [],

                        init: function() {
                            iAjax
                                .post('/security/device.do?action=getDeviceTypeList', {})
                                .then(function(data) {

                                    var allCount = 0;
                                    angular.forEach(data.result.rows, function(v) {
                                        allCount += v.count;
                                    });

                                    data.result.rows.unshift({
                                        count: allCount,
                                        name: '所有类型',
                                        type: ''
                                    });
                                    data.result.rows.push({
                                        count: 0,
                                        name: '固定电话',
                                        type: 'telephone'
                                    });
                                    $scope.map.resources.pageSingleDevice.typeList = data.result.rows;
                                    $scope.map.resources.pageSingleDevice.typeItem = $scope.map.resources.pageSingleDevice.typeList[0];

                                    //获取固定电话资源
                                    iAjax.post('security/preplan.do?action=getTelephone', {
                                        params: {
                                            pageNo: 1,
                                            pageSize: 1
                                        }
                                    }).then(function(data) {
                                        if(data && data.result && data.result.rows) {
                                            if(data.result.params) {
                                                $scope.map.resources.pageSingleDevice.typeList[$scope.map.resources.pageSingleDevice.typeList.length - 1].count = data.result.params.totalSize;
                                            }
                                        }
                                    });

                                });
                        },
                        change: function() {
                            $scope.map.resources.pageSingleDevice.currentPage = this.currentPage;
                            $scope.map.resources.pageSingleDevice.getList();
                        },
                        getListByKeybroad: function(event) {
                            if(event.keyCode == 13) {
                                $scope.map.resources.pageSingleDevice.getList();
                            }
                        },
                        click: function(item) {
                            $scope.map.formData.device.item = item;
                            $scope.$broadcast('changeDevice', $scope.map.formData.device.item);
                            $scope.map.resources.pageSingleDevice.hide();
                        },
                        getList: function() {
                            var type = '';
                            if($scope.map.resources.pageSingleDevice.typeItem) {
                                type = $scope.map.resources.pageSingleDevice.typeItem.type || '';
                            }

                            if(type != 'telephone') {
                                iAjax
                                    .post('/security/device.do?action=getDevice', {
                                        params: {
                                            pageNo: $scope.map.resources.pageSingleDevice.currentPage,
                                            pageSize: $scope.map.resources.pageSingleDevice.pageSize
                                        },
                                        filter: {
                                            searchText: $scope.map.resources.pageSingleDevice.searchText,
                                            type: type
                                        }
                                    })
                                    .then(function(data) {
                                        $scope.map.resources.pageSingleDevice.list = data.result.rows;
                                        if(data.result.params) {
                                            var params = data.result.params;
                                            $scope.map.resources.pageSingleDevice.totalSize = params.totalSize;
                                            $scope.map.resources.pageSingleDevice.pageSize = params.pageSize;
                                            $scope.map.resources.pageSingleDevice.totalPage = params.totalPage;
                                            $scope.map.resources.pageSingleDevice.currentPage = params.pageNo;
                                        }
                                    });
                            }else {
                                iAjax.post('security/preplan.do?action=getTelephone', {
                                    params: {
                                        pageNo: $scope.map.resources.pageSingleDevice.currentPage,
                                        pageSize: $scope.map.resources.pageSingleDevice.pageSize
                                    }
                                }).then(function(data) {
                                    if(data && data.result && data.result.rows) {

                                        $scope.map.resources.pageSingleDevice.typeList[$scope.map.resources.pageSingleDevice.typeList.length - 1].count = data.result.rows.length;
                                        _.each(data.result.rows, function(row) {
                                            row.type = 'telephone';
                                            row.typename = '固定电话';
                                        });

                                        $scope.map.resources.pageSingleDevice.list = data.result.rows;
                                        if(data.result.params) {
                                            var params = data.result.params;
                                            $scope.map.resources.pageSingleDevice.totalSize = params.totalSize;
                                            $scope.map.resources.pageSingleDevice.pageSize = params.pageSize;
                                            $scope.map.resources.pageSingleDevice.totalPage = params.totalPage;
                                            $scope.map.resources.pageSingleDevice.currentPage = params.pageNo;
                                        }

                                    }
                                });
                            }
                        }
                    },
                    // 单位数据 - 警察和罪犯统计类型的可选列表
                    syou: {
                        list: [],
                        init: function() {
                            var url = 'security/common/monitor.do?action=getMapOuList',
                                data = {
                                    filter: {
                                        cascade: 'Y'
                                    }
                                };

                            iAjax
                                .post(url, data)
                                .then(function(data) {
                                    if(data && data.result && data.result.rows) {
                                        _.each(data.result.rows, function(row) {
                                            if(row.type == 'ou') {
                                                $scope.map.resources.syou.list.push(row);
                                            }
                                        });
                                    }
                                });
                        }
                    },
                    // 信息类型 - 警察和罪犯统计类型的可选列表
                    informationType: {
                        list: {
                            criminal: [],
                            police: []
                        },
                        init: function(type, syoufk, callback) {
                            var data = '';
                            if(syoufk) {
                                data = syoufk;
                            } else {
                                data = type == 'criminal' ? $scope.map.formData.customCriminalStat._syou.id : $scope.map.formData.customPoliceStat._syou.id
                            }

                            var url = '/security/map.do?action=getInformationList';

                            iAjax
                                .post(url, {
                                    filter: {
                                        type: type,
                                        syoufk: data
                                    }
                                })
                                .then(function(data) {
                                    if(data && data.result && data.result.rows) {
                                        $scope.map.resources.informationType.list[type] = data.result.rows;

                                        if(callback) {
                                            callback(data.result.rows);
                                        }
                                    }
                                });
                        }
                    }
                },

                // 图层
                navigate: {
                    list: [],
                    object: null,
                    select: function(item) {
                        $scope.map.control.cancel();
                        $scope.map.navigate.object = item;
                    }
                },

                // 新增图形时的默认数据
                shapes: {

                    initarea: {
                        type: 'initarea',
                        typename: '初始化聚焦区域',
                        shape: 'polygon',
                        style: {
                            pointList: [],
                            color: 'rgba(0,0,0,0.3)',
                            text: ''
                        },
                        blowscale: 1,
                        idx: 1
                    },
                    aisle: {
                        type: 'aisle',
                        typename: '走廊区域',
                        shape: 'polygon',
                        style: {
                            pointList: [],
                            color: 'rgba(0,0,0,0.3)',
                            text: ''
                        },
                        blowscale: 20,
                        idx: 1
                    },
                    area: {
                        type: 'area',
                        typename: '建筑区域',
                        shape: 'polygon',
                        style: {
                            pointList: [],
                            color: 'rgba(0,0,0,0.3)',
                            opacity: 1,
                            text: ''
                        },
                        jumpfk: '',
                        jumpstyle: '',
                        jumpname: '',
                        areatype: '',
                        policestattype: ''
                    },
                    dutypolice: {
                        type: 'dutypolice',
                        typename: '值班区域',
                        shape: 'polygon',
                        style: {
                            pointList: [],
                            color: 'rgba(0,0,0,0.3)',
                            text: ''
                        }
                    },
                    inclosure: {
                        type: 'inclosure',
                        typename: '围墙区域',
                        shape: 'polygon',
                        style: {
                            pointList: [],
                            color: 'rgba(0,0,0,0.3)',
                            text: ''
                        },
                        blowscale: 20,
                        idx: 1
                    },
                    lift: {
                        type: 'lift',
                        typename: '楼梯区域',
                        shape: 'polygon',
                        style: {
                            pointList: [],
                            color: 'rgba(0,0,0,0.3)',
                            text: ''
                        },
                        jumpfk: '',
                        jumpstyle: '',
                        jumpname: ''
                    },
                    room: {
                        type: 'room',
                        typename: '房间区域',
                        shape: 'polygon',
                        style: {
                            pointList: [],
                            color: 'rgba(0,0,0,0.3)',
                            text: ''
                        },
                        roomNum: ''
                    },

                    guides: {
                        type: 'guides',
                        typename: '辅助线',
                        shape: 'polyline',
                        style: {
                            lineWidth: 1,
                            strokeColor: 'red',
                            pointList: [],
                            textPosition: 'end'
                        }
                    }
                },

                // 新增标签时的默认数据
                tags: {
                    tag: {
                        item: null,
                        list: [{
                            name: '居中',
                            value: 'middle'
                        }, {
                            name: '向上',
                            value: 'top'
                        }, {
                            name: '向下',
                            value: 'bottom'
                        }, {
                            name: '向左',
                            value: 'left'
                        }, {
                            name: '向右',
                            value: 'right'
                        }],
                        changeEvent: function(item) {
                            $scope.map.select.tagdir = item.value;
                        },
                        init: function(item) {
                            var aFind = $filter('filter')($scope.map.tags.list, {value: item});
                            if(aFind && aFind.length) {
                                $scope.map.tags.item = aFind[0];
                            }
                        }
                    },

                    monitor: {
                        type: 'tag',
                        tagtype: 'monitor',
                        typename: '视频标签',
                        shape: 'circle',
                        style: {
                            'r': 0,
                            'opacity': 0
                        },
                        tagdir: 'top',
                        parentid: '',
                        monitorfk: ''
                    },
                    device: {
                        type: 'tag',
                        tagtype: 'device',
                        typename: '设备标签',
                        shape: 'circle',
                        style: {
                            r: 0,
                            opacity: 0
                        },
                        tagdir: 'middle',
                        devicetype: '',
                        devicename: '',
                        devicefk: ''
                    }
                },

                // 右侧的表单数据和控制接口
                formData: {
                    invalid: false,
                    // 图形类型
                    type: {value: ''},
                    // 标签类型
                    tagType: {value: ''},
                    // 标题名称
                    name: {value: ''},
                    // 副标题
                    subtitle: {value: ''},
                    // 总结内容，林政电子地图的管库房用
                    summarytitle: {value: ''},
                    summary: {value: ''},
                    // 坐标绘制
                    coordinate: {
                        copyPointList: null,
                        state: 1, // 1开始绘制，2重新绘制，3结束绘制，4标注坐标，5结束标注
                        doclick: function() {
                            if($scope.map.formData.coordinate.state < 4) {
                                if($scope.map.formData.coordinate.state != 3) {
                                    $scope.$broadcast('reDrawShape', {});
                                    $scope.map.formData.coordinate.state = 3;
                                }else {
                                    $scope.$broadcast('reDrawShapeDone');
                                    if($scope.map.control.runningObject.style.pointList.length) {
                                        $scope.map.formData.coordinate.state = 2;
                                    }else {
                                        $scope.map.formData.coordinate.state = 1;
                                    }
                                }
                            }else {
                                if($scope.map.formData.coordinate.state != 5) {
                                    $scope.$broadcast('reDrawShape', {});
                                    $scope.map.formData.coordinate.state = 5;
                                }else {
                                    $scope.$broadcast('reDrawShapeDone');
                                    $scope.map.formData.coordinate.state = 4;
                                }
                            }
                        },
                        copyShape: function() {
                            $scope.$broadcast('copyShape');
                        },
                        parseShape: function() {
                            $scope.$broadcast('parseShape', {pointList: $scope.map.formData.coordinate.copyPointList});
                            $scope.map.formData.coordinate.state = 2;
                        }
                    },
                    // 跳转点
                    jump: {
                        item: null,
                        init: function(jumpfk) {
                            if(jumpfk) {
                                this.item = $scope.map.resources.map.find(jumpfk);
                            }else {
                                this.item = null;
                            }
                        }
                    },
                    // 房间号，若有多个房间号，请使用|
                    roomnum: {
                        value: ''
                    },
                    //床位号总数
                    bedsum: {
                        value: ''
                    },
                    // 图形文字大小
                    textSize: {
                        value: 0,
                        test: function() {
                            $scope.$broadcast('calculateShapeTextSize', $scope.map.formData.textSize.value);
                        }
                    },
                    // 背景图相对于区域的放大倍数
                    blowscale: {
                        value: 0,
                        test: function() {
                            $scope.$broadcast('blowUpShape', $scope.map.formData.blowscale.value);
                        },
                        test2: function() {
                            $scope.$broadcast('blowUpShapeItSelf');
                        }
                    },
                    // 排序用，用于点击走廊或围墙后，切换上一个或下一个使用
                    idx: {
                        value: 1
                    },
                    // 是否显示区域的罪犯小人头
                    count: {
                        item: null,
                        list: [
                            {'name': '是', value: ''},
                            {'name': '否', value: 'nocount'}
                        ],
                        init: function(value) {
                            if(value == 'nocount') {
                                this.item = this.list[1];
                            }else {
                                this.item = this.list[0];
                            }
                        }
                    },
                    // 单位区域使用，若为重点，则安全标签的统计单位为地图所属单位
                    important: {
                        item: null,
                        list: [
                            {'name': '是', value: 'IMP'},
                            {'name': '否', value: ''}
                        ],
                        init: function(value) {
                            if(value == 'IMP') {
                                this.item = this.list[0];
                            }else {
                                this.item = this.list[1];
                            }
                        }
                    },
                    // 选择自定义后，警察和罪犯统计类型可自定义选择
                    customStatistics: {
                        item: null,
                        list: [
                            {'name': '是', value: true},
                            {'name': '否', value: false}
                        ],
                        init: function(value) {
                            if(value) {
                                this.item = this.list[0];
                            } else {
                                this.item = this.list[1];
                            }
                        },
                        change: function() {
                            if(this.item.value) {
                                $scope.map.formData.policeStat.init('2');
                                $scope.map.formData.criminalStat.init('1');
                            }
                        }
                    },
                    // 安全标签的警察统计类型
                    policeStat: {
                        item: null,
                        list: [
                            {'name': '门禁进出统计', value: '1'},
                            {'name': '信息上报', value: '2'}
                        ],
                        init: function(value) {
                            if(value == '2') {
                                this.item = this.list[1];
                            }else {
                                this.item = this.list[0];
                            }
                        }
                    },
                    // 自定义的警察统计类型
                    customPoliceStat: {
                        status: '',
                        list: [],
                        init: function(datas) {
                            this.list = [];
                            if(datas && datas.length > 0) {
                                angular.forEach(datas, function (data) {
                                    if (data.type == 'police') {
                                        var syou = _.filter($scope.map.resources.syou.list, function(item) {
                                            return item.id == data.syoufk;
                                        })[0];
                                        data.syouname = syou['name'];

                                        $scope.map.resources.informationType.init('police', syou.id, function(result) {
                                            data.informationname = _.filter(result, function(item) {
                                                return item.id == data.informationitemdtlfk;
                                            })[0]['name'];
                                        });

                                        $scope.map.formData.customPoliceStat.list.push(data);
                                    }
                                });
                            }
                        },
                        add: function() {
                            this.list.push({
                                mapdtlfk: $scope.map.control.object == null ? '' : $scope.map.control.object.id,
                                syoufk: $scope.map.formData.customPoliceStat._syou.id,
                                syouname: $scope.map.formData.customPoliceStat._syou.name,
                                informationitemdtlfk: $scope.map.formData.customPoliceStat._information.id,
                                informationname: $scope.map.formData.customPoliceStat._information.name,
                                type: 'police'
                            });

                            $scope.map.formData.customPoliceStat._syou = null;
                            $scope.map.formData.customPoliceStat._information = null;
                            this.status = '';
                        },
                        delete: function(item, index) {
                            this.list.splice(index, 1);
                        }
                    },
                    // 安全标签的罪犯统计类型
                    criminalStat: {
                        item: null,
                        list: [
                            {'name': '信息上报', value: '1'},
                            {'name': '实时信息统计', value: '2'}
                        ],
                        init: function(value) {
                            if(value == '2') {
                                this.item = this.list[1];
                            }else {
                                this.item = this.list[0];
                            }
                        }
                    },
                    // 自定义的罪犯统计类型
                    customCriminalStat: {
                        status: '',
                        list: [],
                        init: function(datas) {
                            this.list = [];
                            if(datas && datas.length > 0) {
                                angular.forEach(datas, function (data) {
                                    if (data.type == 'criminal') {
                                        var syou = _.filter($scope.map.resources.syou.list, function(item) {
                                            return item.id == data.syoufk;
                                        })[0];
                                        data.syouname = syou.name;

                                        $scope.map.resources.informationType.init('criminal', syou.id, function(result) {
                                            data.informationname = _.filter(result, function(item) {
                                                return item.id == data.informationitemdtlfk;
                                            })[0]['name'];
                                        });

                                        $scope.map.formData.customCriminalStat.list.push(data);
                                    }
                                });
                            }
                        },
                        add: function() {
                            this.list.push({
                                mapdtlfk: $scope.map.control.object == null ? '' : $scope.map.control.object.id,
                                syoufk: $scope.map.formData.customCriminalStat._syou.id,
                                syouname: $scope.map.formData.customCriminalStat._syou.name,
                                informationitemdtlfk: $scope.map.formData.customCriminalStat._information.id,
                                informationname: $scope.map.formData.customCriminalStat._information.name,
                                type: 'criminal'
                            });

                            $scope.map.formData.customCriminalStat._syou = null;
                            $scope.map.formData.customCriminalStat._information = null;
                            this.status = '';
                        },
                        delete: function(item, index) {
                            this.list.splice(index, 1);
                        }
                    },
                    // 监控设备点的图标类型
                    monitorType: {
                        item: null,
                        list: [
                            {'name': '枪机', value: '1'},
                            {'name': '球机', value: '2'},
                            {'name': '热成像', value: '3'},
                            {'name': '车辆识别', value: '4'}
                        ],
                        init: function(value) {
                            switch(value) {
                            case '1':
                                this.item = this.list[0];
                                break;
                            case '2':
                                this.item = this.list[1];
                                break;
                            case '3':
                                this.item = this.list[2];
                                break;
                            case '4':
                                this.item = this.list[3];
                                break;
                            default :
                                this.item = this.list[0];
                                break;
                            }
                        },
                        change: function() {
                            $scope.map.control.object.monitortype = this.item.value;
                            $scope.$broadcast('changeMonitorType', this.item.value);
                        }
                    },
                    // 视频标签的显示方向
                    direction: {
                        item: null,
                        list: [
                            {'name': '居中', value: 'middle'},
                            {'name': '向上', value: 'top'},
                            {'name': '向右', value: 'right'},
                            {'name': '向下', value: 'bottom'},
                            {'name': '向左', value: 'left'}
                        ],
                        change: function() {
                            $scope.map.control.object.tagdir = $scope.map.formData.direction.item.value;
                            $scope.$broadcast('changeTagdir', $scope.map.formData.direction.item.value);
                        },
                        init: function(dir) {
                            var aFind = $filter('filter')(this.list, {value: dir});
                            if(aFind.length) {
                                this.item = aFind[0];
                            }
                        }
                    },
                    // 视频标签所属区域
                    belongArea: {
                        item: null,
                        select: function() {
                            $scope.$broadcast('selectShape');
                            $scope.map.control.modes.saveMode();
                            $scope.map.control.modes.changeMode('selectShape');
                        },
                        selectDone: function(mapdtlfk) {
                            $scope.$broadcast('selectShapeDone');
                            if(mapdtlfk) {
                                this.item = angular.copy($scope.map.resources.map.findDtl(mapdtlfk));
                                this.item.params = JSON.parse(this.item.params);
                            }
                            $scope.map.control.modes.loadMode();
                        },
                        init: function(mapdtlfk) {
                            if(mapdtlfk) {
                                var oMapDtl = angular.copy($scope.map.resources.map.findDtl(mapdtlfk));
                                if(oMapDtl) {
                                    this.item = oMapDtl;
                                    this.item.params = JSON.parse(this.item.params);
                                }
                            }else {
                                this.item = null;
                            }
                        }
                    },
                    // 视频标签选择的监控设备
                    monitor: {
                        item: null,
                        init: function(monitorfk) {
                            if(monitorfk) {
                                // this.item = angular.copy($scope.map.resources.device.find(monitorfk));
                                $scope.map.resources.device.find(monitorfk, 'monitor');
                            }else {
                                this.item = null;
                            }
                        }
                    },
                    // 设备点选择的设备
                    device: {
                        item: null,
                        init: function(devicefk) {
                            if(devicefk) {
                                // this.item = $scope.map.resources.device.find(devicefk);
                                $scope.map.resources.device.find(devicefk, 'device');
                            }else {
                                this.item = null;
                            }
                        }
                    },
                    // 北京防区报警使用，报警时与该方向开始算距离，显示报警点
                    lookdir: {
                        item: null,
                        list: [
                            {'name': '无', value: ''},
                            {'name': '上', value: 'up'},
                            {'name': '右', value: 'right'},
                            {'name': '下', value: 'bottom'},
                            {'name': '左', value: 'left'}
                        ],
                        change: function() {
                            $scope.map.control.object.lookdir = $scope.map.formData.direction.item.value;
                        },
                        init: function(dir) {
                            var aFind = $filter('filter')(this.list, {value: dir});
                            if(aFind.length) {
                                this.item = aFind[0];
                            }
                        }
                    },
                    // 图形的颜色修改
                    shapeColorFn: {
                        changeColor: function(color) {
                            $scope.$broadcast('changeShapeColor', color);
                        },
                        changedColor: function(color) {
                            $scope.$broadcast('changeShapeColor', color);
                        },
                        removeColor: function() {
                            $scope.$broadcast('removeUniqueColor');
                            if(this.setColorHook) {
                                this.setColorHook('rgba(0,0,0,0.3)');
                            }
                        }
                    },
                    clean: function() {
                        this.type.value = '';
                        this.tagType.value = '';
                        this.name.value = '';
                        this.coordinate.state = 1;
                        this.jump.item = null;
                        this.roomnum.value = '';
                        this.bedsum.value = '';
                        this.textSize.value = 15;
                        this.blowscale.value = 0;
                        this.idx.value = 1;
                        this.count.item = null;
                        this.important.item = null;
                        this.customStatistics.item = null;
                        this.customPoliceStat.list = [];
                        this.customCriminalStat.list = [];
                        this.policeStat.item = null;
                        this.criminalStat.item = null;
                        this.monitorType.item = null;
                        this.direction.item = null;
                        this.belongArea.item = null;
                        this.monitor.item = null;
                        this.device.item = null;
                    },
                    init: function() {
                        var pointList = mapSettingData.getCopyPointList();
                        if(pointList) {
                            $scope.map.formData.coordinate.copyPointList = pointList;
                        }
                    }
                },

                // 右下角的控制按钮
                control: {
                    modes: {
                        oldMode: null,
                        mode: null,
                        list: [
                            {
                                name: 'none',
                                value: '选择一种类型进行添加'
                            }, {
                                name: 'add',
                                value: '新增信息'
                            }, {
                                name: 'edit',
                                value: '修改信息'
                            }, {
                                name: 'del',
                                value: '确认删除'
                            }, {
                                name: 'selectShape',
                                value: '选择一个区域'
                            }
                        ],
                        changeMode: function(type) {
                            var aFind = $filter('filter')(this.list, {name: type});
                            if(aFind.length) {
                                this.mode = aFind[0];
                            }
                        },
                        saveMode: function() {
                            this.oldMode = angular.copy(this.mode);
                        },
                        loadMode: function() {
                            if(this.oldMode) {
                                this.changeMode(this.oldMode.name);
                                this.oldMode = null;
                            }
                        },
                        init: function() {
                            this.mode = this.list[0];
                        }
                    },

                    // 原始图形对象
                    object: null,

                    // 在地图上的图形对象（属性经过比例换算过）
                    runningObject: null,

                    add: function(item) {
                        $scope.map.control.modes.changeMode('add');

                        this.object = angular.copy(item);

                        if(!item['tagtype']) {
                            $scope.map.formData.name.value = this.object.style.name;
                            $scope.map.formData.coordinate.state = 1;
                            $scope.map.formData.type = this.object.type;

                            if(item['type'] == 'area' || item['type'] == 'lift') {
                                $scope.map.formData.jump.init(this.object['jumpfk']);
                            }

                            if(item['type'] == 'room') {
                                $scope.map.formData.roomnum.value = this.object['roomNum'];
                            }

                            if(item['type'] == 'room') {
                                $scope.map.formData.count.init(this.object['nocount']);
                            }

                            if(item['type'] == 'aisle' || item['type'] == 'inclosure' || item['type'] == 'initarea') {
                                $scope.map.formData.blowscale.value = this.object['blowscale'];
                            }

                            if(item['type'] == 'aisle' || item['type'] == 'inclosure') {
                                $scope.map.formData.idx.value = this.object['idx'];
                            }

                            if(item['type'] == 'area') {
                                $scope.map.formData.important.init(this.object['areatype']);
                                $scope.map.formData.customStatistics.init(false);
                                $scope.map.formData.policeStat.init(this.object['policestattype']);
                                $scope.map.formData.criminalStat.init(this.object['criminalstattype']);
                            }

                            $scope.map.formData.textSize.value = 15;
                            $scope.map.formData.lookdir.init(this.object['lookdir']);
                            $scope.map.formData.summarytitle.value = '';
                            $scope.map.formData.summary.value = '';
                        }else {
                            $scope.map.formData.coordinate.state = 4;
                            $scope.map.formData.tagtype = this.object.tagtype;

                            $scope.map.formData.direction.init(this.object['tagdir']);

                            if(item['tagtype'] == 'monitor') {
                                $scope.map.formData.belongArea.init(this.object['parentid']);
                                $scope.map.formData.monitor.init(this.object['monitorfk']);
                            }else if(item['tagtype'] == 'device') {
                                $scope.map.formData.device.init(this.object['devicefk']);
                                $scope.map.formData.monitorType.init(this.object['monitortype']);
                            }
                        }

                        $timeout(function() {
                            $scope.map.formData.coordinate.doclick();
                        }, 100);

                    },
                    edit: function() {
                        $scope.map.control.modes.changeMode('edit');
                    },
                    del: function() {
                        $scope.map.control.modes.changeMode('del');
                    },
                    cancelDel: function() {
                        $scope.map.control.modes.changeMode('edit');
                    },
                    cancel: function() {
                        if($scope.map.control.object) {
                            if($scope.map.control.object.oldDevices) {
                                $scope.map.control.object.devices = angular.copy($scope.map.control.object.oldDevices);
                                delete $scope.map.control.object.oldDevices;
                            }
                            $scope.map.control.object = null;
                        }
                        $scope.map.formData.clean();
                        $scope.map.resources.pageDevice.deviceList = [];
                        $scope.map.control.modes.changeMode('none');
                        $scope.$broadcast('reDrawShapeDone');
                    },

                    saveData: function() {
                        if($scope.map.formData.invalid) {
                            return;
                        }

                        var oParams = angular.copy($scope.map.control.runningObject.originParams);
                        oParams.style.text = $scope.map.formData.name.value;
                        oParams.style.textSize = $scope.map.formData.textSize.value;
                        oParams.style.subtitle = $scope.map.formData.subtitle.value; // 增加标签副标题 by HJ 2017-11-17

                        if((oParams['type'] == 'area' || oParams['type'] == 'lift') && $scope.map.formData.jump.item) {
                            oParams['jumpfk'] = $scope.map.formData.jump.item.id;
                            oParams['jumpstyle'] = $scope.map.formData.jump.item.type;
                            oParams['jumpname'] = $scope.map.formData.jump.item.name;
                        }

                        if(oParams['type'] == 'room') {
                            oParams['roomNum'] = $scope.map.formData.roomnum.value || '';
                        }

                        if(oParams['type'] == 'room') {
                            oParams['nocount'] = $scope.map.formData.count.item.value;
                        }

                        if(oParams['type'] == 'room') {
                            oParams['bedsum'] = $scope.map.formData.bedsum.value;
                        }

                        if(oParams['type'] == 'aisle' || oParams['type'] == 'inclosure' || oParams['type'] == 'initarea') {
                            oParams['blowscale'] = $scope.map.formData.blowscale.value || 20;
                        }

                        if(oParams['type'] == 'area' && $scope.map.formData.important.item) {
                            oParams['areatype'] = $scope.map.formData.important.item.value;
                        }

                        if(oParams['type'] == 'area' && $scope.map.formData.policeStat.item) {
                            oParams['policestattype'] = $scope.map.formData.policeStat.item.value;
                        }

                        if(oParams['type'] == 'area' && $scope.map.formData.criminalStat.item) {
                            oParams['criminalstattype'] = $scope.map.formData.criminalStat.item.value;
                        }

                        if(!oParams['tagtype'] && $scope.map.formData.lookdir.item) {
                            oParams['lookdir'] = $scope.map.formData.lookdir.item.value;
                        }

                        if((oParams['tagtype'] == 'monitor' || oParams['tagtype'] == 'device') && $scope.map.formData.direction.item) {
                            oParams['tagdir'] = $scope.map.formData.direction.item.value;
                        }

                        if(!oParams['tagtype']) {
                            oParams['summarytitle'] = $scope.map.formData.summarytitle.value;
                            oParams['summary'] = $scope.map.formData.summary.value;
                        }

                        if(oParams['tagtype'] == 'monitor' && $scope.map.formData.belongArea.item) {
                            oParams['parentid'] = $scope.map.formData.belongArea.item.id;
                        }

                        if(oParams['tagtype'] == 'monitor' && $scope.map.formData.monitor.item) {
                            oParams['monitorfk'] = $scope.map.formData.monitor.item.id;
                        }

                        if(oParams['tagtype'] == 'device' && $scope.map.formData.device.item) {
                            oParams['devicename'] = $scope.map.formData.device.item.name;
                            oParams['devicefk'] = $scope.map.formData.device.item.id;
                            oParams['devicetype'] = $scope.map.formData.device.item.type;
                            if(oParams['devicetype'] == 'monitor') {
                                oParams['monitortype'] = $scope.map.formData.monitorType.item.value;
                            }
                            if(oParams['devicetype'] == 'telephone') {
                                oParams['phonenumber'] = $scope.map.formData.device.item.phone;
                            }
                        }

                        var shapeDevices = $scope.map.resources.pageDevice.deviceList,
                            deviceid = [];
                        if(shapeDevices.length) {
                            angular.forEach(shapeDevices, function(device) {
                                deviceid.push(device.id);
                            });
                        }

                        var data = {
                            id: $scope.map.control.object.id,
                            type: $scope.map.control.object.type,
                            name: $scope.map.formData.name.value,
                            subtitle: $scope.map.formData.subtitle.value,
                            mapfk: $scope.map.object.id,
                            params: JSON.stringify(oParams),
                            deviceid: deviceid,
                            idx: $scope.map.formData.idx.value
                        };

                        if($scope.map.formData.customStatistics.item && $scope.map.formData.customStatistics.item.value) {
                            data.information = $scope.map.formData.customPoliceStat.list.concat($scope.map.formData.customCriminalStat.list);

                            if($scope.map.formData.customPoliceStat.list.length <= 0) {
                                oParams['policestattype'] = '-1';
                                data.params = JSON.stringify(oParams);
                            }
                        } else {
                            data.information = [];
                        }

                        var url = '/security/map.do?action=addMapDtl';
                        if($scope.map.control.object.id) {
                            url = '/security/map.do?action=modMapDtl';
                        }

                        iAjax
                            .post(url, {
                                filter: data
                            })
                            .then(function(data) {
                                $scope.$broadcast('addMapDtl', {
                                    id: data.result.rows,
                                    oParams: oParams,
                                    shapeDevices: shapeDevices,
                                    idx: $scope.map.formData.idx.value
                                });
                                $scope.map.control.object.oParams = oParams;
                                $scope.map.control.object.devices = $scope.map.resources.pageDevice.deviceList;

                                var obj = $scope.map.resources.map.findDtl(data.result.rows);
                                if(!obj) {
                                    var copyObj = angular.copy($scope.map.control.object);
                                    copyObj.id = data.result.rows;
                                    copyObj.params = JSON.stringify(oParams);

                                    if($scope.map.formData.customStatistics.item && $scope.map.formData.customStatistics.item.value) {
                                        copyObj.information = $scope.map.formData.customPoliceStat.list.concat($scope.map.formData.customCriminalStat.list);
                                    } else {
                                        copyObj.information = [];
                                    }

                                    $scope.map.object.mapDtl.push(copyObj);
                                }else {
                                    obj.params = JSON.stringify(oParams);

                                    if($scope.map.formData.customStatistics.item && $scope.map.formData.customStatistics.item.value) {
                                        obj.information = $scope.map.formData.customPoliceStat.list.concat($scope.map.formData.customCriminalStat.list);
                                    } else {
                                        obj.information = [];
                                    }
                                }

                                if (data.status == '1') {
                                    iMessage.show({
                                        level: 1,
                                        title: '保存成功!',
                                        content: data.message
                                    });
                                }

                                $scope.map.control.cancel();

                            });
                    },
                    delData: function() {
                        if($scope.map.control.object.id) {
                            iAjax
                                .post('/security/map.do?action=delMapDtl', {
                                    filter: {
                                        id: [$scope.map.control.object.id]
                                    }
                                })
                                .then(function(data) {
                                    if(data.result.rows) {
                                        $scope.$broadcast('delMapDtl', angular.copy($scope.map.control.object));
                                        $scope.map.control.cancel();
                                    }
                                });
                        }
                    }
                },

                // 在地图上选择图形或标签
                selectItem: function(item) {
                    //if(!$scope.map.control.object) {
                    $scope.map.control.cancel();

                    $scope.map.control.modes.changeMode('edit');
                    $scope.map.control.object = item;
                    $scope.map.resources.pageDevice.initDeviceList($scope.map.control.object.devices);
                    $scope.map.control.object.oldDevices = angular.copy($scope.map.control.object.devices);

                    if(!item['tagtype']) {
                        $scope.map.formData.name.value = item.style.name || item.style.text;
                        $scope.map.formData.subtitle.value = item.style.subtitle; // 增加标签副标题 by HJ 2017-11-17
                        $scope.map.formData.coordinate.state = 2;
                        var newObject = _.extendOwn({}, $scope.map.shapes[item['type']], $scope.map.control.object);
                        _.extend($scope.map.control.object, newObject);

                        $scope.map.formData.type = item.type;
                        $scope.map.formData.textSize.value = item.style.textSize || 15;

                        if(item['type'] == 'area' || item['type'] == 'lift') {
                            if(item['jumpstyle'] != 'url') {
                                $scope.map.formData.jump.init(item['jumpfk']);
                            }else {
                                $scope.map.formData.jump.item = {
                                    id: item['jumpfk'],
                                    type: item['jumpstyle'],
                                    name: item['jumpname']
                                };
                            }
                        }

                        if(item['type'] == 'room') {
                            $scope.map.formData.roomnum.value = item['roomNum'];
                        }

                        if(item['type'] == 'room') {
                            $scope.map.formData.bedsum.value = item['bedsum'];
                        }

                        if(item['type'] == 'room') {
                            $scope.map.formData.count.init(item['nocount']);
                        }

                        if(item['type'] == 'aisle' || item['type'] == 'inclosure' || item['type'] == 'initarea') {
                            $scope.map.formData.blowscale.value = item['blowscale'];
                        }

                        if(item['type'] == 'aisle' || item['type'] == 'inclosure') {
                            $scope.map.formData.idx.value = item['idx'];
                        }

                        if(item['type'] == 'area') {
                            $scope.map.formData.important.init(item['areatype']);
                            $scope.map.formData.policeStat.init(item['policestattype']);
                            $scope.map.formData.criminalStat.init(item['criminalstattype']);

                            var ouMapDtl = angular.copy($scope.map.resources.map.findDtl(item['id']));
                            if(ouMapDtl.information && ouMapDtl.information.length > 0) {
                                $scope.map.formData.customStatistics.init(true);
                                $scope.map.formData.customPoliceStat.init(ouMapDtl.information);
                                $scope.map.formData.customCriminalStat.init(ouMapDtl.information);
                            } else {
                                $scope.map.formData.customStatistics.init(false);
                            }
                        }

                        $scope.map.formData.lookdir.init(item['lookdir']);
                        $scope.map.formData.summarytitle.value = item['summarytitle'];
                        $scope.map.formData.summary.value = item['summary'];
                    }else {
                        $scope.map.formData.coordinate.state = 4;
                        var newObject = _.extendOwn({}, $scope.map.tags[item['tagtype']], $scope.map.control.object);
                        _.extend($scope.map.control.object, newObject);

                        $scope.map.formData.tagtype = item.tagtype;
                        $scope.map.formData.direction.init(item['tagdir']);

                        if(item['tagtype'] == 'monitor') {
                            $scope.map.formData.belongArea.init(item['parentid']);
                            $scope.map.formData.monitor.init(item['monitorfk']);
                        }else if(item['tagtype'] == 'device') {
                            $scope.map.formData.device.init(item['devicefk']);
                            if(item['devicetype'] == 'monitor') {
                                $scope.map.formData.monitorType.init(item['monitortype']);
                            }
                        }
                    }
                    //}
                },

                init: function() {
                    if(typeof this.object.params == 'string') {
                        this.object.params = JSON.parse(this.object.params);
                    }

                    angular.forEach(this.object.params, function(v) {
                        if(v['shapeGroups']) {
                            angular.forEach(v['shapeGroups'], function(v2) {
                                v2['showText'] = true;
                            });
                        }
                    });

                    this.navigate.list = [];
                    this.navigate.list = $.extend(true, [], this.object.params);
                    this.navigate.list.push({
                        select: false,
                        name: '其他配置',
                        type: 'config',
                        shapeGroups: [
                            {type: 'initarea', showText: true},
                            {type: 'guides'}
                        ]
                    });
                    this.navigate.select(this.navigate.list[0]);

                    this.formData.init();
                    this.control.modes.init();

                    // this.resources.device.init();
                    this.resources.syou.init();
                    this.resources.map.init();
                    $scope.map.resources.pageDevice.init();
                    $scope.map.resources.pageSingleDevice.init();
                }
            };

            $scope.map.init();

            $scope.$watch('mapInfoForm.$invalid', function(newInvalid) {
                $scope.map.formData.invalid = newInvalid;
            });

        }
    ]);

});