/**
 * 运维故障等级管理
 *
 * Created by YBW on 2017/4/17.
 */
define([
    'app',
    'cssloader!system/repairflow/css/index'
], function(app) {
    app.controller('repairFlowController', [
        '$scope',
        'mainService',
        'iAjax',
        'iMessage',
        function($scope, mainService, iAjax, iMessage) {

            mainService.moduleName = '维修流程管理';
            $scope.repair = {
                title: '维修流程管理-设置',
                menu: [{name: '登记', id: '1'}, {name: '派遣', id: '2'}, {name: '审核', id: '3'}, {
                    name: '处理',
                    id: '4'
                }, {name: '结办', id: '5'}],
                select: '1',
                data: {
                    value1: true,
                    value2: true,
                    value3: true,
                    value4: true,
                    value5: true,
                    value6: true,
                    value7: true,
                    value8: true,
                    value9: true,
                    value10: true,
                    value11: true,
                    value12: true,
                    value13: true,
                    value14: true,
                    value15: true,
                    value16: true
                },
                itemID: null,
                changeValue: function(obj, value) {
                    this.data[obj] = value;
                },
                changeValueOdd: function(obj) {
                    this.data[obj] = !this.data[obj];
                },
                submit: function() {
                    var data = {
                        rows: [
                            {
                                id: $scope.repair.itemID,
                                type: 'repairflow',
                                name: '维修流程',
                                content: angular.toJson($scope.repair.data)
                            }
                        ],
                        typename: 'processingflow'
                    };
                    iAjax
                        .post('oms/devicemaintain.do?action=updatedevicelevel', data)
                        .then(function(data) {
                            if(data && data.status == 1) {
                                showMessage(1, '操作成功!');
                                $scope.repair.getList();
                            }
                        })
                },
                getList: function() {
                    var data = {
                        typename: 'processingflow'
                    };
                    iAjax
                        .post('oms/devicemaintain.do?action=getdevicelevel', data)
                        .then(function(data) {
                            if(data.result && data.result.rows) {
                                $scope.repair.data = angular.fromJson(data.result.rows[0].content);
                                $scope.repair.itemID = data.result.rows[0].id;
                            }
                        })
                }
            };

            function showMessage(level, content) {
                var json = {
                    title: $scope.repair.title,
                    level: level,
                    content: content
                };
                iMessage.show(json);
            }

            $scope.$on('repairFlowControllerOnEvent', function() {
                $scope.repair.getList();
            })
        }
    ]);
});
