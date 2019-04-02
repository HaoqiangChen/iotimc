/**
 * 问卷调查
 *
 * Created by chq on 2019/7/25.
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

        $scope.provinces = [
            {name: '司法部', code: '00'}, {name: '北京市', code: 11}, {name: '天津市', code: 12}, {name: '河北省', code: 13}, {
                name: '山西省',
                code: 14
            }, {name: '内蒙古自治区', code: 15}, {name: '辽宁省', code: 21},
            {name: '吉林省', code: 22}, {name: '黑龙江省', code: 23}, {name: '上海市', code: 31}, {
                name: '江苏省',
                code: 32
            }, {name: '浙江省', code: 33}, {name: '安徽省', code: 34},
            {name: '福建省', code: 35}, {name: '江西省', code: 36}, {name: '山东省', code: 37}, {
                name: '河南省',
                code: 41
            }, {name: '湖北省', code: 42}, {name: '湖南省', code: 43},
            {name: '广东省', code: 44}, {name: '广西壮族自治区', code: 45}, {name: '海南省', code: 46}, {
                name: '重庆市',
                code: 50
            }, {name: '四川省', code: 51}, {name: '贵州省', code: 52},
            {name: '云南省', code: 53}, {name: '西藏自治区', code: 54}, {name: '陕西省', code: 61}, {
                name: '甘肃省',
                code: 62
            }, {name: '青海省', code: 63}, {name: '宁夏回族自治区', code: 64},
            {name: '新疆维吾尔自治区', code: 65}
        ];

        $scope.searchFilter = {
            status: 'O',
            interviewername: '',
            criminalname: '',
            province: '',
            starttime: '',
            endtime: '',
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
