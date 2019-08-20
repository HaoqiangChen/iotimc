/**
 * 查看图片
 *
 * Created by ybw on 2017/8/21 0021.
 */
define([
    'app',
    'cssloader!safe/lib//jquery-viewer/0.5.0/viewer.min',
    'safe/lib/jquery-viewer/0.5.0/viewer.min'
], function(app) {
    app.directive('safeViewer', [function() {
        return {
            restrict: 'A',
            scope: {
                showCb: '=viewerShow',
                hideCb: '=viewerHide'
            },
            link: function(s, e) {
                var interval = setInterval(function() {
                    if($(e).find('img').length) {
                        clearInterval(interval);
                        new Viewer(e[0], {
                            url: 'data-original',

                            show: function() {
                                if(s.showCb) {
                                    s.showCb();
                                }
                            },

                            hidden: function() {
                                if(s.hideCb) {
                                    s.hideCb();
                                }
                            }
                        });
                    }
                }, 200);
            }
        };
    }]);
});
