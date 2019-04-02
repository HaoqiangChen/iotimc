/**
 * Created by ZJQ on 2016-03-10.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/device/css/index.css',
    'system/device/js/directives/exportExcel',
    'system/js/directives/systemTreeViewDirective',
    'system/device/js/directives/monitorpatroltree'

], function (app, angularAMD) {
    var packageName = 'iiw.system.device';
    var m_scode;
    var deviceObject;
    var m_xCurrentManId;

    app.controller('deviceController', ['$scope',
        '$state',
        'iConfirm',
        '$location',
        '$timeout',
        'iAjax',
        'iMessage',
        'mainService',

        function ($scope, $state, iConfirm, $location, $timeout, iAjax, iMessage, mainService) {
            mainService.moduleName = "设备资源管理";
            $scope.title = "设备管理";

            $scope.currentPage = 1;
            $scope.totalPage = 1;
            $scope.pageSize = 10;

            $scope.selectAll = false;

            $scope.selectChannelAll = {
                insert: false,
                update: false,
                del: false
            };

            // $scope.isSnycing = false;
            $scope.syncMode = '';
            $scope.fieldItem = null;
            $scope.ouArray = [];
            $scope.alarmStatus = '';

            var hardwareContent = '';
            var companyId = '';
            var searchTitle = '';
            var syoufk = '';
            var syouname = '';
            $scope.device = {showtree: true};

            $scope.$on('deviceControllerOnEvent', function () {
                init();
            });

            function init() {
                getDeviceInfo();
                getHardwaretypeInfo();
            }

            function getDeviceInfo() {
                var url, data;
                url = '/security/device.do?action=getDevice';
                data = {
                    params: {
                        pageNo: $scope.currentPage,
                        pageSize: $scope.pageSize
                    },
                    filter: {
                        searchText: searchTitle,
                        company: companyId,
                        type: hardwareContent
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.entityItem = data.result.rows;
                        } else {
                            $scope.entityItem = [];
                        }
                        if (data.result.params) {
                            var params = data.result.params;
                            $scope.totalSize = params.totalSize;
                            $scope.pageSize = params.pageSize;
                            $scope.totalPage = params.totalPage;
                            $scope.currentPage = params.pageNo;
                        }
                    },
                    function (data) {
                    })
            }

            function getHardwaretypeInfo() {
                var url, data;
                url = '/security/deviceCode.do?action=getDevicecodeType';
                data = {};
                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.result && data.result.rows) {

                            data.result.rows.unshift({
                                content: '',
                                name: '所有类型',
                                value: ''
                            });

                            $scope.entityHardtypeItem = data.result.rows;
                        }
                    },
                    function (data) {
                    })
            }

            $scope.pageChanged = function () {
                $scope.currentPage = this.currentPage;
                getDeviceInfo();
            };

            $scope.selAll = function () {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.entityItem, function (i, o) {
                    o.checked = $scope.selectAll;
                });
            };

            $scope.add = function () {
                m_scode = null;
                $scope.fieldItem = null;
                $state.go('system.device.add');
            };

            $scope.mod = function () {
                var rows = _.where($scope.entityItem, {checked: true});
                if (rows.length > 0) {
                    if (rows.length == 1) {
                        m_scode = rows[0].id;
                        $scope.fieldItem = null;
                        $state.go('system.device.mod');
                    } else {
                        var message = {};
                        message.level = 3;
                        message.title = "设备修改";
                        message.content = "设备修改不能同时修改多条信息，请重新选择!";
                        iMessage.show(message, false, $scope);
                    }
                } else {
                    var message = {};
                    message.level = 3;
                    message.title = "设备修改";
                    message.content = "请选择需要修改的一条设备信息!";
                    iMessage.show(message, false, $scope);
                }
            };

            $scope.delete = function () {
                var rows = _.where($scope.entityItem, {checked: true});
                var aName = [];
                if (rows.length > 0) {

                    aName = rows.map(function(select, i) {
                        return ( i + 1 + '、' + select.name);
                    });

                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '共选择' + rows.length + '条数据，分别为：<br>' + aName.join('<br>'),
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
                    var message = {};
                    message.level = 3;
                    message.title = "设备删除";
                    message.content = "请选择需要删除设备信息!";
                    iMessage.show(message, false, $scope);
                }

            };

            $scope.sync = function () {
                $state.go('system.device.sync');
            };

            $scope.export = function () {
                $state.go('system.device.export');
            };

            $scope.import = function () {
                $state.go('system.device.import');
            };

            $scope.searchInfo = function (type) {
                if (type == 'hardware') {
                    hardwareContent = this.indexHardWareType.content;
                    companyId = '';
                } else if (type == 'company') {
                    hardwareContent = this.indexHardWareType.content;
                    companyId = this.companyType;
                }
                searchTitle = this.searchTitle;

                getDeviceInfo();
            };

            $scope.selectOu = function () {
                if (!$scope.fieldItem) {
                    if (syoufk == "") {
                        var message = {};
                        message.level = 3;
                        message.title = "单位选择";
                        message.content = "请选择一个单位信息!";
                        iMessage.show(message, false, $scope);
                    } else {
                        deviceObject.syouname = syouname;
                        deviceObject.syoufk = syoufk;
                    }
                } else {
                    var items = _.filter($scope.$$childTail.entityPropertiesItem, {sign: '1'});
                    if (items.length > 0) {
                        items[0].ounames = [];
                        items[0].keyvalue = [];
                        var names = [];
                        var ids = [];
                        $.each($scope.$$childTail.ouArray, function (i, o) {
                            names.push(o.name);
                            ids.push(o.id);
                        });
                        items[0].ounames = names.join(',');
                        items[0].keyvalue = ids.join(',');
                    }
                }

                $('#syouTreeModel').removeClass('in');
                $timeout(function () {
                    $('#syouTreeModel').hide()
                }, 1000);
            };

            $scope.cancel = function (type) {
                if (type == 'monitor') {
                    $('#monitorChannelModel').removeClass('in');
                    $timeout(function () {
                        $('#monitorChannelModel').hide()
                    }, 1000);

                    $scope.$broadcast('getDeviceInfoReList');
                    $location.path('/system/device');

                } else if (type == 'tree') {
                    $('#syouTreeModel').removeClass('in');
                    $timeout(function () {
                        $('#syouTreeModel').hide()
                    }, 1000);
                } else if (type == 'sync') {
                    $('#singleSyncModel').removeClass('in');
                    $timeout(function () {
                        $('#singleSyncModel').hide()
                    }, 1000);
                }
            };

            $scope.confirmSuccess  = function(id) {
                iConfirm.close(id);
                var deviceSelId = [];
                var rows = _.where($scope.entityItem, {checked: true});
                $.each(rows, function (index, row) {
                    deviceSelId.push(row.id);
                });
                var url, data;
                url = '/security/device.do?action=delDevice';
                data = {
                    id: deviceSelId
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data && data.message) {
                            if (data.status == '1') {

                                var message = {};
                                message.level = 1;
                                message.title = "设备删除";
                                message.content = "删除设备成功!";
                                iMessage.show(message, false, $scope);

                                $location.path('/system/device');
                                init();
                            } else {
                                var message = {};
                                message.level = 4;
                                message.title = "设备删除";
                                message.content = "删除设备失败!";
                                iMessage.show(message, false, $scope);
                            }
                        }
                    },
                    function (data) {
                    })
            };

            $scope.confirmCancel  = function(id) {
                iConfirm.close(id);
            };

            /**
             * 树节点点击事件
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-15
             */
            $scope.selectEvent = function (treeNode) {
                syouname = treeNode.name;
                syoufk = treeNode.id;
            };

            /**
             * 单位树checked单击事件，选择或取消门禁设备
             */
            $scope.checkEvent = function (event, treeld, treeNode) {
                initOuArray(treeNode);
            };

            function initOuArray(treeNode) {
                if (treeNode.checked) {
                    var listNodes = _.filter($scope.ouArray, {id: treeNode.id});
                    if (listNodes.length == 0) {
                        $scope.ouArray.push({id: treeNode.id, name: treeNode.name});
                    }
                } else {
                    var listNodes = _.filter($scope.ouArray, {id: treeNode.id});
                    $scope.ouArray = _.without($scope.ouArray, listNodes[0]);
                }

                //if(treeNode.children && treeNode.children.length > 0) {
                //    $.each(treeNode.children, function(i, o){
                //        initOuArray(o);
                //    });
                //}
            }

            $scope.$on('getDeviceInfoReList', function () {
                getDeviceInfo();
            });

            $scope.syncDevice = function () {
                $('#monitorChannelModel').removeClass('in');
                $timeout(function () {
                    $('#monitorChannelModel').hide()
                }, 1000);

                $scope.syncEntityItem = [];

                var url, data;
                url = '/security/device.do?action=syncMonitorChannelInfo';
                data = {
                    filter: {
                        id: [m_xCurrentManId]
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data) {
                            if (data.result && data.result.rows) {
                                $scope.syncEntityItem = data.result.rows[0];
                                // $scope.isSnycing = true;

                                $('#singleSyncModel').show();
                                $('#singleSyncModel').addClass('in');

                            } else {
                                $scope.syncEntityItem = [];
                                // $scope.isSnycing = true;
                            }
                        }
                    }),
                    function (data) {
                    }
            };

            $scope.saveChannel = function () {
                var data, url;

                if($scope.syncEntityItem.insert || $scope.syncEntityItem.update || $scope.syncEntityItem.del) {
                    $scope.syncEntityItem.insert = _.filter($scope.syncEntityItem.insert, {checked: true});
                    $scope.syncEntityItem.update = _.filter($scope.syncEntityItem.update, {checked: true});
                    $scope.syncEntityItem.del = _.filter($scope.syncEntityItem.del, {checked: true});

                    data = {
                        // remoteip: '192.168.1.4',
                        rows: $scope.syncEntityItem
                    }

                    url = '/security/device.do?action=saveTypeSyncMonitor';

                    if($scope.syncMode != '') {
                        url = '/security/device.do?action=saveSyncNameMonitor';
                    }
                } else {
                    data = {
                        filter: $scope.syncEntityItem
                    }

                    url = '/security/device.do?action=saveSyncMonitor';
                }

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data && data.message) {
                            if (data.status == '1' && data.result.rows == '1') {
                                $('#singleSyncModel').removeClass('in');
                                $timeout(function () {
                                    $('#singleSyncModel').hide()
                                }, 1000);

                                $scope.syncEntityItem = {};

                                var message = {};
                                message.level = 1;
                                message.title = "同步通道";
                                message.content = "同步通道成功!";
                                iMessage.show(message, false, $scope);
                            } else if (data.status == '1' && data.result.rows == '0'){
                                $('#singleSyncModel').removeClass('in');
                                $timeout(function () {
                                    $('#singleSyncModel').hide();
                                }, 1000);

                                var message = {};
                                message.level = 3;
                                message.title = "同步通道";
                                message.content = "上次通道还未同步完成，请稍后继续!";
                                iMessage.show(message, false, $scope);
                            }
                        }
                    })
            };

            $scope.saveBatchChannel = function () {
                var data, url;
                data = $scope.syncAllEntityItem;

                url = '/security/device.do?action=saveBatchSyncMonitor';
                data = {
                    filter: data
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data && data.message) {
                            if (data.status == "1") {

                                var message = {};
                                message.level = 1;
                                message.title = "同步通道";
                                message.content = "同步通道成功!";
                                iMessage.show(message, false, $scope);

                                $('#singleSyncModel').removeClass('in');
                                $timeout(function () {
                                    $('#singleSyncModel').hide()
                                }, 1000);

                            }
                        }
                    }),
                    function (data) {
                        var message = {};
                        message.level = 4;
                        message.title = "同步通道";
                        message.content = "同步通道失败，请检查流媒体信息是否配置正确!";
                        iMessage.show(message, false, $scope);

                        $('#singleSyncModel').removeClass('in');
                        $timeout(function () {
                            $('#singleSyncModel').hide()
                        }, 1000);
                    }
            };


            $scope.selChannel = function (type) {
                if(!type) {
                    $scope.selectAll = !$scope.selectAll;
                    $.each($scope.syncEntityItem.monitors, function (i, o) {
                        o.checked = $scope.selectAll;
                    });
                } else {
                    $scope.selectChannelAll[type] = !$scope.selectChannelAll[type];
                    if($scope.syncEntityItem.filterText) {
                        // 如果有过滤条件，只改变符合过滤条件的选择状态
                        var filterList = _.filter($scope.syncEntityItem[type], function(row){
                            return row.name.indexOf($scope.syncEntityItem.filterText) > -1;
                        });

                        $.each(filterList, function (i, o) {
                            o.checked = $scope.selectChannelAll[type];
                        });
                    } else {
                        $.each($scope.syncEntityItem[type], function (i, o) {
                            o.checked = $scope.selectChannelAll[type];
                        });
                    }
                }
            };

            $scope.selChannelByNum = function(num, type) {
                if($scope.syncEntityItem.filterText) {
                    // 如果有过滤条件，只改变符合过滤条件的选择状态
                    var filterList = _.filter($scope.syncEntityItem[type], function(row){
                        return row.name.indexOf($scope.syncEntityItem.filterText) > -1;
                    });

                    $.each(filterList, function (i, o) {
                        if (i < num) {
                            o.checked = true;
                        }
                    });
                } else {
                    $.each($scope.syncEntityItem[type], function (i, o) {
                        if (i < num) {
                            o.checked = true;
                        }
                    });
                }
            };
        }
    ])
    .controller('deviceItemController', ['$scope',
        '$rootScope',
        '$location',
        '$state',
        '$filter',
        '$http',
        'iAjax',
        'iMessage',
        'iToken',
        '$uibModal',
        'iConfirm',

        /**
         *
         * @param $scope
         * @param $rootScope
         * @param $location
         * @param $state
         * @param $filter
         * @param iAjax
         * @param iMessage
         *
         * 设备添加、修改操作Controller
         *
         */
            function ($scope, $rootScope, $location, $state, $filter, $http, iAjax, iMessage, iToken, $uibModal, iConfirm) {

            init();
            var companyContent = "";
            $scope.showDeviceRelated = false;
            $scope.isDeviceRelated = 0;
            $scope.importExcelFile;
            $scope.deviceCodeDetail = '';
            $scope.devicedetail = '';
            $scope.entityPropertiesOther = [];
            $scope.userList = [];
            $scope.detailList = [];
            $scope.tempList = [];

            $scope.exportModel = {
                exportflag: true
            };

            $scope.changeItemAttr = function(keyvalue, index) {
                if(!$scope.tempList[index].keyvalue) {
                    $scope.tempList[index].keyvalue = '';
                }
                if(keyvalue != $scope.tempList[index].keyvalue) {
                    $scope.entityPropertiesItem[index].cascadeStatus = '1';
                }
            };

            function init() {
                getHardwaretypeItem();
                getAlarmLevel();
            }

            function getHardwaretypeItem() {
                $scope.entityHardItem = $scope.$parent.entityHardtypeItem;

                if (m_scode) {
                    getDetailList();
                    getDeviceItem();
                } else {
                    $scope.entityItem.status = 'P';
                    $scope.entityItem.islink = 'N';

                    deviceObject = $scope.entityItem;
                }
            }

            function getDeviceItem() {
                var url, data;
                url = '/security/device.do?action=getDeviceDetail';
                data = {
                    row: {
                        id: m_scode
                    }
                };
                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.entityItem = data.result.rows[0];
                            $scope.entityItem.status = $scope.entityItem.status ? $scope.entityItem.status : 'P';
                            $scope.entityItem.islink = $scope.entityItem.islink ? $scope.entityItem.islink : 'N';
                            $scope.tempList = $.extend(true, {}, $scope.entityItem.devicedtl);
                            $scope.entityPropertiesItem = $scope.entityItem.devicedtl;
                            $scope.entityPropertiesOther = $scope.entityItem.devicedtl2;
                            var aSelect = _.where($scope.entityItem.devicedtl, {content: 'dooralarmtype'});
                            if (aSelect.length) {
                                $scope.devicedetail = aSelect[0].scontent;
                                if (aSelect[0].keyvalue) {
                                    aSelect[0].keyvalue = aSelect[0].keyvalue.split(',');
                                    $.each(aSelect[0].keyvalue, function (i, o) {
                                        $.each($scope.detailList, function (y, item) {
                                            if (o == item.content) {
                                                item.checked = true;
                                            }
                                        })
                                    });
                                }
                            }
                            deviceObject = $scope.entityItem;
                            showSelListItem();
                        }
                    },
                    function (data) {
                    })
            }

            function showSelListItem() {
                var oFind = $filter('filter')($scope.entityHardItem, {id: $scope.entityItem.typeid});
                var findIndex = $scope.entityHardItem.indexOf(oFind[0]);
                $scope.hardwaretype = $scope.entityHardItem[findIndex];
                var oCompany = $filter('filter')(oFind[0].child, {id: $scope.entityItem.company});
                var cIndex = oFind[0].child.indexOf(oCompany[0]);
                $scope.companyID = oFind[0].child[cIndex].id;
            }


            $scope.showItemPropertie = function () {
                showItemProperties();
            };

            function showItemProperties() {
                var companyObject = $filter('filter')($scope.hardwaretype.child, {id: $scope.companyID});
                companyContent = companyObject[0].content;

                var url, data;
                url = '/security/deviceCode.do?action=getDevicecodeAttr';
                data = {
                    row: {
                        id: $scope.companyID
                    }
                };
                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.entityPropertiesItem = data.result.rows.peculiar;
                            $.each($scope.entityPropertiesItem, function (i, o) {
                                if (o.content == 'alarmLevel') {
                                    o.keyvalue = $scope.alarmLevelList[0].content;
                                }
                            });
                            $scope.entityPropertiesOther = data.result.rows.fix;
                            showDeviceRelatedfun(companyContent);
                            getDetailList();
                        }
                    },
                    function (data) {
                    })
            }

            function showDeviceRelatedfun(companyContent) {
                var url, data;
                url = '/security/device.do?action=getDeviceRelatedItem';
                data = {
                    filter: {
                        type: $scope.hardwaretype.content,
                        content: companyContent
                    }
                };
                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.result && data.result.rows && data.result.rows.length > 0) {
                            $scope.deviceRelatedItem = data.result.rows;
                            $scope.showDeviceRelated = true;
                        } else {
                            $scope.showDeviceRelated = false;
                            $scope.deviceRelatedItem = [];
                        }
                    })
            }

            function checkRelated() {
                $scope.deviceRelated = [];
                var rows = _.where($scope.deviceRelatedItem, {checked: true});
                var result = true;
                $.each(rows, function (index, row) {
                    if (row.checked == true && (row.keyvalue != "" && row.keyvalue != null)) {
                        var temp = {};
                        temp.keyvalue = row.keyvalue;
                        temp.type = row.type;
                        temp.alias = row.content;

                        $scope.deviceRelated[index] = temp;

                    } else {
                        var message = {};
                        message.level = 3;
                        message.title = "关联设备添加";
                        message.content = "请输入选中框相应项的名称！";
                        iMessage.show(message, false, $scope);
                        result = false;
                        return;
                    }
                });
                return result;
            }

            function getData(url, cb) {
                iAjax
                    .post(url)
                    .then(function (data) {
                        if (data && data.result && data.result.rows) {
                            if (cb && typeof(cb) === 'function') {
                                cb(data.result.rows);
                            }
                        }
                    });
            }

            var cacheUserTreeList = [];

            function getSyuserTree(cb) {
                if (cacheUserTreeList.length > 0) {
                    if (cb && typeof(cb) === 'function') {
                        cb(cacheUserTreeList);
                    }
                } else {
                    getData('sys/web/syuser.do?action=getSyuserAll', function (userList) {
                        $.each(userList, function (i, o) {
                            o['isUser'] = true;
                            o['iconSkin'] = 'userIcon';
                            cacheUserTreeList = cacheUserTreeList.concat(o);
                        });

                        if (cb && typeof(cb) === 'function') {
                            cb(cacheUserTreeList);

                        }
                    });
                }
            }

            function getAlarmLevel() {
                var data = {
                    filter: {
                        type: 'ALARMLEVEL'
                    }
                };
                iAjax
                    .post('/security/common/monitor.do?action=getSycodeList', data)
                    .then(function (data) {
                        data.result.rows.sort(function (i, o) {
                            return i.content > o.content
                        });
                        $scope.alarmLevelList = data.result.rows;
                    })
            }

            $scope.showUserTree = function () {
                getSyuserTree(function (list) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'userTreeDialog.html',
                        controller: 'userTreeController',
                        size: '',
                        resolve: {
                            items: function () {
                                return list
                            }
                        }
                    });

                    modalInstance.result.then(function (oUser) {
                        $scope.entityPropertiesOther[0].syusername = oUser.name;
                        $scope.entityPropertiesOther[0].keyvalue = oUser.id;

                    });
                })
            }


            /**
             * 弹出单位框
             *
             * @author : zjq
             * @version : 1.0
             * @Date : 2016-03-22
             */
            $scope.showOuTree = function (item) {
                $scope.$parent.ouArray = [];
                if (item) {
                    $scope.$parent.fieldItem = item;
                } else {
                    $scope.$parent.fieldItem = null;
                }
                $('#syouTreeModel').show();
                $('#syouTreeModel').addClass('in');

                var url, data;
                url = '/sys/web/syou.do?action=getSyouAll';
                data = {};
                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data.result.rows && data.result.rows.length > 0) {
                            $scope.treeNodes = {
                                zNodes: data.result.rows,
                                checkFlag: $scope.$parent.fieldItem ? true : false
                            };

                            if ($scope.$parent.fieldItem && $scope.$parent.fieldItem.keyvalue) {
                                var ids = $scope.$parent.fieldItem.keyvalue.split(',');
                                for (var i = 0; i < ids.length; i++) {
                                    var nodes = _.filter($scope.treeNodes.zNodes, {id: ids[i]});
                                    if (nodes.length > 0) {
                                        nodes[0].checked = true;
                                        $scope.$parent.ouArray.push({id: nodes[0].id, name: nodes[0].name});
                                    }
                                }
                            }
                        } else {
                            $scope.treeNodes = {
                                zNodes: []
                            };
                        }

                        $scope.treeNodes.chkboxType = {
                            'Y': '',
                            'N': ''
                        };

                        $rootScope.$broadcast('initTree', $scope.treeNodes);
                    },
                    function (data) {
                    })

            };

            $scope.showDeviceDetail = function () {
                iConfirm.show({
                    scope: $scope,
                    title: '选择接收报警类型',
                    templateUrl: $.soa.getWebPath('iiw.system.device') + '/view/deivceDetail.html',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'selectDeviceDetail'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });
            };

            $scope.selectDeviceDetail = function (id) {
                iConfirm.close(id);
                var aSelect, contentList, nameList;
                aSelect = _.where($scope.detailList, {checked: true});
                contentList = [];
                nameList = [];
                $.each(aSelect, function (i, o) {
                    contentList.push(o.content);
                    nameList.push(o.name);
                });
                $scope.deviceCodeDetail = contentList.join(',');
                $scope.devicedetail = nameList.join(',');
            };

            $scope.selectDevice = function (item) {
                item.checked = !item.checked;
            };

            function getDetailList() {
                var data = {
                    filter: {
                        type: 'DOORALARM'
                    }
                };
                iAjax
                    .post('security/information/information.do?action=getSycodeList', data)
                    .then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.detailList = data.result.rows;
                        }
                    });
            };

            $scope.confirmClose = function (id) {
                iConfirm.close(id);
                return true;
            };

            $scope.save = function (savetype) {
                if(!checkRelated()) {
                    return;
                }

                var url, data, temptitle;
                temptitle = $scope.entityItem.name;

                data = {
                    row: {
                        type: $scope.hardwaretype.content,
                        company: $scope.companyID,
                        name: $scope.entityItem.name,
                        alias: $scope.entityItem.alias,
                        code: $scope.entityItem.code,
                        project: $scope.entityItem.project,
                        syoufk: $scope.entityItem.syoufk,
                        ip: $scope.entityItem.ip,
                        port: $scope.entityItem.port,
                        status: $scope.entityItem.status,
                        islink: $scope.entityItem.islink,
                        notes: $scope.entityItem.notes || ''
                    }
                };
                data.row.deviceCode = [];
                var count = 0;
                if ($scope.entityPropertiesItem) {
                    $.each($scope.entityPropertiesItem, function (index, value) {
                        if (value.content == 'dooralarmtype' && $scope.deviceCodeDetail != '') {
                            value.keyvalue = $scope.deviceCodeDetail;
                        } else if (value.content == 'dooralarmtype' && value.keyvalue) {
                            if ($scope.deviceCodeDetail == '') {
                                value.keyvalue = $scope.deviceCodeDetail
                            } else {
                                value.keyvalue = value.keyvalue.join(',');
                            }
                        }

                        if (value.keyvalue) {
                            var temp = {};
                            temp.id = value.id;
                            temp.keyvalue = value.keyvalue;
                            if(value.cascade && value.cascade != '') {
                                temp.cascade = value.cascade;
                            }
                            data.row.deviceCode[count] = temp;
                            count++;
                        }
                    });
                }
                if ($scope.entityPropertiesOther) {
                    $.each($scope.entityPropertiesOther, function (i, item) {
                        if (item.keyvalue) {
                            var temp = {};
                            temp.id = item.id;
                            data.row.deviceCode[count] = temp;
                            count++;
                        }
                    })
                }
                if (m_scode) {
                    data.row.id = m_scode;
                    url = '/security/device.do?action=upDevice';
                } else {
                    data.row.deviceRelated = $scope.deviceRelated;
                    data.row.companyContent = companyContent;
                    url = '/security/device.do?action=addDevice';
                }
                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data && data.message) {
                            if (data.status == "1") {
                                if ($scope.hardwaretype.content == 'monitor' || $scope.hardwaretype.content == 'monitorPlatform') {
                                    $('#monitorChannelModel').show();
                                    $('#monitorChannelModel').addClass('in');
                                    m_xCurrentManId = data.result.rows;

                                } else {
                                    var message = {};
                                    message.level = 1;
                                    message.title = "设备管理";
                                    message.content = m_scode ? "修改" : "添加";
                                    message.content = message.content + "设备【" + $scope.entityItem.name + "】成功!";
                                    if (savetype == 'savenext') {
                                        message.content = message.content + "将继续添加下一个设备信息!";
                                    }
                                    iMessage.show(message, false, $scope);

                                    if (savetype == 'savenext') {
                                        $scope.entityItem.code = parseInt($scope.entityItem.code) + 1;
                                    } else {
                                        $scope.$root.$broadcast('getDeviceInfoReList');
                                        $location.path('/system/device');
                                    }
                                }
                            }
                        }
                    },
                    function (data) {
                        var message = {};
                        message.level = 4;
                        message.title = "设备管理";
                        message.content = m_scode ? "修改" : "添加";
                        message.content = message.content + "设备【" + $scope.entityItem.name + "】失败!";

                        iMessage.show(message, false, $scope);
                    })
            };
            $scope.exportExcel = function () {
                var url, data;
                url = '/security/deviceCode.do?action=createExcel';
                data = {
                    filter: {
                        type: $scope.hardwaretype.content,
                        company: $scope.companyID
                        //syoufk: $scope.entityItem.syoufk
                    }
                };

                iAjax
                    .post(url, data)
                    .then(function (data) {
                        if (data && data.message) {
                            if (data.status == "1") {
                                var url = iAjax.formatURL('/security/deviceCode.do?action=getExcel');
                                $rootScope.$broadcast('downExcel', url);
                            }
                        }
                    })
            };

            $scope.importExcel = function () {
                var url = iAjax.formatURL('/security/deviceCode.do?action=setExcel&ptype=true&type=' + $scope.hardwaretype.content + '&company=' + $scope.companyID + '&syoufk=' + $scope.entityItem.syoufk);

                var formdata = new FormData();
                formdata.append('excelFile', $('#importExcelFile')[0].files[0], $('#importExcelFile')[0].files[0].name);

                $http({
                    method: 'post',
                    url: url,
                    data: formdata,
                    enctype: 'multipart/form-data',
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (data) {
                    if (data.result && data.result.rows) {
                        var message = {};
                        message.id = new Date();
                        message.level = 1;
                        message.title = "设备管理";
                        message.content = "设备导入成功!";
                        message.content = message.content + "成功数：" + data.result.rows.addSize + "失败数：" + data.result.rows.errorSize;
                        iMessage.show(message, true, $scope);
                    }
                }).error(function (data) {
                    var message = {};
                    message.level = 4;
                    message.title = "设备管理";
                    message.content = "设备导入失败!";

                    iMessage.show(message, false, $scope);
                })
            };

            $scope.showFile = function () {
                $('#filename').val('');
                $('#filename').click();
            };

            $scope.back = function () {
                $scope.$root.$broadcast('getDeviceInfoReList');
                $location.path('/system/device');
            };
        }
    ])
    app.controller('userTreeController', [
        '$scope',
        '$uibModalInstance',
        'items',

        function ($scope, $uibModalInstance, items) {

            $scope.userTree = {
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
                        onClick: function (event, treeId, treeNode) {
                            if (treeNode['isUser']) {
                                $uibModalInstance.close(treeNode);
                            }
                        }
                    }
                },
                tree: {
                    treeNodes: items
                }
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };
        }
    ])
        .controller('deviceSyncController', ['$scope',
            '$rootScope',
            '$filter',
            'iAjax',
            'iMessage',
            '$location',

            /**
             *
             * @param $scope
             * @param $rootScope
             * @param iAjax
             * @param iMessage
             *
             * 同步通道信息Controller
             *
             */

                function ($scope, $rootScope, $filter, iAjax, iMessage, $location) {
                $scope.title = "同步通道";

                $scope.$parent.selectAll = false;
                // $scope.isSnycing = false;
                $scope.isBatchSnycing = false;

                $scope.currentPage = 1;
                $scope.totalPage = 1;
                $scope.pageSize = 10;
                $scope.temp;

                init();

                function init() {
                    getMonitorDeviceItem();
                    getMonitorChannelItem();
                }

                function getMonitorDeviceItem() {
                    var url, data;
                    url = '/security/device.do?action=getSyncDeviceList';
                    data = {
                        filter: {
                            searchtext: $scope.searchDeviceTitle
                        }
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data.result && data.result.rows) {
                                $scope.entityMonitorServerItem = data.result.rows;
                            } else {
                                $scope.entityMonitorServerItem = [];
                            }
                            if (data.result.params) {
                                var params = data.result.params;
                                $scope.totalSize = params.totalSize;
                                $scope.pageSize = params.pageSize;
                                $scope.totalPage = params.totalPage;
                                $scope.currentPage = params.pageNo;
                            }
                        },
                        function (data) {
                        })
                }

                function getMonitorChannelItem(id) {
                    var url, data;
                    url = '/security/device.do?action=getSyncChannelList';
                    data = {
                        filter: {
                            id: id,
                            searchtext: $scope.searchTitle
                        },
                        params: {
                            pageNo: $scope.currentSyncPage,
                            pageSize: $scope.pageSize
                        }
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data.result && data.result.rows) {
                                $scope.entityChannelItem = data.result.rows;
                            } else {
                                $scope.entityChannelItem = [];
                            }

                            if (data.result.params) {
                                var params = data.result.params;
                                $scope.totalSyncSize = params.totalSize;
                                $scope.pageSyncSize = params.pageSize;
                                $scope.totalPage = params.totalPage;
                                $scope.currentSyncPage = params.pageNo;
                            }
                        },
                        function (data) {
                        })
                }

                $scope.showMonitorInfo = function (index) {
                    var id;
                    if ($scope.temp == index) {
                        getMonitorChannelItem();
                        $scope.temp = '';
                    } else {
                        id = $scope.entityMonitorServerItem[index].id;
                        getMonitorChannelItem(id);

                        $scope.temp = index;
                    }
                };

                $scope.singleSync = function (index, mode, hidemodal) {

                    if(!hidemodal) {
                        $('#singleSyncModel').show();
                        $('#singleSyncModel').addClass('in');
                    }

                    //$scope.$parent.isSnycing = false;
                    $scope.$parent.syncEntityItem = [];
                    $scope.$parent.syncMode = '';

                    var id = $scope.entityMonitorServerItem[index].id;

                    var url = '/security/device.do?action=syncMonitorChannelInfo';
                    if(mode == 'same') {
                        $scope.$parent.syncMode = mode;
                        url = '/security/device.do?action=syncSameNameMonitor';
                    } else  if(mode == 'ouinfo') {
                        url = 'security/device.do?action=syncMonitorChannelAndOuInfo'
                    }

                    var data = {
                        filter: {
                            type: 'new',
                            id: [id]
                        }
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data) {
                                if(!hidemodal) {
                                    if (data.result && data.result.rows) {
                                        $scope.$parent.syncEntityItem = data.result.rows[0];
                                        // $scope.$parent.isSnycing = true;
                                    }/* else {
                                        $scope.$parent.syncEntityItem = [];
                                        $scope.$parent.isSnycing = true;
                                    }*/
                                } else {
                                    iMessage.show({
                                        level: 1,
                                        title: '消息提醒',
                                        content: '同步单位及监控成功!'
                                    });
                                }
                            }
                        },
                        function () {
                            iMessage.show({
                                level: 4,
                                title: '消息提醒',
                                content: '网络出错，同步通道查询失败'
                            });
                        });
                };

                $scope.syncBatch = function () {

                    $scope.$parent.isBatchSnycing = false;

                    var id = [];
                    $.each($scope.entityMonitorServerItem, function (index, zrow) {
                        id.push(zrow.id);
                    })

                    var url, data;
                    url = '/security/device.do?action=syncMonitorChannelInfo';
                    data = {
                        filter: {
                            id: id
                        }
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data.result && data.result.rows) {
                                if (data.status == "1") {
                                    $rootScope.syncAllEntityItem = data.result.rows;
                                    $scope.$parent.isBatchSnycing = true;
                                } else {
                                    $rootScope.syncAllEntityItem = [];
                                }
                            }
                        }),
                        function (data) {
                        }
                };

                $scope.searchChannelInfo = function () {
                    getMonitorChannelItem();
                };

                $scope.searchDeviceInfo = function () {
                    getMonitorDeviceItem();
                };

                $scope.back = function () {
                    $scope.$root.$broadcast('getDeviceInfoReList');
                    $location.path('/system/device');
                }

            }
        ]);

    angularAMD.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('system.device.add', {
            url: '/add',
            controller: 'deviceItemController',
            templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        })
            .state('system.device.mod', {
                url: '/mod',
                controller: 'deviceItemController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
            })
            .state('system.device.sync', {
                url: '/sync',
                controller: 'deviceSyncController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/sync.html'
            })
            .state('system.device.export', {
                url: '/export',
                controller: 'deviceItemController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/export.html'
            })
            .state('system.device.import', {
                url: '/import',
                controller: 'deviceItemController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/import.html'
            });
    }]);
});
