/**
 * 访谈APP用户审核
 * Created by chq on 2019-08-10.
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/ftappuseraudit/css/loading',
    'cssloader!system/ftappuseraudit/css/index',
    // 'system/ftappuseraudit/js/directives/inputLimit',
    'system/js/directives/systemTreeViewDirective'
], function (app, angularAMD) {
    var packageName = 'iiw.system.ftappuseraudit';

    app.controller('ftappUserAuditController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '访谈APP用户管理';
        $scope.keyword = '';
        $scope.selectAll = false;
        $scope.canAuthority = false;
        $scope.canMod = true;
        $scope.canAudit = true;
        $scope.canDel = true;
        $scope.provinces = [
            {name: '司法部', code: '00'}, {name: '北京市', code: 11}, {name: '天津市', code: 12}, {name: '河北省', code: 13}, {
                name: '山西省',
                code: 14
            }, {name: '内蒙古自治区', code: 15}, {name: '辽宁省', code: 21},
            {name: '吉林省', code: 22}, {name: '黑龙江省', code: 23}, {name: '上海市', code: 31}, {
                name: '江苏省',
                code: 32
            }, {name: '浙江省', code: 33}, {name: '安徽省', code: 34},
            {name: '福建省', code: 35}, {name: '江西省', code: 36}, {name: '山东省', code: 37}, {
                name: '河南省',
                code: 41
            }, {name: '湖北省', code: 42}, {name: '湖南省', code: 43},
            {name: '广东省', code: 44}, {name: '广西壮族自治区', code: 45}, {name: '海南省', code: 46}, {
                name: '重庆市',
                code: 50
            }, {name: '四川省', code: 51}, {name: '贵州省', code: 52},
            {name: '云南省', code: 53}, {name: '西藏自治区', code: 54}, {name: '陕西省', code: 61}, {
                name: '甘肃省',
                code: 62
            }, {name: '青海省', code: 63}, {name: '宁夏回族自治区', code: 64},
            {name: '新疆维吾尔自治区', code: 65}
        ];

        $scope.audit = {
            filter: {
                role: '%',
                isagree: '%',
                name: ''
            },
            params: {
                pageNo: 0,
                pageSize: 10
            },
            userList: [],
            chooseList: [],

            getUserList: function () {
                $scope.loading = {
                    isLoading: true,
                    content: '访谈APP用户列表加载中'
                };

                var url, data;
                url = 'http://iotimc8888.goho.co:17783/terminal/interview/user.do?action=getAllSyuser';
                data = {
                    filter: this.filter,
                    params: this.params
                };

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            // console.log(data);
                            if (data.result && data.result.rows) {
                                $scope.audit.userList = data.result.rows;
                                $scope.audit.userList.map(_a => {
                                    if (_a.code.length < 15) {
                                        _a.province = _a.province ? _a.province : '';
                                        _a.provincecode = _a.provincecode ? _a.provincecode : '';
                                    } else {
                                        _a.provincecode = _a.code.substr(2, 2);
                                        _a.province = _a.province ? _a.province : $scope.provinces.map(function (_) {
                                            if (_.code === parseInt(_a.provincecode)) return _.name
                                        });
                                    }
                                });
                                $scope.loading.isLoading = false;
                                $scope.selectAll = false;
                            } else {
                                $scope.audit.userList = [];
                            }
                            if (data.result.params) {
                                $scope.audit.params = data.result.params;
                            }
                        })
                })
            },

            audit: function () {
                var aSelect = _.filter($scope.audit.chooseList, function (item) {
                        return item.isagree !== '通过';
                    }),
                    aName = aSelect.map(function (select, i) {
                        return (i + 1 + '、' + select.name);
                    });

                iConfirm.show({
                    scope: $scope,
                    title: '确认审核通过？',
                    content: '共选择' + aSelect.length + '条数据，分别为：<br>' + aName.join('<br>'),
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'audit.confirmAuditUser'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'audit.confirmClose'
                    }]
                });
            },
            confirmAuditUser: function (id) {
                iConfirm.close(id);

                var aSelect = _.filter($scope.audit.chooseList, function (item) {
                    return item.isagree !== '通过';
                });

                var data = {filter: {id: []}};
                $.each(aSelect, function (i, o) {
                    data.filter.id.push(o.id);
                });
                iAjax.post('/terminal/interview/user.do?action=approvedLogin', data).then(function () {
                    _remind(1, '用户审核成功');
                    $scope.audit.getUserList();
                }, function () {
                    _remind(4, '网路连接失败');
                })
            },
            confirmClose: function (id) {
                iConfirm.close(id);
            },

            add: function () {
                $scope.userInfo = '';
                $state.go('system.ftappuseraudit.add');
            },
            mod: function () {
                $scope.userInfo = _.where($scope.audit.userList, {checked: true})[0];
                $state.go('system.ftappuseraudit.add');
            },
            del: function () {
                var arrName = $scope.audit.chooseList.map(function (select, i) {
                    return (i + 1 + '、' + select.name);
                });
                iConfirm.show({
                    scope: $scope,
                    title: '确认删除？',
                    content: '共选择【未审核】用户' + $scope.audit.chooseList.length + '条数据，分别为：<br>' + arrName.join('<br>'),
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'audit.confirmDelUser'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'audit.confirmClose'
                    }]
                });
            },
            confirmDelUser: function (id) {
                iConfirm.close(id);

                var data = {ids: []};
                $.each($scope.audit.chooseList, function (i, o) {
                    data.ids.push(o.id);
                });
                getToken(function (token) {
                    iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=deleteUsers&authorization=' + token, data).then(function () {
                        _remind(1, '用户审核成功');
                        $scope.audit.getUserList();
                    }, function () {
                        _remind(4, '网络连接失败');
                    })
                })
            },

            selAll: function () {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.audit.userList, function (i, o) {
                    o.checked = $scope.selectAll;
                });
            },
        };

        $scope.getUserAuthority = function () {
            var url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=getUserAuthority';

            getToken(function (token) {
                iAjax
                    .post(`${url}&authorization=${token}`, {})
                    .then(function (data) {
                        if (data.status === 1 && data.result.rows) {
                            if (parseInt(data.result.rows) === 1) {
                                $scope.canAuthority = true;
                            } else {
                                $scope.loading = {
                                    isLoading: true,
                                    content: '抱歉，当前账号没有用户管理审批修改删除用户的相应权限'
                                };
                                setTimeout(function () {
                                    $scope.loading.isLoading = false;
                                }, 3000)
                            }
                        }
                    })
            })
        };
        $scope.$watch('audit.userList', function (newValue, oldValue) {
            $scope.audit.chooseList = newValue.filter(_ => _.checked);
            if ($scope.audit.chooseList.length) {
                $scope.canDel = false;
                if ($scope.audit.chooseList.length === 1) $scope.canMod = false;
                else $scope.canMod = true;
                if ($scope.audit.chooseList.filter(_ => _.isagree !== '通过').length) $scope.canAudit = false;
                else $scope.canAudit = true;
            } else {
                $scope.canMod = true;
                $scope.canAudit = true;
                $scope.canDel = true;
            }
        }, true);

        // 模块加载完成后初始化事件
        $scope.$on('ftappUserAuditControllerOnEvent', function () {
            // $scope.getUserAuthority();
            // $scope.audit.getUserList();
        });

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=9999&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            }, function (err) {
                _remind(4, '请求失败，请查看网络状态!');
                $scope.loading.content = '请求失败，请查看网络状态';
            });
        }

        function _remind(level, content, title) {
            var message = {
                id: new Date(),
                level: level,
                title: (title || '消息提醒'),
                content: content
            };

            iMessage.show(message, false);
        }
    }])
        .controller('ftappUserInfoController', ['$rootScope', '$scope', '$state', '$location', 'iAjax', 'iMessage', 'iConfirm', '$filter', '$timeout', function ($rootScope, $scope, $state, $location, iAjax, iMessage, iConfirm, $filter, $timeout) {
            $scope.provinces = [
                {name: '司法部', code: '00'}, {name: '北京市', code: 11}, {name: '天津市', code: 12}, {name: '河北省', code: 13}, {
                    name: '山西省',
                    code: 14
                }, {name: '内蒙古自治区', code: 15}, {name: '辽宁省', code: 21},
                {name: '吉林省', code: 22}, {name: '黑龙江省', code: 23}, {name: '上海市', code: 31}, {
                    name: '江苏省',
                    code: 32
                }, {name: '浙江省', code: 33}, {name: '安徽省', code: 34},
                {name: '福建省', code: 35}, {name: '江西省', code: 36}, {name: '山东省', code: 37}, {
                    name: '河南省',
                    code: 41
                }, {name: '湖北省', code: 42}, {name: '湖南省', code: 43},
                {name: '广东省', code: 44}, {name: '广西壮族自治区', code: 45}, {name: '海南省', code: 46}, {
                    name: '重庆市',
                    code: 50
                }, {name: '四川省', code: 51}, {name: '贵州省', code: 52},
                {name: '云南省', code: 53}, {name: '西藏自治区', code: 54}, {name: '陕西省', code: 61}, {
                    name: '甘肃省',
                    code: 62
                }, {name: '青海省', code: 63}, {name: '宁夏回族自治区', code: 64},
                {name: '新疆维吾尔自治区', code: 65}
            ];
            $scope.userRole = [
                {name: '访谈员', value: 1},
                {name: '督导员', value: 2}
            ];
            $scope.typeList = [
                {type: 1, typename: '监狱'},
                {type: 2, typename: '社矫'},
                {type: 3, typename: '看守所'},
                {type: 4, typename: '安置帮教'}
            ];
            $scope.checkidcard = function () {
                var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                if ($scope.userInfo.idcard) {
                    $scope.regIdcard = reg.test($scope.userInfo.idcard);
                    if ($scope.userInfo.idcard.length < 16) {
                        $scope.userInfo.birthday = $scope.userInfo.idcard.substring(6, 8) + '-' + $scope.userInfo.idcard.substring(8, 10) + '-' + $scope.userInfo.idcard.substring(10, 12);
                        $scope.sexcode = $scope.userInfo.idcard.substring(13, 14);
                        if ($scope.sexcode % 2 === 0) $scope.userInfo.sex = '女';
                        else $scope.userInfo.sex = '男';
                    } else {
                        $scope.userInfo.birthday = $scope.userInfo.idcard.substring(6, 10) + '-' + $scope.userInfo.idcard.substring(10, 12) + '-' + $scope.userInfo.idcard.substring(12, 14);
                        $scope.sexcode = $scope.userInfo.idcard.substring(16, 17);
                        if ($scope.sexcode % 2 === 0) $scope.userInfo.sex = '女';
                        else $scope.userInfo.sex = '男';
                    }
                }
            };

            if ($scope.$parent.userInfo) {
                $scope.subTitle = '用户修改';
                $scope.saveBtn = '修改';
                $scope.userInfo = $scope.$parent.userInfo;
                // $scope.regIdcard = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test($scope.userInfo.idcard);
                $scope.checkidcard();
            } else {
                $scope.subTitle = '用户注册';
                $scope.saveBtn = '注册';
                $scope.userInfo = {};
            }

            // $scope.userInfo = {};

            $scope.save = function () {
                $scope.loading = {
                    isLoading: true,
                    content: `访谈APP用户${$scope.saveBtn}信息提交中`
                };

                var url, data;
                url = 'http://iotimc8888.goho.co:17783/terminal/interview/user.do?action=addSyuser';

                $scope.userInfo.code = $scope.userInfo.role + $scope.userInfo.type + $scope.userInfo.provincecode + $scope.userInfo.phone;
                $scope.userInfo.province = $scope.provinces.filter(function (_) {
                    return _.code === parseInt($scope.userInfo.provincecode);
                })[0].name;
                data = $scope.userInfo;

                getToken(function (token) {
                    iAjax
                        .post(`${url}&authorization=${token}`, data)
                        .then(function (data) {
                            console.log(data);
                            if (data.status === 1) {
                                $scope.loading.isLoading = false;
                                _remind(1, `用户${$scope.saveBtn}成功`);
                                $timeout(function () {
                                    $scope.back();
                                }, 300)
                            } else {
                                _remind(4, `${$scope.saveBtn}失败，请重新提交`);
                            }
                        }, function (err) {
                            $scope.loading.isLoading = false;
                            _remind(3, err.message);
                        })
                })
            };

            $scope.showOuTree = function () {
                $('#syouTreeModel').show();
                $('#syouTreeModel').addClass('in');

                var url, data;
                url = 'http://iotimc8888.goho.co:17783/terminal/interview/user.do?action=getSyouAll';
                data = {
                    filter: {
                        name: '',
                        provinceCode: $scope.userInfo.provincecode
                    }
                };
                getToken(function (token) {
                    iAjax
                        .post(url, data)
                        .then(function (data) {
                                if (data.result.rows && data.result.rows.length > 0) {
                                    $scope.treeNodes = {
                                        zNodes: data.result.rows
                                    };
                                } else {
                                    $scope.treeNodes = {
                                        zNodes: []
                                    };
                                }

                                $rootScope.$broadcast('initTree', $scope.treeNodes);
                            },
                            function (data) {
                                _remind(4, '请求单位失败，请重新点击获取')
                            })
                })

            };
            $scope.selectOu = function () {
                if (syoufk == '') {
                    _remind(3, '单位选择', '请选择一个单位信息!');
                } else {
                    $scope.userInfo.syouname = syouname;
                    $scope.userInfo.syoufk = syoufk;

                    $('#syouTreeModel').removeClass('in');
                    $timeout(function () {
                        $('#syouTreeModel').hide()
                    }, 1000);
                }
            };
            $scope.cancelOu = function () {
                $('#syouTreeModel').removeClass('in');
                $timeout(function () {
                    $('#syouTreeModel').hide()
                }, 1000);
            };
            $scope.selectEvent = function (treeNode) {
                syouname = treeNode.name;
                syoufk = treeNode.id;
            };

            $scope.checkpwd = function () {
                var reg = /[^\w+\d+]/;
                if ($scope.userInfo.password) {
                    $scope.regPwd = reg.test($scope.userInfo.password);
                    if ($scope.userInfo.password2 != null) {
                        if ($scope.userInfo.password == $scope.userInfo.password2) {
                            $scope.pwdcheckfalg = 0;
                        } else {
                            $scope.pwdcheckfalg = 1;
                        }
                    }
                } else {
                    $scope.regPwd = '';
                    return;
                }

            };
            $scope.back = function () {
                $location.path('/system/ftappuseraudit');
            };

            function getToken(callback) {
                iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=9999&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                    callback(data.token);
                }, function (err) {
                    _remind(4, '请求失败，请查看网络状态!');
                    $scope.loading.content = '请求失败，请查看网络状态';
                });
            }

            function _remind(level, content, title) {
                var message = {
                    id: new Date(),
                    level: level,
                    title: (title || '消息提醒'),
                    content: content
                };

                iMessage.show(message, false);
            }
        }]);

    // 模块内部路由
    angularAMD.config(function ($stateProvider) {
        $stateProvider
            .state('system.ftappuseraudit.add', {
                url: '/add',
                controller: 'ftappUserInfoController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
            })
    });
});
