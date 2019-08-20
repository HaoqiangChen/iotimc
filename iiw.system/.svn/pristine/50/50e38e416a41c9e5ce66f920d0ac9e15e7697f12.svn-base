/**
 * 访谈APP用户审核
 * Created by chq on 2019-07-10.
 */
define([
    'app',
    'cssloader!system/ftappuseraudit/css/index.css'
], function(app) {
    app.controller('ftappUserAuditController', ['$scope', '$state', 'iAjax','iMessage', 'iConfirm', 'mainService', '$filter', function($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '用户审核';
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.searchTitle = '';
        $scope.selectAll = false;

        // 模块加载完成后初始化事件
        $scope.$on('ftappUserAuditControllerOnEvent', function() {
            init();
        });

        function init(){
            getUserList();
        }

        // 查询所有用户
        function getUserList(filterValue){
            var url,data;
            url = '/terminal/interview/user.do?action=getAllSyuser';
            data = {
                filter: {
                    name: filterValue
                },
                params : {
                    pageNo : $scope.currentPage,
                    pageSize : $scope.pageSize
                }
            };

            iAjax
                .post(url, data)
                .then(function(data){
                        // console.log(data);
                        if(data.result && data.result.rows){
                            $scope.userList = data.result.rows;
                        }else{
                            $scope.userList=[];
                        }
                        if(data.result.params){
                            var params = data.result.params;
                            $scope.totalSize = params.totalSize;
                            $scope.pageSize = params.pageSize;
                            $scope.totalPage = params.totalPage;
                            $scope.currentPage = params.pageNo;
                        }
                    },
                    function(data){})
        }

        $scope.getList = function() {
            $scope.searchText = this.searchTitle;
            getUserList($scope.searchText);
        };

        $scope.pageChanged = function(){
            $scope.currentPage = this.currentPage;
            getUserList();
        };

        $scope.audit = function(){
            var aSelect = _getAvailableSelect(),
                aName = [];

            if(aSelect.length > 0) {

                aName = aSelect.map(function(select, i) {
                    return ( i+1 + '、'+select.name);
                });

                iConfirm.show({
                    scope: $scope,
                    title: '确认审核通过？',
                    content: '共选择'+aSelect.length+'条数据，分别为：<br>'+aName.join('<br>'),
                    buttons: [{
                        text: '确认',
                        style: 'button-primary',
                        action: 'confirmAuditUser'
                    }, {
                        text: '取消',
                        style: 'button-caution',
                        action: 'confirmClose'
                    }]
                });

            }else {
                var message = {};
                message.level = 3;
                message.title = $scope.title;
                message.content = "请选择一条或以上审核状态不为【通过】的数据进行审核！";
                iMessage.show(message, false);
            }
        };

        $scope.confirmAuditUser = function(id){
            iConfirm.close(id);

            var aSelect = _getAvailableSelect();

            var data = {filter: {id: []}};
            $.each(aSelect, function(i, o){
                data.filter.id.push(o.id);
            });
            iAjax.post('/terminal/interview/user.do?action=approvedLogin', data).then(function(){
                _remind(1, '用户审核成功');
                getUserList();
            }, function(){
                _remind(4, '网路连接失败');
            })
        }

        $scope.confirmClose = function(id){
            iConfirm.close(id);
        }

        $scope.keypresslist = function(event, searchTitle) {
            if(event.keyCode == 13) {
                $scope.searchTitle = searchTitle;
                $scope.getList();
            }
        };

        $scope.selAll = function() {
            $scope.selectAll = !$scope.selectAll;
            $.each($scope.userList,function(i,o){
                o.checked = $scope.selectAll;
            });
        };

        function _getAvailableSelect() {
            return _.filter($scope.userList, function(item) {
                return item.checked && item.isagree != '通过';
            });
        }

        function _remind(level, content, title){
            var message = {
                id: new Date(),
                level: level,
                title: (title || '消息提醒'),
                content: content
            };

            iMessage.show(message, false);
        }
    }]);
});
