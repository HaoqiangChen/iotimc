/**
 * 
 * @author : lhm
 * @version : 1.0
 * @date : 2019-05-10
*/
define([
    'app',
], function (app) {
    app.controller('safeAffairsPluginsController', ['$rootScope', '$scope', 'iMessage', '$state', 'iAjax', 'iTimeNow', 'iConfirm', '$timeout',
        function ($rootScope, $scope, iMessage, $state, iAjax, iTimeNow, iConfirm, $timeout) {
            var result;
            $scope.$on('ws.localPolling', function (e, data) {
                result = data;

                $scope.getAffairsTipsType()
                    .then(function (AffairsData) {
                        if(AffairsData.result.rows[0].content == '1'){
                            remind(1, "点击查看监控轮巡", "到点提示")
                        }
                    })
            });

            $scope.getAffairsTipsType = function(){
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
            };

            // var id = iTimeNow.getTime();
            $scope.time = 60000;
            $scope.ctrl = false; //是否已在弹窗点击

            function remind(level, content, title) {
                if ($state.current.name == "safe.monitorcenter") {
                    $rootScope.$broadcast('camera.safeMonitorcenter.hideAll');
                }
               var mdoe = iConfirm.show({
                    scope: $scope,
                    title: '日常事务提醒',
                    content: '是否进入监视查询,如60秒无操作将自动进入监视查询',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmDelUser'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });

                setTimeout(function () {
                    if ($scope.ctrl == false) {

                        $scope.confirmDelUser(mdoe)
                    }
                }, $scope.time);
            }

            $scope.confirmDelUser = function (id) {
                iConfirm.close(id);
                $scope.ctrl = true;
                $scope.lunxun();
            };

            $scope.lunxun = function(){
                $state.params = {
                    data: result
                };
                if ($state.current.name == "safe.monitorcenter") {
                    $rootScope.$broadcast('camera.safeMonitorcenter', result);
                    $rootScope.$broadcast('camera.safeMonitorcenter.showAll');
                } else if ($state.current.name == "safe.datavisual.gzaf") {
                    $scope.layoutService.modules.open('safe.monitorcenter', $state.params, "监控中心", null);
                } else {
                    $state.go('safe.monitorcenter', $state.params);
                }
            }

            $scope.confirmClose = function (id) {
                iConfirm.close(id);
                $scope.ctrl = true;
                if ($state.current.name == "safe.monitorcenter") {
                    $rootScope.$broadcast('camera.safeMonitorcenter.showAll');
                }
            }
        }
    ]);

    return 'safeAffairsPluginsController';
});