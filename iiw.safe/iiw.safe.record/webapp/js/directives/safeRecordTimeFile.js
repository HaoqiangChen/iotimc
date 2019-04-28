/**
 * 查询录像事件文件块显示
 *
 * Created by YJJ on 2015-12-15.
 */
define([
    'app',
    'moment'
], function(app, moment) {
    app.directive('safeRecordTimeFile', [function() {
        return {
            restrict: 'A',
            compile: function() {
                return {
                    post: function($score, $element) {
                        var boxw = $element.parent().width(),
                            file = $score.file,
                            size = file.end - file.start,
                            start = $score.query.starttime,
                            end = $score.query.endtime,
                            length = end - start;

                        $element
                            .width(size / length * boxw)
                            .css('left', (file.start - start) / length * boxw)
                            .attr('title', moment(file.start).format('HH:mm:ss') + ' - ' + moment(file.end).format('HH:mm:ss'));
                    }
                }
            }
        }
    }]);
});