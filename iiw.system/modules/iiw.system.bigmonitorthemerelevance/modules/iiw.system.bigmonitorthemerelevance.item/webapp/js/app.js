/**
 * 电视墙模式关联-添加/修改
 *
 * Created by llx on 2017-6-20.
 */

define([
    'app',
    'cssloader!system/bigmonitorthemerelevance/item/css/index.css'

], function(app) {
    app.controller('bigmonitorthemerelevanceitemController', [
        '$scope',
        'iAjax',
        'iConfirm',
        'iMessage',
        '$state',
        '$stateParams',

        function($scope, iAjax, iConfirm, iMessage, $state, $stateParams) {
            $scope.title = '电视墙模式关联-添加';
            $scope.bigMonitorThemeRelevanceItem = {
                leftMonitorType: '',
                rightMonitorType: '',
                selAll: false,
                bigmonitorList: [],
                bigmonitorRightList: [],
                leftList: [],
                rightList: [],
                selectList: [],
                save: function() {
                    var mainthemefk = _.where($scope.bigMonitorThemeRelevanceItem.leftList, {status: true});
                    var minorthemefk = [];
                    $.each($scope.bigMonitorThemeRelevanceItem.selectList, function(i, o) {
                        minorthemefk.push(o.id)
                    });
                    var data = {
                        filter: {
                            mainthemefk: mainthemefk[0].id,
                            minorthemefk: minorthemefk
                        }
                    };
                    iAjax
                        .post('security/devicemonitor.do?action=addBigMonitorRelated', data)
                        .then(function(data) {
                            if(data && data.status == 1) {
                                showMessage(1, '添加成功!');
                                $state.go('system.bigmonitorthemerelevance');
                                $scope.$parent.bigMonitorThemeRelevance.getList();
                            }
                        })
                },
                back: function() {
                    $state.go('system.bigmonitorthemerelevance');
                    $scope.$parent.bigMonitorThemeRelevance.getList();
                },
                getBigMonitorTheme: function(type) {
                    var data = {
                        filter: {
                            id: $scope.bigMonitorThemeRelevanceItem.monitorType
                        }
                    };
                    if (type && type == 'right') {
                        data.filter.id = $scope.bigMonitorThemeRelevanceItem.rightMonitorType;
                    } else {
                        data.filter.id = $scope.bigMonitorThemeRelevanceItem.leftMonitorType;
                    }
                    iAjax
                        .post('security/devicemonitor.do?action=getBigMonitorTheme', data)
                        .then(function(data) {
                            if (data.result && data.result.rows) {
                                var arr;
                                $.each(data.result.rows, function(i, o) {
                                    arr = angular.fromJson(o.theme);
                                    o._theme = arr.length + ' * ' + arr[0].length;
                                });
                                if (type && type == 'right') {
                                    $.each($scope.bigMonitorThemeRelevanceItem.selectList, function(i, o) {
                                        $.each(data.result.rows, function(y, item) {
                                            if(o.id == item.id) {
                                                item.checked = true
                                            }
                                        })
                                    });
                                    $scope.bigMonitorThemeRelevanceItem.rightList = data.result.rows;
                                } else if (type && type == 'left') {
                                    $scope.bigMonitorThemeRelevanceItem.leftList = data.result.rows;
                                } else {
                                    $scope.bigMonitorThemeRelevanceItem.rightList = data.result.rows;
                                    $scope.bigMonitorThemeRelevanceItem.leftList = data.result.rows;
                                }
                                if($stateParams && $stateParams.data != null && type == null && $stateParams.data != 'mod') {
                                    $.each($scope.bigMonitorThemeRelevanceItem.leftList, function(i, o) {
                                        if(o.id == $stateParams.data.mainthemefk) {
                                            o.status = true;
                                        }
                                    });
                                    $.each($stateParams.data.minortheme, function(y, item) {
                                        item.checked = true;
                                        item.id = item.minorthemefk;
                                        item.name = item.minorthemename;
                                    });
                                    $scope.bigMonitorThemeRelevanceItem.selectList = $stateParams.data.minortheme;
                                    $scope.bigMonitorThemeRelevanceItem.rightList = $scope.bigMonitorThemeRelevanceItem.selectList;
                                }
                            }
                        })
                },
                changeMonitor: function(type) {
                    if(type == 'right' && $scope.bigMonitorThemeRelevanceItem.rightMonitorType == 'null') {
                        $scope.bigMonitorThemeRelevanceItem.selAll = false;
                        $scope.bigMonitorThemeRelevanceItem.rightList = $scope.bigMonitorThemeRelevanceItem.selectList;
                    } else {
                        $scope.bigMonitorThemeRelevanceItem.getBigMonitorTheme(type);
                    }
                },
                leftSelect: function(item) {
                    $.each($scope.bigMonitorThemeRelevanceItem.leftList, function(i, o) {
                        o.status = false
                    });
                    item.status = !item.status;

                },
                rightSelect: function(item) {
                    if (!item.checked) {
                        item.checked = true;
                    } else {
                        item.checked = !item.checked;
                    }
                    if(item.checked == true) {
                        $scope.bigMonitorThemeRelevanceItem.selectList.push(item)
                    } else {
                        $.each($scope.bigMonitorThemeRelevanceItem.selectList, function(i, o) {
                            if(o) {
                                if(item.id == o.id) {
                                    $scope.bigMonitorThemeRelevanceItem.selectList.splice(i, 1);
                                }
                            }

                        });
                    }
                },
                selectAll: function() {
                    $.each($scope.bigMonitorThemeRelevanceItem.rightList, function(i, o) {
                        o.checked = $scope.bigMonitorThemeRelevanceItem.selAll;
                    });
                    if($scope.bigMonitorThemeRelevanceItem.selAll == true) {
                        $.each($scope.bigMonitorThemeRelevanceItem.rightList, function(i, o) {
                            $.each($scope.bigMonitorThemeRelevanceItem.selectList, function(index, item) {
                                if(item && o.id == item.id) {
                                    $scope.bigMonitorThemeRelevanceItem.selectList.splice(index, 1);
                                }
                            })
                        });
                        $scope.bigMonitorThemeRelevanceItem.selectList = $scope.bigMonitorThemeRelevanceItem.selectList.concat(_.where($scope.bigMonitorThemeRelevanceItem.rightList, {checked: true}));
                    } else {
                        $.each($scope.bigMonitorThemeRelevanceItem.rightList, function(i, o) {
                            $.each($scope.bigMonitorThemeRelevanceItem.selectList, function(index, item) {
                                if(o && item) {
                                    if(o.id == item.id) {
                                        $scope.bigMonitorThemeRelevanceItem.selectList.splice(index, 1);
                                    }
                                }
                            })
                        });

                        $.each($scope.bigMonitorThemeRelevanceItem.selectList, function(i, o) {
                            if(o.checked == false) {
                                $scope.bigMonitorThemeRelevanceItem.selectList.splice(i, 1);
                            }
                        })
                    }
                }
            };

            $scope.init = function() {
                getMonitorList();
            };

            $scope.init();

            $scope.$watch('bigMonitorThemeRelevanceItem.rightList', function(){
                var list = _.where($scope.bigMonitorThemeRelevanceItem.rightList, {checked: true});
                if(list.length == $scope.bigMonitorThemeRelevanceItem.rightList.length && $scope.bigMonitorThemeRelevanceItem.rightList.length > 0) {
                    $scope.bigMonitorThemeRelevanceItem.selAll = true;
                } else {
                    $scope.bigMonitorThemeRelevanceItem.selAll = false;
                }
            });

            function getMonitorList() {
                var data = {
                    filter: {
                        type: 'bigmonitor',
                        cascade: 'Y'
                    }
                };
                iAjax
                    .post('/security/common/monitor.do?action=getDeviceOuList', data)
                    .then(function(data) {
                        if (data.result && data.result.rows) {
                            $scope.bigMonitorThemeRelevanceItem.bigmonitorList = data.result.rows;
                            $scope.bigMonitorThemeRelevanceItem.bigmonitorRightList = data.result.rows;
                            $scope.bigMonitorThemeRelevanceItem.leftMonitorType = data.result.rows[0].id;
                            $scope.bigMonitorThemeRelevanceItem.rightMonitorType = data.result.rows[0].id;

                            if($stateParams && $stateParams.data != null && $stateParams.data != 'mod') {
                                $scope.bigMonitorThemeRelevanceItem.leftMonitorType = $stateParams.data.maindeviceid;
                                $scope.bigMonitorThemeRelevanceItem.rightMonitorType = 'null';
                            }

                            $scope.bigMonitorThemeRelevanceItem.getBigMonitorTheme();
                        }
                    })
            }

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