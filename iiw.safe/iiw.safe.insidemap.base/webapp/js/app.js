/**
 * Created by dwt on 2015-12-24.
 */
define([
    'app',
    'moment',
    'safe/yjt/js/service/yjtservice',
    'safe/insidemap/js/directives/safeInsidemapPeoplebox',
    'safe/insidemap/js/directives/safeInsidemapControlbox',
    'safe/insidemap/js/directives/safeInfoCard',
    'safe/insidemap/js/directives/safeInsidemapSearchbox',
    'safe/insidemap/js/directives/safeInsidemapAnimation',
    'safe/insidemap/js/directives/safeInfocardTemplate',
    'safe/insidemap/js/directives/safeInfocardPosition',
    'cssloader!safe/insidemap/base/css/index.css'
], function(app, moment) {

    app.controller('safeInsidemapBaseController', ['$scope', '$rootScope', '$timeout', '$compile', '$filter', 'iAjax', 'safeMainTitle', 'safeCamera', 'iMessage', '$stateParams', 'iGetLang', 'yjtService', 'safeHardware', 'safeSound', 'iConfirm', function($scope, $rootScope, $timeout, $compile, $filter, iAjax, safeMainTitle, safeCamera, iMessage, $stateParams, iGetLang, yjtService, safeHardware, safeSound, iConfirm) {
        safeMainTitle.title = '电子地图';

        // safeMap指令直接在iiw.safe.insidemap中加载，无需采用异步加载方式，因为safeMap是模块的强依赖，不可能不存在。
        // yjj at 2017-04-25
        //
        // require(['safe/map/js/directives/safeMap'], function() {
        //     $compile($('.safe-insidemap-view').contents())($scope);
        // }, function() {
        //     $compile($('.safe-insidemap-view').contents())($scope);
        // });

        $scope.type = 'M';          // M->地图; A->区域
        $scope.loading = false;
        $scope.showCom=false;
        $scope.dialect = {
            'PTN_C': iGetLang.get('PTN_C')
        };

        $scope.camera = safeCamera.create({
            scope: $scope,
            toolbar: 8,
            el: '.safe-insidemap-area-info-panel-camera-box'
        });

        $scope.bShowInfoCard = (localStorage.safeMap_bShowInfoCard == undefined || localStorage.safeMap_bShowInfoCard == 'true');
        $scope.setBShowInfoCard = function(value) {
            $scope.bShowInfoCard = value;
            localStorage.safeMap_bShowInfoCard = value;
        };
        $scope.toggleShowInfoCard = function() {
            $scope.setBShowInfoCard(!$scope.bShowInfoCard);
        };

        $scope.$on('map.hideInfoCard', function(e, data) {
            if (data && data['hideInfoCard'] == true) {
                $scope.setBShowInfoCard(false);
            }
        });

        $scope.policeInfo = { // 鼠标经过->显示值班警察信息 2017-10-09 by HJ
            showInfo: false,
            details: {
                imgUrl: '',
                text: {
                    name: '',
                    department: '',
                    duties: '',
                    code: '',
                    innerPhone: '',
                    jwt: '',
                    mobile: ''
                }
            }
        };

        $scope.cameraInfo = {
            isMax: false
        };

        $scope.area = {
            sign: '0',
            mapcode: '',
            mapdtlfk: '',
            areacode: '',
            ouname: '',
            oucode: '',
            roomnum: '',
            devices: [],            // 由地图区域提供的设备列表
            codePeopleView: '0',
            mapbutton: '1',
            refreshPoliceCardCount: 0,

            pInfocard: {
                state: 'L',         // L:加载中，A：自定义信息牌，D：默认信息牌
                templateUrl: ''
            },
            cInfocard: {
                state: 'L',         // L:加载中，A：自定义信息牌，D：默认信息牌
                templateUrl: ''
            },
            positionType: '',

            timeTarget: null,
            hardwareLoading: false,
            hardware: null,
            hardwareCache: [],
            count: [],
            title: '',
            plist: [],
            plistLoading: false,
            areaDynamicInfo: {
                loading: false,
                deviceDayBefore: 0,
                criminalMonthBefore: -1
            },
            isLoadingAreaDynamicInfo: false,
            setMapCode: function(mapCode) {
                this.mapcode = mapCode;
                window.__INSIDEMAP_MAPCODE = mapCode;
            },
            setAreaCode: function(areacode) {
                this.areacode = areacode;
                window.__INSIDEMAP_AREACODE = areacode;
            },
            clearAreaCode: function() {
                this.areacode = '';
                window.__INSIDEMAP_AREACODE = '';
            },
            showAreaInfo: function(areaid, areaname) {
                this.title = areaname;
                if ($scope.type == 'M') {
                    var time = 500,
                        box_w = $('body').width();

                    $scope.loading = true;
                    this.mapbutton = '2';

                    $('.safe-insidemap-view').stop(true).animate({
                        width: box_w / 2
                    }, time);

                    this.hideInfoPanel(time);

                    $('.safe-insidemap-area').stop(true).animate({
                        width: box_w / 2
                    }, time, 'easeOutBack', function() {
                        getAreaInfo(areaid);
                    });
                } else {
                    $scope.loading = true;
                    getAreaInfo(areaid);
                }

                startReceiveMattressStatus();
            },
            showInfoPanel: function(time) {
                if ($scope.bShowInfoCard) {
                    $('.safe-insidemap-info').stop(true).animate({
                        left: 0
                    }, time || 500);
                } else {
                    $('.safe-insidemap-info-slider').stop(true).animate({
                        left: '-75px'
                    }, time || 500);
                }
            },
            hideAreaInfo: function(callback) {
                if ($scope.type == 'A') {
                    var time = 500,
                        box_w = $('body').width();

                    this.clearAreaCode();
                    this.mapbutton = '1';
                    $scope.$broadcast('hideAllFocusShape');

                    $('.safe-insidemap-view').stop(true).animate({
                        width: box_w
                    }, time, function() {
                        $timeout(function() {
                            if (callback) callback();
                        }, 1000);
                    });

                    this.showInfoPanel(time);

                    $('.safe-insidemap-area').stop(true).animate({
                        width: 0
                    }, time, 'easeOutBack', function() {
                        $scope.type = 'M';
                    });

                    if ($scope.camera) {
                        $scope.camera.closeAll();
                    }
                }

                stopReceiveMattressStatus();
            },
            hideInfoPanel: function(time) {
                if ($scope.bShowInfoCard) {
                    var info_w = $('.safe-insidemap-info').width();
                    $('.safe-insidemap-info').stop(true).animate({
                        left: -info_w
                    }, time || 500);
                } else {
                    var info_w = $('.safe-insidemap-info-slider').width();
                    $('.safe-insidemap-info-slider').stop(true).animate({
                        left: -info_w
                    }, time || 500);

                }
            },
            clickControlButton: function(item, event) {

                if (event && event.stopPropagation) {
                    event.stopPropagation();
                }

                switch (item.type) {
                    case 'other_button':
                        $scope.area.clist = $scope.area.hardware;
                        break;
                    case 'back_button':
                        showControllist($scope.area.hardwareCache.pop());
                        if (!$scope.area.hardwareCache.length) {
                            $scope.area.hardwarestatetext = '';
                        }
                        break;
                    default:
                        doHardwareItem(item);
                }
            },
            touchStart: function() {
                this.touchhideInfoPanel = false;
            },
            touchRight: function(e) {
                if ($scope.type == 'A' && e.distance > 500) {
                    this.touchhideInfoPanel = true;
                }
            },
            touchStop: function() {
                if ($scope.type == 'A' && this.touchhideInfoPanel) {
                    $scope.area.hideAreaInfo();
                }
            },
            hardwareCount: function() {
                $scope.area.count = [];

                iAjax.post('security/map/map.do?action=getMapDeviceCount', {
                    filter: {
                        mapfk: this.mapcode
                    }
                }).then(function(data) {
                    if (data && data.result && data.result.rows) {
                        $scope.area.count = data.result.rows;
                    }
                });

                //this.count = [{
                //    name: '监控',
                //    value: 38
                //},{
                //    name: '对讲',
                //    value: 25
                //},{
                //    name: '照明灯',
                //    value: 4
                //},{
                //    name: '广播',
                //    value: 3
                //},{
                //    name: '电视',
                //    value: 20
                //},{
                //    name: '报警按钮',
                //    value: 20
                //},{
                //    name: '手机探测器',
                //    value: 4
                //}];
            },
            loadAreaDynamicInfo: function() {
                if (!$scope.area.areaDynamicInfo.loading) {
                    $scope.area.areaDynamicInfo.loading = true;

                    iAjax.post('/security/map/map.do?action=getMapDtlLog', {
                        filter: {
                            mapdtlfk: $scope.area.mapdtlfk,
                            roomno: $scope.area.roomnum,
                            devicestart: moment().add('day', $scope.area.areaDynamicInfo.deviceDayBefore).startOf('day').format('x'),
                            deviceend: moment().endOf('day').format('x'),
                            criminalstart: moment().add('month', $scope.area.areaDynamicInfo.criminalMonthBefore).startOf('day').format('x'),
                            criminalend: moment().endOf('day').format('x')
                        }
                    }).then(function(data) {
                        if (data && data.result && data.result.rows) {
                            $scope.area.areaDynamicInfo.loading = false;
                            $scope.area.mlist = data.result.rows;
                        }
                    });
                }
            },
            loadMoreAreaInfo: function() {
                $scope.area.areaDynamicInfo.deviceDayBefore -= 1;
                $scope.area.areaDynamicInfo.criminalMonthBefore -= 1;
                $scope.area.loadAreaDynamicInfo();
            }
        };

        $scope.mapDevice = {
            actions: [],
            actionsWidth: 0,
            show: function(actions) {

                $('.insidesafe-map-device-tag-box').show('fade');

                var len = actions.length;

                var w = len * 200,
                    box_w = $('body').width();

                this.actionsWidth = (w < box_w) ? w : box_w;

                $scope.mapDevice.actions = actions;

            },
            hide: function(event) {

                if (event && event.stopPropagation) {
                    event.stopPropagation();
                }

                $('.insidesafe-map-device-tag-box').hide('fade');

            }
        };

        if ($stateParams && $stateParams.data) {
            if ($stateParams.data['fromModule'] == 'alarm') {

                if (window.__INSIDEMAP_MAPCODE) {
                    $scope.area.setMapCode(window.__INSIDEMAP_MAPCODE);
                }
                if (window.__INSIDEMAP_AREACODE) {
                    $scope.area.setAreaCode(window.__INSIDEMAP_AREACODE);
                }

            }
        }

        function startReceiveMattressStatus() {
            iAjax.post('/security/check/check.do?action=getMattressStatus', {filter: {roomno: $scope.area.roomnum}});
        }

        function stopReceiveMattressStatus() {
            iAjax.post('/security/check/check.do?action=stopMattressStatus');
        }

        function getAreaInfo(areaid) {
            $scope.loading = false;
            $scope.type = 'A';
            $scope.area.hardwarestatetext = '';
            $scope.area.id = areaid;
            $scope.area.plist = [];
            $scope.area.mlist = [];
            $scope.area.clist = [];
            $scope.area.areaDynamicInfo.loading = false;

            $scope.area.hardwareLoading = true;
            iAjax.post('security/device/device.do?action=getMapdtlDeviceList', {
                sortName: ['code'],
                sortType: ['asc'],
                filter: {
                    mapdtlfk: areaid
                }
            }).then(function(data) {
                if (data.result.rows) {
                    $scope.area.hardwareLoading = false;

                    var list = data.result.rows,
                        hardware = [],
                        camera = [];

                    if ($scope.area.devices) {
                        var monitors = _.filter($scope.area.devices, {type: 'monitor'});
                        _.each(monitors, function(o) {
                            camera.push(o.id);
                        });
                    }

                    $.each(list, function(i, o) {
                        if (o.type == 'monitor') {
                            //camera.push(o.id);
                        } else if (!(o.type == 'mattress' || o.type == 'imcontrol')) {
                            hardware.push(o);
                        }
                    });

                    if (camera.length) {
                        var size = camera.length;
                        if (camera.length == 3) {
                            size = [[1, 1, 2], [1, 1, 3]];
                        }
                        $timeout(function() {
                            $scope.camera.shows(camera, size);
                        }, 300);
                    } else {
                        $scope.camera.closeAll();
                    }

                    $scope.area.hardware = hardware;

                    var temp = [];
                    if ($scope.area.hardware.length > 3) {
                        temp = $scope.area.hardware.slice(0, 2);
                        temp.push({
                            type: 'other_button',
                            name: '更多'
                        });
                    } else {
                        temp = hardware;
                    }

                    $scope.area.clist = temp;
                }
            });

            $scope.area.plistLoading = true;
            var aRoomnum = $scope.area.roomnum.split('|');

            iAjax.post('security/common/monitor.do?action=getRoomCriminal', {
                filter: {
                    roomno: aRoomnum        // $scope.area.roomnum '03101'
                }
            }).then(function(data) {
                if (data.result.rows) {
                    $scope.area.plistLoading = false;

                    $.each(data.result.rows, function(i, o) {
                        if (o && o.photo) {
                            o.photo = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + (o.photo || o.photo2);
                        } else {
                            o.photo = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + (o.photo || o.photo2) + '&bh=' + o.bm;
                        }
                    });
                    $scope.area.plist = data.result.rows;
                }
            });

            $scope.area.loadAreaDynamicInfo();
        }

        function doHardwareItem(item) {
            if (item.actions) {

                if ((item.type == 'broadcast' || item.type == 'tv') && !item.actionStr && item.action) {
                    $timeout(function() {
                        $scope.mapDevice.show(item.actions);
                    }, 200);
                } else {
                    $scope.area.hardwareCache.push($scope.area.clist);

                    var temp = item.actions;
                    temp = [{type: 'back_button', name: '返回'}].concat(temp);

                    showControllist(temp);
                }

            } else {
                if (item.type == 'broadcast' && item.actionstr == 'setDeviceVolume') {
                    $scope.setBroadcastVolume.show(item);
                } else {
                    safeHardware.execute(item.deviceid, item.type, item.action, item.value);
                }
                //iAjax.post('security/device/device.do?action=executeDeviceAction', {
                //    filter: {
                //        id: item.deviceid,
                //        type: item.type,
                //        action: item.action,
                //        value: item.value
                //    }
                //});
            }
            showHardwareState(item);
        }

        function showControllist(list) {
            if ($scope.area.timeTarget) {
                $timeout.cancel($scope.area.timeTarget);
            }
            $scope.area.clist = [];
            $scope.area.timeTarget = $timeout(function() {
                $scope.area.clist = list;
            }, 500);
        }

        function showHardwareState(item) {
            if (!item.deviceid) {
                $scope.area.hardwarestateid = item.id;

                iAjax.post('security/device/device.do?action=getDeviceStatus', {
                    filter: {
                        id: $scope.area.hardwarestateid
                    }
                }).then(function(data) {
                    if (data.result.rows) {
                        updateStatus(data.result.rows.id, data.result.rows.message);
                    }
                });
            }
        }

        function getCodePeopleView() {
            iAjax
                .post('sys/web/sycode.do?action=getSycode', {filter: {filter: 'DZDTRYXX'}})
                .then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.area.codePeopleView = data.result.rows[0].content;
                    }
                })
        };

        function updateStatus(id, text) {
            if (id == $scope.area.hardwarestateid) {
                if (text) {
                    var item = _.findWhere($scope.area.hardware, {id: id});
                    $scope.area.hardwarestatetext = '　-　' + (item['alias'] || item['name']) + '（状态：' + text + '）';
                } else {
                    $scope.area.hardwarestatetext = '';
                }
            }
        }

        function updateMattressStatus(bm, data) {
            var aFind = $filter('filter')($scope.area.plist, function(row) {
                return (row.bm == data.bm);
            });
            if (aFind && aFind.length > 0) {
                aFind[0].mattressStatus = data;
            }
        }

        /**
         * 广播设备的音量控制
         * @author : zhs
         * @version : 1.0
         * @date : 2017/8/29
         */
        $scope.setBroadcastVolume = {
            action: null,
            show: function(action) {
                this.action = action;

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

                safeHardware.execute(this.action.deviceid, this.action.type, this.action.action, this.action.value);
            },
            close: function(id) {
                iConfirm.close(id);
                return true;
            }
        }

        $scope.showCriminal = function(people, e) {
            if(e) {
                e.stopPropagation();
                if (e.target.className == 'fa fa-commenting-o') {
                    return;
                }
            }

            if (people.sign == 'checkleader') {
                yjtService.show('criminal', people.bm);
            } else {
                iMessage.show({
                    level: '3',
                    title: $scope.dialect['PTN_C'] + '一键通',
                    content: '没有权限查看'
                });
            }
        };

        $scope.commenting = function(people, e) {
            if(e) {
                e.stopPropagation();
            }

            $scope.saveCom={
                people:people.id,
                ctype:'positive',
                evaluationdetailfk:'',
                notes:''
            };

            var postDate = {
                filter: {
                    content: "%",
                    peopletype: 'criminal'
                }
                // remoteip:'192.168.11.39'
            }

            iAjax.post('/security/collection.do?action=getSyuserEvaluation', postDate).then(function(data) {
                if(data.status == '1') {
                    $scope.commentingList = data.result.rows;
                    $.each($scope.commentingList, function (i,o) {
                        $.each(o.details, function (j,p) {
                            if(o.type=='positive'){
                                p.content= p.content+"(加"+ p.score+"分)"
                            }else{
                                p.content= p.content+"(扣"+ p.score+"分)"
                            }
                        })
                    })
                    $scope.showCom=true;
                    $scope.oneAtTime = true;
                }
            });

        }

        $scope.selectCom=function(item,e){
            $.each($scope.commentingList, function (i,o) {
                $.each(o.details,function(j,p){
                    p.selected=false;
                })

            })
            if(e.target.nodeName=="INPUT"){
                e.stopPropagation();
                item.selected=true;
                $scope.saveCom.evaluationdetailfk=item.id;
                return;
            }else{
                if(item.selected){
                    item.selected=false;
                }else{
                    item.selected=true;
                }
            }
            $scope.saveCom.evaluationdetailfk=item.id;
        }

        $scope.saveEvaluation= function () {
            $scope.saveCom.type='criminal';
            iAjax
                .post('/security/collection.do?action=savePeopleEvaluation', $scope.saveCom)
                .then(function(data) {
                    if(data.status == '1') {
                        $scope.closeDetail();
                        iMessage.show({
                            level: '1',
                            title: '行为评价',
                            content: '行为评价信息保存成功！'
                        });
                    }
                })
        }

        $scope.closeDetail = function() {

            $scope.showCom=false;
        }


        $scope.$on('map.mapLoadedEvent', function(e, data) {
            $scope.area.pInfocard.state = 'L';
            $scope.area.cInfocard.state = 'L';

            getInfocardRelation('police', data.syoufk, data.mapfk, function(templateUrl) {
                $scope.area.pInfocard.templateUrl = templateUrl;

                if (!templateUrl) {
                    $scope.area.pInfocard.state = 'D';
                } else {
                    $scope.area.pInfocard.state = 'A';
                }
            });

            getInfocardRelation('criminal', data.syoufk, data.mapfk, function(templateUrl) {
                $scope.area.cInfocard.templateUrl = templateUrl;

                if (!templateUrl) {
                    $scope.area.cInfocard.state = 'D';
                } else {
                    $scope.area.cInfocard.state = 'A';
                }
            });

            $scope.area.oucode = data.syoufk;
            $scope.area.ouname = data.syouName;
            $scope.area.setMapCode(data.mapfk);
            $scope.area.hardwareCount();
            //进入电子地图后调用该接口查询电压、电流信息
            initElectricity();
        });

        function getInfocardRelation(type, syoufk, mapfk, callback) {
            var data = {
                    filter: {
                        type: type,
                        syoufk: syoufk,
                        mapfk: mapfk
                    }
                },
                url = 'security/infocard.do?action=getAppointedInfocard';

            iAjax
                .post(url, data)
                .then(function(data) {
                    if (data && data.result) {
                        if (callback) {
                            callback(data.result.rows);
                        }
                    }
                });
        }

        $scope.$on('map.shapeClickEvent', function(e, data) {
            if (data.type == 'room') {
                $scope.$broadcast('resetMapSize');
                $scope.$broadcast('hideAllFocusShape');
                $scope.$broadcast('showFocusShape', data.id);
                $scope.area.roomnum = data.roomNum;
                $scope.area.mapdtlfk = data.id;
                $scope.area.setAreaCode(data.id);

                // 将地图区域提供的设备保存起来
                $scope.area.devices = data['devices'];
                $scope.area.showAreaInfo(data.id, data.name);
                $scope.area.sign = (data.sign == '1' ? '1' : '0');
            } else {
                if ($scope.type == 'M') {
                    $scope.$broadcast('blowUpShape', data.id);
                    $scope.$broadcast('hideAllFocusShape');
                    $scope.$broadcast('showFocusShape', data.id);
                } else {
                    $scope.area.hideAreaInfo(function() {
                        $scope.$broadcast('blowUpShape', data.id);
                        $scope.$broadcast('hideAllFocusShape');
                        $scope.$broadcast('showFocusShape', data.id);
                    });
                }
                $scope.area.hideInfoPanel();

                $scope.area.mapbutton = '2';
            }
        });

        $scope.$on('map.cancelBlowUp', function() {
            $scope.$broadcast('hideAllFocusShape');
            $scope.area.mapbutton = '1';
            $scope.area.showInfoPanel();
        });

        $scope.$on('map.showCriminalYJT', function(e, data) {
            yjtService.show('criminal', data);
        });

        $scope.$on('safeMainKeydownSpaceEvent', function() {
            if($scope.camera.getSelect() > 0 || $scope.cameraInfo.isMax) {
                var scope = angular.element('.safe-insidemap-area-info-panel-camera-box').find('.safe-video-panel').scope();
                scope.$broadcast('safeMonitorSpaceEvent');
            }
        });

        $scope.searchList = [];
        $scope.$on('globalSearchEvent', function(e, data) {

            if (data.length == 0 || data.trim().length == 0) {
                return;
            }

            var imagePath = (iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=');
            iAjax
                .post('/security/map/map.do?action=getSearchMapDtl', {filter: {searchText: data}})
                .then(function(data) {
                    angular.forEach(data.result.rows, function(v) {
                        if (v.photo) {
                            v.style = {
                                'background-image': 'url(' + (imagePath) + v.photo + ')'
                            }
                        } else {
                            v.style = {
                                'background-image': 'url(' + (imagePath) + v.photo + '&bh=' + v.coding + ')'
                            }
                        }
                    });
                    $scope.searchList = data.result.rows;
                });
        });

        function showDoorInfo(id, data) {
            if (data.type == 'door') {
                var item = _.findWhere($scope.area.devices, {id: id});
                if (item) {
                    if (data.message == '关门' && data.name) {
                        safeSound.play($.soa.getWebPath('iiw.safe') + '/music/msg.mp3');
                        iMessage.show({
                            level: '1',
                            title: data.message + '成功',
                            content: '【' + data.name + '】' + data.message + '成功'
                        });
                    } else if (data.message == '开门' && data.name) {
                        safeSound.play($.soa.getWebPath('iiw.safe') + '/music/msg.mp3');
                        iMessage.show({
                            level: '2',
                            title: data.message + '成功',
                            content: '【' + data.name + '】' + data.message + '成功'
                        });
                    }

                    // 重新获取控制按钮数据
                    iAjax.post('security/device/device.do?action=getMapdtlDeviceList', {
                        sortName: ['code'],
                        sortType: ['asc'],
                        filter: {
                            mapdtlfk: $scope.area.id
                        }
                    }).then(function(data) {
                        if (data.result.rows) {

                            var list = data.result.rows,
                                hardware = [];

                            $.each(list, function(i, o) {
                                if (o.type == 'monitor') {
                                    //camera.push(o.id);
                                } else if (!(o.type == 'mattress' || o.type == 'imcontrol')) {
                                    hardware.push(o);
                                }
                            });

                            $scope.area.hardware = hardware;

                            var temp = [];
                            if ($scope.area.hardware.length > 3) {
                                temp = $scope.area.hardware.slice(0, 2);
                                temp.push({
                                    type: 'other_button',
                                    name: '更多'
                                });
                            } else {
                                temp = hardware;
                            }

                            $scope.area.clist = temp;

                        }
                    });
                }
            }
        };

        $scope.$on('ws.executeHandle', function(e, data) {

            if (data.actions && data.actions.length && data.type != 'talk' && data.change) {

                var showRow = _.where($scope.area.clist, {id: data.id})[0];
                var hideRow = _.where($scope.area.hardwareCache[$scope.area.hardwareCache.length - 1], {id: data.id})[0];

                if (showRow) {
                    showRow.actions = data.actions;
                    showRow.message = data.message;
                } else if (hideRow) {
                    $.each(data.actions, function(i, o) {
                        o.deviceid = data.id;
                    });
                    var deviceid = data.id;
                    //var deviceid = _.where($scope.area.clist, {deviceid: data.actions[0].deviceid})[0];
                    if (deviceid) {
                        var temp = data.actions;
                        temp = [{type: 'back_button', name: '返回'}].concat(temp);

                        showControllist(temp);
                    }
                    hideRow.actions = data.actions;
                    hideRow.message = data.message;

                }
            }

            updateStatus(data.id, data.message);

            showDoorInfo(data.id, data);
        });

        $scope.$on('ws.executeTalkHandle', function(e, data) {
            if(data.type == 'talk') {
                var filter = {
                    filter: data
                };
                iAjax
                    .post('security/alarm/alarm.do?action=executeTalkTheme', filter)
                    .then(function(data) {
                        iAjax.post('security/map/map.do?action=getDeviceInformation', {
                            filter: {
                                devicefk: data.id
                            }
                        }).then(function(data) {
                            if (data && data.result.rows && data.result.rows.length) {
                                var mapinfo = data.result.rows[0];
                                if (mapinfo && !$scope.cameraInfo.isMax) {
                                    $scope.area.setAreaCode(mapinfo.mapdtlfk);
                                    $scope.area.setMapCode(mapinfo.mapfk);
                                }
                            }
                        });
                    })
            }
        });

        $scope.$on('ws.htjrHandle', function(e, data) {
            updateMattressStatus(data.bm, data);
        });

        $scope.$on('safeInfoCardPoliceEvent', function(e, data) {
            yjtService.show('police', data.coding);
        });

        $scope.$on('safeInfoCardPoliceMouseover', function(e, data) {
            data = '' + data +'';

            iAjax.post('/security/information/information.do?action=getPoliceCoding', {
                filter: {
                    coding: data
                }
            }).then(function(data) {
                if (data && data.result.rows && data.result.rows.length) {
                    var policeInfo = data.result.rows[0];

                    policeInfo.photo = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + policeInfo.photo;

                    $scope.policeInfo.details = {
                        imgUrl: policeInfo.photo,
                        text: {
                            name: policeInfo.name,
                            department: policeInfo.syouname,
                            duties: policeInfo.position,
                            code: policeInfo.coding,
                            innerPhone: policeInfo.telephone,
                            jwt: policeInfo.familyphone,
                            mobile: policeInfo.cellphone
                        }
                    };

                    $scope.policeInfo.showInfo = true;

                }
            });

        });

        $scope.$on('safeInfoCardPoliceMouseleave', function() {
            $scope.policeInfo.showInfo = false;
        });

        $scope.$on('ws.talkHandle', function(e, data) {
            console.log('对讲联动SOCKET, ws.talkHandle!!!!');
            if (data && data.deviceid) {
                iAjax.post('security/map/map.do?action=getDeviceInformation', {
                    filter: {
                        devicefk: data.deviceid
                    }
                }).then(function(data) {
                    if (data && data.result.rows && data.result.rows.length) {
                        var mapinfo = data.result.rows[0];
                        if (mapinfo && !$scope.cameraInfo.isMax) {
                            $scope.area.setAreaCode(mapinfo.mapdtlfk);
                            $scope.area.setMapCode(mapinfo.mapfk);
                        }
                    }
                });
            }
        });

        $scope.$on('ws.areaPersonChange', function(e, data) {
            if (data && data.syoufk == $scope.area.oucode) {
                $scope.area.refreshPoliceCardCount++;
            }
        });

        $scope.$on('ws.electricityHandle', function(e, data) {
            if (data && data.length > 0) {
                $.each(data, function(i, o) {
                    if (o.mapfk == $scope.area.mapcode && o.mapdtlfk) {
                        $scope.$broadcast('showCleanAreaMessage', {
                            id: o.mapdtlfk,
                            message: o
                        });
                    }
                });
            }
            /*
             if(data && data.mapfk == $scope.area.mapcode && data.mapdtlfk) {
             $scope.$broadcast('showCleanAreaMessage', {
             id: data.mapdtlfk,
             message: data
             });
             }
             */
        });

        /**
         * 监听socket，获取设备状态，代替 getDeviceStatus 接口
         */
        /*$scope.$on('ws.deviceStatusHandle', function(e, data){
         $scope.area.api.deviceStatusHandle(data);
         });*/

        $scope.$on('safeInsidemapControllerExitEvent', function() {
            if ($scope.camera) {
                $scope.camera.destroy();
            }
            stopReceiveMattressStatus();
        });

        $scope.$on('camera.maxEvent', function() {
            $scope.cameraInfo.isMax = true;
        });

        $scope.$on('camera.minEvent', function() {
            $scope.cameraInfo.isMax = false;
        });

        //接收振动光纤报警的状态消息
        $scope.$on('ws.perimeterHandle', function(e, data) {
            if (data && data.mapdtlfk) {
                var aStatusCss = {
                    '1': 'fa-unlink faa-ring text-warning',
                    '3': 'fa-bell faa-ring text-warning',
                    '4': 'fa-bell faa-ring text-danger',
                    '5': 'fa-code-fork faa-flash text-danger'
                };
                $scope.$broadcast('showAreaStatus', {
                    id: data.mapdtlfk,
                    css: 'animated fa fa-fw ' + aStatusCss[data.state],
                    message: data.statecn || ''
                });
            }
        });

        $scope.$on('yjt.showPanel', function() {
            var scope = angular.element('.safe-insidemap-area-info-panel-camera-box').find('.safe-video-panel').scope();
            if(scope && scope.imcsPlayer) {
                scope.imcsPlayer.pause();
            }
        });

        $scope.$on('yjt.closePanel', function() {
            var scope = angular.element('.safe-insidemap-area-info-panel-camera-box').find('.safe-video-panel').scope();
            if(scope && scope.imcsPlayer) {
                scope.imcsPlayer.restore();
            }
        });

        function initElectricity() {
            var url = 'security/alarm/alarm.do?action=initElectricityVoltage';
            iAjax.post(url);
        }

        getCodePeopleView();

    }]);
});
