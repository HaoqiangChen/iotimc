/**
 * 咨询库管理
 *
 * Created by ybw on 2017/6/17.
 */
define([
    'app',
    'cssloader!safe/aidDecision/css/index'
], function (app) {
    app.controller('aidDecisionController', [
        '$scope',
        'safeMainTitle',
        'iMessage',
        'iTimeNow',
        'iAjax',
        'iConfirm',
        '$state',
        '$filter',
        function ($scope, safeMainTitle, iMessage, iTimeNow, iAjax, iConfirm, $state, $filter) {
            $scope.decision = {
                path: $.soa.getWebPath('iiw.safe'),
                list: [],
                type: [],
                state: function (path, rows) {
                    if (rows) {
                        $state.params = {
                            data: rows
                        };
                        $state.go(path, $state.params);
                    } else {
                        $state.params = {
                            data: null
                        };
                        $state.go(path, $state.params);
                    }
                },
                params: {
                    pageNo: 1,
                    pageSize: 15
                },
                filter: {
                    starttime: '',
                    endtime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm'),
                    searchText: '%',
                    status: '%',
                    company: '',
                    lvl: '',
                    lvlname: ''
                },
                delId: '',
                keyup: function (e) {
                    if (e.keyCode == 13) {
                        this.getList();
                    }
                },
                getList: function () {
                    if (!this.filter.starttime) delete this.filter.starttime;
                    iAjax.post('/security/alarm/alarm.do?action=getAlarmList', {
                        params: this.params,
                        filter: this.filter
                    }).then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.decision.list = data.result.rows;

                            if (data.result.params) {
                                $scope.decision.params = data.result.params;
                            }
                        }
                    })
                }
            };

            function remind (level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒！'),
                    level: level,
                    content: (content || '')
                };
                iMessage.show(message, false);
            }

            $scope.$on('aidDecisionControllerOnEvent', function () {
                $scope.decision.getList();
            });

        }
    ]);
});
