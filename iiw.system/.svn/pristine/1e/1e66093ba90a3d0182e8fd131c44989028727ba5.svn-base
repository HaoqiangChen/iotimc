/**
 * 账号管理
 *
 * Created by YBW on 2016-09-23.
 */
define([
    'app',
    'cssloader!system/shoppingcount/css/index.css'
], function(app) {
    app.controller('shoppingcountController', [
        '$scope',
        '$state',
        'iAjax',
        'iMessage',
        'iTimeNow',
        'mainService',

        function($scope, $state, iAjax, iMessage, iTimeNow, mainService) {
        mainService.moduleName = '账号管理';
        $scope.shopping = {
            title: '账号管理—列表',
            modDis: true,
            delDis: true,
            addDis: false,
            window: false,
            filterValue: null,
            again: null,

            /**
             * 选择账号
             */
            chooce: function(data) {
                if(data) {
                    data.checked = !data.checked;
                } else {
                    var choice = this.checked;
                    $.each(this.list, function(i, o) {
                        o.checked = choice;
                    });
                }

                if(_.where(this.list, {checked: true}).length > 0) {
                    this.delDis = false;
                } else {
                    this.delDis = true;
                }

                if(_.where(this.list, {checked: true}).length == 1) {
                    this.modDis = false;
                } else {
                    this.modDis = true;
                }
            },
            list: [],
            checked: false,
            style: {},
            shadowStyle: {},
            move: false,
            offsetX: null,
            offsetY: null,
            clientX: null,
            clientY: null,
            X: null,
            Y: null,

            /**
             * 移动添加窗口
             */
            shift: function(clientX, clientY) {
                if(this.move) {
                    this.shadowStyle.left = this.X + (clientX - this.clientX);
                    this.shadowStyle.top = this.Y + (clientY - this.clientY);
                }
            },
            mouseClick: function(event) {
                this.move = !this.move;
                this.offsetX = event.offsetX;
                this.offsetY = event.offsetY;
                this.clientX = event.clientX;
                this.clientY = event.clientY;
                this.X = this.clientX - this.offsetX;
                this.Y = this.clientY - this.offsetY;
                if(this.move) {
                    this.shadowStyle = {
                        'left': '' + this.X + 'px',
                        'top': '' + this.Y + 'px'
                    };
                } else {
                    this.style = {
                        'position': 'fixed',
                        'left': '' + this.X + 'px',
                        'top': '' + this.Y + 'px',
                        'margin': '0'
                    };
                }
            },

            /**
             * 弹出删除账号框
             */
            delBtn: function() {
                $('.modal').modal();
            },

            /**
             * 修改账号
             */
            modBtn: function() {
                var obj = _.where(this.list, {checked: true})[0];
                this.submitList.xm = obj.xm;
                this.submitList.criminalfk = obj.criminalfk;
                if(obj.account) {
                    this.submitList.id = obj.id;
                    this.submitList.account = obj.account;
                    this.submitList.password = obj.password;
                    this.submitList.surplus = obj.surplus;
                } else {
                    this.submitList.account = null;
                    this.submitList.password = null;
                    this.submitList.surplus = null;
                }
                this.window = true;
                $.each(_.where(this.list, {checked: true}), function(i, o) {
                    o.checked = false;
                });
                this.chooce();
            },

            /**
             * 删除账号
             */
            delete: function() {
                var data = {
                    ids: []
                };
                $.each(this.list, function(i, o) {
                    if(o.checked) {
                        data.ids.push(o.id);
                    }
                });
                iAjax.post('security/criminalaccount.do?action=delCriminalaccount', data).then(function() {
                    $scope.shopping.checked = false;
                    $scope.shopping.chooce();
                    $scope.getList($scope.shopping.filterValue);
                    remind(1, '删除成功！');
                }, function() {
                    remind(4, '网络连接失败！');
                });
            },
            submitList: {},

            /**
             * 关闭添加框
             */
            closeWindow: function() {
                this.window = false;
                this.submitList = {};
                this.style = {};
            },
            affirmPass: {
                'width': '270px'
            },
            cancelColor: function() {
                this.affirmPass = {
                    'width': '270px'
                }
            },

            /**
             * 提交信息
             */
            submit: function() {
                if(this.again == this.submitList.password) {
                    iAjax.post('security/criminalaccount.do?action=updataCriminalaccount', this.submitList).then(function() {
                        remind(1, '修改成功');
                        $scope.shopping.submitList = {};
                        $scope.shopping.again = null;
                        $scope.shopping.closeWindow();
                        $scope.getList($scope.shopping.filterValue);
                    }, function() {
                        remind(4, '网络连接失败');
                    });
                } else {
                    this.affirmPass = {
                        'width': '270px',
                        'color': 'red'
                    };
                }
            },
            timeout: null,
            filter: function() {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function() {
                    $scope.getList($scope.shopping.filterValue);
                }, 300);
            },
            pageSize: 10,
            currentPage: 1,
            totalSize: 1,
            state: 'hide',
            toggle: function() {
                if(this.state == 'hide') {
                    this.state = 'show';
                } else {
                    this.state = 'hide';
                }
            }
        };

        /**
         * 获取账号列表
         */
        $scope.getList = function(filter) {
            var data = {
                params: {
                    pageNo: $scope.shopping.currentPage,
                    pageSize: $scope.shopping.pageSize
                }
            };
            if(filter) {
                data.filter = filter;
            }
            iAjax.post('security/criminalaccount.do?action=getCriminalaccount', data).then(function(data) {
                if(data.result && data.result.rows) {
                    $scope.shopping.list = data.result.rows;
                    $scope.shopping.totalSize = data.result.params.totalSize;
                    $scope.shopping.currentPage = data.result.params.pageNo;
                    $scope.shopping.pageSize = data.result.params.pageSize;
                }
            }, function() {
                remind(4, '网络连接失败！');
            })
        };
        $scope.getList();

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