/**
 * 视频点名登记表
 *
 * Created by chq on 2019/7/25.
 */
define(['app', 'cssloader!safe/rollcallRegister/css/index'], function (app) {
    app.controller('safeRollcallGisterController', ['$scope', 'iMessage', 'iTimeNow', 'iAjax', '$filter', 'iConfirm', '$state', 'iToken',
        function ($scope, iMessage, iTimeNow, iAjax, $filter, iConfirm, $state, iToken) {
            $scope.rollcall = {
                list: [],
                newcon: {},
                path: $.soa.getWebPath('iiw.safe'),
                syoufk: '',
                // dutytime: $filter('date')(new Date().getTime(), 'yyyy年MM月dd日'),
                dutytime: '2019年08月05日',
                getList: function () {
                    let time = this.dutytime.replace(/[^0-9]/ig, '-').substring(0, this.dutytime.length - 1);
                    iAjax
                        .post('/security/information/datainfo.do?action=getRollCallRegisterListByDutytime', {
                            filter: {
                                dutytime: time
                            }
                        })
                        .then(function (data) {
                            console.log(data);
                            if (data.result && data.result.rows) {
                                $scope.rollcall.list = data.result.rows;
                                if ($scope.rollcall.list.length) {
                                    $scope.rollcall.list.forEach((item, index) => {
                                        if (item.alias === '新康监狱') {
                                            $scope.rollcall.newcon = item;
                                            console.log($scope.rollcall.newcon);
                                            console.log(typeof $scope.rollcall.newcon);
                                            console.log(!$scope.rollcall.newcon);
                                            $scope.rollcall.list.splice(index, 1);
                                        } else if (item.alias === '未管所') {
                                            [$scope.rollcall.list[index], $scope.rollcall.list[$scope.rollcall.list.length - 2]] = [$scope.rollcall.list[$scope.rollcall.list.length - 2], $scope.rollcall.list[index]];
                                        }
                                    })
                                }
                            }
                        });
                },
                getCount: function () {
                    iAjax
                        .post('/security/information/information.do?action=getDutyInfoCount', {
                            // type: 'JIANYU',
                            syoufk: this.syoufk
                        })
                        .then(function (data) {
                            console.log(data);
                        });
                }
            };

            $scope.$on('safeRollcallGisterControllerOnEvent', function () {
                $scope.rollcall.getList();
                $scope.rollcall.getCount();
            });
        }
    ]);
});
