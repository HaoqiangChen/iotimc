/**
 * Created by YJJ on 2016-08-12.
 */
define([
    'app',
    'cssloader!debugger/hardware/css/index'
], function (app) {
    app.controller('debuggerHardwareController', ['$scope', 'iAjax', 'iMessage', function($scope, iAjax, iMessage) {
        $scope.type = 'alarm';
        $scope.data = {
            alarm: [],
            control: []
        };

        $scope.list = [];

        $scope.menu = [{
            id: 'alarm',
            name: '报警模拟',
            active: true
        }, {
            id: 'control',
            name: '设备控制',
            active: false
        }];

        $scope.view = function(row) {
            $.each($scope.menu, function(i, o) {
                o.active = false;
            });

            row.active = true;
            $scope.type = row.id;
            $scope.result = '';

            $scope.initrow();
        };

        $scope.get = function() {
            if(window.localStorage) {
                var temp = window.localStorage.getItem('IMC_DEBUGGER_HARDWARE_DATA');
                if(temp) {
                    temp = JSON.parse(temp);
                    if(temp && temp.alarm && temp.control) {
                        $scope.data = temp;
                    }
                }
            }
        };

        $scope.save = function() {
            console.log(JSON.stringify($scope.data));

            if(window.localStorage) {
                window.localStorage.setItem('IMC_DEBUGGER_HARDWARE_DATA', JSON.stringify($scope.data));

                iMessage.show({
                    level: 1,
                    title: '成功',
                    content: '数据暂存成功！'
                });
            }
        };

        $scope.addrow = function() {
            $scope.list.push({});
        };

        $scope.delrow = function(index) {
            if($scope.list.length) {
                $scope.list.splice(index, 1);
            }

            $scope.initrow();
        };

        $scope.initrow = function() {
            if($scope.data && $scope.data[$scope.type]) {
                $scope.list = $scope.data[$scope.type];

                if(!$scope.list.length) {
                    if($scope.type == 'alarm') {
                        $scope.list.push({
                            alarmstr: '报警'
                        });
                    } else {
                        $scope.list.push({});
                    }
                }
            }
        };

        $scope.alarm = function (row) {
            if(row.deviceid) {
                $scope.result = '';

                iAjax.post('hardware/tmpdevice.do?action=doalarm', {
                    deviceid: row.deviceid,
                    alarmstr: row.alarmstr
                }).then(showResult, showResult);

                function showResult(data) {
                    $scope.result = JSON.stringify(data, null, '\t');
                }
            } else {
                iMessage.show({
                    level: 3,
                    title: '警告',
                    content: '请输入设备ID后再进行[触发报警]！'
                });
            }
        };

        $scope.control = function (row) {
            if(row.deviceid) {
                $scope.result = '';

                iAjax.post('hardware/tmpdevice.do?action=doaction', {
                    deviceid: row.deviceid,
                    action: row.action,
                    args: row.args | ''
                }).then(showResult, showResult);

                function showResult(data) {
                    $scope.result = JSON.stringify(data, null, '\t');
                }
            } else {
                iMessage.show({
                    level: 3,
                    title: '警告',
                    content: '请输入设备ID后再进行[发送命令]！'
                });
            }
        };

        $scope.syouList = [];
        $scope.vendorList = [];
        $scope.params = { pageNo: 0, pageSize: 10 };
        $scope.filter = {
            type: "alarm",
            cascade: 'Y',
            mapfk: "00000000000000000000000000000000",
            queryType: "ou",
            searchFilter: "",
            searchText: "",
            syoufk: ''
        };

        $scope.getAlarmList = function () {
            $scope.list = []
            iAjax.post('/security/device/device.do?action=getDeviceActionOuList', {params: $scope.params, filter: $scope.filter}).then(function (res) {
                if (res.result.rows && res.result.rows.length) {
                    $scope.params = res.result.params;
                    $scope.list = res.result.rows;
                    _.map($scope.list, function (item) {
                        item.deviceid = item.id;
                        item.alarmstr = item.name + '模拟报警';
                    })
                }
            })
        };
        $scope.keyup = function (e) {
            if (e.keyCode == 13) {
                $scope.getAlarmList();
            }
        };
        function init() {
            getSyouAll();
            getVendorList();
            $scope.get();
            $scope.initrow();
        }
        function getSyouAll() {
            iAjax.post('/sys/web/syou.do?action=getOu4Type',{filter: {type: ['JIANYU', 'JQ']}}).then(function (data) {
                $scope.syouList = data.result.rows;
            }).then(function () {
                iAjax.post('/security/common/monitor.do?action=getSyouDetail', {}).then(function (data) {
                    $scope.filter.syoufk = data.result.rows[0].id;
                });
            }).then(function () {
                $scope.getAlarmList()
            })
        }
        function getVendorList() {
            iAjax.post('/security/device/device.do?action=getTypeCompanys', {filter: {type: "alarm"}})
                .then(function (res) { // 用 type 参数传不同类型标识过滤
                    if (res.result.rows && res.result.rows.length) {
                        $scope.vendorList = res.result.rows;
                    }
            })
        }

        init();

        function timestampToTime(timestamp) {
            var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
            return Y+M+D+h+m+s;
        }

        console.log(timestampToTime(1587465420000))

    }]);
});
