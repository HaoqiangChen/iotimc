/**
 * Created by YBW on 2020/3/10.
 *
 * 震有调度机
 */
define([
    'app'
], function(app) {
    app.service('safeCommunicationGenew', ['showMessage', '$http', 'iAjax', function(showMessage, $http, iAjax) {

        //震有调度机参数
        var paramsZY = {
            groupName: 'zy-group',        //联系人组名
            group: null,    //联系人组参数
            ip: '',         //IP
            port: '80',     //端口
            address: '',    //地址
            user: null, //用户数据
            meeting: null, //会议
            headers: null, //普通接口头部
            header: null, //登录接口头部
            list: [] //     联系人集合
        };

        var dispatcherDevice;

        /**
         * 获取登录头部
         */
        function getLoginHeaderZY(callback) {
            iAjax.post('hardware/genew/genewapi.do?action=getLoginHeader').then(function(data) {
                if(data.result && data.result.header) {
                    if(callback) callback(data.result.header);
                }

            });
        }

        /**
         * 获取接口头部
         */
        function getReqHeaderZY(callback, token) {
            iAjax.post('hardware/genew/genewapi.do?action=getReqHeader', {
                params: {
                    token: token
                }
            }).then(function(data) {
                if(data.result && data.result.header) {
                    if(callback) callback(data.result.header);
                }
            });
        }


        /**
         * 更新token
         */
        function updateTokenZY(data, params) {
            if(data && data.status && data.status.code == '100') {
                loginZY(function() {
                    updateTokenZY.caller.apply(this, params);
                });
            }
        }

        /**
         * 震有登录
         */
        function loginZY(callback) {

            if(dispatcherDevice.username && dispatcherDevice.password && dispatcherDevice.imei && paramsZY.address) {
                $http({
                    method: 'post',
                    url: paramsZY.address + '/nuas/api/v1/signin',
                    data: {
                        "userName": dispatcherDevice.username,
                        "password": dispatcherDevice.password,
                        "imei": dispatcherDevice.imei
                    },
                    headers: paramsZY.header
                }).success(function (data) {
                    if(data && data.status && data.status.code == '0') {

                        paramsZY.user = data.data;
                        if(data.data.token && paramsZY.headers) {

                            paramsZY.headers['X-Token'] = data.data.token;
                        }

                        if (callback) callback(data);

                    }
                    else {
                        showMessage(3, '调度机登录失败');
                    }
                });
            }
            else {
                showMessage(3, '调度机初始化失败，调度机配置缺少必要参数！');
            }
        }

        /**
         * 获取联系人集合
         */
        function getGroups() {
            $http({
                method: 'GET',
                url: paramsZY.address + '/nuas/api/v1/contacts?page=0&per_page=5000',
                headers: paramsZY.headers
            }).success(function (data) {
                if(data && data.status && data.status.code == '0' && data.data && data.data.length) {
                    paramsZY.list = data.data;
                }
            });
        }


        return {

            /**
             * 初始化
             */
            init: function() {

                dispatcherDevice = showMessage(null, null, {getDispatcher: true});

                if(!dispatcherDevice) {
                    showMessage(3, '调度机初始化失败!');
                    return false;
                }

                if(dispatcherDevice.port) {
                    paramsZY.port = dispatcherDevice.port;
                }

                if(dispatcherDevice.ip) {
                    paramsZY.ip = dispatcherDevice.ip;
                    paramsZY.address = 'http://' + paramsZY.ip + ':' + dispatcherDevice.port;
                }
                else {
                    showMessage(3, '调度机初始化失败!');
                }

                getLoginHeaderZY(function(header) {

                    //测试数据请求头部。
                    //paramsZY.headers = {
                    //    'X-Timestamp': '1530782756705',
                    //    'X-Signature': '5288f22b25e5e52fc008df074da838b2e00ab8cc',
                    //    'X-Nonce': '12345678',
                    //    'X-Visitor': 'notiweixin',
                    //    'Content-Type': 'application/json',
                    //};
                    paramsZY.header = header;
                    loginZY(function(data) {
                        if(data && data.data && data.data.token) {

                            getReqHeaderZY(function(headers) {

                                paramsZY.headers = headers;
                                getGroups();

                            }, data.data.token);

                        }
                    });

                });

            },

            /**
             * 发起高级会议
             */
            startAdvConf: function(phoneNumbers, callback) {

                var params = arguments;

                $http({
                    method: 'post',
                    url: paramsZY.address + '/nuas/api/v1/groups',
                    data: {
                        "name": paramsZY.groupName,
                        "contactIds": phoneNumbers
                    },
                    headers: paramsZY.headers
                }).success(function(data) {
                    if(data && data.status && data.status.code == '0') {

                        paramsZY.group = data.data;

                        if (paramsZY.group && paramsZY.group.id) {

                            $http({
                                method: 'post',
                                url: paramsZY.address + '/nuas/api/v1/conferences',
                                data: {
                                    "groupId": paramsZY.group.id
                                },
                                headers: paramsZY.headers
                            }).success(function(data) {
                                if(data && data.status && data.status.code == '0') {
                                    paramsZY.meeting = data.data;
                                }
                                else {
                                    updateTokenZY(data, params);
                                }
                            });

                        }
                    }
                    else {
                        updateTokenZY(data, params);
                        showMessage(4, '开启会议失败，调度机未初始化!');
                    }
                });


                if (callback) {
                    callback();
                }
            },

            /**
             * 会议成员邀请
             */
            advConfInvite: function(phoneNumber, callback) {

                var params = arguments;

                var phone = _.where(paramsZY.list, {id: phoneNumber})[0];
                if(phone && phone.phoneNumbers && phone.phoneNumbers.length) {

                    $http({
                        method: 'post',
                        url: paramsZY.address + '/nuas/api/v1/conferences/'+ paramsZY.meeting.id +'/members',
                        data: [phone.phoneNumbers[0].number],
                        headers: paramsZY.headers
                    }).success(function(data) {
                        if(data && data.status && data.status.code == '0') {

                            showMessage(1, '发起语音通话');
                        }
                        else {
                            updateTokenZY(data, params);
                        }
                    });

                }

                if (callback) {
                    callback();
                }

            },

            /**
             * 会议成员踢出
             */
            advConfKick: function(phoneNumber, callback) {

                var params = arguments;
                var phone = _.where(paramsZY.list, {id: phoneNumber})[0];
                if(phone && phone.phoneNumbers && phone.phoneNumbers.length) {
                    $http({
                        method: 'post',
                        url: paramsZY.address + '/nuas/api/v1/conferences/' + paramsZY.meeting.id + '/members_kickoff',
                        data: [phone.phoneNumbers[0].number],
                        headers: paramsZY.headers
                    }).success(function (data) {
                        if (data && data.status && data.status.code == '0') {
                            showMessage(1, '会议成员踢出成功!');
                        }
                        else {
                            updateTokenZY(data, params);
                        }
                    });
                }

                if (callback) {
                    callback();
                }

            },


            /**
             * 结束会议
             */
            hangUp: function(callback) {
                var params = arguments;
                $http({
                    method: 'DELETE',
                    url: paramsZY.address + '/nuas/api/v1/conferences/'+ paramsZY.meeting.id,
                    headers: paramsZY.headers
                }).success(function(data) {
                    if(data && data.status && data.status.code == '0') {

                        paramsZY.meeting = null;
                        showMessage(1, '结束电话会议成功!');

                        $http({
                            method: 'DELETE',
                            url: paramsZY.address + '/nuas/api/v1/groups/' + paramsZY.group.id,
                            headers: paramsZY.headers
                        }).success(function(data) {
                            if(data && data.status && data.status.code == '0') {
                                paramsZY.group = null;
                            }
                            else {
                                updateTokenZY(data, params);
                            }
                        });
                    }
                    else {
                        updateTokenZY(data, params);
                    }
                });
            }

        }
    }]);
});
