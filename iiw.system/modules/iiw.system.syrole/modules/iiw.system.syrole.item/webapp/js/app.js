/**
 * 权限管理-配置页
 *
 * @author - dwt
 * @date - 2016-06-27
 * @version - 0.1
 */
define([
    'app',
    'moment',
    'cssloader!system/syrole/item/css/index.css'
], function(app) {
    app.controller('syroleItemController', [
        '$scope',
        '$state',
        '$stateParams',
        'iAjax',
        'iMessage',
        'iConfirm',

        function($scope, $state, $stateParams, iAjax, iMessage, iConfirm) {
            $scope.title = '';

            var role, type;

            if($stateParams.data) {
                role = $stateParams.data.item;
                type = $stateParams.data.type;

                $scope.item = role;
            }

            if(type == 'add') {
                $scope.title = '权限管理-添加';
            } else {
                $scope.title = '权限管理-修改';
            }

            $scope.$on('syroleItemControllerExitEvent', function() {

            });

            $scope.back = function() {
                $scope.$parent.init();

                var params = {data: null};
                $state.params = params;
                $state.go('system.syrole', params);
            };

            $scope.role = {
                data: null,
                object: null,

                save: function(isInvalid) {

                    if(isInvalid) {
                        return;
                    }

                    var data,
                        //oSys = {},
                        temp = [],
                        roles = [];

                    _.each($scope.role.form.funList, function(item) {
                        if(item.select) {
                            roles.push(item.id);
                        }
                    });

                    roles = roles.concat($scope.role.form.getSelect($scope.role.form.sysList));
                    roles = roles.concat($scope.role.form.getSelect($scope.role.form.dataxList));
                    roles = roles.concat($scope.role.form.getSelect($scope.role.form.externalList));
                    roles = roles.concat($scope.role.form.getSelect($scope.role.form.informationList));
                    roles = roles.concat($scope.role.form.getSelect($scope.role.form.roleList));

                    //系统后台模块，若levels不是一级的，则根据他是否有子模块来显示
                    _.each($scope.role.form.backmoduleList, function(item) {
                        if(item['levels'] != '1') {
                            temp = _.filter($scope.role.form.sysList, {select: true, pId: item.id});
                            if(temp.length) {
                                roles.push(item.id);
                            }
                        }else {
                            roles.push(item.id);
                        }
                    });

                    _.each($scope.role.form.childList, function(item) {
                        temp = $scope.role.form.getSelect(item.list);
                        if(temp.length > 0) {
                            roles.push(item.id);
                            roles = roles.concat(temp);
                        }
                    });

                    //服务菜单由后台统一添加
                    //_.each($scope.role.form.serviceList, function(item) {
                    //    roles.push(item.id);
                    //});

                    data = {
                        row: {
                            code: this.object.code,
                            name: this.object.name,
                            homepage: this.object.homepage,
                            status: this.object.status,

                            rows: roles
                        }
                    };

                    if(this.object.id) {
                        data.row.id = this.object.id;
                    }

                    $scope.role.data = data;

                    saveRole();
                },
                confirmSaveRole: function(id) {
                    var data = $scope.role.data;
                    var url = 'sys/web/role.do?action=addSyrole';

                    if(role.id) {
                        url = 'sys/web/role.do?action=upSyrole';
                    }

                    iAjax
                        .post(url, data)
                        .then(function(data) {
                            if(data && data.status == 1) {
                                var message = {};
                                message.level = 1;
                                message.title = $scope.title;
                                message.content = '保存成功！';
                                if($scope.role.object.id) {
                                    message.content = '修改成功！';
                                }

                                $scope.role.data = null;
                                iConfirm.close(id);
                                iMessage.show(message, false);

                                $scope.back();
                            }
                        });
                },
                confirmClose: function(id) {
                    iConfirm.close(id);
                },

                form: {
                    statusList: [{value: 'P', name: '启用'}, {value: 'C', name: '禁用'}],

                    togglePanel: {
                        fun: true,
                        sys: false,
                        datax: false,
                        information: false,
                        external: false,
                        role: true
                    },
                    funList: [],
                    childList: [],
                    sysList: [],
                    backmoduleList: [],
                    dataxList: [],
                    externalList: [],
                    informationList: [],
                    roleList: [],
                    //serviceList: [],

                    toggle: function(item, name, event) {

                        if(event && event.target.tagName == 'A') {
                            return;
                        }

                        item[name] = !item[name];

                    },

                    select: function(item, event) {

                        if(event && event.target.tagName == 'INPUT') {
                            return;
                        }

                        item.select = !item.select;

                        if(item.type == 'fun' || item.type == 'hidden') {
                            if(item.select) {
                                if(!$scope.role.object.homepage) {
                                    $scope.role.object.homepage = item.id;
                                }
                            } else {
                                var aSelect = _.filter($scope.role.form.funList, {select: true});
                                if(aSelect.length > 0) {
                                    if($scope.role.object.homepage == item.id) {
                                        $scope.role.object.homepage = aSelect[0].id;
                                    }
                                } else {
                                    $scope.role.object.homepage = '';
                                }
                            }
                        }

                    },
                    selectAll: function(list) {
                        _.each(list, function(item) {
                            item.select = true;
                        });

                        if(list[0].type == 'fun' || list[0].type == 'hidden') {
                            if(!$scope.role.object.homepage) {
                                $scope.role.object.homepage = list[0].id;
                            }
                        }
                    },
                    unSelectAll: function(list) {
                        _.each(list, function(item) {
                            item.select = false;
                        });

                        if(list[0].type == 'fun' || list[0].type == 'hidden') {
                            $scope.role.object.homepage = '';
                        }
                    },
                    getSelect: function(list) {
                        var result = [];
                        _.each(list, function(item) {
                            if(item.select) {
                                result.push(item.id);
                            }
                        });
                        return result;
                    },
                    formatImagePath: iAjax.formatURL('security/common/monitor.do?action=getFileDetail') + '&url=',
                    formatList: function(list) {
                        var imagePath = $.soa.getWebPath('iiw.system.syrole.item') + '/img/symenu/';
                        return _.map(list, function(item) {
                            item.imageUrl = 'url(' + (imagePath + item.menuUrl) + '.jpg)';
                            return item;
                        });
                    },
                    getMenuList: function() {
                        getMenuList(function(list) {
                            if($scope.role.object.id) {
                                getRoleMenuList($scope.role.object.id, function(list2) {

                                    var tempObj = {};
                                    _.each(list, function(item) {
                                        tempObj[item.id] = item;
                                        tempObj[item.id].select = false;
                                    });

                                    _.each(list2, function(item) {
                                        if(tempObj[item.id]) {
                                            tempObj[item.id].select = true;
                                        }
                                    });

                                    $scope.role.form.setMenuData(list);
                                });
                            } else {
                                $scope.role.form.setMenuData(list);
                            }
                        });
                    },
                    setMenuData: function(list) {
                        var funList = [],
                            sysList = [],
                            backmoduleList = [],
                            dataxList = [],
                            informationList = [],
                            externalList = [],
                            roleList = [],
                        //serviceList = [],
                            children, childs = [];

                        _.each(list, function(item) {
                            if(item.type == 'fun' || item.type == 'hidden') {
                                funList.push(item);
                            } else if(item.type == 'sys') {
                                sysList.push(item);
                            } else if(item.type == 'information') {
                                informationList.push(item);
                            } else if(item.type == 'external') {
                                externalList.push(item);
                            } else if(item.type == 'role') {
                                roleList.push(item);
                            } else if(item.type == 'backmodule') {
                                backmoduleList.push(item);
                            } else if(item.type == 'datax') {
                                dataxList.push(item);
                            }
                        });

                        funList = $scope.role.form.formatList(funList);
                        sysList = $scope.role.form.formatList(sysList);
                        backmoduleList = $scope.role.form.formatList(backmoduleList);
                        externalList = $scope.role.form.formatList(externalList);
                        informationList = $scope.role.form.formatList(informationList);

                        _.each(funList, function(item) {
                            children = _.filter(list, {pId: item.id});
                            if(children.length > 0) {
                                item.hasChild = true;

                                children = $scope.role.form.formatList(children);
                                childs.push({
                                    id: item.id,
                                    name: item.name,
                                    togglePanel: false,
                                    list: children.slice(0)
                                });
                            }
                        });

                        $scope.role.form.funList = funList;
                        $scope.role.form.sysList = sysList;
                        $scope.role.form.backmoduleList = backmoduleList;
                        $scope.role.form.dataxList = dataxList;
                        $scope.role.form.informationList = informationList;
                        $scope.role.form.externalList = externalList;
                        $scope.role.form.childList = childs;
                        $scope.role.form.roleList = roleList;
                        //$scope.role.form.serviceList = serviceList;

                        if(_.find(funList, {select: true})) {
                            $scope.role.form.togglePanel.fun = true;
                        }

                        if(_.find(sysList, {select: true})) {
                            $scope.role.form.togglePanel.sys = true;
                        }

                        if(_.find(dataxList, {select: true})) {
                            $scope.role.form.togglePanel.datax = true;
                        }

                        if(_.find(informationList, {select: true})) {
                            $scope.role.form.togglePanel.information = true;
                        }

                        if(_.find(externalList, {select: true})) {
                            $scope.role.form.togglePanel.external = true;
                        }

                        if(_.find(roleList, {select: true})) {
                            $scope.role.form.togglePanel.role = true;
                        }

                        _.each(childs, function(child) {
                            if(_.find(child.list, {select: true})) {
                                child.togglePanel = true;
                            }
                        });

                    }
                }
            };

            function saveRole() {
                if(!$scope.role.object.homepage) {
                    iConfirm.show({
                        scope: $scope,
                        title: '确认保存？',
                        content: '权限缺少默认首页，可能导致无法进入系统！',
                        buttons: [{
                            text: '确认',
                            style: 'button-primary',
                            action: 'role.confirmSaveRole'
                        }, {
                            text: '取消',
                            style: 'button-caution',
                            action: 'role.confirmClose'
                        }]
                    });
                } else {
                    $scope.role.confirmSaveRole();
                }
            }

            function getMenuList(cb) {
                var url, data;
                url = 'sys/web/menu.do?action=getmenu';
                data = {};

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data && data.result && data.result.rows) {
                            if(cb && typeof(cb) == 'function') {
                                cb(data.result.rows);
                            }
                        }
                    });
            }

            function getRoleMenuList(id, cb) {
                var url = 'sys/web/menu.do?action=getmenurole',
                    data = {
                        row: {
                            id: id
                        }
                    };

                iAjax
                    .post(url, data)
                    .then(function(data) {
                        if(data.result && data.result.rows) {
                            if(cb && typeof(cb) == 'function') {
                                cb(data.result.rows);
                            }
                        }
                    });
            }

            if(!role) {
                $scope.back();
            } else {
                role.homepage = role.homepagefk;
                $scope.role.object = $.extend(true, {}, role);

                $scope.role.form.getMenuList();

                if(!$scope.role.object.status) {
                    $scope.role.object.status = 'P';
                }
            }

        }
    ]);

});