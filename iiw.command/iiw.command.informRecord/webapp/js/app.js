/**
 * 进出监登记
 *
 * Created by chq on 2019/7/15.
 */
define([
    'app',
    'cssloader!command/informRecord/css/index'
], function (app) {
    app.controller('informRecordController', [
        '$scope',
        '$filter',
        '$state',
        'iAjax',
        'iTimeNow',
        'CMessage',
        'iConfirm',
        'iMessage',
        function ($scope, $filter, $state, iAjax, iTimeNow, CMessage, iConfirm, iMessage) {

            $scope.rollcall = {
                path: $.soa.getWebPath('iiw.safe'),
                syoufk: '',
                syouname: '',
                list: [],
                params: {
                    pageNo: 0,
                    pageSize: 10,
                    totalSize: 0,
                    totalPage: 0
                },
                filter: {
                    starttime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd'),
                    endtime: '',
                    searcherText: '',
                    syoufk: this.syoufk
                },
                init: function (cb) {
                    iAjax.post('/security/common/monitor.do?action=getSyouDetail', {}).then(function (data) {
                        if (data && data.result.rows) {
                            $scope.rollcall.syoufk = data.result.rows[0].id;
                            $scope.rollcall.syouname = data.result.rows[0].syouname;

                            if (cb && typeof cb === 'function') {
                                cb();
                            }
                        }
                    });
                },
                getList: function () {
                    var data = {
                        filter: $scope.rollcall.filter,
                        params: this.params
                    }
                    iAjax.post('/security/information/datainfo.do?action=getRollCallRegisterList', data).then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.rollcall.list = data.result.rows;
                        }
                    });
                },

                mod: function (item) {
                    $scope.rollcall.editObj = item;
                    $state.go('command.informRecord.add');
                },
                del: function (item) {
                    $scope.rollcall.temp = item;
                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '删除信息后将无法还原，是否确认删除？',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'rollcall.confirmSuccess'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'rollcall.confirmClose'
                        }]
                    });
                },
                confirmSuccess: function (id) {
                    iConfirm.close(id);
                    var data = {
                        filter: {
                            ids: [$scope.rollcall.temp.id]
                        }
                    };
                    iAjax
                        .post('/security/information/datainfo.do?action=delRollCallRegisterList', data)
                        .then(function (data) {
                            if (data.status == 1) {
                                _remind(1, '删除成功!');
                                $scope.rollcall.getList();
                            }
                        })
                },
                confirmClose: function (id) {
                    iConfirm.close(id);
                },

                add: function () {
                    $state.go('command.informRecord.add');
                }
            };

            function _remind (level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒！'),
                    level: level,
                    content: (content || '')
                };
                iMessage.show(message, false);
            }

            $scope.$on('informRecordControllerOnEvent', function () {
                $scope.rollcall.init();
                $scope.rollcall.getList();
            });
        }]);
});
