/**
 * 选择设备服务
 *
 * Created by YBW on 2017/4/10.
 */
define([
    'app',
    'cssloader!safe/eventRegister/css/safeGetData',
    'safe/eventRegister/js/controllers/safeGetDataController'
], function(app) {
    app.factory('safeGetData', ['$uibModal', function($uibModal) {
        var setData = {'path': 'string', 'item': 'object',  'parentId': 'string',  'treeChild': 'string'};
        function getTemplate(url) {
            var result = '';

            $.ajax({
                url: url,
                async: false,
                cache: false,
                dataType: 'text'
            }).success(function(data) {
                result = data;
            });

            return result;
        }

        function _init(data) {
            for(var k in setData) {
                if(data[k]) {
                    switch (setData[k]){
                        case 'string':
                            if(typeof data[k] == 'string') {
                                this.data[k] = data[k];
                            } else {
                                console.error('请查看'+ k +'是否为字符串');
                            }
                            break;
                        case 'object':
                            if(data[k] instanceof Object) {
                                this.data[k] = data[k];
                            } else {
                                console.error('请查看'+ k +'是否为对象');
                            }
                            break;
                    }
                }
            }
        }

        function _getDeviceData(callback, way, data) {
            show(callback, this.data, 'device', way, data);
        }

        function _getUserData(callback, way, data) {
            show(callback, this.data, 'user', way, data);
        }

        function _getSyouData(callback, way) {
            show(callback, this.data, 'syou', way);
        }

        function show(callback, init, target, way, data) {

            $uibModal.open({
                controller: 'safeGetDataController',
                windowClass: 'iiw-safe-modal-get-data-' + target,
                size: 'lg',
                template: getTemplate($.soa.getWebPath('iiw.safe.eventRegister') + '/view/SafeGetData.html'),
                resolve: {
                    callback: function() {
                        return callback;
                    },
                    getType: function() {
                        return target;
                    },
                    way: function() {
                        return way;
                    },
                    lastData: function() {
                        return data;
                    },
                    deploy: function() {
                        return init;
                    }
                }
            });

        }

        return {
            getDeviceData: _getDeviceData,
            getUserData: _getUserData,
            getSyouData: _getSyouData,
            init: _init,
            data: {}
        };
    }]);
});
