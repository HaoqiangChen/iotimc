/**
 * Created by YJJ on 2016-07-05.
 *
 * 设备控制中心注入主主框架功能：
 * 1、监听对讲设备，监听呼叫、监听和来电事件，并弹出消息框；
 * 2、各硬件客户端（虚拟终端）初始化及注入事件；
 *
 */
define([
    'app',
    'safe/hardware/js/services/safeHardwareTalkListener',
    'safe/hardware/js/services/safeDispatcher',
    'safe/hardware/js/services/safeVoip',
    'safe/hardware/js/services/safeIpnbsvtd',
    'safe/hardware/js/services/safeAVN2000Talk',
    'safe/hardware/js/services/safeItcipcast',
    'safe/hardware/js/services/safeLbipintercom',
    'safe/hardware/js/services/safeLbipintercom2012',
    'safe/hardware/js/services/safeHkDeviceBroad',
    'safe/hardware/js/services/safePrisonTalkOcx',
    'safe/hardware/js/services/safeHxccuapi'
], function(app) {
    app.controller('safeHardwarePluginsController', ['$scope', 'safeHardwareTalkListener', 'safeDispatcher', 'safeVoip', 'safeIpnbsvtd', 'safeAVN2000Talk', 'safeItcipcast', 'safeLbipintercom', 'safeLbipintercom2012','safeHkDeviceBroad', 'safePrisonTalkOcx', 'safeHxccuapi',
        function($scope, safeHardwareTalkListener, safeDispatcher, safeVoip, safeIpnbsvtd, safeAVN2000Talk, safeItcipcast, safeLbipintercom, safeLbipintercom2012, safeHkDeviceBroad, safePrisonTalkOcx, safeHxccuapi) {

        // 1、对讲监听设备事件监听服务；
            //safeHardwareTalkListener.init($scope);

        // 2、初始化VOIP（LinPhone）；
            //safeVoip.init($scope);

        // 3、初始化世邦虚拟终端；
            // safeIpnbsvtd.init($scope);

        // 4、初始化调度机客户端控件；
            // safeDispatcher.init();

        // 5、艾威对讲客户端控件
            // safeAVN2000Talk.init($scope);

        // 6、ITC虚拟终端
            // safeItcipcast.init($scope);

        // 7、来邦虚拟终端（省局扩展版，暂不使用）
        //safeLbipintercom.init($scope);

        // 8、来邦虚拟终端（2012版）
            // safeLbipintercom2012.init($scope);

        //9、海康设备广播
            //safeHkDeviceBroad.init($scope);

        //10、奥智利对讲
            //safePrisonTalkOcx.init($scope);

        //11、惠讯多媒体对讲
        safeHxccuapi.init($scope);

        $scope.$on('safeMainKeydownSpaceEvent', function(){
            safeLbipintercom2012.starttalking();
        });

        $scope.$on('safeMainKeyupSpaceEvent', function(){
            safeLbipintercom2012.stoptalked();
        });

        window.addEventListener('beforeunload', function() {
            safeVoip.unload();
            safeIpnbsvtd.unload();
            safeDispatcher.logout();
            safeAVN2000Talk.unload();
            safeItcipcast.unload();
            safeLbipintercom.unload();
            safeHkDeviceBroad.unload();
        });
    }]);

    return 'safeHardwarePluginsController';
});