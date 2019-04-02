define([
    'app',
    'cssloader!safe/dataSynchronous/monitor/css/index',
    'cssloader!safe/dataSynchronous/monitor/css/style'
], function (app) {
    app.controller('dataSynchronousMonitorController', ['$rootScope', '$scope', '$state', 'iAjax', 'iMessage', '$filter', 'iToken', 'safeConfigService', 'safeMainTitle', '$timeout',
        function ($rootScope, $scope, $state, iAjax, iMessage, $filter, iToken, safeConfigService, safeMainTitle, $timeout) {

            var terminalServerURL = null;
            safeMainTitle.title = '数据同步管理';

            $scope.channel = {
                searchDeviceTitle: '',
                getMonitorDeviceItem: function () {
                    var url, data;
                    url = '/security/device.do?action=getSyncDeviceList';
                    data = {
                        filter: {
                            searchtext: $scope.channel.searchDeviceTitle
                        }
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                                if (data.result && data.result.rows) {
                                    $scope.channel.list = data.result.rows;
                                } else {
                                    $scope.channel.list = [];
                                }
                            },
                            function (data) {
                            })
                },
                showMonitorInfo: function (index) {
                    var id = $scope.channel.list[index].id;
                    $scope.monitor.getMonitorChannelItem(id);
                },
                saveBatchChannel: function () {
                    var data, url;
                    data = $scope.channel.syncAllEntityItem;

                    url = '/security/device.do?action=saveBatchSyncMonitor';
                    data = {
                        filter: data
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data && data.message) {
                                if (data.status == "1") {

                                    _remind(1, '同步通道成功!', '同步通道');

                                    $('#singleSyncModel').removeClass('in');
                                    $timeout(function () {
                                        $('#singleSyncModel').hide()
                                    }, 1000);

                                }
                            }
                        }, function (data) {

                            _remind(4, '同步通道失败，请检查流媒体信息是否配置正确!', '同步通道');

                            $('#singleSyncModel').removeClass('in');
                            $timeout(function () {
                                $('#singleSyncModel').hide()
                            }, 1000);
                        })
                },
                syncEntityItem: [],
                syncMode: '',
                singleSync: function (index, mode, hidemodal) {
                    if (!hidemodal) {
                        $('#singleSyncModel').show();
                        $('#singleSyncModel').addClass('in');
                    }

                    $scope.channel.syncEntityItem = [];
                    $scope.channel.syncMode = '';

                    var id = $scope.channel.list[index].id;

                    var url = '/security/device.do?action=syncMonitorChannelInfo';
                    if (mode == 'same') {
                        $scope.channel.syncMode = mode;
                        url = '/security/device.do?action=syncSameNameMonitor';
                    } else if (mode == 'ouinfo') {
                        url = 'security/device.do?action=syncMonitorChannelAndOuInfo'
                    }

                    var data = {
                        filter: {
                            type: 'new',
                            id: [id]
                        }
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                                if (data) {
                                    if (!hidemodal) {
                                        if (data.result && data.result.rows) {
                                            $scope.channel.syncEntityItem = data.result.rows[0];
                                        }
                                    } else {
                                        _remind(1, '同步单位及监控成功!', '消息提醒');
                                    }
                                }
                            },
                            function () {
                                _remind(4, '网络出错，同步通道查询失败', '消息提醒');
                            });
                },
                cancel: function () {
                    $('#singleSyncModel').removeClass('in');
                    $timeout(function () {
                        $('#singleSyncModel').hide()
                    }, 1000);
                },
                isBatchSnycing: false,
                syncBatch: function () {
                    $scope.channel.isBatchSnycing = 0;

                    var id = [];
                    $.each($scope.channel.list, function (index, zrow) {
                        id.push(zrow.id);
                    });

                    var url, data;
                    url = '/security/device.do?action=syncMonitorChannelInfo';
                    data = {
                        filter: {
                            id: id
                        }
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data.result && data.result.rows) {
                                if (data.status == 1) {
                                    $scope.channel.syncAllEntityItem = data.result.rows;
                                    if (!$scope.channel.syncAllEntityItem.length) $scope.channel.isBatchSnycing = 2;
                                    else $scope.channel.isBatchSnycing = 1;
                                } else {
                                    $scope.channel.syncAllEntityItem = [];
                                }
                            }
                        })
                },
                keyup: function (e) {
                    if (e.keyCode == 13) {
                        $scope.channel.getMonitorDeviceItem();
                    }
                }
            };

            $scope.monitor = {
                filter: {
                    id: '',
                    searchtext: ''
                },
                params: {
                    pageNo: 1,
                    pageSize: 20
                },
                getMonitorChannelItem: function (id) {
                    if (id) $scope.monitor.filter.id = id;
                    var url, data;
                    url = '/security/device.do?action=getSyncChannelList';
                    data = {
                        filter: $scope.monitor.filter,
                        params: $scope.monitor.params
                    };

                    iAjax
                        .post(url, data)
                        .then(function (data) {
                                if (data.result && data.result.rows) {
                                    $scope.monitor.list = data.result.rows;
                                } else {
                                    $scope.monitor.list = [];
                                }

                                if (data.result.params) {
                                    $scope.monitor.params = data.result.params;
                                }
                            },
                            function (data) {
                            })
                },
                keyup: function (e) {
                    if (e.keyCode == 13) {
                        $scope.monitor.getMonitorChannelItem();
                    }
                }
            };

            $scope.back = function () {
                window.history.back()
            };

            // 模块加载完成后初始化事件
            $scope.$on('dataSynchronousMonitorControllerOnEvent', function () {
                $scope.monitor.getMonitorChannelItem();
                $scope.channel.getMonitorDeviceItem();
            });

            function _remind(level, content, title) {
                var message = {
                    id: new Date(),
                    level: level,
                    title: (title || '消息提醒'),
                    content: content
                };

                iMessage.show(message, false);
            }

        }
    ]);
});
