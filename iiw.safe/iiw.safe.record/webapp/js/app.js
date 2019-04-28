/**
 * Created by YJJ on 2015-12-10.
 */
define([
    'app',
    'moment',
    'safe/js/services/safeImcsPlayer',
    'safe/monitorcenter/js/directives/safeMonitorcenterCameralist',
    'safe/monitorcenter/js/directives/safeMonitorcenterMapTouch',
    'safe/monitorcenter/js/services/safeMonitorcenterMapSelect',
    'safe/monitorcenter/js/directives/safeMonitorcenterTree',
    'safe/record/js/directives/safeRecordTimeFile',
    'safe/record/js/services/safeRecordDownload',
    'cssloader!safe/monitorcenter/css/index',
    'cssloader!safe/record/css/index',
    'cssloader!safe/record/css/font/digital7mono/digital7mono'
], function(app, moment) {
    app.controller('safeRecordController', ['$scope', '$rootScope', '$interval', '$filter', 'iAjax', 'safeCamera', 'safeImcsPlayer', 'safeMainTitle', 'safeMapSelect', 'safeMonitorcenterMapSelect', 'safeGlobalSearch', 'safeRecordDownload', '$state', '$stateParams','$location','iConfirm', function($scope, $rootScope, $interval, $filter, iAjax, safeCamera, safeImcsPlayer, safeMainTitle, safeMapSelect, safeMonitorcenterMapSelect, safeGlobalSearch, safeRecordDownload, $state, $stateParams,$location,iConfirm) {
        safeMainTitle.title = '录像中心';
        var eFly = $('.safe-record-download-fly');



        // $scope.isPlay = false;
        $scope.backStatus = '';
        if ($stateParams && $stateParams.data) {
            $scope.backStatus = $stateParams.data;
        }

        safeGlobalSearch.clean();
        $scope.cameraListSearch = safeGlobalSearch.get();

        // 判断是否启用 imcs 模式播放录像
        $scope.isImcs = safeImcsPlayer.isconnect();
        $scope.$on('camera.init.imcsplayer', function() {
            $scope.isImcs = true;
        });

        $scope.leftTreeType;                                // N->块状模式；O->传统监控树模式；
        if (window.localStorage) {
            $scope.leftTreeType = window.localStorage.getItem('IMC_SAFE_MONITORCENTER_LAYOUT') || 'N';
        }

        $scope.tree = {
            originalData: null,
            data: [],
            cameraId: null,
            sign: '0',

            init: function() {
                this.data = [];

                // 判断是否启用新接口，在系统字典进行配置
                iAjax.post('security/common/monitor.do?action=getSycodeDetail', {
                    filter: {
                        type: 'newmonitortree'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.tree.sign = data.result.rows;
                        if(data.result.rows == '0') {
                            // 旧接口
                            $scope.tree.getTreeList();
                        } else {
                            // 新接口
                            $scope.tree.getImproveTreeList();
                        }
                    } else {
                        $scope.tree.getTreeList();
                    }
                }, function () {
                    $scope.tree.getTreeList();
                });
            },

            getTreeList: function() {
                iAjax.post('security/check/check.do?action=getMapOuTreeList', {filter: {cascade: 'Y'}}).then(function(data) {
                    if (data.result && data.result.rows && data.result.rows.length) {
                        var list = data.result.rows;
                        $.each(list, function(i, row) {
                            switch (row.type) {
                                case 'map':
                                    row.tree_index = '1' + row.code;
                                    countOnOff(row);
                                    break;
                                case 'ou':
                                    row.tree_index = '2' + row.code;
                                    countOnOff(row);
                                    break;
                                case 'none':
                                    row.tree_index = '3' + row.code;
                                    countOnOff(row);
                                    break;
                                case 'monitor':
                                    row.tree_index = '4' + row.code;
                                    row.name = row.alias || row.name;
                                    row.icon = 'fa-video-camera ' + ((row.islink && row.islink == 'Y') ? 'text-info safe-monitorcenter-treeview-camera-text' : 'text-muted');
                                    break;
                                default:
                                    row.tree_index = 5;
                            }
                        });

                        function countOnOff(row) {
                            if (row.oline || row.off) {
                                row.name += '（' + row.oline + '/' + (row.oline + row.off) + '）';
                            }
                        }

                        $scope.tree.originalData = $.extend(true, [], list);
                        $scope.tree.data = list;

                        $scope.query.init();
                    }
                });
            },

            getImproveTreeList: function() {
                iAjax.post('security/check/check.do?action=getImproveMapOuTreeList', {
                    filter: {
                        cascade: 'Y'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        var list = data.result.rows;

                        if ($scope.tree.originalData) {
                            $scope.tree.originalData.push(list);
                        } else {
                            $scope.tree.originalData = $.extend(true, [], list);
                        }

                        $scope.tree.data = list;
                    }
                });
            },

            load: function() {
                var tops = _.where($scope.tree.data, {__istop: true});
                $.each(tops, function(i, top) {
                    top.icon = 'fa-home text-warning';
                });
            },

            clickNode: function(node) {
                if (node.type == 'monitor') {
                    $scope.camera.showCamera(node.id);
                }
            },

            panStart: function() {
                this.cameraId = null;
            },

            panMove: function(e, node) {
                if (node.type == 'monitor') {
                    if (e.distance > 100 && e.direction == 4) {
                        this.cameraId = node.id;
                    } else {
                        this.cameraId = null;
                    }
                }
            },

            panEnd: function(e, node) {
                if (node.type == 'monitor') {
                    var p = e.center;
                    var target = document.elementFromPoint(p.x, p.y);
                    if (target.localName == 'canvas' || target.localName == 'video') {
                        target = target.parentElement;
                    }
                    if (target && target.localName == 'safe-video') {
                        $scope.camera.object.setSelectIndex(parseInt($(target).attr('index')));
                    }
                    if (this.cameraId) {
                        $scope.camera.showCamera(this.cameraId);
                    }
                }
            },

            keydown: function(e) {
                switch (e.keyCode) {
                    case 13:
                        this.search();
                        break;
                    case 27:
                        $scope.cameraListSearch.value = '';
                        this.search();
                        break;
                }
            },

            search: function() {
                if ($scope.cameraListSearch.value) {
                    var temp = [];

                    if($scope.tree.sign == '0') {
                        var nodes = $filter('filter')($.extend(true, [], $scope.tree.originalData), {
                            name: $scope.cameraListSearch.value,
                            type: 'monitor'
                        });
                        $.each(nodes, function (i, node) {
                            node.parentid = 'tree_view_search_top';
                            if (!_.findWhere(temp, {id: node.id})) {
                                temp.push(node);
                            }
                        });

                        temp.push({
                            id: 'tree_view_search_top',
                            name: '搜索结果（' + temp.length + '）'
                        });

                        $scope.tree.data = temp;
                    } else {
                        iAjax.post('security/device.do?action=getDevice', {
                            filter: {
                                company: '',
                                searchText: $scope.cameraListSearch.value,
                                type: 'monitor'
                            }
                        }).then(function(data) {
                            if(data.result && data.result.rows) {
                                temp = data.result.rows;

                                $.each(temp, function(i, node) {
                                    node.parentid = 'tree_view_search_top';
                                });

                                temp.push({
                                    id: 'tree_view_search_top',
                                    name: '搜索结果（' + temp.length + '）'
                                });

                                $scope.tree.data = temp;
                            }
                        });
                    }
                } else {
                    $scope.tree.data = $.extend(true, [], $scope.tree.originalData);
                }
            }
        };

        $scope.map = {
            object: null,
            select: null,

            init: function() {
                // 判断是否启用新接口，在系统字典进行配置
                iAjax.post('security/common/monitor.do?action=getSycodeDetail', {
                    filter: {
                        type: 'newmonitortree'
                    }
                }).then(function(data) {
                    if(data.result && data.result.rows) {
                        if(data.result.rows == '0') {
                            // 旧接口
                            $scope.map.getOuList();
                        } else {
                            // 新接口
                            $scope.map.getImproveOuList();
                        }
                    } else {
                        $scope.map.getOuList();
                    }
                }, function() {
                    $scope.map.getOuList();
                });
            },
            getOuList: function() {
                iAjax.post('security/common/monitor.do?action=getMapOuList', {
                    filter: {
                        cascade: 'Y'
                    }
                }).then(function(data) {
                    if (data.result.rows) {
                        var mapSelect = safeMapSelect.create({
                            scope: $scope,
                            el: '.safe-monitorcenter-map-panel',
                            data: data.result.rows,
                            showtext: true
                        });

                        $scope.map.setMapSelect(mapSelect);
                    }
                });
            },
            getImproveOuList: function() {
                var mapSelect = safeMonitorcenterMapSelect.create({
                    scope: $scope,
                    el: '.safe-monitorcenter-map-panel',
                    showtext: true
                });

                $scope.map.setMapSelect(mapSelect);
            },
            setMapSelect: function (mapSelect) {
                $scope.map.object = mapSelect;

                mapSelect.on('select', function(data) {
                    $scope.map.select = data;
                    if (data.type == 'map') {
                        $('.safe-monitorcenter-map-panel').stop(true).animate({
                            width: 0,
                            height: 0
                        }, 'normal', function() {
                            $(this).hide();
                        });
                        $('.safe-monitorcenter-map-mask').hide();
                    }
                    $scope.camera.getList(data.id, (data.type == 'ou') ? 'O' : 'M');
                });

                mapSelect.init();
            }
        };

        $scope.camera = {
            list: [],                       // 当前地图（单位）的监控列表
            object: null,                   // 监控对象
            onescreen: true,
            control: 'D',
            screen: 4,
            snapshot: function() {
                this.object.snapshot(1);
            },
            layout: [
                {
                    text: '单画面',
                    value: 1
                }, {
                    text: '四画面',
                    value: 4
                }
            ],
            csMode: (!window.__IIWHOST ? false : true),
            aPlayBackSpeed: (!window.__IIWHOST && !$scope.isImcs) ?
                ["1/4x", "1/2x", "1x", "2x", "4x"] :
                ["1/16x", "1/8x", "1/4x", "1/2x", "1x", "2x", "4x", "8x", "16x"],
            curSpeed: '1x',

            init: function() {
                var camera = safeCamera.create({
                    scope: $scope,
                    type: '1',
                    maxsize: 9,
                    keeplast: false,
                    toolbar: 7,
                    el: '.safe-record-camera'
                });
                this.object = camera;
                this.setLayout();

                camera.recordCallbackFN(function(e) {
                    if (e.data) {
                        var s = e.data.split(',');
                        /*switch (s[0]) {
                            case 'play':
                                $scope.query.state = 1;
                                break;
                            case 'pause':
                            case 'oneframe':
                                $scope.query.state = 2;
                                break;
                        }*/
                        _.each($scope.query.list, function(o, i) {
                            if(o.id == e.devicefk) {
                                o.state = s[0] == 'play' ? 1 : 2
                                o.now = parseInt(s[3]);
                            }
                        });
                    }

                    $scope.camera.curSpeed = s[1];

                    var now = parseInt(s[3]);
                    $scope.query.now = now;
                    $scope.query.moveline(now);

                    if (parseInt(s[4]) >= 100 || now >= $scope.query.endtime) $scope.query.stop();
                });

                camera.on('select', function(index) {
                    var playlist = $scope.camera.object.getplays();
                    $.each(playlist, function(i, id) {
                        if (id) {
                            if (i + 1 != index) {
                                $scope.camera.object.closeSound(i + 1);
                            } else {
                                $scope.camera.object.openSound(index);
                            }
                        }
                    });
                });

            },

            getList: function(id, type) {
                var url, data;
                data = {
                    filter: {
                        type: 'monitor',
                        cascade: 'Y'
                    }
                };
                if (type == 'O') {
                    url = 'security/common/monitor.do?action=getDeviceOuList';
                    if (id) {
                        data['filter']['syoufk'] = id;
                    }
                } else {
                    url = 'security/common/monitor.do?action=getDeviceList';
                    if (id) {
                        data['filter']['mapfk'] = id;
                    }
                }
                iAjax
                    .post(url, data)
                    .then(function(data) {
                        $scope.camera.size = 20;
                        $scope.camera.list = data.result.rows;

                        $.each($scope.camera.list, function(i, row) {
                            formatBackground(row, 'snapshot');
                        });
                    });

                function formatBackground(object, attrName) {
                    if (object[attrName]) {
                        if (!object.css) object.css = {};
                        object.css['background-image'] = 'url(' + iAjax.formatURL(object[attrName]) + ')';
                    }
                }
            },

            setLayout: function() {
                if (this.onescreen) {
                    this.screen = 1;
                } else {
                    this.screen = 4;
                }
                this.object.layout(this.screen);

                // this.setQueryList();
                $scope.query.stopAll();
                // this.object.closeAll();
            },

            setQueryList: function() {
                $scope.query.count = 0;
                $scope.query.list = new Array(this.screen);
                $.each($scope.query.list, function(i) {
                    $scope.query.list[i] = {
                        index: i
                    };
                });
            },

            search: function(item) {
                if($scope.cameraListSearch.value) {
                    return (item.name.indexOf($scope.cameraListSearch.value) > -1) || (item.notes && (item.notes.indexOf($scope.cameraListSearch.value) > -1));
                }

                return true;
            },

            showCamera: function(id) {
                // this.object.autoPicture(id);
                $scope.query.search(id);
            },

            reloadSize: function() {
                this.size += 20;
                if (this.size > this.list.length) {
                    this.size = this.list.length;
                }
            },

            /*setSpeed: function(speed) {
                var playlist = $scope.camera.object.getplays();
                $.each(playlist, function(i, id) {
                    if (id) {
                        $scope.camera.object.recordSetSpeed(i + 1, speed);
                    }
                });
            },*/
            setSpeedByMode: function(mode) {
                var i = $scope.camera.aPlayBackSpeed.indexOf($scope.camera.curSpeed);
                if (i != -1) {
                    if (mode == 'multiply') {
                        if(i < $scope.camera.aPlayBackSpeed.length - 1) {
                            i += 1;
                        }
                    } else {
                        if(i > 0) {
                            i -= 1;
                        }
                    }
                }
                var newSpeed = $scope.camera.aPlayBackSpeed[i];

                var index = $scope.camera.object.getSelect();
                if(index > 0) {
                    $scope.camera.object.recordSetSpeed(index, newSpeed);
                } else {
                    _.each($scope.query.list, function(row, i) {
                        if (row && row.id) {
                            $scope.camera.object.recordSetSpeed(i + 1, newSpeed);
                        }
                    });
                }
            },
            playoneframe: function() {
                var index = $scope.camera.object.getSelect();
                if(index > 0) {
                    $scope.camera.object.playoneFrame(index);
                    $scope.query.list[index - 1]['state'] = 2;
                } else {
                    _.each($scope.query.list, function(row, i) {
                        if (row && row.id) {
                            $scope.camera.object.playoneFrame(i + 1);
                            $scope.query.list[i]['state'] = 2;
                        }
                    });
                }

                $scope.query.state = 2;
            },

            // 隐藏所有
            hideAll: function() {
                var scope = angular.element('.safe-record-camera .safe-video-panel').scope();
                if(scope && scope.imcsPlayer) {
                    scope.imcsPlayer.pause();
                }
            },

            // 显示所有
            showAll: function() {
                var scope = angular.element('.safe-record-camera .safe-video-panel').scope();
                if(scope && scope.imcsPlayer) {
                    scope.imcsPlayer.restore();
                }
            }
        };

        $scope.query = {
            now: null,
            pauseTime: null,
            state: 0,           // 0 -> stop, 1 -> play, 2 -> pause, 3 -> loading
            list: [],
            step: 6,
            count: 0,
            //start: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm'),
            start: moment().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
            end: moment().format('YYYY-MM-DD HH:mm'),
            starttime: 0,
            endtime: 0,
            timelist: [],
            timeline: function() {
                var length = this.endtime - this.starttime;

                this.timelist = new Array(this.step);

                var that = this;
                $.each(this.timelist, function(i) {
                    that.timelist[i] = that.starttime + length / 6 * i;
                });
            },
            init: function() {
                console.log($scope.backStatus);
                if ($scope.backStatus) {
                    this.starttime = moment($scope.backStatus.start)._d.getTime();
                    this.endtime = moment($scope.backStatus.end)._d.getTime();
                    this.now = this.starttime;

                    // 若启用imcs的录像模式，时间间隔最长为90天，否则间隔最长为原有的1天
                    var period = $scope.isImcs ? 90 : 1;

                    if (this.endtime < this.starttime || this.endtime - this.starttime > period * 24 * 60 * 60 * 1000) {
                        this.end = moment(this.starttime).add(1, 'days').format('YYYY-MM-DD HH:mm');
                        this.endtime = moment(this.end)._d.getTime();
                    }
                    // this.stop();
                    this.timeline();
                    this.search($scope.backStatus.id);
                    // this.search();
                }
            },
            getData: function() {
                this.starttime = moment(this.start)._d.getTime();
                this.endtime = moment(this.end)._d.getTime();
                this.now = this.starttime;

                // 若启用imcs的录像模式，时间间隔最长为90天，否则间隔最长为原有的1天
                var period = $scope.isImcs ? 90 : 1;

                if (this.endtime < this.starttime || this.endtime - this.starttime > period * 24 * 60 * 60 * 1000) {
                    this.end = moment(this.starttime).add(1, 'days').format('YYYY-MM-DD HH:mm');
                    this.endtime = moment(this.end)._d.getTime();
                }
                // this.stop();
                this.timeline();
                this.search();
            },
            search: function(id) {
                if(id) {
                    // 查询设备并播放录像
                    var device = _.find($scope.camera.list, {id: id});
                    console.log(device);
                    var index = $scope.query.addItem(device);

                    $scope.query.play(index);
                } else {
                    // 重新查询所有窗口录像
                    _.each($scope.query.list, function(row, i) {
                        if(row && row.id) {
                            row.now = $scope.query.starttime;
                            $scope.query.play(i);
                        }
                    });
                }
            },
            addItem: function(device) {
                var index = 0;
                var items = _.filter($scope.query.list, function(row) {
                    return row && row.id;
                });

                // 计算将要在哪个窗口播放
                if(items.length < $scope.camera.screen) {
                    index = items.length;
                } else {
                    index = $scope.query.count % $scope.camera.screen;
                }

                // 如果有选中窗口，在选中的窗口播放
                if($scope.camera.object.getSelect() > 0) {
                    index = $scope.camera.object.getSelect() - 1;
                }

                // 统计播放监控的数量，用于多路回放时计算窗口
                if($scope.camera.screen != 1) {
                    $scope.query.count++;
                }

                $scope.query.list[index] = {
                    index: index,
                    id: device.id,
                    title: device.name,
                    files: [],
                    state: 0,
                    now: $scope.query.starttime,
                    pausetime: $scope.query.starttime
                };

                return index;
            },
            getVideoList: function(index) {
                iAjax.post('security/common/monitor.do?action=getVideoList', {
                    filter: {
                        id: $scope.query.list[index].id,
                        start: $scope.query.starttime,
                        end: $scope.query.endtime
                    }
                }).then(function(data) {
                    $scope.query.list[index]['files'] = data.result.rows;
                });
            },
            clickFn: function() {
                if(this.state == 1) {
                    this.pause();
                } else if(this.state == 2) {
                    this.resume();
                }
            },
            play: function(index) {
                if(_.isNumber(index)) {
                    $scope.query.startRecord($scope.query.list[index]['id'], index);
                } else {
                    _.each($scope.query.list, function (row, i) {
                        if(row && row.id) {
                            $scope.query.startRecord(row.id, i);
                        }
                    });
                }

                this.state = 1;
            },
            startRecord: function(id, index) {
                var video = $scope.query.list[index];

                // 时间指针重置
                $('.safe-record-time-pointer').eq(index).css('left', '88px');
                // 接口方式获取录像文件
                !$scope.isImcs && $scope.query.getVideoList(index);

                $scope.camera.object.record(id, index + 1, $scope.query.starttime, $scope.query.endtime, (video.state != 2 ) ? parseInt(video.now) : video.pausetime, function (files) {
                    // imcs方式获取录像文件
                    if (files && files.length > 0) {
                        var idx = _.findIndex($scope.query.list, {id: id});
                        $scope.query.list[idx]["files"] = files;
                        $scope.query.list[idx]["state"] = 1;
                    }
                });

                video.state = 1;
            },
            resume: function() {
                var index = $scope.camera.object.getSelect();
                if(index > 0) {
                    // 有选中窗口，只暂停当前窗口录像
                    $scope.camera.object.recordPlay(index);
                    $scope.query.list[index - 1]['state'] = 1;
                } else {
                    // 暂停所有录像
                    _.each($scope.query.list, function(row, i) {
                        if (row && row.id) {
                            $scope.camera.object.recordPlay(i + 1);
                            $scope.query.list[i]['state'] = 1;
                        }
                    });
                }
                this.state = 1;
            },
            pause: function() {
                var index = $scope.camera.object.getSelect();
                if(index > 0) {
                    // 有选中窗口，只暂停当前窗口录像
                    $scope.camera.object.recordPause(index);
                    $scope.query.list[index - 1]['state'] = 2;
                    $scope.query.list[index - 1]['pausetime'] = parseInt(this.now);
                } else {
                    // 暂停所有录像
                    _.each($scope.query.list, function(row, i) {
                        if (row && row.id) {
                            $scope.camera.object.recordPause(i + 1);
                            $scope.query.list[i]['state'] = 2;
                            $scope.query.list[i]['pausetime'] = parseInt(this.now);
                        }
                    });
                }

                this.pauseTime = parseInt(this.now);

                this.state = 2;
            },
            stop: function() {
                var index = $scope.camera.object.getSelect();
                if(index > 0) {
                    // 有选中窗口，只关闭当前窗口录像
                    $scope.camera.object.recordStop(index);
                    // 时间指针重置
                    $('.safe-record-time-pointer').eq(index - 1).css('left', '88px');
                    // 录像信息重置
                    $scope.query.list[index - 1] = {
                        index: index - 1
                    };
                } else {
                    // 关闭所有录像
                    $scope.query.stopAll();
                }

                this.now = this.starttime;

                this.state = 0;
            },
            stopAll: function() {
                if($scope.camera.object) {
                    // $scope.camera.object.closeAll();
                    $scope.camera.object.recordStopAll();
                }
                // 录像信息重置
                $scope.camera.setQueryList();
                // 时间指针重置
                // $.each($scope.query.list, function(i) {
                    $('.safe-record-time-pointer').css('left', '88px');
                // });
                this.state = 0;
            },
            setpos: function(e, index) {
                var boxw = $('.safe-record-time').width(),
                    l = e.clientX - $(e.currentTarget).offset().left;

                if (l < 100 || l > boxw + 100) return;

                $('.safe-record-time-pointer').eq(index).css('left', l - 12);
                $scope.query.now = this.starttime + (l - 100) / boxw * (this.endtime - this.starttime);

                if (this.state == 1) {
                    $scope.camera.object.recordSetPos(index + 1, parseInt($scope.query.now));
                }
            },
            moveline: function(time) {
                var boxw = $('.safe-record-time').width(),
                    start = 88,
                    l = (time - this.starttime) / (this.endtime - this.starttime) * boxw + start;

                if (l < 100 || l > boxw + 100) return;

                // $('.safe-record-time-pointer').css('left', l);

                if($scope.camera.screen == 1) {
                    $('.safe-record-time-pointer').eq(0).css('left', l);
                } else {
                    _.each($scope.query.list, function(row, i) {
                        if(row && row.id) {
                            l = (row.now - $scope.query.starttime) / ($scope.query.endtime - $scope.query.starttime) * boxw + start;
                            $('.safe-record-time-pointer').eq(i).css('left', l);
                        }
                    });
                }
            },
            mouseover: function(e, index) {
                $('.safe-record-time-mouseline').eq(index).show();
            },
            mouseout: function(e, index) {
                $('.safe-record-time-mouseline').eq(index).hide();
            },
            mousemove: function(e) {
                var boxw = $('.safe-record-time').width(),
                    l = e.clientX - $(e.currentTarget).offset().left;

                if (l < (boxw + 200) / 2) {
                    $('.safe-record-time-mouseline b').css('left', 10);
                } else {
                    $('.safe-record-time-mouseline b').css('left', -125);
                }

                if (l < 100 || l > boxw + 100) return;

                $('.safe-record-time-mouseline').css('left', l);
                $('.safe-record-time-mouseline b').text(moment(this.starttime + (l - 100) / boxw * (this.endtime - this.starttime)).format('HH:mm:ss'));
            },
            download: function(row, e) {
                if(e) {
                    e.stopPropagation();
                }
                //委托safeRecordDownload服务进行录像下载
                $scope.isImcs ? safeRecordDownload.fastDownload(row.id, $scope.query.starttime, $scope.query.endtime, $scope.camera) : safeRecordDownload.addDownload(row.id, $scope.query.starttime, $scope.query.endtime);
            },
            toggleSound: function(index, e) {
                if(e) {
                    e.stopPropagation();
                }

                var row = $scope.query.list[index];
                if(row.isSound) {
                    row.isSound = false;
                } else {
                    row.isSound = true;
                }
                var scope = angular.element('.safe-record-camera .safe-video-panel').scope();
                if(scope && scope.imcsPlayer) {
                    $scope.camera.object.selectByIndex(index + 1);
                    scope.imcsPlayer.playSound(row.isSound);
                }
            }
        };

        $scope.backHardware = function() {
            $state.go('safe.supervision')
        };

        //本地回放
        $scope.reply = {
            show: function() {
                $('#safeRecordReplyFile').click();
            },
            change: function(element) {
                var path = $('#safeRecordReplyFile').val();
                if (path) {
                    var file = element.files[0];
                    var url = URL.createObjectURL(file);
                    $rootScope.$broadcast('localReply.show', {path: url, name: file.name});

                    $('#safeRecordReplyFile').val('');
                }
            }
        };

        $scope.$on('safeRecordControllerExitEvent', function() {
            $scope.query.stopAll();
            if ($scope.camera.object) {
                $scope.camera.object.closeAll();
                $scope.camera.object.destroy();
            }
        });

        $scope.$on('safeRecordCloseEvent', function(event, data){
            $scope.query.now = '';

            var index = data - 1;
            $scope.query.list[index] = { index: index };

            $scope.query.state = 3;
        });

        $scope.$on('safeMainKeydownSpaceEvent', function() {
            if($scope.isImcs && $scope.query.state != 0 && $scope.camera.object.getSelect() > 0) {
                $scope.$broadcast('safeMonitorSpaceEvent');
            }
        });

        $scope.switchLeftTreeType = function() {
            if ($scope.leftTreeType == 'N') {
                $scope.leftTreeType = 'O';
                $scope.leftTreeTypeText = '点击切换到触控模式';
            } else {
                $scope.leftTreeType = 'N';
                $scope.leftTreeTypeText = '点击切换到传统模式';
            }

            if (window.localStorage) {
                window.localStorage.setItem('IMC_SAFE_MONITORCENTER_LAYOUT', $scope.leftTreeType);
            }
        };


        /**
         * 添加提示，如果还在下载中的录像，提示是否退出来下载
         * @param id
         */
        $scope.confirmCancel = function (id) {
            iConfirm.close(id);
        };

        $scope.logoutDownload = function (id) {
            iConfirm.close(id);
            eFly.hide();
        };

        function countPercentage() {
            var allDownloadPercentage = 0;

            var aDownloading = safeRecordDownload.getDownloadings();
            _.each(aDownloading, function(download) {
                allDownloadPercentage += download.percentage;
            });
            var allPercentage = allDownloadPercentage > 0 ? (allDownloadPercentage / aDownloading.length).toFixed(2) + '%' : '下载中';

            if(allPercentage < 100 || allPercentage  == '下载中') {
                iConfirm.show({
                    scope : $scope,
                    title : '提醒',
                    content : '是否要退出下载？',
                    buttons : [{
                        text : '确定',
                        style : 'button-primary',
                        action : 'logoutDownload',
                    },{
                        text : '取消',
                        style : 'button-caution',
                        action : 'confirmCancel',
                    }]
                })
            }
        }

        $scope.$on("$destroy", function() {
            var path = $location.path();
            if(path != '/safe/record'){
                safeRecordDownload.listenDownloadsStatus(countPercentage)

            }
        })


        $scope.map.init();
        $scope.camera.init();
        $scope.query.getData();


    }]);
});