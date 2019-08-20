/**
 * 商品管理—列表
 *
 * Created by YBW on 2016-09-23.
 */
define([
    'app',
    'cssloader!system/commoditymanage/css/index.css'
], function(app) {
    app.controller('commoditymanageController', [
        '$scope',
        '$state',
        'iAjax',
        'iMessage',
        'iTimeNow',
        'mainService',
        function($scope, $state, iAjax, iMessage, iTimeNow, mainService) {

        mainService.moduleName = '商品管理';
        $scope.commodity = {
            title: '商品管理—列表',
            type: 'ALL',
            modDis: true,
            delDis: true,
            addDis: false,
            window: false,
            filterValue: '',

            /**
             * 选择商品
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
                    this.modDis = false;
                } else {
                    this.delDis = true;
                    this.modDis = true;
                }
            },
            list: [],
            checked: false,
            state: '',

            /**
             *  添加商品
             */
            addBtn: function() {
                this.window = true;
                this.state = 'add';
                this.submitList.unshift({
                    name: null,
                    typename: null,
                    unit: null,
                    price: null,
                    limitnum: null,
                    storenum: null
                });
            },

            /**
             * 弹出删除商品窗口
             */
            delBtn: function() {
                $('.modal').modal();
            },

            /**
             * 修改商品
             */
            modBtn: function() {
                this.submitList = _.where(this.list, {checked: true});
                this.window = true;
                this.state = 'mod';
                $.each(_.where(this.list, {checked: true}), function(i, o) {
                    o.checked = false;
                });
                this.chooce();
            },

            /**
             * 确认删除商品框
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
                iAjax.post('security/product.do?action=delProduct', data).then(function() {
                    $scope.commodity.checked = false;
                    $scope.commodity.chooce();
                    $scope.getList($scope.commodity.type, $scope.commodity.filterValue);
                    remind(1, '删除成功！');
                }, function() {
                    remind(4, '网络连接失败！');
                });
            },
            commodityType: [],
            submitList: [],

            /**
             * 增加添加商品数量
             */
            addCommodity: function() {
                this.submitList.push({
                    name: null,
                    typeid: null,
                    unit: null,
                    price: null,
                    limitnum: null,
                    storenum: null
                })
            },

            /**
             * 选择类型并获得相应类型的商品列表
             */
            setList: function() {
                $scope.getList(this.type);
            },

            /**
             * 关闭添加商品弹出框
             */
            closeWindow: function() {
                this.window = false;
                this.submitList = [];
                this.unit = null;
                this.limit = null;
                this.inventory = null;
            },

            /**
             * 提交商品信息
             */
            submit: function() {
                iAjax.post('security/product.do?action=updataProduct', this.submitList).then(function() {
                    remind(1, ($scope.commodity.state == 'add' && '添加成功' || '修改成功'));
                    $scope.commodity.closeWindow();
                    $scope.getList($scope.commodity.type, $scope.commodity.filterValue);
                }, function() {
                    remind(4, '网络连接失败');
                });
            },
            timeout: null,
            filter: function() {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(function() {
                    $scope.getList($scope.commodity.type, $scope.commodity.filterValue);
                }, 300);
            },
            closeCommodity: function(index) {
                this.submitList.splice(index, 1);
            },
            limit: null,
            inventory: null,
            unit: null,
            modAll: function(who) {
                $.each(this.submitList, function(i, o) {
                    if(who == 'unit' && $scope.commodity.unit && $scope.commodity.unit.length) {
                        o.unit = $scope.commodity.unit;
                    } else if(who == 'limit' && $scope.commodity.limit) {
                        o.limitnum = $scope.commodity.limit;
                    } else if(who == 'inventory' && $scope.commodity.inventory) {
                        o.storenum = $scope.commodity.inventory;
                    } else {
                        remind(3, '不能为空');
                    }
                });
            },
            pageSize: 10,
            currentPage: 1,
            totalSize: 1
        };

        /**
         * 获取商品列表
         */
        $scope.getList = function(id, filter) {
            var data = {
                params: {
                    pageNo: $scope.commodity.currentPage,
                    pageSize: $scope.commodity.pageSize
                }
            };

            if(id && id != 'ALL') {
                data.category = id;
            }

            if(filter) {
                data.filter = filter;
            }
            iAjax.post('security/product.do?action=getProduct', data).then(function(data) {
                if(data.result && data.result.rows) {
                    $scope.commodity.list = data.result.rows;
                    console.log(data.result.rows);
                    $scope.commodity.totalSize = data.result.params.totalSize;
                    $scope.commodity.currentPage = data.result.params.pageNo;
                    $scope.commodity.pageSize = data.result.params.pageSize;
                }
            }, function() {
                remind(4, '网络连接失败！');
            })
        };
        $scope.getList();


        /**
         * 获取商品类型
         */
        iAjax.post('security/product.do?action=getProductType', {}).then(function(data) {
            if(data.result && data.result.rows) {
                $scope.commodity.commodityType = data.result.rows;
                $scope.commodity.submitType = data.result.rows.concat([]);
                $scope.commodity.commodityType.unshift({
                    id: 'ALL',
                    name: '全部'
                });
            }
        }, function() {
            remind(4, '网络连接失败！');
        });

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