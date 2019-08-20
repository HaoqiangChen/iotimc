/**
 * 咨询库管理-添加
 *
 * Created by ybw on 2017/6/17.
 */
define([
    'app',
    'cssloader!safe/aidDecision/add/css/index'
], function (app) {
    app.controller('addController', [
        '$scope',
        'safeMainTitle',
        'iMessage',
        'iTimeNow',
        'iAjax',
        'iConfirm',
        '$state',
        '$stateParams',
        function ($scope, safeMainTitle, iMessage, iTimeNow, iAjax, iConfirm, $state, $stateParams) {
            $scope.add = {
                path: $.soa.getWebPath('iiw.safe'),
                cancel: function () {
                    this.save = {};
                    $state.params = {
                        data: null
                    };
                    $state.go('safe.aidDecision', $state.params);
                    $scope.$parent.decision.getList();
                },
                save: {},
                submit: function () {
                    this.save.extra.syalertedfk = this.save.extra.id;
                    delete this.save.extra.id;
                    iAjax.post('/security/alarm/alarm.do?action=saveAlarmRecord', {
                        filter: this.save.extra
                    }).then(function () {
                        remind(1, '提交成功！');
                        $scope.add.cancel();
                    });

                },
                getDecision: function (obj) {
                    iAjax.post('/security/alarm/alarm.do?action=getAlarmRecordDetail', {
                        filter: {id: obj.id}
                    }).then(function (data) {
                        if (data.result && data.result.rows) {
                            obj.extra = data.result.rows;
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

            $scope.$on('addControllerOnEvent', function () {
                if ($stateParams.data) {
                    $scope.add.save = $stateParams.data;
                    $scope.add.getDecision($scope.add.save);
                }
            });

        }
    ]);
});
