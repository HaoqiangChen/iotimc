/**
 * Created by yjj on 2016-03-22.
 */
define([
    'app',
    'safe/hardware/list/js/directives/safeHardwareListCheck',
    'safe/monitorcenter/js/directives/safeMonitorcenterMapTouch',
    'cssloader!safe/hardware/list/css/index',
    'cssloader!safe/monitorcenter/css/index.css'
], function (app) {

    app.controller('hardwareListController', [
        '$scope',
        '$state',
        '$filter',
        'iAjax',
        'safeMapSelect',
        'safeMainTitle',
        'safeGlobalSearch',
        'safeHardware',
        'iConfirm',

        function($scope, $state, $filter, iAjax, safeMapSelect, safeMainTitle, safeGlobalSearch, safeHardware, iConfirm) {

            if(!$scope.$parent.active) {
                $state.go('safe.hardware');
                return;
            }

            if($scope.$parent.active.start) {
                iAjax.post($scope.$parent.active.start);
            }

            safeGlobalSearch.clean();
            $scope.globalSearch = safeGlobalSearch.get();
            //$scope.globalSearchFilter = function(value) {
            //    return ((value.name && value.name.indexOf($scope.globalSearch.value)) != -1 ||
            //            (value.ip && value.ip.indexOf($scope.globalSearch.value) != -1) ||
            //            (value.status && value.status.indexOf($scope.globalSearch.value) != -1));
            //};

            safeMainTitle.title = $scope.$parent.active.name + '控制中心';

            $scope.list = [];
            // $scope.listSize = 15;
            $scope.controlButtons = [];
            $scope.isrun = false;
            $scope.cascade = true;
            $scope.loadState = 'O';

            $scope.listStyle = [
                'primary',
                'info',
                'success',
                'warning',
                'default',
                'danger'
            ];

            $scope.hardware = {
                deviceAction: [],
                value: '',
                isGroup: null,
                company: [],
                filter: {
                    company: '',
                    searchFilter: ''
                }
            };

            function getSycode(){
                iAjax.post('sys/web/sycode.do?action=getSycode', {filter: {filter:'DeviceGroupControl'}}).then(function(data) {
                    if(data && data.result.rows) {
                        if(data.result.rows.length > 0){
                            $scope.hardware.isGroup = data.result.rows[0].content;
                        }
                    }
                });
            }

            $scope.page = {
                pageNo: 1,
                pageSize: 10,
                totalPage: 1,
                totalSize: 0,
                last: false,
                // startPost: false
            };

            $scope.map = {
                object: null,
                select: {},

                init: function() {
                    iAjax.post('security/device/device.do?action=getMapOuActionList', { filter: { type: $scope.$parent.active.type, cascade: ($scope.cascade ? 'Y' : 'N') } }).then(function(data) {
                        if(data.result.rows) {
                            var mapSelect = safeMapSelect.create({
                                scope: $scope,
                                el: '.safe-monitorcenter-map-panel',
                                data: data.result.rows,
                                showtext: true
                            });

                            $scope.map.object = mapSelect;

                            mapSelect.on('select', function(data) {
                                $scope.map.select = data;
                                if(data.type == 'map') {
                                    $('.safe-monitorcenter-map-panel').stop(true).animate({
                                        width: 0,
                                        height: 0
                                    }, 'normal', function() {
                                        $(this).hide();
                                    });
                                    $('.safe-monitorcenter-map-mask').hide();
                                }
                                $scope.search();
                            });

                            mapSelect.init();
                        }
                    });
                }
            };

            $scope.getHardWareList = function(event) {
                if(event.keyCode == 13) {
                    $scope.search();
                }
            };

            $scope.getList = function() {
                $scope.list = [];
                // $scope.listSize = 15;
                $scope.controlButtons = [];
                $scope.isrun = false;
                $scope.loadState = 'O';

                $scope.selectCount = 0;

                if(!$scope.cascade) {
                    $scope.map.select.on2 = '';
                    $scope.map.select.off2 = '';
                    iAjax.post('security/device/device.do?action=getMapOuActionList', {
                        filter: {
                            type: $scope.$parent.active.type,
                            syoufk: $scope.map.select.id,
                            mapfk: $scope.map.select.id,
                            queryType: $scope.map.select.type == 'ou' ? 'ou' : 'map',
                            cascade: 'N'

                        }
                    }).then(function(data) {
                        if(data.result.rows && data.result.rows.length) {
                            var row = _.findWhere(data.result.rows, { id: $scope.map.select.id });
                            if(row) {
                                $scope.map.select.on2 = (row.on || 0) + '';
                                $scope.map.select.off2 = (row.off || 0) + '';
                            }
                        }
                    });
                } else {
                    $scope.map.select.on2 = '';
                    $scope.map.select.off2 = '';
                }

                // $scope.page.startPost = true;
                iAjax.post('security/device/device.do?action=getDeviceActionOuList', {
                    filter: {
                        type: $scope.$parent.active.type,
                        syoufk: $scope.map.select.id,
                        mapfk: $scope.map.select.id,
                        queryType: $scope.map.select.type == 'ou' ? 'ou' : 'map',
                        cascade: $scope.cascade ? 'Y' : 'N',
                        searchText: $scope.hardware.filter.company,
                        searchFilter: $scope.hardware.filter.searchFilter
                    },
                    params: {
                        pageNo: $scope.page.pageNo,
                        pageSize: $scope.page.pageSize
                    }
                }).then(function(data) {

                    // $scope.page.startPost = false;
                    if(data.result && data.result.rows) {
                        // if($scope.page.pageNo > 1) {
                        //     $scope.list = _.union($scope.list, data.result.rows);
                        // } else {
                        //     $scope.list = data.result.rows;
                        // }
                        $scope.list = data.result.rows;

                        if (!$scope.list.length) { $scope.loadState = 'P'; }

                        if (data.result.params) {
                            $scope.page.totalPage = data.result.params.totalPage;
                            $scope.page.totalSize = data.result.params.totalSize;
                        }

                        if(($scope.page.totalSize / ($scope.page.pageNo * $scope.page.pageSize)) <= 1) {
                            $scope.page.last = true;
                        }
                    }

                    //var actions = [];
                    //
                    //for(var i=0; i<60; i++) {
                    //    actions.push({
                    //        name: '超级长度名字超级长度名字超级长度名字超级长度名字' + i
                    //    });
                    //}
                    //
                    //$.each($scope.list, function(i, row) {
                    //    row.actions = [{
                    //        name: '银屏播放',
                    //        actions: actions
                    //    }];
                    //});

                    //$scope.loadState = 'P';
                }, function() {
                    // $scope.page.startPost = false;
                });
            };

            $scope.nextPage = function() {
                //if(!$scope.page.startPost &&  ($scope.page.totalSize / ($scope.page.pageNo * $scope.page.pageSize)) > 1) {
                if($scope.page.pageNo < $scope.page.totalPage) {
                    $scope.page.pageNo++;
                    $scope.getList();
                }

            };

            $scope.search = function() {
                $scope.page.pageNo = 1;
                $scope.getList();
            }

            $scope.checkall = function(ischeck) {
                var templist = $filter('filter')($scope.list, $scope.globalSearch.value);
                $.each(templist, function(i, o) {
                    o.check = ischeck;
                });
                onSelect();
            };


            $scope.clickRow = function(e, row) {
                if(e.target.tagName != 'BUTTON') {
                    row.check = !row.check;
                    onSelect();
                }
            };


            function onSelect() {
                var list = _.where($scope.list, { check: true});
                $scope.controlButtons = [];

                $.each(list, function(i, o) {
                    if(o.actions) {
                        $.each(o.actions, function(i, o) {
                            if(!_.findWhere($scope.controlButtons, {action: o.action})) {
                                $scope.controlButtons.push(o);
                            }
                        });
                    }
                });

                $scope.selectCount = list.length;
            }


            $scope.control = function(control, row, callback) {
                if(!control.actions) {
                    row.result = '发送中……';
                    row.state = 'R';
                    row.isrun = true;

                    safeHardware.execute(control.deviceid, control.type, control.action, (control.value == 0 ? 0 : (control.value || ''))).then(function(data) {
                        if(data.result && data.result.rows) {
                            if(data.result.rows.sendResult == 'FAIL') {
                                row.result = '执行失败！';
                                row.title = data.message;
                                row.state = 'E';
                                row.isrun = false;
                            } else {
                                row.result = '执行成功！';
                                row.title = '';
                                row.state = 'S';
                                row.isrun = false;
                            }
                        } else {
                            row.result = '发送成功！';
                            row.title = '';
                            row.state = 'S';
                            row.isrun = false;
                        }

                        if(callback) callback();
                    }, function(data) {
                        row.result = '发送失败！';
                        row.title = data.message;
                        row.state = 'E';
                        row.isrun = false;

                        if(callback) callback();
                    });
                } else {
                    $scope.isbatch = false;
                    showButtons(control.actions, row);
                }
            };


            $scope.controls = function(control) {
                if(!control.actions) {
                    var list = _.where($scope.list, { check: true});
                    var queue = [];

                    if(control.sign == 1) {
                        // 批量操作
                        var ids = [], rows = [];
                        $.each(list, function(i, row) {
                            if(row.actions) {
                                var c = _.findWhere(row.actions, {action: control.action});
                                if(c) {
                                    row.result = '发送中……';
                                    row.state = 'R';
                                    row.isrun = true;

                                    ids.push(c.deviceid);
                                    rows.push(row);
                                }
                            }
                        });

                        safeHardware.execute(ids, control.type, control.action, (control.value == 0 ? 0 : (control.value || ''))).then(function() {
                            $.each(rows, function(i, row) {
                                row.result = '发送成功！';
                                row.title = '';
                                row.state = 'S';
                                row.isrun = false;
                            });
                        }, function(data) {
                            $.each(rows, function(i, row) {
                                row.result = '发送失败！';
                                row.title = data.message;
                                row.state = 'E';
                                row.isrun = false;
                            });
                        });
                    } else {
                        $.each(list, function(i, row) {
                            if(row.actions) {
                                var c = _.findWhere(row.actions, {action: control.action});
                                if(c) {
                                    var newControl = $.extend({}, control);
                                    newControl.deviceid = c.deviceid;
                                    queue.push({
                                        control: newControl,
                                        row: row
                                    });
                                    row.result = '等待中……';
                                    row.state = 'W';
                                    row.isrun = true;
                                }
                            }
                        });
                        $scope.isrun = true;
                        //run(queue);
                        batChRun(queue);
                    }

                } else {
                    $scope.isbatch = true;
                    showButtons(control.actions);
                }
            };


            function showButtons(actions, row) {
                $scope.isactions = true;
                $scope.actions = actions;
                $scope.actionsRow = row;

                var w = $scope.actions.length * 200,
                    box_w = $('body').width();

                $scope.actionsWidth = (w < box_w) ? w : box_w;
            }


            $scope.doActions = function(event, control) {
                //event.stopPropagation();

                if(!control.actions) {
                    if(!$scope.isbatch) {
                        $scope.control(control, $scope.actionsRow);
                    } else {
                        $scope.controls(control);
                    }

                    $scope.isactions = false;
                } else {
                    showButtons(control.actions, $scope.actionsRow);
                }
            };


            $scope.toggleDoAction = function(event) {
                if(event && event.target.tagName == 'BUTTON') {
                    return;
                }
                $scope.isactions = false;
            };

            /*
            function run(queue) {
                if(queue.length && $scope.isrun) {
                    $scope.runCount = $scope.selectCount - queue.length;
                    var object = queue.shift();
                    $scope.control(object.control, object.row, function() {
                        run(queue);
                    });
                } else {
                    $scope.isrun = false;
                }
            }
            */

            function batChRun(queue) {
                if(queue.length && $scope.isrun) {
                    $scope.runCount = 0;
                    $.each(queue, function(i, object) {
                        $scope.control(object.control, object.row, function() {
                            $scope.runCount++;

                            if($scope.runCount == $scope.selectCount) {
                                $scope.isrun = false;
                            }
                        });
                    });
                }
            }

            /**
             * 广播音量控制
             * @author : zhs
             * @version : 1.0
             * @date : 2017/8/25
             */
            $scope.setBroadcastVolume = {
                model: 'single', // single - 单选， multi - 批量操作
                action: null,
                row: null,
                show: function(action, row, model) {
                    this.action = action;
                    this.row = row;
                    this.model = model;

                    iConfirm.show({
                        scope: $scope,
                        title: '音量控制',
                        templateUrl: $.soa.getWebPath('iiw.safe.hardware.list') + '/view/broadcastVolumeConfirm.html',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'setBroadcastVolume.confirm'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'setBroadcastVolume.close'
                        }]
                    });
                    $('#volume').focus();
                },
                confirm: function(id) {
                    iConfirm.close(id);

                    this.action.value = $('#volume')[0].value;

                    if(this.model == 'single') {
                        $scope.control(this.action, this.row);
                    } else {
                        $scope.controls(this.action);
                    }
                },
                close: function(id) {
                    iConfirm.close(id);
                    return true;
                }
            }

            $scope.setCascade = function() {
                $scope.search();
            };


            $scope.exit = function() {
                safeMainTitle.title = '设备控制中心';
                $state.go('safe.hardware');
            };


            // $scope.$on('globalSearchEvent', function(event, value) {
            //     $scope.checkall(false);
            //     $scope.listSearch = value;
            // });


            $scope.$on('ws.executeHandle', function(e, data) {
                var row = _.findWhere($scope.list, {id: data.id});
                if(row) {
                    row.status = data.message;
                }

                if(data.actions && data.actions.length && data.change && row && row.actions && data.type != 'talk') {

                    row.actions = data.actions;

                }
            });

            /*
            function updateStatus(id, text) {
                var row = _.findWhere($scope.list, {id: id});
                if(row) {
                    row.status = text;
                }
            }
            */

            $scope.$on('hardwareListControllerExitEvent', function() {
                $scope.isrun = false;

                if($scope.$parent.active.stop) {
                    iAjax.post($scope.$parent.active.stop);
                }
            });


            $scope.orderList = function(fieldName) {
                $scope.listOrderValue = fieldName;
                $scope.listOrderReverse = !$scope.listOrderReverse;
            };

            $scope.$on('hardwareListControllerOnEvent', function() {
                $scope.map.init();
                getCompany();
                getSycode();
            });

            $scope.$on('globalSearchEvent', function(event, data){

                $scope.hardware.filter.searchFilter = data;
                $scope.getList();
            });

            //获取厂商
            function getCompany(){
                iAjax.post('security/device/device.do?action=getTypeCompanys', {
                    filter: {
                        type: $scope.$parent.active.type
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.hardware.company = data.result.rows;
                    }
                });
            }

            /**
             * 跳转到设备分组页面
             * @author : zhs
             * @version : 1.0
             * @date : 2018-06-26
             */
            $scope.goHardwareGroup = function() {
                var params = {
                    data: {
                        ou: $scope.map.select,
                        type: $scope.$parent.active.type,
                        devices: _.where($scope.list, { check: true})
                    }
                }
                $state.params = params;
                $state.go('safe.hardware.group', params);
            }

            /**
             * @title: 新增特殊业务处理--YC
             * @method: 后台管理中配置相关业务类型
             * @param:  0->不启用；1->启用；
             * @author: hj
             * @Date: 2018-03-13
             */
            checkYCSpecial();

            $scope.ycSpecial = false;

            function checkYCSpecial(callback) {
                var url = 'security/common/monitor.do?action=getSycodeDetail',
                    requestData = {
                        filter: {
                            type: 'islinkcolor'
                        }
                    };

                iAjax.post(url,requestData ).then(function(data) {
                    if (data && data.result.rows) {
                        if(data.result.rows == 1){
                            $scope.ycSpecial = true;
                        }else {
                            $scope.ycSpecial = false;
                        }
                    }

                    if(callback){
                        callback($scope.ycSpecial);
                    }
                });
            }
    }]);
});
