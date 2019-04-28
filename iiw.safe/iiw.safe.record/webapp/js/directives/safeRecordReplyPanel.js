/**
 * 本地回放指令
 *
 * @author : dwt
 * @date : 2016-12-01
 * @version : 0.1
 */
define([
    'app',
    'cssloader!safe/record/css/reply'
], function(app) {
    app.directive('safeRecordReplyPanel', [
        function() {

            function getTemplate(url) {
                var result = '';

                $.ajax({
                    url: url,
                    async: false,
                    cache: false,
                    dataType: 'text'
                }).success(function(data) {
                    result = data;
                });

                return result;
            }

            return {
                restrict: 'E',
                scope: true,
                template: getTemplate($.soa.getWebPath('iiw.safe.record') + '/view/localreply.html'),
                replace: true,
                compile: function() {
                    return {
                        post: function(scope, element) {

                            var isFullScreen = false;

                            scope.$on('localReply.show', function(e, data) {
                                $('.safe-record-reply-panel').show('fade', function() {
                                    element.find('.safe-record-local-reply > video').get(0).src = data.path;
                                    element.find('.safe-record-local-reply-title').text(data.name || '');
                                });
                            });

                            scope.fullscreenVideo = function() {
                                var video = element.find('.safe-record-local-reply > video').get(0);

                                if(!isFullScreen) {
                                    if(video.requestFullscreen) {
                                        video.requestFullscreen();
                                    }else if(video.mozRequestFullScreen) {
                                        video.mozRequestFullScreen();
                                    }else if(video.msRequestFullscreen) {
                                        video.msRequestFullscreen();
                                    }else if(video.webkitRequestFullscreen) {
                                        video.webkitRequestFullScreen();
                                    }
                                    isFullScreen = true;
                                }else {
                                    if(video.exitFullscreen) {
                                        video.exitFullscreen();
                                    }else if(video.msExitFullscreen) {
                                        video.msExitFullscreen();
                                    }else if(video.mozCancelFullScreen) {
                                        video.mozCancelFullScreen();
                                    }else if(video.webkitExitFullscreen) {
                                        video.webkitExitFullscreen();
                                    }
                                    isFullScreen = false;
                                }
                            };

                            scope.outVideoPanel = function() {
                                element.find('.safe-record-local-reply-title').css('opacity', 0);
                            };

                            scope.overVideoPanel = function() {
                                element.find('.safe-record-local-reply-title').css('opacity', 1);
                            };

                            scope.close = function() {
                                var video = element.find('.safe-record-local-reply > video').get(0);

                                URL.revokeObjectURL(video.src);
                                video.src = '';
                                $('.safe-record-reply-panel').hide();
                            };

                        }
                    }
                }
            }
        }
    ]);
});