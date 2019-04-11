/**
 * 访谈APP问卷管理
 * Created by chq on 2019-10-15.
 */
define([
    'app',
    'cssloader!system/ftappwjmanage/css/loading',
    'cssloader!system/ftappwjmanage/css/index.css'
], function (app) {
    app.controller('ftappWjmanageController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '问卷列表';
        $scope.keyword = '请输入问卷名进行搜索...';

        $scope.wjTypes = [
            {name: '访谈问卷', type: 'wjlx_ftwj', typeName: '访谈问卷', icon: 'fa-newspaper-o', info1: '重新犯罪问题调查', info2: '丰富题型，强大逻辑'},
            {name: '量表测试', type: 'wjlx_lb', typeName: '量表测试', icon: 'fa-list-ol', info1: '支持多级测评维度', info2: '呈现测评报告'}
        ];

        $scope.getList = function () {
            $scope.wjList = [
                {name: '初犯', wjId: 'D64B236EA44046528699011C0258E9DE', type: 'wjlx_ftwj', typeName: '访谈问卷', runStatus: 1, runStatusName: '已发布', answerNum: 1, createTime: '2019年5月21日 14:16'},
                {name: '刑罚执行完毕后未重新犯罪者', wjId: '354DD9C8DD08460A83BDA9A06D874B86', type: 'wjlx_ftwj', typeName: '访谈问卷', runStatus: 1, runStatusName: '已发布', answerNum: 1, createTime: '2019年5月21日 14:16'},
                {name: '重犯', wjId: 'B701AB0474BE475B8CF22E6152B9FC01', type: 'wjlx_ftwj', typeName: '访谈问卷', runStatus: 1, runStatusName: '已发布', answerNum: 1, createTime: '2019年5月21日 14:16'},
                {name: '共情量表测试', wjId: '0CFF778DCDD94C85BC67141E388E403E', type: 'wjlx_lb', typeName: '量表测试', runStatus: 0, runStatusName: '未发布', answerNum: 0, createTime: '2019年5月21日 14:16'}
            ];
        };

        $scope.add = function (type) {
            switch (type) {
                case 'wjlx_ftwj':
                    $state.go('system.ftappquestionnaire');
                break;
                case 'wjlx_lb':
                    $state.go('system.ftappscale');
                break;
            }
        };

        $scope.edit = function (data) {};
        $scope.question = function (item) {
            if (item) {
                $state.params = {
                    data: item
                };
                switch (item.type) {
                    case 'wjlx_ftwj':
                        $state.go('system.ftappquestionnaire', $state.params);
                        break;
                    case 'wjlx_lb':
                        $state.go('system.ftappscale', $state.params);
                        break;
                }
            } else {
                $state.params = {
                    data: null
                };
                _remind(4, '错误操作!');
            }

        };
        $scope.directory = function (data) {
            $state.go('system.ftappdirectory');
        };

        // 模块加载完成后初始化事件
        $scope.$on('ftappWjmanageControllerOnEvent', function () {
            $scope.getList();
        });

        function getToken(callback) {
            iAjax.post('http://iotimc8888.goho.co:17783/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            }, function (err) {
                _remind(4, '请求失败，请查看网络状态!');
                $scope.loading.content = '请求失败，请查看网络状态';
            });
        }

        function _remind(level, content, title) {
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
