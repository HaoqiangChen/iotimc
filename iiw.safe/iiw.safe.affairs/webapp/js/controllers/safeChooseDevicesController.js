/**
 * 选择设备
 *
 * Created by YBW on 2017/4/10.
 */
define(['app'], function(app) {
    app.controller('safeChooseDevicesController', [
        '$scope',
        'iAjax',
        '$uibModalInstance',
        '$rootScope',
        'iMessage',
        'iTimeNow',
        function($scope, iAjax, $uibModalInstance, $rootScope, iMessage, iTimeNow){

        var timeout = null;
        $scope.device = {
            list: [],
            params: {
                pageNo: 0,
                pageSize: 15,
                totalSize: 0,
                totalPage: 0
            },
            type: [],
            company: [],
            filter: {
                company: '',
                searchText: '',
                type: ''
            },

            //获取设备列表
            getList: function() {
                iAjax.post('security/device.do?action=getDevice', {
                    params: this.params,
                    filter: this.filter
                }).then(function(data) {

                    if(data.result && data.result.rows) {

                        $scope.device.list = data.result.rows;
                        if(data.result.params) {
                            $scope.device.params = data.result.params;
                        }

                    }

                }, function() {
                    remind(4, '网络连接出错');
                });
            },

            //获取设备类型
            getDeviceType: function() {
                iAjax.post('security/deviceCode.do?action=getDevicecodeType').then(function(data) {

                    if(data.result && data.result.rows) {
                        $scope.device.type = data.result.rows;
                    }

                }, function() {
                    remind(4, '网络连接出错');
                });
            },
            path: '',
            ids: {},

            //添加设备
            addID: function(data) {

                this.ids[data.id] = true;
                $rootScope[this.path](data, 'add');

                if(this.way != 'single') {
                    $uibModalInstance.close();
                }

            },

            //删除设备
            delId: function(data) {

                delete this.ids[data.id];
                $rootScope[this.path](data, 'del');

            },
            close: function() {
                $uibModalInstance.close();
            },
            way: ''
        };

        $scope.$watch('device.filter.type', function(data) {


            if(data == undefined) {
                $scope.device.filter.type = '';
                $scope.device.filter.company = '';
                $scope.device.company = [];
            } else {
                var obj = _.where($scope.device.type, {content: data})[0];

                if(obj && obj.child) {
                    $scope.device.company = obj.child;
                }
            }
            $scope.device.getList();

        });

        $scope.$watch('device.filter.company', function(data) {
            $scope.device.getList();

            if(data == undefined) {
                $scope.device.filter.company = '';
            }
        });

        $scope.$watch('device.filter.searchText', function() {
            if(timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function() {
                $scope.device.getList();
            }, 500);
        });

        //解析初始化数据
        if($rootScope.iiwSafeChooseDevice) {
            
            var array = $rootScope.iiwSafeChooseDevice.split(',');
            if(array && array.length) {

                $scope.device.path = array.splice(0, 1);

                if(array[array.length - 1] == 'single') {
                    $scope.device.way = array.splice(array.length - 1, 1);
                }

                $.each(array, function(i, o) {
                    $scope.device.ids[o] = true;
                })
            }
        }


        $scope.device.getList();
        $scope.device.getDeviceType();

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
    }]);
});
