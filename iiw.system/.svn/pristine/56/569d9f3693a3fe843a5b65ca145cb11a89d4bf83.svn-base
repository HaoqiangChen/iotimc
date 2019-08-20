/**
 * 信息上报管理
 * Created by LLX in 2017-04-26.
 */

define([
    'app',
    'cssloader!system/informationappear/css/index.css'
], function(app) {
    app.controller('informationappearController', [
        '$scope',
        'iConfirm',
        'iMessage',
        'iTimeNow',
        '$state',
        'iAjax',
        'iGetLang',

        function($scope, iConfirm, iMessage, iTimeNow, $state, iAjax, iGetLang) {
            $scope.title = '信息上报管理';
            $scope.listSize = 20;
            $scope.dialectList = {
                PTN_C: iGetLang.get('PTN_C'),
                PTN_P: iGetLang.get('PTN_P')
            };
            $scope.informationappear = {
                tempList: [],
                list: [],
                addNumber: '1',
                addType: 'criminal',
                iscascade: 'Y',
                inputtype: 'set',
                disabledBtn: true,
                showBtn: true,
                delBtn: false,
                selAll: false,
                /**
                 * 点击
                 * @param event
                 * @param item
                 */
                select: function(event, item) {
                    if (event && (event.target.tagName == 'INPUT' || event.target.tagName == 'SELECT' || event.target.tagName == 'A')) {
                        return
                    } else {
                        item.checked = !item.checked;
                    }
                },
                /**
                 * 全选按钮
                 */
                selectAll: function() {
                    $.each($scope.informationappear.list, function(i, item) {
                        item.checked = $scope.informationappear.selAll;
                    });
                },
                /**
                 * 取消当前点击的按钮
                 * @param item
                 * @param index
                 */
                cancle: function(item, index) {
                    var aFind;
                    if (item.mod) {
                        item.mod = false;
                        aFind = _.where($scope.informationappear.list, {mod: true});
                    } else {
                        item.add = false;
                        aFind = _.where($scope.informationappear.list, {add: true});
                        $scope.informationappear.list.splice(index, 1);
                    }
                    if (aFind.length) {
                        $scope.informationappear.disabledBtn = false;
                    } else {
                        $scope.informationappear.disabledBtn = true;
                        $scope.informationappear.delBtn = false;
                        $scope.informationappear.showBtn = true;
                    }
                },
                cancleAll: function() {
                    $scope.informationappear.showBtn = true;
                    $scope.informationappear.delBtn = false;
                    $scope.informationappear.getInformationItem();
                },
                /**
                 * 添加按钮
                 */
                addInformation: function() {
                    $scope.informationappear.addNumber = '1';
                    $scope.informationappear.addType = 'criminal';
                    $scope.informationappear.addStatus = 'Y';
                    $scope.informationappear.addHandle = 'set';
                    iConfirm.show({
                        scope: $scope,
                        title: '添加',
                        templateUrl: $.soa.getWebPath('iiw.system.informationappear') + '/view/add.html',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'informationappear.addSuccessConfirm'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'informationappear.confirmClose'
                        }]
                    });
                },
                /**
                 * 修改按钮
                 */
                modInformation: function() {
                    var aSelect = _.where($scope.informationappear.list, {checked: true});
                    if (aSelect.length) {
                        $.each(aSelect, function(i, o) {
                            o.mod = true;
                            o._name = o.name;
                            o._content = o.content;
                            o._type = o.type;
                        });
                        $scope.informationappear.disabledBtn = false;
                        $scope.informationappear.delBtn = true;
                        $scope.informationappear.showBtn = false;
                    } else {
                        $scope.informationappear.showMessage(3, '请选择一条以上的数据进行修改！');
                        $scope.informationappear.delBtn = false;
                    }
                },
                /**
                 * 删除按钮
                 */
                delInformation: function() {
                    var aSelect = _.where($scope.informationappear.list, {checked: true});
                    var list = _.map(aSelect, function(i, o) {
                        return (o + '、' + i.name)
                    });
                    if (aSelect.length) {
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '共选择' + aSelect.length + '条数据，分别为：</br>' + list.join('<br>'),
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'informationappear.delConfirmSuccess'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'informationappear.confirmClose'
                            }]
                        });
                    } else {
                        $scope.informationappear.showMessage(3, '请选择一条以上的数据进行删除！');
                    }
                },
                changeType: function() {
                    $scope.informationappear.getInformationItem();
                },
                goConfig: function() {
                    $state.go('system.informationappear.config')
                },
                getInformationItem: function() {
                    var data = {
                        filter: $scope.informationappear.filterValue,
                        type: $scope.informationappear.informationType
                    };
                    iAjax
                        .post('information/report/report.do?action=getInformationitem', data)
                        .then(function(data) {
                            if (data.result && data.result.rows) {
                                $scope.informationappear.list = data.result.rows;
                            }
                        })
                },
                /**
                 * 保存按钮
                 */
                save: function() {
                    var aSelect = [];
                    var bSelect = [];
                    $.each($scope.informationappear.list, function(i, o) {
                        if (o.add == true || o.mod == true) {
                            if (o._content && o._name) {
                                o.content = o._content;
                                o.name = o._name;
                            }
                            if(o.name != '' && o.content != '') {
                                aSelect.push(o)
                            } else {
                                bSelect.push(o)
                            }
                        }
                    });
                    if(bSelect.length) {
                        iConfirm.show({
                            scope: $scope,
                            title: '温馨提示：',
                            content: '内容字段为空的信息上报项则不保存，是否继续执行操作？',
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'informationappear.saveConfirm'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'informationappear.confirmClose'
                            }]
                        });
                        $scope.informationappear.tempList = [];
                        $scope.informationappear.tempList = aSelect.concat(bSelect);
                    } else {
                        var data = {
                            rows: aSelect
                        };
                        iAjax
                            .post('/information/report/report.do?action=updataInformationitem', data)
                            .then(function(data) {
                                if (data.status == 1) {
                                    $scope.informationappear.showMessage(1, '保存成功!');
                                    $scope.informationappear.getInformationItem();
                                    $scope.informationappear.disabledBtn = true;
                                    $scope.informationappear.showBtn = true;
                                    $scope.informationappear.delBtn = false;
                                }
                            })
                    }
                },
                saveConfirm: function(id) {
                    iConfirm.close(id);
                    var data = {
                        rows: $scope.informationappear.tempList
                    };
                    iAjax
                        .post('/information/report/report.do?action=updataInformationitem', data)
                        .then(function(data) {
                            if (data.status == 1) {
                                $scope.informationappear.showMessage(1, '保存成功!');
                                $scope.informationappear.getInformationItem();
                                $scope.informationappear.disabledBtn = true;
                                $scope.informationappear.showBtn = true;
                                $scope.informationappear.delBtn = false;
                            }
                        })
                },
                addSuccessConfirm: function(id) {
                    $scope.informationappear.addNumber = parseInt($scope.informationappear.addNumber) - 1;
                    if($scope.informationappear.addNumber >= 0) {

                        $scope.informationappear.showBtn = false;
                    }
                    for (var i = 0; i <= $scope.informationappear.addNumber; i++) {
                        $scope.informationappear.list.unshift(
                            {
                                name: '',
                                type: $scope.informationappear.addType,
                                content: '',
                                add: true
                            }
                        );
                    }
                    var aFind = _.where($scope.informationappear.list, {add: true});
                    if (aFind.length) {
                        $scope.informationappear.disabledBtn = false;
                        $scope.informationappear.delBtn = true;
                    }
                    iConfirm.close(id);
                },
                delConfirmSuccess: function(id) {
                    iConfirm.close(id);
                    var aSelect = _.where($scope.informationappear.list, {checked: true});
                    var ids = [];
                    $.each(aSelect, function(i, o) {
                        ids.push(o.id)
                    });
                    var data = {
                        ids: ids
                    };
                    iAjax
                        .post('information/report/report.do?action=deleteInformationitem', data)
                        .then(function(data) {
                            if (data.status == 1) {
                                $scope.informationappear.showMessage(1, '删除成功!');
                                $scope.informationappear.getInformationItem();
                            }
                        })
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                },
                showMessage: function(level, content) {
                    var json = {
                        id: iTimeNow.getTime(),
                        level: level,
                        content: content,
                        title: '信息上报管理！'
                    };
                    iMessage.show(json);
                }
            };

            $scope.init = function() {
                $scope.informationappear.getInformationItem();
            };

            $scope.init();

            $scope.nextPage = function() {
                $scope.listSize += 20;
                if ($scope.listSize > $scope.informationappear.list.length) {
                    $scope.listSize = $scope.informationappear.list.length;
                }
            };

        }])
});