/**
 * 选择设备
 *
 * Created by YBW on 2017/4/10.
 */
define(['app'], function(app) {
    app.controller('safeGetDataController', [
        '$scope',
        'iAjax',
        '$uibModalInstance',
        '$rootScope',
        'iMessage',
        'iTimeNow',
        'getType',
        'callback',
        'lastData',
        'way',
        'deploy',
        function($scope, iAjax, $uibModalInstance, $rootScope, iMessage, iTimeNow, getType, callback, lastData, way, deploy){

            $scope.type = getType;
            /**
             * 判断选择单个还是多个
             *
             * @author ybw
             * @date 2017-6-28
             * @version 1.0
             */
            switch (way) {
                case 'odd':
                    $scope.way = 'odd';
                    break;
                case 'many':
                    $scope.way = 'many';
                    break;
                default:
                    $scope.way = 'many';
            }

            /**
             * 查看调用服务类型
             *
             * @author ybw
             * @date 2017-6-28
             * @version 1.0
             */
            switch (getType) {
                case 'user':
                    initUser();
                    break;
                case 'device':
                    initDevice();
                    break;
                case 'syou':
                    initSyou();
                    break;
            }


            /**
             * 初始化用户数据
             *
             * @author ybw
             * @date 2017-6-28
             * @version 1.0
             */
            function initUser() {

                $scope.user = {
                    list: [],
                    params: {
                        pageNo: 0,
                        pageSize: 10,
                        totalSize: 0,
                        totalPage: 0
                    },
                    filter: {
                        searchText: ''
                    },
                    path: function() {
                        if(deploy && deploy['path']) {
                            return deploy['path'];
                        } else {
                            return 'sys/web/syuser.do?action=getSyuserAll';
                        }
                    }(),
                    itemValue: function() {
                        if(deploy && deploy['item']) {
                            var value = [];
                            for(var k in deploy['item']) {
                                value.push(k);
                            }
                            return value;
                        } else {
                            return ['name', 'realname', 'code', 'syouname'];
                        }
                    }(),
                    itemName: function() {
                        if(deploy && deploy['item']) {
                            var name = [];
                            for(var k in deploy['item']) {
                                name.push(deploy['item'][k]);
                            }
                            return name;
                        } else {
                            return ['用户名', '姓名', '编号', '所属单位'];
                        }
                    }(),
                    getList: function() {
                        iAjax.post(this.path, {
                            params: this.params,
                            filter: this.filter
                        }).then(function(data) {

                            if(data.result && data.result.rows) {

                                $scope.user.list = data.result.rows;
                                if(data.result.params) {
                                    $scope.user.params = data.result.params;
                                }

                            }

                        }, function() {
                            remind(4, '网络连接出错');
                        });
                    },
                    tempList: function() {
                        if($scope.way == 'many' && lastData && lastData.length) {
                            var data = {};
                            $.each(lastData, function(i, o) {
                                data[o.id] = o;
                            });
                            return data;
                        } else {
                            return {};
                        }
                    }(),
                    keyup: function(e) {
                        if(e.keyCode == 13) {
                            this.getList();
                        }
                    },
                    many: function(data) {
                        if(this.tempList[data.id]) {
                            delete this.tempList[data.id];
                        } else {
                            this.tempList[data.id] = data;
                        }
                    },
                    odd: function(data) {
                        callback([data]);
                        $uibModalInstance.close();
                    },
                    close: function() {

                        var data = [];
                        for(var k in this.tempList) {
                            data.push(this.tempList[k]);
                        }

                        if(data.length) {
                            callback(data);
                        }
                        $uibModalInstance.close();
                    }
                };

                $scope.user.getList();
            }



            /**
             * 初始化设备数据
             *
             * @author ybw
             * @date 2017-6-28
             * @version 1.0
             */
            function initDevice() {
                $scope.device = {
                    list: [],
                    params: {
                        pageNo: 0,
                        pageSize: 10,
                        totalSize: 0,
                        totalPage: 0
                    },
                    type: [],
                    company: [],
                    filter: {
                        company: '',
                        searchText: '',
                        type: ''
                    },
                    path: function() {
                        if(deploy && deploy['path']) {
                            return deploy['path']
                        } else {
                            return 'security/device.do?action=getDevice'
                        }
                    }(),
                    itemValue: function() {
                        if(deploy && deploy['item']) {
                            var value = [];
                            for(var k in deploy['item']) {
                                value.push(k);
                            }
                            return value;
                        } else {
                            return ['name', 'code', 'typename', 'syouname', 'company'];
                        }
                    }(),
                    itemName: function() {
                        if(deploy && deploy['item']) {
                            var name = [];
                            for(var k in deploy['item']) {
                                name.push(deploy['item'][k]);
                            }
                            return name;
                        } else {
                            return ['名称', '编号', '类型', '所属单位', '厂商'];
                        }
                    }(),

                    //获取设备列表
                    getList: function() {
                        iAjax.post(this.path, {
                            params: this.params,
                            filter: this.filter
                        }).then(function(data) {

                            if(data.result && data.result.rows) {

                                $scope.device.list = data.result.rows;
                                if(data.result.params) {
                                    $scope.device.params = data.result.params;
                                }

                            }

                        });
                    },

                    //获取设备类型
                    getDeviceType: function() {
                        iAjax.post('security/deviceCode.do?action=getDevicecodeType').then(function(data) {

                            if(data.result && data.result.rows) {
                                $scope.device.type = data.result.rows;
                            }

                        });
                    },
                    tempList: function(){
                        if($scope.way == 'many' && lastData && lastData.length) {
                            var data = {};
                            $.each(lastData, function(i, o) {
                                data[o.id] = o;
                            });
                            return data;
                        } else {
                            return {};
                        }
                    }(),

                    //添加设备
                    many: function(data) {
                        if(this.tempList[data.id]) {
                            delete this.tempList[data.id];
                        } else {
                            this.tempList[data.id] = data;
                        }

                    },
                    odd: function(data) {
                        callback([data]);
                        $uibModalInstance.close();
                    },
                    close: function() {

                        var data = [];
                        for(var k in this.tempList) {
                            data.push(this.tempList[k]);
                        }

                        if(data.length) {
                            callback(data);
                        }
                        $uibModalInstance.close();

                    },
                    keyup: function(e) {
                        if(e.keyCode == 13) {
                            this.getList();
                        }
                    },
                    typeChange: function(data) {

                        if(data == undefined) {
                            $scope.device.filter.type = '';
                            $scope.device.filter.company = '';
                            $scope.device.company = [];
                        } else {
                            var obj = _.where($scope.device.type, {content: data})[0];

                            if(obj && obj.child) {
                                $scope.device.company = obj.child;
                            }
                        }
                        $scope.device.getList();

                    },
                    companyChange: function(data) {
                        $scope.device.getList();

                        if(data == undefined) {
                            $scope.device.filter.company = '';
                        }
                    }
                };

                $scope.device.getList();
                $scope.device.getDeviceType();
            }



            /**
             * 初始化单位数据
             *
             * @author ybw
             * @date 2017-6-28
             * @version 1.0
             */
            function initSyou() {
                $scope.syou = {
                    data: [],
                    path: function() {
                        if(deploy && deploy['path']) {
                            return deploy['path']
                        } else {
                            return 'sys/web/syou.do?action=getSyouAll';
                        }
                    }(),
                    parentId: function() {
                        if(deploy && deploy['parentId']) {
                            return deploy['parentId']
                        } else {
                            return 'pId';
                        }
                    }(),
                    treeChild: function() {
                        if(deploy && deploy['treeChild']) {
                            if(deploy['treeChild'] == 'true') {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    }(),
                    getList: function() {

                        iAjax.post(this.path).then(function(data) {

                            if(data.result && data.result.rows) {
                                $.each(data.result.rows, function(i, o) {
                                    o.parentid = o[$scope.syou.parentId];
                                });
                                $scope.syou.data = data.result.rows;
                            }

                        });

                    },
                    load: function() {

                        var tops = _.where($scope.syou.data, {__istop: true});
                        $.each(tops, function(i, top) {
                            top.icon = 'fa-home text-warning';
                        });
                    },
                    close: function() {

                        if(callback) {
                            var data = [],
                                tempList = this.tempList;

                            for(var k in tempList) {
                                delete tempList[k].treeNodes;
                                data.push(tempList[k]);
                            }

                            callback(data);
                        }

                        $uibModalInstance.close();
                    },
                    odd: function(data) {

                        if(callback) {
                            if($scope.syou.treeChild) {
                                var tempData = [];
                                tempData.push(data);
                                $.each(data.treeNodes, function(i, o) {
                                    tempData.push(o);
                                });
                                $.each(tempData, function(i, o) {
                                    delete o.treeNodes;
                                });
                                callback(tempData);
                            } else {
                                delete data.treeNodes;
                                callback([data]);
                            }
                        }

                        $uibModalInstance.close();

                    },
                    tempList: {},
                    many: function(data) {
                        var tempList = $scope.syou.tempList;
                        if(data.check) {
                            delete tempList[data.id];
                        } else {
                            tempList[data.id] = data;
                        }

                        if($scope.syou.treeChild && data.treeNodes && data.treeNodes.length) {
                            $.each(data.treeNodes, function(i, o) {
                                if(data.check) {
                                    delete tempList[o.id];
                                } else {
                                    tempList[o.id] = o;
                                    o.check = true;
                                }
                            });
                        }

                    }
                };

                $scope.syou.getList();
            }

            //信息框
            function remind(level, content, title) {
                var message = {
                    id: iTimeNow.getTime(),
                    title: (title || '消息提醒'),
                    content: (content || '网络出错'),
                    level: level
                };

                iMessage.show(message, false);
            }
    }]);
});
