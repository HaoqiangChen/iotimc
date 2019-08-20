/**
 * 事件管理
 *
 * Created by chq on 2019/7/21.
 */
define([
    'app',
    'cssloader!safe/eventRegister/css/index',
    'safe/eventRegister/js/services/safeGetDataService'
], function (app) {
    app.controller('eventRegisterController', [
        '$scope',
        'safeMainTitle',
        'iConfirm',
        'iMessage',
        'iTimeNow',
        'iAjax',
        '$filter',
        'safeGetData',
        function ($scope, safeMainTitle, iConfirm, iMessage, iTimeNow, iAjax, $filter, safeGetData) {
            safeMainTitle.title = '事件管理';

            $scope.event = {
                path: $.soa.getWebPath('iiw.safe'),
                list: [],
                types: [],
                show: false,
                changeShow: function () {
                    this.show = !this.show;
                    $scope.event.save = {
                        eventtype: $scope.event.types[0] ? $scope.event.types[0].id : '',
                        eventtime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm'),
                    };
                    $scope.event.ouName = '';
                    this.addevent = false;
                },
                mod: function (rows) {
                    this.save = rows;
                    console.log(rows);
                    this.save.eventtype = _.where($scope.event.types, {name: rows.eventtype})[0].id;
                    this.show = true;
                    this.addevent = true;
                },
                del: function (rows) {
                    $scope.event.temp = rows;
                    iConfirm.show({
                        scope: $scope,
                        title: '确认删除？',
                        content: '删除信息后将无法还原，是否确认删除？',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'event.confirmSuccess'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'event.confirmClose'
                        }]
                    });
                },
                confirmSuccess: function (id) {
                    iConfirm.close(id);
                    var data = {
                        filter: {
                            type: 'del',
                            ids: [$scope.event.temp.id]
                        }
                    };
                    iAjax
                        .post('information/rota/rota.do?action=dealEventManage', data)
                        .then(function (data) {
                            if (data.status == 1) {
                                _remind(1, '删除成功!');
                                $scope.event.getList();
                            }
                        })
                },
                confirmClose: function (id) {
                    iConfirm.close(id);
                },
                addevent: false,
                filter: {
                    searchText: '',
                    eventtype: '%',
                    starttime: $filter('date')(new Date().getTime() - 604800000, 'yyyy-MM-dd HH:mm'),
                    endtime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm')
                },
                params: {
                    pageNo: 0,
                    pageSize: 10
                },
                save: {
                    registrar: '',
                    eventname: '',
                    eventtype: '',
                    eventcontent: '',
                    eventtime: $filter('date')(new Date().getTime(), 'yyyy-MM-dd HH:mm'),
                },
                submit: function () {
                    if (!this.save.id) this.save.type = 'add';
                    else this.save.type = 'mod';

                    iAjax.post('information/rota/rota.do?action=dealEventManage', {
                        filter: this.save
                    }).then(function () {

                        var message = {
                            id: iTimeNow.getTime(),
                            title: '消息提醒！',
                            level: 1,
                            content: '提交成功！'
                        };

                        iMessage.show(message, false);
                        $scope.event.userList = [];
                        $scope.event.getList();
                        $scope.event.changeShow();
                    });

                },
                keyup: function (e) {
                    if (e.keyCode == 13) {
                        this.getList();
                    }
                },
                getList: function () {
                    iAjax.post('information/rota/rota.do?action=getEventManageList', {
                        filter: this.filter,
                        params: this.params
                    }).then(function (data) {
                        if (data.result && data.result.rows) {
                            $scope.event.list = data.result.rows;
                            $scope.event.list.map(item => {
                                item.eventtype = $scope.event.types.filter(v => v.id === item.eventtype)[0].name;
                            });
                            if (data.result.params) {
                                $scope.event.params = data.result.params;
                            }
                        }
                    });
                },
                dataList: [],
                chooseUser: function () {
                    var event = $scope.event;
                    event.save.meetou = '';
                    event.save.registrar = '';
                    safeGetData.init({
                        path: '/sys/web/syou.do?action=getOulistByRole',
                        item: {
                            'name': '名称',
                            'code': '编号'
                        }
                    });
                    safeGetData.getUserData(function (data) {

                        if (data.length) {

                            event.userList = data;
                            $.each(data, function (i, o) {
                                if (i) {
                                    event.save.meetou += ',';
                                    event.save.registrar += ',';
                                }
                                event.save.meetou += o.id;
                                event.save.registrar += o.name;
                            });

                        } else {

                            event.userList = [];
                        }

                    }, null, event.userList);
                }
            };

            function getType () {

                iAjax.post('security/information/information.do?action=getSycodeList', {
                    filter: {
                        type: 'eventManageType'
                    }
                }).then(function (data) {
                    if (data.result && data.result.rows) {
                        $scope.event.types = data.result.rows;
                        if ($scope.event.types.length) {
                            $scope.event.save.eventtype = $scope.event.types[0].id;
                        }
                    }
                });
            }

            function _remind (level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒！'),
                    level: level,
                    content: (content || '')
                };
                iMessage.show(message, false);
            }

            $scope.$on('eventRegisterControllerOnEvent', function () {
                getType();
                $scope.event.getList();
            })

        }
    ]);
});
