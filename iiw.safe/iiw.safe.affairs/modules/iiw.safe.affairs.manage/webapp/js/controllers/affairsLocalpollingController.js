/**
 * 选择轮巡组
 *
 * Created by HJ on 2018/6/12.
 */
define(['app'], function(app) {
    app.controller('affairsLocalpollingController', [
        '$scope',
        'iAjax',
        '$uibModalInstance',
        '$rootScope',
        'iMessage',
        'iTimeNow',
        function($scope, iAjax, $uibModalInstance, $rootScope, iMessage, iTimeNow) {
            $scope.polling = {
                list: [],
                reList: [],
                filter: {
                    searchText: ''
                },
                //获取轮巡组列表
                getList: function() {
                    iAjax.post('/security/polling/polling.do?action=getPollingList', {}).then(function(data) {
                        if(data && data.result.rows) {
                            $scope.polling.list = data.result.rows;
                            $scope.polling.reList = [];
                            initData();
                        }
                    }, function() {
                        remind(4, '网络连接出错');
                    });
                },
                //添加轮巡组
                addList: function(data) {
                    var inlist = _.findWhere($scope.polling.reList, {id: data.id});

                    if(!inlist) {
                        data.inlist = true;
                        $scope.polling.reList.push({
                            type: 'local',
                            typename: data.typename,
                            name: data.name,
                            id: data.id
                        });
                    }

                    $rootScope.iiwSafeLocalpolling = this.reList;
                    broadcast(this.reList);
                },
                //删除轮巡组
                delList: function(data) {
                    var inlist = _.findWhere($scope.polling.reList, {id: data.id});

                    if(inlist) {
                        data.inlist = false;
                        $scope.polling.reList = _.reject($scope.polling.reList, {id: data.id});
                    }

                    $rootScope.iiwSafeLocalpolling = this.reList;
                    broadcast(this.reList);
                },
                close: function() {
                    $uibModalInstance.close();
                }
            };

            init();

            // 初始化
            function init() {
                $scope.polling.getList();
            }

            //解析初始化数据
            function initData() {
                if($rootScope.iiwSafeLocalpolling) {
                    $scope.polling.reList = $rootScope.iiwSafeLocalpolling;

                    _.each($scope.polling.reList, function(list) {
                        _.each($scope.polling.list, function(val) {
                            if(val.id == list.id) {
                                val.inlist = true;
                            }
                        })
                    });
                }
            }

            //信息框
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒'),
                    content: (content || '网络出错'),
                    level: level
                };

                iMessage.show(message, false);
            }

            // 发送轮巡组列表广播
            function broadcast(data) {
                $rootScope.$broadcast('safe.affairs.manager.localpolling', data);
            }

            $scope.$on('safe.affairs.manager.localpolling.clear', function() {
                $scope.polling.reList = [];
            });
        }]);
});
