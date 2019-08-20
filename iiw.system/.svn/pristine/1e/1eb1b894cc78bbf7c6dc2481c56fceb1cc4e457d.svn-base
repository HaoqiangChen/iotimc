/**
 * 监控权限配置 -- 添加
 *
 * Created by wuk on 2019-07-08
 */
define([
    'app',
    'angularAMD',
    'cssloader!system/vpconfig/add/css/index.css',
    'system/expert/js/directives/exportExcel',
    'system/js/directives/systemRowCheckDirective',
], function(app) {
    app.controller('vpconfigaddController', [
        '$scope',
        '$state',
        'iAjax',
        'iTimeNow',
        '$stateParams',
        'iMessage',
        function($scope, $state, iAjax, iTimeNow, $stateParams,iMessage) {
            $scope.title = 'IMCS视频权限配置';
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
             *  选择按钮  点击赋值给 监控通道
             */
            $scope.emptyclk = function () {
                $scope.entityItem.company = '';
                $scope.entityItem.name = ''
                var nodes = _.where($scope.devicetype.companies, {checked: true});
                for(var i = 0; i < nodes.length; i++) {
                    if ( i == nodes.length -1 ){
                        $scope.entityItem.company += nodes[i]['content']
                        $scope.entityItem.name += nodes[i]['name']
                    } else {
                        $scope.entityItem.company += nodes[i]['content'] + ',';
                        $scope.entityItem.name += nodes[i]['name'] + ',';
                    }
                }
            }
            //  取消返回按钮
            $scope.cancel = function () {
                $state.go('system.vpconfig');
                $scope.entityItem = {};
            };
            /*
            *  取到传过来的值
            */
            if($stateParams.data){
                $scope.entityItem = $stateParams.data;
                console.log($scope.entityItem)
                $scope.entityItem.name = $scope.entityItem.companyname;
            } else {
                $scope.entityItem = {};
            }
            /*
             * 添加修改界面提交按钮
             */
            $scope.save = function() {
                var reg = /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
                if ( !reg.test($scope.entityItem.address)  && $scope.entityItem.address != '*' ){
                    send(3, 'IP地址格式不正确！')
                }
                else {
                    var data = {
                        filter: {
                            syuserfk: $scope.entityItem.syuserfk,
                            content: $scope.entityItem.content,
                            company: $scope.entityItem.company,
                            address: $scope.entityItem.address,
                            type: ($scope.entityItem.id ? 'mod' : 'add'),
                            id: $scope.entityItem.id
                        }
                    };
                    iAjax.post('security/devicemonitor.do?action=dealMonitorTheme', data).then(function(data) {
                        if(data.status == '1') {
                            if($stateParams.data.length >= 1) {
                                send(1, '修改成功！');
                            } else {
                                send(1, '添加成功！');
                            }
                            $state.go('system.vpconfig');
                            $scope.getList();
                        }
                    }, function() {
                        send(4, '网络连接失败！')
                    });
                }
            };
            /*
             *  获取到监控通道
             */
            $scope.devicetype = {
                list: [],
                filter: 'monitor',
                companies: [],
                getData: function() {
                    var url, data;
                    url = '/security/deviceCode.do?action=getDevicecodeType';
                    data = {};
                    iAjax
                        .post(url, data)
                        .then(function (data) {
                            if (data.result && data.result.rows) {
                                data.result.rows.unshift({
                                    content: '',
                                    name: '请选择监控设备',
                                    value: ''
                                });
                                var devicetype = _.find(data.result.rows, {content: 'monitor'});
                                if (devicetype) {
                                    $scope.devicetype.companies = devicetype.child;
                                }
                                if ( $scope.entityItem.name ) {
                                    $.each($scope.entityItem.name.split(','), function(i, o) {
                                        $.each($scope.devicetype.companies, function(j, k) {
                                            if(o == k.name) {
                                                k.checked = true;
                                            }
                                        });
                                    });
                                }
                            }
                        },
                        function (data) {
                        })
                },
            }
            /*
             *  页面加载触发事件
             */
            $scope.$on('vpconfigaddControllerOnEvent', function() {
                $scope.devicetype.getData();
                getUserInfo();
            });
            /*
             *  获取用户列表
             */
            function getUserInfo(filterValue){
                var url,data;
                url = '/sys/web/syuser.do?action=getSyuserAll';
                data = {
                    filter: {
                        searchText: filterValue
                    }
                };
                iAjax
                    .post(url, data)
                    .then(function(data){
                            if(data.result && data.result.rows){
                                $scope.expertget = data.result.rows;
                            }else{
                                $scope.expertget=[];
                            }
                        },
                        function(data){})
            }
        }]);
});