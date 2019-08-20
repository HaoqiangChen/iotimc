/**
 * 定时任务管理模块
 *
 * Created by llx on 2016-12-30.
 */


define([
    'app',
    'cssloader!system/dispatcher/item/css/index.css',
    'system/dispatcher/item/js/directives/addServer',
    'system/dispatcher/item/js/filter/filterDate'

], function(app) {
    app.controller('systemDispatcherItemController', [
        '$scope',
        '$state',
        'iAjax',
        'iMessage',
        '$stateParams',

        function($scope, $state, iAjax, iMessage, $stateParams) {
            var index = 0;
            var item, type;
            $scope.title = '定时任务管理';
            $scope.typeStatus = '';
            $scope.dispatcherTitle = '';
            //$scope.dispatcherRepeatCount = '';
            $scope.startYear = '';
            $scope.endYear = '';
            $scope.updateId = '';
            $scope.serverList = [];
            $scope.timeList = [
                {name: '秒', status: true},
                {name: '分钟', status: false},
                {name: '小时', status: false},
                {name: '日', status: false},
                {name: '月', status: false},
                {name: '周末', status: false},
                {name: '年', status: false}
            ];

            $scope.dispatcherItem = {
                //cronSecond: ['每秒'],
                //cronMin: ['每分'],
                //cronHour: ['每时'],
                //cronDay: ['每天'],
                //cronMouth: ['每月'],
                //cronWeek: ['每周'],
                //cronYear: ['每年'],
                cronSecond: '',
                cronMin: '',
                cronHour: '',
                cronDay: '',
                cronMouth: '',
                cronWeek: '',
                cronYear: '',
                cronSecondStatus: '每秒',
                cronMinuteStatus: '每分',
                cronHourStatus: '每时',
                cronDayStatus: '每天',
                cronMonthStatus: '每月',
                cronWeekStatus: '每周',
                cronYearStatus: '每年',

                secondSelectList: [
                    {name: '每秒'},
                    {name: '指定'}
                ],
                minSelectList: [
                    {name: '每分'},
                    {name: '指定'}
                ],
                hourSelectList: [
                    {name: '每时'},
                    {name: '指定'}
                ],
                daySelectList: [
                    {name: '每天'},
                    {name: '指定'}
                ],
                monthSelectList: [
                    {name: '每月'},
                    {name: '指定'}
                ],
                weekSelectList: [
                    {name: '每周'},
                    {name: '指定'}
                ],
                yearSelectList: [
                    {name: '每年'},
                    {name: '开始年份 - 结束年份'}
                ],
                secondList: [
                    {name: '00', checked: false, value: 0},
                    {name: '01', checked: false, value: 1},
                    {name: '02', checked: false, value: 2},
                    {name: '03', checked: false, value: 3},
                    {name: '04', checked: false, value: 4},
                    {name: '05', checked: false, value: 5},
                    {name: '06', checked: false, value: 6},
                    {name: '07', checked: false, value: 7},
                    {name: '08', checked: false, value: 8},
                    {name: '09', checked: false, value: 9},
                    {name: '10', checked: false, value: 10},
                    {name: '11', checked: false, value: 11},
                    {name: '12', checked: false, value: 12},
                    {name: '13', checked: false, value: 13},
                    {name: '14', checked: false, value: 14},
                    {name: '15', checked: false, value: 15},
                    {name: '16', checked: false, value: 16},
                    {name: '17', checked: false, value: 17},
                    {name: '18', checked: false, value: 18},
                    {name: '19', checked: false, value: 19},
                    {name: '20', checked: false, value: 20},
                    {name: '21', checked: false, value: 21},
                    {name: '22', checked: false, value: 22},
                    {name: '23', checked: false, value: 23},
                    {name: '24', checked: false, value: 24},
                    {name: '25', checked: false, value: 25},
                    {name: '26', checked: false, value: 26},
                    {name: '27', checked: false, value: 27},
                    {name: '28', checked: false, value: 28},
                    {name: '29', checked: false, value: 29},
                    {name: '30', checked: false, value: 30},
                    {name: '31', checked: false, value: 31},
                    {name: '32', checked: false, value: 32},
                    {name: '33', checked: false, value: 33},
                    {name: '34', checked: false, value: 34},
                    {name: '35', checked: false, value: 35},
                    {name: '36', checked: false, value: 36},
                    {name: '37', checked: false, value: 37},
                    {name: '38', checked: false, value: 38},
                    {name: '39', checked: false, value: 39},
                    {name: '40', checked: false, value: 40},
                    {name: '41', checked: false, value: 41},
                    {name: '42', checked: false, value: 42},
                    {name: '43', checked: false, value: 43},
                    {name: '44', checked: false, value: 44},
                    {name: '45', checked: false, value: 45},
                    {name: '46', checked: false, value: 46},
                    {name: '47', checked: false, value: 47},
                    {name: '48', checked: false, value: 48},
                    {name: '49', checked: false, value: 49},
                    {name: '50', checked: false, value: 50},
                    {name: '51', checked: false, value: 51},
                    {name: '52', checked: false, value: 52},
                    {name: '53', checked: false, value: 53},
                    {name: '54', checked: false, value: 54},
                    {name: '55', checked: false, value: 55},
                    {name: '56', checked: false, value: 56},
                    {name: '57', checked: false, value: 57},
                    {name: '58', checked: false, value: 58},
                    {name: '59', checked: false, value: 59}
                ],
                minList: [
                    {name: '00', checked: false, value: 0},
                    {name: '01', checked: false, value: 1},
                    {name: '02', checked: false, value: 2},
                    {name: '03', checked: false, value: 3},
                    {name: '04', checked: false, value: 4},
                    {name: '05', checked: false, value: 5},
                    {name: '06', checked: false, value: 6},
                    {name: '07', checked: false, value: 7},
                    {name: '08', checked: false, value: 8},
                    {name: '09', checked: false, value: 9},
                    {name: '10', checked: false, value: 10},
                    {name: '11', checked: false, value: 11},
                    {name: '12', checked: false, value: 12},
                    {name: '13', checked: false, value: 13},
                    {name: '14', checked: false, value: 14},
                    {name: '15', checked: false, value: 15},
                    {name: '16', checked: false, value: 16},
                    {name: '17', checked: false, value: 17},
                    {name: '18', checked: false, value: 18},
                    {name: '19', checked: false, value: 19},
                    {name: '20', checked: false, value: 20},
                    {name: '21', checked: false, value: 21},
                    {name: '22', checked: false, value: 22},
                    {name: '23', checked: false, value: 23},
                    {name: '24', checked: false, value: 24},
                    {name: '25', checked: false, value: 25},
                    {name: '26', checked: false, value: 26},
                    {name: '27', checked: false, value: 27},
                    {name: '28', checked: false, value: 28},
                    {name: '29', checked: false, value: 29},
                    {name: '30', checked: false, value: 30},
                    {name: '31', checked: false, value: 31},
                    {name: '32', checked: false, value: 32},
                    {name: '33', checked: false, value: 33},
                    {name: '34', checked: false, value: 34},
                    {name: '35', checked: false, value: 35},
                    {name: '36', checked: false, value: 36},
                    {name: '37', checked: false, value: 37},
                    {name: '38', checked: false, value: 38},
                    {name: '39', checked: false, value: 39},
                    {name: '40', checked: false, value: 40},
                    {name: '41', checked: false, value: 41},
                    {name: '42', checked: false, value: 42},
                    {name: '43', checked: false, value: 43},
                    {name: '44', checked: false, value: 44},
                    {name: '45', checked: false, value: 45},
                    {name: '46', checked: false, value: 46},
                    {name: '47', checked: false, value: 47},
                    {name: '48', checked: false, value: 48},
                    {name: '49', checked: false, value: 49},
                    {name: '50', checked: false, value: 50},
                    {name: '51', checked: false, value: 51},
                    {name: '52', checked: false, value: 52},
                    {name: '53', checked: false, value: 53},
                    {name: '54', checked: false, value: 54},
                    {name: '55', checked: false, value: 55},
                    {name: '56', checked: false, value: 56},
                    {name: '57', checked: false, value: 57},
                    {name: '58', checked: false, value: 58},
                    {name: '59', checked: false, value: 59}
                ],
                hourList: [
                    {name: '00', checked: false, value: 0},
                    {name: '01', checked: false, value: 1},
                    {name: '02', checked: false, value: 2},
                    {name: '03', checked: false, value: 3},
                    {name: '04', checked: false, value: 4},
                    {name: '05', checked: false, value: 5},
                    {name: '06', checked: false, value: 6},
                    {name: '07', checked: false, value: 7},
                    {name: '08', checked: false, value: 8},
                    {name: '09', checked: false, value: 9},
                    {name: '10', checked: false, value: 10},
                    {name: '11', checked: false, value: 11},
                    {name: '12', checked: false, value: 12},
                    {name: '13', checked: false, value: 13},
                    {name: '14', checked: false, value: 14},
                    {name: '15', checked: false, value: 15},
                    {name: '16', checked: false, value: 16},
                    {name: '17', checked: false, value: 17},
                    {name: '18', checked: false, value: 18},
                    {name: '19', checked: false, value: 19},
                    {name: '20', checked: false, value: 20},
                    {name: '21', checked: false, value: 21},
                    {name: '22', checked: false, value: 22},
                    {name: '23', checked: false, value: 23}
                ],
                weekList: [
                    {name: '星期日', checked: false, value: 1},
                    {name: '星期一', checked: false, value: 2},
                    {name: '星期二', checked: false, value: 3},
                    {name: '星期三', checked: false, value: 4},
                    {name: '星期四', checked: false, value: 5},
                    {name: '星期五', checked: false, value: 6},
                    {name: '星期六', checked: false, value: 7}
                ],
                dayList: [
                    {name: '01', checked: false, value: 1},
                    {name: '02', checked: false, value: 2},
                    {name: '03', checked: false, value: 3},
                    {name: '04', checked: false, value: 4},
                    {name: '05', checked: false, value: 5},
                    {name: '06', checked: false, value: 6},
                    {name: '07', checked: false, value: 7},
                    {name: '08', checked: false, value: 8},
                    {name: '09', checked: false, value: 9},
                    {name: '10', checked: false, value: 10},
                    {name: '11', checked: false, value: 11},
                    {name: '12', checked: false, value: 12},
                    {name: '13', checked: false, value: 13},
                    {name: '14', checked: false, value: 14},
                    {name: '15', checked: false, value: 15},
                    {name: '16', checked: false, value: 16},
                    {name: '17', checked: false, value: 17},
                    {name: '18', checked: false, value: 18},
                    {name: '19', checked: false, value: 19},
                    {name: '20', checked: false, value: 20},
                    {name: '21', checked: false, value: 21},
                    {name: '22', checked: false, value: 22},
                    {name: '23', checked: false, value: 23},
                    {name: '24', checked: false, value: 24},
                    {name: '25', checked: false, value: 25},
                    {name: '26', checked: false, value: 26},
                    {name: '27', checked: false, value: 27},
                    {name: '28', checked: false, value: 28},
                    {name: '29', checked: false, value: 29},
                    {name: '30', checked: false, value: 30},
                    {name: '31', checked: false, value: 31}
                ],
                monthList: [
                    {name: '01', checked: false, value: 1},
                    {name: '02', checked: false, value: 2},
                    {name: '03', checked: false, value: 3},
                    {name: '04', checked: false, value: 4},
                    {name: '05', checked: false, value: 5},
                    {name: '06', checked: false, value: 6},
                    {name: '07', checked: false, value: 7},
                    {name: '08', checked: false, value: 8},
                    {name: '09', checked: false, value: 9},
                    {name: '10', checked: false, value: 10},
                    {name: '11', checked: false, value: 11},
                    {name: '12', checked: false, value: 12}
                ]
            };

            if ($stateParams.data) {
                item = $stateParams.data.item[0];
                type = $stateParams.data.type;
            }
            if (type == 'mod') {
                $scope.typeStatus = 'mod';
                $scope.updateId = item.id;
                $scope.dispatcherTitle = item.name;
                //$scope.dispatcherRepeatCount = item.repeattime;
                if (item.second != '每') {
                    $scope.dispatcherItem.cronSecondStatus = '指定';
                    $scope.dispatcherItem.cronSecond = item.second;
                    $.each($scope.dispatcherItem.cronSecond, function(i, o) {
                        $scope.dispatcherItem.secondList[o].checked = true;
                    });
                } else {
                    $scope.dispatcherItem.cronSecondStatus = '每秒';
                }
                if (item.minute != '每') {
                    $scope.dispatcherItem.cronMinuteStatus = '指定';
                    $scope.dispatcherItem.cronMin = item.minute;
                    $.each($scope.dispatcherItem.cronMin, function(i, o) {
                        $scope.dispatcherItem.minList[o].checked = true;
                    });
                } else {
                    $scope.dispatcherItem.cronMinuteStatus = '每分';
                }
                if (item.hour != '每') {
                    $scope.dispatcherItem.cronHourStatus = '指定';
                    $scope.dispatcherItem.cronHour = item.hour;
                    $.each($scope.dispatcherItem.cronHour, function(i, o) {
                        $scope.dispatcherItem.hourList[o].checked = true;
                    });
                } else {
                    $scope.dispatcherItem.cronHourStatus = '每时';
                }
                if (item.day != '每') {
                    $scope.dispatcherItem.cronDayStatus = '指定';
                    $scope.dispatcherItem.cronDay = item.day;
                    $.each($scope.dispatcherItem.cronDay, function(i, o) {
                        $scope.dispatcherItem.dayList[o - 1].checked = true;
                    });
                } else {
                    $scope.dispatcherItem.cronDayStatus = '每天';
                }
                if (item.month != '每') {
                    $scope.dispatcherItem.cronMonthStatus = '指定';
                    $scope.dispatcherItem.cronMouth = item.month;
                    $.each($scope.dispatcherItem.cronMouth, function(i, o) {
                        $scope.dispatcherItem.monthList[o - 1].checked = true;
                    });
                } else {
                    $scope.dispatcherItem.cronMonthStatus = '每月';
                }
                if (item.week != '每') {
                    $scope.dispatcherItem.cronWeekStatus = '指定';
                    var list = [];
                    $.each(item.week, function(i, o) {
                        $scope.dispatcherItem.weekList[o - 1].checked = true;
                        list.push($scope.dispatcherItem.weekList[o - 1].name);
                    });
                    $scope.dispatcherItem.cronWeek = list;
                } else {
                    $scope.dispatcherItem.cronWeekStatus = '每周';
                }
                if (item.year != '每') {
                    $scope.dispatcherItem.cronYearStatus = '开始年份 - 结束年份';
                    $scope.startYear = item.year[0];
                    $scope.endYear = item.year[item.year.length - 1];
                    $scope.dispatcherItem.cronYear = ($scope.startYear + '-' + $scope.endYear)
                }
                $scope.serverList = item.dtl;
            }

            $scope.changeStatus = function(item) {
                $.each($scope.timeList, function(i, o) {
                    o.status = false;
                    if (item == o.name) {
                        o.status = true;
                    }
                })
            };

            $scope.changeSecond = function() {
                if ($scope.dispatcherItem.cronSecondStatus == '指定') {
                    $scope.dispatcherItem.cronSecond = [];
                    var list = _.where($scope.dispatcherItem.secondList, {checked: true});
                    $.each(list, function(i, o) {
                        $scope.dispatcherItem.cronSecond = $scope.dispatcherItem.cronSecond.concat(parseInt(o.name));
                    })
                } else if ($scope.dispatcherItem.cronSecondStatus == '每秒') {
                    $scope.dispatcherItem.cronSecond = '';
                }
            };

            $scope.changeMinute = function() {
                if ($scope.dispatcherItem.cronMinuteStatus == '指定') {
                    $scope.dispatcherItem.cronMin = [];
                    var list = _.where($scope.dispatcherItem.minList, {checked: true});
                    $.each(list, function(i, o) {
                        $scope.dispatcherItem.cronMin = $scope.dispatcherItem.cronMin.concat(parseInt(o.name));
                    })
                } else if ($scope.dispatcherItem.cronMinuteStatus == '每分') {
                    $scope.dispatcherItem.cronMin = '';
                }
            };
            $scope.changeHour = function() {
                if ($scope.dispatcherItem.cronHourStatus == '指定') {
                    $scope.dispatcherItem.cronHour = [];
                    var list = _.where($scope.dispatcherItem.hourList, {checked: true});
                    $.each(list, function(i, o) {
                        $scope.dispatcherItem.cronHour = $scope.dispatcherItem.cronHour.concat(parseInt(o.name));
                    })
                } else if ($scope.dispatcherItem.cronHourStatus == '每时') {
                    $scope.dispatcherItem.cronHour = '';
                }
            };
            $scope.changeDay = function() {
                if ($scope.dispatcherItem.cronDayStatus == '指定') {
                    $scope.dispatcherItem.cronDay = [];
                    var list = _.where($scope.dispatcherItem.dayList, {checked: true});
                    $.each(list, function(i, o) {
                        $scope.dispatcherItem.cronDay = $scope.dispatcherItem.cronDay.concat(parseInt(o.name));
                    })
                } else if ($scope.dispatcherItem.cronDayStatus == '每天') {
                    $scope.dispatcherItem.cronDay = '';
                }
            };
            $scope.changeMonth = function() {
                if ($scope.dispatcherItem.cronMonthStatus == '指定') {
                    $scope.dispatcherItem.cronMouth = [];
                    var list = _.where($scope.dispatcherItem.monthList, {checked: true});
                    $.each(list, function(i, o) {
                        $scope.dispatcherItem.cronMouth = $scope.dispatcherItem.cronMouth.concat(parseInt(o.name));
                    })
                } else if ($scope.dispatcherItem.cronMonthStatus == '每月') {
                    $scope.dispatcherItem.cronMouth = '';
                }
            };
            $scope.changeWeek = function() {
                if ($scope.dispatcherItem.cronWeekStatus == '指定') {
                    $scope.dispatcherItem.cronWeek = [];
                    var list = _.where($scope.dispatcherItem.weekList, {checked: true});
                    $.each(list, function(i, o) {
                        $scope.dispatcherItem.cronWeek = $scope.dispatcherItem.cronWeek.concat(o.name);
                    })
                } else if ($scope.dispatcherItem.cronWeekStatus == '每周') {
                    $scope.dispatcherItem.cronWeek = '';
                }
            };

            $scope.changeYear = function() {
                if ($scope.dispatcherItem.cronYearStatus != '每年') {
                    $scope.dispatcherItem.cronYear = ($scope.startYear + '-' + $scope.endYear)
                }
            };

            $scope.clickSecond = function(day) {
                if ($scope.dispatcherItem.cronSecondStatus == '指定') {
                    if (day.checked == true) {
                        $scope.dispatcherItem.cronSecond = _.unique($scope.dispatcherItem.cronSecond.concat(parseInt(day.name)));
                    } else {
                        $.each($scope.dispatcherItem.cronSecond, function(i, o) {
                            if (o == day.name) {
                                $scope.dispatcherItem.cronSecond.splice(i, 1);
                            }
                        })
                    }
                }
            };

            $scope.changeStartYear = function() {
                if ($scope.dispatcherItem.cronYearStatus != '每年') {
                    $scope.dispatcherItem.cronYear = ($scope.startYear + '-' + $scope.endYear)
                }
            };

            $scope.changeEndYear = function() {
                if ($scope.dispatcherItem.cronYearStatus != '每年') {
                    $scope.dispatcherItem.cronYear = ($scope.startYear + '-' + $scope.endYear)
                }
            };

            $scope.clickMinute = function(day) {
                if ($scope.dispatcherItem.cronMinuteStatus == '指定') {
                    if (day.checked == true) {
                        $scope.dispatcherItem.cronMin = _.unique($scope.dispatcherItem.cronMin.concat(parseInt(day.name)));
                    } else {
                        $.each($scope.dispatcherItem.cronMin, function(i, o) {
                            if (o == day.name) {
                                $scope.dispatcherItem.cronMin.splice(i, 1);
                            }
                        })
                    }
                }
            };
            $scope.clickHour = function(day) {
                if ($scope.dispatcherItem.cronHourStatus == '指定') {
                    if (day.checked == true) {
                        $scope.dispatcherItem.cronHour = _.unique($scope.dispatcherItem.cronHour.concat(parseInt(day.name)));
                    } else {
                        $.each($scope.dispatcherItem.cronHour, function(i, o) {
                            if (o == day.name) {
                                $scope.dispatcherItem.cronHour.splice(i, 1);
                            }
                        })
                    }
                }
            };
            $scope.clickDay = function(day) {
                if ($scope.dispatcherItem.cronDayStatus == '指定') {
                    if (day.checked == true) {
                        $scope.dispatcherItem.cronDay = _.unique($scope.dispatcherItem.cronDay.concat(parseInt(day.name)));
                    } else {
                        $.each($scope.dispatcherItem.cronDay, function(i, o) {
                            if (o == day.name) {
                                $scope.dispatcherItem.cronDay.splice(i, 1);
                            }
                        })
                    }
                }
            };
            $scope.clickWeek = function(day) {
                if ($scope.dispatcherItem.cronWeekStatus == '指定') {
                    if (day.checked == true) {
                        $scope.dispatcherItem.cronWeek = _.unique($scope.dispatcherItem.cronWeek.concat(day.name));
                    } else {
                        $.each($scope.dispatcherItem.cronWeek, function(i, o) {
                            if (o == day.name) {
                                $scope.dispatcherItem.cronWeek.splice(i, 1);
                            }
                        })
                    }
                }
            };
            $scope.clickMonth = function(day) {
                if ($scope.dispatcherItem.cronMonthStatus == '指定') {
                    if (day.checked == true) {
                        $scope.dispatcherItem.cronMouth = _.unique($scope.dispatcherItem.cronMouth.concat(parseInt(day.name)));
                    } else {
                        $.each($scope.dispatcherItem.cronMouth, function(i, o) {
                            if (o == day.name) {
                                $scope.dispatcherItem.cronMouth.splice(i, 1);
                            }
                        })
                    }
                }
            };

            $scope.back = function() {
                $state.go('system.dispatcher');
            };

            $scope.addServer = function() {
                if ($scope.typeStatus != '') {
                    $scope.serverList.push({servicename: '', service: ''})
                } else {
                    index++;
                    var addServer = $('#addServerInput');
                    addServer.append('<label>服务名称：</label>' +
                    '<input class="form-control" style="width:400px; margin-left:4px;" id="dispatcherFormEventName' + index + '" type="text" ng-model="dispatcherFormEventName ' + index + '" required/>' +
                    '<label style="margin-left: 5px;">执行服务名：</label>' +
                    '<input class="form-control" style="width:400px; margin-left:7px;" id="dispatcherFormEvent' + index + '" type="text" ng-model="dispatcherFormEvent ' + index + '" required/>');
                }
            };

            $scope.getSydispatcherdtl = function() {
                if ($scope.typeStatus != '') {
                    $scope.serverList = $scope.serverList;
                } else {
                    var list = [];
                    for (var i = 0; i <= index; i++) {
                        var eventName = $('#dispatcherFormEventName' + i).val();
                        var event = $('#dispatcherFormEvent' + i).val();
                        list.push({servicename: eventName, service: event});
                    }
                    $scope.serverList = list;
                }
            };

            $scope.filterTime = function() {
                if ($scope.dispatcherItem.cronSecond == '') {
                    $scope.dispatcherItem.cronSecond = '*';
                }
                if ($scope.dispatcherItem.cronMin == '') {
                    $scope.dispatcherItem.cronMin = '*';
                }
                if ($scope.dispatcherItem.cronHour == '') {
                    $scope.dispatcherItem.cronHour = '*';
                }
                if ($scope.dispatcherItem.cronMouth == '') {
                    $scope.dispatcherItem.cronMouth = '*';
                }
                if ($scope.dispatcherItem.cronYearStatus == '每年') {
                    $scope.dispatcherItem.cronYear = '*';
                } else {
                    $scope.dispatcherItem.cronYear = [];
                    for (var i = $scope.startYear; i <= $scope.endYear; i++) {
                        $scope.dispatcherItem.cronYear.push(i);
                    }
                }
                if($scope.dispatcherItem.cronWeekStatus == '每周' && $scope.dispatcherItem.cronDayStatus != '每天') {
                    $scope.dispatcherItem.cronWeek = '?';
                }
                if($scope.dispatcherItem.cronWeekStatus != '每周' && $scope.dispatcherItem.cronDayStatus == '每天') {
                    $scope.dispatcherItem.cronDay = '?';
                    $scope.dispatcherItem.cronWeek = [];
                    $.each($scope.dispatcherItem.weekList, function(i, o) {
                        if (o.checked == true) {
                            $scope.dispatcherItem.cronWeek.push(o.value);
                        }
                    })
                }

                if($scope.dispatcherItem.cronWeekStatus == '每周' && $scope.dispatcherItem.cronDayStatus == '每天') {
                    $scope.dispatcherItem.cronDay = '*';
                    $scope.dispatcherItem.cronWeek = '?';
                }

                if($scope.dispatcherItem.cronWeekStatus != '每周' && $scope.dispatcherItem.cronDayStatus != '每天') {
                    $scope.dispatcherItem.cronWeek = '?';
                }
            };

            $scope.save = function() {
                $scope.getSydispatcherdtl();
                $scope.filterTime();
                var data = {
                    rows: {
                        id: $scope.updateId,
                        type: 'cron',
                        name: $scope.dispatcherTitle,
                        second: $scope.dispatcherItem.cronSecond,
                        minute: $scope.dispatcherItem.cronMin,
                        hour: $scope.dispatcherItem.cronHour,
                        day: $scope.dispatcherItem.cronDay,
                        week: $scope.dispatcherItem.cronWeek,
                        month: $scope.dispatcherItem.cronMouth,
                        year: $scope.dispatcherItem.cronYear,
                        sydispatcherdtl: $scope.serverList,
                        //repeattime: $scope.dispatcherRepeatCount,
                        status: 'P'
                    }
                };
                iAjax
                    .post('sys/web/Sydispatcher.do?action=updateSydispatcher', data)
                    .then(function(data) {
                        if (data.status == '1') {
                            $state.go('system.dispatcher');
                            showMessage(1, '添加成功!');
                            $scope.$parent.init();
                        }
                    })
            };

            function showMessage(level, content) {
                var json = {};
                json.id = new Date();
                json.title = $scope.title;
                json.content = content;
                json.level = level;
                iMessage.show(json);
            }

        }
    ])
});
