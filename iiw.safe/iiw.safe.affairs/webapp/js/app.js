/**
* 日常事务
*
* Created by YBW on 2017-3-30
 */
define([
    'app',
    'cssloader!safe/affairs/css/index',
    'safe/affairs/js/services/safeUnitTreeService',
    'safe/affairs/js/services/safeChooseDevicesService',
    'safe/affairs/lib/jquery.ztree.all'
], function(app) {
    app.controller('affairsController', [
        '$scope',
        'iAjax',
        'iTimeNow',
        'iMessage',
        '$state',
        '$filter',
        'unitTree',
        'devicesStorage',
        '$rootScope',
        'safeMainTitle',
        'safeHardware',
        'safeSound',

        function($scope, iAjax, iTimeNow, iMessage, $state, $filter, unitTree, devicesStorage, $rootScope, safeMainTitle, safeHardware, safeSound){

            safeMainTitle.title = '日常事务管理';

            $scope.buttonStyle = ['primary', 'info', 'success', 'warning', 'default', 'danger'];

            $scope.affairs = {
                list: [],
                device: {
                    list: [],
                    name: '',
                    notes: ''
                },
                execute: {},
                proportion: 0,
                complete: 0,
                wait: 0,
                error: 0,
                toggleDevice: false,
                filter: $filter('date')(new Date().getTime(), 'yyyy-MM-dd'),
                currentDate: $filter('date')(new Date().getTime(), 'yyyy-MM-dd'),
                AffairsTipsType: '0', //日常事务提示状态
                //管理事务
                manage: function () {
                    $state.go('safe.affairs.manage');
                },

                //事务执行反馈
                summarize: function(){
                    $state.go('safe.affairs.summarize');
                },

                closeAllTips: function (val) {  //一键关闭事务提醒
                    $scope.affairs.setAffairsTipsVal(val)
                        .then(function () {
                           return $scope.getAffairsTipsType();
                        })
                        .then(function (data) {
                            $scope.AffairsTipsType = data.result.rows[0].content;
                        })
                },

                openAllTips: function (val) {  //一键关闭事务提醒
                    $scope.affairs.setAffairsTipsVal(val)
                        .then(function () {
                            return $scope.getAffairsTipsType();
                        })
                        .then(function (data) {
                            $scope.AffairsTipsType = data.result.rows[0].content;
                        })
                },

                setAffairsTipsVal: function (val) {   //保存提示值接口
                    var defer = $.Deferred();
                    var postData = {
                        filter: {
                            content: val,  //修改的内容
                            type: "TIMELINESET"      //类型
                        }
                    };

                    iAjax.post('security/infomanager/counter.do?action=updateSycodeContent', postData)
                        .then(function (data) {
                            if (data.status == 1) {
                                if (val == 0) {
                                    remind(1, '事务提醒关闭执行成功');
                                } else {
                                    remind(1, '事务提醒开启执行成功');
                                }
                                defer.resolve();
                            }
                        }, function () {
                            remind(4, '网络连接出错，修改执行方式失败');
                        });
                    return defer;
                },

                //获取事务列表
                getList: function () {

                    var affairs = $scope.affairs;
                    iAjax.post('sys/common/timeline.do?action=getDateTimeLine', {
                        date: this.filter
                    }).then(function (data) {

                        if (data.result && data.result.rows) {
                            affairs.list = data.result.rows;
                            $.each(affairs.list, function (i, o) {
                                o.way = (o.exemode == 'S' ? false : true);
                            });

                            affairs.complete = _.where(affairs.list, {status: 'E'}).length;
                            affairs.wait = _.where(affairs.list, {status: 'D'}).length;
                            affairs.error = _.where(affairs.list, {status: 'C'}).length;
                            $.each(affairs.list, function (i, o) {
                                if (o.exemode == '1' && i > 1) {
                                    loadList(--i);
                                }

                            });

                        }
                    }, function () {
                        remind(4, '网络连接出错');
                    });
                },

                getAffairsTipsType: function () {
                    var defer = $.Deferred();
                    var postData = {
                        filter: {
                            type: "TIMELINESET"      //类型
                        }
                    };
                    iAjax.post('security/infomanager/counter.do?action=getSycodeContent', postData)
                        .then(function (data) {
                            defer.resolve(data);
                        });

                    return defer;
                },

                //切换事务执行方式
                changeWay: function (data) {
                    data.type = !data.type;
                    iAjax.post('sys/web/Sydispatcher.do?action=updateTimelinetype', {
                        filter: {
                            id: data.id,
                            type: (data.type ? 'Y' : 'N')
                        }
                    }).then(function () {
                        $scope.affairs.getList();
                    }, function () {
                        remind(4, '网络连接出错，修改执行方式失败');
                    });
                },

                //获取执行设备
                getDevice: function (id, name) {
                    var device = $scope.affairs.device;
                    iAjax.post('sys/web/Sydispatcher.do?action=getTimecfgDevice', {
                        filter: {
                            id: id
                        }
                    }).then(function (data) {

                        if (data.result && data.result.rows) {

                            device.list = data.result.rows;
                            device.name = name;
                            device.id = id;
                            device.notes = '';

                        }

                    }, function () {
                        remind(4, '网络连接出错');
                    });

                },

                //获取当前执行事务
                getActionTimeLine: function () {
                    iAjax.post('sys/web/Sydispatcher.do?action=gettimelineexecute').then(function (data) {
                        if (data.result && data.result.rows && data.result.rows.length) {
                            $scope.affairs.execute = data.result.rows[0];

                            var arrayEnd = $scope.affairs.execute.endtime.split(':'),
                                arrayStart = $scope.affairs.execute.starttime.split(':'),
                                startTime = ((arrayStart[0] * 60 + (arrayStart[1] - 0)) * 60),
                                endTime = ((arrayEnd[0] * 60 + (arrayEnd[1] - 0)) * 60),
                                distance = endTime - startTime,
                                current = $filter('date')(new Date().getTime(), 'H:m:s').split((':')),
                                currentTime = (current[0] * 60 + (current[1] - 0)) * 60 + (current[2] - 0),
                                surplus = ((arrayEnd[0] * 60 + (arrayEnd[1] - 0)) * 60) - currentTime,
                                second = distance / 100;


                            if (currentTime < startTime) {
                                $scope.affairs.proportion = 1;
                            } else if (currentTime > endTime) {
                                $scope.affairs.proportion = 100;
                            } else {
                                $scope.affairs.proportion = (surplus / distance * 100).toFixed();
                            }

                            var obj = $('.iiw-safe-affairs .container');
                            animate(second * 1000, true);

                            function animate(time, degree) {
                                var percentageWidth = ($scope.affairs.proportion < 5 ? 5 : $scope.affairs.proportion) - 0;

                                if (degree) {
                                    obj.css('width', percentageWidth + '%');
                                    animate(time);
                                } else {
                                    obj.animate({
                                        'width': percentageWidth + '%'
                                    }, time, function () {

                                        if ($scope.affairs.proportion != 100) {
                                            $scope.affairs.proportion++;
                                            animate(time);
                                        }
                                    });
                                }
                            }

                        }
                    }, function () {
                        remind(4, '网络连接出错，获取正在执行事务失败');
                    });
                },

                //执行情况
                executeStatus: function (status) {

                    var affairs = $scope.affairs;
                    iAjax.post('sys/web/Sydispatcher.do?action=updateTimelineStatus', {
                        filter: {
                            id: affairs.device.id,
                            status: status,
                            notes: affairs.device.notes
                        }
                    }).then(function () {
                        affairs.device.notes = '';
                        $scope.affairs.getList();
                    }, function () {
                        remind(4, '网络连接出错');
                    });
                },

                //立即执行事务
                executeTimeLine: function (id, content) {
                    iAjax.post('sys/common/timeline.do?action=executeTimeLine', {
                        id: id
                    }).then(function () {
                        remind(1, '成功执行事务');
                        $scope.affairs.getList();
                        $scope.affairs.getActionTimeLine();

                    }, function () {
                        remind(4, '网络连接出错，执行事务失败');
                    });

                    /*iAjax.post('sys/common/voice.do?action=buildVoice', {
                        content: content
                    }).then(function () {
                    }, function () {
                        remind(4, '网络连接出错');
                    });*/
                    safeSound.playMessage(content);

                },

                // 执行设备动作
                doAction: function (control) {
                    safeHardware.execute(control.deviceid, control.type, control.action, (control.value == 0 ? 0 : (control.value || ''))).then(function (data) {
                        if (data.result && data.result.rows) {
                            if (data.result.rows.sendResult == 'FAIL') {
                                remind(4, '执行失败!');
                            } else {
                                remind(1, '执行成功!');
                            }
                        } else {
                            remind(1, '发送成功!');
                        }
                    }, function (data) {
                        remind(4, '发送失败!');
                    });
                }
            };

            function loadList(num) {
                setTimeout(function () {
                    var affairs = $scope.affairs;
                    if ((affairs.complete + affairs.error) != 0) {

                        var el = $('.iiw-safe-affairs-body-left-list'),
                            oData = el.data('i-scroll');
                        oData && oData.scrollTo && oData.scrollTo(0, -(num * 250 - 20), num * 500);
                    }
                }, 200);
            }


            function init() {
                $scope.getAffairsTipsType()
                    .then(function (data) {
                        if (data.status == 1) {
                            $scope.AffairsTipsType = data.result.rows[0].content;
                        }
                    })
            }

            $scope.$on('affairsControllerOnEvent', function () {
                $scope.affairs.getList();
                $scope.affairs.getActionTimeLine();
            });


            init();

            //消息框
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒'),
                    content: (content || '网络出错'),
                    level: level,

                };

                iMessage.show(message, false, $scope);
            }


        }]);
});