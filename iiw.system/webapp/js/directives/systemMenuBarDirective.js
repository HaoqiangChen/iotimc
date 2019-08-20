/**
 * 模块操作按钮指令
 * Created by zcl on 2016/3/26.
 */
define(['app'], function(app) {
    app.directive('systemMenuBar', [function() {
        function createMenuBar() {
            var menuHtml = [];
            menuHtml.push('<button class="btn btn-s-md btn-primary" ng-click="add()"><i class="fa fa-plus"></i>添加</button>');
            menuHtml.push('<button class="btn btn-s-md btn-success" ng-click="mod()" ng-disabled="modBtnFlag"><i class="fa fa-edit"></i>修改</button>');
            menuHtml.push('<button class="btn btn-s-md btn-danger" ng-click="delete()" ng-disabled="delBtnFlag"><i class="fa fa-minus"></i>删除</button>');
            return menuHtml.join('').toString();
        }

        return {
            restrict: 'E',
            template: createMenuBar()
        }
    }]);
});