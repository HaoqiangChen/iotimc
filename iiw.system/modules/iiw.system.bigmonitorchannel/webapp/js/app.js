/**
 * 电视墙与解码器关联
 *
 * Created by llx on 2015-10-27.
 */

define([
    'app',
    'cssloader!system/bigmonitorchannel/css/index.css'

], function(app) {
    app.controller('bigmonitorchannelController', [
        '$scope',
        'iAjax',
        'iConfirm',
        'iMessage',
        'iTimeNow',

        function($scope, iAjax, iConfirm, iMessage, iTimeNow) {
            var oldIndexMonitorType = '';
            var bigmonitor = '';
            var devicefk = '';
            var devicefkName = '';
            $scope.title = '电视墙与解码器关联';
            $scope.bigmonitorList = '';
            $scope.listSize = 15;
            $scope.bigmonitorfk = '';
            $scope.indexMonitorType = '';
            $scope.indexDevicefkType = '';
            $scope.bigmonitorchannelList = [];
            $scope.dcchannel = '';
            $scope.channel = '';
            $scope.devicefk = '';
            $scope.bigmonitorchannel = {
                aSelectAll: false,
                selectAll: function() {
                    _.each($scope.bigmonitorchannelList, function(item) {
                        item.checked = $scope.bigmonitorchannel.aSelectAll;
                    });
                },
                select: function(item, event) {
                    if(event && (event.target.tagName == 'INPUT' || event.target.tagName == 'BUTTON')) {
                        return;
                    }
                    item.checked = !item.checked;
                },

                /**
                 * 添加关联
                 */
                addRole: function() {
                    iConfirm.show({
                        scope: $scope,
                        title: '添加',
                        templateUrl: $.soa.getWebPath('iiw.system.bigmonitorchannel') + '/view/addiConfirm.html',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'bigmonitorchannel.confirmCloseAdd'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'bigmonitorchannel.confirmClose'
                        }]
                    });
                },

                /**
                 * 修改关联
                 */
                modRole: function() {
                    var bSelect = _.where($scope.bigmonitorchannelList, {checked: true});
                    if(bSelect != '') {
                        $scope.addBtnShow = true;
                        $scope.delBtnShow = true;
                    }
                    $.each($scope.bigmonitorchannelList, function(i, o) {
                        o._channel = o.channel;
                        o._dcchannel = o.dcchannel;
                    });
                    $scope.showBtn = 'mod';
                    if(bSelect.length > 0) {
                        $.each(bSelect, function(i, o) {
                            o.status = 'mod';
                        });
                        var data = {
                            filter: [bSelect]
                        };
                        iAjax
                            .post('/security/devicemonitor.do?action=updateBigMonitorCannel', data)
                            .then(function(data) {
                                if(data.status == '1') {
                                    var message = {};
                                    message.id = iTimeNow.getTime();
                                    message.level = 1;
                                    message.title = $scope.title;
                                    message.content = '修改成功!';
                                    iMessage.show(message, false);
                                    getList(bigmonitor);
                                }
                            })
                    } else {
                        var message = {};
                        message.id = iTimeNow.getTime();
                        message.level = 3;
                        message.title = $scope.title;
                        message.content = '请选择一条或以上的数据进行修改！';
                        iMessage.show(message, false);
                        $scope.showBtn = false;
                    }
                },

                /**
                 * 删除关联
                 */
                delRole: function() {
                    var bSelect = _.where($scope.bigmonitorchannelList, {checked: true});
                    if(bSelect.length > 0) {
                        iConfirm.show({
                            scope: $scope,
                            title: '内容删除',
                            content: '删除勾选中的内容',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'bigmonitorchannel.confirmCloseDel'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'bigmonitorchannel.confirmClose'
                            }]
                        });
                    } else {
                        var message = {};
                        message.id = iTimeNow.getTime();
                        message.level = 3;
                        message.title = $scope.title;
                        message.content = '请选择一条或以上的数据进行删除！';
                        iMessage.show(message, false);
                    }
                },
                confirmCloseAdd: function(id) {
                    $scope.showBtn = 'add';
                    $scope.modBtnShow = true;
                    $scope.delBtnShow = true;
                    var inital = 1;
                    var quantity = $('#addQuantity')[0].value;
                    var perFix = $('#perFix')[0].value;
                    for(var i = 0; i < quantity; i++, inital++) {
                        var serial = perFix + inital;
                        $scope.bigmonitorchannelList.push({
                            channel: serial,
                            _channel: serial,
                            _dcchannel: '',
                            dcchannel: '',
                            devicefk: devicefk,
                            bigmonitorfk: bigmonitor,
                            devicefkName: devicefkName,
                            status: 'add',
                            color: false
                        })
                    }
                    iConfirm.close(id);
                },
                confirmCloseDel: function(id) {
                    iConfirm.close(id);
                    var bSelect = _.where($scope.bigmonitorchannelList, {checked: true});
                    if(bSelect.length > 0) {
                        var ids = [];
                        $.each(bSelect, function(i, o) {
                            ids.push(o.id);
                        });
                        var data = {
                            filter: {
                                ids: ids
                            }
                        };
                        iAjax
                            .post('/security/devicemonitor.do?action=delBigMonitorCannel', data)
                            .then(function(data) {
                                if(data.status == '1') {
                                    var message = {};
                                    message.id = iTimeNow.getTime();
                                    message.level = 1;
                                    message.title = $scope.title;
                                    message.content = '删除成功！';
                                    iMessage.show(message, false);
                                    $scope.bigmonitorchannel.aSelectAll = false;
                                    getList(bigmonitor);
                                }
                            })
                    }
                },
                confirmCloseChange: function(id) {
                    iConfirm.close(id);
                    getList($scope.indexMonitorType);
                },
                confirmCloseCancleChange: function(id) {
                    iConfirm.close(id);
                    var bSelect = _.where($scope.bigmonitorchannelList, {status: 'add'});
                    var cSelect = _.where($scope.bigmonitorchannelList, {status: 'mod'});
                    if(bSelect.length) {
                        $scope.modBtnShow = true;
                        $scope.addBtnShow = false;
                        $scope.delBtnShow = true;
                    } else if(cSelect.length) {
                        $scope.modBtnShow = false;
                        $scope.addBtnShow = true;
                        $scope.delBtnShow = true;
                        $scope.indexMonitorType = oldIndexMonitorType;

                    }
                },
                confirmClose: function(id) {
                    iConfirm.close(id);

                }
            };

            /**
             * 检查电视墙序号是否重复
             */
            function checkChannel() {
                var channelList = {};
                var returnValue = false;
                var channel = '';
                $.each($scope.bigmonitorchannelList, function(i, item) {
                    if(item.status == 'mod' || item.status == 'add') {
                        channel = item._channel;
                    } else {
                        channel = item.channel;
                    }
                    if(item.channel) {
                        if(!channelList[channel]) {
                            channelList[channel] = [];
                        }
                        channelList[channel].push(item);
                    }
                });
                for(var key in channelList) {
                    if(key && channelList[key]) {
                        if(channelList[key].length > 1) {
                            for(var i = 0, len = channelList[key].length; i < len; i++) {
                                channelList[key][i].color = true;
                                returnValue = true;
                            }
                        }
                    }
                }
                return returnValue;
            }

            /**
             * 保存添加关联
             */
            $scope.save = function() {
                var checkChannelValue = checkChannel();
                if(!checkChannelValue) {
                    var list = [];
                    $.each($scope.bigmonitorchannelList, function(i, o) {
                        if(o.status == 'mod' || o.status == 'add') {
                            o.channel = o._channel;
                            o.dcchannel = o._dcchannel;
                            list.push(o);
                        }
                    });
                    var data = {
                        filter: list
                    };
                    iAjax
                        .post('/security/devicemonitor.do?action=updateBigMonitorCannel', data)
                        .then(function(data) {
                            if(data.status == '1') {
                                var message = {};
                                message.id = iTimeNow.getTime();
                                message.level = 1;
                                message.title = $scope.title;
                                message.content = '保存成功！';
                                iMessage.show(message, false);
                                $scope.modBtnShow = false;
                                $scope.addBtnShow = false;
                                $scope.delBtnShow = false;
                                getList(bigmonitor);
                            }
                        });
                }

            };

            /**
             * 取消保存,返回列表
             */
            $scope.cancle = function() {
                getList(bigmonitor);
                $scope.modBtnShow = false;
                $scope.addBtnShow = false;
                $scope.delBtnShow = false;
            };

            /**
             * 添加数量限制只能输入数字
             * */
            $scope.isNumber = function(e) {
                var keyCode = e.keyCode;
                if(!((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || (keyCode == 8))) {
                    e.preventDefault();
                }
            };

            /**
             * 选择电视墙
             * */
            $scope.searchInfo = function(data) {
                var bSelect = _.where($scope.bigmonitorchannelList, {status: 'add'});
                var cSelect = _.where($scope.bigmonitorchannelList, {status: 'mod'});
                if(cSelect.length || bSelect.length) {
                    iConfirm.show({
                        scope: $scope,
                        title: '电视墙切换',
                        content: '电视墙切换后所添加或修改的操作会取消！',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'bigmonitorchannel.confirmCloseChange'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'bigmonitorchannel.confirmCloseCancleChange'
                        }]
                    });
                    $scope.modBtnShow = false;
                    $scope.addBtnShow = false;
                    $scope.delBtnShow = false;
                } else {
                    bigmonitor = data;
                    getList(bigmonitor);
                }
            };

            /**
             * 选择解码器名称
             * */
            $scope.selectDevice = function(data) {
                devicefk = data;
                $.each($scope.devicefkList, function(i, o) {
                    if(o.id == devicefk) {
                        devicefkName = o.name;
                    }
                })
            };


            /**
             * 取消新增
             * */
            $scope.cancleAdd = function() {
                var delAdd = this.$parent.$index;
                $scope.bigmonitorchannelList.splice(delAdd, 1);
                var bSelect = _.where($scope.bigmonitorchannelList, {status: 'add'});
                if(bSelect.length < 1) {
                    $scope.modBtnShow = false;
                    $scope.addBtnShow = false;
                    $scope.delBtnShow = false;
                    $scope.showBtn = true;
                }
            };

            /**
             * 取消修改
             * */
            $scope.cancleMod = function(item) {
                item.status = 'normal';
                var bSelect = _.where($scope.bigmonitorchannelList, {status: 'mod'});
                if(bSelect.length < 1) {
                    $scope.modBtnShow = false;
                    $scope.addBtnShow = false;
                    $scope.delBtnShow = false;
                    $scope.showBtn = true;
                }
            };

            $scope.nextPage = function() {
                $scope.listSize += 10;
                if($scope.listSize > $scope.bigmonitorchannelList.length) {
                    $scope.listSize = $scope.bigmonitorchannelList.length;
                }
            };

            $scope.init = function() {
                getMonitorList();
                getDecoderList();
                getList();
            };

            $scope.init();

            /**
             * 获取列表
             * @param id
             */
            function getList(id) {
                $scope.listSize = 15;
                var data = {
                    filter: {
                        id: id
                    }
                };
                iAjax
                    .post('/security/devicemonitor.do?action=getBigMonitorCannel', data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.bigmonitorchannelList = data.result.rows;
                            $.each($scope.bigmonitorchannelList, function(i, o) {
                                o.color = false;
                                o.channel = o.channel;
                            });
                            $scope.showBtn = 'normal';
                        } else {
                            $scope.bigmonitorchannelList = [];
                        }
                    });
            }

            /**
             * 获取电视墙列表
             */
            function getMonitorList() {
                var data = {
                    filter: {
                        type: 'bigmonitor',
                        cascade: 'Y'
                    }
                };
                iAjax
                    .post('/security/common/monitor.do?action=getDeviceOuList', data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.bigmonitorList = data.result.rows;
                            $scope.indexMonitorType = $scope.bigmonitorList[0].id;
                            bigmonitor = $scope.indexMonitorType;
                            oldIndexMonitorType = $scope.indexMonitorType;
                            getList(bigmonitor);
                        }
                    })
            }

            /**
             * 获取解码器列表
             */
            function getDecoderList() {
                var data = {
                    filter: {
                        type: 'decoder',
                        cascade: 'Y'
                    }
                };
                iAjax
                    .post('/security/device.do?action=getDevice', data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.devicefkList = data.result.rows;
                            $scope.indexDevicefkType = $scope.devicefkList[0].id;
                            devicefkName = $scope.devicefkList[0].name;
                            devicefk = $scope.devicefkList[0].id;
                        }
                    })
            }
        }
    ])
});