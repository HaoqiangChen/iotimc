/**
 * 信息上报管理-配置关联
 * Created by LLX in 2017-04-26.
 */

define([
    'app',
    'cssloader!system/informationappear/config/css/index.css',
    'system/informationappear/config/js/directives/monitorpatroltree'
], function(app) {
    app.controller('informationappearConfigController', [
        '$scope',
        'iAjax',
        '$state',
        'iConfirm',
        'iMessage',
        function($scope, iAjax, $state, iConfirm, iMessage) {
            var cacheOuTreeList = [];
            $scope.title = '信息上报管理';
            $scope.listSize = 20;
            $scope.informationappearconfig = {
                showSelect: false,
                selAll: false,
                selectList: [],
                tempList: [],
                modInputtype: '',
                list: [],
                informationType: '',
                filterValue: '',
                changeInputtype: '',
                back: function() {
                    $state.go('system.informationappear');
                    $scope.$parent.informationappear.getInformationItem();
                },
                select: function(event, item) {
                    if (event && (event.target.tagName == 'INPUT' || event.target.tagName == 'SELECT')) {
                        return
                    } else {
                        item.checked = !item.checked;
                        if (item.checked == true) {
                            if (!item.itemfk) {
                                item.itemfk = item.id;
                            }
                            $scope.informationappearconfig.tempList.push(item);
                        } else {
                            $.each($scope.informationappearconfig.tempList, function(i, o) {
                                if (o.itemfk == item.id) {
                                    $scope.informationappearconfig.tempList.splice(i, 1)
                                }
                            });

                        }
                    }
                },
                selectAll: function() {
                    $.each($scope.informationappearconfig.list, function(i, item) {
                        item.checked = $scope.informationappearconfig.selAll;
                    });
                },
                save: function() {
                    var aSelect = _.where($scope.informationappearconfig.list, {checked: true});
                    var syous = $scope.ouTree.oNode.getCheckedNodes();
                    var bSelect = [];
                    $.each(aSelect, function(i, o) {
                        if(!o.inputtype) {
                            bSelect.push(o);
                        }
                    });
                    if(!syous.length) {
                        $scope.informationappearconfig.showMessage(3, '请选择信息上报单位!')
                    } else {
                        if(bSelect.length) {
                            var aName = bSelect.map(function(item, index) {
                                return (index + 1 + '、' + item.name);
                            });
                            iConfirm.show({
                                scope: $scope,
                                title: '温馨提示:',
                                content: '共有' + aSelect.length + '条上报项操作方式为空，分别为：<br>' + aName.join('<br>'),
                                buttons: [{
                                    text: '确认',
                                    style: 'button-primary',
                                    action: 'confirmSuccess'
                                }, {
                                    text: '取消',
                                    style: 'button-caution',
                                    action: 'confirmClose'
                                }]
                            });
                        } else {
                            $scope.submitData();
                        }
                    }

                },
                changeType: function() {
                    $scope.informationappearconfig.getInformationItem();
                },
                getInformation: function(syoufk) {
                    var data = {
                        syoufk: syoufk
                    };
                    iAjax
                        .post('information/report/report.do?action=getInformationitemdtl', data)
                        .then(function(data) {
                            $scope.informationappearconfig.tempList = data.result.rows;
                            $.each(data.result.rows, function(i, o) {
                                $scope.informationappearconfig.showSelect = true;
                                $.each($scope.informationappearconfig.list, function(y, p) {
                                    if (o.itemfk == p.id) {
                                        p.checked = true;
                                        p.inputtype = o.inputtype;
                                    }
                                })
                            })
                        })
                },
                getInformationItem: function() {
                    var data = {
                        filter: $scope.informationappearconfig.filterValue,
                        type: $scope.informationappearconfig.informationType
                    };
                    iAjax
                        .post('information/report/report.do?action=getInformationitem', data)
                        .then(function(data) {
                            if (data.result && data.result.rows) {
                                if ($scope.informationappearconfig.tempList.length) {
                                    $.each($scope.informationappearconfig.tempList, function(i, o) {
                                        $.each(data.result.rows, function(y, item) {
                                            if (o.itemfk == item.id) {
                                                item.checked = true;
                                                item.inputtype = o.inputtype;
                                            }
                                        })
                                    })
                                }
                                $scope.informationappearconfig.list = data.result.rows;

                            }
                        })
                },
                showMessage: function(level, content) {
                    var json = {
                        title: $scope.title,
                        level: level,
                        content: content
                    };
                    iMessage.show(json)
                },
                selectInputType: function() {
                    $.each($scope.informationappearconfig.list, function(i, o) {
                        o.inputtype = $scope.informationappearconfig.changeInputtype;
                    });
                }
            };

            $scope.submitData = function(type) {
                var aSelect = _.where($scope.informationappearconfig.list, {checked: true});
                if(type == 1) {
                    $.each(aSelect, function(i, o) {
                        if(!o.inputtype) {
                            aSelect.splice(i, 1);
                        }
                    })
                }
                var syous = $scope.ouTree.oNode.getCheckedNodes();
                var syouList = [];
                var data = {};
                data.infos = aSelect;
                if (syous.length && syous.length > 0) {
                    $.each(syous, function (i, o) {
                        syouList.push(o.id)
                    });
                }
                data.syous = syouList;
                data.type = $scope.informationappearconfig.informationType;
                iAjax.post('information/report/report.do?action=updataInformationitemdtl', data).then(function(data) {
                    if (data.status == 1) {
                        $scope.informationappearconfig.showMessage(1, '上报项关联成功!')
                    }
                });
            };


            $scope.confirmSuccess = function(id) {
                iConfirm.close(id);
                $scope.submitData(1);
            };

            $scope.confirmClose = function(id) {
                iConfirm.close(id);
            };

            $scope.nextPage = function() {
                $scope.listSize += 20;
                if ($scope.listSize > $scope.informationappearconfig.list.length) {
                    $scope.listSize = $scope.informationappearconfig.list.length;
                }
            };

            $scope.init = function() {
                getDeviceTree();
                $scope.informationappearconfig.getInformationItem();
            };

            $scope.init();

            $scope.ouTree = {
                setting: {
                    check: {
                        enable: true,
                        chkboxType: {'Y': '', 'N': 'ps'}
                    },
                    data: {
                        key: {
                            title: 't'
                        },
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick: function(event, treeid, treeNode) {
                            $scope.informationappearconfig.getInformation(treeNode.id);
                            $scope.informationappearconfig.changeInputtype = '';
                            $.each($scope.informationappearconfig.list, function(i, o) {
                                o.checked = false;
                                o.inputtype = '';
                            });
                        }
                    }
                },
                tree: {
                    treeNodes: []
                }
            };

            function getDeviceTree() {
                var url, data;
                url = 'sys/web/syou.do?action=getSyouAll';
                data = {};
                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if (data.result.rows && data.result.rows.length > 0) {
                            var arr = data.result.rows;
                            _.each(arr, function(o) {
                                o['isOu'] = true;
                                o['iconSkin'] = 'ouIcon';
                            });
                            cacheOuTreeList = arr;
                            $scope.ouTree.tree.treeNodes = cacheOuTreeList;
                        }
                    });
            }
        }])
});