/**
 * Created by wuk on 2019-07-08
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/vpconfig/css/index.css',
    'system/expert/js/directives/exportExcel',
    'system/js/directives/systemRowCheckDirective',

], function(app) {
    app.controller('vpconfigController', [
        '$scope',
        '$state',
        'iAjax',
        'iTimeNow',
        'mainService',
        'iMessage',
        'iGetLang',
        'iConfirm',
        'iToken',
        function($scope, $state, iAjax, iTimeNow, mainService, iMessage,iGetLang, iConfirm, iToken) {

            mainService.moduleName = 'IMCS视频权限配置';
            $scope.selectAll = false;
            $scope.modBtnFlag = true;
            $scope.delBtnFlag = true;
            $scope.filterValue = '';
            $scope.expert = {
                filterValue: '',
                totalSize: 0,
                currentPage: 1,
                totalPage: 1,
                pageSize: 10
            };

            /*
             * 模块加载完成后初始化
             */
            $scope.$on('vpconfigControllerOnEvent', function() {
                $scope.getList();
            });
            /*
             * 右上角 过滤器获取 键盘Enter点击
             */
            $scope.keyPressGetLIst = function(event) {
                if(event && event.keyCode == 13) {
                    $scope.getList();
                }
            }
            /*
             * 消息弹框
             */
            function send(level, content) {
                var message = {
                    id: iTimeNow.getTime(),
                    level: level,
                    title: '消息提醒！',
                    content: content
                };
                iMessage.show(message, false);
            }
            /*
             * 初始护化表格
             */
            $scope.getList = function() {
                var data = {
                    filter: {
                        searchText: $scope.expert.filterValue
                    },
                    params: {
                        pageNo: $scope.expert.currentPage,
                        pageSize: $scope.expert.pageSize
                    }
                };
                iAjax.post('security/devicemonitor.do?action=getMonitorThemeList', data).then(function(data) {
                    if(data.result && data.result.rows) {
                        $scope.expertList = data.result.rows;
                        $scope.expert.currentPage = data.result.params.pageNo;
                        $scope.expert.totalPage = data.result.params.totalPage;
                        $scope.expert.totalSize = data.result.params.totalSize;
                        $scope.expert.pageSize = data.result.params.pageSize;
                    } else {
                        $scope.expertList = [];
                    }
                }, function() {
                    send(4, '网络连接失败！')
                });
            };
            //  分页按钮
            $scope.pageChange = function() {
                $scope.currentPage = this.currentPage;
                $scope.getList();
            };
            /*
            * 添加按钮
            */
            $scope.add = function() {
                $scope.entityItem = {};
                var params = {
                    data: $scope.entityItem
                }
                $state.params = params;
                $state.go('system.vpconfig.add', params);
            };
            /*
             * 修改按钮
             */
            $scope.mod = function() {
                var params = {
                    data: _.find($scope.expertList, {checked: true}),
                }
                $state.params = params;
                $state.go("system.vpconfig.add", params);
            };
            /*
            * 修改与删除,详情控件判断是否可操作
            */
            $scope.chooseRow = function() {
                $scope.checkBtnFlag();
            };
            $scope.checkBtnFlag = function($index){
                var nodes = _.where($scope.expertList, {checked: true});
                if (nodes.length == 1) {
                    $scope.modBtnFlag = false;
                    $scope.queBtnFlag = false;
                } else {
                    $scope.modBtnFlag = true;
                    $scope.queBtnFlag = true;
                }
                if(nodes.length > 0) {
                    $scope.delBtnFlag = false;
                } else {
                    $scope.delBtnFlag = true;
                }
            };
            /*
             * 删除按钮
             */
            $scope.delete = function() {
                iConfirm.show({
                    scope: $scope,
                    title: '删除',
                    content: '确定要删除选中的内容?',
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmDelete'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });
            };
            /*
             * 取消删除
             */
            $scope.confirmClose = function(id) {
                iConfirm.close(id);
                return true;
            };
            /*
             * 确定删除
             */
            $scope.confirmDelete = function(id) {
                iConfirm.close(id);
                var nodes = _.where($scope.expertList, {checked: true});
                if(nodes.length > 0) {
                    var ids = [];
                    $.each(nodes, function(i, o) {
                        ids.push(o.id);
                    });
                    var data = {
                        filter: {
                            type: 'del',
                            ids: ids,
                        },
                    };
                    iAjax.post('/security/devicemonitor.do?action=dealMonitorTheme', data).then(function(data) {
                        if(data.status == '1') {
                            send(1, '删除成功！');
                            $scope.getList();
                        }
                    }, function() {
                        send(4, '网络连接失败！')
                    });
                }
            };

            $scope.selAll = function() {
                $scope.selectAll = !$scope.selectAll;
                $.each($scope.expertList, function(i, o) {
                    o.checked = $scope.selectAll;
                });
                $scope.chooseRow();
            };
        }]);
});