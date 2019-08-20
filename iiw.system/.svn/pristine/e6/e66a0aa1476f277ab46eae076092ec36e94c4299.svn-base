/**
 * 用户关联
 *
 * Created by YBW on 2016-9-10
 */
define([
    'app',
    'safe/js/directives/safePicker',
    'cssloader!system/userrelatepolice/css/index.css'
], function(app) {
    app.controller('userrelatepoliceController', ['$scope', '$state', 'iAjax', 'iMessage', 'iTimeNow', function($scope, $state, iAjax, iMessage, iTimeNow) {
        $scope.user = {
            title: '关联—列表',
            selectAll: false,
            modDis: true,
            pages: {
                pageNo: 1,
                pageSize: 20
            },
            chooce: function(data) {
                if(data == undefined) {
                    $.each(this.list, function(i, o) {
                        o.selectList = $scope.user.selectAll;
                    });
                } else {
                    data.selectList = !data.selectList;
                }

                if(_.where(this.list, {selectList: true}).length == 1) {
                    this.modDis = false;
                } else {
                    this.modDis = true;
                }
            },

            /**
             * 修改用户关联
             */
            modRole: function() {
                var params = {
                    data: {
                        user: _.where(this.list, {selectList: false})[0]
                    }
                };
                $state.params = params;
                $state.go('system.userrelatepolice.add', params);
                this.title = '关联—修改';
            },
            list: [],
            policeList: [],
            relateWindow: false,
            userId: null,

            /**
             * 取消关联
             */
            cancelRelate: function(id) {
                iAjax.post('sys/web/syuser.do?action=upSyuserPolice', {
                    id: id,
                    police: []
                }).then(function() {
                    getList();
                    remind(1, '成功取消关联');
                }, function() {
                    remind(4, '网络连接失败！')
                });
            },

            /**
             * 弹出关联或修改用户窗口
             */
            stClWindow: function(index) {
                this.relateWindow = !this.relateWindow;
                if(this.relateWindow) {
                    this.userId = this.list[index].id;
                    var data = {
                        params: {
                            pageNo: 0,
                            pageSize: 1000000
                        }
                    };
                    iAjax.post('security/information/information.do?action=getpoliceall', data).then(function(data) {
                        if(data.result && data.result.rows) {
                            $scope.user.policeList = data.result.rows;
                            var obj = {};
                            $.each($scope.user.policeList, function(j, k) {
                                obj[k.id] = j;
                            });
                            $.each($scope.user.list, function(i, o) {
                                if(o.police[0] != undefined) {
                                    delete $scope.user.policeList[obj[o.police[0].id]];
                                }
                            });
                            var num = 0;
                            var length = $scope.user.policeList.length;
                            for(var i = 0; i < length; i++) {
                                if($scope.user.policeList[i - num] == undefined) {
                                    $scope.user.policeList.splice(i - num, 1);
                                    num++;
                                }
                            }
                        }
                    }, function() {
                        remind(4, '网络连接失败！')
                    });
                } else {
                    $scope.user.userId = null;
                    $scope.user.relatePolice = null;
                }
            },
            relatePolice: null,
            selectPolice: function(index) {
                this.relatePolice = index;
            },

            /**
             * 提交关联信息
             */
            submit: function() {
                iAjax.post('sys/web/syuser.do?action=upSyuserPolice', {
                    id: this.userId,
                    police: [this.policeList[this.relatePolice].id]
                }).then(function() {
                    $scope.user.userId = null;
                    $scope.user.relatePolice = null;
                    $scope.user.stClWindow();
                    getList();
                    remind(1, '关联成功');
                }, function() {
                    remind(4, '网络连接失败！');
                });
            },

            /**
             * 分页显示
            */
            showNextPage: function() {
                if($scope.user.pages.pageNo + 1 <= $scope.user.pages.totalPage) {
                    $scope.user.pages.pageNo++;
                    getList();
                }
            }
        };

        /**
         * 获取列表
         */
        function getList() {
            iAjax.post('/sys/web/syuser.do?action=getSyuserPolice').then(function(data) {
                if(data.result && data.result.rows) {
                    if($scope.user.pages.pageNo > 1) {
                        $scope.user.list = _.union($scope.user.list, data.result.rows);
                    } else {
                        $scope.user.list = data.result.rows;
                    }

                    if(data.result.params) {
                        $scope.user.pages.totalPage = data.result.params.totalPage;
                    }
                }
            }, function() {
                remind(4, '网络连接失败！');
            });
        }

        getList();


        /**
         * 弹出提醒框
         */
        function remind(level, content, title) {
            var message = {
                id: iTimeNow.getTime(),
                level: level,
                title: (title || '消息提醒'),
                content: content
            };
            iMessage.show(message, false);
        }
    }]);
});