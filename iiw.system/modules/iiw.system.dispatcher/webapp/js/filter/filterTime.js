/**
 * Created by llx on 2016/12/29.
 */


define(['app'],
    function(app) {
        app.filter('filterTime', [
            function() {
                return function(time) {
                    var item = [];
                    for (var i = 0; i < time.length; i++) {
                        item = (item + time[i] + '、');
                    }
                    if (item.length > 0) {
                        item = item.substring(0, item.length - 1)
                    }
                    return item;
                }
            }
        ])
    });