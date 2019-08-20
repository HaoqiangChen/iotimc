/**
 * 系统配置模块
 *
 * Created by llx on 2015-10-27.
 */
define([
    'app',
    'cssloader!system/syconfig/css/index.css'
], function(app) {
    app.controller('syconfigController', [
        '$scope',
        'iAjax',
        'iMessage',
        'iTimeNow',

        function($scope, iAjax, iMessage, iTimeNow) {
            $scope.title = '系统配置信息';
            $scope.showBtn = false;
            $scope.syconfigList = [];
            $scope.contentList = [];
            $scope.oKeyList = {};
            $scope.syconfig = {
                save: function() {
                    var list = [];
                    $.each($scope.syconfigList, function(i, o) {
                        if(o._key) {
                            o.content = o._key;
                            list.push(o);
                            $scope.showBtn = false;
                        }
                    });
                    var data = {
                        rows: list
                    };
                    iAjax
                        .post('/sys/web/config.do?action=setConfig', data)
                        .then(function(data) {
                            if(data.status == '1') {
                                var message = {};
                                message.id = iTimeNow.getTime();
                                message.level = 1;
                                message.title = $scope.title;
                                message.content = '修改成功!';
                                iMessage.show(message, false);
                            }
                        });
                },
                cancle: function() {
                    $scope.showBtn = true;
                    getList();
                }
            };

            $scope.selectInfo = function(item) {
                item._key = item.content;
                $.each($scope.syconfigList, function(i, o) {
                    item.content = o.content;
                });
                $scope.showBtn = true;
            };

            $scope.changeKey = function(item) {
                item._key = item.content;
                $scope.showBtn = true;
            };

            $scope.init = function() {
                getList();
                getContentList();
            };

            $scope.init();

            function getList() {
                iAjax
                    .post('/sys/web/config.do?action=getConfig')
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.syconfigList = data.result.rows;
                            $.each($scope.syconfigList, function(i, item) {
                                if(item['inputtype'] == 'combo') {
                                    getContentList(item.key, function(list) {
                                        $scope.oKeyList[item.key] = list;
                                    });
                                }
                            });
                        } else {
                            $scope.syconfigList = [];
                        }
                    })
            }

            function getContentList(type, cb) {
                var data = {
                    filter: {
                        type: type
                    }
                };
                iAjax
                    .post('iotiead/common.do?action=getSycodeList', data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            if(cb && typeof cb === 'function') {
                                cb(data.result.rows);
                                $scope.contentList = data.result.rows;
                            }
                        } else {
                            if(cb && typeof cb === 'function') {
                                cb([]);
                            }
                        }
                    })
            }
        }
    ])
});
