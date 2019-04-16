/**
 * 访谈APP问卷管理
 * Created by chq on 2019-10-15.
 */
define([
    'app',
    'cssloader!system/ftappwjmanage/css/loading',
    'cssloader!system/ftappwjmanage/css/index.css',
    'system/ftappwjmanage/js/directives/kindEditor'
], function (app) {
    app.controller('ftappWjmanageController', ['$scope', '$state', 'iAjax', 'iMessage', 'iConfirm', 'mainService', '$filter', function ($scope, $state, iAjax, iMessage, iConfirm, mainService, $filter) {
        mainService.moduleName = '访谈APP管理';
        $scope.title = '问卷列表';
        $scope.keyword = '请输入问卷名进行搜索...';
        var domain = 'http://iotimc8888.goho.co:17783';

        $scope.wjTypes = [
            {name: '访谈问卷', type: 'wjlx_ftwj', typeName: '访谈问卷', icon: 'fa-newspaper-o', info1: '重新犯罪问题调查', info2: '丰富题型，强大逻辑'},
            {name: '量表测试', type: 'wjlx_lb', typeName: '量表测试', icon: 'fa-list-ol', info1: '支持多级测评维度', info2: '呈现测评报告'}
        ];

        $scope.filter = {
            content: '',
            name: '',
            starttime: '',
            endtime: ''
        };
        $scope.params = {
            pageNo: 0,
            pageSize: 10
        };

        $scope.wjList = [
            {name: '初犯', id: 'D64B236EA44046528699011C0258E9DE', content: 'wjlx_ftwj', typename: '访谈问卷', runStatus: 1, runStatusName: '已发布', answersituation: '测试', cretime: 1566459855000},
            {name: '刑罚执行完毕后未重新犯罪者', id: '354DD9C8DD08460A83BDA9A06D874B86', content: 'wjlx_ftwj', typename: '访谈问卷', runStatus: 1, runStatusName: '已发布', answersituation: '测试', cretime: 1566459855000},
            {name: '重犯', id: 'B701AB0474BE475B8CF22E6152B9FC01', content: 'wjlx_ftwj', typename: '访谈问卷', runStatus: 1, runStatusName: '已发布', answersituation: '测试', cretime: 1566459855000},
            {name: '共情量表测试', id: '0CFF778DCDD94C85BC67141E388E403E', content: 'wjlx_lb', typename: '量表测试', runStatus: 0, runStatusName: '未发布', answersituation: '测试', cretime: 1566459855000}
        ];
        $scope.getList = function () {

            for (let v in $scope.filter) {
                if ($scope.filter[v] === '') delete $scope.filter[v]
            }
            $scope.loading = {
                isLoading: true,
                content: '问卷列表加载中'
            };
            var url, data;
            url = domain + '/terminal/interview/system.do?action=getNaireList';
            data = {
                filter: $scope.filter,
                params: $scope.params
            };

            getToken(function (token) {
                iAjax
                    .post(`${url}&authorization=${token}`, data)
                    // .post(url, data)
                    .then(function (data) {
                        console.log(data);
                        if (data.result && data.result.rows) {
                            $scope.wjList = data.result.rows;
                            $scope.loading.isLoading = false;
                        } else {
                            $scope.wjList = [];
                        }
                        if (data.result.params) {
                            $scope.params = data.result.params;
                        }
                    },function (err) {
                        _remind(4, err.message, '请求失败，请查看网络状态!');
                        $scope.loading.content = '请求失败，请查看网络状态';
                    })
            })
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

        $scope.edit = function (action, data) {
            $scope.hasEdit = true;
            $scope.wjDetails = {
                code: '',
                name: '',
                subtitle: '',
                describes: '',
                typefk: '',
                status: 'N',
                answersituation: '',
                iscommon: '0',
                question: '',
                ismust: '1',
                istotal: 'N',
            };
            $scope.wjDetails.action = action;
            switch (action) {
                case 'add':
                    $('#newwjModal').modal('hide');
                    if (data === 'wjlx_ftwj') $scope.wjDetails.typefk = '430DE5F396E94FA8B3CF56B5437D0DD9';
                    else $scope.wjDetails.typefk = '1F0EE9C8AB7145C184B23283C5BE5B17';
                    $scope.wjDetails.content = data;
                break;
                case 'mod':
                    $scope.wjDetails = data;
                break;
                case 'copy':
                    // delete data.id;
                    $scope.wjDetails = data;
                    break;
            }
        };
        $scope.question = function (item) {
            if (item) {
                $state.params = {
                    data: item
                };
                switch (item.content) {
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
        $scope.cancelEdit = function () {
            $scope.hasEdit = false;

        };
        $scope.saveWj = function () {
            $('#wjconfigModal').modal('hide');
            $scope.loading = {
                isLoading: true,
                content: '提交中'
            };

            var url = domain + '/terminal/interview/system.do?action=saveAndUpdateNaire';

            getToken(function (token) {
                iAjax
                    .post(`${url}&authorization=${token}`, $scope.wjDetails)
                    // .post(url, data)
                    .then(function (data) {
                        console.log(data);
                        if (data.status === 1) {
                            _remind(1, data.message, '新增问卷成功!');
                            $scope.getList();
                            $scope.loading.isLoading = false;
                        }
                    }, function (err) {
                        if (!$scope.wjDetails.id) _remind(3, err.message, '新增调查问卷失败!');
                        else _remind(3, err.message, '修改调查问卷失败!');
                        $scope.loading.isLoading = false;
                    })
            })
        };

        $scope.$on('ftappWjmanageControllerOnEvent', function () {
            // $scope.getList();
        });

        function getToken(callback) {
            iAjax.post(domain + '/terminal/interview/system.do?action=login&username=1321365765@qq.com&password=XASR5G2454CW343C705E7141C9F793E', {}).then(function (data) {
                callback(data.token);
            }, function (err) {
                _remind(4, err.message, '请求失败，请查看网络状态!');
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
