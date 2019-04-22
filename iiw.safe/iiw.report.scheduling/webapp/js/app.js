/**
 * Created by chq on 2019-12-03.
 */
define([
    'app',
    'cssloader!report/scheduling/css/index'
], function (app) {
    app.controller('reportSchedulingController', ['$scope', 'iAjax', 'iMessage', 'iTimeNow', function ($scope, iAjax, iMessage, iTimeNow) {

        var _role;
        $scope.syoufk = '';
        $scope.syouname = '';
        $scope.formTitle = $scope.syouname + '视频调度登记表';
        $scope.formTime = iTimeNow.getTime();

        $scope.getScheduling = function () {
            var url, data;
            hasScheduling(function (role) {
                _role = role;
                if (_role) {
                }
            })
        };

        function getSyou() {
            iAjax.post('/security/common/monitor.do?action=getSyouDetail').then(function (syou) {
                if (syou.status === 1 && syou.result.rows) {
                    $scope.syoufk = syou.result.rows[0].id;
                    $scope.syouname = syou.result.rows[0].syouname;
                }
            })
        }

        function hasScheduling(callback) {
            iAjax.post('/security/check/check.do?action=getSpecialrole', {filter: {url: ['hasScheduling']}}).then(function (data) {
                if (data.status === 1 && data.result.rows.hasScheduling === '1') {
                    callback(1)
                } else {
                    callback(0)
                }
            })
        }

        function getScheduling() {
            iAjax.post('/security/infomanager/counter.do?action=getzhdd', {filter: {}}).then(function (data) {
                if (data.status === 1 && data.result.rows) {
                    console.log(data);
                    var list = data.result.rows, evenList = [], oddList = [];
                    _.each(list, function (item, index) {
                        if (index % 2 === 0) {
                            evenList.push(item);
                        } else {
                            oddList.push(item);
                        }
                    });
                    _.map(oddList, function (odd) {
                        odd.syouname1 = odd.syouname;
                        odd.pbbc1 = odd.pbbc;
                        odd.name1 = odd.name;
                        delete odd.syouname;
                        delete odd.pbbc;
                        delete odd.name;
                    });
                    _.map(evenList, function (_e, _ei) {
                        _.map(oddList, function (_o, _oi) {
                            if (_ei === _oi) {
                                _e = _.extend(_e, _o);
                            }
                        })
                    });
                    $scope.list = evenList;
                    $scope.leaderCount = data.result.leaderCount;
                    $scope.policeCount = data.result.policeCount;
                } else {
                }
            })
        }

        $scope.print = function () {
            window.print();
        };

        $scope.$on('reportSchedulingControllerOnEvent', function () {
            getSyou();
            // $scope.getScheduling();
            getScheduling();
        });

    }]);
});