/**
 * 快速回放录像事件文件块显示
 * 功能描述：当监控窗口正在回放时，会在监控窗口底部生成一段段录像文件块
 *
 * Created by dwt on 2016-12-07.
 */
define([
    'app'
], function(app) {
    app.directive('safeReplyTimeFile', [function() {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($scope, $element) {
                        //parent：video-object-reply-timeline
                        var boxw = $element.parent().width(),
                            file = $scope.file,
                            size = file.end - file.start,
                            start = $scope.starttime,
                            end = $scope.endtime,
                            length = end - start;

                        $element
                            .width(size / length * boxw)
                            .css('left', (file.start - start) / length * boxw);
                    }
                }
            }
        }
    }]);
});