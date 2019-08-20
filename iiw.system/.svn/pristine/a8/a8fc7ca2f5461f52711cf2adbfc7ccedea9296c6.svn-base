/**
 * 系统管理首页
 * Created by ZCL on 2016-03-19.
 */
define([
    'app',
    'cssloader!system/homepage/css/index.css',
    'system/lib/echarts-all',
    'system/homepage/js/directives/systemDeviceChartDirective',
    'system/homepage/js/directives/systemJvmCpuChartDirective',
    'system/homepage/js/directives/systemJvmMemoryChartDirective',
    'system/homepage/js/directives/systemJvmPermgenChartDirective',
    'system/homepage/js/directives/systemJvmThreadChartDirective',
    'system/homepage/js/directives/systemServerCpuChartDirective',
    'system/homepage/js/directives/systemDiskformationChartDirective',
    'system/homepage/js/directives/systemServerMemoryChartDirective'
], function(app) {
    app.controller('homePageController', ['$scope', '$state', 'iAjax', 'iTimeNow', 'mainService', 'iMessage', '$interval', function($scope, $state, iAjax, iTimeNow, mainService, iMessage, $interval) {
        mainService.moduleName = '服务器管理';
        $scope.title = '系统信息';
        var cpuInter = null;
        var memoryInter = null;
        var jvmInter = null;
        var diskInter = null;

        /**
         * 模块加载完成事件
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-23
         */
        $scope.$on('homePageControllerOnEvent', function() {
            init();
        });

        $scope.$on('homePageControllerExitEvent', function() {
            cancelTimer();
            $scope.$broadcast('chartHideEvent');
        });

        function cancelTimer() {
            if (cpuInter)$interval.cancel(cpuInter);
            if (memoryInter)$interval.cancel(memoryInter);
            if (jvmInter)$interval.cancel(jvmInter);
            cpuInter = null;
            memoryInter = null;
            jvmInter = null;
            diskInter = null;
        }

        /**
         * 模块初始化
         *
         * @author : zcl
         * @version : 1.0
         * @Date : 2016-03-23
         */
        function init() {
            getCpuInfo();
            getMemoryInfo();
            getJvmInfo();
            getDiskformation();

            $scope.$broadcast('initChartEvent');
        }

        function getCpuInfo() {
            if (cpuInter)$interval.cancel(cpuInter);
            cpuInter = $interval(function() {
                iAjax.post('security/homepage.do?action=getCpuInformation').then(function(data) {
                    if (data.result && data.result.rows) {
                        $scope.cpu = data.result.rows[0];
                        $scope.$broadcast('refreshCpuChart', $scope.cpu);
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, true);
                });
            }, 3000);
        }

        function getMemoryInfo() {
            if (memoryInter)$interval.cancel(memoryInter);
            memoryInter = $interval(function() {
                iAjax.post('security/homepage.do?action=getMemoryInformation').then(function(data) {
                    if (data.result && data.result.rows) {
                        $scope.momory = data.result.rows[0];
                        $scope.$broadcast('refreshMemoryChart', $scope.momory);
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, true);
                });
            }, 3000);
        }

        function getJvmInfo() {
            if (jvmInter)$interval.cancel(jvmInter);
            jvmInter = $interval(function() {
                iAjax.post('system/jmx.do?action=getJmxInfo').then(function(data) {
                    if (data.result && data.result.rows) {
                        $scope.jvmInfo = data.result.rows[0];
                        $scope.$broadcast('refreshJvmChart', $scope.jvmInfo);
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, true);
                });
            }, 3000);
        }

        function getDiskformation () {
            if (diskInter)$interval.cancel(diskInter);
            diskInter = $interval(function() {
                iAjax.post('security/homepage.do?action=getDiskformation').then(function(data) {
                    if (data.result && data.result.rows) {
                        $scope.diskInfo = data.result.rows[0];
                        $scope.$broadcast('refreshDiskformation', $scope.diskInfo);
                    }
                }, function() {
                    var message = {};
                    message.level = 4;
                    message.title = '消息提醒';
                    message.content = '网络连接失败!';
                    iMessage.show(message, true);
                });
            }, 3000);
        }
    }]);
});