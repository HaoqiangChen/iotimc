/**
 * Created by YBW on 2020/3/10.
 *
 * 楚瑜调度机
 */
define(['app'], function(app) {
    app.service('safeCommunicationChuyu', ['iAjax', 'iMessage', 'showMessage', function(iAjax, iMessage, showMessage) {

        var dispatcherDevice;

        return {
            /**
             * 调度机初始化
             *
             */
            init: function() {
                dispatcherDevice = showMessage(null, null, {getDispatcher: true});
            },

            /**
             * 发起高级会议
             */
            startAdvConf: function(phoneNumbers, callback) {

                for(var i = 0; i< phoneNumbers.length; i++) {
                    if(phoneNumbers[i].length > 6) {
                        phoneNumbers[i] = dispatcherDevice.outlineNo?dispatcherDevice.outlineNo + phoneNumbers[i]:phoneNumbers[i];
                    }
                }
                iAjax.post('/sys/provider.do?action=sendMsg', {
                    content: '收到命令',
                    numbers: phoneNumbers.join(','),
                    calltype: '1',
                    model: '1'
                }).then(function() {
                    iMessage.show({
                        level: 1,
                        title: '消息提醒！',
                        content: '发起语音通话'
                    }, false);
                });
                if (callback) {
                    callback();
                }

            },

            /**
             * 会议成员邀请
             */
            advConfInvite: function(phoneNumber, callback) {

                for(var i = 0; i< phoneNumber.length; i++) {
                    if(phoneNumber[i].length > 6) {
                        phoneNumber[i] = dispatcherDevice.outlineNo?dispatcherDevice.outlineNo + phoneNumber[i]:phoneNumber[i];
                    }
                }
                /*if(phoneNumber.length > 6) {
                 phoneNumber = dispatcherDevice.outlineNo ? dispatcherDevice.outlineNo + phoneNumber : phoneNumber;
                 }*/
                var params = [];
                params.push(phoneNumber)
                iAjax.post('/sys/provider.do?action=sendMsg', {
                    content: '收到命令',
                    numbers: params.join(','),
                    calltype: '1',
                    model: '1'
                }).then(function() {
                    iMessage.show({
                        level: 1,
                        title: '消息提醒！',
                        content: '发起语音通话'
                    }, false);
                });
                if (callback) {
                    callback();
                }

            },

            /**
             * 会议成员踢出
             */
            advConfKick: function(phoneNumber, callback) {

                for(var i = 0; i< phoneNumber.length; i++) {
                    if(phoneNumber[i].length > 6) {
                        phoneNumber[i] = dispatcherDevice.outlineNo?dispatcherDevice.outlineNo + phoneNumber[i]:phoneNumber[i];
                    }
                }
                var params = [];
                params.push(phoneNumber)
                iAjax.post('/sys/provider.do?action=sendMsg', {
                    content: '收到命令',
                    numbers: params.join(','),
                    calltype: '3',
                    model: '2'
                }).then(function() {
                    iMessage.show({
                        level: 1,
                        title: '消息提醒！',
                        content: '会议成员踢出成功!'
                    }, false);
                });
                if (callback) {
                    callback();
                }

            },

            /**
             * 结束会议
             */
            hangUp: function(callback) {

                iAjax.post('/sys/provider.do?action=sendMsg', {
                    content: '收到命令',
                    numbers: '',
                    calltype: '1',
                    model: '2'
                }).then(function() {
                    iMessage.show({
                        level: 1,
                        title: '消息提醒！',
                        content: '结束电话会议成功!'
                    }, false);

                    callback && callback();
                });

            }
        }
    }]);
});
