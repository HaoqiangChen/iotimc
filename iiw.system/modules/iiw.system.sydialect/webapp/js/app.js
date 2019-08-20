/**
 * Created by llx on 2016/12/28.
 */

define([
    'app',
    'cssloader!system/sydialect/css/index.css'

], function(app) {
    app.controller('sydialectController', [
        '$scope',
        'iConfirm',
        'iMessage',
        'iAjax',

        function($scope, iConfirm, iMessage, iAjax) {
            $scope.title = '系统方言';
            $scope.addBsinessName = '';
            $scope.addName = '';
            $scope.modBtn = false;
            $scope.showAddBtn = false;
            $scope.showModBtn = false;
            $scope.showDelBtn = false;
            $scope.showiConfirm = false;
            $scope.selectBusiness = '0';
            $scope.relevanceList = [];
            $scope.list = [];
            $scope.keyList = [];
            $scope.businessList = [];
            $scope.dialectList = [];
            $scope.dialect = {
                selectAll: false,
                select: function(item, event) {
                    if (event && (event.target.tagName == 'INPUT' || event.target.tagName == 'BUTTON' )) {
                        return;
                    } else {
                        item.checked = !item.checked;
                    }
                },
                selAll: function() {
                    $.each($scope.dialectList, function(i, o) {
                        o.checked = $scope.dialect.selectAll;
                    })
                },
                add: function() {
                    iConfirm.show({
                        scope: $scope,
                        title: '添加数据:',
                        templateUrl: $.soa.getWebPath('iiw.system.sydialect') + '/view/addiConfirm.html',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'dialect.addConfirm'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'dialect.confirmClose'
                        }]
                    });
                },
                addBusiness: function() {
                    $scope.addBsinessName = '';
                    $scope.addName = '';
                    iConfirm.show({
                        scope: $scope,
                        title: '行业:',
                        templateUrl: $.soa.getWebPath('iiw.system.sydialect') + '/view/addBusinessiConfirm.html',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'dialect.delBusinessSuccess'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'dialect.confirmClose'
                        }]
                    });
                },
                mod: function() {
                    var aSelect = _.where($scope.dialectList, {checked: true});
                    if (aSelect.length) {
                        $.each(aSelect, function(i, o) {
                            o.status = 'mod';
                            o._content = o.content;
                            o._key = o.key;
                        });
                        $scope.modBtn = true;
                        $scope.showAddBtn = true;
                        $scope.showDelBtn = true;
                    } else {
                        showMessage(3, '请选择一条以上的数据进行修改!');
                        $scope.modBtn = false;
                    }

                },
                del: function() {
                    var aSelect = _.where($scope.dialectList, {checked: true});
                    if (aSelect.length) {
                        var list = aSelect.map(function(o, i) {
                            return (i + 1 + '、' + '行业：' + o.business + '、' + '关键字：' + o.key)
                        });
                        iConfirm.show({
                            scope: $scope,
                            title: '确认删除？',
                            content: '共选择' + aSelect.length + '条数据，分别为：<br>' + list.join('<br>'),
                            buttons: [{
                                text: '确认',
                                style: 'button-primary',
                                action: 'dialect.delConfirm'
                            }, {
                                text: '取消',
                                style: 'button-caution',
                                action: 'dialect.confirmClose'
                            }]
                        });
                    } else {
                        showMessage(3, '请选择一条以上的数据进行删除!')
                    }

                },
                addConfirm: function(id) {
                    iConfirm.close(id);
                    var businessName = _.where($scope.businessList, {content: $scope.indexBusiness});
                    var addNumber = $('#addNumber')[0].value;
                    for (var i = 0; i < addNumber; i++) {
                        $scope.dialectList.unshift({
                            business: businessName[0].name, key: '', content: '', status: 'add'
                        })
                    }
                    $scope.modBtn = true;
                    $scope.showModBtn = true;
                    $scope.showDelBtn = true;
                    $scope.showiConfirm = false;
                    $('#myformtable').scrollTop(1);

                },
                delConfirm: function(id) {
                    iConfirm.close(id);
                    var aSelect = _.filter($scope.dialectList, {checked: true});
                    var list = [];
                    if (aSelect.length > 0) {
                        $.each(aSelect, function(i, o) {
                            list.push(o.id)
                        });
                        var data = {
                            row: {
                                filter: list,
                                type: 'Y'
                            }
                        };
                        iAjax
                            .post('sys/web/CommonController.do?action=delSydialect', data)
                            .then(function(data) {
                                if (data.status == '1') {
                                    showMessage(1, '删除成功!');
                                    geSydialectList($scope.indexBusiness);
                                }
                            });
                    }
                },
                delBusinessSuccess: function(id) {
                    iConfirm.close(id);
                    if ($scope.selectBusiness == '1') {
                        var business = [];
                        business.push($scope.delBusinessName);
                        var data = {
                            row: {
                                filter: business,
                                type: 'N'
                            }
                        };
                        iAjax
                            .post('sys/web/CommonController.do?action=delSydialect', data)
                            .then(function(data) {
                                if (data.status == '1') {
                                    showMessage(1, '删除成功!');
                                    getBusinessAll();
                                    geSydialectList($scope.indexBusiness);
                                }
                            });
                    } else if ($scope.selectBusiness == '0') {
                        var name = $('#addBsinessName')[0].value;
                        var business = $('#addName')[0].value;
                        $.each($scope.dialectList, function(i, o) {
                            o.business = $scope.addName;
                        });
                        var data = {
                            rows: {
                                name: name,
                                business: business,
                                type: '2',
                                status: 'P',
                                contents: []
                            }
                        };
                        iAjax
                            .post('sys/web/CommonController.do?action=updateBusiness', data)
                            .then(function(data) {
                                if (data.status == '1') {
                                    showMessage(1, '行业添加成功!');
                                    getKeyList();
                                }
                            });
                    }
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                    return true;
                },
                saveConfirm: function(id) {
                    iConfirm.close(id);
                    var list = [];
                    $.each($scope.relevanceList, function(i, o) {
                        if(o[0] && o[0].content != ''){
                            list = list.concat(o)
                        }
                    });
                    var data = {
                        rows: {
                            name: $scope.addBsinessName,
                            business: $scope.addName,
                            type: '1',
                            status: 'P',
                            contents: list
                        }
                    };
                    iAjax
                        .post('sys/web/CommonController.do?action=updateBusiness', data)
                        .then(function(data) {
                            if (data.status == '1') {
                                showMessage(1, '添加成功!');
                                geSydialectList($scope.indexBusiness);
                                $scope.showAddBtn = false;
                                $scope.showModBtn = false;
                                $scope.showDelBtn = false;
                                $scope.relevanceList = [];
                            }
                        });
                }
            };

            $scope.updateSydialect = function(id) {
                iConfirm.close(id);
                var data = {
                    rows: $scope.list
                };
                iAjax
                    .post('sys/web/CommonController.do?action=updateSydialect', data)
                    .then(function(data) {
                        if (data.status == '1') {
                            iConfirm.close(id);
                            $scope.relevanceList = [];
                            $scope.modBtn = false;
                            $scope.showModBtn = false;
                            $scope.showAddBtn = false;
                            $scope.showDelBtn = false;
                            $scope.saveDialectKey = $scope.list.map(function(o) {
                                return (o.key + '、')
                            });
                            for (var i = 0; i < $scope.list.length; i++) {
                                $.each($scope.businessList, function(o, item) {
                                    if (!$scope.relevanceList[o]) {
                                        $scope.relevanceList[o] = [];
                                    }
                                    if ($scope.businessList[o].content != $scope.list[0].business) {
                                        $scope.relevanceList[o].push({
                                            key: $scope.list[i].key,
                                            content: '',
                                            business: item.content,
                                            name: item.name
                                        });
                                    }

                                });
                            }
                            geSydialectList($scope.indexBusiness);
                            if ($scope.list[0].status == 'add' && $scope.showiConfirm == false) {
                                iConfirm.show({
                                    scope: $scope,
                                    title: '添加成功!',
                                    templateUrl: $.soa.getWebPath('iiw.system.sydialect') + '/view/relevanceBusiness.html',
                                    buttons: [{
                                        text: '是',
                                        style: 'button-primary',
                                        action: 'dialect.saveConfirm'
                                    }, {
                                        text: '否',
                                        style: 'button-caution',
                                        action: 'dialect.confirmClose'
                                    }]
                                });
                            } else {
                                showMessage(1, '修改成功!')
                            }
                        }
                    })
            };

            $scope.save = function() {
                $scope.list = [];
                var aSelect = _.where($scope.dialectList, {content: ''});
                $.each($scope.dialectList, function(i, o) {
                    if (o.status == 'add') {
                        o.business = $scope.indexBusiness;
                        $scope.list.push(o)
                    } else if (o.status == 'mod') {
                        o.content = o._content;
                        o.business = $scope.indexBusiness;
                        o.key = o._key;
                        $scope.list.push(o)
                    }
                });
                if (aSelect.length) {
                    iConfirm.show({
                        scope: $scope,
                        title: '提示',
                        content: '还有关键字未输入内容是否提交?',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'updateSydialect'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'dialect.confirmClose'
                        }]
                    });
                } else {
                    $scope.updateSydialect();
                }

            };

            $scope.cancleMod = function(item) {
                item.status = 'normal';
                var aSelect = _.where($scope.dialectList, {status: 'mod'});
                if (!aSelect.length) {
                    $scope.modBtn = false;
                    $scope.showModBtn = false;
                    $scope.showAddBtn = false;
                    $scope.showDelBtn = false;
                }
            };

            $scope.cancleAdd = function() {
                var delAdd = this.$parent.$index;
                $scope.dialectList.splice(delAdd, 1);
                var aSelect = _.where($scope.dialectList, {status: 'add'});
                if (!aSelect.length) {
                    $scope.modBtn = false;
                    $scope.showModBtn = false;
                    $scope.showAddBtn = false;
                    $scope.showDelBtn = false;
                    //$scope.businessList.shift();
                    //$scope.indexBusiness = $scope.businessList[0].content;
                    //geSydialectList($scope.indexBusiness);
                }
            };

            $scope.delBusiness = function(data) {
                $scope.delBusinessName = data;
            };

            $scope.selectBusinessList = function(business) {
                $scope.indexBusiness = business;
                geSydialectList(business)
            };

            $scope.selectBusinessValue = function(data) {
                $scope.selectBusiness = data;
            };

            $scope.cancle = function() {
                $scope.modBtn = false;
                $scope.showModBtn = false;
                $scope.showAddBtn = false;
                $scope.showDelBtn = false;
                geSydialectList($scope.indexBusiness);
            };

            $scope.init = function() {
                getBusinessAll();
                //getBusinessKetList()
            };

            $scope.init();

            //function getBusinessKetList() {
            //    var data = {
            //        filter: {
            //            key: 'PC'
            //        }
            //    };
            //    iAjax
            //        .post('sys/web/CommonController.do?action=getBusinessDialect', data)
            //        .then(function(data){
            //            //console.log(data)
            //        })
            //}

            function showMessage(level, content) {
                var message = {};
                message.id = new Date();
                message.level = level;
                message.content = content;
                message.title = $scope.title;
                iMessage.show(message);
            }

            function getBusinessAll() {
                iAjax
                    .post('sys/web/CommonController.do?action=getBusiness')
                    .then(function(data) {
                        if (data.result && data.result.row) {
                            $scope.businessList = data.result.row;
                            $scope.indexBusiness = $scope.businessList[0].content;
                            geSydialectList($scope.indexBusiness);
                        }
                    })
            }

            function geSydialectList(business) {
                var data = {
                    filter: business
                };
                iAjax
                    .post('sys/web/CommonController.do?action=getSydialect', data)
                    .then(function(data) {
                        if (data && data.result.rows) {
                            $scope.dialectList = data.result.rows;
                        }
                    })
            }

            function getKeyList() {
                iAjax
                    .post('sys/web/CommonController.do?action=getKey')
                    .then(function(data) {
                        if (data && data.result.row) {
                            $scope.keyList = data.result.row;
                            var addBsinessName = $('#addBsinessName')[0].value;
                            $scope.addName = $('#addName')[0].value;
                            $scope.dialectList = [];
                            $scope.businessList.unshift({name: addBsinessName, content: $scope.addName});
                            $scope.indexBusiness = $scope.addName;
                            for (var i = 0; i < $scope.keyList.length; i++) {
                                $scope.dialectList.push({
                                    business: addBsinessName, key: $scope.keyList[i].key, content: '', status: 'add'
                                })
                            }
                            $scope.showiConfirm = true;
                            $scope.modBtn = true;
                            $scope.showAddBtn = true;
                            $scope.showModBtn = true;
                            $scope.showDelBtn = true;
                            $scope.addBsinessName = addBsinessName;
                        }
                    })
            }

        }])
});
