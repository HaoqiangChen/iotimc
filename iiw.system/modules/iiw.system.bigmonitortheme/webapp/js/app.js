/**
 * 电视墙模式管理—列表
 *
 * Created by YBW on 2016-7-6
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/bigmonitortheme/css/index'
], function(app) {
    app.controller('bigmonitorthemeController', [
        '$scope',
        'iAjax',
        '$state',
        'iTimeNow',
        'iMessage',
        'mainService',
        '$filter',
        function($scope, iAjax, $state, iTimeNow, iMessage, mainService, $filter) {

            mainService.moduleName = '电视墙模式管理';
            $scope.title = '电视墙模式管理—列表';
            $scope.alarmRelatedTheme = null;
            $scope.bigmonitor = [];
            $scope.modBtnFlag = true;
            $scope.testBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.modelManage = {
                request: false,
                testModel: {
                    button: false,
                    monitors: null,
                    monitor: null,
                    order: null,
                    changeModel: function() {
                        var data = {
                            id: $scope.modelManage.updataMonitor.id,
                            devicefk: $scope.modelManage.updataMonitor.devicefk
                        };
                        $scope.modelManage.request = true;
                        iAjax.post('security/bigmonitor/theme.do?action=setActiveTheme', data).then(function() {
                            remind(1, '电视墙切换成功！', '模式上墙测试');
                            $scope.modelManage.request = false;
                        }, function() {
                            remind(4, '网络连接失败！');
                            $scope.modelManage.request = false;
                        })
                    },

                    /**
                     * 切换监控测试
                     */
                    changeMonitor: function() {
                        this.monitor = this.monitors[Math.floor(Math.random() * 10)];
                    },

                    /**
                     * 测试电视墙模式
                     */
                    testMonitor: function(data) {
                        if(data.$$watchers[1].last == '已关联') {
                            data.cols.request = true;
                            iAjax.post('security/bigmonitor/theme.do?action=setThemeMonitor', {
                                bigmonitor: $scope.modelManage.bigmonitoId,
                                devicefk: data.cols.testMonitor.id,
                                channel: data.cols.testMonitor.dcchannel,
                                monitorfk: this.monitor.id
                            }).then(function() {
                                remind(1, '已将【' + $scope.modelManage.testModel.monitor.name + '】监控切换上墙！', '监控上墙测试');
                                data.cols.request = false;
                            }, function() {
                                data.cols.request = false;
                                remind(4, '网络连接失败！');
                            });
                        }
                    },

                    /**
                     * 测试窗口开关
                     */
                    toogle: function() {
                        this.button = !this.button;
                        this.button && randomRelevanse() && $scope.modelManage.listing.chooce();
                        function randomRelevanse() {
                            var data = {
                                filter: {
                                    id: $scope.modelManage.bigmonitoId
                                }
                            };
                            iAjax.post('security/devicemonitor.do?action=getBigMonitorCannel', data).then(function(data) {
                                if(data.result && data.result.rows) {
                                    $scope.modelManage.order = data.result.rows;
                                    $.each($scope.modelManage.updataMonitor.themeShow, function(i, o) {
                                        if(o) {
                                            $.each(o, function(j, k) {
                                                if($scope.modelManage.order.length == 0) {
                                                    k.relevanse = '未关联';
                                                    k.class = 'notRelevanceStyle';
                                                } else {
                                                    $.each($scope.modelManage.order, function(z, x) {
                                                        if(String(k.value) == String(x.channel)) {
                                                            k.message = '点击播放监控\n解码器名称：' + x.dcname + '\n解码器通道号：' + x.dcchannel + '';
                                                            k.relevanse = '已关联';
                                                            k.class = 'relevanceStyle';
                                                            k.testMonitor = {
                                                                id: x.devicefk,
                                                                dcchannel: x.dcchannel
                                                            };
                                                            return false;
                                                        }
                                                    });
                                                    if(!k.message) {
                                                        k.relevanse = '未关联';
                                                        k.class = 'notRelevanceStyle';
                                                    }
                                                }
                                            })
                                        }
                                    });
                                }
                            });

                            var data = {
                                params: {
                                    pageNo: '1',
                                    pageSize: '10'
                                },
                                filter: {
                                    type: 'monitor'
                                }
                            };

                            iAjax.post('security/device.do?action=getDevice', data).then(function(data) {

                                if(data.result || data.result.rows) {

                                    $scope.modelManage.testModel.monitors = data.result.rows;
                                    $scope.modelManage.testModel.monitor = $scope.modelManage.testModel.monitors[Math.floor(Math.random() * 10)];

                                }
                            }, function() {
                                remind(4, '网络连接出错，获取监控失败！');
                            });

                            return true;
                        }
                    }
                },
                listing: {
                    theme: [],
                    chooce: function(data) {
                        //此处data为ng-repeat生成子项的作用域，
                        //如<div num in list></div>，那此data即含有data.$index、data.num等
                        //可理解此data为scope
                        if(data != undefined) {
                            data.num.select = !data.num.select;
                        } else {
                            $scope.modelManage.updataMonitor.select = false;
                        }

                        $scope.deleteMonitor = [];
                        _.each($scope.modelManage.listing.theme, function(monitortheme) {
                            if(monitortheme.select) {
                                //存放已选择的电视墙模式ID
                                $scope.deleteMonitor.push(monitortheme.id);
                                //存放已选择的电视墙模式
                                $scope.modelManage.updataMonitor = monitortheme;
                            }
                        });
                        $scope.modelManage.checkBtn();
                    }
                },

                /**
                 * 添加、修改、删除、测试等按钮操控
                 */
                checkBtn: function() {

                    if($scope.deleteMonitor.length == 1) {
                        $scope.modBtnFlag = $scope.testBtnFlag = $scope.delBtnFlag = false;
                    } else if($scope.deleteMonitor.length > 0) {
                        $scope.delBtnFlag = false;
                        $scope.modBtnFlag = $scope.testBtnFlag = true;
                    } else {
                        $scope.delBtnFlag = $scope.modBtnFlag = $scope.testBtnFlag = true;
                    }
                },

                /**
                 * 电视墙模式选择
                 */
                bigmonitorChooce: function() {

                    this.getModelList(this.bigmonitoId);
                    this.listing.chooce();
                    $scope.modelManage.bigmonitorName = _.where($scope.bigmonitor, {id: $scope.modelManage.bigmonitoId})[0].name;
                    getAlarmTheme(this.bigmonitoId);
                    getAlarmResumeTheme(this.bigmonitoId);
                },
                bigmonitoId: '',

                /**
                 * 删除电视墙模式
                 */
                confirmDelete: function() {
                    var data = {
                        filter: {
                            ids: $scope.deleteMonitor
                        }
                    };
                    iAjax.post('security/devicemonitor.do?action=delBigMonitorTheme', data).then(function() {

                        remind(1, '删除成功！');
                        $scope.modelManage.getModelList($scope.modelManage.bigmonitoId);
                        $scope.deleteMonitor = [];
                        $scope.modelManage.checkBtn();

                    }, function() {
                        remind(4, '网络连接失败！');
                    });
                },

                /**
                 * 弹出“删除电视墙模式”框
                 */
                delete: function() {
                    $('.modal').modal();
                },

                /**
                 * 调转到修改页面
                 */
                mod: function() {
                    $scope.title = '电视墙模式管理—修改';
                    var params = {
                        data: {
                            bigmonitorId: $scope.modelManage.bigmonitoId,
                            aperate: 'mod',
                            modObj: $scope.modelManage.updataMonitor,
                            bigmonitorName: $scope.modelManage.bigmonitorName
                        }
                    };
                    $state.params = params;
                    $state.go('system.bigmonitortheme.add', params);
                    this.listing.chooce();
                },

                /**
                 * 调转到添加页面
                 */
                add: function() {
                    $scope.title = '电视墙模式管理—添加';
                    var params = {
                        data: {
                            bigmonitorId: $scope.modelManage.bigmonitoId,
                            aperate: 'add',
                            bigmonitorName: $scope.modelManage.bigmonitorName
                        }
                    };
                    $state.params = params;
                    $state.go('system.bigmonitortheme.add', params);
                    this.listing.chooce();
                },
                setAlarmRelation: function() {

                    $scope.title = '电视墙模式管理—默认报警联动';
                    var params = {
                        data: {
                            obj: $scope.modelManage.updataMonitor,
                            bigmonitorfk: $scope.modelManage.bigmonitoId,
                            bigmonitorName: $scope.modelManage.bigmonitorName,
                            alarmRelatedTheme: $scope.alarmRelatedTheme
                        }
                    };
                    $state.params = params;
                    $state.go('system.bigmonitortheme.alarmrelation', params);
                    this.listing.chooce();
                },
                setAlarmRestore: function() {
                    var aSelect = $filter('filter')($scope.modelManage.listing.theme, {select: true});
                    if(aSelect.length) {
                        var data = {
                            filter: {
                                devicefk: aSelect[0].devicefk,
                                bigmonitorthemefk: aSelect[0].id
                            }
                        };
                        iAjax
                            .post('/security/devicemonitor.do?action=addAlarmResumeTheme', data)
                            .then(function(data) {
                                if(data && data.status == '1') {
                                    remind(1, '设置成功!', '电视墙模式管理');
                                    getAlarmTheme($scope.modelManage.bigmonitoId);
                                    getAlarmResumeTheme($scope.modelManage.bigmonitoId);
                                }
                            })
                    }
                },

                /**
                 * 取消报警联动后恢复电视墙模式
                 */
                delAlarmRestore: function() {
                    iAjax.post('/security/devicemonitor.do?action=delAlarmResumeTheme', {
                        filter: {
                            devicefk: $scope.modelManage.bigmonitoId
                        }
                    }).then(function(data) {
                        if(data && data.status == '1') {
                            remind(1, '取消设置!', '电视墙模式管理');
                            getAlarmTheme($scope.modelManage.bigmonitoId);
                            getAlarmResumeTheme($scope.modelManage.bigmonitoId);
                        }
                    });
                },
                updataMonitor: [],

                /**
                 * 获取电视墙模式列表
                 */
                getModelList: function(id) {
                    if(id) {
                        var data = {
                            filter: {
                                id: id
                            }
                        };
                        iAjax.post('security/devicemonitor.do?action=getBigMonitorTheme', data).then(function(data) {
                            if(data.result.rows && data.result) {
                                $scope.modelManage.listing.theme = data.result.rows;
                                var temporary = {};
                                $.each($scope.modelManage.listing.theme, function(i) {
                                    temporary = $scope.modelManage.listing.theme[i];
                                    temporary.select = false;
                                    temporary.theme = JSON.parse(temporary.theme);
                                    temporary.themeShow = createTable(temporary.theme);
                                    temporary.themeShow = createTable(temporary.theme);
                                });
                            }
                        }, function() {
                            remind(4, '网络连接失败！');
                        });
                    }
                },
                getAlarmTheme: getAlarmTheme
            };
            $scope.init = function() {
                var data = {
                    filter: {
                        type: 'bigmonitor',
                        cascade: 'Y'
                    }
                };
                iAjax.post('security/common/monitor.do?action=getDeviceOuList', data).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.bigmonitor = data.result.rows;
                        $scope.modelManage.bigmonitoId = $scope.bigmonitor.length ? $scope.bigmonitor[0].id : null;
                        $scope.modelManage.getModelList($scope.modelManage.bigmonitoId);
                        $scope.modelManage.bigmonitorName = _.where($scope.bigmonitor, {id: $scope.modelManage.bigmonitoId})[0].name;
                        getAlarmTheme($scope.modelManage.bigmonitoId);
                        getAlarmResumeTheme($scope.modelManage.bigmonitoId);
                    }
                }, function() {
                    remind(4, '网络连接失败！');
                });
            };
            //security/common/monitor.do?action=getDeviceOuList
            /**
             *  弹出消息框
             */
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    level: level,
                    title: (title || '消息提醒'),
                    content: content
                };
                iMessage.show(message, false);
            }

            /**
             * 生成预览状态下的电视墙模式
             */
            function createTable(json) {
                if(typeof json == 'number') {
                    result = [[{
                        col: 1,
                        row: 1,
                        index: 1,
                        value: json,
                        style: {
                            height: 100,
                            width: 100,
                            top: 0,
                            left: 0
                        }
                    }]]
                } else {
                    var origin = json;
                    var temp = $.extend(true, [], json);

                    var result = [];
                    var run = true;

                    var row = 0,
                        nextRow = 0;
                    while(run) {
                        var positionIndex = null;
                        var value = json[row][0];

                        $.each(origin[row], function(i, o) {
                            if(value == o && !positionIndex) {
                                positionIndex = i + 1;
                            }
                        });

                        var col = 0,
                            addrow = 0,
                            addCol = 0;

                        for(var i = row; i < json.length; i++) {
                            var index = 0;
                            for(var j = 0; j < json[i].length; j++) {
                                if(value == json[i][j]) {
                                    addCol++;
                                    temp[i].splice(index, 1);
                                } else {
                                    index++;
                                }
                            }
                            if(col != addCol) {
                                addrow++;
                                col = addCol;
                            }

                            if(temp[i].length == 0) {
                                nextRow++;
                            }
                        }

                        if(!result[row]) {
                            result[row] = [];
                        }

                        result[row].push({
                            value: value,
                            row: addrow,
                            col: (col / addrow),
                            index: positionIndex,
                            request: false
                        });

                        json = $.extend(true, [], temp);
                        if(nextRow < origin.length) {
                            row = nextRow;
                        } else {
                            run = false;
                        }
                    }

                    //生成单元格长宽样式
                    var height = 100 / origin.length;
                    var width = 100 / origin[0].length;
                    for(var rowIndex in result) {
                        $.each(result[rowIndex], function(i, td) {
                            td.style = {
                                height: td.row * height,
                                width: td.col * width,
                                top: height,
                                left: width
                            };
                        });
                    }
                }

                return result;
            }


            function getAlarmTheme(bigmonitorfk) {
                iAjax
                    .post('security/devicemonitor.do?action=getAlarmTheme', {
                        filter: {
                            devicefk: bigmonitorfk
                        }
                    })
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            $scope.alarmRelatedTheme = data.result.rows[0];
                        }
                    });
            }

            function getAlarmResumeTheme(bigmonitorfk) {
                iAjax
                    .post('/security/devicemonitor.do?action=getAlarmResumeTheme', {
                        filter: {
                            devicefk: bigmonitorfk
                        }
                    })
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            $scope.alarmResumeTheme = data.result.rows[0];
                        }
                    });
            }

            //初始化
            $scope.init();
        }]);
});