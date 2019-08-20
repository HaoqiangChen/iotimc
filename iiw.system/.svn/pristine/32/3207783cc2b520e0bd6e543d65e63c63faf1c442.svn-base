/**
 * 电视墙模式关联
 *
 * Created by llx on 2017-6-23.
 */

define([
    'app',
    'cssloader!system/bigmonitorthemerelevance/css/index.css'

], function(app) {
    app.controller('bigmonitorthemerelevanceController', [
        '$scope',
        'iAjax',
        'iConfirm',
        'iMessage',
        '$state',
        '$stateParams',

        function($scope, iAjax, iConfirm, iMessage, $state, $stateParams) {
            $scope.title = '电视墙模式关联';
            $scope.bigMonitorThemeRelevance = {
                currentPage: 1,
                pageSize: 10,
                totalPage: 0,
                totalSize: 0,
                filterValue: '',
                selAll: false,
                list: [],
                tempList: [],
                select: function(event, item) {
                    if(event && (event.target.tagName == 'BUTTON' ||  event.target.tagName == 'A')) {
                        return
                    } else {
                        item.checked = !item.checked;
                    }
                },
                selectAll: function() {
                    $.each(this.list, function(i, o) {
                        o.checked = $scope.bigMonitorThemeRelevance.selAll
                    })
                },
                add: function() {
                    var data = {
                        data: 'mod'
                    };
                    $state.params = data;
                    $state.go('system.bigmonitorthemerelevance.item', data);
                },
                mod: function() {
                    var aSelect = _.where($scope.bigMonitorThemeRelevance.list, {checked: true});
                    if(aSelect.length == 1) {
                        var data = {
                            data: aSelect[0]
                        };
                        $state.params = data;
                        $state.go('system.bigmonitorthemerelevance.item', data);
                    } else {
                        showMessage(3, '请选择一条数据进行修改！');
                    }
                },
                del: function() {
                    var aSelect = _.where($scope.bigMonitorThemeRelevance.list, {checked: true});
                    if(aSelect.length) {
                        iConfirm.show({
                            scope: $scope,
                            title: '确定删除？',
                            content: '已选择' + aSelect.length + '条数据！',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'bigMonitorThemeRelevance.delSuccess'
                                },
                                {
                                    text: '取消',
                                    style: 'button-caution',
                                    action: 'bigMonitorThemeRelevance.confirmClose'
                                }]
                        });

                    } else {
                        showMessage(3, '请选择一条以上的数据进行删除!');
                    }
                },
                delSuccess: function(id) {
                    iConfirm.close(id);
                    var aSelect = _.where($scope.bigMonitorThemeRelevance.list, {checked: true});
                    var ids = [];
                    $.each(aSelect, function(i, o) {
                        ids.push(o.mainthemefk);
                    });
                    var data = {
                        filter: {
                            mainthemefk: ids
                        }
                    };
                    iAjax
                        .post('security/devicemonitor.do?action=delBigMonitorRelated', data)
                        .then(function(data) {
                            if (data && data.status == 1) {
                                showMessage(1, '删除成功!');
                                $scope.bigMonitorThemeRelevance.getList();
                            }
                        })
                },
                showConfirm: function(item) {
                    $scope.bigMonitorThemeRelevance.tempList = item.minortheme;
                    iConfirm.show({
                        scope: $scope,
                        title: '查看关联：',
                        templateUrl: $.soa.getWebPath('iiw.system.bigmonitorthemerelevance') + '/view/showiConfirm.html',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'bigMonitorThemeRelevance.confirmClose'
                        }]
                    });
                },
                getList: function() {
                    var data = {
                        filter: {
                            id: '',
                            searchText: $scope.bigMonitorThemeRelevance.filterValue
                        },
                        params: {
                            pageNo: $scope.bigMonitorThemeRelevance.currentPage,
                            pageSize: $scope.bigMonitorThemeRelevance.pageSize
                        }
                    };
                    iAjax
                        .post('/security/devicemonitor.do?action=getBigMonitorRelated', data)
                        .then(function(data) {
                            if(data.result && data.result.rows && data.result.rows.value) {
                                $scope.bigMonitorThemeRelevance.list = data.result.rows.value;
                            }
                        })
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                }
            };

            $scope.$on('bigmonitorthemerelevanceControllerOnEvent', function() {
                $scope.bigMonitorThemeRelevance.getList();
            });

            function showMessage(level, content) {
                var json = {
                    title: $scope.title,
                    level: level,
                    content: content
                };
                iMessage.show(json);
            }
        }
    ])
});