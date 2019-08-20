/**
 * 电子地图管理-地图列表控制器
 *
 * @author - dwt
 * @date - 2016-01-26
 * @version - 0.1
 */
define([
    'app',
    'system/insidemapsetting/js/service/mapsettingdata',
    'system/insidemapsetting/js/directive/insidemapsettingtree',
    'cssloader!system/insidemapsetting/css/list.css'
], function(app) {

    app.controller('insidemapSettingListController', [
        '$scope',
        '$state',
        '$filter',
        '$timeout',
        'mapSettingData',
        'iAjax',
        'iToken',
        '$http',
        'iMessage',

        function($scope, $state, $filter, $timeout, mapSettingData, iAjax, iToken, $http, iMessage) {

            $scope.$on('$viewContentLoaded', function(ngEvent) {
                $scope.$parent.titleState = '';
                $scope.$parent.subTitle = '';

                ngEvent.stopPropagation();
            });

            $scope.$parent.title = '地图列表';

            $scope.maps = {
                list: [],                   // 所有的单位、目录、地图列表
                ouList: [],                 // 所有目录列表
                filterList: [],             // 当前单位或目录下的列表
                filterValue: '',            // 过滤值
                select: null,               // 当前选中的单位、目录、地图
                status: '',                 // 根据值：select、edit、del 显示不同的操作按钮

                // 导航
                navigate: {
                    list: [],
                    selectItem: function(item) {
                        var index = this.list.indexOf(item);
                        if(index > -1) {
                            this.list.splice((index + 1), (this.list.length - index - 1));
                        }
                        $scope.maps.filterMapList(item);
                    },
                    getLastItem: function() {
                        return (this.list.length ? this.list[this.list.length - 1] : null);
                    },
                    getOuFk: function() {
                        for(var i = this.list.length - 1; i >= 0; i--) {
                            if(this.list[i].type == 'ou') {
                                return this.list[i].id;
                            }
                        }
                    },
                    init: function(firstData) {
                        var path = mapSettingData.getNavigate(),
                            list = $scope.maps.list;

                        if(path) {
                            var aFind;
                            angular.forEach(path, function(v) {
                                aFind = $filter('filter')(list, {id: v.id});
                                if(aFind.length) {
                                    $scope.maps.navigate.list.push(aFind[0]);
                                }else {
                                    return false;
                                }
                            });
                        }else {
                            $scope.maps.navigate.list.push(firstData);
                        }
                    }
                },

                // 全局配置项
                oSetting: {
                    row: null,
                    safeColor: '',
                    safeColorFn: {
                        changeColor: function(color) {
                            $scope.maps.oSetting.safeColor = color;
                        },
                        changedColor: function(color) {
                            $scope.maps.oSetting.safeColor = color;
                        },
                        setColor: function(color) {
                            $scope.maps.oSetting.safeColor = color;
                            if(this.setColorHook) {
                                this.setColorHook(color || 'rgba(17,120,27,0.7)');
                            }
                        }
                    },
                    impColor: '',
                    impColorFn: {
                        changeColor: function(color) {
                            $scope.maps.oSetting.impColor = color;
                        },
                        changedColor: function(color) {
                            $scope.maps.oSetting.impColor = color;
                        },
                        setColor: function(color) {
                            $scope.maps.oSetting.impColor = color;
                            if(this.setColorHook) {
                                this.setColorHook(color || 'rgba(17,120,27,0.7)');
                            }
                        }
                    },
                    init: function() {
                        mapSettingData.getSycode('mapglobalsetting', function(list) {
                            $scope.maps.oSetting.row = list[0];

                            var rows = (list[0].content || '').split('|');

                            if(rows[0]) {
                                $scope.maps.oSetting.safeColor = rows[0];
                                $scope.maps.oSetting.safeColorFn.setColor(rows[0]);
                            }

                            if(rows[1]) {
                                $scope.maps.oSetting.impColor = rows[1];
                                $scope.maps.oSetting.impColorFn.setColor(rows[1]);
                            }

                        });
                    },
                    cancel: function() {
                        $scope.maps.status = '';
                    },
                    saveData: function() {
                        var content = ($scope.maps.oSetting.safeColor || '') + '|' + ($scope.maps.oSetting.impColor || '') + '|',
                            url = 'sys/web/sycode.do?action=upSycode',
                            data = {
                                row: {
                                    id: $scope.maps.oSetting.row.id,
                                    content: content
                                }
                            };

                        iAjax
                            .post(url, data)
                            .then(function() {
                                $scope.maps.status = '';
                                iMessage.show({
                                    level: 1,
                                    title: '地图全局配置',
                                    content: '保存成功'
                                });
                            });
                    }
                },

                // 添加或修改的配置项
                control: {
                    object: null,
                    status: 'select',

                    layer: {
                        list: [
                            {
                                select: false,
                                name: '安全情况',
                                type: 'safe',
                                shapeGroups: [
                                    {type: 'area'},
                                    {type: 'inclosure'},
                                    {type: 'aisle', showText: true},
                                    {type: 'room', showText: true}
                                ]
                            }, {
                                select: false,
                                name: '设备点',
                                type: 'device'
                            }, {
                                select: false,
                                name: '武警值班',
                                type: 'dutypolice',
                                shapeGroups: [
                                    {type: 'dutypolice'}
                                ]
                            }, {
                                select: false,
                                name: '健康监测',
                                type: 'health',
                                shapeGroups: [
                                    {type: 'room'}
                                ]
                            }
                        ],
                        init: function(obj) {
                            var list = this.list;

                            if(obj) {
                                var aFind;
                                angular.forEach(obj, function(v) {
                                    aFind = $filter('filter')(list, {type: v.type});
                                    if(aFind.length) {
                                        aFind[0].select = true;
                                    }
                                });
                            }else {
                                angular.forEach(list, function(v) {
                                    v.select = false;
                                });
                            }
                        },
                        select: function(item) {
                            if(item.select) {
                                item.select = false;
                            }else {
                                item.select = true;
                            }
                        },
                        clear: function() {
                            angular.forEach(this.list, function(item) {
                                item.select = false;
                            });
                        }
                    },

                    edit: function(item) {
                        $scope.maps.status = 'edit';
                        this.object = angular.copy(item);
                        if(this.object.params) {
                            this.layer.init(JSON.parse(this.object.params));
                        }else {
                            this.layer.init();
                        }

                        $timeout(function() {
                            $('#mapFormTitle').select().focus();
                        });
                    },
                    copy: function(item) {
                        $scope.maps.status = 'copy';

                        $scope.maps.ouList = $filter('filter')($scope.maps.list, {type: 'ou'});
                        // 设置单位树形
                        $scope.maps.ouTree = {
                            show: false,
                            setting: {
                                data: {
                                    key: {
                                        title: 't'
                                    },
                                    simpleData: {
                                        enable: true
                                    }
                                },
                                callback: {
                                    onClick: function(event, treeId, treeNode) {
                                        $scope.maps.ouTree.show = false;
                                        $scope.maps.control.object.target = treeNode.id;
                                        $scope.maps.control.object.targetname = treeNode.name;
                                    }
                                }
                            },
                            tree: {
                                treeNodes: $scope.maps.ouList
                            },
                            toggle: function () {
                                this.show = !this.show;
                            }
                        }
                        
                        this.object = angular.copy(item);
                        this.object.name = this.object.name + '-副本';
                        this.object.code = this.object.code + '01';
                        this.object.targetname = $filter('filter')($scope.maps.ouList, {id: this.object.parentid})[0].name;
                        this.object.target = this.object.parentid;

                        if(this.object.params) {
                            this.layer.init(JSON.parse(this.object.params));
                        }else {
                            this.layer.init();
                        }

                        $timeout(function() {
                            $('#mapFormTitle').select().focus();
                        });
                    },
                    del: function(item) {
                        this.status = 'del';
                        this.object = angular.copy(item);
                    },
                    cancel: function() {
                        $scope.maps.status = '';
                        this.status = 'select';
                        this.object = null;
                        $scope.maps.control.layer.clear();
                    },

                    // 上传图片
                    showUploadDialogEvent: function() {
                        $('#upImage').val('');
                        $('#upImage').click();
                    },
                    uploadImage: function(element) {
                        var url = iAjax.formatURL('security/common/monitor.do?action=uploadPhoto&ptype=true&module=floor');

                        if($scope.maps.control.object.imageid) {
                            url += '&imageid=' + $scope.maps.control.object.imageid;
                        }else if($scope.maps.control.object.savepath) {
                            var temp = $scope.maps.control.object.savepath.split('/');
                            url += '&imageid=' + temp[temp.length - 1];
                        }

                        var formData = new FormData();
                        formData.append('imageFile', element.files[0], element.files[0].name);

                        $http({
                            method: 'post',
                            url: url,
                            data: formData,
                            headers: {
                                'Content-Type': undefined
                            }
                        }).success(function(data) {
                            if(data.result.rows) {
                                $scope.maps.control.object.savepath = data.result.rows.savepath;
                                $scope.maps.control.object.imageid = data.result.rows.imageid;
                                $scope.maps.control.object.style = {
                                    'background-image': 'url(' + iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + data.result.rows.savepath + '&random=' + Math.random() + ')',
                                    'background-size': 'contain',
                                    'background-position': 'center center',
                                    'background-repeat': 'no-repeat'
                                };
                            }
                        });
                    },
                    delData: function() {
                        var children = $filter('filter')($scope.maps.list, {parentid: $scope.maps.select.id});
                        if(children.length) {
                            //TODO
                        }else {
                            iAjax
                                .post('/security/map.do?action=delMap', {
                                    filter: {
                                        id: [$scope.maps.select.id]
                                    }
                                })
                                .then(function() {
                                    // 删除后，动态调整列表
                                    var index = -1;
                                    var aFind2;
                                    // 从列表中删除
                                    var aFind = $filter('filter')($scope.maps.list, {id: $scope.maps.select.id});
                                    if(aFind.length) {
                                        index = $scope.maps.list.indexOf(aFind[0]);
                                        if(index != -1) {
                                            $scope.maps.list.splice(index, 1);
                                        }
                                    }
                                    aFind = $filter('filter')($scope.maps.filterList, {id: $scope.maps.select.id});
                                    if(aFind.length) {
                                        index = $scope.maps.filterList.indexOf(aFind[0]);
                                        if(index != -1) {
                                            $scope.maps.filterList.splice(index, 1);
                                        }
                                    }

                                    // 从父节点中删除
                                    aFind = $filter('filter')($scope.maps.list, {id: $scope.maps.control.object['parentid']});
                                    if(aFind.length) {
                                        aFind2 = $filter('filter')(aFind[0].children, {id: $scope.maps.control.object.id});
                                        if(aFind2.length) {
                                            index = aFind[0].children.indexOf(aFind2[0]);
                                            if(index != -1) {
                                                aFind[0].children.splice(index, 1);
                                            }
                                        }
                                    }
                                    aFind = $filter('filter')($scope.maps.filterList, {id: $scope.maps.control.object['parentid']});
                                    if(aFind.length) {
                                        aFind2 = $filter('filter')(aFind[0].children, {id: $scope.maps.control.object.id});
                                        if(aFind2.length) {
                                            index = aFind[0].children.indexOf(aFind2[0]);
                                            if(index != -1) {
                                                aFind[0].children.splice(index, 1);
                                            }
                                        }
                                    }

                                    $scope.maps.control.object = null;
                                    $scope.maps.control.layer.clear();
                                });
                        }
                    },
                    saveData: function() {
                        var obj = this.object;
                        if(obj.type == 'map') {
                            var temp;
                            obj.params = [];
                            angular.forEach(this.layer.list, function(v) {
                                if(v.select) {
                                    temp = angular.copy(v);
                                    delete temp['select'];
                                    obj.params.push(temp);
                                }
                            });
                        }

                        if($scope.maps.status == 'add' || $scope.maps.status == 'edit') {
                            var url = '/security/map.do?action=addMap';
                            if ($scope.maps.control.object.id) {
                                url = '/security/map.do?action=modMap';
                            }

                            if ($scope.maps.control.object['params']) {
                                $scope.maps.control.object['params'] = JSON.stringify($scope.maps.control.object['params']);
                            }

                            iAjax
                                .post(url, {
                                    filter: obj
                                })
                                .then(function (data) {
                                    // 添加或修改后，动态调整列表
                                    if ($scope.maps.control.object.id) {
                                        _.extend($scope.maps.select, $scope.maps.control.object);
                                        $scope.maps.control.object = null;
                                    } else {
                                        $scope.maps.control.object.id = data.result.rows;
                                        $scope.maps.control.object.children = [];
                                        $scope.maps.list.push(angular.copy($scope.maps.control.object));
                                        $scope.maps.filterList.push(angular.copy($scope.maps.control.object));

                                        var aFind = $filter('filter')($scope.maps.list, {id: $scope.maps.control.object['parentid']});
                                        if (aFind.length) {
                                            if (aFind[0].children) {
                                                aFind[0].children.push(angular.copy($scope.maps.control.object));
                                            }
                                        }
                                        aFind = $filter('filter')($scope.maps.filterList, {id: $scope.maps.control.object['parentid']});
                                        if (aFind.length) {
                                            if (aFind[0].children) {
                                                aFind[0].children.push(angular.copy($scope.maps.control.object));
                                            }
                                        }

                                        $scope.maps.control.object = null;
                                    }
                                    $scope.maps.control.layer.clear();
                                });
                        } else if($scope.maps.status == 'copy') {
                            var url = 'security/map.do?action=copyMap';

                            $scope.maps.control.object.parentid = this.object.target;
                            $scope.maps.control.object.syoufk = this.object.target;

                            iAjax
                                .post(url, {
                                    filter: $scope.maps.control.object
                                })
                                .then(function (data) {
                                    $scope.maps.control.object.id = data.result.rows;
                                    $scope.maps.control.object.children = [];

                                    $scope.maps.list.push(angular.copy($scope.maps.control.object));

                                    if($scope.maps.control.object.target == $scope.maps.navigate.getLastItem().id) {
                                        $scope.maps.filterList.push(angular.copy($scope.maps.control.object));
                                    }

                                    var aFind = $filter('filter')($scope.maps.list, {id: $scope.maps.control.object['target']});
                                    if (aFind.length) {
                                        if (aFind[0].children) {
                                            aFind[0].children.push(angular.copy($scope.maps.control.object));
                                        }
                                    }
                                    aFind = $filter('filter')($scope.maps.filterList, {id: $scope.maps.control.object['target']});
                                    if (aFind.length) {
                                        if (aFind[0].children) {
                                            aFind[0].children.push(angular.copy($scope.maps.control.object));
                                        }
                                    }

                                    $scope.maps.control.object = null;

                                    $scope.maps.control.layer.clear();

                                    $scope.maps.status = '';
                                });
                        }
                    }
                },

                chooseItem: function(item) {
                    this.select = item;

                    this.control.status = 'select';
                },
                selectItem: function(item) {
                    if(item.type != 'map') {
                        this.select = null;

                        $scope.maps.navigate.list.push(item);

                        this.filterMapList(item);
                    }else {
                        $scope.$parent.titleState = 'system.insidemapsetting.list';
                        mapSettingData.saveNavigate($scope.maps.navigate.list);

                        item.bak_savepath = item.savepath;
                        item.savepath = iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + item.savepath;
                        mapSettingData.getMapShapes(item.id, function(list) {
                            item.mapDtl = list;
                            var params = {
                                data: {
                                    map: item,
                                    prevItem: $scope.maps.navigate.getLastItem(),
                                    maps: _.filter($scope.maps.filterList, {type: 'map'})
                                }
                            };
                            $state.params = params;
                            $state.go('system.insidemapsetting.map', params);
                        });
                    }
                },
                addDirectory: function() {
                    this.status = 'add';
                    this.control.status = 'select';
                    this.select = {
                        type: 'dir',
                        parentid: (this.navigate.list.length ? this.navigate.list[this.navigate.list.length - 1].id : ''),
                        syoufk: this.navigate.getOuFk()
                    };
                    this.control.object = angular.copy(this.select);

                    $timeout(function() {
                        $('#mapFormTitle').select().focus();
                    });
                },
                addMap: function() {
                    this.status = 'add';
                    this.control.status = 'select';
                    this.select = {
                        type: 'map',
                        params: [],
                        parentid: (this.navigate.list.length ? this.navigate.list[this.navigate.list.length - 1].id : ''),
                        syoufk: this.navigate.getOuFk()
                    };
                    this.control.object = angular.copy(this.select);

                    $timeout(function() {
                        $('#mapFormTitle').select().focus();
                    });
                },
                setting: function() {
                    this.status = 'setting';
                    $scope.maps.oSetting.init();
                },

                filterMapList: function(item) {
                    var list = this.list;

                    $scope.maps.filterList = [];
                    $scope.maps.filterList = $filter('filter')(list, function(v) {
                        return (v['parentid'] == item['id']);
                    });
                },
                getMapList: function() {
                    mapSettingData.getUserMap(function(list, firstData) {
                        $scope.maps.list = list;

                        $scope.maps.formatMapList();

                        $scope.maps.navigate.init(firstData);

                        var filterObject = $scope.maps.navigate.getLastItem();
                        $scope.maps.filterList = [];
                        $scope.maps.filterList = $filter('filter')(list, function(v) {
                            return (v['parentid'] == filterObject['id']);
                        });
                    });
                },
                formatMapList: function() {
                    var list = this.list;
                    angular.forEach(list, function(v) {
                        if(v.type == 'map') {
                            v.style = {
                                'background-image': 'url(' + iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=' + (v.savepath) + ')',
                                'background-size': 'contain',
                                'background-position': 'center center',
                                'background-repeat': 'no-repeat'
                            };
                        }else {
                            v.children = $filter('filter')(list, {parentid: v.id});
                        }
                    });
                }
            };

            $scope.maps.getMapList();

        }
    ]);
});