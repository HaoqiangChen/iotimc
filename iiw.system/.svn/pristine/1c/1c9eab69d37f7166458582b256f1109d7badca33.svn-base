/**
 * 系统管理
 * Created by ZCL on 2015-10-21.
 */
define([
    'app',
    'cssloader!system/css/index.css',
    'cssloader!system/css/style.css',
    'cssloader!system/css/dashboard.css',
    'cssloader!system/css/switcher-defult.css',
    'cssloader!system/css/font-awesome-animation.min.css',
    'cssloader!system/css/pageContainer.css',
    'cssloader!system/css/zTreeStyle/zTreeStyle.css',
    'cssloader!system/css/bootstrap.superhero.min.css',
    'cssloader!safe/lib/datetimepicker/jquery.datetimepicker',
    'cssloader!safe/css/font/safeIcon/safeIcon',
    'safe/js/directives/safePicker',
    'system/js/directives/systemSwitcherChooseDirective',
    'system/js/directives/systemSwitcherDialogDirective',
    'system/js/directives/systemLeftMenuClickDirective',
    'system/js/directives/systemRowCheckDirective',
    'system/js/directives/systemMenuBarDirective',
    'system/js/directives/systemInputVerifyDirective',
    'system/js/directives/systemPageClickDirective',
    'system/js/directives/systemTreeViewDirective',
    'system/js/services/mainService',
    'system/lib/jquery.ztree.all',
    'safe/lib/zrender/2.1.0/zrender',
    'safe/lib/datetimepicker/jquery.datetimepicker.full'
], function(app) {
    var packageName = 'iiw.system';
    app.controller('systemController', ['$scope', 'iAjax', '$state', '$filter', 'iTimeNow', 'mainService', 'iMessage', '$location', 'iConfirm', function($scope, iAjax, $state, $filter, iTimeNow, mainService, iMessage, $location, iConfirm) {
        $.datetimepicker.setLocale('zh');

        mainService.moduleName = '后台首页';
        $scope.systemMain = mainService;

        $scope.time = iTimeNow;
        $scope.filePath = $.soa.getWebPath(packageName) + '/';          //设置背景颜色用到
        $scope.showDropdownMenu = false;

        $scope.server = {
            timeUpdating: false,
            s_time: '',
            time: '',
            ntpUpdating: false,
            s_ntp: '',
            ntp: '',
            saveTime: function() {
                var url = 'security/check/check.do?action=setNowDate',
                    data = {
                        filter: {
                            cdate: this.time
                        }
                    };

                this.timeUpdating = true;
                iAjax.post(url, data)
                    .then(function() {
                        $scope.server.s_time = $scope.server.time;
                        $scope.server.timeUpdating = false;
                    }, function() {
                        $scope.server.time = $scope.server.s_time;
                        $scope.server.timeUpdating = false;
                    });
            },
            saveNTP: function() {
                var url = 'security/check/check.do?action=setNtpTime',
                    data = {
                        filter: {
                            ip: this.ntp
                        }
                    };

                this.ntpUpdating = true;
                iAjax.post(url, data).then(function() {
                    $scope.server.ntpUpdating = false;
                }, function() {
                    $scope.server.ntpUpdating = false;
                });
            }
        };

        $scope.menus = [];
        iAjax.post('sys/web/symenu.do?action=getUserMenu', {type: 'backmodule'}).then(function(data) {
            iAjax.post('sys/web/symenu.do?action=getUserMenu', {type: 'sys'}).then(function(data2) {
                _.each(data.result.rows, function(row) {
                    row.child = _.filter(data2.result.rows, {parentid: row.id});
                    if (row.child.length > 0) {
                        row.hasChild = 'true';
                    } else {
                        row.hasChild = 'false';
                    }
                });
                $scope.menus = data.result.rows;
            });
        });

        $scope.logout = function() {
            $location.path('/login');
        };

        $scope.goFrontModule = function() {
            iAjax.post('sys/web/syrole.do?action=getHomePage', {}).then(function(data) {
                if (data.result) {
                    if (data.result.url && data.result.url.indexOf('http://') == -1) {
                        if (!($state && $state.current && data.result.url == 'system')) {
                            $state.go(data.result.url);
                        } else {
                            $state.go('system.homepage');
                        }
                    } else {
                        location = data.result.url;
                    }
                }
            }, function(data) {
                iMessage.show({
                    level: 4,
                    title: '系统连接错误[' + data.status + ']',
                    content: '接口：[syrole.do?action=getHomePage]<br>帮助：请检查网络或服务器是否正常！'
                });
            });
        };

        $scope.gotoSetting = function() {
            var now = $scope.time.now;

            $scope.server.timeUpdating = false;
            $scope.server.ntpUpdating = false;
            $scope.server.s_time = $filter('date')(now, 'yyyy-MM-dd HH:mm:ss');
            $scope.server.time = $filter('date')(now, 'yyyy-MM-dd HH:mm:ss');

            iConfirm.show({
                scope: $scope,
                title: '服务器配置',
                templateUrl: $.soa.getWebPath('iiw.system') + '/view/serversetting.html',
                buttons: []
            });

        };

        $scope.$on('systemControllerOnEvent', function() {
            if ($state && $state.current && $state.current.name == 'system') {
                $state.go('system.homepage');
            }
        });

        //系统信息配置模块为隐藏模块，只能手动切换路由
        //create by dwt on 2016-08-02
        $('body').keydown(function(e) {
            //shift + c
            if (e.altKey && e.keyCode == '67') {
                $state.go('system.syconfig');
            }
        });
    }]);
});