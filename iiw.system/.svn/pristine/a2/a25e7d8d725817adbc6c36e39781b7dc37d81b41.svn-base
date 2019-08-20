/**
 * 通讯黑名单—列表
 *
 * Created by YBW on 2016-8-20
 */
define([
    'app',
    'safe/js/directives/safePicker',
    'cssloader!system/phoneblacklist/css/index.css'
], function(app) {
    app.controller('phoneblacklistController', ['$scope', '$state', 'iAjax', 'iMessage', 'mainService', 'iConfirm', function($scope, $state, iAjax, iMessage, mainService, iConfirm) {

        mainService.moduleName = '通讯黑名单';
        $scope.poneblacklist = [];
        $scope.blacklist = {

            /**
             * 选择黑名单
             */
            chooce: function(data) {

                if(_.where($scope.poneblacklist, {add: true}).length < 1) {

                    if(!data.rows.mod) {
                        data.rows.bSelectAll = !data.rows.bSelectAll;
                        btnOperate();
                    } else {
                        data.rows.bSelectAll = true;
                    }

                } else {

                    if(data.rows.add) {
                        data.rows.bSelectAll = true;
                    } else {
                        data.rows.bSelectAll = false;
                    }

                }
            },
            inputChooce: false,

            /**
             * 选择列表全部黑名单
             */
            allChooce: function() {

                if(_.where($scope.poneblacklist, {add: true}).length == 0) {
                    $.each($scope.poneblacklist, function(i, o) {
                        if(!o.mod) {
                            o.bSelectAll = $scope.blacklist.inputChooce
                        }
                    });
                    btnOperate();
                } else {
                    this.inputChooce = false;
                }
            },
            modDis: true,
            delDis: true,
            addDis: false,

            /**
             * 添加黑名单
             */
            addRole: function() {
                $.each(_.where($scope.poneblacklist, {add: false}), function(i, o) {
                    o.bSelectAll = false;
                });
                $scope.poneblacklist.unshift({
                    callnumber: '',
                    belongarea: '???',
                    cretime: new Date().toLocaleString(),
                    duetime: '',
                    _duetime: '',
                    bSelectAll: true,
                    mod: false,
                    add: true
                });

                this.modBtn = false;
                this.modDis = true;
                this.delDis = true;
            },

            /**
             * 修改黑名单（界面修改按钮单击事件）
             */
            modRole: function() {

                $.each($scope.poneblacklist, function(i, o) {
                    if(o.bSelectAll == true) {
                        $scope.blacklist.delDis = true;
                        o.mod = true;
                        $scope.blacklist.modBtn = false;
                        setTimeout(function() {
                            $('.inputAddress').eq(0).select();
                        }, 10);
                    }
                });

                this.addDis = true;
            },

            /**
             * 显示解除黑名单确认窗口
             */
            remRole: function() {
                var aSelect = _.where($scope.poneblacklist, {bSelectAll: true}),
                    aName = [];
                aName = aSelect.map(function(item, i) {
                    return (i + 1 + '、' + item.callnumber)
                });
                iConfirm.show({
                    scope: $scope,
                    title: '确认删除？',
                    content: '共选择' + aSelect.length + '条数据，分别为：<br>' + aName.join('<br>'),
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'blacklist.delete'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'blacklist.confirmClose'
                    }]
                });
            },

            /**
             * 解除黑名单
             */
            delete: function(id) {
                iConfirm.close(id);
                var data = {
                    filter: {
                        ids: []
                    }
                };

                $.each(_.where($scope.poneblacklist, {bSelectAll: true}), function(i, o) {
                    data.filter.ids.push(o.id);
                });

                iAjax.post('security/blacklistphone.do?action=delBlacklistphone', data).then(function() {
                    $scope.getBlacklist();
                    remind(1, '成功解除黑名单！', '解除提醒');
                    $scope.blacklist.modDis = true;
                    $scope.blacklist.delDis = true;
                    $scope.blacklist.inputChooce = false;
                });
            },

            confirmClose: function(id) {
                iConfirm.close(id);
            },

            modBtn: true,

            /**
             * 取消添加黑名单
             */
            cancel: function() {

                if(this.modDis) {
                    $scope.poneblacklist.splice(0, _.where($scope.poneblacklist, {add: true}).length);
                    $scope.blacklist.modBtn = !$scope.blacklist.modBtn;
                } else {
                    mod('cancel');
                }
            },

            /**
             * 添加黑名单
             */
            save: function() {
                if(this.modDis) {
                    var data = {
                        blackphone: []
                    };

                    $.each(_.where($scope.poneblacklist, {add: true}), function(i, o) {

                        var time = new Date(o._duetime.replace(/-/g, '/')).getTime();
                        var nowTime = new Date().getTime();

                        if(o._duetime && o.callnumber && time > nowTime) {
                            data.blackphone.push({
                                callnumber: o.callnumber,
                                time: time
                            })
                        } else {
                            data = false;
                            if(time <= nowTime) {
                                remind(3, '到期时间必须大于当前时间！', '信息填写错误');
                            }
                            return false;
                        }
                    });
                    if(data) {

                        iAjax.post('security/blacklistphone.do?action=addBlacklistphone', data).then(function() {
                            remind(1, '提交成功！');
                            $scope.blacklist.modBtn = !$scope.blacklist.modBtn;
                            $scope.getBlacklist();
                        }, function() {
                            remind(4, '网络连接失败！');
                        });
                    }
                } else {
                    mod('save');
                }
            }
        };


        /**
         * 获取黑名单列表
         */
        $scope.getBlacklist = function() {
            iAjax.post('security/blacklistphone.do?action=getBlacklistphone').then(function(data) {
                if(data.result && data.result.rows) {
                    $scope.poneblacklist = data.result.rows;
                    $.each($scope.poneblacklist, function(i, o) {
                        o._duetime = '';
                        o.bSelectAll = false;
                        o.mod = false;
                        o.add = false;
                    });
                }
            });
        };

        $scope.getBlacklist();


        /**
         * 修改黑名单
         */
        function mod(type) {

            var modObj = _.where($scope.poneblacklist, {mod: true});
            var data = {
                filter: {
                    rows: []
                }
            };
            var temporaty = null;
            for(var i = 0; i < modObj.length; i++) {
                temporaty = modObj[i];
                if(type == 'save') {
                    if(temporaty._duetime.length < 1) {
                        return false;
                    }
                    var dataObj = {
                        id: temporaty.id,
                        time: new Date(temporaty._duetime.replace(/-/g, '/')).getTime()
                    };

                    data.filter.rows.push(dataObj);
                }

                temporaty.mod = false;
                temporaty.bSelectAll = false;
                $scope.blacklist.modDis = true;
                $scope.blacklist.delDis = true;
                $scope.blacklist.addDis = false;
            }

            if(type == 'save') {
                iAjax.post('security/blacklistphone.do?action=updateBlacklistphone', data).then(function() {
                    $scope.getBlacklist();
                    remind(1, '保存成功！', '修改提醒');
                });
            }
            $scope.blacklist.modBtn = !$scope.blacklist.modBtn;
        }


        /**
         * 按钮控制
         */
        function btnOperate() {
            var modNum = _.where($scope.poneblacklist, {mod: true});
            var chooceNum = _.where($scope.poneblacklist, {bSelectAll: true});
            if(chooceNum.length > 0) {
                $scope.blacklist.modDis = false;
                if(modNum.length < 1) {
                    $scope.blacklist.delDis = false;
                }
            } else {
                $scope.blacklist.modDis = true;
                $scope.blacklist.delDis = true;
            }
        }


        /**
         * 信息提醒
         */
        function remind(level, content, title) {
            var message = {
                level: level,
                content: content,
                title: title || '消息提醒'
            };

            iMessage.show(message, false);
        }
    }]);
});