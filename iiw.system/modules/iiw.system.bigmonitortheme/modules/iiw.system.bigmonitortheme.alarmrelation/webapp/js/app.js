/**
 * 电视墙模式管理—默认报警联动电视墙模式设置
 *
 * Created by dwt on 2016-11-14
 */
define([
    'app',
    'cssloader!system/bigmonitortheme/css/index',
    'cssloader!system/bigmonitortheme/alarmrelation/css/index'
], function(app) {
    app.controller('bigmonitorthemeAlarmRelationController', [
        '$scope',
        'iAjax',
        '$state',
        'iMessage',
        '$stateParams',
        function($scope, iAjax, $state, iMessage, $stateParams) {

            $scope.back = function() {
                $scope.$parent.title = '电视墙模式管理—列表';
                var params = {data: null};
                $state.params = params;
                $state.go('system.bigmonitortheme', params);
            };

            if(!$stateParams || !$stateParams.data) {
                $scope.back();
                return;
            }

            $scope.obj = $stateParams.data.obj;
            $scope.bigmonitorfk = $stateParams.data.bigmonitorfk;
            $scope.bigmonitorName = $stateParams.data.bigmonitorName;
            $scope.alarmRelatedTheme = $stateParams.data.alarmRelatedTheme;

            $scope.loadingRelation = false;
            $scope.oRelated = {};
            $scope.toggleRelated = function(seq) {
                $scope.oRelated[seq] = $scope.oRelated[seq] ? false : true;
            };

            $scope.init = function() {
                if($scope.alarmRelatedTheme && $scope.alarmRelatedTheme.bigmonitorthemefk == $scope.obj.id) {
                    _.each($scope.alarmRelatedTheme.screen, function(screen) {
                        $scope.oRelated[screen] = true;
                    });
                }
            };

            $scope.save = function() {

                var aScreen = [];
                for(var key in $scope.oRelated) {
                    if($scope.oRelated[key]) {
                        aScreen.push(key);
                    }
                }

                var url = 'security/devicemonitor.do?action=addAlarmTheme',
                    data = {
                        filter: {
                            devicefk: $scope.bigmonitorfk,
                            bigmonitorthemefk: $scope.obj.id,
                            screen: aScreen
                        }
                    };

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.status == '1') {
                            iMessage.show({
                                level: 1,
                                title: '消息提醒',
                                content: '报警关联默认电视墙模式保存成功',
                                timeout: 3000
                            });

                            $scope.$parent.modelManage.getModelList($scope.bigmonitorfk);
                            $scope.$parent.modelManage.getAlarmTheme($scope.bigmonitorfk);
                            $scope.$parent.title = '电视墙模式管理—列表';
                            var params = {data: null};
                            $state.params = params;
                            $state.go('system.bigmonitortheme', params);
                        }
                    });
            };

            //初始化
            $scope.init();

        }]);
});