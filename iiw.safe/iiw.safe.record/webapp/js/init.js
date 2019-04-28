/**
 * Created by DWT on 2016-08-29.
 * 
 * 录像中心模块注入主主框架功能：
 * 1、监听录像下载事件，当有下载任务时，显示下载悬浮框；
 * 2、初始化下载悬浮框界面；
 * 
 */
define([
    'app',
    'safe/record/js/directives/safeRecordDownloadPanel',
    'safe/record/js/directives/safeRecordReplyPanel'
], function(app) {
    app.controller('safeRecordPluginsController', ['$scope', '$compile','$location','iConfirm', function($scope, $compile,$location,iConfirm) {

        //录像下载面板
        $('.safe-record-download-panel').remove();
        $('body').append('<div class="safe-record-download-panel"><safe-record-download-panel></safe-record-download-panel></div>');
        $compile($('.safe-record-download-panel').contents())($scope);

        //本地回放面板
        $('.safe-record-reply-panel').remove();
        $('body').append('<div class="safe-record-reply-panel"><safe-record-reply-panel></safe-record-reply-panel></div>');
        $compile($('.safe-record-reply-panel').contents())($scope);





    }]);

    return 'safeRecordPluginsController';
});