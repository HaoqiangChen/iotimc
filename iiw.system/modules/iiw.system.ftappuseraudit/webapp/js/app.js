/**
 * 访谈APP用户审核
 * Created by chq on 2019-08-10.
 */
define([
    'app',
    'cssloader!system/ftappuseraudit/css/loading',
    'cssloader!system/ftappuseraudit/css/index.css',
    'system/js/directives/systemTreeViewDirective'
], function (app, angularAMD) {
    var packageName = 'iiw.system.syuser';

    app.controller('ftappUserAuditController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '用户审核';
        $scope.keyword = '';
        $scope.selectAll = false;
        $scope.canMod = true;
        $scope.canAudit = true;
        $scope.canDel = true;

        $scope.audit = {
            filter: {
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
                            console.log(data);
                            if (data.result && data.result.rows) {
                                $scope.audit.userList = data.result.rows;
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

            mod: function () {
                var userInfo = _.where($scope.audit.userList, {checked: true})[0];
                console.log(userInfo);
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

                var data = {filter: {id: []}};
                $.each($scope.audit.chooseList, function (i, o) {
                    data.filter.id.push(o.id);
                });
                iAjax.post('/terminal/interview/user.do?action=xxx', data).then(function () {
                    _remind(1, '用户审核成功');
                    $scope.audit.getUserList();
                }, function () {
                    _remind(4, '网路连接失败');
                })
            },

            selAll: function () {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.audit.userList, function (i, o) {
                    o.checked = $scope.selectAll;
                });
            },
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
            $scope.audit.getUserList();
        });

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
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
        .controller('ftappUserItemController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {

            $scope.$on('ftappUserItemControllerOnEvent', function () {
                console.log('访谈APP用户修改页面');
            });
        }]);

    // 模块内部路由
    angularAMD.config(function ($stateProvider) {
        $stateProvider
        // .state('system.ftappuseraudit.add', {
        //     url: '/add',
        //     controller: 'ftappUserItemController',
        //     templateUrl: $.soa.getWebPath(packageName) + '/view/add.html'
        // })
            .state('system.ftappuseraudit.mod', {
                url: '/mod',
                controller: 'ftappUserItemController',
                templateUrl: $.soa.getWebPath(packageName) + '/view/mod.html'
            });
    });
});
