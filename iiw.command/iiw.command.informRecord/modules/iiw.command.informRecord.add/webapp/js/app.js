/**
 * 进出监登记
 *
 * Created by chq on 2019/7/15.
 */
define([
    'app',
    'cssloader!command/informRecord/add/css/index',
    'cssloader!command/informRecord/add/css/input-style'
], function (app) {
    app.controller('informRecordAddController', [
        '$scope',
        '$filter',
        'iTimeNow',
        'iAjax',
        'CMessage',
        'iToken',
        '$http',
        '$state',
        '$stateParams',
        'iConfirm',
        'iMessage',
        function ($scope, $filter, iTimeNow, iAjax, CMessage, iToken, $http, $state, $stateParams, iConfirm, iMessage) {

            $scope.rollcallAdd = {
                save: {
                    dutytime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd'), // 登记日期
                    // 各个下级监狱单位传以下参数数据
                    total: 0,// 押犯总数
                    inmates: 0,// 在押人数
                    outcriminal: 0,// 暂予监外 执行人数
                    newcon: 0,// 监外住院 (新康住院)
                    social: 0,// 监外住院 (社会医院)
                    allnewin: 0,// 总新收押犯
                    allrelease: 0,// 总释放人数
                    newin11: 0,// 新收押犯 11时
                    newin16: 0,// 新收押犯 16时
                    release11: 0,// 释放人数 11时
                    release16: 0,// 释放人数 16时
                    police: 0,// 狱内执勤警力
                    isorder: "正常",// 是否正常
                    reportername: "",// 报告人姓名
                    reporterduty: "",// 报告人职务
                    note: "",// 备注

                    // 新康共押传以下参数数据
                    prisoncriminal: 0,// 本监罪犯
                    hospitalcriminal: 0,// 住院罪犯
                    suspect: 0,// 在押嫌疑人
                    newescortmale: 0,// 新收押陪护犯 (男)
                    newescortfemale: 0,// 新收押陪护犯 (女)
                    newsickmale: 0,// 新收押病犯 (男)
                    newsickfemale: 0,// 新收押病犯 (女)
                    newsuspectmale: 0,// 新收押嫌疑人 (男)
                    newsuspectfemale: 0,// 新收押嫌疑人 (女)
                    releasemale: 0,// 释放 (男)
                    releasefemale: 0,// 释放 (女)

                    // 未成年加多以下几个参数
                    femalecriminal: 0,// 女犯
                    underage: 0,// 未成年
                    accept: 0,// 收容
                },
                cancel: function () {
                    $state.go('command.informRecord');
                },
                submit: function (item) {
                    var data = {
                        dtl: {},
                        rows: [$scope.rollcallAdd.save]
                    };
                    iAjax.post('/security/information/datainfo.do?action=addRollCallRegister', data).then(function (data) {
                        if (data.status == 1) {
                            iMessage.show({
                                level: 2,
                                title: `视频点名登记`,
                                content: `${$scope.rollcallAdd.save.syouname}视频点名登记成功！`
                            });
                            $state.go('command.informRecord');
                            $scope.$parent.rollcall.getList();
                        } else {
                            iMessage.show({
                                level: 4,
                                title: `视频点名登记`,
                                content: `${$scope.rollcallAdd.save.syouname}视频点名登记失败！`
                            })
                        }
                    });
                }
            };

            $scope.params = {
                pageNo: 1,
                pageSize: 10
            };

            function _remind (level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒！'),
                    level: level,
                    content: (content || '')
                };
                iMessage.show(message, false);
            }

            $scope.$on('informRecordAddControllerOnEvent', function () {
                if ($scope.$parent.rollcall.editObj) {
                    $scope.rollcallAdd.save = $scope.$parent.rollcall.editObj;
                } else {
                }
            });
        }
    ]);
});
