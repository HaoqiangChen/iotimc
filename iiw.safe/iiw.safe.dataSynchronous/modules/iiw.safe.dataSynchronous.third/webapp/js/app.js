define([
    'app',
    'cssloader!safe/dataSynchronous/third/css/index',
    'cssloader!safe/dataSynchronous/third/css/style',
    'safe/dataSynchronous/third/lib/jquery.encoding',
], function (app) {

    app.controller('dataSynchronousThirdController', ['$scope', '$state', '$uibModal', 'safeMainTitle', 'iAjax', 'safeDispatcher', '$rootScope', 'iTimeNow', 'iMessage', '$timeout', function ($scope, $state, $uibModal, safeMainTitle, iAjax, safeDispatcher, $rootScope, iTimeNow, iMessage, $timeout) {
        safeMainTitle.title = '数据同步管理';

        $scope.keyArray = new Array();
        $scope.synchronousType = [
            {name: '第三方数据中心业务数据同步机制', typefk: '', type: '1'},
            {name: '监控平台的监控通道数据同步机制', typefk: '', type: '2'}
        ];
        $scope.parameterType = ['JSON', 'XML'];
        $scope.tableNames = [];
        $scope.tableFields = [];
        $scope.parameter = {
            router: '',
            appkey: '',
            secret: '',
            format: 'JSON',
            username: '',
            password: '',
            dbtype: '',
            page_no: 1,
            page_size: 50,
            tablename: '',
            fields: ''
        };

        $scope.session = {
            sessionid: '',
            signargsObj: '',
            signstr: ''
        };

        $scope.request = {
            requestjsonObj: '',
            requestparaObj: '',
            responseObj: ''
        };

        $scope.synchronous = {
            type: '1',
            changeType: function (type) {
                switch (parseInt(type)) {
                    case 1:
                        break;
                    case 2:
                        $scope.monitor.getMonitorChannelItem();
                        break;
                    default:
                        break;
                }
            },
            init: function () {
                var data = {
                    data: {
                        filter: {
                            typefk: ''
                        }
                    }
                };
                _signBySha1(data);

                $scope.request.requestjsonObj = JSON.stringify(data);
                $scope.request.requestparaObj = _jsonSortToStr(data);

                iAjax.post('/security/synccheck/synccheck.do?action=getSyncCheckList', data).then(function (data) {
                    // TODO SUCCESS
                    // console.log(data);

                    if ($scope.parameter.format == "xml") {
                        $scope.request.responseObj = data.xml;
                    } else {
                        $scope.request.responseObj = UTF8UnicodeConverter.ToUTF8(JSON.stringify(data));
                    }
                    if (data.result.rows.length) {
                        let responseObj = data.result.rows[0];
                        $scope.parameter.router = responseObj.url;
                        $scope.parameter.appkey = responseObj.appkey;
                        $scope.parameter.secret = responseObj.secret;
                        $scope.parameter.username = responseObj.username;
                        $scope.parameter.password = responseObj.password;
                        $scope.parameter.format = responseObj.format ? responseObj.format : 'JSON';
                        $scope.parameter.dbtype = responseObj.dbtype;

                        if (responseObj.detail.length) {
                            $scope.tableNames = detail;
                        }

                    }
                }, function (data) {
                    // TODO ERROR
                });
            },
            //登陆
            login: function () {
                var data = {
                    appkey: $scope.parameter.appkey,
                    format: $scope.parameter.format,
                    method: "user.login",
                    v: "1.0",
                    username: $scope.parameter.username,
                    password: $scope.parameter.password
                };
                _signBySha1(data);

                $scope.request.requestjsonObj = JSON.stringify(data);
                $scope.request.requestparaObj = _jsonSortToStr(data);

                iAjax.get($scope.parameter.router, data).then(function (data) {
                    // TODO SUCCESS
                    console.log(data);
                    var date = (new Date());
                    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

                    $scope.session.sessionid = '';

                    if ($scope.parameter.format == "xml") {
                        $scope.session.sessionid = '';
                        $scope.request.responseObj = data.xml;
                    } else {
                        $scope.session.sessionid = '';
                        $scope.request.responseObj = UTF8UnicodeConverter.ToUTF8(JSON.stringify(data));
                    }
                }, function (data) {
                    // TODO ERROR
                });
            },
            //验证
            getData: function () {
                var data = {
                    appkey: $scope.parameter.appkey,
                    format: $scope.parameter.format,
                    method: "data.getdata",
                    page_no: $scope.parameter.page_no,
                    page_size: $scope.parameter.page_size,
                    v: "1.0",
                    sessionid: $scope.session.sessionid,
                    tablename: $scope.parameter.tablename,
                    fields: $scope.parameter.fields,
                    dbtype: $scope.parameter.dbtype
                };

                if ($scope.parameter.dbtype == "" || $scope.parameter.dbtype == null) {
                    delete data.dbtype
                }

                _signBySha1(data);

                $scope.request.requestjsonObj = JSON.stringify(data);
                $scope.request.requestparaObj = _jsonSortToStr(data);

                iAjax.get($scope.parameter.router, data).then(function (data) {
                    // TODO SUCCESS
                    console.log(data);
                    var date = (new Date());
                    var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

                    $scope.session.sessionid = '';

                    if ($scope.parameter.format == "xml") {
                        $scope.request.responseObj = data.xml;
                    } else {
                        $scope.request.responseObj = UTF8UnicodeConverter.ToUTF8(JSON.stringify(data));
                    }
                }, function (data) {
                    // TODO ERROR
                });
            },
            back: function () {
                window.history.back()
            }
        };
        $scope.$watch('parameter.tablename', function (newValue, oldValue) {
            if (newValue !== '') {
                let table = $scope.tableNames.filter(function (_) {
                    return _.tablecontent === newValue;
                });
                if (table.length) {
                    $scope.tableFields = table[0].content.split(',');
                    $scope.parameter.fields = $scope.tableFields[0];
                } else {
                    $scope.parameter.fields = ''
                }
            } else {
                $scope.parameter.fields = ''
            }
        }, true);

        // 模块加载完成后初始化事件
        $scope.$on('dataSynchronousThirdControllerOnEvent', function () {
            $scope.synchronous.init();
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

        //Unicode编码转换
        var UTF8UnicodeConverter = {
            ToUnicode: function (str) {
                return escape(str).toLocaleUpperCase().replace(/%u/gi, '\\u');
            },
            ToUTF8: function (str) {
                return unescape(str.replace(/\\u/gi, '%u'));
            }
        };

        //json转url参数, 并排序
        function _jsonSortToStr(param, key) {
            var paramStr = ""; //转换成url参数的str
            if (param instanceof String || param instanceof Number || param instanceof Boolean) {
                paramStr += "&" + key + "=" + param;
                $scope.keyArray.push(key + param);
            } else {
                $.each(param, function (i) {
                    var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "[" + i + "]");
                    paramStr += '&' + _jsonSortToStr(this, k);
                });
            }
            return paramStr.substr(1);
        }

        //sha1签名
        function _signBySha1(data) {
            var signsStr = "";
            $scope.keyArray = new Array(); //清空数组
            _jsonSortToStr(data); //加载数组
            $scope.keyArray.sort(); //按字母排序

            //累加值
            for (i = 0; i < $scope.keyArray.length; i++) {
                signsStr += $scope.keyArray[i];
            }
            //累加参数与值
            var secret = $scope.parameter.secret;
            signsStr = secret + signsStr + secret;

            $scope.session.signargsObj = JSON.stringify(data);
            $scope.session.signstr = signsStr;

            //sha1签名
            var signData = $.encoding.digests.hexSha1Str(signsStr);
            data["sign"] = signData;
            return data;
        }

    }]);
});
