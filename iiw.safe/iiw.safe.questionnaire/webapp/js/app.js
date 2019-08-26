/**
 * 问卷调查
 *
 * Created by zcl on 2019/7/25.
 */
define([
    'app',
    'cssloader!safe/questionnaire/css/index',
    'cssloader!safe/questionnaire/css/loading',
    //'safe/wjdc/js/directives/safeArchivesExportFileDirective'
], function (app) {
    app.controller('questionnaireController', ['$scope', '$state', 'iMessage', 'yjtService', 'iAjax', '$compile', '$timeout', function ($scope, $state, iMessage, yjtService, iAjax, $compile, $timeout) {

        $scope.statusList = [
            {name: '全部', value: ''},
            {name: '待调查', value: 'W'},
            {name: '待审核', value: 'O'},
            {name: '已审核', value: 'P'}
        ];

        $scope.classList = [
            {name: '全部', value: ''},
            {name: '罪犯', value: '罪犯'},
            {name: '社矫人员', value: '社矫人员'},
            {name: '看守所', value: '看守所'}
        ];

        $scope.typeList = [
            {name: '全部', value: ''},
            {name: '问卷', value: 'wjlx_ftwj'},
            {name: '量表', value: 'wjlx_lb'}
        ];

        $scope.searchFilter = {
            status: 'O',
            content: '',
            searchText: ''
        };

        $scope.params = {
            pageNo: 0,
            pageSize: 20
        };

        $scope.getRecordList = function () {
            if ($scope.searchFilter.starttime && $scope.searchFilter.endtime && $scope.searchFilter.starttime > $scope.searchFilter.endtime) {
                _remind(4, '时间输入有误，请重新选择！');
            }

            $scope.loading = {
                isLoading: true,
                content: '访谈记录列表加载中'
            };

            var url = 'http://iotimc8888.goho.co:17783/security/wjdc/scale.do?action=getTalkRecord';
            var params = {
                filter: $scope.searchFilter,
                params: $scope.params,
            };

            getToken(function (token) {
                iAjax
                    .post(`${url}&authorization=${token}`, params)
                    .then(function (data) {
                        // console.log(data);
                        if (data.result && data.result.rows) {
                            $scope.recordList = data.result.rows;
                            $scope.loading.isLoading = false;
                            $scope.selectAll = false;
                        } else {
                            $scope.recordList = [];
                        }
                        if (data.result.params) {
                            $scope.params = data.result.params;
                        }
                    })
            })


        };

        $scope.check = function (item) {
            // console.log(item);
            if (item) {
                $state.params = {
                    data: item
                };
                if (item.nairetype === 'wjlx_lb') $state.go('safe.scalecheck', $state.params);
                else $state.go('safe.questionnairecheck', $state.params);
            } else {
                $state.params = {
                    data: null
                };
                _remind(4, '错误操作!');
            }
        };

        $scope.resetFilter = function () {
            $scope.searchFilter = {
                status: '',
                content: '',
                searchText: ''
            };
            $scope.getRecordList();
        };
        $scope.keypress = function (e) {
            if (e.keyCode == 13) {
                $scope.getRecordList();
            }
        };

        $scope.$on('questionnaireControllerOnEvent', function () {
            $scope.getRecordList();
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

        function formatNumber(num) {
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
    }]);
});
