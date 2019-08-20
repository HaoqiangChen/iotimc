/**
 * 格式化时间（秒）
 *
 * @author : dwt
 * @version : 1.0
 * @Date : 2016-11-30
 */
define(['app'], function(app) {
    app.filter('safeTimeSecondFormat', function() {
        return function(second) {

            second = second ? parseInt(second) : 0;
            return format(second);

            function format(second) {
                var h, m, s;

                s = second % 60;
                m = Math.floor(second / 60);
                h = Math.floor(m / 60);

                m %= 60;

                s = ('' + s).length == 1 ? '0' + s : s;
                m = ('' + m).length == 1 ? '0' + m : m;
                h = ('' + h).length == 1 ? '0' + h : h;

                return (h + ':' + m + ':' + s);
            }
        }
    });
});