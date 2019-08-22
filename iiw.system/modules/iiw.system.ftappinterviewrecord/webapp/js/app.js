/**
 * 访谈APP访谈记录
 * Created by chq on 2019-08-16.
 */
define([
    'app',
    // 'system/ftappinterviewrecord/js/directives/systemLoadingToast',
    'cssloader!system/ftappinterviewrecord/css/loading',
    'cssloader!system/ftappinterviewrecord/css/index.css'
], function (app) {
    app.controller('ftappInterviewRecordController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '访谈记录';
        $scope.keyword = '';
        $scope.selectAll = false;

        $scope.record = {
            filter: {
                status: 'O',
                content: '',
                searchText: ''
            },
            params: {
                pageNo: 0,
                pageSize: 10
            },
            list: [],
            types: [
                {status: '', statusname: '全部'},
                {status: 'W', statusname: '待调查'},
                {status: 'O', statusname: '待审核'},
                {status: 'P', statusname: '已审核'}
            ],

            getRecordList: function () {
                $scope.loading = {
                    isLoading: true,
                    content: '访谈记录列表加载中'
                };
                var url, data;
                url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=getTalkRecord';
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
                                $scope.record.list = data.result.rows;
                                $scope.loading.isLoading = false;
                            } else {
                                $scope.record.list = [];
                            }
                            if (data.result.params) {
                                $scope.record.params = data.result.params;
                            }
                        })
                })
            },

            check: function (item) {
                console.log(item);
                if (item) {
                    $state.params = {
                        data: item
                    };
                    if (item.nairetype === 'wjlx_lb') $state.go('system.scalecheck', $state.params);
                    else $state.go('system.questionnairecheck', $state.params);
                } else {
                    $state.params = {
                        data: null
                    };
                    _remind(4, '错误操作!');
                }
            },

            del: function () {
                var aSelect = _.filter($scope.record.list, function (item) {
                        return item.checked && item.status === 'W';
                    }),
                    aName = [];

                if (aSelect.length > 0) {

                    aName = aSelect.map(function (select, i) {
                        return (i + 1 + '、' + select.xm);
                    });

                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '共选择' + aSelect.length + '条数据，分别为：<br>' + aName.join('<br>'),
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'record.confirmDelRecord'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'record.confirmClose'
                        }]
                    });

                } else {
                    var message = {};
                    message.level = 3;
                    message.title = $scope.title;
                    message.content = "请选择一条或以上问卷状态仅为【待调查】的数据进行删除！";
                    iMessage.show(message, false);
                }
            },
            confirmDelRecord: function (id) {
                iConfirm.close(id);

                var aSelect = _.filter($scope.record.list, function (item) {
                    return item.checked && item.status === 'W';
                });

                var data = {filter: {id: []}};
                $.each(aSelect, function (i, o) {
                    data.filter.id.push(o.id);
                });
                iAjax.post('/terminal/interview/record.do?action=approvedLogin', data).then(function () {
                    _remind(1, '记录删除成功');
                    $scope.record.getRecordList();
                }, function () {
                    _remind(4, '网路连接失败');
                })
            },
            confirmClose: function (id) {
                iConfirm.close(id);
            },

            selAll: function () {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.record.list, function (i, o) {
                    o.checked = $scope.selectAll;
                });
            },

            keypress: function (e) {
                if (e.keyCode == 13) {
                    this.getRecordList();
                }
            },

            export: function () {
                var aSelect = _.filter($scope.record.list, function (item) {
                        return item.checked && item.status === 'P';
                    }),
                    aName = [];

                if (aSelect.length > 0) {

                    aName = aSelect.map(function (select, i) {
                        return (i + 1 + '、' + select.xm);
                    });

                    iConfirm.show({
                        scope: $scope,
                        title: '确认导出？',
                        content: '共选择' + aSelect.length + '条数据，分别为：<br>' + aName.join('<br>'),
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'record.confirmExportRecord'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'record.confirmClose'
                        }]
                    });

                } else {
                    var message = {};
                    message.level = 3;
                    message.title = $scope.title;
                    message.content = "请选择一条或以上问卷状态仅为【已审核】的数据进行导出！";
                    iMessage.show(message, false);
                }
                // var url = iAjax.formatURL('security/information/information.do?action=writeSyuserMould&ptype=true');
                // $scope.$broadcast('downExcel', url);
            },
            confirmExportRecord: function (id) {
                iConfirm.close(id);

                var aSelect = _.filter($scope.record.list, function (item) {
                    return item.checked && item.status === 'P';
                });

                var data = {filter: {id: []}};
                $.each(aSelect, function (i, o) {
                    data.filter.id.push(o.id);
                });
                iAjax.post('/terminal/interview/record.do?action=approvedLogin', data).then(function () {
                    _remind(1, '记录导出成功');
                    $scope.record.getRecordList();
                }, function () {
                    _remind(4, '网路连接失败');
                })
            }
        };

        // 模块加载完成后初始化事件
        $scope.$on('ftappInterviewRecordControllerOnEvent', function () {
            $scope.record.getRecordList();
        });

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            }, function (err) {
                _remind(4, '请求失败，请查看网络状态!');
                $scope.loading.content = '请求失败，请查看网络状态';
            });
        }

        function getUrlParam(param) {
            return decodeURIComponent((new RegExp('[?|&]' + param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null; // eslint-disable-line
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
});
